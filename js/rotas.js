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
const LEG_METRICS_HIDDEN_KEY = "legMetricsHiddenV1"; // preferência: ocultar métricas (TRAF/TOW/FOB/TRIP F/LW) nas legs

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


// AUX: obter capacidade máxima de combustível do avião
function getAircraftMaxFuelLb(aircraft) {
    // Se não houver avião, devolver 0
    if (!aircraft) return 0;

    // Converter o valor do tanque para número
    const fuelTankLb = Number(String(aircraft.FuelTank ?? "").replace(",", "."));

    // Se for válido, devolver o valor
    if (Number.isFinite(fuelTankLb) && fuelTankLb > 0) {
        return fuelTankLb;
    }

    // Caso não exista ou seja inválido
    return 0;
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
    let MTOW = toNum(aircraft.MTOW) || 0;
    let MZFW = toNum(aircraft.MZFW) || 0;
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

    // SET MAXIMOS PARA CS-ATH
    if (aircraft.ID === "CS-ATH") {
        if (zfwKg > 5400 && zfwKg <= 5590) {
            MZFW = zfwKg;
            MTOW = csath_MTOW(zfwKg);
        }
        else if (zfwKg > 5590) {
            MZFW = 5590;
            MTOW = 6200;
        }
    }

    // Fuel remanescente à aterragem (para encadear para a leg seguinte)
    const landingFuelLb = Math.max(fuelOBLb - tripFuelLb, 0);
    leg.landingFuelLb = landingFuelLb;

    // --------------------
    // Cálculo de máximos de fuel
    // --------------------
    const maxFuelByMRW = MRW - zfwKg;
    const maxFuelByMTOW = MTOW - zfwKg + fuelTaxiKg;
    const maxFuelByMLW = MLW - zfwKg + fuelTaxiKg + tripFuelLb * LB_TO_KG;

    // Máximo permitido por limites de massa
    const maxFuelKgByWeight = Math.max(
        0,
        Math.min(maxFuelByMRW, maxFuelByMTOW, maxFuelByMLW)
    );

    // Converter para lb
    const maxFuelLbByWeight = Math.round(maxFuelKgByWeight / LB_TO_KG);

    // Máximo físico do tanque do avião
    const maxFuelTankLb = getAircraftMaxFuelLb(aircraft);

    // Máximo final = menor entre peso e tanque
    const maxFuelLb = maxFuelTankLb > 0
        ? Math.min(maxFuelLbByWeight, maxFuelTankLb)
        : maxFuelLbByWeight;

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

    rota.legs.forEach((leg, index) => {
        if (index === 0) delete leg.nextSuggestedFuel;

        computeLegDerived(leg, prev, aircraft);

        if (prev) {
            const prevLanding = Number(prev.landingFuelLb) || 0;
            if (prevLanding > 0) {
                leg.nextSuggestedFuel = `${Math.round(prevLanding)} lb`;
            } else {
                delete leg.nextSuggestedFuel;
            }
        }

        prev = leg;
    });
}

function csath_MTOW(zfw) {
    //apenas para interpolação no intervalo entre ZFW = 5400 e 5590
    return -1.05263 * zfw + 12084.21;
}

function cleanUnitValue(value, unit = "") {
    const n = Number(String(value ?? "").replace(/[^\d.]/g, ""));
    if (!Number.isFinite(n) || n <= 0) return unit ? `0 ${unit}` : "0";
    return unit ? `${Math.round(n)} ${unit}` : String(Math.round(n));
}

function displayFuelInfo(info) {
    return info || "Max: 0 lb";
}

