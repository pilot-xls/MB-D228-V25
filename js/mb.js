// ============================================
// mb.js 
// ============================================

let usarMomentoImportado = true;

document.addEventListener("DOMContentLoaded", async () => {
    const { aircraftData, defaultId } = await ensureSettingsData();

    // --- 1. Preenche dados do avião default ---
    if (defaultId && aircraftData[defaultId]) {
        const aircraft = aircraftData[defaultId];
        document.getElementById("ac-selected").innerText = aircraft.matricula || defaultId;
        document.getElementById("basicWeight").innerText = aircraft.BEW || "0";
        updateLoadsheetImage(aircraft);
    }

    // --- 2. Atualiza imagem do envelope conforme série ---
    function updateLoadsheetImage(ac) {
        const imgEl = document.querySelector("#loadsheet-img img");
        if (!imgEl || !ac) return;
        switch (ac.Serie) {
            case "200":
                imgEl.setAttribute("src", "img/serie200.png");
                break;
            case "212":
                if (ac.ID === "CS-ATH") {
                    //CS-ATH TEM UMA FOLHA DE MB DIFERENTE DEVIDO AO ZFW VARIAVEL
                    imgEl.setAttribute("src", "img/serie212.png");
                } else {
                    imgEl.setAttribute("src", "img/serie212-Standard.png");
                }
                break;
            default:
                imgEl.setAttribute("src", "img/serieError.png");
        }
    }

    // --- 3. Restauro automático dos valores guardados ---

    // dados que vem de BOTÃO "MB" DE ROTAS.JS
    const dadosGuardados = JSON.parse(localStorage.getItem("mbLegSelecionada") || "null");

    if (dadosGuardados) {
        if (dadosGuardados.nome) document.getElementById("nomeLeg").innerText = dadosGuardados.nome || "";
        if (dadosGuardados.trafficLoad && typeof dadosGuardados.trafficLoad.total === "number")
            document.getElementById("manualPayload").value = dadosGuardados.trafficLoad.total || 0;

        console.log("verificar momento guardado...");

        const momentoGuardado = Number(dadosGuardados?.trafficLoad?.moment) || 0;
        console.log("dados guardados (momento) =", momentoGuardado);

        if (momentoGuardado > 0) {
            const inputMom = document.getElementById("momentPayloadInput");
            if (inputMom) {
                inputMom.value = momentoGuardado;
            }
            usarMomentoImportado = true;
        } else {
            usarMomentoImportado = false;
        }

        if (typeof dadosGuardados.fuelOB === "number")
            document.getElementById("fuel").value = dadosGuardados.fuelOB || 0;
        if (typeof dadosGuardados.tripFuel === "number")
            document.getElementById("fuelDest").value = dadosGuardados.tripFuel || 0;
        if (typeof dadosGuardados.pilots === "number")
            document.getElementById("pilots").value = dadosGuardados.pilots || 0;
        if (typeof dadosGuardados.fuelTaxi === "number")
            document.getElementById("fuelTaxi").value = dadosGuardados.fuelTaxi || 0;
    }
    // se o input manualPayload for alterado o momento passa a ser calculado
    document.getElementById("manualPayload").addEventListener("input", () => {
        usarMomentoImportado = false; // obriga mb a calcular
    });

    // --- 4. Autosave em todos os inputs ---
    document.querySelectorAll("input").forEach(inp => {
        inp.addEventListener("focus", function () {
            if (typeof this.select === "function" && this.type !== "hidden") {
                this.select();
            }
        });

        inp.addEventListener("input", () => {
            const inputMom = document.getElementById("momentPayloadInput");
            const momentoAtual = Number(inputMom?.value) || 0;

            const atualizado = {
                ...(JSON.parse(localStorage.getItem("mbLegSelecionada") || "null") || {}),
                nome: document.getElementById("nomeLeg").innerText || "",
                trafficLoad: {
                    ...(JSON.parse(localStorage.getItem("mbLegSelecionada") || "null")?.trafficLoad || {}),
                    total: Number(document.getElementById("manualPayload").value) || 0,
                    moment: momentoAtual
                },
                fuelOB: Number(document.getElementById("fuel").value) || 0,
                tripFuel: Number(document.getElementById("fuelDest").value) || 0,
                pilots: Number(document.getElementById("pilots").value) || 0,
                fuelTaxi: Number(document.getElementById("fuelTaxi").value) || 0
            };

            localStorage.setItem("mbLegSelecionada", JSON.stringify(atualizado));
            exec_calculo(); // recalcula imediatamente
        });
    });

    // --- 5. Executa cálculo inicial ---
    exec_calculo();
    initMbPrintButton();
});

