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
    document.getElementById("nomeLeg").innerText = dados.nome;
    document.getElementById("manualPayload").value = dados.trafficLoad.total;
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

  const maxPayloadKg = (parseFloat(ac.MTOW) || 0) - (basicWeight + pilots + fuel - fuelTaxi);
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
      MAX Fuel: ${maxFuelKg >= 0 ? maxFuelKg.toFixed(0) : 0} kg (${maxFuelLb >= 0 ? maxFuelLb.toFixed(0) : 0} lb)
    `;
  }

  // linha Fuel loading
  const fuelInfoCell = document.getElementById("fuel").closest("tr").querySelector("td:last-child");
  if (fuelInfoCell) {
    fuelInfoCell.innerHTML = `
      ARM ${armFuel.toFixed(3)}<br>
      MAX Payload: ${maxPayloadKg >= 0 ? maxPayloadKg.toFixed(0) : 0} kg (${maxPayloadLb >= 0 ? maxPayloadLb.toFixed(0) : 0} lb)
    `;
  }

  // --- validações de limites ---
  function checkLimit(rowId, value, limit, label = "") {
    const row = document.getElementById(rowId);
    const infoCell = row.querySelector("td:last-child");
    if (value > limit) {
      row.classList.add("limit-exceed");
      /*if (infoCell) infoCell.innerHTML = `<span class="info-warning">MAX: ${limit} ${label}</span>`;*/
    } else {
      row.classList.remove("limit-exceed");
      // não apagar infos normais
    }
  }

  checkLimit("zfw", zfw, parseFloat(ac.MZFW) || Infinity, "kg");
  checkLimit("rampRow", rampWeight, parseFloat(ac.MRW) || Infinity, "kg");
  checkLimit("takeoffRow", tow, parseFloat(ac.MTOW) || Infinity, "kg");
  checkLimit("landingRow", lw, parseFloat(ac.MLOW) || Infinity, "kg");

    // -- Desenhar MAC% na imagem
    desenharPontos([
    { mac: macZfw,     peso: zfw, cor: "blue",   label: "ZFW" },
    { mac: macTakeoff, peso: tow, cor: "green",  label: "TOW" },
    { mac: macLanding, peso: lw,  cor: "orange", label: "LDG" }
    ]);

}

// ligar cálculos
document.addEventListener("DOMContentLoaded", () => {
  exec_calculo();
  document.querySelectorAll("input").forEach(inp => {
    inp.addEventListener("input", exec_calculo);
  });
});

// --------------------------------------
// Fuções para desenhas MAC% na Imagem
// --------------------------------------

// --- Limites do envelope em píxeis dentro do viewBox 400x300 (ajusta com a tua imagem)
// --- Tabela de limites (direto da tua folha)
const tabelaLimites = [
  { peso: 7000, xEsq: 33,  yEsq: -44, xDir: 356, yDir: -44 },
  { peso: 6800, xEsq: 37,  yEsq: -25, xDir: 351, yDir: -25 },
  { peso: 6600, xEsq: 41,  yEsq: -7,  xDir: 346, yDir: -7  },
  { peso: 6400, xEsq: 46,  yEsq: 11,  xDir: 341, yDir: 11  },
  { peso: 6200, xEsq: 50,  yEsq: 30,  xDir: 336, yDir: 30  },
  { peso: 6000, xEsq: 54,  yEsq: 48,  xDir: 331, yDir: 48  },
  { peso: 5800, xEsq: 59,  yEsq: 67,  xDir: 326, yDir: 67  },
  { peso: 5600, xEsq: 63,  yEsq: 86,  xDir: 321, yDir: 86  },
  { peso: 5400, xEsq: 67,  yEsq: 104, xDir: 316, yDir: 104 },
  { peso: 5200, xEsq: 71,  yEsq: 122, xDir: 311, yDir: 122 },
  { peso: 5000, xEsq: 76,  yEsq: 141, xDir: 306, yDir: 141 },
  { peso: 4800, xEsq: 81,  yEsq: 160, xDir: 301, yDir: 160 },
  { peso: 4600, xEsq: 85,  yEsq: 178, xDir: 296, yDir: 178 },
  { peso: 4400, xEsq: 89,  yEsq: 197, xDir: 291, yDir: 197 },
  { peso: 4200, xEsq: 93,  yEsq: 215, xDir: 286, yDir: 215 },
  { peso: 4000, xEsq: 98,  yEsq: 233, xDir: 281, yDir: 233 },
  { peso: 3800, xEsq: 102, yEsq: 252, xDir: 277, yDir: 252 },
  { peso: 3600, xEsq: 106, yEsq: 271, xDir: 272, yDir: 271 },
  { peso: 3400, xEsq: 111, yEsq: 289, xDir: 268, yDir: 289 },
  { peso: 3200, xEsq: 115, yEsq: 308, xDir: 262, yDir: 308 },
  { peso: 3000, xEsq: 119, yEsq: 326, xDir: 257, yDir: 326 }
];

// --- Interpolação linear entre dois pontos
function interpola(p1, p2, peso) {
  const t = (peso - p1.peso) / (p2.peso - p1.peso);
  return {
    xEsq: p1.xEsq + t * (p2.xEsq - p1.xEsq),
    yEsq: p1.yEsq + t * (p2.yEsq - p1.yEsq),
    xDir: p1.xDir + t * (p2.xDir - p1.xDir),
    yDir: p1.yDir + t * (p2.yDir - p1.yDir)
  };
}

// --- Encontrar limites para peso atual
function limitesNoPeso(peso) {
  for (let i = 0; i < tabelaLimites.length - 1; i++) {
    const a = tabelaLimites[i];
    const b = tabelaLimites[i+1];
    if (peso <= a.peso && peso >= b.peso) {
      return interpola(a, b, peso);
    }
  }
  return null;
}

// --- Converter %MAC + peso em coordenadas
function toCoords(mac, peso) {
  const ref = limitesNoPeso(peso);
  if (!ref) return {x:0, y:0};

  const macMin = 16;
  const macMax = 42;

  const x = ref.xEsq + ((mac - macMin) / (macMax - macMin)) * (ref.xDir - ref.xEsq);
  const y = ref.yEsq; // yEsq == yDir porque as linhas são horizontais
  return {x, y};
}


// desenhar pontos e labels no SVG
function desenharPontos(resultados) {
  const svg = document.getElementById("cg-svg");

  // limpa pontos/labels anteriores
  svg.querySelectorAll(".ponto, .label").forEach(el => el.remove());

  resultados.forEach(r => {
    const {x, y} = toCoords(r.mac, r.peso);

    // ponto
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 5);
    circle.setAttribute("fill", r.cor);
    circle.classList.add("ponto");
    svg.appendChild(circle);

    // label (pequeno texto ao lado do ponto)
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x + 8);
    text.setAttribute("y", y - 8);
    text.setAttribute("fill", r.cor);
    text.setAttribute("font-size", "12px");
    text.setAttribute("font-weight", "bold");
    text.classList.add("label");
    text.textContent = r.label;
    svg.appendChild(text);
  });
}