function buildLegSummary(leg) {
    const aircraft = gAircraftAtivo;
    const toNum = v => Number(String(v ?? "").replace(",", "."));
    const MTOW = aircraft ? toNum(aircraft.MTOW) : 0;
    const MLW  = aircraft ? toNum(aircraft.MLW || aircraft.MLOW) : 0;
    const fuelOBNum = toNum(leg?.fuelOB) || 0;

    // Parse "Max: 850 kg" → "850 kg"  |  "Max: 1800 lb (816 kg)" → "1800 lb"
    const parseKg = (s) => { const m = String(s || "").match(/(\d+)\s*kg/); return m ? `${m[1]} kg` : "—"; };
    const parseLb = (s) => { const m = String(s || "").match(/(\d+)\s*lb/); return m ? `${m[1]} lb` : "—"; };

    return {
        nome:         leg?.nome?.trim() || "LEG",
        trafficLoad:  leg?.trafficLoad?.total ? `${leg.trafficLoad.total} kg` : "0 kg",
        maxTraffic:   parseKg(leg?.maxPayloadInfo),
        tow:          leg?.tow || "0 kg",
        maxTow:       MTOW > 0 ? `${Math.round(MTOW)} kg` : "—",
        fuelOnBoard:  fuelOBNum > 0 ? `${fuelOBNum} lb` : "0 lb",
        maxFuel:      parseLb(leg?.maxFuelInfo),
        tripFuel:     leg?.tripFuel ? `${leg.tripFuel} lb` : "0 lb",
        maxTripFuel:  fuelOBNum > 0 ? `${fuelOBNum} lb` : "—",
        lw:           leg?.landingWeight || "0 kg",
        maxLw:        MLW > 0 ? `${Math.round(MLW)} kg` : "—",
    };
}

function getLegStatusClass(leg) {
    const colors = Object.values(leg?.limitColors || {});
    return colors.some(color => String(color).toLowerCase() === "red") ? "is-alert" : "is-normal";
}

function ensureLegEditorDialog() {
    let dialog = document.getElementById("leg-editor-dialog");
    if (dialog) return dialog;

    dialog = document.createElement("dialog");
    dialog.id = "leg-editor-dialog";
    dialog.className = "leg-editor-dialog";
    dialog.innerHTML = `
        <form method="dialog" class="leg-editor-shell">
            <div class="leg-editor-header-bar">
                <div class="leg-editor-head">
                    <span class="leg-editor-kicker">Leg Editor</span>
                </div>
                <button class="leg-editor-close" value="close" formnovalidate aria-label="Fechar editor">×</button>
            </div>

            <div class="leg-editor-body">
                <div class="leg-editor-grid">
                    <label class="leg-editor-field leg-editor-field-wide">
                        <span>Nome da leg</span>
                        <input class="leg-editor-input leg-editor-nome" placeholder="ex: CAT-PRM" autocomplete="off">
                    </label>
                    <label class="leg-editor-field">
                        <span>Min Fuel O/B</span>
                        <input class="leg-editor-input leg-editor-min-fuel" placeholder="lb" inputmode="numeric" pattern="[0-9]*">
                    </label>
                    <label class="leg-editor-field">
                        <span>Fuel O/B</span>
                        <input class="leg-editor-input leg-editor-fuel-ob" placeholder="lb" inputmode="numeric" pattern="[0-9]*">
                    </label>
                    <label class="leg-editor-field">
                        <span>Traffic Load</span>
                        <div class="leg-editor-combo">
                            <input class="leg-editor-input leg-editor-traffic" placeholder="kg" inputmode="numeric" pattern="[0-9]*">
                            <button type="button" class="leg-editor-load-btn">Load</button>
                        </div>
                    </label>
                    <label class="leg-editor-field">
                        <span>Trip Fuel</span>
                        <input class="leg-editor-input leg-editor-trip-fuel" placeholder="lb" inputmode="numeric" pattern="[0-9]*">
                    </label>
                </div>

                <div class="leg-editor-telemetry">
                    <div><span>Endurance</span><strong class="endurance-info">--:--</strong></div>
                    <div><span>ZFW</span><strong class="zfw-info">0 kg</strong></div>
                    <div><span>Ramp</span><strong class="ramp-weight-info">0 kg</strong></div>
                    <div><span>TOW</span><strong class="tow-info">0 kg</strong></div>
                    <div><span>LW</span><strong class="landing-weight-info">0 kg</strong></div>
                    <div><span>Max Fuel</span><strong id="leg-max-fuel">Max: 0 lb</strong></div>
                    <div><span>Max Payload</span><strong id="leg-max-traffic-load">Max: 0 kg</strong></div>
                </div>

                <div class="leg-editor-actions"></div>
            </div>
        </form>`;
    (window.__spaActiveContainer || document.body).appendChild(dialog);

    const _onClose = () => { libertarScroll(); disablePopupZoomBlock(); };
    dialog.addEventListener("close", _onClose);
    dialog.addEventListener("cancel", _onClose);

    return dialog;
}