function initMbPrintButton() {
    const btn = document.getElementById("btnMbPrint");
    if (!btn) return;

    btn.addEventListener("click", async () => {
        try {
            await exec_calculo();
            localStorage.setItem("mbPrintRequestedAt", String(Date.now()));

            const printUrl = new URL("mb-print.html", window.location.href).toString();
            const newWindow = window.open(printUrl, "_blank", "noopener,noreferrer");

            if (!newWindow) {
                window.location.href = printUrl;
            }
        } catch (error) {
            console.error("Erro ao abrir a página de impressão:", error);
            alert("Não foi possível abrir a página de impressão.");
        }
    });
}

// =====================================================
// Função de formatação numérica
// =====================================================
function formatNumber(num) {
    if (isNaN(num) || !isFinite(num)) return "0.0";
    return num.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}


// =====================================================
// Cálculo da tabela Mass & Balance
// =====================================================
async function exec_calculo() {
    const { aircraftData, defaultId } = await ensureSettingsData();
    if (!defaultId || !aircraftData[defaultId]) return;
    const ac = aircraftData[defaultId];

    // --- Inputs ---
    const pilots = parseFloat(document.getElementById("pilots").value) || 0;
    localStorage.setItem("pilotsKg", pilots);
    const payload = parseFloat(document.getElementById("manualPayload").value) || 0;
    const fuel = parseFloat(document.getElementById("fuel").value) || 0;
    const fuelTaxi = parseFloat(document.getElementById("fuelTaxi").value) || 0;
    localStorage.setItem("fuelTaxiKg", fuelTaxi);
    const fuelDest = parseFloat(document.getElementById("fuelDest").value) || 0;

    // --- Dados do avião ---
    const basicWeight = parseFloat(ac.BEW) || 0;
    const armBEW = parseFloat(ac.armBEW) || 0;
    const armPilots = parseFloat(ac.armPilotos) || 0;
    let armPayload = parseFloat(ac.armPayload) || 0;
    const armFuel = parseFloat(ac.armFuel) || 0;

    // --- Constantes CG ---
    const MAC_ZERO = 7.26;
    const MAC_DIV = 2.042;

    // --- Momentos individuais ---
    const momentBasic = basicWeight * armBEW;
    const momentPilots = pilots * armPilots;
    let momentPayload = 0;

    console.log("usar momento importado? " + usarMomentoImportado);

    const inputMom = document.getElementById("momentPayloadInput");
    const momImportado = Number(inputMom?.value) || 0;

    console.log("usarMomentoImportado =", usarMomentoImportado);
    console.log("payload =", payload);
    console.log("momImportado =", momImportado);

    if (usarMomentoImportado && momImportado > 0) {
        // usa o momento vindo de fora
        momentPayload = momImportado;

        // calcula o ARM real apenas se existir payload
        if (payload > 0) {
            armPayload = momentPayload / payload;
        } else {
            armPayload = parseFloat(ac.armPayload) || 0;
        }
    } else {
        // quando não há momento importado, calcula o momento usando o ARM standard
        momentPayload = payload * armPayload;
    }
    const momentFuel = fuel * armFuel;
    const momentTaxi = fuelTaxi * armFuel;
    const momentDest = fuelDest * armFuel;

    // --- Atualiza células ---
    document.getElementById("basicMoment").innerText = formatNumber(momentBasic);
    document.getElementById("momentPilots").innerText = formatNumber(momentPilots);
    document.getElementById("momentPayload").innerText = formatNumber(momentPayload);
    document.getElementById("momentFuel").innerText = formatNumber(momentFuel);
    document.getElementById("momentTaxi").innerText = formatNumber(momentTaxi);
    document.getElementById("momentDest").innerText = formatNumber(momentDest);

    // --- Pesos ---
    const zfw = basicWeight + pilots + payload;
    const rampWeight = zfw + fuel;
    const tow = rampWeight - fuelTaxi;
    const lw = tow - fuelDest;


    document.getElementById("zfw").innerText = zfw;
    document.getElementById("rampWeight").innerText = rampWeight;
    document.getElementById("takeoffWeight").innerText = tow;
    document.getElementById("landingWeight").innerText = lw;

    // --- Momentos agregados ---
    document.getElementById("momentZfw").innerText = formatNumber(momentBasic + momentPilots + momentPayload);
    document.getElementById("momentRamp").innerText = formatNumber(momentBasic + momentPilots + momentPayload + momentFuel);
    document.getElementById("momentTakeoff").innerText = formatNumber(momentBasic + momentPilots + momentPayload + (fuel - fuelTaxi) * armFuel);
    document.getElementById("momentLanding").innerText = formatNumber(momentBasic + momentPilots + momentPayload + (fuel - fuelTaxi - fuelDest) * armFuel);

    // --- MAC% (seguro contra divisões inválidas) ---
    function macVal(peso, momento) {
        // evita divisões inválidas e valores infinitos
        if (!peso || !isFinite(peso) || !isFinite(momento)) return 0;
        return ((momento / peso - MAC_ZERO) / MAC_DIV) * 100;
    }

    const mZFW = momentBasic + momentPilots + momentPayload;
    const mRamp = momentBasic + momentPilots + momentPayload + momentFuel;
    const mTO = momentBasic + momentPilots + momentPayload + (fuel - fuelTaxi) * armFuel;
    const mLDG = momentBasic + momentPilots + momentPayload + (fuel - fuelTaxi - fuelDest) * armFuel;

    const macZfw = macVal(zfw, mZFW);
    const macRamp = macVal(rampWeight, mRamp);
    const macTakeoff = macVal(tow, mTO);
    const macLanding = macVal(lw, mLDG);

    const toNum = v => Number(String(v ?? "").replace(",", "."));

    const mzfwSettings = toNum(ac.MZFW) || 0;
    const MZFW = mzfwSettings;
    const MTOW = toNum(ac.MTOW) || 0;

    let mzfwInfo = MZFW;
    if (ac.ID === "CS-ATH") {
        // No CS-ATH, a INFO mostra MZFW variável com o TOW e
        // os limites de payload também usam esse MZFW dinâmico.
        mzfwInfo = csath_MZFW_fromTow(tow);
        if (!isFinite(mzfwInfo)) mzfwInfo = MZFW;
    }

    // --- Infos cruzadas Payload/Fuel ---
    const MRW = toNum(ac.MRW) || 0;
    const MLOW = toNum(ac.MLOW) || Infinity;
    const fuelTank = toNum(ac.FuelTank) || Infinity;

    const fuelLimits = [
        { label: "MRW", value: MRW - (basicWeight + pilots + payload) },
        { label: "MTOW", value: MTOW - (basicWeight + pilots + payload) + fuelTaxi },
        { label: "MLW", value: MLOW - (basicWeight + pilots + payload) + fuelTaxi + fuelDest },
        { label: "FUEL TANK", value: fuelTank },
        { label: "ZFW/TOW", value: ac.ID === "CS-ATH" ? csath_maxFuelForZfwLimit(zfw, fuelTaxi) : Infinity }
    ];
    const minFuelLimit = fuelLimits.reduce((min, cur) => cur.value < min.value ? cur : min, fuelLimits[0]);
    const maxFuelKgRaw = minFuelLimit.value;
    const maxFuelKgSafe = Math.max(0, isFinite(maxFuelKgRaw) ? maxFuelKgRaw : 0);
    const maxFuelKg = Math.floor(maxFuelKgSafe);
    const maxFuelLb = maxFuelKg * 2.20462;

    const payloadMZFWLimit = ac.ID === "CS-ATH" ? mzfwInfo : MZFW;
    const payloadMZFWLabel = ac.ID === "CS-ATH" ? "MZFW(TOW)" : "MZFW";

    const payloadLimits = [
        { label: payloadMZFWLabel, value: payloadMZFWLimit - (basicWeight + pilots) },
        { label: "MTOW", value: MTOW - (basicWeight + pilots + fuel - fuelTaxi) },
        { label: "MRW", value: MRW - (basicWeight + pilots + fuel) },
        { label: "MLW", value: MLOW - (basicWeight + pilots + fuel - fuelTaxi - fuelDest) },
        { label: "ZFW/TOW", value: ac.ID === "CS-ATH" ? csath_maxPayloadForZfwLimit(basicWeight, pilots, fuel, fuelTaxi) : Infinity }
    ];
    const minPayloadLimit = payloadLimits.reduce((min, cur) => cur.value < min.value ? cur : min, payloadLimits[0]);
    const maxPayloadKgRaw = minPayloadLimit.value;
    const maxPayloadKgSafe = Math.max(0, isFinite(maxPayloadKgRaw) ? maxPayloadKgRaw : 0);
    const maxPayloadKg = Math.floor(maxPayloadKgSafe);

    // --- Atualiza células INFO ---
    document.getElementById("zfw").closest("tr").querySelector("td:last-child").innerHTML =
        `MAC: ${macZfw.toFixed(1)}%<br>MZFW: ${Math.round(mzfwInfo)} kg`;

    document.getElementById("rampRow").querySelector("td:last-child").innerHTML =
        `MAC: ${macRamp.toFixed(1)}%`;

    document.getElementById("takeoffRow").querySelector("td:last-child").innerHTML =
        `MAC: ${macTakeoff.toFixed(1)}%`;

    document.getElementById("landingRow").querySelector("td:last-child").innerHTML =
        `MAC: ${macLanding.toFixed(1)}%`;

    const payloadInfoCell = document.getElementById("manualPayload").closest("tr").querySelector("td:last-child");
    const payloadLimitSuffix = ac.ID === "CS-ATH" && minPayloadLimit?.label ? ` (${minPayloadLimit.label})` : "";
    payloadInfoCell.innerHTML = `ARM ${isFinite(armPayload) ? armPayload.toFixed(1) : "0.0"}<br>MAX Payload: ${maxPayloadKg} kg${payloadLimitSuffix}`;

    const fuelInfoCell = document.getElementById("fuel").closest("tr").querySelector("td:last-child");
    fuelInfoCell.innerHTML = `ARM ${armFuel.toFixed(3)}<br>MAX Fuel: ${maxFuelKg} kg (${maxFuelLb.toFixed(0)} lb, ${minFuelLimit.label})`;

    // --- Limites ---
    function checkLimit(rowOrCellId, value, limit, label = "", highlight = true) {

        const el = document.getElementById(rowOrCellId);
        if (!el) return; // sai se a célula/linha não existir

        const row = el.tagName === "TR" ? el : el.closest("tr"); // aceita id da linha ou célula
        if (!row) return;
        const infoCell = row.querySelector("td:last-child"); // última coluna (INFO)
        const rowInput = row.querySelector("input");

        row.classList.remove("limit-exceed"); // remove aviso anterior
        if (rowInput) rowInput.classList.remove("limit-input-exceed");

        // arredonda os valores para evitar problemas de casas decimais
        const valueCmp = Math.round(value);
        const limitCmp = Math.round(limit);

        // compara já arredondado
        if (valueCmp > limitCmp) {

            if (highlight) {
                const isFuelRow = rowOrCellId === "fuel";
                row.classList.add("limit-exceed"); // pinta a linha a vermelho
                if (rowInput && !isFuelRow) rowInput.classList.add("limit-input-exceed");
            }

            if (infoCell) {
                infoCell.innerHTML += `<br><span class="info-warning">EXCEDE LIMITE (${limitCmp} ${label})</span>`;
            }
        }
    }
    const zfwLimitForCheck = ac.ID === "CS-ATH" ? mzfwInfo : MZFW;
    checkLimit("fuel", fuel, maxFuelKg, "kg");
    checkLimit("zfw", zfw, parseFloat(zfwLimitForCheck) || Infinity, "kg");
    checkLimit("rampRow", rampWeight, parseFloat(ac.MRW) || Infinity, "kg");
    checkLimit("takeoffRow", tow, parseFloat(MTOW) || Infinity, "kg");
    checkLimit("landingRow", lw, parseFloat(ac.MLOW) || Infinity, "kg");

    // --- Desenho das bolas CG ---
    if (ac.Serie === "200" || ac.Serie === "212") {
        setSerie(ac.Serie);
        desenharPontos([
            { mac: macZfw, peso: zfw, cor: "blue", label: "ZFW" },
            { mac: macTakeoff, peso: tow, cor: "green", label: "TOW" },
            { mac: macLanding, peso: lw, cor: "orange", label: "LDG" }
        ]);
    }
}

