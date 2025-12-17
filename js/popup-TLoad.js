// Busca os valores standard em Setting do PAXs
const storedPayload = JSON.parse(localStorage.getItem("payloadDefaults") || "{}");
const {
    man = 0,
    woman = 0,
    child = 0
} = storedPayload;
// Criar o popup a partir do template
const template = document.getElementById("popup-TLoad-Template");
const dialog = template.content.querySelector("dialog").cloneNode(true);
// Adicionar o popup ao body
document.body.appendChild(dialog);
// Guardar referência global para poder fechar depois
window.popupTLoad = dialog;
let manual_payload = 0;
//quantidade de pax e extra load
let counts = { men: 0, women: 0, children: 0, extra: 0};
let weight = 0;
let moment = 0;

const extra   = document.getElementById("extra");
const totalEl = document.getElementById("total");
extra.addEventListener("input", calcularTotal);







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

    // set variaveis TAB3 SEAT CONTROL

    // set variaveis TAB4 LOAD CONTROL

    weight = window.trafficLegAlvo?.trafficLoad?.total;
    
    calcularTotal();
    
    moment = window.trafficLegAlvo?.trafficLoad?.moment;

};

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


// alternar separadores
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab' + tab.dataset.tab).classList.add('active');
    });
});

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

    calcularTotal();
}


// botões de assento
document.querySelectorAll('.seat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('man')) {
            btn.className = 'seat-btn woman';
        } else if (btn.classList.contains('woman')) {
            btn.className = 'seat-btn child';
        } else if (btn.classList.contains('child')) {
            btn.className = 'seat-btn';
        } else {
            btn.className = 'seat-btn man';
        }
    });
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
        //totalWeight = Number(document.getElementById("total").textContent.trim()) || 0;
        moment = 0;
    }
    // TAB 3 — passageiros
    if (tabId === "3") {
        //totalWeight = Number(document.getElementById("total").textContent.trim()) || 0;
        //moment = 0;
    }
    // TAB 4 — passageiros
    if (tabId === "4") {
        //totalWeight = Number(document.getElementById("total").textContent.trim()) || 0;
       // moment = 0;
    }

    updateTragetLeg();


    // Atualizar o input visual
    trafficInputAlvo.value = weight + " kg";
    // Disparar evento input para recalcular e vai gravar por despara o evento em:
    /* 
        rotas.js
        Guardar inputs e recalcular rota
        container.addEventListener("input", (e) => {
    */
    trafficInputAlvo.dispatchEvent(new Event("input", { bubbles: true }));

    
    //fechar popup
    dialog.close();

    // Perder foco ao input na rota/leg input da leg que abriu o popup
    if (window.trafficInputAlvo) {
        window.trafficInputAlvo.blur();
    }

    window.trafficInputAlvo = null;
    window.trafficLegAlvo   = null;

});

//atualizar a leg que estou a usar com os novos dados
function updateTragetLeg() {

    // Actualizar os campos correctos
    window.trafficLegAlvo.trafficLoad.total = weight;
    window.trafficLegAlvo.trafficLoad.moment = moment;
    window.trafficLegAlvo.trafficLoad.homens = counts.men;
    window.trafficLegAlvo.trafficLoad.mulheres = counts.women;
    window.trafficLegAlvo.trafficLoad.criancas = counts.children;
    window.trafficLegAlvo.trafficLoad.extra = counts.extra;

    //    
    counts = { men: 0, women: 0, children: 0, extra: 0};
}

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
    if (toggleSeatType.checked) {
        cargoImage.src = "img/large-rear-cargo.png";   // quando ON
    } else {
        cargoImage.src = "img/small-rear-cargo.png";   // quando OFF
    }
});

// Fecha o popup ao clicar em qualquer ponto fora da caixa do popup
window.popupTLoad.addEventListener("click", (event) => {
    if (event.target === window.popupTLoad) {
        window.popupTLoad.close();
        if (window.trafficInputAlvo) {
            window.trafficInputAlvo.blur();
        }
    }
});



function calcularTotal() {
    counts.extra = Number(extra.value) || 0;

    weight =
        counts.men * man +
        counts.women * woman +
        counts.children * child +
        counts.extra;

    totalEl.textContent = weight;
}



function bloquearScroll() {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none"; // iOS
}

function libertarScroll() {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
}

window.popupTLoad.addEventListener("close", libertarScroll);
window.popupTLoad.addEventListener("cancel", libertarScroll);