function getLegByDialog(dialog) {
    const rotaIndex = Number(dialog.dataset.rotaIndex);
    const legIndex = Number(dialog.dataset.legIndex);
    const rota = gEstadoRotas?.rotas?.[rotaIndex];
    return { rota, leg: rota?.legs?.[legIndex], rotaIndex, legIndex };
}

function syncLegEditorDialog(dialog, leg) {
    if (!dialog || !leg) return;
    dialog.querySelector(".leg-editor-nome").value = leg.nome || "";
    dialog.querySelector(".leg-editor-min-fuel").value = leg.minFuel || "";
    dialog.querySelector(".leg-editor-fuel-ob").value = leg.fuelOB || "";
    dialog.querySelector(".leg-editor-fuel-ob").placeholder = leg.nextSuggestedFuel || "lb";
    dialog.querySelector(".leg-editor-traffic").value = leg.trafficLoad?.total || "";
    dialog.querySelector(".leg-editor-trip-fuel").value = leg.tripFuel || "";

    dialog.querySelector(".endurance-info").textContent = leg.endurance || "--:--";
    dialog.querySelector(".zfw-info").textContent = leg.zfw || "0 kg";
    dialog.querySelector(".ramp-weight-info").textContent = leg.rampWeight || "0 kg";
    dialog.querySelector(".tow-info").textContent = leg.tow || "0 kg";
    dialog.querySelector(".landing-weight-info").textContent = leg.landingWeight || "0 kg";
    dialog.querySelector("#leg-max-fuel").textContent = leg.maxFuelInfo || "Max: 0 lb";
    dialog.querySelector("#leg-max-traffic-load").textContent = leg.maxPayloadInfo || "Max: 0 kg";

    const applyColor = (sel, c) => {
        const el = dialog.querySelector(sel);
        if (!el) return;
        if (!c || c === "black") el.style.color = "";
        else if (c === "red") el.style.color = "#e03535";
        else el.style.color = c;
    };
    applyColor(".zfw-info",          leg.limitColors?.zfw);
    applyColor(".ramp-weight-info",  leg.limitColors?.ramp);
    applyColor(".tow-info",          leg.limitColors?.tow);
    applyColor(".landing-weight-info", leg.limitColors?.ldg);
}

function openLegEditor(rotaIndex, legIndex) {
    const dialog = ensureLegEditorDialog();
    const rota = gEstadoRotas?.rotas?.[rotaIndex];
    const leg = rota?.legs?.[legIndex];
    if (!rota || !leg) return;

    dialog.dataset.rotaIndex = String(rotaIndex);
    dialog.dataset.legIndex = String(legIndex);
    syncLegEditorDialog(dialog, leg);

    if (!dialog.open) {
        bloquearScroll();
        enablePopupZoomBlock();
        dialog.showModal();
        dialog.querySelector(".leg-editor-close")?.focus({ preventScroll: true });
    }
}

// -------------------------------------------------------
// 5. RENDERIZAÇÃO DE LEGS E ROTAS
// -------------------------------------------------------

