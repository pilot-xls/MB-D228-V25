// Busca os valores standard em Setting do PAXs
const { man, woman, child } = getPayloadDefaults();

// Criar o popup a partir do template
const template = document.getElementById("popup-TLoad-Template");
const dialog = template.content.querySelector("dialog").cloneNode(true);
// Adicionar o popup ao body
document.body.appendChild(dialog);
// Guardar referência global para poder fechar depois
window.popupTLoad = dialog;

//quantidade de pax e extra load
let counts = { men: 0, women: 0, children: 0, extra: 0};
let weight = 0;
let moment = 0;

function toNum(v) {
  return Number(String(v ?? "").replace(",", ".")) || 0;
}

const extra   = dialog.querySelector("#extra");
const totalEl = dialog.querySelector("#total");
extra.addEventListener("input", calcularTotal_Tab2);







/*>>>>>>>>>GENERAL<<<<<<<<<<<*/

// set all variaveias ao abrir o popup 
window.setAndUpdatePopup = function () {
    //01- set variaveis do popup
    
    counts = { men: 0, women: 0, children: 0, extra: 0};

// TAB1 – PAYLOAD MANUAL
    const manual_payload = window.trafficLegAlvo?.trafficLoad?.total ?? 0;
    document.getElementById("manual-load").value = manual_payload;

// TAB2 – MANUAL PAX
    counts.men      = window.trafficLegAlvo?.trafficLoad?.homens   ?? 0;
    document.getElementById('men-count').textContent = counts.men;

    counts.women    = window.trafficLegAlvo?.trafficLoad?.mulheres ?? 0;
    document.getElementById("women-count").textContent = counts.women;

    counts.children = window.trafficLegAlvo?.trafficLoad?.criancas ?? 0;
    document.getElementById("children-count").textContent = counts.children;

    counts.extra    = window.trafficLegAlvo?.trafficLoad?.extra    ?? 0;
    document.getElementById("extra").value = counts.extra;
    
    calcularTotal_Tab2();

// TAB3 SEAT CONTROL

    restoreSeatUIFromLeg();

    // ligar listeners de inputs kg (1x) para guardar overrides
    attachSeatKgInputListeners();

    // recalcular totais
    calcular_SeatControl_CargoControl();


// TAB4 LOAD CONTROL    
    const tl = window.trafficLegAlvo?.trafficLoad;

    // restaurar valores
    document.getElementById("f-cargo-weight").value = tl?.f_gab ?? 0;
    document.getElementById("f-cargo-Arm").value    = tl?.f_gabArm ?? 2.560;
    document.getElementById("r-cargo-weight").value = tl?.r_gab ?? 0;

    const toggle = document.getElementById("toggleSeatType");
    const isLarge =
    tl?.r_gabType === "LARGE" ||
    Number(tl?.r_gabArm) === 12.8;

    toggle.checked = !!isLarge;

    document.getElementById("r-cargo-Arm").value = isLarge ? 12.8 : 13.142;

    // recalcular
    calcular_CargoControl();


    enablePopupZoomBlock();

    //imprime na console toda a info da leg alvo 
        //console.log(JSON.stringify(window.trafficLegAlvo, null, 2));
    
};

function getPayloadDefaults() {
  const fallback = { man: 86, woman: 68, child: 35 };

  let stored;
  try {
    stored = JSON.parse(localStorage.getItem("payloadDefaults") || "null");
  } catch {
    stored = null;
  }

  // se não existir, cria já e devolve fallback
  if (!stored) {
    localStorage.setItem("payloadDefaults", JSON.stringify(fallback));
    return fallback;
  }

  // normaliza para números
  const man   = Number(stored.man);
  const woman = Number(stored.woman);
  const child = Number(stored.child);

  // se vier lixo, usa fallback e regrava
  if (![man, woman, child].every(v => Number.isFinite(v) && v > 0)) {
    localStorage.setItem("payloadDefaults", JSON.stringify(fallback));
    return fallback;
  }

  return { man, woman, child };
}




// alternar separadores
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab' + tab.dataset.tab).classList.add('active');
    });
});


