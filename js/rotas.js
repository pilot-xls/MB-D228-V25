/*
 * Rotas | Gestão de Rotas e Legs
 * Versão: v2 (refatorado)
 * Objetivo:
 *  - Carregar rotas DEFAULT de /data/rotas.json apenas na primeira utilização
 *  - Manter dados do utilizador separados das defaults (localStorage -> ROTAS_USER_KEY)
 *  - Fechar todas as rotas ao entrar na página
 *  - Calcular campos da leg com base no avião ativo e na leg anterior
 *  - Código modular, comentado e de fácil manutenção
 *
 * Dependências esperadas no projeto:
 *  - /data/rotas.json          (rotas default)
 *  - /data/aircraft.json       (aviões default)
 *  - settings.js                (guarda avião ativo no localStorage)
 *  - dataLoader.js              (opcional; aqui usamos fetch direto com fallback)
 */

// ==========================
// 0) CONFIGURAÇÃO & KEYS
// ==========================
const ROTAS_USER_KEY = "rotasUserV1";     // estado de trabalho do utilizador
const AIRCRAFT_ACTIVE_KEY = "aircraftActive"; // avião ativo definido em settings.html

// Limites e defaults de negócio (ajusta conforme necessário)
const LIMITS = {
  maxFuelLb: 1600,
  maxTrafficKg: 800
};

