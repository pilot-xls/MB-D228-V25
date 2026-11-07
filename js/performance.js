// Importa a função que calcula o torque de take-off
import { computeEngineTorquePercent } from "./torqueTakeoff_CSATH.js";

// Importa a tabela/função de Takeoff Run para flaps UP
import TORR_FLAPSUP from "./torrFlapsUP_CSATH.js";

// Importa a tabela/função de Takeoff Run para flaps 1
import TORR_FLAPS1 from "./torrFlaps1_CSATH.js";

// Importa a tabela/função de Takeoff Distance para flaps UP
import TODR_FLAPSUP from "./todrFlapsUP_CSATH.js";

// Importa a tabela/função de Takeoff Distance para flaps 1
import TODR_FLAPS1 from "./todrFlaps1_CSATH.js";

// Importa a tabela/função de Accelerate-Stop-Distance para flaps UP
import ASDR_FLAPSUP from "./asdrFlapsUP_CSATH.js";

// Importa a tabela/função de Accelerate-Stop-Distance para flaps 1
import ASDR_FLAPS1 from "./asdrFlaps1_CSATH.js";

// Importa a função que devolve as velocidades de take-off
import { getTakeoffData } from "./ToSpeeds.js";

// Importa a função que calcula o limite WAT
import { getWAT, WAT_OK, WAT_COLD_CAP, WAT_OUT_OF_CHART } from "./ToWAT.js";

// Importa a função de MTOW limitada por ASDA para flaps UP
import MTOW_ASDA_FlapsUp from "./mtowASDA_FlapsUp.js";

// Importa a função de MTOW limitada por ASDA para flaps 1
import MTOW_ASDA_Flaps1 from "./mtowASDA_Flaps1.js";

// Importa a função de MTOW limitada por TORA para flaps UP
import MTOW_TORA_FlapsUp from "./mtowTORA_FlapsUp.js";

// Importa a função de MTOW limitada por TORA para flaps 1
import MTOW_TORA_Flaps1 from "./mtowTORA_Flaps1.js";

// Importa a função de MTOW limitada por TODA para flaps UP
import MTOW_TODA_FlapsUp from "./mtowTODA_FlapsUp.js";

// Importa a função de MTOW limitada por TODA para flaps 1
import MTOW_TODA_Flaps1 from "./mtowTODA_Flaps1.js";

// Verificação do 2º/3º/4º segmento e procura do MTOW: o mesmo código para o TOW introduzido e para o MTOW
import { renderPerformanceDiagrams, clearPerformanceDiagrams } from "./performanceDiagram.js";
import { evaluateSegments, findMaxTowAllSegments, getTodrForWeight, OUT_OF_CHART_TEXT, SEGMENT_KEYS } from "./cgMTOWSearch.js";

// Continuam disponíveis a partir de performance.js (usados nos testes)
export { describeThirdSegment, OUT_OF_CHART_TEXT } from "./cgMTOWSearch.js";

/**
 * Logs de debug da página Performance (desligados por defeito).
 * Para ligar, na consola do browser: localStorage.setItem("perfDebug", "1")
 */
const PERF_DEBUG = (() => {
    try {
        return globalThis.localStorage?.getItem("perfDebug") === "1";
    } catch (e) {
        return false;
    }
})();

function debugLog(...args) {
    if (PERF_DEBUG) console.log(...args);
}

// Guarda em memória os dados dos aeroportos para reutilização na página
let airportData = [];

/**
 * Carrega o ficheiro JSON com a lista de aeroportos/pistas.
 */
async function loadAirportData() {
    // Faz o fetch ao ficheiro JSON com os dados dos aeroportos
    const response = await fetch("data/airportsList.json");

    // Converte a resposta para JSON e guarda em memória
    airportData = await response.json();
}

/**
 * Preenche o dropdown de aeroportos com ICAOs únicos.
 */
async function populateAirportSelect() {
    // Garante que os dados dos aeroportos estão carregados
    await loadAirportData();

    // Vai buscar o select de aeroportos ao HTML
    const airportSelect = document.getElementById("airport");

    // Se o select não existir, termina a função
    if (!airportSelect) return;

    // Cria uma lista de ICAOs sem duplicados
    const uniqueICAOs = [...new Set(airportData.map(a => a.icao))];

    // Para cada ICAO cria uma option no select
    uniqueICAOs.forEach(icao => {
        // Cria um novo elemento option
        const option = document.createElement("option");

        // Define o value da option
        option.value = icao;

        // Define o texto visível da option
        option.textContent = icao;

        // Adiciona a option ao select
        airportSelect.appendChild(option);
    });
}

/**
 * Verifica se todos os campos obrigatórios estão preenchidos.
 */
function canCalculate() {
    // Lê o valor do aeroporto selecionado
    const airport = document.getElementById("airport").value;

    // Lê o valor da pista selecionada
    const runway = document.getElementById("runway").value;

    // Lê o valor do vento
    const wind = document.getElementById("wind").value.trim();

    // Lê a condição da pista
    const surface = document.getElementById("surface").value;

    // Lê a temperatura exterior
    const oat = document.getElementById("oat").value.trim();

    // Lê o QNH
    const qnh = document.getElementById("qnh").value.trim();

    // Lê o peso de descolagem
    const tow = document.getElementById("tow").value.trim();

    // Lê a posição dos flaps
    const flaps = document.getElementById("flaps").value;

    // Lê o estado dos inlets
    const inlets = document.getElementById("inlets").value;

    // Junta todos os campos obrigatórios numa lista
    const required = [airport, runway, wind, surface, oat, qnh, tow, flaps, inlets];

    // Devolve true apenas se nenhum campo estiver vazio, null ou undefined
    return required.every(v => v !== "" && v !== null && v !== undefined);
}

// Limites aceites para o QNH (hPa)
export const QNH_MIN = 900;
export const QNH_MAX = 1100;

