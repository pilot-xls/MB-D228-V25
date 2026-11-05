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
import { getWAT } from "./ToWAT.js";

import Gradient_2segFlapsUp from "./cg2segFlapsUp_CSATH.js";
import Gradient_2segFlaps1 from "./cg2segFlaps1_CSATH.js";
import Gradient_3segFlaps1 from "./cg3segFlaps1_CSATH.js";
import Gradient_4segFlapsUp from "./cg4segFlapsUp_CSATH.js";

// Importa a função que calcula o gradiente requerido do 2º segmento
import Gradient_Required2Seg from "./cgRequired2Seg_CSATH.js";

// Importa a função que calcula o gradiente requerido do 3º/4º segmento
import Gradient_Required34Seg from "./cgRequired34Seg_CSATH.js";

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

import { getMaxTow2Seg, getMaxTow3Seg, getMaxTow4Seg } from "./cgMTOWSearch.js";

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
        throw new Error("Pista sem dados em airportsList.json.");
    }

    // Elevação da pista em pés (aceita número ou string numérica; vazio/null é inválido)
    const rawElevation = runwayEntry.elevation;
    const elevation = (rawElevation === null || rawElevation === undefined || String(rawElevation).trim() === "")
        ? NaN
        : Number(rawElevation);

    if (!Number.isFinite(elevation)) {
        throw new Error(`Elevação inválida para ${runwayEntry.icao} ${runwayEntry.rwy} em airportsList.json.`);
    }

    // O QNH tem de ser um número válido (ver parseQnh)
    if (!Number.isFinite(qnh)) {
        throw new Error("QNH inválido.");
    }

    // Calcula a Pressure Altitude
    const pressureAltitude = elevation + (1013 - qnh) * 27;

    // Devolve o valor arredondado (nunca menor do zero)
    return Math.max(0, Math.round(pressureAltitude));
}

// Texto mostrado quando o gráfico do AFM não cobre as condições
export const OUT_OF_CHART_TEXT = "fora do gráfico do AFM";

/**
 * Traduz o resultado do 3º segmento para a UI.
 * state: "ok" (passed), "bad" (failed), "ooc" (fora do gráfico com obstáculo: não verificável),
 *        "na" (fora do gráfico sem obstáculo: não há comparação a fazer, não conta como falha).
 */
