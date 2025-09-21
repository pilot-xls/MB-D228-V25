// -------------------
// Estado global das rotas (é carregado do localStorage)
// -------------------
let estadoRotas = JSON.parse(localStorage.getItem("estadoRotas") || '{"rotas":[]}');

// Função: guardar o estado atualizado no localStorage
function guardarEstado() {
  localStorage.setItem("estadoRotas", JSON.stringify(estadoRotas));
}

// Função: cria um objeto leg vazio (valores default)
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

// -------------------
// Botão "+ Nova Rota"
// -------------------
const btnNovaRota = document.getElementById("btn-nova-rota");
btnNovaRota.addEventListener("click", () => {
  const nomeRota = prompt("Qual é o nome da nova rota?");
  if (!nomeRota) return;

  const rota = { nome: nomeRota, legs: [novaLegData()] };
  estadoRotas.rotas.push(rota);
  guardarEstado();
  reconstruirRotas();
});

// -------------------
// Template HTML de uma leg
// -------------------
function criarLegHTML() {
  return `
  <div class="rota-leg" style="border-width: 1px; border-radius: 20px; border-style: groove; padding: 5px; margin-top: 10px;">
    <div style="display: flex; justify-content: space-between; margin-top: 13px;">
        <input class="leg-nome" style="font-weight: bold; width: 138px; border-width: 1px; border-style: ridge; border-radius: 10px;" placeholder="ex:CAT-PRM">
        <div style="display: flex; align-items: center; gap: 21px;">
            <button>MB</button>
        </div>
    </div>
    <div style="margin-top: 10px;">
        <div class="row-inputleg" style="display: flex; align-items: flex-end; justify-content: space-between; border-top-width: 1px; border-top-style: dotted; padding-bottom: 12px;">
            <p style="margin-bottom: 0;">Min Fuel O/B</p>
            <input class="min-fuel-input" placeholder="Lb" type="number">
        </div>
        <div class="row-inputleg" style="display: flex; align-items: flex-end; justify-content: space-between; border-top-width: 1px; border-top-style: dotted;">
            <p style="margin-bottom: 0;">Fuel O/B</p>
            <input class="fuel-ob-input" placeholder="Lb" type="number">
        </div>
        <p class="max-fuel-lb-kg-info" style="font-size: 12px; margin-bottom: 0px; margin-top: 0;">MAX: 1600lb / 800kg</p>
        <div class="row-inputleg" style="display: flex; align-items: flex-end; justify-content: space-between; border-top-width: 1px; border-top-style: dotted;">
            <p style="margin-bottom: 0;">Traffic Load</p>
            <input class="traffic-load-input" placeholder="Kg" type="number">
        </div>
        <p class="max-traffic-load-info" style="font-size: 12px; margin-bottom: 0px; margin-top: 0;">MAX: 800kg</p>
        <div class="row-inputleg" style="display: flex; align-items: flex-end; justify-content: space-between; border-top-width: 1px; border-top-style: dotted;">
            <p style="margin-bottom: 0;">Trip fuel:</p>
            <input class="trip-fuel-input" placeholder="Lb" type="number">
        </div>
        <div style="display: flex; justify-content: space-between; border-top-width: 1px; border-top-style: dotted; padding-top: 0px; margin-top: 12px;">
            <p>Endurance:</p>
            <p class="endurance-info"></p>
        </div>
        <div style="display: flex; justify-content: space-between; border-top-width: 1px; border-top-style: dotted;">
            <p>ZFW:</p>
            <p class="zfw-info"></p>
        </div>
        <div style="display: flex; justify-content: space-between; border-top-width: 1px; border-top-style: dotted;">
            <p>Ramp weight:</p>
            <p class="ramp-weight-info"></p>
        </div>
        <div style="display: flex; justify-content: space-between; border-top-width: 1px; border-top-style: dotted;">
            <p>TOW:</p>
            <p class="tow-info"></p>
        </div>
        <div style="display: flex; justify-content: space-between; border-top-width: 1px; border-top-style: dotted; border-bottom-width: 1px; border-bottom-style: dotted;">
            <p>LW:</p>
            <p class="landing-weight-info"></p>
        </div>
    </div>
    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 5px;">
        <button class="menos-leg">- Leg</button>
        <button class="mais-leg">+ Leg</button>
    </div>
  </div>`;
}