function csath_MZFW_fromTow(tow) {
    // Regra CS-ATH:
    // - TOW <= 6200: MZFW = 5590
    // - 6200 < TOW < 6400: interpolação linear até 5400
    // - TOW >= 6400: MZFW = 5400
    if (tow <= 6200) return 5590;
    if (tow >= 6400) return 5400;

    const slope = (5400 - 5590) / (6400 - 6200); // -0.95 kg/kg
    return 5590 + slope * (tow - 6200);
}


function csath_maxFuelForZfwLimit(zfw, fuelTaxi) {
    // Resolve fuel máximo tal que ZFW <= MZFW(TOW), com TOW = ZFW + fuel - fuelTaxi
    // Para TOW <= 6200, MZFW=5590 (sempre satisfaz se zfw<=5590)
    // Entre 6200 e 6400: MZFW=11480-0.95*TOW -> zfw <= 11480-0.95*(zfw+fuel-fuelTaxi)
    // fuel <= (11480 + 0.95*fuelTaxi - 1.95*zfw) / 0.95
    const fuelBoundLinear = (11480 + 0.95 * fuelTaxi - 1.95 * zfw) / 0.95;
    if (!isFinite(fuelBoundLinear)) return 0;
    return Math.max(0, fuelBoundLinear);
}