/**
 * Converte o texto do campo QNH para número.
 * Aceita um único separador decimal ("." ou ","), ex.: "1003.25" ou "1003,25".
 * Devolve null se o texto for inválido ou estiver fora de [QNH_MIN, QNH_MAX].
 */
export function parseQnh(raw) {
    // Normaliza o texto recebido
    const text = String(raw ?? "").trim();

    // Só dígitos, com no máximo um separador decimal
    if (!/^\d+([.,]\d*)?$/.test(text)) return null;

    // Converte usando "." como separador decimal
    const value = parseFloat(text.replace(",", "."));

    // Valida o intervalo
    if (!Number.isFinite(value) || value < QNH_MIN || value > QNH_MAX) return null;

    return value;
}

/**
 * Calcula a Pressure Altitude a partir do QNH e da pista selecionada.
 * Usa a elevação da pista selecionada (dados já carregados em airportData),
 * em vez da primeira entrada do aeroporto no JSON.
 */
export function getPressureAltitude(qnh, runwayEntry) {
    // Sem dados da pista não é possível calcular
    if (!runwayEntry) {
        throw new Error("Runway has no data in airportsList.json.");
    }

    // Elevação da pista em pés (aceita número ou string numérica; vazio/null é inválido)
    const rawElevation = runwayEntry.elevation;
    const elevation = (rawElevation === null || rawElevation === undefined || String(rawElevation).trim() === "")
        ? NaN
        : Number(rawElevation);

    if (!Number.isFinite(elevation)) {
        throw new Error(`Invalid elevation for ${runwayEntry.icao} ${runwayEntry.rwy} in airportsList.json.`);
    }

    // O QNH tem de ser um número válido (ver parseQnh)
    if (!Number.isFinite(qnh)) {
        throw new Error("Invalid QNH.");
    }

    // Calcula a Pressure Altitude
    const pressureAltitude = elevation + (1013 - qnh) * 27;

    // Devolve o valor arredondado (nunca menor do zero)
    return Math.max(0, Math.round(pressureAltitude));
}

// Fatores que podem limitar o MTOW e o código correspondente na folha de performance
// (10 = WAT, 3 = comprimento de pista, 2 = 2º segmento, 4 = obstáculos 3º/4º seg, 7 = peso máximo do avião)
export const MTOW_LIMITS = {
    WAT: { label: "WAT", code: 10 },
    ASDA: { label: "ASDA", code: 3 },
    TORA: { label: "TORA", code: 3 },
    TODA: { label: "TODA", code: 3 },
    SEG2: { label: "2nd seg", code: 2 },
    SEG3: { label: "3rd seg", code: 4 },
    SEG4: { label: "4th seg", code: 4 },
    STRUCT: { label: "aircraft max weight", code: 7 },
    // Só acontece se o peso máximo do avião ultrapassar a gama dos gráficos (6500 kg)
    CHART: { label: "chart weight range", code: null }
};

// Limites que não dependem da verificação dos segmentos (a ordem serve de desempate)
export const DIRECT_LIMIT_KEYS = ["WAT", "ASDA", "TORA", "TODA", "STRUCT"];

function limitLabels(keys) {
    return keys.map(k => (MTOW_LIMITS[k] ? MTOW_LIMITS[k].label : k)).join(", ");
}

/**
 * MTOW final e fator que o limita (fluxograma do AFM: o menor de todos os limites).
 *
 * limits: { WAT, ASDA, TORA, TODA, STRUCT } em kg (null/0/NaN = não calculável)
 * problems: { KEY: { outOfChart, reason } } com o motivo de cada limite não calculável
 * searchSegments(cap): maior peso <= cap que cumpre o 2º/3º/4º segmento (findMaxTowAllSegments)
 *
 * Devolve { mtow, limitKey, limit, failedKeys, outOfChart, reason }. mtow null = MTOW não determinado.
 */
export function computeMtow({ limits, problems = {}, searchSegments }) {
    // Algum limite direto não calculável: não há MTOW
    const invalid = DIRECT_LIMIT_KEYS.filter(k => !(Number(limits[k]) > 0));
    if (invalid.length > 0) {
        // Agrupa os limites com o mesmo motivo (ex.: "ASDA, TORA, TODA: no chart result")
        const byReason = new Map();
        for (const k of invalid) {
            const reason = problems[k] ? problems[k].reason : "not computed";
            byReason.set(reason, [...(byReason.get(reason) || []), k]);
        }
        return {
            mtow: null,
            limitKey: null,
            limit: null,
            failedKeys: invalid,
            outOfChart: invalid.every(k => problems[k] && problems[k].outOfChart),
            reason: [...byReason].map(([reason, keys]) => limitLabels(keys) + ": " + reason).join("; ")
        };
    }

    // Menor dos limites diretos
    let capKey = DIRECT_LIMIT_KEYS[0];
    for (const k of DIRECT_LIMIT_KEYS) {
        if (Number(limits[k]) < Number(limits[capKey])) capKey = k;
    }
    const cap = Math.floor(Number(limits[capKey]));

    // Desce a partir desse peso até um que cumpra os segmentos
    const search = searchSegments(cap);

    if (search.mtow == null) {
        const keys = search.limitedBy;
        return {
            mtow: null,
            limitKey: null,
            limit: null,
            failedKeys: keys,
            outOfChart: keys.length > 0 && keys.every(k => search.atTop && search.atTop[k].state === "ooc"),
            reason: "no weight up to " + cap + " kg meets " + limitLabels(keys)
        };
    }

    // Um segmento obrigou a descer abaixo do menor limite direto
    if (search.mtow < cap) {
        const limitKey = search.limitedBy[0] || "CHART";
        return { mtow: search.mtow, limitKey, limit: MTOW_LIMITS[limitKey], failedKeys: [], outOfChart: false, reason: "" };
    }

    return { mtow: cap, limitKey: capKey, limit: MTOW_LIMITS[capKey], failedKeys: [], outOfChart: false, reason: "" };
}