// Função: preencher os campos de uma leg com dados do estado
function preencherLeg(legEl, legData) {
  legEl.querySelector(".leg-nome").value = legData.nome || "";
  legEl.querySelector(".min-fuel-input").value = legData.minFuel || "";
  legEl.querySelector(".fuel-ob-input").value = legData.fuelOB || "";
  legEl.querySelector(".traffic-load-input").value = legData.trafficLoad?.total || "";
  legEl.querySelector(".trip-fuel-input").value = legData.tripFuel || "";
  legEl.querySelector(".endurance-info").innerText = legData.endurance || "";
  legEl.querySelector(".zfw-info").innerText = legData.zfw || "";
  legEl.querySelector(".ramp-weight-info").innerText = legData.rampWeight || "";
  legEl.querySelector(".tow-info").innerText = legData.tow || "";
  legEl.querySelector(".landing-weight-info").innerText = legData.landingWeight || "";
}

// Função: recria todas as rotas e legs no DOM com base no estado
function reconstruirRotas() {
  document.querySelectorAll(".rota-card").forEach(el => el.remove());

  estadoRotas.rotas.forEach(rota => {
    const rotaCard = document.createElement("div");
    rotaCard.classList.add("rota-card");
    rotaCard.style.margin = "20px auto";
    rotaCard.style.maxWidth = "500px";

    rotaCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px; align-items: flex-start;">
        <input class="nome-rota" value="${rota.nome}"
          style="font-weight: bold; font-size: 20px; border: none; outline: none; background: transparent; width: 70%; text-align: left;">
        <div style="gap: 10px; display: flex;">
          <button class="del-rota" style="background-color: #dc3545; color: #ffffff; min-width: 40px; border-radius: 10px;">-</button>
          <button class="toggleBtn" style="color: #000000; min-width: 40px; border-radius: 10px;">▲</button>
        </div>
      </div>
    `;

    rota.legs.forEach(leg => {
      rotaCard.insertAdjacentHTML("beforeend", criarLegHTML());
      const novaLeg = rotaCard.querySelector(".rota-leg:last-child");
      preencherLeg(novaLeg, leg);
    });

    document.body.appendChild(rotaCard);
  });
}

// -------------------
// Toggle das Legs (mostrar/esconder todas numa rota)
// -------------------
document.addEventListener("click", e => {
  if (e.target.classList.contains("toggleBtn")) {
    const rotaCard = e.target.closest(".rota-card");
    const legs = rotaCard?.querySelectorAll(".rota-leg") || [];
    if (!legs.length) return;
    const escondido = legs[0].style.display === "none";
    legs.forEach(div => div.style.display = escondido ? "block" : "none");
    e.target.textContent = escondido ? "▲" : "▼";
  }
});

// -------------------
// Adicionar e Remover Legs
// -------------------
document.addEventListener("click", e => {
  if (e.target.classList.contains("mais-leg")) {
    const rotaCard = e.target.closest(".rota-card");
    const legAtual = e.target.closest(".rota-leg");
    const rotaIndex = [...document.querySelectorAll(".rota-card")].indexOf(rotaCard);
    const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legAtual);

    estadoRotas.rotas[rotaIndex].legs.splice(legIndex + 1, 0, novaLegData());
    guardarEstado();
    legAtual.insertAdjacentHTML("afterend", criarLegHTML());
  }

  if (e.target.classList.contains("menos-leg")) {
    const rotaCard = e.target.closest(".rota-card");
    const legAtual = e.target.closest(".rota-leg");
    const rotaIndex = [...document.querySelectorAll(".rota-card")].indexOf(rotaCard);
    const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legAtual);

    if (estadoRotas.rotas[rotaIndex].legs.length > 1) {
      estadoRotas.rotas[rotaIndex].legs.splice(legIndex, 1);
      guardarEstado();
      legAtual.remove();
    }
  }
});

// -------------------
// Apagar rota inteira
// -------------------
document.addEventListener("click", e => {
  if (e.target.classList.contains("del-rota")) {
    const rotaCard = e.target.closest(".rota-card");
    const rotaIndex = [...document.querySelectorAll(".rota-card")].indexOf(rotaCard);
    estadoRotas.rotas.splice(rotaIndex, 1);
    guardarEstado();
    rotaCard.remove();
  }
});

// -------------------
// Guardar inputs normais diretamente no estado
// -------------------
document.addEventListener("input", e => {
  const rotaCard = e.target.closest(".rota-card");
  const legEl = e.target.closest(".rota-leg");
  if (!rotaCard || !legEl) return;

  const rotaIndex = [...document.querySelectorAll(".rota-card")].indexOf(rotaCard);
  const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legEl);
  const legData = estadoRotas.rotas[rotaIndex].legs[legIndex];

  if (e.target.classList.contains("leg-nome")) legData.nome = e.target.value;
  if (e.target.classList.contains("min-fuel-input")) legData.minFuel = e.target.value;
  if (e.target.classList.contains("fuel-ob-input")) legData.fuelOB = e.target.value;
  if (e.target.classList.contains("trip-fuel-input")) legData.tripFuel = e.target.value;
  if (e.target.classList.contains("traffic-load-input")) legData.trafficLoad.total = e.target.value;

  guardarEstado();
});

// -------------------
// Botão MB (guarda a leg selecionada no localStorage e vai para mb.html)
// -------------------
document.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON" && e.target.textContent.trim() === "MB") {
    const rotaCard = e.target.closest(".rota-card");
    const legEl = e.target.closest(".rota-leg");
    if (!rotaCard || !legEl) return;

    const rotaIndex = [...document.querySelectorAll(".rota-card")].indexOf(rotaCard);
    const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legEl);

    const legData = estadoRotas.rotas[rotaIndex].legs[legIndex];

    localStorage.setItem("mbLegSelecionada", JSON.stringify(legData));
    window.location.href = "mb.html";
  }
});

// -------------------
// Popup Payload (por leg)
// -------------------
const modalPayload = document.getElementById("popup-editar-payload");
const btnLimparPay = document.getElementById("popup-btn-limpar-payL");
const btnGuardarPay = document.getElementById("popup-btn-Guardar-payL");
let legAtiva = null;

// Abre popup com valores guardados da leg
document.addEventListener("focusin", e => {
  if (e.target.classList.contains("traffic-load-input")) {
    legAtiva = e.target.closest(".rota-leg");
    const rotaCard = legAtiva.closest(".rota-card");
    const rotaIndex = [...document.querySelectorAll(".rota-card")].indexOf(rotaCard);
    const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legAtiva);

    const dados = estadoRotas.rotas[rotaIndex].legs[legIndex].trafficLoad;
    document.getElementById("ppHomens").value = dados.homens || 0;
    document.getElementById("ppMulheres").value = dados.mulheres || 0;
    document.getElementById("ppCriancas").value = dados.criancas || 0;
    document.getElementById("ppBagagem").value = dados.extra || 0;
    document.getElementById("ppTotal").innerText = dados.total || 0;

    if (modalPayload) modalPayload.style.display = "block";
  }
});

// Botão limpar popup (só limpa campos visuais)
if (btnLimparPay) {
  btnLimparPay.addEventListener("click", () => {
    ["ppHomens","ppMulheres","ppCriancas","ppBagagem"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = 0;
    });
    document.getElementById("ppTotal").innerText = 0;
  });
}

// Botão guardar popup (atualiza leg ativa)
if (btnGuardarPay) {
  btnGuardarPay.addEventListener("click", () => {
    if (!legAtiva) return;
    const rotaCard = legAtiva.closest(".rota-card");
    const rotaIndex = [...document.querySelectorAll(".rota-card")].indexOf(rotaCard);
    const legIndex = [...rotaCard.querySelectorAll(".rota-leg")].indexOf(legAtiva);

    const homens = parseInt(document.getElementById("ppHomens").value) || 0;
    const mulheres = parseInt(document.getElementById("ppMulheres").value) || 0;
    const criancas = parseInt(document.getElementById("ppCriancas").value) || 0;
    const extra = parseInt(document.getElementById("ppBagagem").value) || 0;
    const total = homens + mulheres + criancas + extra;

    estadoRotas.rotas[rotaIndex].legs[legIndex].trafficLoad = { homens, mulheres, criancas, extra, total };
    guardarEstado();

    document.getElementById("ppTotal").innerText = total;
    modalPayload.style.display = "none";
    legAtiva = null;
    reconstruirRotas();
  });
}

// -------------------
// UX extra (selecionar input ao focar, fechar teclado mobile)
// -------------------
document.addEventListener("focusin", e => {
  if (e.target.tagName === "INPUT") e.target.select();
});
document.addEventListener("touchstart", event => {
  if (!(event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA")) {
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) active.blur();
  }
});

// -------------------
// Inicialização
// -------------------
reconstruirRotas();