// ==========================
// 1) UTILITÁRIOS DE I/O
// ==========================
async function loadJSON(path) {
  // Tenta usar fetch direto. Caso falhe, lança erro controlado.
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Falha a carregar ${path}: ${res.status}`);
  return res.json();
}

function lsGet(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ==========================
// 2) MODELOS DE DADOS
// ==========================
function novaLegData() {
  return {
    nome: "",
    minFuel: "",
    fuelOB: "",
    trafficLoad: { homens: 0, mulheres: 0, criancas: 0, extra: 0, total: "" },
    tripFuel: "",
    endurance: "",
    zfw: "",
    rampWeight: "",
    tow: "",
    landingWeight: ""
  };
}

function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ==========================
// 3) INICIALIZAÇÃO DE ESTADO
// ==========================
async function ensureUserRotasState() {
  let rotasUser = lsGet(ROTAS_USER_KEY);
  if (rotasUser && Array.isArray(rotasUser?.rotas)) return rotasUser; // já existe

  // Caso não exista, carregar defaults e guardar cópia no localStorage
  const defaults = await loadJSON("data/rotas.json");
  // Sanitizar estrutura mínima
  const sane = { rotas: Array.isArray(defaults?.rotas) ? defaults.rotas : [] };
  lsSet(ROTAS_USER_KEY, sane);
  return sane;
}

function getAircraftActiveSync() {
  // Lê o avião ativo guardado pelo settings.js
  const aircraft = lsGet(AIRCRAFT_ACTIVE_KEY);
  return aircraft || null; // pode ser null na primeira vez
}

async function getAircraftActive() {
  const activeId = lsGet(AIRCRAFT_ACTIVE_KEY) || localStorage.getItem("defaultAircraft");
  const data = await loadJSON("data/aircraft.json");

  // Se a estrutura for { default, aircraft: {..map..} }
  if (data && data.aircraft && !Array.isArray(data.aircraft)) {
    if (activeId && data.aircraft[activeId]) return data.aircraft[activeId];
    if (data.default && data.aircraft[data.default]) return data.aircraft[data.default];
    const firstKey = Object.keys(data.aircraft)[0];
    return data.aircraft[firstKey] || null;
  }

  // Se for array
  if (Array.isArray(data)) {
    if (activeId) {
      const found = data.find(a => a.ID === activeId);
      if (found) return found;
    }
    return data[0] || null;
  }

  return null;
}


// ==========================
// 4) CÁLCULOS DE LEGS
// ==========================
/**
 * Calcula campos derivados para uma leg, usando avião ativo e leg anterior.
 * Atualiza o objeto leg in-place e devolve-o.
 */
function computeLegDerived(leg, prevLeg, aircraft) {
  if (!leg || !aircraft) return leg;

  const toNum = v => Number(String(v ?? "").replace(",", "."));
  const lbToKg = 0.45359237;

  // --- Dados base ---
  const consumoHoraLb = toNum(aircraft.consumo) || 0;
  const pesoVazioKg = toNum(aircraft.BEW) || 0;
  const payloadKg = toNum(leg?.trafficLoad?.total) || 0;
  const tripFuelLb = toNum(leg?.tripFuel) || 0;
  let fuelOBLb = toNum(leg?.fuelOB) || 0;

  // --- Herdar fuel O/B da leg anterior ---
  if (!fuelOBLb && prevLeg) {
    const prevFuelLanding = toNum(prevLeg?.landingFuelLb);
    if (prevFuelLanding > 0) fuelOBLb = prevFuelLanding;
  }

  // --- Endurance (hh:mm) ---
  const endurance = fuelOBLb / consumoHoraLb;
  const horas = Math.floor(endurance);
  const minutos = Math.round((endurance - horas) * 60);
  leg.endurance = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;

  // --- ZFW, Ramp, TOW, Landing ---
  const pilotsKg = Number(localStorage.getItem("pilotsKg")) || 0;
  const zfwKg = pesoVazioKg + pilotsKg + payloadKg;
  leg.zfw = zfwKg > 0 ? `${Math.round(zfwKg)} kg` : "";

  const rampKg = zfwKg + fuelOBLb * lbToKg;
  leg.rampWeight = rampKg > 0 ? `${Math.round(rampKg)} kg` : "";

  const fuelTaxiKg = Number(localStorage.getItem("fuelTaxiKg")) || 0;
  const towKg = rampKg - fuelTaxiKg;
  leg.tow = isFinite(towKg) ? `${Math.round(Math.max(towKg, 0))} kg` : "";

  const landingKg = towKg - tripFuelLb * lbToKg;
  leg.landingWeight = isFinite(landingKg) ? `${Math.round(Math.max(landingKg, 0))} kg` : "";

  // --- Landing fuel (para encadeamento) ---
  const landingFuelLb = Math.max(fuelOBLb - tripFuelLb, 0);
  leg.landingFuelLb = landingFuelLb;
  if (prevLeg && typeof prevLeg === "object" && prevLeg.landingFuelLb !== undefined) {
    prevLeg.nextSuggestedFuel = `${Math.round(prevLeg.landingFuelLb)} lb`;
  }

  // --- Cálculos de máximos dinâmicos ---
  const MRW = toNum(aircraft.MRW) || 0;
  const MTOW = toNum(aircraft.MTOW) || 0;
  const MZFW = toNum(aircraft.MZFW) || 0;
  const MLW = toNum(aircraft.MLW || aircraft.MLOW) || 0;

  // Max Fuel possível (sem exceder MRW, MTOW ou MLW)
  const maxFuelByMRW = MRW - zfwKg;
  const maxFuelByMTOW = MTOW - zfwKg + fuelTaxiKg;
  const maxFuelByMLW = MLW - zfwKg + fuelTaxiKg + tripFuelLb * lbToKg;
  const maxFuelKg = Math.min(maxFuelByMRW, maxFuelByMTOW, maxFuelByMLW);
  const maxFuelLb = Math.round(maxFuelKg / lbToKg);

leg.maxFuelInfo = maxFuelLb > 0 
  ? `Max: ${Math.round(maxFuelLb)} lb (${Math.round(maxFuelLb * 0.45359237)} kg)` 
  : "Max:";


  // Max Payload possível (sem exceder MZFW, MTOW ou MRW)
  const maxPayloadByMZFW = MZFW - (pesoVazioKg + pilotsKg);
  const maxPayloadByMTOW = MTOW - (pesoVazioKg + pilotsKg + fuelOBLb * lbToKg - fuelTaxiKg);
  const maxPayloadByMRW = MRW - (pesoVazioKg + pilotsKg + fuelOBLb * lbToKg);
  const maxPayloadKg = Math.min(maxPayloadByMZFW, maxPayloadByMTOW, maxPayloadByMRW);

  leg.maxPayloadInfo = maxPayloadKg > 0
  ? `Max: ${Math.round(maxPayloadKg / 0.45359237)} lb (${Math.round(maxPayloadKg)} kg)`
  : "Max:";


  // --- Limites e cor de alerta ---
  const mtow = Number(aircraft.MTOW) || Infinity;
  const mrw = Number(aircraft.MRW) || Infinity;
  const mzfw = Number(aircraft.MZFW) || Infinity;
  const mlw = Number(aircraft.MLOW || aircraft.MLW) || Infinity;

  leg.limitColors = {
    zfw: zfwKg > mzfw ? "red" : "black",
    ramp: rampKg > mrw ? "red" : "black",
    tow: towKg > mtow ? "red" : "black",
    ldg: landingKg > mlw ? "red" : "black"
  };

  return leg;
}



// Recalcula todas as legs de uma rota, encadeando dependências
function recomputeRoute(rota, aircraft) {
  if (!rota || !Array.isArray(rota.legs)) return;
  let prev = null;

  rota.legs.forEach((leg, i) => {
    computeLegDerived(leg, prev, aircraft);

    // se existir uma leg anterior e esta leg não tiver Fuel O/B definido
    if (prev && (!leg.fuelOB || leg.fuelOB === "")) {
      const prevLanding = Number(prev.landingFuelLb) || 0;
      if (prevLanding > 0) {
        leg.nextSuggestedFuel = `${Math.round(prevLanding)} lb`;
      }
    }

    prev = leg;
  });
}


// ==========================
// 5) RENDERIZAÇÃO
// ==========================
function criarLegHTML(leg) {
  const maxFuelInfo = `MAX: ${LIMITS.maxFuelLb}lb / ${Math.round(LIMITS.maxFuelLb * 0.45359237)}kg`;
  const maxTrafficInfo = `MAX: ${LIMITS.maxTrafficKg}kg`;

  return `
  <div class="rota-leg" style="border-width:1px;border-radius:20px;border-style:groove;padding:5px;margin-top:10px;display:none;">
    <div style="display:flex;justify-content:space-between;margin-top:13px;">
      <input class="leg-nome" style="font-weight:bold;width:138px;border-width:1px;border-style:ridge;border-radius:10px;"
        placeholder="ex:CAT-PRM" value="${leg?.nome ?? ""}">
      <div style="display:flex;align-items:center;gap:21px;">
        <button class="btn-mb">MB</button>
      </div>
    </div>

    <div style="margin-top:10px;">
      <div class="row-inputleg" style="display:flex;align-items:flex-end;justify-content:space-between;
          border-top-width:1px;border-top-style:dotted;padding-bottom:12px;">
        <p style="margin-bottom:0;">Min Fuel O/B</p>
        <input class="min-fuel-input" placeholder="Lb" type="number" value="${leg?.minFuel ?? ""}">
      </div>

      <div class="row-inputleg" style="display:flex;align-items:flex-end;justify-content:space-between;
          border-top-width:1px;border-top-style:dotted;">
        <p style="margin-bottom:0;">Fuel O/B</p>
        <input class="fuel-ob-input"
               placeholder="${leg?.nextSuggestedFuel || 'Lb'}"
               type="number"
               value="${leg?.fuelOB ?? ''}">
      </div>
<p id="leg-max-fuel" style="font-size:12px;color:#555;margin:0;">${leg?.maxFuelInfo || ""}</p>

      <div class="row-inputleg" style="display:flex;align-items:flex-end;justify-content:space-between;
          border-top-width:1px;border-top-style:dotted;">
        <p style="margin-bottom:0;">Traffic Load</p>
        <input class="traffic-load-input" placeholder="Kg" type="number" value="${leg?.trafficLoad?.total ?? ""}">
      </div>
<p id="leg-max-traffic-load" style="font-size:12px;color:#555;margin:0;">${leg?.maxPayloadInfo || ""}</p>

      <div class="row-inputleg" style="display:flex;align-items:flex-end;justify-content:space-between;
          border-top-width:1px;border-top-style:dotted;">
        <p style="margin-bottom:0;">Trip fuel:</p>
        <input class="trip-fuel-input" placeholder="Lb" type="number" value="${leg?.tripFuel ?? ""}">
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




function criarRotaCardHTML(rota) {
  return `
  <div class="rota-card" data-id="${rota?.id || ""}" draggable="true" style="margin:20px auto;max-width:500px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:30px;align-items:flex-start;">
      <input class="nome-rota" value="${rota?.nome ?? ""}" style="font-weight:bold;font-size:20px;border:none;outline:none;background:transparent;width:70%;text-align:left;">
      <div style="gap:10px;display:flex;">
        <button class="del-rota" style="background-color:#dc3545;color:#ffffff;min-width:40px;border-radius:10px;">-</button>
        <button class="toggleBtn" style="color:#000000;min-width:40px;border-radius:10px;">▼</button>
      </div>
    </div>
  </div>`;
}



function renderRotas(rootEl, estado) {
  // Limpa render atual
  rootEl.querySelectorAll(".rota-card").forEach(el => el.remove());

  estado.rotas.forEach((rota) => {
    // Card da rota
    const rotaWrapper = document.createElement("div");
    rotaWrapper.innerHTML = criarRotaCardHTML(rota);
    const rotaCard = rotaWrapper.firstElementChild;

    // Legs
    (rota.legs || []).forEach(leg => {
      rotaCard.insertAdjacentHTML("beforeend", criarLegHTML(leg));
    });

    rootEl.appendChild(rotaCard);
  });
}

function closeAllRoutes(container) {
  container.querySelectorAll(".rota-card").forEach(card => {
    const btn = card.querySelector(".toggleBtn");
    const legs = card.querySelectorAll(".rota-leg");
    legs.forEach(div => div.style.display = "none");
    if (btn) btn.textContent = "▼";
  });
}

// ==========================
// 6) ESTADO & EVENTOS
// ==========================
function guardarEstadoRotas(estado) {
  if (!estado || !Array.isArray(estado.rotas)) return;
  if (estado.rotas.length === 0) return; // evita apagar defaults
  lsSet(ROTAS_USER_KEY, estado);
}


function attachEvents(container, estado, aircraft) {
 
  // Toggle mostrar/esconder legs de uma rota (fecha as outras automaticamente e faz scroll para o topo)
    container.addEventListener("click", (e) => {
    if (!e.target.classList.contains("toggleBtn")) return;

    const rotaCard = e.target.closest(".rota-card");
    const legs = rotaCard?.querySelectorAll(".rota-leg") || [];
    if (!legs.length) return;

    const esconder = legs[0].style.display !== "none";

    // Fecha todas as rotas antes de abrir a selecionada
    container.querySelectorAll(".rota-card").forEach(card => {
        card.querySelectorAll(".rota-leg").forEach(leg => leg.style.display = "none");
        const btn = card.querySelector(".toggleBtn");
        if (btn) btn.textContent = "▼";
    });

    // Se a rota estava aberta, fecha e sai
    if (esconder) return;

    // Abre a rota selecionada
    legs.forEach(div => div.style.display = "block");
    e.target.textContent = "▲";

    // Scroll suave até ao topo da rota aberta
    rotaCard.scrollIntoView({ behavior: "smooth", block: "start" });
    });



  // Adicionar/remover legs
container.addEventListener("click", (e) => {
  if (!(e.target.classList.contains("mais-leg") || e.target.classList.contains("menos-leg"))) return;

  const rotaCard = e.target.closest(".rota-card");
  const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
  const rota = estado.rotas[rotaIndex];
  const legAtual = e.target.closest(".rota-leg");
  const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legAtual);

  // === Adicionar leg ===
  if (e.target.classList.contains("mais-leg")) {
    rota.legs.splice(legIndex + 1, 0, novaLegData());
  }

  // === Remover leg ===
  if (e.target.classList.contains("menos-leg") && rota.legs.length > 1) {
    rota.legs.splice(legIndex, 1);
  }

  recomputeRoute(rota, aircraft);
  guardarEstadoRotas(estado);
  renderRotas(container, estado);

  // Reabrir automaticamente a mesma rota após render
  const novaRotaCard = container.querySelectorAll(".rota-card")[rotaIndex];
  if (novaRotaCard) {
    novaRotaCard.querySelectorAll(".rota-leg").forEach(div => {
      div.style.display = "block";
    });
    const toggleBtn = novaRotaCard.querySelector(".toggleBtn");
    if (toggleBtn) toggleBtn.textContent = "▲";
  }
});


  // Apagar rota inteira
  container.addEventListener("click", (e) => {
    if (!e.target.classList.contains("del-rota")) return;
    const rotaCard = e.target.closest(".rota-card");
    const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
    estado.rotas.splice(rotaIndex, 1);
    guardarEstadoRotas(estado);
    renderRotas(container, estado);
    closeAllRoutes(container);
  });

  // Guardar inputs e recalcular + sincronizar TODAS as legs visíveis da rota
container.addEventListener("input", (e) => {
  const rotaCard = e.target.closest(".rota-card");
  const legEl = e.target.closest(".rota-leg");
  if (!rotaCard || !legEl) return;

  const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
  const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legEl);
  const rotaData = estado.rotas[rotaIndex];
  const legData = rotaData.legs[legIndex];

  if (e.target.classList.contains("leg-nome")) legData.nome = e.target.value;
  if (e.target.classList.contains("min-fuel-input")) legData.minFuel = e.target.value;
  if (e.target.classList.contains("fuel-ob-input")) legData.fuelOB = e.target.value;
  if (e.target.classList.contains("trip-fuel-input")) legData.tripFuel = e.target.value;
  if (e.target.classList.contains("traffic-load-input")) {
    const total = Number(e.target.value) || 0;
    legData.trafficLoad = { ...(legData.trafficLoad || {}), total };
  }

  // Recalcular a rota completa
  recomputeRoute(rotaData, aircraft);
  guardarEstadoRotas(estado);

  
  // Atualizar DOM da rota
const legEls = rotaCard.querySelectorAll(".rota-leg");
rotaData.legs.forEach((ldata, i) => {
  const el = legEls[i];
  if (!el) return;

  // Atualizar textos
  el.querySelector(".endurance-info").textContent = ldata.endurance || "";
  el.querySelector(".zfw-info").textContent = ldata.zfw || "";
  el.querySelector(".ramp-weight-info").textContent = ldata.rampWeight || "";
  el.querySelector(".tow-info").textContent = ldata.tow || "";
  el.querySelector(".landing-weight-info").textContent = ldata.landingWeight || "";

  // Atualizar cores automaticamente conforme limites
  el.querySelector(".zfw-info").style.color = ldata.limitColors?.zfw || "black";
  el.querySelector(".ramp-weight-info").style.color = ldata.limitColors?.ramp || "black";
  el.querySelector(".tow-info").style.color = ldata.limitColors?.tow || "black";
  el.querySelector(".landing-weight-info").style.color = ldata.limitColors?.ldg || "black";

  // Atualizar placeholder da próxima leg se estiver vazia
  if (rotaData.legs[i + 1] && !rotaData.legs[i + 1].fuelOB) {
    const nextEl = legEls[i + 1]?.querySelector(".fuel-ob-input");
    if (nextEl) nextEl.placeholder = `${Math.round(ldata.landingFuelLb)} lb`;
  }
});

});



