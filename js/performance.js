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

// Importa a função do gradiente 2º segmento para flaps UP
import Gradient_2segFlapsUp, {
    CLIMB_GRADIENTE_2SEG_FlapsUp_MTOW
} from "./cg2segFlapsUp_CSATH.js";

// Importa a função do gradiente 2º segmento para flaps 1
import Gradient_2segFlaps1, {
    CLIMB_GRADIENTE_2SEG_Flaps1_MTOW
} from "./cg2segFlaps1_CSATH.js";

// Importa a função do 3º segmento para flaps 1
import Gradient_3segFlaps1, {
    ThirdSegmentDistanceFlaps1_MTOW
} from "./cg3segFlaps1_CSATH.js";

// Importa a função do 4º segmento para flaps UP
import Gradient_4segFlapsUp, {
    CLIMB_GRADIENTE_4SEG_FlapsUp_MTOW
} from "./cg4segFlapsUp_CSATH.js";

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

/**
 * Calcula a Pressure Altitude a partir do QNH e do aeroporto.
 */
async function getPressureAltitude(qnh, airportICAO) {
    // Faz o fetch ao ficheiro JSON dos aeroportos
    const response = await fetch("data/airportsList.json");

    // Converte a resposta para JSON
    const airports = await response.json();

    // Procura o aeroporto correspondente ao ICAO recebido
    const airport = airports.find(a => a.icao === airportICAO.toUpperCase());

    // Se não encontrar o aeroporto, lança um erro
    if (!airport) {
        throw new Error("Airport not found in airportsList.json");
    }

    // Vai buscar a elevação do aeroporto em pés
    const elevation = airport.elevation;

    // Calcula a Pressure Altitude
    const pressureAltitude = elevation + (1013 - qnh) * 27;



    // Devolve o valor arredondado (nunca menor do zero)
    return Math.max(0, Math.round(pressureAltitude));
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
     * Valida o campo QNH, permitindo só números e exigindo 3 dígitos mínimos.
     */
    document.getElementById("qnh").addEventListener("input", function () {
        // Mantém apenas números
        let v = this.value.replace(/\D/g, "");

        // Atualiza o input com o valor limpo
        this.value = v;

        // Se tiver menos de 3 dígitos, marca erro visual
        if (v.length < 3 || v.length > 4) {
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

        // Procura a entrada correspondente ao aeroporto e pista
        const entry = airportData.find(a => a.icao === icao && a.rwy == rwy);

        // Se não encontrar entrada, termina
        if (!entry) return;

        // Preenche o TORA no tooltip
        document.getElementById("ttTora").textContent = entry.tora;

        // Preenche o TODA no tooltip
        document.getElementById("ttToda").textContent = entry.toda;

        // Preenche o ASDA no tooltip
        document.getElementById("ttAsda").textContent = entry.asda;

        // Preenche a elevação no tooltip
        document.getElementById("ttElev").textContent = entry.elevation;

        // Preenche o slope no tooltip
        document.getElementById("ttSlope").textContent = entry.slope + "%";
    });

    /**
     * Botão de cálculo da performance.
     */
    document.getElementById("calc-btn").addEventListener("click", async () => {
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

        // Calcula a componente do vento para a pista
        const wind = windComponent(document.getElementById("wind").value, runwayEntry);

        // Lê a condição da pista e converte para maiúsculas
        const surface = document.getElementById("surface").value.toUpperCase();

        // Lê a OAT e converte para número
        const oat = Number(document.getElementById("oat").value);

        // Lê o QNH e converte para número
        const qnh = Number(document.getElementById("qnh").value);

        // Lê o TOW e converte para número
        const tow = Number(document.getElementById("tow").value);

        // Lê a configuração de flaps
        const flaps = document.getElementById("flaps").value;

        // Lê o estado dos inlets
        const inlet = document.getElementById("inlets").value;

        // Calcula a Pressure Altitude
        const pa = await getPressureAltitude(qnh, airport);

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
            /// Se falhar, marca a flag do 2º segmento como falhada
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
            /**CG > CGR entao reduce weight until CG = CGR. then set on element (outMTOW)CLIMB_GRADIENTE_2SEG_FlapsUp_MTOW         */
            const resultCG2 = CLIMB_GRADIENTE_2SEG_FlapsUp_MTOW({
                pressureAltitude: pa,
                oat: oat,
                inlet: inlet,
                gradientRequired: maxGradient_2seg
            });
            // Guarda apenas o maxTow
            mtowCG2 = mtowCG2 = resultCG2?.maxTow ?? mtowCG2;
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
            /**CG > CGR entao reduce weight until CG = CGR. then set on element (outMTOW) */
            const resultCG2 = CLIMB_GRADIENTE_2SEG_Flaps1_MTOW({
                pressureAltitude: pa,
                oat: oat,
                inlet: inlet,
                gradientRequired: maxGradient_2seg
            });
            // Guarda apenas o maxTow
            mtowCG2 = mtowCG2 = resultCG2?.maxTow ?? mtowCG2;
        }

        /**
         * Flight Path to Clear Distant Obstacles - 3º/4º segmento
         */
        // Filtra os obstáculos acima de 400 ft e dentro de 2500 m
        const filtered_34Seg = runwayEntry.obstacles.filter(
            o => o.obstacle_ft > 400 && o.obstacle_dist < 2500
        );

        // Cria uma lista para guardar a análise dos obstáculos do 3º/4º segmento
        const obstacleAnalysis34 = [];

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
        // Calcula a distância percorrida pelo avião no 3º segmento
        const thirdSegment = Gradient_3segFlaps1({
            pressureAltitude: pa,
            oat: oat,
            tow: tow,
            inlet: inlet,
            obstacleDistance: criticalObstacleDistance3Seg
        });
        console.log(thirdSegment);
        // Se o 3º segmento falhar
        if (thirdSegment.status === "FAILED") {
            // Marca a flag do 3º segmento como failed
            cgFailed3Seg = true;

            // Mostra a comparação entre distância ao obstáculo e distância percorrida no 3º segmento
            document.getElementById("ttCg3").textContent =
                criticalObstacleDistance3Seg + "m / " + thirdSegment.distance + "m";

            // Remove a classe de sucesso
            document.getElementById("ttCg3").classList.remove("ok");

            // Adiciona a classe de falha
            document.getElementById("ttCg3").classList.add("bad");

        } else {
            // Marca a flag do 3º segmento como passed
            cgFailed3Seg = false;

            // Mostra a comparação entre distância ao obstáculo e distância percorrida no 3º segmento
            document.getElementById("ttCg3").textContent =
                criticalObstacleDistance3Seg + "m / " + thirdSegment.distance + "m";

            // Remove a classe de falha
            document.getElementById("ttCg3").classList.remove("bad");

            // Adiciona a classe de sucesso
            document.getElementById("ttCg3").classList.add("ok");
        }
        /**CG > CGR entao reduce weight until CG = CGR. then set on element (outMTOW)*/
        let mtowCG3 = mtowLimited;
        const resultCG3 = ThirdSegmentDistanceFlaps1_MTOW({
            pressureAltitude: pa,
            oat: oat,
            inlet: inlet,
            obstacleDistance: criticalObstacleDistance3Seg
        });
        // Guarda apenas o maxTow se não for null
        mtowCG3 = resultCG3?.maxTow ?? mtowCG3;

        /**
         * Net Climb Gradient - Single Engine - 4º Final Segment
         */

        let mtowCG4 = mtowLimited;

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

        /**CG > CGR entao reduce weight until CG = CGR. then set on element (outMTOW)*/
        const resultCG4 = CLIMB_GRADIENTE_4SEG_FlapsUp_MTOW({
            pressureAltitude: pa,
            oat: oat,
            inlet: inlet,
            gradientRequired: requiredGradient4Seg
        });
        // Guarda apenas o maxTow
        mtowCG4 = mtowCG4 = resultCG4?.maxTow ?? mtowCG4;

        /**
         * Resultado geral do climb gradient
         */
        // Guarda se o resultado geral do climb gradient falhou
        const cgOverallFailed = cgFailed2Seg || cgFailed3Seg || cgFailed4Seg;

        // Se qualquer segmento falhou, o resultado geral é Failed
        if (cgOverallFailed) {
            // Remove a classe de sucesso do badge geral
            document.getElementById("cgBadge").classList.remove("ok");

            // Adiciona a classe de falha ao badge geral
            document.getElementById("cgBadge").classList.add("bad");

            // Mostra Failed no texto geral
            document.getElementById("cgText").textContent = "Failed";

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
        const mtowByCG = Math.min(mtowCG2, mtowCG3, mtowCG4);
        
        document.getElementById("outMTOW").textContent = mtowByCG.toFixed(0);

        
        console.log("mtowLimited ", mtowLimited);
        console.log("mtowByCG ", mtowByCG);
        console.log("MTOW ", mtowByCG);

    });

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