/**
 * Motivo de um limite MTOW (ASDA/TORA/TODA) sem resultado, a partir do debug do módulo.
 * - Entrada fora do gráfico do AFM: { outOfChart: true, reason: "OAT 45 °C above chart at PA 2547 ft (max 40 °C at 4000 ft)" }
 * - Outro erro (ex.: dados do gráfico): { outOfChart: false, reason: "no chart result (step6: <erro do módulo>)" }
 */
export function describeMtowChartProblem(res) {
    const d = (res && res.debug) || {};
    if (d.outOfChart && d.outOfChart.reason) {
        return { outOfChart: true, reason: d.outOfChart.reason };
    }
    const detail = d.error || d.reason || (res && res.status) || "unknown error";
    return { outOfChart: false, reason: "no chart result (" + (d.failedAtStep ? d.failedAtStep + ": " : "") + detail + ")" };
}

/**
 * Texto do MTOW (ex.: "6016 kg", "failed" ou "out of AFM chart").
 */
export function formatMtow(mtowResult) {
    if (mtowResult.mtow != null) return mtowResult.mtow + " kg";
    return mtowResult.outOfChart ? OUT_OF_CHART_TEXT : "failed";
}

/**
 * Fator limitante mostrado junto ao MTOW (ex.: "(WAT · code 10)").
 * watColdCap: OAT abaixo do gráfico WAT e o WAT fica no peso máximo do avião (code 7),
 * não o valor do gráfico (code 10).
 */
export function formatMtowLimit(mtowResult, watColdCap = false) {
    if (mtowResult.mtow == null) {
        return mtowResult.failedKeys && mtowResult.failedKeys.length > 0 ? "(" + limitLabels(mtowResult.failedKeys) + ")" : "";
    }

    if (mtowResult.limitKey === "WAT" && watColdCap) {
        return "(WAT, cold cap · code " + MTOW_LIMITS.STRUCT.code + ")";
    }

    const { label, code } = mtowResult.limit;
    return "(" + label + (code != null ? " · code " + code : "") + ")";
}

/**
 * Selo global da descolagem.
 * Falha se não houver MTOW, se TOW > MTOW, ou se algum segmento falhar no TOW introduzido.
 * Devolve { state: "ok" | "bad" | "ooc", text, reason }.
 */
export function evaluateTakeoffStatus({ tow, mtowResult, segments }) {
    if (mtowResult.mtow == null) {
        return {
            state: mtowResult.outOfChart ? "ooc" : "bad",
            text: mtowResult.outOfChart ? "Out of AFM chart" : "Failed",
            reason: "MTOW not determined — " + mtowResult.reason
        };
    }

    if (tow > mtowResult.mtow) {
        return { state: "bad", text: "Failed", reason: "TOW above MTOW (limit: " + mtowResult.limit.label + ")" };
    }

    const failed = SEGMENT_KEYS.filter(k => segments[k].state === "bad");
    if (failed.length > 0) {
        return { state: "bad", text: "Failed", reason: "Climb gradient not met: " + limitLabels(failed) };
    }

    const outOfChart = SEGMENT_KEYS.filter(k => segments[k].state === "ooc");
    if (outOfChart.length > 0) {
        return { state: "ooc", text: "Out of AFM chart", reason: limitLabels(outOfChart) + ": " + OUT_OF_CHART_TEXT };
    }

    return { state: "ok", text: "Passed", reason: "" };
}

/**
 * Calcula a componente de vento de frente/cauda para a pista selecionada.
 */
function windComponent(wind, runwayEntry) {
    // Divide a string do vento no formato direção/velocidade
    const [dirStr, speedStr] = wind.split("/");

    // Converte a direção do vento para número inteiro
    const windDir = parseInt(dirStr, 10);

    // Converte a velocidade do vento para número inteiro
    const windSpeed = parseInt(speedStr, 10);

    // Vai buscar o heading da pista
    const runwayHeading = runwayEntry.heading;

    // Calcula a diferença angular absoluta entre o vento e a pista
    let diff = Math.abs(windDir - runwayHeading);

    // Corrige a diferença para ficar sempre entre 0 e 180 graus
    if (diff > 180) diff = 360 - diff;

    // Calcula a componente de vento usando o cosseno do ângulo
    const component = windSpeed * Math.cos(diff * Math.PI / 180);

    //add wind fild info of wind component
    /*
    if (component > 0) {
        document.getElementById("windLabel").textContent = "Wind (degrees/kt) (H+"+ Math.round(component)+ ")";
    } else {
        document.getElementById("windLabel").textContent = "Wind (degrees/kt) (T"+ Math.round(component)+ ")";
    }
    */
    // Devolve a componente arredondada
    return Math.round(component);
}


// Campos de resultado que são limpos no início de cada cálculo
const OUTPUT_IDS = [
    "outMTOW", "outTorque", "outV1", "outVr", "outV2", "outVyse",
    "outTor", "outTakeoffDistance", "outAccelerate-Stop-Distance ",
    "ttCg2", "ttCg3", "ttCg4", "cgText"
];

/**
 * Repõe todos os resultados no estado inicial ("—"), para nunca ficarem valores antigos no ecrã.
 */
function clearPerformanceOutputs() {
    OUTPUT_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = "—";
        el.classList.remove("ok", "bad");
    });

    // Fator limitante do MTOW e motivo do selo ficam vazios
    ["outMTOWLimit", "cgReason"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });

    // Esconde os desenhos (planta/perfil)
    clearPerformanceDiagrams();

    // O badge volta ao estado inicial do HTML
    const badge = document.getElementById("cgBadge");
    if (badge) {
        badge.classList.remove("ok");
        badge.classList.add("bad");
    }
}

