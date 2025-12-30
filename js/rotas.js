// =======================================================
// ROTAS.JS
// Gestão de rotas + Mass & Balance + Popup Traffic Load
// Versão reestruturada e comentada
// =======================================================

// -------------------------------------------------------
// 0. CONSTANTES DE STORAGE E LIMITES
// -------------------------------------------------------

const ROTAS_USER_KEY = "rotasUserV1";      // estado de trabalho do utilizador
const AIRCRAFT_ACTIVE_KEY = "aircraftActive";   // avião ativo definido em settings.html

// Limites genéricos (podem ser usados se quiseres acrescentar validações globais)
const LIMITS = {
    maxFuelLb: 0,
    maxTrafficKg: 0
};

// Referências globais simples para o popup (evita passar mil parâmetros)
let gEstadoRotas = null;
let gAircraftAtivo = null;
let gRotasRoot = null;
// "windows." variavel global para poder aceder de outros file .js (se "let" é global dentro deste .js)
window.trafficInputAlvo = null;
window.trafficLegAlvo = null;

// -------------------------------------------------------
// 1. UTILITÁRIOS DE I/O E LOCALSTORAGE
// -------------------------------------------------------

async function loadJSON(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`Falha a carregar ${path}: ${res.status}`);
    }
    return res.json();
}