//lê o ficheiro JSON e preenche os ARM
document.addEventListener("DOMContentLoaded", () => {

    // 1. Carrega TrafficLoad.json
    fetch("data/TrafficLoad.json")
        .then(response => response.json())
        .then(armValues => {

            // 2. Selecciona todos os inputs da esquerda
            const armInputs = document.querySelectorAll(".arm-input");

            // 3. Preenche cada input pela ordem row1…row9
            let index = 0;
            for (const key in armValues) {
                if (armInputs[index]) {
                    armInputs[index].value = armValues[key];
                }
                index++;
            }

        })
        .catch(err =>
            console.error("Erro ao carregar TrafficLoad.json:", err)
        );

});

// Obtém o toggle (switch) através do id "toggleSeatType"
const toggleSeatType = document.getElementById("toggleSeatType");
const cargoImage = document.getElementById("cargoImage");

toggleSeatType.addEventListener("change", () => {
  cargoImage.src = toggleSeatType.checked ? "img/large-rear-cargo.png" : "img/small-rear-cargo.png";
  calcular_CargoControl();
});


// Fecha o popup ao clicar em qualquer ponto fora da caixa do popup
window.popupTLoad.addEventListener("click", (event) => {
    if (event.target === window.popupTLoad) {
        window.popupTLoad.close();
        if (window.trafficInputAlvo) window.trafficInputAlvo.blur();
        window.trafficInputAlvo = null;
        window.trafficLegAlvo = null;
    }
});


//Botão enter 
const btnEnter = document.getElementById("enter-btn");
btnEnter.addEventListener("click", () => {

    // 1) Detectar tab ativa
    const tabActive = document.querySelector(".tab.active");
    const tabId = tabActive ? tabActive.dataset.tab : null;
    

    // TAB 1 — carga manual
    if (tabId === "1") {
        weight = Number(document.getElementById("manual-load").value) || 0;
        moment = 0;
    }

    // TAB 2 — passageiros
    if (tabId === "2") {
        weight = Number(document.getElementById("total").textContent.trim()) || 0;
        window.trafficLegAlvo.trafficLoad.total = weight;
        window.trafficLegAlvo.trafficLoad.moment = 0;
        window.trafficLegAlvo.trafficLoad.homens = counts.men;
        window.trafficLegAlvo.trafficLoad.mulheres = counts.women;
        window.trafficLegAlvo.trafficLoad.criancas = counts.children;
        window.trafficLegAlvo.trafficLoad.extra = counts.extra;
        counts = { men: 0, women: 0, children: 0, extra: 0};    
    }
    // TAB 3 — passageiros
    if (tabId === "3") {
        calcular_SeatControl_CargoControl();
        const tl = window.trafficLegAlvo?.trafficLoad;
        weight = Number(tl?.total || 0);
        moment = Number(tl?.moment || 0);
        window.trafficLegAlvo.trafficLoad.total = weight;
        window.trafficLegAlvo.trafficLoad.moment = moment;
    }
    // TAB 4 — passageiros
    if (tabId === "4") {
        calcular_CargoControl();
        const tl = window.trafficLegAlvo?.trafficLoad;
        weight = Number(tl?.total || 0);
        moment = Number(tl?.moment || 0);
        window.trafficLegAlvo.trafficLoad.total = weight;
        window.trafficLegAlvo.trafficLoad.moment = moment;
    }

    // Atualizar o input 
    window.trafficInputAlvo.value = weight + " kg";

    // Disparar evento input para recalcular e vai gravar por despara o evento em:
    /* 
        rotas.js
        Guardar inputs e recalcular rota
        container.addEventListener("input", (e) => {
    */
    window.trafficInputAlvo.dispatchEvent(new Event("input", { bubbles: true }));

    
    //fechar popup
    dialog.close();

    // Perder foco ao input na rota/leg input da leg que abriu o popup
    if (window.trafficInputAlvo) {
        window.trafficInputAlvo.blur();
    }

    window.trafficInputAlvo = null;
    window.trafficLegAlvo   = null;

});

["f-cargo-weight", "f-cargo-Arm", "r-cargo-weight"].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("input", calcular_CargoControl);
});



/*>>>>>>>>>>>>FIM GENERAL<<<<<<<<<<<*/



/* ---------------------  “zoom”  ------------------- */

let popupZoomBlockOn = false;
let lastTouchEnd = 0;