function csath_maxPayloadForZfwLimit(basicWeight, pilots, fuel, fuelTaxi) {
    // payload máximo tal que ZFW <= MZFW(TOW), com ZFW=basic+pilots+payload e TOW=ZFW+fuel-fuelTaxi
    // Regime limitante (6200..6400):
    // (basic+pilots+payload) <= 11480 - 0.95*(basic+pilots+payload+fuel-fuelTaxi)
    // payload <= (11480 - 1.95*(basic+pilots) - 0.95*fuel + 0.95*fuelTaxi) / 1.95
    const base = basicWeight + pilots;
    const payloadBoundLinear = (11480 - 1.95 * base - 0.95 * fuel + 0.95 * fuelTaxi) / 1.95;
    if (!isFinite(payloadBoundLinear)) return 0;
    return Math.max(0, payloadBoundLinear);
}

// ============================================
// Funções do Envelope 
// ============================================

// --- Limites Série 212
const limites212 = [
    { peso: 7000, xEsq: 33, yEsq: -44, xDir: 356, yDir: -44 },
    { peso: 6800, xEsq: 37, yEsq: -25, xDir: 351, yDir: -25 },
    { peso: 6600, xEsq: 41, yEsq: -7, xDir: 346, yDir: -7 },
    { peso: 6400, xEsq: 46, yEsq: 11, xDir: 341, yDir: 11 },
    { peso: 6200, xEsq: 50, yEsq: 30, xDir: 336, yDir: 30 },
    { peso: 6000, xEsq: 54, yEsq: 48, xDir: 331, yDir: 48 },
    { peso: 5800, xEsq: 59, yEsq: 67, xDir: 326, yDir: 67 },
    { peso: 5600, xEsq: 63, yEsq: 86, xDir: 321, yDir: 86 },
    { peso: 5400, xEsq: 67, yEsq: 104, xDir: 316, yDir: 104 },
    { peso: 5200, xEsq: 71, yEsq: 122, xDir: 311, yDir: 122 },
    { peso: 5000, xEsq: 76, yEsq: 141, xDir: 306, yDir: 141 },
    { peso: 4800, xEsq: 81, yEsq: 160, xDir: 301, yDir: 160 },
    { peso: 4600, xEsq: 85, yEsq: 178, xDir: 296, yDir: 178 },
    { peso: 4400, xEsq: 89, yEsq: 197, xDir: 291, yDir: 197 },
    { peso: 4200, xEsq: 93, yEsq: 215, xDir: 286, yDir: 215 },
    { peso: 4000, xEsq: 98, yEsq: 233, xDir: 281, yDir: 233 },
    { peso: 3800, xEsq: 102, yEsq: 252, xDir: 277, yDir: 252 },
    { peso: 3600, xEsq: 106, yEsq: 271, xDir: 272, yDir: 271 },
    { peso: 3400, xEsq: 111, yEsq: 289, xDir: 268, yDir: 289 },
    { peso: 3200, xEsq: 115, yEsq: 308, xDir: 262, yDir: 308 },
    { peso: 3000, xEsq: 119, yEsq: 326, xDir: 257, yDir: 326 }
];