function lsGet(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function lsSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// -------------------------------------------------------
// 2. MODELOS DE DADOS
// -------------------------------------------------------

function novaLegData() {
    return {
        nome: "",
        minFuel: "",
        fuelOB: "",
        trafficLoad: {
                    // --- UI state (verdade para restaurar classes) ---
                    seats: {},     // ex: { "1A":"man", "1C":"child", "9B":"woman" }
                    seatKg: {},    // ex: { "1A":92, "1C":35, "9B":75 }

                    // --- Totais/derivados ---
                    homens: 0,
                    mulheres: 0,
                    criancas: 0,
                    extra: 0,
                    total: 0,
                    moment: 0,

                    // --- Arms fixos ---
                    r1Arm: 5.43, r2Arm: 6.16, r3Arm: 6.96, r4Arm: 7.72, r5Arm: 8.46,
                    r6Arm: 9.21, r7Arm: 9.96, r8Arm: 10.84, r9Arm: 11.58,

                    // --- (Opcional) derivados por seat em kg (se quiseres manter) ---
                    // Se não precisares destes campos fora do popup, podes remover.
                    /*
                    r1_A: 0, r1_C: 0,
                    r2_A: 0, r2_C: 0,
                    r3_A: 0, r3_C: 0,
                    r4_A: 0, r4_C: 0,
                    r5_A: 0, r5_C: 0,
                    r6_A: 0, r6_C: 0,
                    r7_A: 0, r7_C: 0,
                    r8_B: 0, r8_C: 0,
                    r9_A: 0, r9_B: 0, r9_C: 0,
                    */

                    // --- baggage/cargo ---
                    f_gabArm: 2.560, f_gab: 0,
                    r_gabArm: 13.142, r_gab: 0
        },
        tripFuel: "",
        endurance: "",
        zfw: "",
        rampWeight: "",
        tow: "",
        landingWeight: "",
        landingFuelLb: 0,
        nextSuggestedFuel: "",
        maxFuelInfo: "",
        maxPayloadInfo: "",
        limitColors: {
            zfw: "black",
            ramp: "black",
            tow: "black",
            ldg: "black"
        }
    };
}

function cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// -------------------------------------------------------
// 3. ESTADO INICIAL (ROTAS DO UTILIZADOR + AVIÃO ATIVO)
// -------------------------------------------------------

async function ensureUserRotasState() {
    // 1) Tenta ler o estado do utilizador
    let rotasUser = lsGet(ROTAS_USER_KEY);

    if (rotasUser && Array.isArray(rotasUser.rotas)) {
        // Garante que todas as rotas têm ID
        rotasUser.rotas.forEach(r => {
            if (!r.id) {
                r.id = crypto.randomUUID();
            }
        });
        lsSet(ROTAS_USER_KEY, rotasUser);
        return rotasUser;
    }

    // 2) Se não existir, carrega defaults de data/rotas.json
    const defaults = await loadJSON("data/rotas.json");
    const sane = {
        rotas: (Array.isArray(defaults?.rotas) ? defaults.rotas : []).map(r => ({
            ...r,
            id: r.id || crypto.randomUUID()
        }))
    };

    lsSet(ROTAS_USER_KEY, sane);
    return sane;
}

// Versão síncrona usada noutros pontos (se precisares)
function getAircraftActiveSync() {
    const aircraft = lsGet(AIRCRAFT_ACTIVE_KEY);
    return aircraft || null;
}

async function getAircraftActive() {
    const activeId = lsGet(AIRCRAFT_ACTIVE_KEY) || localStorage.getItem("defaultAircraft");
    const data = await loadJSON("data/aircraft.json");

    // Estrutura do tipo: { default, aircraft: { ... } }
    if (data && data.aircraft && !Array.isArray(data.aircraft)) {
        if (activeId && data.aircraft[activeId]) {
            return data.aircraft[activeId];
        }
        if (data.default && data.aircraft[data.default]) {
            return data.aircraft[data.default];
        }
        const firstKey = Object.keys(data.aircraft)[0];
        return data.aircraft[firstKey] || null;
    }

    // Estrutura em array simples
    if (Array.isArray(data)) {
        if (activeId) {
            const found = data.find(a => a.ID === activeId);
            if (found) return found;
        }
        return data[0] || null;
    }

    return null;
}

// -------------------------------------------------------
// 4. CÁLCULOS DE MASS & BALANCE POR LEG
// -------------------------------------------------------

function computeLegDerived(leg, prevLeg, aircraft) {
    if (!leg || !aircraft) return leg;

    const toNum = v => Number(String(v ?? "").replace(",", "."));
    const LB_TO_KG = 0.45359237;

    // Dados base do avião
    const consumoHoraLb = toNum(aircraft.consumo) || 0;
    const pesoVazioKg = toNum(aircraft.BEW) || 0;
    const MRW = toNum(aircraft.MRW) || 0;
    const MTOW = toNum(aircraft.MTOW) || 0;
    const MZFW = toNum(aircraft.MZFW) || 0;
    const MLW = toNum(aircraft.MLW || aircraft.MLOW) || 0;

    // Dados de configuração
    const pilotsKg = Number(localStorage.getItem("pilotsKg")) || 0;
    const fuelTaxiKg = Number(localStorage.getItem("fuelTaxiKg")) || 0;

    // Dados da leg
    const payloadKg = toNum(leg?.trafficLoad?.total) || 0;
    const tripFuelLb = toNum(leg?.tripFuel) || 0;
    let fuelOBLb = toNum(leg?.fuelOB) || 0;

    // Se não tiver Fuel O/B mas existir leg anterior, herda landing fuel
    if (!fuelOBLb && prevLeg && prevLeg.landingFuelLb > 0) {
        fuelOBLb = prevLeg.landingFuelLb;
    }

    // --------------------
    // Endurance (hh:mm)
    // --------------------
    let endurance = 0;
    if (consumoHoraLb > 0) {
        endurance = fuelOBLb / consumoHoraLb;
    }

    const horas = Math.floor(endurance);
    const minutos = Math.round((endurance - horas) * 60);

    leg.endurance = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;

    // --------------------
    // Pesos ZFW / Ramp / TOW / Landing
    // --------------------
    const zfwKg = pesoVazioKg + pilotsKg + payloadKg;
    leg.zfw = zfwKg > 0 ? `${Math.round(zfwKg)} kg` : "";

    const rampKg = zfwKg + fuelOBLb * LB_TO_KG;
    leg.rampWeight = rampKg > 0 ? `${Math.round(rampKg)} kg` : "";

    const towKg = rampKg - fuelTaxiKg;
    leg.tow = isFinite(towKg) ? `${Math.round(Math.max(towKg, 0))} kg` : "";

    const landingKg = towKg - tripFuelLb * LB_TO_KG;
    leg.landingWeight = isFinite(landingKg) ? `${Math.round(Math.max(landingKg, 0))} kg` : "";

    // Fuel remanescente à aterragem (para encadear para a leg seguinte)
    const landingFuelLb = Math.max(fuelOBLb - tripFuelLb, 0);
    leg.landingFuelLb = landingFuelLb;

    if (prevLeg && typeof prevLeg === "object") {
        prevLeg.nextSuggestedFuel = `${Math.round(prevLeg.landingFuelLb)} lb`;
    }

    // --------------------
    // Cálculo de máximos de fuel
    // --------------------
    const maxFuelByMRW = MRW - zfwKg;
    const maxFuelByMTOW = MTOW - zfwKg + fuelTaxiKg;
    const maxFuelByMLW = MLW - zfwKg + fuelTaxiKg + tripFuelLb * LB_TO_KG;

    const maxFuelKg = Math.min(maxFuelByMRW, maxFuelByMTOW, maxFuelByMLW);
    const maxFuelLb = Math.round(maxFuelKg / LB_TO_KG);

    if (maxFuelLb > 0) {
        leg.maxFuelInfo = `Max: ${Math.round(maxFuelLb)} lb (${Math.round(maxFuelLb * LB_TO_KG)} kg)`;
    } else {
        leg.maxFuelInfo = "Max: 0 lb (0 kg)";
    }

    // --------------------
    // Cálculo de payload máximo dinâmico (isolado por leg)
    // --------------------
    const fuelOBKg = fuelOBLb * LB_TO_KG;
    const tripFuelKg = Number(leg.tripFuel || 0) * LB_TO_KG;

    // Limite por MZFW
    const maxPayloadByMZFW =
        MZFW - (pesoVazioKg + pilotsKg);
    // Limite por MTOW
    const maxPayloadByMTOW =
        MTOW - (pesoVazioKg + pilotsKg + fuelOBKg - fuelTaxiKg);
    // Limite por MRW
    const maxPayloadByMRW =
        MRW - (pesoVazioKg + pilotsKg + fuelOBKg);
    // Limite por MLW (NOVO)
    const maxPayloadByMLW =
        MLW - (pesoVazioKg + pilotsKg + fuelOBKg - fuelTaxiKg - tripFuelKg);

    // Payload permitido é o menor dos limites
    const maxPayloadKg = Math.min(
        maxPayloadByMZFW,
        maxPayloadByMTOW,
        maxPayloadByMRW,
        maxPayloadByMLW
    );

    // Garantir que nunca é negativo
    if (maxPayloadKg > 0) {
        leg.maxPayloadInfo = `Max: ${Math.round(maxPayloadKg)} kg`;
    } else {
        leg.maxPayloadInfo = "Max: 0 kg";
    }

    // --------------------
    // Cores de alerta dos limites
    // --------------------
    const zfwInt = Math.round(zfwKg);
    const rampInt = Math.round(rampKg);
    const towInt = Math.round(towKg);
    const landingInt = Math.round(landingKg);

    const mzfw = MZFW || Infinity;
    const mrw = MRW || Infinity;
    const mtow = MTOW || Infinity;
    const mlw = MLW || Infinity;

    leg.limitColors = {
        zfw: zfwInt > mzfw ? "red" : "black",
        ramp: rampInt > mrw ? "red" : "black",
        tow: towInt > mtow ? "red" : "black",
        ldg: landingInt > mlw ? "red" : "black"
    };

    return leg;
}

// Recalcula todas as legs de uma rota
function recomputeRoute(rota, aircraft) {
    if (!rota || !Array.isArray(rota.legs)) return;

    let prev = null;

    rota.legs.forEach((leg) => {
        computeLegDerived(leg, prev, aircraft);

        if (prev && (!leg.fuelOB || leg.fuelOB === "")) {
            const prevLanding = Number(prev.landingFuelLb) || 0;
            if (prevLanding > 0) {
                leg.nextSuggestedFuel = `${Math.round(prevLanding)} lb`;
            }
        }

        prev = leg;
    });
}


// -------------------------------------------------------
// 5. RENDERIZAÇÃO DE LEGS E ROTAS
// -------------------------------------------------------

function criarLegHTML(leg) {
    return `
    <div class="rota-leg" style="border-width:1px;border-radius:20px;border-style:groove;padding:5px;margin-top:10px;display:none;">
        <div style="display:flex;justify-content:space-between;margin-top:13px;">
            <input class="leg-nome"
                   style="font-weight:bold;width:138px;border-width:1px;border-style:ridge;border-radius:10px;"
                   placeholder="ex:CAT-PRM"
                   value="${leg?.nome ?? ""}">
            <div style="display:flex;align-items:center;gap:10px;">
                <button class="btn-perf">Perf</button>
                <button class="btn-mb">MB</button>
            </div>
        </div>

        <div style="margin-top:10px;">
            <div class="row-inputleg" style="display:flex;align-items:flex-end;justify-content:space-between;
                    border-top-width:1px;border-top-style:dotted;padding-bottom:12px;">
                <p style="margin-bottom:0;">Min Fuel O/B</p>
                <input class="min-fuel-input"
                       placeholder="Lb"
                       type="text"
                       inputmode="numeric"
                       pattern="[0-9]*"
                       value="${leg?.minFuel ?? ""}">
            </div>

            <div class="row-inputleg" style="display:flex;align-items:flex-end;justify-content:space-between;
                    border-top-width:1px;border-top-style:dotted;">
                <p style="margin-bottom:0;">Fuel O/B</p>
                <input class="fuel-ob-input"
                       placeholder="${leg?.nextSuggestedFuel || "Lb"}"
                       type="text"
                       inputmode="numeric"
                       pattern="[0-9]*"
                       value="${leg?.fuelOB ?? ""}">
            </div>
            <p id="leg-max-fuel" style="color:#555;margin:0;">${leg?.maxFuelInfo || ""}</p>

            <div class="row-inputleg" style="display:flex;align-items:flex-end;justify-content:space-between;
                    border-top-width:1px;border-top-style:dotted;">
                <p style="margin-bottom:0;">Traffic Load</p>
                <input class="traffic-load-input"
                       placeholder="Kg"
                       type="text"
                       inputmode="numeric"
                       pattern="[0-9]*"
                       value="${leg?.trafficLoad?.total ?? ""}">
            </div>
            <p id="leg-max-traffic-load" style="color:#555;margin:0;">${leg?.maxPayloadInfo || ""}</p>

            <div class="row-inputleg" style="display:flex;align-items:flex-end;justify-content:space-between;
                    border-top-width:1px;border-top-style:dotted;">
                <p style="margin-bottom:0;">Trip fuel:</p>
                <input class="trip-fuel-input"
                       placeholder="Lb"
                       type="text"
                       inputmode="numeric"
                       pattern="[0-9]*"
                       value="${leg?.tripFuel ?? ""}">
            </div>

            <div style="display:flex;justify-content:space-between;border-top-width:1px;border-top-style:dotted;
                    padding-top:0;margin-top:12px;">
                <p>Endurance:</p>
                <p class="endurance-info">${leg?.endurance ?? ""}</p>
            </div>

            <div style="display:flex;justify-content:space-between;border-top-width:1px;border-top-style:dotted;">
                <p>ZFW:</p>
                <p class="zfw-info">${leg?.zfw ?? ""}</p>
            </div>

            <div style="display:flex;justify-content:space-between;border-top-width:1px;border-top-style:dotted;">
                <p>Ramp weight:</p>
                <p class="ramp-weight-info">${leg?.rampWeight ?? ""}</p>
            </div>

            <div style="display:flex;justify-content:space-between;border-top-width:1px;border-top-style:dotted;">
                <p>TOW:</p>
                <p class="tow-info">${leg?.tow ?? ""}</p>
            </div>

            <div style="display:flex;justify-content:space-between;border-top-width:1px;border-top-style:dotted;
                    border-bottom-width:1px;border-bottom-style:dotted;">
                <p>LW:</p>
                <p class="landing-weight-info">${leg?.landingWeight ?? ""}</p>
            </div>
        </div>

        <div style="display:flex;justify-content:center;gap:15px;margin-top:5px;">
            <button class="menos-leg">- Leg</button>
            <button class="mais-leg">+ Leg</button>
        </div>
    </div>`;
}

function aplicarCoresLimitsDaRotaNoDOM(rotaCard, rotaData) {
    const legEls = rotaCard.querySelectorAll(".rota-leg");

    rotaData.legs.forEach((leg, i) => {
        const el = legEls[i];
        if (!el) return;

        el.querySelector(".endurance-info").textContent = leg.endurance || "";
        el.querySelector(".zfw-info").textContent = leg.zfw || "";
        el.querySelector(".ramp-weight-info").textContent = leg.rampWeight || "";
        el.querySelector(".tow-info").textContent = leg.tow || "";
        el.querySelector(".landing-weight-info").textContent = leg.landingWeight || "";

        // Cores
        el.querySelector(".zfw-info").style.color = leg.limitColors?.zfw || "black";
        el.querySelector(".ramp-weight-info").style.color = leg.limitColors?.ramp || "black";
        el.querySelector(".tow-info").style.color = leg.limitColors?.tow || "black";
        el.querySelector(".landing-weight-info").style.color = leg.limitColors?.ldg || "black";

        // Textos de máximos
        const maxFuelEl = el.querySelector("#leg-max-fuel");
        const maxPayloadEl = el.querySelector("#leg-max-traffic-load");
        if (maxFuelEl) maxFuelEl.textContent = leg.maxFuelInfo || "";
        if (maxPayloadEl) maxPayloadEl.textContent = leg.maxPayloadInfo || "";
    });
}

function criarRotaCardHTML(rota) {
    return `
    <div class="rota-card" data-id="${rota?.id || ""}" draggable="true">
        <div class="rota-header">
            <input class="nome-rota"
                   value="${rota?.nome ?? ""}"
                   placeholder="ex: RVP951">
            <div class="rota-actions">
                <button class="btn-compact btn-fcalc">FCalc</button>
                <button class="btn-compact btn-clear-legs" title="Limpar fuel e payload da rota">C</button>
                <button class="btn-compact del-rota">Del</button>
                <button class="btn-compact toggleBtn">▼</button>
            </div>
        </div>
    </div>`;
}

function renderRotas(rootEl, estado) {
    // Remove qualquer render anterior
    rootEl.querySelectorAll(".rota-card").forEach(el => el.remove());

    estado.rotas.forEach((rota) => {
        const rotaWrapper = document.createElement("div");
        rotaWrapper.innerHTML = criarRotaCardHTML(rota);
        const rotaCard = rotaWrapper.firstElementChild;

        // Adicionar legs
        (rota.legs || []).forEach(leg => {
            rotaCard.insertAdjacentHTML("beforeend", criarLegHTML(leg));
        });

        // Formatar unidades ao carregar
        rotaCard.querySelectorAll(".rota-leg").forEach((legEl) => {
            legEl.querySelectorAll("input").forEach(inp => {
                if (inp.classList.contains("min-fuel-input") && inp.value) {
                    inp.value = `${inp.value} lb`;
                }
                if (inp.classList.contains("fuel-ob-input") && inp.value) {
                    inp.value = `${inp.value} lb`;
                }
                if (inp.classList.contains("trip-fuel-input") && inp.value) {
                    inp.value = `${inp.value} lb`;
                }
                if (inp.classList.contains("traffic-load-input") && inp.value) {
                    inp.value = `${inp.value} kg`;
                }
            });
        });

        rootEl.appendChild(rotaCard);
        aplicarCoresLimitsDaRotaNoDOM(rotaCard, rota);
    });
}

function closeAllRoutes(container) {
    container.querySelectorAll(".rota-card").forEach(card => {
        const btn = card.querySelector(".toggleBtn");
        const legs = card.querySelectorAll(".rota-leg");
        legs.forEach(div => { div.style.display = "none"; });
        if (btn) btn.textContent = "▼";
    });
}

// -------------------------------------------------------
// 6. GUARDAR ESTADO / VALIDAÇÕES DE FUEL
// -------------------------------------------------------

function guardarEstadoRotas(estado) {
    if (!estado || !Array.isArray(estado.rotas)) return;
    if (estado.rotas.length === 0) return; // evita apagar defaults
    lsSet(ROTAS_USER_KEY, estado);
}

// Valida se um determinado Fuel O/B (em lb) serve para TODA a rota
function validaFuelEmLb(legs, aircraft, pilotsKg, fuelTaxiKg, fuelLb) {
    const LB_TO_KG = 0.45359237;
    const toNum = v => Number(String(v ?? "").replace(",", "."));
    const tolerance = 0.5;

    const MRW = toNum(aircraft.MRW);
    const MTOW = toNum(aircraft.MTOW);
    const MLW = toNum(aircraft.MLW || aircraft.MLOW);
    const MZFW = toNum(aircraft.MZFW);
    const BEW = toNum(aircraft.BEW);

    let fuelObKg = fuelLb * LB_TO_KG;
    let fuelAtTOkg = fuelObKg - fuelTaxiKg;

    for (let i = 0; i < legs.length; i++) {
        const l = legs[i];

        const zfw = BEW + pilotsKg + l.payloadKg;

        if (zfw > MZFW + tolerance) {
            return false;
        }

        const tow = zfw + fuelAtTOkg;
        const landing = tow - l.tripKg;
        const mrwChk = zfw + fuelAtTOkg + fuelTaxiKg;

        if (
            tow > (MTOW + tolerance) ||
            landing > (MLW + tolerance) ||
            mrwChk > (MRW + tolerance)
        ) {
            return false;
        }

        fuelAtTOkg = Math.max(0, fuelAtTOkg - l.tripKg);
    }

    return true;
}

// -------------------------------------------------------
// 7. EVENTOS PRINCIPAIS DA PÁGINA
// -------------------------------------------------------

function attachEvents(container, estado, aircraft) {

    // Toggle abrir/fechar legs de uma rota (fecha as outras)
    container.addEventListener("click", (e) => {
        if (!e.target.classList.contains("toggleBtn")) return;

        const rotaCard = e.target.closest(".rota-card");
        const legs = rotaCard?.querySelectorAll(".rota-leg") || [];
        if (!legs.length) return;

        const esconder = legs[0].style.display !== "none";

        // Fecha todas as rotas
        container.querySelectorAll(".rota-card").forEach(card => {
            card.querySelectorAll(".rota-leg").forEach(leg => { leg.style.display = "none"; });
            const btn = card.querySelector(".toggleBtn");
            if (btn) btn.textContent = "▼";
        });

        if (esconder) return;

        // Abre rota selecionada
        legs.forEach(div => { div.style.display = "block"; });
        e.target.textContent = "▲";
        rotaCard.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Limpar fuel/payload de todas as legs da rota
    container.addEventListener("click", (e) => {
        if (!e.target.classList.contains("btn-clear-legs")) return;

        const rotaCard = e.target.closest(".rota-card");
        const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
        const rota = estado.rotas[rotaIndex];
        if (!rota) return;

        const ok = confirm(
            "Vais limpar o FUEL O/B e o PAYLOAD (Traffic Load) de todas as legs nesta rota.\n\n" +
            "Queres continuar?"
        );
        if (!ok) return;

        rota.legs.forEach(leg => {
            leg.fuelOB = "";
            leg.trafficLoad = createEmptyTrafficLoad();
            delete leg.nextSuggestedFuel;
        });

        recomputeRoute(rota, aircraft);
        guardarEstadoRotas(estado);
        renderRotas(container, estado);

        const novaRotaCard = container.querySelectorAll(".rota-card")[rotaIndex];
        if (novaRotaCard) {
            novaRotaCard.querySelectorAll(".rota-leg").forEach(div => { div.style.display = "block"; });
            const toggleBtn = novaRotaCard.querySelector(".toggleBtn");
            if (toggleBtn) toggleBtn.textContent = "▲";
            aplicarCoresLimitsDaRotaNoDOM(novaRotaCard, estado.rotas[rotaIndex]);
        }
    });

    // Adicionar / remover legs
    container.addEventListener("click", (e) => {
        if (!e.target.classList.contains("mais-leg") &&
            !e.target.classList.contains("menos-leg")) return;

        const rotaCard = e.target.closest(".rota-card");
        const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
        const rota = estado.rotas[rotaIndex];

        const legAtual = e.target.closest(".rota-leg");
        const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legAtual);

        if (e.target.classList.contains("mais-leg")) {
            rota.legs.splice(legIndex + 1, 0, novaLegData());
        }

        if (e.target.classList.contains("menos-leg") && rota.legs.length > 1) {
            const nomeLeg = rota.legs[legIndex]?.nome?.trim() || `Leg ${legIndex + 1}`;
            const querApagar = confirm(`A leg "${nomeLeg}" vai ser eliminada.`);
            if (!querApagar) return;

            rota.legs.splice(legIndex, 1);
        }

        recomputeRoute(rota, aircraft);
        guardarEstadoRotas(estado);
        renderRotas(container, estado);

        const novaRotaCard = container.querySelectorAll(".rota-card")[rotaIndex];
        if (novaRotaCard) {
            novaRotaCard.querySelectorAll(".rota-leg").forEach(div => { div.style.display = "block"; });
            const toggleBtn = novaRotaCard.querySelector(".toggleBtn");
            if (toggleBtn) toggleBtn.textContent = "▲";
            aplicarCoresLimitsDaRotaNoDOM(novaRotaCard, estado.rotas[rotaIndex]);
        }
    });

    // Apagar rota inteira
    container.addEventListener("click", (e) => {
        if (!e.target.classList.contains("del-rota")) return;

        const rotaCard = e.target.closest(".rota-card");
        const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
        const nomeRota = estado.rotas[rotaIndex]?.nome || "esta rota";

        const confirmar = confirm(`⚠️ A rota "${nomeRota}" será eliminada permanentemente.`);
        if (!confirmar) return;

        estado.rotas.splice(rotaIndex, 1);
        guardarEstadoRotas(estado);
        renderRotas(container, estado);
        closeAllRoutes(container);
    });

    // Guardar inputs e recalcular rota
    container.addEventListener("input", (e) => {
        const rotaCard = e.target.closest(".rota-card");
        const legEl = e.target.closest(".rota-leg");
        if (!rotaCard || !legEl) return;

        const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
        const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legEl);

        const rotaData = estado.rotas[rotaIndex];
        const legData = rotaData.legs[legIndex];

        if (e.target.classList.contains("leg-nome")) {
            legData.nome = e.target.value;
        }

        if (e.target.classList.contains("min-fuel-input")) {
            legData.minFuel = Number(String(e.target.value).replace(/[^\d.]/g, "")) || 0;
        }

        if (e.target.classList.contains("fuel-ob-input")) {
            legData.fuelOB = Number(String(e.target.value).replace(/[^\d.]/g, "")) || 0;
        }

        if (e.target.classList.contains("trip-fuel-input")) {
            legData.tripFuel = Number(String(e.target.value).replace(/[^\d.]/g, "")) || 0;
        }

        if (e.target.classList.contains("traffic-load-input")) {
            const total = Number(String(e.target.value).replace(/[^\d.]/g, "")) || 0;
            legData.trafficLoad = {
                ...(legData.trafficLoad || {}),
                total
            };            

        }

        recomputeRoute(rotaData, aircraft);
        guardarEstadoRotas(estado);
        aplicarCoresLimitsDaRotaNoDOM(rotaCard, rotaData);

        const legEls = rotaCard.querySelectorAll(".rota-leg");
        rotaData.legs.forEach((ldata, i) => {
            if (rotaData.legs[i + 1] && !rotaData.legs[i + 1].fuelOB) {
                const nextEl = legEls[i + 1]?.querySelector(".fuel-ob-input");
                if (nextEl) nextEl.placeholder = `${Math.round(ldata.landingFuelLb)} lb`;
            }
        });
    });




    // Botão MB (envia leg atual para mb.html em kg)
    container.addEventListener("click", (e) => {
        if (!e.target.classList.contains("btn-mb")) return;

        const rotaCard = e.target.closest(".rota-card");
        const legEl = e.target.closest(".rota-leg");
        const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
        const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legEl);
        const legData = estado.rotas[rotaIndex].legs[legIndex];

        const LB_TO_KG = 0.45359237;
        const legDataKg = structuredClone(legData);

        if (!legDataKg.trafficLoad) legDataKg.trafficLoad = {};//se nao tiver algum valor
        legDataKg.trafficLoad.total = Number(legData.trafficLoad?.total || 0);
        legDataKg.trafficLoad.moment = Number(legData.trafficLoad?.moment || 0);


        ["minFuel", "fuelOB", "tripFuel"].forEach((campo) => {
            if (legDataKg[campo]) {
                legDataKg[campo] = Math.round(Number(legDataKg[campo]) * LB_TO_KG);
            }
        });

        console.log("moment mbLegSelecionada " + legDataKg.trafficLoad.moment);
        //debugger;
        localStorage.setItem("mbLegSelecionada", JSON.stringify(legDataKg));
        window.location.href = "mb.html";
    });

    // UX: selecionar texto dos inputs ao focar + fechar teclado em mobile
    document.addEventListener("focusin", ev => {
        if (ev.target.tagName === "INPUT") {
            ev.target.select();
        }
    });

    //---------------------------------------
    // popupTLoad     
    //---------------------------------------
    // Abrir popup Traffic Load ao clicar no input da leg
    container.addEventListener("click", (e) => {

        if (!e.target.classList.contains("traffic-load-input")) return;

        // localizar rota e leg certas
        const rotaCard = e.target.closest(".rota-card");
        const legEl = e.target.closest(".rota-leg");
        if (!rotaCard || !legEl) return;

        const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
        const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legEl);

        const rotaData = estado.rotas[rotaIndex];
        const legData = rotaData.legs[legIndex];

        // guardar referências globais CORRETAS
        window.trafficInputAlvo = e.target;
        window.trafficLegAlvo = legData;

        // abrir popup
        bloquearScroll();
        
        window.popupTLoad.showModal();
        window.popupTLoad.focus();
        
        //em popup-TLoad.js update 
        window.setAndUpdatePopup();
        
    });

    document.addEventListener("touchstart", event => {
        if (!(event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA")) {
            const active = document.activeElement;
            if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
                active.blur();
            }
        }
    });

    // Drag & Drop para reordenar rotas
    let draggingCard = null;

    container.addEventListener("dragstart", (e) => {
        const card = e.target.closest(".rota-card");
        if (!card) return;
        draggingCard = card;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", "");
        card.style.opacity = "0.5";
    });

    container.addEventListener("dragend", () => {
        if (draggingCard) draggingCard.style.opacity = "1";
        draggingCard = null;
    });

    container.addEventListener("dragover", (e) => {
        e.preventDefault();
        const targetCard = e.target.closest(".rota-card");
        if (!targetCard || targetCard === draggingCard) return;

        const rect = targetCard.getBoundingClientRect();
        const offset = e.clientY - rect.top;
        const middle = rect.height / 2;

        if (offset > middle) {
            targetCard.after(draggingCard);
        } else {
            targetCard.before(draggingCard);
        }
    });

    container.addEventListener("drop", () => {
        const novasRotas = [...container.querySelectorAll(".rota-card")]
            .map(card => {
                const id = card.dataset.id;
                return estado.rotas.find(r => r.id === id);
            })
            .filter(Boolean);

        estado.rotas = novasRotas;
        guardarEstadoRotas(estado);
    });

    // Guardar rota/leg abertas
    container.addEventListener("click", (e) => {
        if (e.target.classList.contains("toggleBtn")) {
            const rotaCard = e.target.closest(".rota-card");
            const rotaId = rotaCard?.dataset.id;
            const aberta = e.target.textContent === "▲";

            if (aberta && rotaId) {
                localStorage.setItem("rotaAbertaId", rotaId);
                localStorage.removeItem("legAbertaIndex");
            } else {
                localStorage.removeItem("rotaAbertaId");
                localStorage.removeItem("legAbertaIndex");
            }
        }

        if (e.target.closest(".rota-leg")) {
            const rotaCard = e.target.closest(".rota-card");
            const rotaId = rotaCard?.dataset.id;
            const legEl = e.target.closest(".rota-leg");
            const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legEl);

            if (rotaId) {
                localStorage.setItem("rotaAbertaId", rotaId);
                localStorage.setItem("legAbertaIndex", legIndex);
            }
        }
    });

    // Formatação ao perder foco (acrescentar unidades)
    container.addEventListener("blur", (e) => {
        const el = e.target;
        if (!el.classList) return;

        function format(val, unidade) {
            const n = Number(String(val).replace(/[^\d.]/g, ""));
            return (!isNaN(n) && n > 0) ? `${n} ${unidade}` : "";
        }

        if (el.classList.contains("min-fuel-input")) {
            el.value = format(el.value, "lb");
            return;
        }
        if (el.classList.contains("fuel-ob-input")) {
            el.value = format(el.value, "lb");
            return;
        }
        if (el.classList.contains("trip-fuel-input")) {
            el.value = format(el.value, "lb");
            return;
        }
        if (el.classList.contains("traffic-load-input")) {
            el.value = format(el.value, "kg");
            return;
        }
    }, true);

    // Remover unidades ao focar (para facilitar edição)
    container.addEventListener("focusin", (e) => {
        const el = e.target;
        if (!el.classList) return;

        if (
            el.classList.contains("min-fuel-input") ||
            el.classList.contains("fuel-ob-input") ||
            el.classList.contains("trip-fuel-input") ||
            el.classList.contains("traffic-load-input")
        ) {
            el.value = String(el.value).replace(/[^\d.]/g, "");
        }
    });

    // Botão FCalc – cálculo automático de fuel máximo
    container.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("btn-fcalc")) return;

        const confirmar = confirm(
            "Calcular o máximo de combustível tem em conta:\n" +
            "• Todas as legs da rota\n" +
            "• Payload/Traffic Load de cada leg\n" +
            "• Trip fuel de cada leg\n" +
            "• Limites do avião ativo: (MZFW, MRW, MTOW, MLW)\n\n" +
            "Carrega em OK para continuar ou Cancelar para sair."
        );
        if (!confirmar) return;

        const rotaCard = e.target.closest(".rota-card");
        const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
        const rota = estado.rotas[rotaIndex];
        const aircraftF = await getAircraftActive();
        if (!aircraftF) return alert("Nenhum avião ativo encontrado.");

        const LB_TO_KG = 0.45359237;
        const KG_TO_LB = 1 / LB_TO_KG;
        const toNum = v => Number(String(v ?? "").replace(",", "."));
        const toleranceKg = 0.5;

        const MRW = toNum(aircraftF.MRW);
        const MTOW = toNum(aircraftF.MTOW);
        const MZFW = toNum(aircraftF.MZFW);
        const MLW = toNum(aircraftF.MLW || aircraftF.MLOW);
        const BEW = toNum(aircraftF.BEW);

        const pilotsKg = Number(localStorage.getItem("pilotsKg")) || 0;
        const fuelTaxiKg = Number(localStorage.getItem("fuelTaxiKg")) || 0;

        const legs = (rota.legs || []).map((l, i) => ({
            idx: i,
            nome: (l?.nome || "").trim() || `Leg ${i + 1}`,
            payloadKg: toNum(l?.trafficLoad?.total || 0),
            tripKg: toNum(l?.tripFuel || 0) * LB_TO_KG,
            minFuelKg: toNum(l?.minFuel || 0) * LB_TO_KG
        }));
        if (!legs.length) return alert("Rota sem legs.");

        const ZFW = legs.map(l => BEW + pilotsKg + l.payloadKg);
        const idxZfwExcede = ZFW.findIndex(z => z > MZFW);
        if (idxZfwExcede !== -1) {
            const nome = legs[idxZfwExcede].nome;
            return alert(
                "⚠️ ZFW acima do permitido.\n\n" +
                `• Leg: ${nome}\n` +
                `• ZFW calculado: ${Math.round(ZFW[idxZfwExcede])} kg\n` +
                `• MZFW avião:     ${Math.round(MZFW)} kg`
            );
        }

        const limitTOkg = legs.map((l, i) => {
            const f_mtow = Math.max(0, MTOW - ZFW[i] + toleranceKg);
            const f_mlw = Math.max(0, l.tripKg + (MLW - ZFW[i]) + toleranceKg);
            const f_mrw = Math.max(0, MRW - ZFW[i] - fuelTaxiKg + toleranceKg);
            return Math.min(f_mtow, f_mlw, f_mrw);
        });

        const FmaxKg = new Array(legs.length).fill(0);
        FmaxKg[legs.length - 1] = limitTOkg[legs.length - 1];
        for (let i = legs.length - 2; i >= 0; i--) {
            FmaxKg[i] = Math.min(limitTOkg[i], legs[i].tripKg + FmaxKg[i + 1]);
        }

        let fuelAtTOkg = FmaxKg[0];
        let critIndex = -1;
        let maxPermitidoLegKg = 0;

        for (let i = 0; i < legs.length; i++) {
            const l = legs[i];

            if (fuelAtTOkg < l.minFuelKg) {
                critIndex = i;
                const f_mtow = Math.max(0, MTOW - ZFW[i]);
                const f_mlw = Math.max(0, l.tripKg + (MLW - ZFW[i]));
                const f_mrw = Math.max(0, MRW - ZFW[i] - fuelTaxiKg);
                maxPermitidoLegKg = Math.min(f_mtow, f_mlw, f_mrw);
                break;
            }

            const towKg = ZFW[i] + fuelAtTOkg;
            const landingKg = towKg - l.tripKg;
            const mrwChk = ZFW[i] + fuelAtTOkg + fuelTaxiKg;

            if (
                towKg > (MTOW + toleranceKg) ||
                mrwChk > (MRW + toleranceKg) ||
                landingKg > (MLW + toleranceKg)
            ) {
                const f_mtow = Math.max(0, MTOW - ZFW[i]);
                const f_mlw = Math.max(0, l.tripKg + (MLW - ZFW[i]));
                const f_mrw = Math.max(0, MRW - ZFW[i] - fuelTaxiKg);
                maxPermitidoLegKg = Math.min(f_mtow, f_mlw, f_mrw);
                critIndex = i;
                break;
            }

            fuelAtTOkg = Math.max(0, fuelAtTOkg - l.tripKg);
        }

        const maxFuelDepartureObKg = FmaxKg[0] + fuelTaxiKg;
        const baseLb = Math.floor(maxFuelDepartureObKg * KG_TO_LB);

        let maxFuelDepartureLb = baseLb;
        for (let add = 1; add <= 3; add++) {
            const cand = baseLb + add;
            const ok2 = validaFuelEmLb(legs, aircraftF, pilotsKg, fuelTaxiKg, cand);
            if (ok2) {
                maxFuelDepartureLb = cand;
            } else {
                break;
            }
        }

        if (critIndex !== -1) {
            const legNome = legs[critIndex].nome;
            const minNecessarioLb = Math.round(legs[critIndex].minFuelKg * KG_TO_LB);

            const tripAntesDaCritLb = rota.legs
                .slice(0, critIndex)
                .reduce((s, l) => s + toNum(l?.tripFuel || 0), 0);

            const fuelTOnaCritLb = Math.max(
                0,
                maxFuelDepartureLb - (fuelTaxiKg * KG_TO_LB) - tripAntesDaCritLb
            );

            const maxObNaCritKg = maxPermitidoLegKg + fuelTaxiKg;
            const maxPossivelLb = Math.round(maxObNaCritKg * KG_TO_LB);

            alert(
                "⚠️ ATENÇÃO: rota exige reabastecimento intermédio\n\n" +
                `• Leg crítica: ${legNome}\n` +
                `• Fuel previsto à saída dessa leg: ${Math.round(fuelTOnaCritLb)} lb\n` +
                `• Min fuel definido nessa leg:     ${minNecessarioLb} lb\n\n` +
                "➡ Ação sugerida:\n" +
                `• Reabastecer em ${legNome}\n` +
                `• Min Fuel: ${minNecessarioLb} lb\n` +
                `• Max fuel:  ${maxPossivelLb} lb\n`
            );
        }

        const primeiraLegNome = rota.legs[0]?.nome?.trim() || "1.ª leg";

        const aplicar = confirm(
            `Máximo combustível na 1.º leg (${primeiraLegNome}): ${maxFuelDepartureLb} lb\n\n` +
            "Este valor será aplicado à 1.º leg."
        );

        if (aplicar) {
            rota.legs[0].fuelOB = maxFuelDepartureLb;
            recomputeRoute(rota, aircraftF);
            guardarEstadoRotas(estado);
            renderRotas(container, estado);

            const novaRotaCard = container.querySelectorAll(".rota-card")[rotaIndex];
            if (novaRotaCard) {
                novaRotaCard.querySelectorAll(".rota-leg").forEach(div => { div.style.display = "block"; });
                const toggleBtn = novaRotaCard.querySelector(".toggleBtn");
                if (toggleBtn) toggleBtn.textContent = "▲";
                aplicarCoresLimitsDaRotaNoDOM(novaRotaCard, estado.rotas[rotaIndex]);
            }
        }
    });
}