function enablePopupZoomBlock() {
  if (popupZoomBlockOn) return;
  popupZoomBlockOn = true;

  // Bloqueia pinch zoom (gesto com 2 dedos)
  document.addEventListener("touchmove", onTouchMoveBlockPinch, { passive: false });

  // Bloqueia double-tap zoom
  document.addEventListener("touchend", onTouchEndBlockDoubleTap, { passive: false });
}

function disablePopupZoomBlock() {
  if (!popupZoomBlockOn) return;
  popupZoomBlockOn = false;

  document.removeEventListener("touchmove", onTouchMoveBlockPinch, { passive: false });
  document.removeEventListener("touchend", onTouchEndBlockDoubleTap, { passive: false });
}

function onTouchMoveBlockPinch(e) {
  // Só bloqueia quando o popup está mesmo aberto
  if (!window.popupTLoad || !window.popupTLoad.open) return;

  // pinch = mais do que 1 touch
  if (e.touches && e.touches.length > 1) {
    e.preventDefault();
  }
}

function onTouchEndBlockDoubleTap(e) {
  if (!window.popupTLoad || !window.popupTLoad.open) return;

  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault(); // impede double-tap zoom
  }
  lastTouchEnd = now;
}

/* --------------------- fim “zoom”  ------------------- */



/*>>>>>>>>SCROLL<<<<<<<<<<*/
let scrollYPos = 0; // Variável global para guardar o scroll