export function describeThirdSegment(result, obstacleDistance, hasObstacle) {
    if (result && result.status === "OUT_OF_CHART") {
        if (!hasObstacle) {
            return { state: "na", text: obstacleDistance + "m / " + OUT_OF_CHART_TEXT };
        }
        return { state: "ooc", text: obstacleDistance + "m / " + OUT_OF_CHART_TEXT };
    }

    const text = obstacleDistance + "m / " + result.distance + "m";

    if (result.status === "PASSED") {
        return { state: "ok", text };
    }

    return { state: "bad", text };
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
    runwaySelect.innerHTML = '<option value="" disabled selected>— seleccionar —</option>';

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
    // Vai ser usado se MTOW calculado for menor que o introduzido
    const aircraftMTOW = aircraft.MTOW;

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
            alert("ERROR! \n" + (error && error.message ? error.message : "Não foi possível calcular a performance."));
        }
    });

    /**
     * Cálculo da performance (chamado pelo botão Calc).
     */
    async function calculatePerformance() {
        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!canCalculate()) {
            // Mostra mensagem de erro se faltarem campos
            alert("ERROR! \nTodos os campos são de preenchimento obrigatório.");
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
            throw new Error(`Sem dados para ${airport} pista ${rwy} em airportsList.json.`);
        }

        // A lista de obstáculos tem de existir (vazia se não houver obstáculos)
        if (!Array.isArray(runwayEntry.obstacles)) {
            throw new Error(`${airport} pista ${rwy}: lista de obstáculos em falta em airportsList.json.`);
        }

        // Calcula a componente do vento para a pista
        const wind = windComponent(document.getElementById("wind").value, runwayEntry);

        // Vento inválido (ex.: sem velocidade) não pode entrar nos gráficos
        if (!Number.isFinite(wind)) {
            document.getElementById("wind").classList.add("input-error");
            throw new Error("Vento inválido. Formato esperado: 270/15.");
        }

        // Lê a condição da pista e converte para maiúsculas
        const surface = document.getElementById("surface").value.toUpperCase();

        // Lê a OAT e converte para número
        const oat = Number(document.getElementById("oat").value);

        // OAT inválida (ex.: só "-") não pode entrar nos gráficos
        if (!Number.isFinite(oat)) {
            document.getElementById("oat").classList.add("input-error");
            throw new Error("OAT inválida.");
        }

        // Lê o QNH (aceita decimais com "." ou ",")
        const qnh = parseQnh(document.getElementById("qnh").value);

        // QNH inválido: mostra erro em vez de calcular com uma PA errada
        if (qnh === null) {
            document.getElementById("qnh").classList.add("input-error");
            throw new Error(`QNH inválido. Introduza um valor entre ${QNH_MIN} e ${QNH_MAX} hPa (ex.: 1013 ou 1003.25).`);
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
         * MTOW
         */
        let mtow = 0;

        // Se os flaps estiverem em UP, usa as tabelas/funções correspondentes
        if (flaps === "up") {
            // Calcula o limite WAT
            let mtowWAT = getWAT("up", pa, oat);
            // Se os inlet ON -250kg
            if (inlet === "on") { mtowWAT = mtowWAT - 250 };
            console.log("mtowWAT ", mtowWAT);
            // Calcula o limite por ASDA
            const mtowASDA = MTOW_ASDA_FlapsUp({ PA: pa, OAT: oat, Wind: wind, runway_conditions: surface, ASDA: runwayEntry.asda });
            console.log("mtowASDA ", mtowASDA);
            // Calcula o limite por TORA
            const mtowTORA = MTOW_TORA_FlapsUp({ PA: pa, OAT: oat, Wind: wind, slope: runwayEntry.slope, TORA: runwayEntry.tora });
            console.log("mtowTORA ", mtowTORA);
            // Calcula o limite por TODA
            const mtowTODA = MTOW_TODA_FlapsUp({ PA: pa, OAT: oat, Wind: wind, slope: runwayEntry.slope, TORA: runwayEntry.toda });
            console.log("mtowTODA ", mtowTODA);
            // Junta todos os limites numa lista
            const limits = [mtowWAT, mtowASDA.result, mtowTORA.result, mtowTODA.result];

            // Verifica se existe algum valor inválido
            const invalid = limits.some(v => !v || !Number.isFinite(v));

            // Se existir um valor inválido, mostra failed
            if (invalid) {
                // Define MTOW como zero por segurança
                mtow = 0;

                // Mostra failed no output
                document.getElementById("outMTOW").textContent = " failed ";

                // Junta os debugs das tabelas/funções
                const debugs = [
                    { nome: "TORA", debug: mtowTORA.debug },
                    { nome: "TODA", debug: mtowTODA.debug },
                    { nome: "ASDA", debug: mtowASDA.debug }
                ];

                // Mostra os debugs na consola
                for (const d of debugs) {
                    console.log(d.nome);
                    console.log(d.debug);
                }
            } else {
                // Escolhe o limite mais restritivo
                mtow = Math.min(...limits);

                // Mostra o MTOW calculado
                document.getElementById("outMTOW").textContent = mtow;
            }
        }

        // Se os flaps estiverem em 1, usa as tabelas/funções correspondentes
        if (flaps === "1") {
            // Calcula o limite WAT
            let mtowWAT = getWAT("1", pa, oat);
console.log("mtowWAT ====== ",mtowWAT);
            // Se os inlet ON -250kg
            if (inlet === "on") { mtowWAT = mtowWAT - 250 };
            console.log("mtowWAT ", mtowWAT);
            // Calcula o limite por ASDA
            const mtowASDA = MTOW_ASDA_Flaps1({ PA: pa, OAT: oat, Wind: wind, runway_conditions: surface, ASDA: runwayEntry.asda });
            console.log("mtowASDA ", mtowASDA);
            // Calcula o limite por TORA
            const mtowTORA = MTOW_TORA_Flaps1({ PA: pa, OAT: oat, Wind: wind, slope: runwayEntry.slope, TORA: runwayEntry.tora });
            console.log("mtowTORA ", mtowTORA);
            // Calcula o limite por TODA
            const mtowTODA = MTOW_TODA_Flaps1({ PA: pa, OAT: oat, Wind: wind, slope: runwayEntry.slope, TORA: runwayEntry.toda });
            console.log("mtowTODA ", mtowTODA);
            // Junta todos os limites numa lista
            const limits = [mtowWAT, mtowASDA.result, mtowTORA.result, mtowTODA.result];


console.log("DEBUG MTOW");
console.log("WAT:", mtowWAT);
console.log("ASDA:", mtowASDA);
console.log("TORA:", mtowTORA);
console.log("TODA:", mtowTODA);

            
            // Verifica se existe algum valor inválido
            const invalid = limits.some(v => !v || !Number.isFinite(v));

            // Se existir um valor inválido, mostra failed
            if (invalid) {
                // Define MTOW como zero por segurança
                mtow = 0;

                // Mostra failed no output
                document.getElementById("outMTOW").textContent = " failed ";

                // Junta os debugs das tabelas/funções
                const debugs = [
                    { nome: "TORA", debug: mtowTORA.debug },
                    { nome: "TODA", debug: mtowTODA.debug },
                    { nome: "ASDA", debug: mtowASDA.debug }
                ];

                // Mostra os debugs na consola
                for (const d of debugs) {
                    console.log(d.nome);
                    console.log(d.debug);
                }
            } else {
                // Escolhe o limite mais restritivo
                mtow = Math.min(...limits);

                // Mostra o MTOW calculado
                document.getElementById("outMTOW").textContent = mtow;
            }
        }

        // Escolhe o limite mais restritivo entre performance e estrutura
        const mtowLimited = Math.min(mtow, aircraftMTOW);

        // Mostra o MTOW final no output (assim evita que mostre um valor mais alto do que do próprio avião)
        document.getElementById("outMTOW").textContent = mtowLimited;

        // Vai buscar o campo TOW do formulário
        const towInput = document.getElementById("tow");

        // Se o TOW introduzido for maior que o limite permitido
        if (tow > mtowLimited) {
            // Marca o campo como erro (fica vermelho)
            towInput.classList.add("input-error");
        } else {
            // Remove o erro se estiver dentro do limite
            towInput.classList.remove("input-error");
        }

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
            console.log("torrflpsupCalculated ", torrflpsupCalculated);
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
            console.log("torrflps1Calculated ", torrflps1Calculated);
            // Se falhar, mostra failed
            if (torrflps1Calculated.status === "failed") {
                document.getElementById("outTor").textContent = " failed ";
                console.log("torrflps1Calculated ", torrflps1Calculated);
            } else {
                // Se resultar, mostra a distância calculada
                document.getElementById("outTor").textContent = torrflps1Calculated.result.toFixed(0) + " m ";
            }
        }

        /**
         * Takeoff Distance
         */
        // Define um valor alto por defeito para referência no cálculo do climb gradient
        let todr = 2500;

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
            console.log("todrflpsupCalculated ", todrflpsupCalculated);
            // Se falhar, mostra failed
            if (todrflpsupCalculated.status === "failed") {
                document.getElementById("outTakeoffDistance").textContent = " failed ";
            } else {
                // Se resultar, mostra a distância calculada
                document.getElementById("outTakeoffDistance").textContent = todrflpsupCalculated.result.toFixed(0) + " m ";

                // Guarda o valor calculado para usar nos obstáculos
                todr = Number(todrflpsupCalculated.result.toFixed(0));
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
            console.log("todrflps1Calculated ", todrflps1Calculated);
            // Se falhar, mostra failed
            if (todrflps1Calculated.status === "failed") {
                document.getElementById("outTakeoffDistance").textContent = " failed ";
            } else {
                // Se resultar, mostra a distância calculada
                document.getElementById("outTakeoffDistance").textContent = todrflps1Calculated.result.toFixed(0) + " m ";

                // Guarda o valor calculado para usar nos obstáculos
                todr = Number(todrflps1Calculated.result.toFixed(0));
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
         * Net Climb Gradient Required to Clear Obstacles - 2º segmento
         */

        // Guarda se o 2º segmento falhou
        let cgFailed2Seg = false;

        // Guarda se o 3º segmento falhou
        let cgFailed3Seg = false;

        // Guarda se o 4º segmento falhou
        let cgFailed4Seg = false;

        // Filtra os obstáculos que pertencem ao 2º segmento
        const filtered_2Seg = runwayEntry.obstacles.filter(o => o.obstacle_ft < 400 && o.obstacle_dist < 5000);

        // Cria uma lista para guardar os gradientes requeridos
        const gradients_2Seg = [];

        // Calcula o gradiente requerido para cada obstáculo do 2º segmento
        for (const obs of filtered_2Seg) {

            // Calcula a distância do obstáculo relativamente ao Reference Zero
            const obstacleDistanceFromREFZERO = obs.obstacle_dist - todr;
            console.log("obstacle_dist ", obs.obstacle_dist, " - ", todr);
            console.log("obsc dist =", obstacleDistanceFromREFZERO);
            // Calcula o gradiente requerido do obstáculo atual
            const gradientRequired2Seg = Gradient_Required2Seg({
                obstacleDistance: obstacleDistanceFromREFZERO,
                wind: wind,
                obstacle_height_ft: obs.obstacle_ft
            });
            console.log("gradientRequired2Seg ", gradientRequired2Seg);
            // Guarda apenas o valor numérico do gradiente requerido
            gradients_2Seg.push(gradientRequired2Seg.result_CG_required);
        }

        // Escolhe o maior gradiente requerido, ou 0 se não houver obstáculos
        const maxGradient_2seg = gradients_2Seg.length > 0 ? Math.max(...gradients_2Seg) : 0;

        /**
         * Net Climb Gradient - Single Engine - Second Segment
         */
        /**
 * Net Climb Gradient - Single Engine - Second Segment
 */
let mtowCG2 = mtowLimited;

// Se os flaps estiverem em UP, calcula o gradiente do 2º segmento para flaps UP
if (flaps === "up") {
    // Calcula o gradiente disponível do 2º segmento
    const gradient2Seg = Gradient_2segFlapsUp({
        pressureAltitude: pa,
        oat: oat,
        tow: tow,
        inlet: inlet,
        gradientRequired: maxGradient_2seg
    });
    console.log(gradient2Seg);

    // Se falhar, marca a flag do 2º segmento como falhada
    if (gradient2Seg.status === "FAILED") {
        // Marca o 2º segmento como failed
        cgFailed2Seg = true;

        // Mostra o detalhe do 2º segmento
        document.getElementById("ttCg2").textContent = maxGradient_2seg + "% / " + gradient2Seg.gradient + "%";

        // Remove a classe de sucesso
        document.getElementById("ttCg2").classList.remove("ok");

        // Adiciona a classe de falha
        document.getElementById("ttCg2").classList.add("bad");
    } else {
        // Marca o 2º segmento como passed
        cgFailed2Seg = false;

        // Mostra o detalhe do 2º segmento
        document.getElementById("ttCg2").textContent = maxGradient_2seg + "% / " + gradient2Seg.gradient + "%";

        // Remove a classe de falha
        document.getElementById("ttCg2").classList.remove("bad");

        // Adiciona a classe de sucesso
        document.getElementById("ttCg2").classList.add("ok");
    }

} else if (flaps === "1") {
    // Calcula o gradiente disponível do 2º segmento para flaps 1
    const gradient2Seg = Gradient_2segFlaps1({
        pressureAltitude: pa,
        oat: oat,
        tow: tow,
        inlet: inlet,
        gradientRequired: maxGradient_2seg
    });
    console.log(gradient2Seg);

    // Se falhar, marca a flag do 2º segmento como falhada
    if (gradient2Seg.status === "FAILED") {
        // Marca o 2º segmento como failed
        cgFailed2Seg = true;

        // Mostra o detalhe do 2º segmento
        document.getElementById("ttCg2").textContent = maxGradient_2seg + "% / " + gradient2Seg.gradient + "%";

        // Remove a classe de sucesso
        document.getElementById("ttCg2").classList.remove("ok");

        // Adiciona a classe de falha
        document.getElementById("ttCg2").classList.add("bad");
    } else {
        // Marca o 2º segmento como passed
        cgFailed2Seg = false;

        // Mostra o detalhe do 2º segmento
        document.getElementById("ttCg2").textContent = maxGradient_2seg + "% / " + gradient2Seg.gradient + "%";

        // Remove a classe de falha
        document.getElementById("ttCg2").classList.remove("bad");

        // Adiciona a classe de sucesso
        document.getElementById("ttCg2").classList.add("ok");
    }
}

// Calcula o MTOW real do 2º segmento, recalculando required e performed para cada peso
// null = nenhum peso cumpre o 2º segmento (é tratado como limitante no fim)
mtowCG2 = getMaxTow2Seg({
    flaps: flaps,
    pa: pa,
    oat: oat,
    inlet: inlet,
    wind: wind,
    slope: runwayEntry.slope,
    obstacles: filtered_2Seg
});
        
        /**
         * Flight Path to Clear Distant Obstacles - 3º/4º segmento
         */
        // Filtra os obstáculos acima de 400 ft e dentro de 2500 m
        const filtered_34Seg = runwayEntry.obstacles.filter(
            o => o.obstacle_ft > 400 && o.obstacle_dist < 2500
        );

        // Cria uma lista para guardar a análise dos obstáculos do 3º/4º segmento
        const obstacleAnalysis34 = [];

        // Obstáculos cujo gradiente requerido não foi possível ler no gráfico do AFM
        const requiredOutOfChart34 = [];

        // Percorre todos os obstáculos filtrados
        for (const obs of filtered_34Seg) {
            // Calcula a distância do obstáculo relativamente ao Reference Zero
            const obstacleDistanceFromREFZERO = obs.obstacle_dist - todr;

            // Calcula o gradiente requerido para esse obstáculo
            const gradientRequired34Seg = Gradient_Required34Seg({
                obstacleDistance: obstacleDistanceFromREFZERO,
                runway_slope: runwayEntry.slope,
                wind: wind,
                obstacle_height: obs.obstacle_ft
            });
            console.log(gradientRequired34Seg);

            // Required a null (distância/slope/vento/altura fora do gráfico, CG > 7%):
            // não pode entrar na comparação como 0. Fica registado e o 3º/4º segmento não passa.
            if (!gradientRequired34Seg || gradientRequired34Seg.result_CG_required == null) {
                requiredOutOfChart34.push({ obstacle: obs, debug: gradientRequired34Seg?.debug });
                console.warn("3º/4º segmento: required fora do gráfico do AFM para o obstáculo", obs, gradientRequired34Seg?.debug);
                continue;
            }

            // Guarda os dados do obstáculo analisado
            obstacleAnalysis34.push({
                // Guarda o gradiente requerido para o 4º segmento
                requiredGradient: gradientRequired34Seg.result_CG_required,

                // Guarda a distância do obstáculo para o 3º segmento
                obstacleDistance: obstacleDistanceFromREFZERO,

                // Guarda o obstáculo completo para debug futuro
                obstacle: obs
            });
        }

        // Inicializa a variável do obstáculo crítico para o 4º segmento
        let criticalObstacle34 = null;

        // Procura o obstáculo com maior gradiente requerido
        for (const item of obstacleAnalysis34) {
            // Se ainda não existir crítico, ou se este tiver gradiente maior, substitui
            if (!criticalObstacle34 || item.requiredGradient > criticalObstacle34.requiredGradient) {
                criticalObstacle34 = item;
            }
        }

        // Guarda o gradiente requerido do obstáculo crítico, ou 0 se não existir
        const requiredGradient4Seg = criticalObstacle34 ? criticalObstacle34.requiredGradient : 0;

        // Guarda a distância do obstáculo crítico, ou 0 se não existir
        const criticalObstacleDistance3Seg = criticalObstacle34 ? criticalObstacle34.obstacleDistance : 0;

        /**
         * Horizontal Distance - Single Engine - Third Segment
         */

/**
 * Horizontal Distance - Single Engine - Third Segment
 */
let mtowCG3 = mtowLimited;

// Guarda se o 3º/4º segmento não pôde ser verificado por estar fora do gráfico do AFM
let cgOutOfChart3Seg = false;
let cgOutOfChart4Seg = false;

// Existe obstáculo do 3º/4º segmento? (sem obstáculo o requisito é 0 m)
const hasObstacle34 = criticalObstacle34 != null || requiredOutOfChart34.length > 0;

const ttCg3 = document.getElementById("ttCg3");

if (requiredOutOfChart34.length > 0) {
    // Required fora do gráfico: não é possível verificar o 3º segmento
    cgOutOfChart3Seg = true;
    ttCg3.textContent = "Req: " + OUT_OF_CHART_TEXT;
    ttCg3.classList.remove("ok");
    ttCg3.classList.add("bad");
} else {
    // Calcula a distância percorrida pelo avião no 3º segmento
    const thirdSegment = Gradient_3segFlaps1({
        pressureAltitude: pa,
        oat: oat,
        tow: tow,
        inlet: inlet,
        obstacleDistance: criticalObstacleDistance3Seg
    });
    console.log(thirdSegment);

    // Traduz o resultado: ok / bad / ooc (fora do gráfico com obstáculo) / na (fora do gráfico sem obstáculo)
    const view3 = describeThirdSegment(thirdSegment, criticalObstacleDistance3Seg, hasObstacle34);

    // Só uma falha real de comparação marca o 3º segmento como failed
    cgFailed3Seg = view3.state === "bad";

    // Fora do gráfico com obstáculo: não verificável (não passa)
    cgOutOfChart3Seg = view3.state === "ooc";

    // Mostra a comparação entre distância ao obstáculo e distância percorrida no 3º segmento
    ttCg3.textContent = view3.text;
    ttCg3.classList.remove("ok", "bad");
    if (view3.state === "ok") ttCg3.classList.add("ok");
    if (view3.state === "bad" || view3.state === "ooc") ttCg3.classList.add("bad");
}

// Calcula o MTOW real do 3º segmento, recalculando a distância crítica para cada peso
// null = nenhum peso cumpre o 3º segmento (é tratado como limitante no fim)
mtowCG3 = getMaxTow3Seg({
    pa: pa,
    oat: oat,
    inlet: inlet,
    wind: wind,
    slope: runwayEntry.slope,
    obstacles: filtered_34Seg
});
        
        /**
         * Net Climb Gradient - Single Engine - 4º Final Segment
         */

        /**
 * Net Climb Gradient - Single Engine - 4º Final Segment
 */
let mtowCG4 = mtowLimited;

if (requiredOutOfChart34.length > 0) {
    // Required fora do gráfico: não é possível verificar o 4º segmento
    cgOutOfChart4Seg = true;
    document.getElementById("ttCg4").textContent = "Req: " + OUT_OF_CHART_TEXT;
    document.getElementById("ttCg4").classList.remove("ok");
    document.getElementById("ttCg4").classList.add("bad");
} else {

// Calcula a performance do 4º segmento
const gradient4Seg = Gradient_4segFlapsUp({
    pressureAltitude: pa,
    oat: oat,
    tow: tow,
    inlet: inlet,
    gradientRequired: requiredGradient4Seg
});
console.log(gradient4Seg);

// Se o 4º segmento falhar
if (gradient4Seg.status === "FAILED") {
    // Marca a flag do 4º segmento como failed
    cgFailed4Seg = true;

    // Mostra o gradiente requerido e o gradiente calculado
    document.getElementById("ttCg4").textContent =
        requiredGradient4Seg + "% / " + gradient4Seg.gradient + "%";

    // Remove a classe de sucesso
    document.getElementById("ttCg4").classList.remove("ok");

    // Adiciona a classe de falha
    document.getElementById("ttCg4").classList.add("bad");

} else {
    // Marca a flag do 4º segmento como passed
    cgFailed4Seg = false;

    // Mostra o gradiente requerido e o gradiente calculado
    document.getElementById("ttCg4").textContent =
        requiredGradient4Seg + "% / " + gradient4Seg.gradient + "%";

    // Remove a classe de falha
    document.getElementById("ttCg4").classList.remove("bad");

    // Adiciona a classe de sucesso
    document.getElementById("ttCg4").classList.add("ok");
}

} // fim do else (required do 3º/4º segmento dentro do gráfico)

// Calcula o MTOW real do 4º segmento, recalculando o required crítico para cada peso
// null = nenhum peso cumpre o 4º segmento (é tratado como limitante no fim)
mtowCG4 = getMaxTow4Seg({
    pa: pa,
    oat: oat,
    inlet: inlet,
    wind: wind,
    slope: runwayEntry.slope,
    obstacles: filtered_34Seg
});


        
        /**
         * Resultado geral do climb gradient
         */
        // Guarda se o resultado geral do climb gradient falhou
        const cgOverallFailed = cgFailed2Seg || cgFailed3Seg || cgFailed4Seg;

        // Guarda se algum segmento com obstáculo ficou fora do gráfico do AFM (não verificável)
        const cgOverallOutOfChart = cgOutOfChart3Seg || cgOutOfChart4Seg;

        // Se qualquer segmento falhou, o resultado geral é Failed
        if (cgOverallFailed) {
            // Remove a classe de sucesso do badge geral
            document.getElementById("cgBadge").classList.remove("ok");

            // Adiciona a classe de falha ao badge geral
            document.getElementById("cgBadge").classList.add("bad");

            // Mostra Failed no texto geral
            document.getElementById("cgText").textContent = "Failed";

        } else if (cgOverallOutOfChart) {
            // Não verificável: não passa, mas mostra o motivo em vez de Failed
            document.getElementById("cgBadge").classList.remove("ok");
            document.getElementById("cgBadge").classList.add("bad");
            document.getElementById("cgText").textContent = "Fora do gráfico do AFM";

        } else {
            // Remove a classe de falha do badge geral
            document.getElementById("cgBadge").classList.remove("bad");

            // Adiciona a classe de sucesso ao badge geral
            document.getElementById("cgBadge").classList.add("ok");

            // Mostra Passed no texto geral
            document.getElementById("cgText").textContent = "Passed";
        }

        console.log("mtowCG2", mtowCG2);
        console.log("mtowCG3", mtowCG3);
        console.log("mtowCG4", mtowCG4);
        // MTOW by CGR

        // Segmentos em que nenhum peso cumpre (null): limitam o MTOW em vez de serem ignorados
        const mtowBySegment = { "2ºSeg": mtowCG2, "3ºSeg": mtowCG3, "4ºSeg": mtowCG4 };
        const segmentsWithoutMtow = Object.keys(mtowBySegment).filter(k => mtowBySegment[k] == null);

        // MTOW por WAT/ASDA/TORA/TODA inválido (0) ou nenhum peso cumpre um segmento: failed
        if (!(mtowLimited > 0) || segmentsWithoutMtow.length > 0) {
            const reason = segmentsWithoutMtow.length > 0 ? "(" + segmentsWithoutMtow.join(", ") + ") " : "";
            document.getElementById("outMTOW").textContent = " failed " + reason;
            console.warn("MTOW failed. mtowLimited:", mtowLimited, "segmentos sem peso válido:", segmentsWithoutMtow);
            return;
        }

        // Calcula o menor valor entre os três MTOW
       const mtowByCG = Math.min(mtowCG2, mtowCG3, mtowCG4);

// O resultado final nunca pode ser maior que o MTOW já limitado
const mtowFinal = Math.min(mtowByCG, mtowLimited);

// Arredonda sempre para baixo
const mtowRounded = Math.floor(mtowFinal);

// Mostra o resultado no elemento HTML
document.getElementById("outMTOW").textContent = mtowRounded;


        console.log("mtowLimited ", mtowLimited);
        console.log("mtowByCG ", mtowByCG);
        console.log("MTOW ", mtowByCG);

    }

    /**
     * Ajusta a direção de abertura dos tooltips quando o rato entra no ícone "i".
     */
    document.querySelectorAll(".info").forEach(info => {
        // Adiciona um listener ao evento mouseenter
        info.addEventListener("mouseenter", () => {
            // Vai buscar a posição do elemento no ecrã
            const rect = info.getBoundingClientRect();

            // Se estiver muito perto da esquerda, força abertura para a direita
            if (rect.left < 150) {
                info.classList.add("tooltip-right");
            } else {
                // Caso contrário remove essa classe
                info.classList.remove("tooltip-right");
            }
        });
    });
});