// -------------------------------------------------------
// 8. REPO POR ORIGEM (CHAMADO A PARTIR DE SETTINGS SE QUISERES)
// -------------------------------------------------------

window.reporRotasParaOrigem = async function reporRotasParaOrigem() {
    localStorage.removeItem(ROTAS_USER_KEY);
    const defaults = await loadJSON("data/rotas.json");
    const sane = { rotas: Array.isArray(defaults?.rotas) ? defaults.rotas : [] };
    lsSet(ROTAS_USER_KEY, sane);
};



// -------------------------------------------------------
// 9. BOOTSTRAP DA PÁGINA ROTAS
// -------------------------------------------------------

(async function initRotasPage() {
    const isRotas =
        document.location.pathname.endsWith("/rotas.html") ||
        document.title.includes("Rotas");

    if (!isRotas) return;

    const container = document.body;

    const [estado, aircraft] = await Promise.all([
        ensureUserRotasState(),
        getAircraftActive()
    ]);

    // ---------------------------------------------------------
    // Preencher propriedades que possam estar em falta (versão simples)
    // ---------------------------------------------------------
    for (const rota of estado.rotas) {
        for (const leg of rota.legs) {
            // Normalizar leg para ter sempre o modelo completo
            const base = novaLegData();

            // Copia valores existentes da leg (mantém o que já tens)
            Object.assign(base, leg);

            // Normaliza sub-objetos: defaults + valores existentes
            base.trafficLoad = { ...novaLegData().trafficLoad, ...(leg.trafficLoad || {}) };
            base.limitColors = { ...novaLegData().limitColors, ...(leg.limitColors || {}) };

            // Escreve de volta na própria referência da leg
            Object.assign(leg, base);
        }
    }
    // ---------------------------------------------------------


    (estado.rotas || []).forEach(rota => recomputeRoute(rota, aircraft));
    guardarEstadoRotas(estado);

    // Guardar referências globais para uso no popup
    gEstadoRotas = estado;
    gAircraftAtivo = aircraft;
    gRotasRoot = container;

    renderRotas(container, estado);
    closeAllRoutes(container);

    // Restaurar rota/leg abertas
    const rotaAbertaId = localStorage.getItem("rotaAbertaId");
    const legAbertaIndex = Number(localStorage.getItem("legAbertaIndex"));

    if (rotaAbertaId) {
        const rotaCard = container.querySelector(`.rota-card[data-id="${rotaAbertaId}"]`);
        if (rotaCard) {
            const legs = rotaCard.querySelectorAll(".rota-leg");
            legs.forEach(div => { div.style.display = "block"; });
            const toggle = rotaCard.querySelector(".toggleBtn");
            if (toggle) toggle.textContent = "▲";

            if (!Number.isNaN(legAbertaIndex) && legs[legAbertaIndex]) {
                legs[legAbertaIndex].scrollIntoView({ behavior: "auto", block: "center" });
            }
        }
    }

    attachEvents(container, estado, aircraft);

    // Botão "+ Nova Rota"
    const btnNova = document.getElementById("btn-nova-rota");
    if (btnNova) {
        btnNova.addEventListener("click", () => {
            const nome = prompt("Qual é o nome da nova rota?");
            if (!nome) return;

            const nova = { id: crypto.randomUUID(), nome, legs: [novaLegData()] };
            estado.rotas.push(nova);
            recomputeRoute(nova, aircraft);
            guardarEstadoRotas(estado);
            renderRotas(container, estado);
            closeAllRoutes(container);
        });
    }
})();




// -------------------------------------------------------
// 10. limpar traffic load quando press "C" button
// -------------------------------------------------------
function createEmptyTrafficLoad() {
  return {
    // totais finais
    total: 0,
    moment: 0,

    // pax
    homens: 0,
    mulheres: 0,
    criancas: 0,
    extra: 0,

    paxTotalKg: 0,
    paxMoment: 0,

    // seats
    seats: {},
    seatKg: {},

    // cargo
    f_gab: 0,
    f_gabArm: 2.560,

    r_gab: 0,
    r_gabArm: 13.142,
    r_gabType: "SMALL",

    cargoTotalKg: 0,
    cargoMoment: 0
  };
}

