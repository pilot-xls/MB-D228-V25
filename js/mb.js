// mb.js
document.addEventListener("DOMContentLoaded", async () => {
  const { aircraftData, defaultId } = await ensureSettingsData();

  // preencher dados do avião default
  if (defaultId && aircraftData[defaultId]) {
    const aircraft = aircraftData[defaultId];
    document.getElementById("ac-selected").innerText = aircraft.matricula || defaultId;
    document.getElementById("basicWeight").innerText = aircraft.BEW || "0";
  }

  // preencher dados da leg selecionada
  const dados = JSON.parse(localStorage.getItem("mbLegSelecionada") || "null");
  if (dados) {
    document.getElementById("nomeLeg").innerText = dados.nomeLeg;
    document.getElementById("manualPayload").value = dados.trafficLoad;
    document.getElementById("fuel").value = dados.fuelOB;
    document.getElementById("fuelDest").value = dados.tripFuel;
  }

  // guardar alterações nos inputs
  document.querySelectorAll("input").forEach(inp => {
    inp.addEventListener("focus", function() { this.select(); });
    inp.addEventListener("input", () => {
      if (!dados) return;
      const atualizado = {
        ...dados,
        trafficLoad: document.getElementById("manualPayload").value,
        fuelOB: document.getElementById("fuel").value,
        tripFuel: document.getElementById("fuelDest").value
      };
      localStorage.setItem("mbLegSelecionada", JSON.stringify(atualizado));
    });
  });
});