// Nome da chave usada no localStorage para guardar os dados do formulário
const PERFORMANCE_FORM_KEY = "performanceFormData";

/**
 * Guarda os valores atuais do formulário no localStorage.
 */
function savePerformanceForm() {
    // Cria um objeto com os valores atuais dos campos
    const formData = {
        airport: document.getElementById("airport")?.value || "",
        runway: document.getElementById("runway")?.value || "",
        wind: document.getElementById("wind")?.value || "",
        surface: document.getElementById("surface")?.value || "",
        oat: document.getElementById("oat")?.value || "",
        qnh: document.getElementById("qnh")?.value || "",
        tow: document.getElementById("tow")?.value || "",
        flaps: document.getElementById("flaps")?.value || "",
        inlets: document.getElementById("inlets")?.value || ""
    };

    // Guarda o objeto convertido em JSON
    localStorage.setItem(PERFORMANCE_FORM_KEY, JSON.stringify(formData));
}

/**
 * Lê os dados guardados no localStorage.
 */
function getSavedPerformanceForm() {
    // Vai buscar o texto JSON guardado
    const raw = localStorage.getItem(PERFORMANCE_FORM_KEY);

    // Se não existir nada guardado, devolve null
    if (!raw) return null;

    try {
        // Converte o JSON novamente para objeto
        return JSON.parse(raw);
    } catch (error) {
        // Se o conteúdo estiver inválido, limpa e devolve null
        localStorage.removeItem(PERFORMANCE_FORM_KEY);
        return null;
    }
}

/**
 * Preenche o select de pistas com base no aeroporto selecionado.
 */
function populateRunwaySelect(selectedICAO) {
    // Vai buscar o select das pistas
    const runwaySelect = document.getElementById("runway");

    // Se não existir, termina
    if (!runwaySelect) return;

    // Repõe a opção inicial
    runwaySelect.innerHTML = '<option value="" disabled selected>— select —</option>';

    // Se não houver aeroporto selecionado, desativa o select e termina
    if (!selectedICAO) {
        runwaySelect.disabled = true;
        return;
    }

    // Ativa o select
    runwaySelect.disabled = false;

    // Filtra as pistas do aeroporto selecionado
    const runways = airportData
        .filter(a => a.icao === selectedICAO)
        .map(a => a.rwy);

    // Remove pistas duplicadas
    const uniqueRunways = [...new Set(runways)];

    // Cria uma option para cada pista
    uniqueRunways.forEach(rwy => {
        // Cria uma nova option
        const option = document.createElement("option");

        // Define o value da pista
        option.value = rwy;

        // Define o texto visível da pista
        option.textContent = rwy;

        // Adiciona a option ao select
        runwaySelect.appendChild(option);
    });
}

/**
 * Atualiza os dados do tooltip da pista selecionada.
 */
function updateRunwayTooltip(icao, rwy) {
    // Procura a entrada correspondente ao aeroporto e pista
    const entry = airportData.find(a => a.icao === icao && a.rwy == rwy);

    // Se não encontrar entrada, repõe os placeholders
    if (!entry) {
        document.getElementById("ttTora").textContent = "—";
        document.getElementById("ttToda").textContent = "—";
        document.getElementById("ttAsda").textContent = "—";
        document.getElementById("ttElev").textContent = "—";
        document.getElementById("ttSlope").textContent = "—";
        return;
    }

    // Preenche os dados da pista no tooltip
    document.getElementById("ttTora").textContent = entry.tora;
    document.getElementById("ttToda").textContent = entry.toda;
    document.getElementById("ttAsda").textContent = entry.asda;
    document.getElementById("ttElev").textContent = entry.elevation;
    document.getElementById("ttSlope").textContent = entry.slope + "%";
}

/**
 * Restaura os dados do formulário guardados no localStorage.
 */
function restorePerformanceForm() {
    // Vai buscar os dados guardados
    const saved = getSavedPerformanceForm();

    // Se não existir nada guardado, termina
    if (!saved) return;

    // Repõe primeiro o aeroporto
    if (saved.airport) {
        document.getElementById("airport").value = saved.airport;
    }

    // Preenche o select das pistas com base no aeroporto restaurado
    populateRunwaySelect(saved.airport);

    // Repõe depois a pista
    if (saved.runway) {
        document.getElementById("runway").value = saved.runway;
    }

    // Atualiza também os dados do tooltip para a pista restaurada
    updateRunwayTooltip(saved.airport, saved.runway);

    // Repõe os restantes campos
    if (saved.wind) document.getElementById("wind").value = saved.wind;
    if (saved.surface) document.getElementById("surface").value = saved.surface;
    if (saved.oat) document.getElementById("oat").value = saved.oat;
    if (saved.qnh) document.getElementById("qnh").value = saved.qnh;
    if (saved.tow) document.getElementById("tow").value = saved.tow;
    if (saved.flaps) document.getElementById("flaps").value = saved.flaps;
    if (saved.inlets) document.getElementById("inlets").value = saved.inlets;
}



/**
 * Arranque da página Performance.
 * Primeiro verifica a aeronave default.
 * Só se a Série for "212" é que o resto da página é inicializado.
 */