function criarLegHTML(leg, legIndex = 0) {
    const summary = buildLegSummary(leg);
    const statusClass = getLegStatusClass(leg);
    return `
    <div class="rota-leg ${statusClass}" data-leg-index="${legIndex}" style="display:none;">
        <div class="leg-flight-strip" role="button" tabindex="0"
             title="Editar ${summary.nome}" aria-label="Editar ${summary.nome}">
            <span class="leg-strip-number">${String(legIndex + 1).padStart(2, "0")}</span>
            <span class="leg-strip-name">${summary.nome}</span>
            <span class="leg-strip-metric leg-strip-traffic">
                <small>TRAF</small>
                <strong class="leg-summary-traffic-load">${summary.trafficLoad}</strong>
                <em class="leg-summary-traffic-max">max ${summary.maxTraffic}</em>
            </span>
            <span class="leg-strip-metric leg-strip-tow">
                <small>TOW</small>
                <strong class="leg-summary-tow">${summary.tow}</strong>
                <em class="leg-summary-tow-max">max ${summary.maxTow}</em>
            </span>
            <span class="leg-strip-metric leg-strip-fob">
                <small>FOB</small>
                <strong class="leg-summary-fob">${summary.fuelOnBoard}</strong>
                <em class="leg-summary-fuel-max">max ${summary.maxFuel}</em>
            </span>
            <span class="leg-strip-metric leg-strip-tripf">
                <small>TRIP F</small>
                <strong class="leg-summary-tripf">${summary.tripFuel}</strong>
                <em class="leg-summary-tripf-max">fob ${summary.maxTripFuel}</em>
            </span>
            <span class="leg-strip-metric leg-strip-lw">
                <small>LW</small>
                <strong class="leg-summary-lw">${summary.lw}</strong>
                <em class="leg-summary-lw-max">max ${summary.maxLw}</em>
            </span>
            <span class="leg-strip-actions" aria-label="Ações da leg">
                <button class="btn-perf" type="button">Perf</button>
                <button class="btn-mb" type="button">M&amp;B</button>
            </span>
        </div>
        <div class="leg-controls">
            <button class="menos-leg" type="button" title="Remover esta leg">− Leg</button>
            <div class="leg-connector" aria-hidden="true">
                <span class="leg-connector-line"></span>
                <svg class="leg-connector-plane" viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                <span class="leg-connector-line"></span>
            </div>
            <button class="mais-leg" type="button" title="Adicionar leg a seguir">+ Leg</button>
        </div>
    </div>`;
}

function aplicarCoresLimitsDaRotaNoDOM(rotaCard, rotaData) {
    const legEls = rotaCard.querySelectorAll(".rota-leg");

    rotaData.legs.forEach((leg, i) => {
        const el = legEls[i];
        if (!el) return;

        const summary = buildLegSummary(leg);
        el.classList.toggle("is-alert", getLegStatusClass(leg) === "is-alert");
        el.classList.toggle("is-normal", getLegStatusClass(leg) !== "is-alert");

        const setText = (selector, text) => {
            const target = el.querySelector(selector);
            if (target) target.textContent = text;
        };
        // Normalize legacy "red"/"black" → brand danger color / inherit
        const setColor = (selector, color) => {
            const target = el.querySelector(selector);
            if (!target) return;
            if (!color || color === "black") target.style.color = "";
            else if (color === "red") target.style.color = "#e03535";
            else target.style.color = color;
        };

        setText(".leg-strip-name", summary.nome);
        setText(".leg-summary-traffic-load", summary.trafficLoad);
        setText(".leg-summary-traffic-max", `max ${summary.maxTraffic}`);
        setText(".leg-summary-tow", summary.tow);
        setText(".leg-summary-tow-max", `max ${summary.maxTow}`);
        setText(".leg-summary-fob", summary.fuelOnBoard);
        setText(".leg-summary-fuel-max", `max ${summary.maxFuel}`);
        setText(".leg-summary-tripf", summary.tripFuel);
        setText(".leg-summary-tripf-max", `fob ${summary.maxTripFuel}`);
        setText(".leg-summary-lw", summary.lw);
        setText(".leg-summary-lw-max", `max ${summary.maxLw}`);

        setText(".endurance-info", leg.endurance || "");
        setText(".zfw-info", leg.zfw || "");
        setText(".ramp-weight-info", leg.rampWeight || "");
        setText(".tow-info", leg.tow || "");
        setText(".landing-weight-info", leg.landingWeight || "");
        setText("#leg-max-fuel", leg.maxFuelInfo || "");
        setText("#leg-max-traffic-load", leg.maxPayloadInfo || "");

        setColor(".zfw-info", leg.limitColors?.zfw);
        setColor(".ramp-weight-info", leg.limitColors?.ramp);
        setColor(".tow-info", leg.limitColors?.tow);
        setColor(".leg-summary-tow", leg.limitColors?.tow);
        setColor(".landing-weight-info", leg.limitColors?.ldg);
        setColor(".leg-summary-lw", leg.limitColors?.ldg);

        const fuelInputEl = el.querySelector(".fuel-ob-input");
        if (fuelInputEl) fuelInputEl.placeholder = leg?.nextSuggestedFuel || "Lb";
    });

    const dialog = document.getElementById("leg-editor-dialog");
    if (dialog?.open) {
        const { leg } = getLegByDialog(dialog);
        if (leg) syncLegEditorDialog(dialog, leg);
    }
}