// Botão MB
container.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-mb")) return;

  const rotaCard = e.target.closest(".rota-card");
  const legEl = e.target.closest(".rota-leg");
  const rotaIndex = [...container.querySelectorAll(".rota-card")].indexOf(rotaCard);
  const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legEl);
  const legData = estado.rotas[rotaIndex].legs[legIndex];

  const lbToKg = 0.45359237;
  const legDataKg = structuredClone(legData);

  if (!legDataKg.trafficLoad) legDataKg.trafficLoad = {};
  legDataKg.trafficLoad.total = Number(legData.trafficLoad?.total || 0);

  // converter campos em kg
  ["minFuel", "fuelOB", "tripFuel"].forEach((campo) => {
    if (legDataKg[campo]) {
      legDataKg[campo] = Math.round(Number(legDataKg[campo]) * lbToKg);
    }
  });

  localStorage.setItem("mbLegSelecionada", JSON.stringify(legDataKg));
  window.location.href = "mb.html";
});



  // UX: selecionar input ao focar, fechar teclado
  document.addEventListener("focusin", ev => { if (ev.target.tagName === "INPUT") ev.target.select(); });
  document.addEventListener("touchstart", event => {
    if (!(event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA")) {
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) active.blur();
    }
  });

    // ==========================
    // Reordenar rotas por arrastar e largar
    // ==========================
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
  const novasRotas = [...container.querySelectorAll(".rota-card")].map(card => {
    const id = card.dataset.id;
    return estado.rotas.find(r => r.id === id);
  }).filter(Boolean);

  estado.rotas = novasRotas;
  guardarEstadoRotas(estado);
});

}