document.addEventListener("DOMContentLoaded", async () => {
    // Vai buscar os dados das aeronaves e o ID default guardado nas settings
    const { aircraftData, defaultId } = await ensureSettingsData();

    // Procura o contentor principal da página
    const wrap = document.querySelector(".wrap");

    // Se não existir o contentor principal, termina
    if (!wrap) return;

    // Verifica se existe aeronave default válida
    if (!defaultId || !aircraftData || !aircraftData[defaultId]) {
        // Substitui o conteúdo da página por uma mensagem simples
        const performanceContent = document.getElementById("performance-content");
        const calcBtn = document.getElementById("calc-btn");

        performanceContent.innerHTML = `
<div class="performance-alert">
    <div class="alert-icon">⚠</div>
    <div class="alert-text">
        <h2>Performance unavailable</h2>
        <p>Performance data is not available for the aircraft currently selected.</p>
    </div>
</div>
`;

        if (calcBtn) {
            calcBtn.style.display = "none";
        }
        // Termina para impedir que o resto da página seja carregado
        return;
    }

    // Guarda a aeronave default
    const aircraft = aircraftData[defaultId];

    // Verifica se a série da aeronave é exatamente 212
    if (String(aircraft["Serie"] || "").trim() !== "212") {
        // Substitui o conteúdo da página por uma mensagem simples
        const performanceContent = document.getElementById("performance-content");
        const calcBtn = document.getElementById("calc-btn");

        performanceContent.innerHTML = `
<div class="performance-alert">
    <div class="alert-icon">⚠</div>
    <div class="alert-text">
        <h2>Performance unavailable</h2>
        <p>Performance data is not available for the aircraft currently selected.</p>
    </div>
</div>
`;

        if (calcBtn) {
            calcBtn.style.display = "none";
        }
        // Termina para impedir que o resto da página seja carregado
        return;
    }


    // lê o TOW guardado no localStorage (vindo de btn-perf da route-leg)
    // lê o TOW do localStorage
    const towFromRotas = Number(localStorage.getItem("perfTOW")) || 0;

    // se existir um valor vindo da outra página
    if (towFromRotas > 0) {
        // apaga os dados antigos do formulário guardados
        localStorage.removeItem("performanceFormData");

        // coloca o valor no campo TOW
        document.getElementById("tow").value = towFromRotas;

        // remove a chave temporária
        localStorage.removeItem("perfTOW");

        // guarda imediatamente o novo estado do formulário
        savePerformanceForm();

    }

    // Vai buscar o MTOW estrutural da aeronave selecionada nas settings
    // (é um dos limites do MTOW; se faltar, o MTOW fica "failed" com o motivo)
    const aircraftMTOW = Number(aircraft.MTOW);

    /**
     * Formata o vento no formato 000/00 e valida o mínimo de dígitos.
     */
    document.getElementById("wind").addEventListener("input", function () {
        // Remove tudo o que não sejam números
        let v = this.value.replace(/\D/g, "");

        // Se houver mais de 3 dígitos, insere a barra após os primeiros 3
        if (v.length > 3) {
            this.value = v.slice(0, 3) + "/" + v.slice(3);
        } else {
            // Se ainda não houver velocidade, mostra apenas os dígitos existentes
            this.value = v;
        }

        // Se tiver menos de 4 dígitos numéricos, marca erro visual
        if (v.length < 4) {
            this.classList.add("input-error");
        } else {
            // Se estiver válido, remove a classe de erro
            this.classList.remove("input-error");
        }
    });

    /**
     * Valida o campo OAT, permitindo números e sinal negativo.
     */
    document.getElementById("oat").addEventListener("input", function () {
        // Mantém apenas números e o sinal "-"
        let v = this.value.replace(/[^0-9-]/g, "");

        // Se o "-" não estiver no início, remove todos os sinais "-"
        if (v.indexOf("-") > 0) {
            v = v.replace(/-/g, "");
        }

        // Atualiza o valor do input com a versão limpa
        this.value = v;

        // Extrai apenas os dígitos numéricos
        const digits = v.replace(/\D/g, "");

        // Se não existir pelo menos um dígito, marca erro visual
        if (digits.length < 1) {
            this.classList.add("input-error");
        } else {
            // Se existir pelo menos um dígito, remove a classe de erro
            this.classList.remove("input-error");
        }
    });

    /**
     * Valida o campo QNH: números com um único separador decimal (. ou ,), entre QNH_MIN e QNH_MAX.
     */
    document.getElementById("qnh").addEventListener("input", function () {
        // Mantém apenas números e separadores decimais
        let v = this.value.replace(/[^0-9.,]/g, "");

        // Aceita só o primeiro separador decimal; remove os seguintes
        const sepIndex = v.search(/[.,]/);
        if (sepIndex !== -1) {
            v = v.slice(0, sepIndex + 1) + v.slice(sepIndex + 1).replace(/[.,]/g, "");
        }

        // Atualiza o input com o valor limpo
        this.value = v;

        // Se não for um QNH válido, marca erro visual
        if (parseQnh(v) === null) {
            this.classList.add("input-error");
        } else {
            // Se estiver válido, remove a classe de erro
            this.classList.remove("input-error");
        }
    });

    /**
     * Valida o campo TOW, permitindo só números e exigindo 4 dígitos mínimos.
     */
    document.getElementById("tow").addEventListener("input", function () {
        // Mantém apenas números
        let v = this.value.replace(/\D/g, "");

        // Atualiza o input com o valor limpo
        this.value = v;

        // Se tiver menos de 4 dígitos, marca erro visual
        if (v.length < 4) {
            this.classList.add("input-error");
        } else {
            // Se estiver válido, remove a classe de erro
            this.classList.remove("input-error");
        }
    });

    /**
     * Carrega os aeroportos para o select.
     */
    await populateAirportSelect();

    // Restaura os dados guardados do formulário
    restorePerformanceForm();

    // Lista dos campos que devem ficar guardados
    const fieldIds = ["airport", "runway", "wind", "surface", "oat", "qnh", "tow", "flaps", "inlets"];

    // Adiciona listeners para guardar automaticamente quando o utilizador altera os campos
    fieldIds.forEach(id => {
        // Vai buscar o elemento pelo id
        const el = document.getElementById(id);

        // Se o elemento não existir, passa ao próximo
        if (!el) return;

        // Guarda quando o utilizador escreve
        el.addEventListener("input", savePerformanceForm);

        // Guarda quando o utilizador muda selects
        el.addEventListener("change", savePerformanceForm);
    });


    /**
     * Quando o aeroporto muda, preenche as pistas disponíveis.
     */
    document.getElementById("airport").addEventListener("change", () => {
        // Vai buscar o ICAO selecionado
        const selectedICAO = document.getElementById("airport").value;

        // Preenche o select de pistas para o aeroporto escolhido
        populateRunwaySelect(selectedICAO);

        // Limpa a pista selecionada quando o aeroporto muda
        document.getElementById("runway").value = "";

        // Limpa os dados da pista no tooltip
        updateRunwayTooltip(selectedICAO, "");

        // Guarda o estado atual do formulário
        savePerformanceForm();
    });

    /**
     * Quando a pista muda, preenche os dados do tooltip.
     */
    document.getElementById("runway").addEventListener("change", () => {
        // Vai buscar o ICAO atualmente selecionado
        const icao = document.getElementById("airport").value;

        // Vai buscar a pista atualmente selecionada
        const rwy = document.getElementById("runway").value;

        // Atualiza os dados da pista no tooltip
        updateRunwayTooltip(icao, rwy);
    });

    /**
     * Botão de cálculo da performance.
     * Limpa os resultados antigos e mostra um erro se o cálculo falhar.
     */
    document.getElementById("calc-btn").addEventListener("click", async () => {
        // Limpa os resultados anteriores antes de qualquer cálculo
        clearPerformanceOutputs();

        try {
            await calculatePerformance();
        } catch (error) {
            // Não deixa resultados parciais no ecrã
            clearPerformanceOutputs();
            console.error(error);
            alert("ERROR! \n" + (error && error.message ? error.message : "Unable to compute performance."));
        }
    });

    /**
     * Cálculo da performance (chamado pelo botão Calc).
     */
    async function calculatePerformance() {
        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!canCalculate()) {
            // Mostra mensagem de erro se faltarem campos
            alert("ERROR! \nAll fields are required.");
            return;
        }

        // Vai buscar o aeroporto selecionado
        const airport = document.getElementById("airport").value;

        // Vai buscar a pista selecionada
        const rwy = document.getElementById("runway").value;

        // Procura os dados da pista selecionada
        const runwayEntry = airportData.find(a => a.icao === airport && a.rwy == rwy);

        // Sem dados da pista não há cálculo possível
        if (!runwayEntry) {
            throw new Error(`No data for ${airport} runway ${rwy} in airportsList.json.`);
        }

        // A lista de obstáculos tem de existir (vazia se não houver obstáculos)
        if (!Array.isArray(runwayEntry.obstacles)) {
            throw new Error(`${airport} runway ${rwy}: obstacle list missing in airportsList.json.`);
        }

        // Calcula a componente do vento para a pista
        const wind = windComponent(document.getElementById("wind").value, runwayEntry);

        // Vento inválido (ex.: sem velocidade) não pode entrar nos gráficos
        if (!Number.isFinite(wind)) {
            document.getElementById("wind").classList.add("input-error");
            throw new Error("Invalid wind. Expected format: 270/15.");
        }

        // Lê a condição da pista e converte para maiúsculas
        const surface = document.getElementById("surface").value.toUpperCase();

        // Lê a OAT e converte para número
        const oat = Number(document.getElementById("oat").value);

        // OAT inválida (ex.: só "-") não pode entrar nos gráficos
        if (!Number.isFinite(oat)) {
            document.getElementById("oat").classList.add("input-error");
            throw new Error("Invalid OAT.");
        }

        // Lê o QNH (aceita decimais com "." ou ",")
        const qnh = parseQnh(document.getElementById("qnh").value);

        // QNH inválido: mostra erro em vez de calcular com uma PA errada
        if (qnh === null) {
            document.getElementById("qnh").classList.add("input-error");
            throw new Error(`Invalid QNH. Enter a value between ${QNH_MIN} and ${QNH_MAX} hPa (e.g. 1013 or 1003.25).`);
        }

        // Lê o TOW e converte para número
        const tow = Number(document.getElementById("tow").value);

        // Lê a configuração de flaps
        const flaps = document.getElementById("flaps").value;

        // Lê o estado dos inlets
        const inlet = document.getElementById("inlets").value;

        // Calcula a Pressure Altitude com a elevação da pista selecionada
        const pa = getPressureAltitude(qnh, runwayEntry);

        /**
         * MTOW: limites diretos (WAT, ASDA, TORA, TODA e peso máximo do avião).
         * O MTOW final é decidido no fim, depois de verificados os segmentos.
         */
        const isFlapsUp = flaps === "up";

        // WAT (inlets ON: -250 kg). Fora do gráfico do AFM não há valor.
        // Lado frio: se o ponto mais frio do gráfico já estiver encostado ao peso máximo
        // do avião, o limite passa a ser esse peso máximo (status "cold_cap"), não a borda.
        const wat = getWAT(flaps, pa, oat, aircraftMTOW);
        const mtowWAT = wat.status !== WAT_OUT_OF_CHART ? wat.wat - (inlet === "on" ? 250 : 0) : null;

        // Limite por ASDA
        const mtowASDA = (isFlapsUp ? MTOW_ASDA_FlapsUp : MTOW_ASDA_Flaps1)({ PA: pa, OAT: oat, Wind: wind, runway_conditions: surface, ASDA: runwayEntry.asda });

        // Limite por TORA
        const mtowTORA = (isFlapsUp ? MTOW_TORA_FlapsUp : MTOW_TORA_Flaps1)({ PA: pa, OAT: oat, Wind: wind, slope: runwayEntry.slope, TORA: runwayEntry.tora });

        // Limite por TODA
        const mtowTODA = (isFlapsUp ? MTOW_TODA_FlapsUp : MTOW_TODA_Flaps1)({ PA: pa, OAT: oat, Wind: wind, slope: runwayEntry.slope, TODA: runwayEntry.toda });

        const directLimits = {
            WAT: mtowWAT,
            ASDA: mtowASDA.result,
            TORA: mtowTORA.result,
            TODA: mtowTODA.result,
            STRUCT: aircraftMTOW
        };

        // Motivo de cada limite que não foi possível calcular
        const limitProblems = {};
        if (wat.status === WAT_OUT_OF_CHART) {
            limitProblems.WAT = { outOfChart: true, reason: wat.reason };
        }
        for (const [key, res] of [["ASDA", mtowASDA], ["TORA", mtowTORA], ["TODA", mtowTODA]]) {
            if (!(res.result > 0)) {
                limitProblems[key] = describeMtowChartProblem(res);
                console.warn("MTOW " + key + " sem resultado:", (res.debug && (res.debug.error || res.debug.reason)) || res.status, res.debug);
            }
            // Linhas do gráfico ignoradas por dados inválidos (o resultado continua validado pelo cálculo forward)
            const skipped = res.debug && res.debug.step6 && res.debug.step6.debug && res.debug.step6.debug.skippedRows;
            if (skipped && skipped.length > 0) {
                console.warn("MTOW " + key + ": linhas do gráfico do AFM ignoradas (dados inválidos, ver tests/tools/mtow-data-check.mjs):", skipped);
            }
        }
        if (!(aircraftMTOW > 0)) {
            limitProblems.STRUCT = { outOfChart: false, reason: "aircraft MTOW missing in settings" };
        }

        debugLog("MTOW limites diretos", directLimits, { wat, mtowASDA, mtowTORA, mtowTODA });

        /**
         * Torque for Takeoff
         */
        // Calcula o torque para take-off
        const torqueComputed = computeEngineTorquePercent(oat, pa);

        // Mostra o torque calculado
        document.getElementById("outTorque").textContent = torqueComputed.torque_percent.toFixed(0) + " % ";

        /**
         * Takeoff Speeds
         */
        // Calcula as velocidades de take-off
        const speeds = getTakeoffData(flaps, tow);

        // Mostra a Vr
        document.getElementById("outVr").textContent = speeds.vr;

        // Mostra a V1
        document.getElementById("outV1").textContent = speeds.v1;

        // Mostra a V2
        document.getElementById("outV2").textContent = speeds.v2;

        // Mostra a Vyse
        document.getElementById("outVyse").textContent = speeds.vyse;

        /**
         * Takeoff Run
         */
        // Se os flaps estiverem em UP, calcula o TORR correspondente
        if (flaps === "up") {
            // Calcula o TORR para flaps UP
            const torrflpsupCalculated = TORR_FLAPSUP({
                PA: pa,
                OAT: oat,
                Weight: tow,
                Wind: wind,
                slope: runwayEntry.slope
            });
            debugLog("torrflpsupCalculated ", torrflpsupCalculated);
            // Se falhar, mostra failed
            if (torrflpsupCalculated.status === "failed") {
                document.getElementById("outTor").textContent = " failed ";
            } else {
                // Se resultar, mostra a distância calculada
                document.getElementById("outTor").textContent = torrflpsupCalculated.result.toFixed(0) + " m ";
            }
        } else if (flaps === "1") {
            // Calcula o TORR para flaps 1
            const torrflps1Calculated = TORR_FLAPS1({
                PA: pa,
                OAT: oat,
                Weight: tow,
                Wind: wind,
                slope: runwayEntry.slope
            });
            debugLog("torrflps1Calculated ", torrflps1Calculated);
            // Se falhar, mostra failed
            if (torrflps1Calculated.status === "failed") {
                document.getElementById("outTor").textContent = " failed ";
            } else {
                // Se resultar, mostra a distância calculada
                document.getElementById("outTor").textContent = torrflps1Calculated.result.toFixed(0) + " m ";
            }
        }

        /**
         * Takeoff Distance
         */
        // Se os flaps estiverem em UP, calcula o TODR correspondente
        if (flaps === "up") {
            // Calcula o TODR para flaps UP
            const todrflpsupCalculated = TODR_FLAPSUP({
                PA: pa,
                OAT: oat,
                Weight: tow,
                Wind: wind,
                slope: runwayEntry.slope
            });
            debugLog("todrflpsupCalculated ", todrflpsupCalculated);
            // Se falhar, mostra failed
            if (todrflpsupCalculated.status === "failed") {
                document.getElementById("outTakeoffDistance").textContent = " failed ";
            } else {
                // Se resultar, mostra a distância calculada
                document.getElementById("outTakeoffDistance").textContent = todrflpsupCalculated.result.toFixed(0) + " m ";
            }
        } else if (flaps === "1") {
            // Calcula o TODR para flaps 1
            const todrflps1Calculated = TODR_FLAPS1({
                PA: pa,
                OAT: oat,
                Weight: tow,
                Wind: wind,
                slope: runwayEntry.slope
            });
            debugLog("todrflps1Calculated ", todrflps1Calculated);
            // Se falhar, mostra failed
            if (todrflps1Calculated.status === "failed") {
                document.getElementById("outTakeoffDistance").textContent = " failed ";
            } else {
                // Se resultar, mostra a distância calculada
                document.getElementById("outTakeoffDistance").textContent = todrflps1Calculated.result.toFixed(0) + " m ";
            }
        }

        /**
         * Accelerate-Stop-Distance
         */
        // Se os flaps estiverem em UP, calcula o ASDR correspondente
        if (flaps === "up") {
            // Calcula o ASDR para flaps UP
            const asdflpsupCalculated = ASDR_FLAPSUP({
                PA: pa,
                OAT: oat,
                Weight: tow,
                Wind: wind,
                runway: surface
            });

            // Se falhar, mostra failed
            if (asdflpsupCalculated.status === "failed") {
                document.getElementById("outAccelerate-Stop-Distance ").textContent = " failed ";
            } else {
                // Se resultar, mostra a distância calculada
                document.getElementById("outAccelerate-Stop-Distance ").textContent = asdflpsupCalculated.result.toFixed(0) + " m ";
            }
        } else if (flaps === "1") {
            // Calcula o ASDR para flaps 1
            const asdflps1Calculated = ASDR_FLAPS1({
                PA: pa,
                OAT: oat,
                Weight: tow,
                Wind: wind,
                runway: surface
            });

            // Se falhar, mostra failed
            if (asdflps1Calculated.status === "failed") {
                document.getElementById("outAccelerate-Stop-Distance ").textContent = " failed ";
            } else {
                // Se resultar, mostra a distância calculada
                document.getElementById("outAccelerate-Stop-Distance ").textContent = asdflps1Calculated.result.toFixed(0) + " m ";
            }
        }

        /**
         * Climb gradient: 2º segmento, 3º segmento (distância horizontal) e 4º segmento,
         * para o TOW introduzido. É a mesma função usada na procura do MTOW.
         */
        // Obstáculos do 2º segmento
        // (o gráfico do 2.º segmento vai até 400 ft inclusive; acima disso é o 3.º/4.º segmento)
        const obstacles2Seg = runwayEntry.obstacles.filter(o => o.obstacle_ft <= 400 && o.obstacle_dist < 5000);

        // Obstáculos do 3º/4º segmento (acima de 400 ft e dentro de 2500 m)
        const obstacles34Seg = runwayEntry.obstacles.filter(o => o.obstacle_ft > 400 && o.obstacle_dist < 2500);

        // obstacle_dist é medida a partir do fim da TODA: a distância ao Reference Zero é (TODA - TOD) + obstacle_dist
        const segmentParams = { flaps, pa, oat, inlet, wind, slope: runwayEntry.slope, toda: runwayEntry.toda, obstacles2Seg, obstacles34Seg };

        const segments = evaluateSegments({ ...segmentParams, tow });
        debugLog("Segmentos no TOW", segments);

        // Required / calculado de cada segmento no tooltip
        for (const [key, id] of [["SEG2", "ttCg2"], ["SEG3", "ttCg3"], ["SEG4", "ttCg4"]]) {
            const el = document.getElementById(id);
            el.textContent = segments[key].text;
            el.classList.remove("ok", "bad");
            if (segments[key].state === "ok") el.classList.add("ok");
            if (segments[key].state === "bad" || segments[key].state === "ooc") el.classList.add("bad");
        }

        /**
         * MTOW final: o menor dos limites diretos, descendo até um peso que cumpra os segmentos
         */
        const mtowResult = computeMtow({
            limits: directLimits,
            problems: limitProblems,
            searchSegments: cap => findMaxTowAllSegments(segmentParams, cap)
        });
        debugLog("MTOW", mtowResult);

        document.getElementById("outMTOW").textContent = formatMtow(mtowResult);
        // "cold cap · code 7" só quando o WAT do lado frio fica igual ao peso máximo do avião;
        // abaixo disso (ex.: inlets ON) é um limite do gráfico WAT (code 10)
        const watAtAircraftMax = wat.status === WAT_COLD_CAP && mtowWAT >= aircraftMTOW;
        document.getElementById("outMTOWLimit").textContent = formatMtowLimit(mtowResult, watAtAircraftMax);

        // TOW a vermelho se estiver acima do MTOW (ou se não houver MTOW)
        const towWithinMtow = mtowResult.mtow != null && tow <= mtowResult.mtow;
        document.getElementById("tow").classList.toggle("input-error", !towWithinMtow);

        /**
         * Selo global: MTOW determinado, TOW <= MTOW e climb gradient cumprido no TOW
         */
        const status = evaluateTakeoffStatus({ tow, mtowResult, segments });
        const badge = document.getElementById("cgBadge");
        badge.classList.toggle("ok", status.state === "ok");
        badge.classList.toggle("bad", status.state !== "ok");
        document.getElementById("cgText").textContent = status.text;
        document.getElementById("cgReason").textContent = status.reason;

        // Desenhos: planta (pista + WDI + vento) e perfil lateral (obstáculos + flight path)
        const diagramTodr = segments.todr != null
            ? segments.todr
            : getTodrForWeight({ flaps, pa, oat, tow, wind, slope: runwayEntry.slope });
        renderPerformanceDiagrams({
            runwayEntry,
            windRaw: document.getElementById("wind").value,
            todr: diagramTodr,
            segments
        });
    }

    /**
     * Tooltips do ícone "i": abrem/fecham com toque ou clique (classe "open").
     * Com rato também abrem por hover (CSS). Tocar/clicar fora fecha.
     */
    const infoIcons = document.querySelectorAll(".info");

    // Abre para a direita se não houver espaço à esquerda do ícone
    function placeTooltip(info) {
        const tooltip = info.querySelector(".tooltip");
        const width = tooltip ? tooltip.offsetWidth : 260;
        const rect = info.getBoundingClientRect();
        info.classList.toggle("tooltip-right", rect.right - width < 8);
    }

    function closeAllTooltips(except) {
        infoIcons.forEach(info => {
            if (info !== except) info.classList.remove("open");
        });
    }

    infoIcons.forEach(info => {
        info.addEventListener("mouseenter", () => placeTooltip(info));

        info.addEventListener("click", (event) => {
            // Toques dentro do próprio tooltip não o fecham
            if (event.target.closest(".tooltip")) return;
            closeAllTooltips(info);
            placeTooltip(info);
            info.classList.toggle("open");
        });

        info.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                closeAllTooltips(info);
                placeTooltip(info);
                info.classList.toggle("open");
            } else if (event.key === "Escape") {
                info.classList.remove("open");
            }
        });
    });

    document.addEventListener("pointerdown", (event) => {
        if (!event.target.closest(".info")) closeAllTooltips(null);
    });

    // iOS Safari ignora user-scalable=no: bloqueia o pinch-zoom
    document.addEventListener("gesturestart", (event) => event.preventDefault());
});