function criarRotaCardHTML(rota) {
    return `
    <div class="rota-card" data-id="${rota?.id || ""}" draggable="true">
        <div class="rota-header">
            <div class="rota-header-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
            </div>
            <input class="nome-rota"
                   value="${rota?.nome ?? ""}"
                   placeholder="ex: RVP951">
            <div class="rota-actions">
                <button class="btn-fcalc" title="Calcular combustível máximo">F-Calc</button>
                <button class="btn-clear-legs" title="Limpar fuel e payload da rota">Clear</button>
                <button class="del-rota" title="Eliminar rota">Del</button>
                <button class="toggleBtn">▼</button>
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
        (rota.legs || []).forEach((leg, legIndex) => {
            rotaCard.insertAdjacentHTML("beforeend", criarLegHTML(leg, legIndex));
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
    let MTOW = toNum(aircraft.MTOW);
    const MLW = toNum(aircraft.MLW || aircraft.MLOW);
    let MZFW = toNum(aircraft.MZFW);
    const BEW = toNum(aircraft.BEW);

    let fuelObKg = fuelLb * LB_TO_KG;
    let fuelAtTOkg = fuelObKg - fuelTaxiKg;

    for (let i = 0; i < legs.length; i++) {
        const l = legs[i];

        const zfw = BEW + pilotsKg + l.payloadKg;

        // SET MAXIMOS PARA CS-ATH
        if (aircraft.ID === "CS-ATH") {
            if (zfw > 5400 && zfw <= 5590) {
                MZFW = zfw;
                MTOW = csath_MTOW(zfw);
            }
            else if (zfw > 5590) {
                MZFW = 5590;
                MTOW = 6200;
            }
        }

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

    const legEditor = ensureLegEditorDialog();

    function refreshOpenRoute(rotaIndex) {
        const rotaCard = container.querySelectorAll(".rota-card")[rotaIndex];
        const rotaData = estado.rotas[rotaIndex];
        if (rotaCard && rotaData) aplicarCoresLimitsDaRotaNoDOM(rotaCard, rotaData);
    }

    function recomputeFromDialog(dialog = legEditor) {
        const { rota, rotaIndex } = getLegByDialog(dialog);
        if (!rota) return;
        recomputeRoute(rota, aircraft);
        guardarEstadoRotas(estado);
        refreshOpenRoute(rotaIndex);
    }

    legEditor.addEventListener("input", (e) => {
        const { rota, leg } = getLegByDialog(legEditor);
        if (!rota || !leg) return;

        if (e.target.classList.contains("leg-editor-nome")) {
            leg.nome = e.target.value;
        }

        if (e.target.classList.contains("leg-editor-min-fuel")) {
            leg.minFuel = Number(String(e.target.value).replace(/[^\d.]/g, "")) || 0;
        }

        if (e.target.classList.contains("leg-editor-fuel-ob")) {
            let fuelValue = Number(String(e.target.value).replace(/[^\d.]/g, "")) || 0;
            const maxFuelTankLb = getAircraftMaxFuelLb(aircraft);
            if (maxFuelTankLb > 0 && fuelValue > maxFuelTankLb) fuelValue = maxFuelTankLb;
            leg.fuelOB = fuelValue;
            e.target.value = fuelValue > 0 ? String(fuelValue) : "";
        }

        if (e.target.classList.contains("leg-editor-trip-fuel")) {
            leg.tripFuel = Number(String(e.target.value).replace(/[^\d.]/g, "")) || 0;
        }

        if (e.target.classList.contains("leg-editor-traffic")) {
            const total = Number(String(e.target.value).replace(/[^\d.]/g, "")) || 0;
            leg.trafficLoad = {
                ...(leg.trafficLoad || createEmptyTrafficLoad()),
                total,
                moment: 0
            };
        }

        recomputeFromDialog(legEditor);
    });

    legEditor.addEventListener("click", (e) => {
        const { rota, leg, rotaIndex, legIndex } = getLegByDialog(legEditor);
        if (!rota || !leg) return;

        if (e.target.classList.contains("leg-editor-load-btn")) {
            window.trafficInputAlvo = legEditor.querySelector(".leg-editor-traffic");
            window.trafficLegAlvo = leg;
            bloquearScroll();
            window.popupTLoad.showModal();
            window.popupTLoad.focus();
            window.setAndUpdatePopup();
            return;
        }

    });

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
        if (!rotaCard) return;

        const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
        const rotaData = estado.rotas[rotaIndex];
        if (!rotaData) return;

        if (e.target.classList.contains("nome-rota")) {
            rotaData.nome = e.target.value;
            guardarEstadoRotas(estado);
            return;
        }

        const legEl = e.target.closest(".rota-leg");
        if (!legEl) return;

        const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legEl);
        const legData = rotaData.legs[legIndex];

        if (e.target.classList.contains("leg-nome")) {
            legData.nome = e.target.value;
        }

        if (e.target.classList.contains("min-fuel-input")) {
            legData.minFuel = Number(String(e.target.value).replace(/[^\d.]/g, "")) || 0;
        }

        if (e.target.classList.contains("fuel-ob-input")) {
            // Ler o valor introduzido no input
            let fuelValue = Number(String(e.target.value).replace(/[^\d.]/g, "")) || 0;

            // Obter o máximo físico de combustível do avião ativo
            const maxFuelTankLb = getAircraftMaxFuelLb(aircraft);

            // Se ultrapassar o máximo do tanque, limitar
            if (maxFuelTankLb > 0 && fuelValue > maxFuelTankLb) {
                fuelValue = maxFuelTankLb;
            }

            // Guardar o valor corrigido no estado
            legData.fuelOB = fuelValue;

            // Atualizar imediatamente o valor visível no input
            e.target.value = fuelValue > 0 ? String(fuelValue) : "";
        }

        if (e.target.classList.contains("trip-fuel-input")) {
            legData.tripFuel = Number(String(e.target.value).replace(/[^\d.]/g, "")) || 0;
        }

        if (e.target.classList.contains("traffic-load-input")) {
            const total = Number(String(e.target.value).replace(/[^\d.]/g, "")) || 0;
            legData.trafficLoad = {
                ...(legData.trafficLoad || {}),
                total,
                moment
            };
            console.log("data teste... : " + legData.trafficLoad.moment);

        }

        recomputeRoute(rotaData, aircraft);
        guardarEstadoRotas(estado);
        aplicarCoresLimitsDaRotaNoDOM(rotaCard, rotaData);

        const legEls = rotaCard.querySelectorAll(".rota-leg");
        rotaData.legs.forEach((ldata, i) => {
            if (rotaData.legs[i + 1] && !rotaData.legs[i + 1].fuelOB) {
                const nextEl = legEls[i + 1]?.querySelector(".fuel-ob-input");
                if (nextEl) {
                    const suggested = Number(ldata.landingFuelLb) || 0;
                    nextEl.placeholder = suggested > 0 ? `${Math.round(suggested)} lb` : "Lb";
                }
            }
        });
    });


    // Botão performance
    container.addEventListener("click", (e) => {

        // verifica se o elemento clicado tem a classe btn-perf
        if (!e.target.classList.contains("btn-perf")) return;

        // encontra o card da rota e a leg clicada
        const rotaCard = e.target.closest(".rota-card");
        const legEl = e.target.closest(".rota-leg");

        // descobre os índices da rota e da leg
        const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
        const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legEl);

        // obtém diretamente os dados da leg
        const legData = estado.rotas[rotaIndex].legs[legIndex];

        // extrai o valor numérico do TOW
        const tow = parseFloat(String(legData.tow).replace(",", ".")) || 0;

        // guarda apenas o TOW no localStorage
        localStorage.setItem("perfTOW", tow);

        // muda para a página de performance
        window.location.href = "performance.html";
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

    // Abrir o popup ao tocar diretamente na leg
    container.addEventListener("click", (e) => {
        const legStrip = e.target.closest(".leg-flight-strip");
        if (!legStrip) return;
        // Don't open editor when clicking Perf / M&B
        if (e.target.closest(".leg-strip-actions")) return;

        const rotaCard = legStrip.closest(".rota-card");
        const legEl = legStrip.closest(".rota-leg");
        if (!rotaCard || !legEl) return;

        const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
        const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legEl);
        openLegEditor(rotaIndex, legIndex);
    });

    // Keyboard: Enter / Space on leg strip
    container.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const legStrip = e.target.closest(".leg-flight-strip");
        if (!legStrip || e.target.closest(".leg-strip-actions")) return;
        e.preventDefault();
        legStrip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
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
        if (event.target.closest('dialog[open]')) return;
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
        let MTOW = toNum(aircraftF.MTOW);
        let MZFW = toNum(aircraftF.MZFW);
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

        const idxZfwExcede = ZFW.findIndex((zfwLeg) => {
            // Começar com o MZFW normal do avião
            let mzfwLeg = MZFW;

            // Ajuste especial para o CS-ATH
            if (aircraftF.ID === "CS-ATH") {
                if (zfwLeg > 5400 && zfwLeg <= 5590) {
                    mzfwLeg = zfwLeg;
                } else if (zfwLeg > 5590) {
                    mzfwLeg = 5590;
                }
            }

            // Verificar se esta leg excede o limite aplicável
            return zfwLeg > mzfwLeg;
        });


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
            // Começar com os limites normais do avião
            let mtowLeg = MTOW;
            let mzfwLeg = MZFW;

            // Ajuste especial para o CS-ATH, por leg
            if (aircraftF.ID === "CS-ATH") {
                if (ZFW[i] > 5400 && ZFW[i] <= 5590) {
                    mzfwLeg = ZFW[i];
                    mtowLeg = csath_MTOW(ZFW[i]);
                } else if (ZFW[i] > 5590) {
                    mzfwLeg = 5590;
                    mtowLeg = 6200;
                }
            }

            // Limite por MTOW dessa leg
            const f_mtow = Math.max(0, mtowLeg - ZFW[i] + toleranceKg);

            // Limite por MLW dessa leg
            const f_mlw = Math.max(0, l.tripKg + (MLW - ZFW[i]) + toleranceKg);

            // Limite por MRW dessa leg
            const f_mrw = Math.max(0, MRW - ZFW[i] - fuelTaxiKg + toleranceKg);

            // Devolver o mais restritivo
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

            // MTOW aplicável a esta leg
            let mtowLeg = MTOW;

            // Ajuste especial para o CS-ATH nesta leg
            if (aircraftF.ID === "CS-ATH") {
                if (ZFW[i] > 5400 && ZFW[i] <= 5590) {
                    mtowLeg = csath_MTOW(ZFW[i]);
                } else if (ZFW[i] > 5590) {
                    mtowLeg = 6200;
                }
            }

            // Se já não chega ao min fuel desta leg, marcar como crítica
            if (fuelAtTOkg < l.minFuelKg) {
                critIndex = i;

                const f_mtow = Math.max(0, mtowLeg - ZFW[i]);
                const f_mlw = Math.max(0, l.tripKg + (MLW - ZFW[i]));
                const f_mrw = Math.max(0, MRW - ZFW[i] - fuelTaxiKg);

                maxPermitidoLegKg = Math.min(f_mtow, f_mlw, f_mrw);
                break;
            }

            // Pesos desta leg
            const towKg = ZFW[i] + fuelAtTOkg;
            const landingKg = towKg - l.tripKg;
            const mrwChk = ZFW[i] + fuelAtTOkg + fuelTaxiKg;

            // Verificar limites desta leg
            if (
                towKg > (mtowLeg + toleranceKg) ||
                mrwChk > (MRW + toleranceKg) ||
                landingKg > (MLW + toleranceKg)
            ) {
                const f_mtow = Math.max(0, mtowLeg - ZFW[i]);
                const f_mlw = Math.max(0, l.tripKg + (MLW - ZFW[i]));
                const f_mrw = Math.max(0, MRW - ZFW[i] - fuelTaxiKg);

                maxPermitidoLegKg = Math.min(f_mtow, f_mlw, f_mrw);
                critIndex = i;
                break;
            }

            // Combustível disponível para a próxima leg
            fuelAtTOkg = Math.max(0, fuelAtTOkg - l.tripKg);
        }

        // Máximo estrutural de fuel O/B na partida
        const maxFuelDepartureObKgByWeight = FmaxKg[0] + fuelTaxiKg;

        // Converter para lb
        const baseLbByWeight = Math.floor(maxFuelDepartureObKgByWeight * KG_TO_LB);

        // Máximo físico do tanque
        const maxFuelTankLb = getAircraftMaxFuelLb(aircraftF);

        // Aplicar limite do tanque
        const baseLb = maxFuelTankLb > 0
            ? Math.min(baseLbByWeight, maxFuelTankLb)
            : baseLbByWeight;

        let maxFuelDepartureLb = baseLb;

        // Afinar mais alguns lb sem ultrapassar o tanque
        for (let add = 1; add <= 3; add++) {
            const cand = baseLb + add;

            // Nunca passar o máximo do tanque
            if (maxFuelTankLb > 0 && cand > maxFuelTankLb) {
                break;
            }

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
            const maxPossivelLbByWeight = Math.floor(maxObNaCritKg * KG_TO_LB);
            const maxPossivelLb = maxFuelTankLb > 0
                ? Math.min(maxPossivelLbByWeight, maxFuelTankLb)
                : maxPossivelLbByWeight;

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

    // Usa o contentor da própria página (definido pelo spa-router) em vez de
    // document.body diretamente: assim os cartões de rota ficam escondidos
    // junto com o resto da página ao navegar para outra secção, em vez de
    // ficarem "presos" no body e visíveis por cima de outras páginas.
    const container = window.__spaActiveContainer || document.body;

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

    // Botão: mostrar/ocultar métricas das legs (TRAF, TOW, FOB, TRIP F, LW)
    const btnToggleMetrics = document.getElementById("btn-toggle-leg-metrics");
    if (btnToggleMetrics) {
        const applyMetricsVisibility = (hidden) => {
            document.body.classList.toggle("legs-metrics-hidden", hidden);
            btnToggleMetrics.setAttribute("aria-pressed", String(hidden));
            const label = hidden ? "Mostrar métricas das legs" : "Ocultar métricas das legs";
            btnToggleMetrics.title = label;
            btnToggleMetrics.setAttribute("aria-label", label);
        };

        applyMetricsVisibility(lsGet(LEG_METRICS_HIDDEN_KEY, false) === true);

        btnToggleMetrics.addEventListener("click", () => {
            const hidden = document.body.classList.contains("legs-metrics-hidden");
            const next = !hidden;
            lsSet(LEG_METRICS_HIDDEN_KEY, next);
            applyMetricsVisibility(next);
        });
    }

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
// 9.1 EFEITO "FLUTUANTE SOLTO" NA TOOLBAR AO FAZER SCROLL
// A toolbar acompanha o scroll (sticky), mas fica ligeiramente
// "atrasada" em relação ao movimento e assenta com uma pequena
// mola no fim, para não parecer rigidamente colada ao topo.
// -------------------------------------------------------
(function initToolbarFloatEffect() {
    const toolbar = document.querySelector(".toolbar-rotas");
    if (!toolbar) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const MAX_OFFSET_UP = 16;   // px — pode "atrasar-se" para cima sem risco (afasta-se do conteúdo)
    const MAX_OFFSET_DOWN = 6;  // px — para baixo tem de ficar bem abaixo da margem da toolbar, para não sobrepor o primeiro cartão
    const DRAG = 0.6;           // quanto o scroll "puxa" a toolbar
    const DECAY = 0.82;         // amortecimento da velocidade
    const EASE = 0.16;          // velocidade a que o offset persegue/assenta

    let lastY = window.scrollY;
    let velocity = 0;
    let offset = 0;
    let rafId = null;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    function tick() {
        const y = window.scrollY;

        // No topo da página (incluindo o "rubber-band" do iOS, que pode dar valores negativos),
        // não deixar qualquer deslocamento residual empurrar a toolbar para cima do primeiro cartão.
        if (y <= 0) {
            toolbar.style.transform = "";
            velocity = 0;
            offset = 0;
            lastY = y;
            rafId = null;
            return;
        }

        const delta = y - lastY;
        lastY = y;

        velocity = velocity * DECAY + delta * DRAG;
        offset = clamp(offset + (velocity - offset) * EASE, -MAX_OFFSET_UP, MAX_OFFSET_DOWN);

        toolbar.style.transform = offset ? `translateY(${offset.toFixed(2)}px)` : "";

        if (Math.abs(velocity) > 0.05 || Math.abs(offset) > 0.05) {
            rafId = requestAnimationFrame(tick);
        } else {
            toolbar.style.transform = "";
            velocity = 0;
            offset = 0;
            rafId = null;
        }
    }

    window.addEventListener("scroll", () => {
        if (!rafId) rafId = requestAnimationFrame(tick);
    }, { passive: true });
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