function bloquearScroll() {
    // 1. Guarda a posição atual do scroll
    scrollYPos = window.scrollY;

    // 2. Aplica o estilo "congelado" ao body
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYPos}px`;
    document.body.style.width = '100%';
    document.body.style.overflowY = 'scroll'; // Evita que a página "salte" ao esconder a scrollbar
}

function libertarScroll() {
    // 1. Remove os estilos de bloqueio
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflowY = '';

    // 2. Devolve o utilizador à posição exata onde estava
    window.scrollTo(0, scrollYPos);
}

window.popupTLoad.addEventListener("close", () => {
  disablePopupZoomBlock();
  libertarScroll();
});
window.popupTLoad.addEventListener("cancel", () => {
  disablePopupZoomBlock();
  libertarScroll();
});
/*>>>>>>>FIM SCROLL<<<<<<<*/
















/*>>>>>>>>>>TAB2<<<<<<<<<*/

//botões de adicionar e subtrair passageiros tab2
function updateCount(type, delta) {
    // em HTML popup-TLoad 
    //<button class="counter-btn" onclick="updateCount('men', 1)">+</button>
    //type = men, women or children 
    //delta = -1 or +1
    const newValue = counts[type] + delta;

    // não deixa ir abaixo de 0
    if (newValue < 0) return;

    // calcula total se aceitarmos esta alteração
    const futureTotal = 
        (type === 'men' ? newValue : counts.men) +
        (type === 'women' ? newValue : counts.women) +
        (type === 'children' ? newValue : counts.children);

    // impede ultrapassar os 19
    if (futureTotal > 19) return;

    // aplica alteração
    counts[type] = newValue;

    // atualiza DOM - aqui tem de atualizar
    document.getElementById(type + '-count').textContent = counts[type];

    calcularTotal_Tab2();
}

function calcularTotal_Tab2() {
    counts.extra = Number(extra.value) || 0;

    weight =
        counts.men * man +
        counts.women * woman +
        counts.children * child +
        counts.extra;

    totalEl.textContent = weight;
}
/* >>>>>>>>>>FIM TAB2<<<<<<<<<<*/






/*>>>>>>>>>>TAB3<<<<<<<<<<<*/

function calcular_SeatControl_CargoControl() {
  const tl = window.trafficLegAlvo?.trafficLoad;
  if (!tl) return;

  tl.seats ||= {};
  tl.seatKg ||= {};  

  // Ler arms do UI se existirem; se não, usa tl.rXArm
  const getArm = (row) => {
    // no teu HTML, o arm está no input .arm-input do bloco rowA# (ou rowB8)
    if (row >= 1 && row <= 7) {
      const el = document.querySelector(`#rowA${row} .arm-input`);
      return el ? toNum(el.value) : toNum(tl[`r${row}Arm`]);
    }
    if (row === 8) {
      const el = document.querySelector(`#rowB8 .arm-input`);
      return el ? toNum(el.value) : toNum(tl[`r8Arm`]);
    }
    if (row === 9) {
      const el = document.querySelector(`#rowA9 .arm-input`);
      return el ? toNum(el.value) : toNum(tl[`r9Arm`]);
    }
    return 0;
  };

  let homensN = 0, mulheresN = 0, criancasN = 0;
  let totalWeight = 0;
  let totalMoment = 0;

  // somar por seat (19)
  const allSeats = [
    "1A","1C","2A","2C","3A","3C","4A","4C","5A","5C","6A","6C","7A","7C",
    "8B","8C",
    "9A","9B","9C"
  ];

  // reset dos campos derivados por seat (opcional)
  // (se não precisares destes rX_*, podes remover este bloco)
  /*
  tl.r1_A = tl.r1_C = 0;
  tl.r2_A = tl.r2_C = 0;
  tl.r3_A = tl.r3_C = 0;
  tl.r4_A = tl.r4_C = 0;
  tl.r5_A = tl.r5_C = 0;
  tl.r6_A = tl.r6_C = 0;
  tl.r7_A = tl.r7_C = 0;
  tl.r8_B = tl.r8_C = 0;
  tl.r9_A = tl.r9_B = tl.r9_C = 0;
*/
  for (const key of allSeats) {
    const row = Number(key[0]);               // "9B" -> 9
    const seat = key.slice(1);                // "9B" -> "B"
    const state = tl.seats[key] || "empty";

    if (state === "man") homensN++;
    if (state === "woman") mulheresN++;
    if (state === "child") criancasN++;

    const kg = (state === "empty") ? 0 : toNum(tl.seatKg[key]);
    totalWeight += kg;

    // guardar derivados por seat (opcional)
    if (row >= 1 && row <= 7) {
      if (seat === "A") tl[`r${row}_A`] = kg;
      if (seat === "C") tl[`r${row}_C`] = kg;
    } else if (row === 8) {
      if (seat === "B") tl.r8_B = kg;
      if (seat === "C") tl.r8_C = kg;
    } else if (row === 9) {
      if (seat === "A") tl.r9_A = kg;
      if (seat === "B") tl.r9_B = kg;
      if (seat === "C") tl.r9_C = kg;
    }

    const arm = getArm(row);
    totalMoment += kg * arm;
  }


  // baggage (se quiseres somar ao weight/moment — decide tu)
  // tl.f_gab e tl.r_gab são kg, podes incluir se fizer sentido:
  // totalWeight += toNum(tl.f_gab) + toNum(tl.r_gab);
  // totalMoment += toNum(tl.f_gab) * toNum(tl.f_gabArm) + toNum(tl.r_gab) * toNum(tl.r_gabArm);

  // guardar totais
  tl.homens = homensN;
  tl.mulheres = mulheresN;
  tl.criancas = criancasN;

  tl.paxTotalKg = totalWeight;
    tl.paxMoment  = totalMoment;

    // mantém estes se quiseres (contadores), não interferem com o total final
    tl.homens   = homensN;
    tl.mulheres = mulheresN;
    tl.criancas = criancasN;

    // soma final pax + cargo e actualiza UI
    updateOverallTrafficLoad();

}

document.querySelectorAll(".seat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const row = Number(btn.dataset.row);
    const seat = btn.dataset.seat;
    if (!row || !seat) return;

    // ciclo de estado
    if (btn.classList.contains("man")) {
      btn.className = "seat-btn woman";
    } else if (btn.classList.contains("woman")) {
      btn.className = "seat-btn child";
    } else if (btn.classList.contains("child")) {
      btn.className = "seat-btn";
    } else {
      btn.className = "seat-btn man";
    }

    const tl = window.trafficLegAlvo?.trafficLoad;
    if (!tl) return;

    tl.seats ||= {};
    tl.seatKg ||= {};

    const key = seatKey(row, seat);
    const state = seatStateFromBtn(btn);

    // guardar estado
    tl.seats[key] = state;

    // input kg correspondente
    const kgInput = getSeatKgInput(row, seat);
    if (!kgInput) return;

    if (state === "empty") {
      // limpa override e input
      delete tl.seatKg[key];
      kgInput.value = 0;
    } else {
      // por defeito: ao mudar tipo, reset para default do tipo
      const w = defaultWeightForState(state);
      tl.seatKg[key] = w;
      kgInput.value = w;
    }

    calcular_SeatControl_CargoControl();
  });
});