// --- Limites Série 200
const limites200 = [
    { peso: 7000, xEsq: 31, yEsq: -41, xDir: 348, yDir: -41 },
    { peso: 6800, xEsq: 35, yEsq: -23, xDir: 343, yDir: -23 },
    { peso: 6600, xEsq: 39, yEsq: -5, xDir: 339, yEsq: -4 },
    { peso: 6400, xEsq: 44, yEsq: 13, xDir: 334, yDir: 13 },
    { peso: 6200, xEsq: 48, yEsq: 32, xDir: 328, yDir: 31 },
    { peso: 6000, xEsq: 52, yEsq: 50, xDir: 324, yDir: 50 },
    { peso: 5800, xEsq: 57, yEsq: 68, xDir: 319, yDir: 67 },
    { peso: 5600, xEsq: 61, yEsq: 86, xDir: 314, yDir: 85 },
    { peso: 5400, xEsq: 65, yEsq: 104, xDir: 310, yDir: 104 },
    { peso: 5200, xEsq: 69, yEsq: 122, xDir: 305, yDir: 122 },
    { peso: 5000, xEsq: 74, yEsq: 141, xDir: 300, yDir: 139 },
    { peso: 4800, xEsq: 78, yEsq: 159, xDir: 295, yDir: 159 },
    { peso: 4600, xEsq: 82, yEsq: 177, xDir: 290, yDir: 176 },
    { peso: 4400, xEsq: 86, yEsq: 195, xDir: 285, yDir: 195 },
    { peso: 4200, xEsq: 91, yEsq: 213, xDir: 280, yDir: 212 },
    { peso: 4000, xEsq: 95, yEsq: 231, xDir: 275, yDir: 230 },
    { peso: 3800, xEsq: 99, yEsq: 249, xDir: 271, yDir: 249 },
    { peso: 3600, xEsq: 103, yEsq: 267, xDir: 265, yDir: 266 },
    { peso: 3400, xEsq: 108, yEsq: 285, xDir: 261, yDir: 284 },
    { peso: 3200, xEsq: 112, yEsq: 304, xDir: 255, yDir: 303 },
    { peso: 3000, xEsq: 116, yEsq: 322, xDir: 251, yDir: 321 }
];