// ==========================
// 7) INTEGRAÇÃO COM SETTINGS | REPOR ORIGEM
// ==========================
// Sugerido: quando o utilizador clicar em "Repor valores de origem" em settings.html,
// esse código deve também limpar o estado das rotas do utilizador para voltar às defaults.
// Exemplo de função utilitária que podes chamar a partir do settings.js:
window.reporRotasParaOrigem = async function reporRotasParaOrigem() {
  localStorage.removeItem(ROTAS_USER_KEY);
  const defaults = await loadJSON("data/rotas.json");
  const sane = { rotas: Array.isArray(defaults?.rotas) ? defaults.rotas : [] };
  lsSet(ROTAS_USER_KEY, sane);
};

// ==========================
// 8) BOOTSTRAP DA PÁGINA ROTAS
// ==========================
(async function initRotasPage() {
  // Apenas corre em rotas.html
  const isRotas = document.location.pathname.endsWith("/rotas.html") || document.title.includes("Rotas");
  if (!isRotas) return;

  const container = document.body; // usa o body como root para simplicidade

  // Carregar estado do utilizador e avião ativo
  const [estado, aircraft] = await Promise.all([
    ensureUserRotasState(),
    getAircraftActive()
  ]);

  // Recalcular todas as rotas com o avião ativo
  (estado.rotas || []).forEach(rota => recomputeRoute(rota, aircraft));
  guardarEstadoRotas(estado);

  // Renderizar e garantir que arrancam recolhidas
  renderRotas(container, estado);
  closeAllRoutes(container);

  // Anexar eventos
  attachEvents(container, estado, aircraft);

  // Botão "+ Nova Rota" se existir
  const btnNova = document.getElementById("btn-nova-rota");
  
  if (btnNova) {
    btnNova.addEventListener("click", () => {
      const nomeRota = prompt("Qual é o nome da nova rota?");
      if (!nomeRota) return;
      const nova = { id: crypto.randomUUID(), nome: nomeRota, legs: [novaLegData()] };

      estado.rotas.push(nova);
      recomputeRoute(nova, aircraft);
      guardarEstadoRotas(estado);
      renderRotas(container, estado);
      closeAllRoutes(container);
    });
  }
})();