function attachSeatKgInputListeners() {
  // Para todos os botões, vamos mapear o input e criar listener 1x
  document.querySelectorAll(".seat-btn").forEach(btn => {
    const row = Number(btn.dataset.row);
    const seat = btn.dataset.seat;
    if (!row || !seat) return;

    const kgInput = getSeatKgInput(row, seat);
    if (!kgInput) return;

    // evita duplicar listeners se chamares isto mais que uma vez
    if (kgInput.dataset.boundSeatKg === "1") return;
    kgInput.dataset.boundSeatKg = "1";

    kgInput.addEventListener("input", () => {
      const tl = window.trafficLegAlvo?.trafficLoad;
      if (!tl) return;

      tl.seats ||= {};
      tl.seatKg ||= {};

      const key = seatKey(row, seat);

      // Se o assento estiver empty, não guardes override
      const state = tl.seats[key] || "empty";
      const v = Number(String(kgInput.value ?? "").replace(",", ".")) || 0;

      if (state === "empty") {
        delete tl.seatKg[key];
        kgInput.value = 0;
      } else {
        // guarda override
        tl.seatKg[key] = v;
      }

      calcular_SeatControl_CargoControl();
    });
  });
}

function restoreSeatUIFromLeg() {
  const tl = window.trafficLegAlvo?.trafficLoad;
  if (!tl) return;

  tl.seats ||= {};
  tl.seatKg ||= {};

  // 1) Restaurar classes dos botões
  document.querySelectorAll(".seat-btn").forEach(btn => {
    btn.className = "seat-btn";

    const row = Number(btn.dataset.row);
    const seat = btn.dataset.seat;
    if (!row || !seat) return;

    const key = seatKey(row, seat);
    const state = tl.seats[key] || "empty";

    if (state === "man") btn.classList.add("man");
    else if (state === "woman") btn.classList.add("woman");
    else if (state === "child") btn.classList.add("child");
  });

  // 2) Restaurar inputs de kg (com override)
  document.querySelectorAll(".seat-btn").forEach(btn => {
    const row = Number(btn.dataset.row);
    const seat = btn.dataset.seat;
    if (!row || !seat) return;

    const key = seatKey(row, seat);
    const kgInput = getSeatKgInput(row, seat);
    if (!kgInput) return;

    const state = tl.seats[key] || "empty";

    if (state === "empty") {
      kgInput.value = 0;
      return;
    }

    // primeiro tenta override; se não existir usa default do tipo
    const kg = (tl.seatKg[key] != null) ? tl.seatKg[key] : defaultWeightForState(state);
    kgInput.value = kg;
  });
}

function getSeatKgInput(row, seat) {
  // A seats -> #rowA1..#rowA7 e #rowA9 têm (arm + kg). Queremos o kg: input:not(.arm-input)
  if (seat === "A") {
    const rowEl = document.getElementById(`rowA${row}`);
    if (!rowEl) return null;
    return rowEl.querySelector('input:not(.arm-input)');
  }

  // C seats -> #rowC1..#rowC9 têm 1 input (kg)
  if (seat === "C") {
    const rowEl = document.getElementById(`rowC${row}`);
    if (!rowEl) return null;
    return rowEl.querySelector("input");
  }

  // B seats -> row 8 e row 9
  if (seat === "B") {
    if (row === 8) {
      const rowEl = document.getElementById("rowB8");
      if (!rowEl) return null;
      return rowEl.querySelector('input:not(.arm-input)');
    }
    if (row === 9) {
      const rowEl = document.getElementById("rowB9");
      if (!rowEl) return null;
      return rowEl.querySelector("input");
    }
  }

  return null;
}

function seatKey(row, seat) {
  return `${row}${seat}`; // "1A", "8B", "9C"
}

function seatStateFromBtn(btn) {
  if (btn.classList.contains("man")) return "man";
  if (btn.classList.contains("woman")) return "woman";
  if (btn.classList.contains("child")) return "child";
  return "empty";
}