let tabelaAtiva = limites212;
function setSerie(serie) {
    if (serie === "212") tabelaAtiva = limites212;
    if (serie === "200") tabelaAtiva = limites200;
}

// --- Interpolação linear ---
function interpola(p1, p2, peso) {
    const t = (peso - p1.peso) / (p2.peso - p1.peso);
    return {
        xEsq: p1.xEsq + t * (p2.xEsq - p1.xEsq),
        yEsq: p1.yEsq + t * (p2.yEsq - p1.yEsq),
        xDir: p1.xDir + t * (p2.xDir - p1.xDir),
        yDir: p1.yDir + t * (p2.yDir - p1.yDir)
    };
}

// --- Encontrar limites ---
function limitesNoPeso(peso) {
    for (let i = 0; i < tabelaAtiva.length - 1; i++) {
        const a = tabelaAtiva[i];
        const b = tabelaAtiva[i + 1];
        if (peso <= a.peso && peso >= b.peso) return interpola(a, b, peso);
    }
    return null;
}

// --- Converter %MAC + peso em coordenadas ---
function toCoords(mac, peso) {
    const ref = limitesNoPeso(peso);
    if (!ref) return { x: 0, y: 0 };
    const macMin = 16, macMax = 42;
    const x = ref.xEsq + ((mac - macMin) / (macMax - macMin)) * (ref.xDir - ref.xEsq);
    const y = ref.yEsq;
    return { x, y };
}