// formatar números no estilo "00 000,0"
function formatNumber(num) {
  return num.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

// calcular tabela Mass & Balance
async function exec_calculo() {
  const { aircraftData, defaultId } = await ensureSettingsData();
  if (!defaultId || !aircraftData[defaultId]) return;
  const ac = aircraftData[defaultId];

  // inputs
  const pilots = parseFloat(document.getElementById("pilots").value) || 0;
  const payload = parseFloat(document.getElementById("manualPayload").value) || 0;
  const fuel = parseFloat(document.getElementById("fuel").value) || 0;
  const fuelTaxi = parseFloat(document.getElementById("fuelTaxi").value) || 0;
  const fuelDest = parseFloat(document.getElementById("fuelDest").value) || 0;

  // BEW e braços
  const basicWeight = parseFloat(ac.BEW) || 0;
  const armBEW = parseFloat(ac.armBEW) || 0;
  const armPilots = parseFloat(ac.armPilotos) || 0;
  const armPayload = parseFloat(ac.armPayload) || 0;
  const armFuel = parseFloat(ac.armFuel) || 0;
  
  // valores da formula CG%
  const MAC_ZERO = 7.26;
  const MAC_DIV = 2.042;

  // momentos individuais
  const momentBasic = basicWeight * armBEW;
  const momentPilots = pilots * armPilots;
  const momentPayload = payload * armPayload;
  const momentFuel = fuel * armFuel;
  const momentTaxi = fuelTaxi * armFuel;
  const momentDest = fuelDest * armFuel;
  
  // atualizar momentos
  document.getElementById("basicMoment").innerText   = formatNumber(momentBasic);
  document.getElementById("momentPilots").innerText  = formatNumber(momentPilots);
  document.getElementById("momentPayload").innerText = formatNumber(momentPayload);
  document.getElementById("momentFuel").innerText    = formatNumber(momentFuel);
  document.getElementById("momentTaxi").innerText    = formatNumber(momentTaxi);
  document.getElementById("momentDest").innerText    = formatNumber(momentDest);
  
  // pesos
  const zfw = basicWeight + pilots + payload;
  const rampWeight = zfw + fuel;
  const tow = rampWeight - fuelTaxi;
  const lw = tow - fuelDest;

  document.getElementById("zfw").innerText         = zfw;
  document.getElementById("rampWeight").innerText  = rampWeight;
  document.getElementById("takeoffWeight").innerText = tow;
  document.getElementById("landingWeight").innerText = lw;

  // momentos agregados
  document.getElementById("momentZfw").innerText     = formatNumber(momentBasic + momentPilots + momentPayload);
  document.getElementById("momentRamp").innerText    = formatNumber(momentBasic + momentPilots + momentPayload + momentFuel);
  document.getElementById("momentTakeoff").innerText = formatNumber(momentBasic + momentPilots + momentPayload + (fuel - fuelTaxi) * armFuel);
  document.getElementById("momentLanding").innerText = formatNumber(momentBasic + momentPilots + momentPayload + (fuel - fuelTaxi - fuelDest) * armFuel);

  // --- MACs ---
  const mZFW = momentBasic + momentPilots + momentPayload;
  const mRamp = momentBasic + momentPilots + momentPayload + momentFuel;
  const mTO   = momentBasic + momentPilots + momentPayload + (fuel - fuelTaxi) * armFuel;
  const mLDG  = momentBasic + momentPilots + momentPayload + (fuel - fuelTaxi - fuelDest) * armFuel;

  const macZfw     = ((mZFW / zfw - MAC_ZERO) / MAC_DIV) * 100;
  const macRamp    = ((mRamp / rampWeight - MAC_ZERO) / MAC_DIV) * 100;
  const macTakeoff = ((mTO / tow - MAC_ZERO) / MAC_DIV) * 100;
  const macLanding = ((mLDG / lw - MAC_ZERO) / MAC_DIV) * 100;

  // --- Infos cruzadas Payload / Fuel ---
  const maxFuelKg = (parseFloat(ac.MRW) || 0) - (basicWeight + pilots + payload);
  const maxFuelLb = maxFuelKg * 2.20462;

  const maxPayloadKg = (parseFloat(ac.MTOW) || 0) - (basicWeight + pilots + fuel);
  const maxPayloadLb = maxPayloadKg * 2.20462;

  // linha ZFW
  const zfwInfoCell = document.getElementById("zfw").closest("tr").querySelector("td:last-child");
  if (zfwInfoCell) zfwInfoCell.innerHTML = `MAC: ${macZfw.toFixed(1)}%`;

  // linha Ramp
  const rampInfoCell = document.getElementById("rampRow").querySelector("td:last-child");
  if (rampInfoCell) rampInfoCell.innerHTML = `MAC: ${macRamp.toFixed(1)}%`;

  // linha Takeoff
  const takeoffInfoCell = document.getElementById("takeoffRow").querySelector("td:last-child");
  if (takeoffInfoCell) takeoffInfoCell.innerHTML = `MAC: ${macTakeoff.toFixed(1)}%`;

  // linha Landing
  const landingInfoCell = document.getElementById("landingRow").querySelector("td:last-child");
  if (landingInfoCell) landingInfoCell.innerHTML = `MAC: ${macLanding.toFixed(1)}%`;

  // linha Payload
  const payloadInfoCell = document.getElementById("manualPayload").closest("tr").querySelector("td:last-child");
  if (payloadInfoCell) {
    payloadInfoCell.innerHTML = `
      ARM ${armPayload.toFixed(1)}<br>
      MAX Fuel: ${maxFuelKg >= 0 ? maxFuelKg.toFixed(0) : 0} kg / ${maxFuelLb >= 0 ? maxFuelLb.toFixed(0) : 0} lb
    `;
  }

  // linha Fuel loading
  const fuelInfoCell = document.getElementById("fuel").closest("tr").querySelector("td:last-child");
  if (fuelInfoCell) {
    fuelInfoCell.innerHTML = `
      ARM ${armFuel.toFixed(3)}<br>
      MAX Payload: ${maxPayloadKg >= 0 ? maxPayloadKg.toFixed(0) : 0} kg / ${maxPayloadLb >= 0 ? maxPayloadLb.toFixed(0) : 0} lb
    `;
  }

  // --- validações de limites ---
  function checkLimit(rowId, value, limit, label = "") {
    const row = document.getElementById(rowId);
    const infoCell = row.querySelector("td:last-child");
    if (value > limit) {
      row.classList.add("limit-exceed");
      if (infoCell) infoCell.innerHTML = `<span class="info-warning">MAX: ${limit} ${label}</span>`;
    } else {
      row.classList.remove("limit-exceed");
      // não apagar infos normais
    }
  }

  checkLimit("zfw", zfw, parseFloat(ac.MZFW) || Infinity, "kg");
  checkLimit("rampRow", rampWeight, parseFloat(ac.MRW) || Infinity, "kg");
  checkLimit("takeoffRow", tow, parseFloat(ac.MTOW) || Infinity, "kg");
  checkLimit("landingRow", lw, parseFloat(ac.MLOW) || Infinity, "kg");
}

// ligar cálculos
document.addEventListener("DOMContentLoaded", () => {
  exec_calculo();
  document.querySelectorAll("input").forEach(inp => {
    inp.addEventListener("input", exec_calculo);
  });
});

// Fecha teclado ao clicar fora dos inputs
document.addEventListener("touchstart", function (event) {
  const isInput = event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA";
  if (!isInput) {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
      activeElement.blur();
    }
  }
});