function defaultWeightForState(state) {
  if (state === "man") return man;
  if (state === "woman") return woman;
  if (state === "child") return child;
  return 0;
}

//------------------------------------------------------------------------
// editar Control Seat (troca de estado entre edit-mode view-mode no .css)
//-------------------------------------------------------------------------

// Obtém o botão flutuante que activa o modo de edição
const editBtn = document.getElementById("edit-btn");
// Obtém o elemento que contém o mapa de assentos
const seatMap = document.querySelector(".seat-map");
// Obtém o bloco da legenda (Homem / Mulher / Criança)
const legenda = document.querySelector(".legenda");
const moments = document.getElementById("moments");
// Variável que guarda se estamos em modo edição (true/false)
let editing = false;

// Control Seat botão de editar
editBtn.addEventListener("click", () => {
    // Alterna o estado (se estava false passa a true e vice-versa)
    editing = !editing;

    if (editing) {
        // Activa o modo de edição no mapa de assentos
        seatMap.classList.add("edit-mode");
        // Esconde a legenda enquanto está em edição
        legenda.style.display = "none";        
        // Troca o ícone do botão para ← (confirmar)
        editBtn.textContent = "←";
    } else {
        // Sai do modo de edição
        seatMap.classList.remove("edit-mode");
        // Mostra novamente a legenda
        legenda.style.display = "flex";
        // Esconde Total moments
    //document.getElementById("moments").style.display = "none";
        // Volta a mostrar o ícone de editar
        editBtn.textContent = "✎";
    }
});

/*>>>>>>>>>>FIM TAB3<<<<<<<<<<<*/




/*>>>>>>>>>>TAB4<<<<<<<<<<<*/

/**
 * Soma pax + cargo e escreve o total final na leg.
 * Também actualiza o UI do Tab3 (totalWeight/totalMoment).
 */
function updateOverallTrafficLoad() {
  const tl = window.trafficLegAlvo?.trafficLoad;
  if (!tl) return;

  const paxW = toNum(tl.paxTotalKg);
  const paxM = toNum(tl.paxMoment);

  const cargoW = toNum(tl.cargoTotalKg);
  const cargoM = toNum(tl.cargoMoment);

  tl.total = paxW + cargoW;
  tl.moment = paxM + cargoM;

  // UI (Tab3)
  const wEl = document.getElementById("totalWeight");
  if (wEl) wEl.textContent = `${Math.round(tl.total)}Kg`;

  const mEl = document.getElementById("totalMoment");
  if (mEl) mEl.textContent = `${Math.round(tl.moment)}Kg`;
}

/**
 * Calcula cargo (Tab4) e guarda em tl.cargoTotalKg / tl.cargoMoment.
 * NOTA: toggle checked=LARGE => arm 12.8 ; unchecked=SMALL => arm 13.142
 */
function calcular_CargoControl() {
  const tl = window.trafficLegAlvo?.trafficLoad;
  if (!tl) return;

  // Inputs Tab4 (pelos teus HTMLs)
  const fwdWeightInput = document.getElementById("f-cargo-weight");
  const fwdArmInput    = document.getElementById("f-cargo-Arm");

  const aftWeightInput = document.getElementById("r-cargo-weight");
  const aftArmInput    = document.getElementById("r-cargo-Arm");


  const large = !!document.getElementById("toggleSeatType")?.checked;
    tl.r_gabType = large ? "LARGE" : "SMALL";

  const fwdKg  = toNum(fwdWeightInput?.value);
  const fwdArm = toNum(fwdArmInput?.value);

  const aftKg = toNum(aftWeightInput?.value);

  // arm do AFT vem do toggle (e também podes reflectir no input)
  const aftArm = large ? 12.8 : 13.142;
  if (aftArmInput) aftArmInput.value = aftArm;

  // guardar em leg
  tl.f_gab = fwdKg;
  tl.f_gabArm = fwdArm;

  tl.r_gab = aftKg;
  tl.r_gabArm = aftArm;

  tl.cargoTotalKg = fwdKg + aftKg;
  tl.cargoMoment = (fwdKg * fwdArm) + (aftKg * aftArm);

  // soma final (pax + cargo)
  updateOverallTrafficLoad();
}


/*>>>>>>>>>>FIM TAB4<<<<<<<<<<<*/













