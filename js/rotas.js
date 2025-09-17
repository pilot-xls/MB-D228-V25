const btnNovaRota = document.querySelector(".btn");

btnNovaRota.addEventListener("click", () => {
  // pede o nome da rota
  const nomeRota = prompt("Qual é o nome da nova rota?");
  if (!nomeRota) return; // se cancelar ou não escrever nada, não cria

  const rotaCard = document.createElement("div");
  rotaCard.classList.add("rota-card");
  rotaCard.style.marginTop = "20px";
  rotaCard.style.maxWidth = "500px";
  rotaCard.style.marginLeft = "auto";
  rotaCard.style.marginRight = "auto";

  rotaCard.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 30px; align-items: flex-start;">
      <input class="nome-rota" value="server" style="font-weight: bold; font-size: 20px; border: none; outline: none; background: transparent; width: 70%; text-align: left;">

      <div style="gap: 10px; display: flex;">
        <button class="del-rota" style="background-color: #dc3545; color: #ffffff; min-width: 40px; border-radius: 10px;">-</button>
        <button class="toggleBtn" style="color: #000000; min-width: 40px; border-radius: 10px;">▲</button>
      </div>
    </div>
    ${criarLegHTML()}
    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 5px;">
      <button class="menos-leg">- Leg</button>
      <button class="mais-leg">+ Leg</button>
    </div>
  `;

  document.body.appendChild(rotaCard);
});


// Função para gerar uma leg completa
function criarLegHTML() {
  return `
  <div class="rota-leg" style="border-width: 1px; border-radius: 20px; border-style: groove; padding: 5px; margin-top: 10px;">
    <div style="display: flex; justify-content: space-between; margin-top: 13px;">
      <input style="font-weight: bold; width: 138px; border-width: 1px; border-style: ridge; border-radius: 10px;" value="LEG - (CAT-PRM)">
      <div style="display: flex; align-items: center; gap: 21px;">
        <button>MB</button>
      </div>
    </div>
    <div style="margin-top: 10px;">
      <div>
        <div style="display: flex; align-items: baseline; justify-content: space-between; border-top-width: 1px; border-top-style: dotted;">
          <p style="margin-bottom: 0;">Fuel O/B</p>
          <input>
        </div>
        <p style="font-size: 12px; margin-bottom: 0px; margin-top: 0;">MAX: 1600lb / 800kg</p>
      </div>
      <div>
        <div style="display: flex; align-items: baseline; justify-content: space-between; border-top-width: 1px; border-top-style: dotted;">
          <p style="margin-bottom: 0;">Traffic Load</p>
          <input>
        </div>
        <p style="font-size: 12px; margin-bottom: 0px; margin-top: 0;">MAX: 1600lb / 800kg</p>
      </div>
      <div>
        <div style="display: flex; align-items: baseline; justify-content: space-between; border-top-width: 1px; border-top-style: dotted;">
          <p style="margin-bottom: 0;">Trip fuel:</p>
          <input>
        </div>
      </div>
      <p style="border-top-width: 1px; border-top-style: dotted;">Endurance:</p>
      <p style="border-top-width: 1px; border-top-style: dotted;">ZFW:</p>
      <p style="border-top-width: 1px; border-top-style: dotted;">TOW:</p>
      <p style="border-top-width: 1px; border-top-style: dotted;">LW:</p>
    </div>
  </div>
  `;
}

// Toggle das legs
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("toggleBtn")) {
    const btn = e.target;
    const rotaCard = btn.closest(".rota-card");
    const legs = rotaCard.querySelectorAll(".rota-leg");

    if (legs.length === 0) return;

    const escondido = legs[0].style.display === "none" || legs[0].style.display === "";
    legs.forEach(div => {
      div.style.display = escondido ? "block" : "none";
    });

    btn.textContent = escondido ? "▲" : "▼";
  }
});

// Apagar rota inteira
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("del-rota")) {
    e.target.closest(".rota-card").remove();
  }
});

// Adicionar leg
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("mais-leg")) {
    const rotaCard = e.target.closest(".rota-card");
    const botoesLeg = rotaCard.querySelector(".menos-leg").parentElement;
    rotaCard.insertBefore(document.createRange().createContextualFragment(criarLegHTML()), botoesLeg);
  }
});

// Remover última leg
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("menos-leg")) {
    const rotaCard = e.target.closest(".rota-card");
    const legs = rotaCard.querySelectorAll(".rota-leg");
    if (legs.length > 0) {
      legs[legs.length - 1].remove();
    }
  }
});
// Remover Rota
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("del-rota")) {
    const rotaCard = e.target.closest(".rota-card");
    if (rotaCard) rotaCard.remove();
  }
});

//quando entro no campo, todo o conteúdo fica selecionado automaticamente.
document.querySelectorAll("input").forEach(inp => {
  inp.addEventListener("focus", function() {
    this.select();
  });
});




/*
Estás em rotas.html.
Carregas no botão MB.
Os dados dessa leg são gravados em localStorage (mbLegSelecionada).
És redirecionado para index.html.
Em index.html, o ficheiro mb.js:
Lê os dados guardados e preenche os campos.
Se alterares qualquer valor, fica automaticamente guardado no localStorage.
Se navegares para outra página e voltares, os dados permanecem.
*/

// captura os dados do botão MB e grava no localStorage
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON" && e.target.textContent.trim() === "MB") {
      const leg = e.target.closest(".rota-leg");

      const dados = {
        nomeLeg: leg.querySelector("input[placeholder='ex:CAT-PRM']").value,
        minFuel: leg.querySelector("#min-fuel-input")?.value || "0",
        fuelOB: leg.querySelector("#fuel-ob-input")?.value || "0",
        trafficLoad: leg.querySelector("#traffic-load-input")?.value || "0",
        tripFuel: leg.querySelector("#trip-fuel-input")?.value || "0",
        endurance: leg.querySelector("#endurance-info")?.innerText || "0",
        zfw: leg.querySelector("#zfw-info")?.innerText || "0",
        rampWeight: leg.querySelector("#ramp-weight-info")?.innerText || "0",
        tow: leg.querySelector("#tow-info")?.innerText || "0",
        landingWeight: leg.querySelector("#landing-weight-info")?.innerText || "0"
      };

      // guarda sempre o último MB clicado
      localStorage.setItem("mbLegSelecionada", JSON.stringify(dados));

      // vai para index.html
      window.location.href = "index.html";
    }
  });
});