// --- Desenhar pontos e labels ---
function desenharPontos(resultados) {
    const svg = document.getElementById("cg-svg");
    svg.querySelectorAll(".ponto, .label").forEach(el => el.remove());
    resultados.forEach(r => {
        const { x, y } = toCoords(r.mac, r.peso);

        // cria o círculo (bola)
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 5);
        circle.setAttribute("fill", r.cor);
        circle.classList.add("ponto");

        // cria o texto
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("fill", r.cor);
        text.setAttribute("font-size", "12px");
        text.setAttribute("font-weight", "bold");
        text.classList.add("label");
        text.textContent = r.label;

        if (r.label === "LDG") {
            // texto à esquerda da bola
            text.setAttribute("x", x - 8);
            text.setAttribute("y", y + 5);
            text.setAttribute("text-anchor", "end");
            svg.appendChild(text);
            svg.appendChild(circle);

        } else if (r.label === "ZFW") {
            // texto à esquerda embaixo da bola
            text.setAttribute("x", x - 8);
            text.setAttribute("y", y + 15);
            text.setAttribute("text-anchor", "end");
            svg.appendChild(text);
            svg.appendChild(circle);
        } else {
            // texto à direita da bola
            text.setAttribute("x", x + 8);
            text.setAttribute("y", y - 8);
            svg.appendChild(circle);
            svg.appendChild(text);
        }
    });
}





// ============================================
// popup-fuel 
// ============================================

(function () {
    const modalHtml = `
    <dialog id="popupKg" class="modal-popup">
      <form method="dialog" class="modal-form">
        <input id="valorKg"
          type="number"
          inputmode="numeric"
          pattern="[0-9]*"
          step="1"
          placeholder="Valor"
          class="modal-input">
        <div id="errKg" class="modal-error"></div>
        <div class="modal-buttons">
          <button id="btnLbs" type="button" class="modal-btn">Lbs</button>
          <button id="btnKg" type="button" class="modal-btn">Kg</button>
        </div>
      </form>
    </dialog>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('popupKg');
    const $valor = document.getElementById('valorKg');
    const $err = document.getElementById('errKg');
    const LB_TO_KG = 0.45359237;
    let targetInput = null;

    function parseValor() {
        const v = $valor.value.trim().replace(',', '.');
        if (!v) { $err.textContent = 'Insere um número.'; return null; }
        const num = Number(v);
        if (!isFinite(num)) { $err.textContent = 'Valor inválido.'; return null; }
        if (num < 0) { $err.textContent = 'Sem negativos.'; return null; }
        $err.textContent = '';
        return num;
    }

    function enviarKg(kg) {
        if (targetInput) {
            const inteiro = Math.round(kg); // força inteiro
            targetInput.value = inteiro;
            targetInput.dispatchEvent(new Event('input', { bubbles: true }));
            targetInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        modal.close();
    }

    // Ações dos botões
    document.getElementById('btnLbs').onclick = () => {
        const num = parseValor(); if (num == null) return;
        enviarKg(num * LB_TO_KG);
    };
    document.getElementById('btnKg').onclick = () => {
        const num = parseValor(); if (num == null) return;
        enviarKg(num);
    };

    // Correção iOS/Android: permitir toque único com teclado aberto
    const btnLbs = document.getElementById('btnLbs');
    const btnKg = document.getElementById('btnKg');

    function handleTouch(e) {
        if (document.activeElement === $valor) {
            e.preventDefault();          // evita que o toque se “perca”
            const target = e.currentTarget;
            $valor.blur();               // fecha o teclado
            setTimeout(() => target.click(), 100); // dispara clique real
        }
    }
    [btnLbs, btnKg].forEach(btn => {
        btn.addEventListener('touchstart', handleTouch, { passive: false });
    });

    // Guarda e restaura a posição de scroll
    let scrollYBeforeOpen = 0;

    function abrirModal(el) {
        targetInput = el;
        $valor.value = '';
        $err.textContent = '';

        scrollYBeforeOpen = window.scrollY;
        modal.showModal();

        // BLOQUEIA O SCROLL DO FUNDO
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollYBeforeOpen}px`;

        setTimeout(() => $valor.focus(), 50);
    }


    modal.addEventListener('close', () => {
        // DESBLOQUEIA O SCROLL
        document.body.style.position = '';
        document.body.style.top = '';

        window.scrollTo(0, scrollYBeforeOpen);
    });


    // Abre o modal ao tocar num input com classe .popup-fuel
    document.addEventListener('pointerdown', (e) => {
        const el = e.target.closest('.popup-fuel');
        if (!el) return;
        e.preventDefault();
        abrirModal(el);
    });

    // Fecha o popup ao clicar fora
    modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        const clickedOutside =
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom;

        if (clickedOutside) modal.close();
    });
})();
