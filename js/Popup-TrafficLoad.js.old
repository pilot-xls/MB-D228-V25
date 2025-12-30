

// editar Control Seat (troca de estado entre edit-mode view-mode no .css)

// Obtém o botão flutuante que activa o modo de edição
const editBtn = document.getElementById("edit-btn");
// Obtém o elemento que contém o mapa de assentos
const seatMap = document.querySelector(".seat-map");
// Obtém o bloco da legenda (Homem / Mulher / Criança)
const legenda = document.querySelector(".legenda");
const moments = document.getElementById("moments");
// Variável que guarda se estamos em modo edição (true/false)
let editing = false;

// Quando o utilizador clica no botão de editar
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


// contadores
const counts = { men: 0, women: 0, children: 0 };

function updateCount(type, delta) {
    counts[type] = Math.max(0, counts[type] + delta);
    document.getElementById(type + '-count').textContent = counts[type];

    // exemplo de total
    const total = counts.men + counts.women + counts.children;
    document.getElementById('total').textContent = total;
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


/*<<<Botão flutuante ENTER>>>*/
document.getElementById("enter-btn").addEventListener("click", () => {
    /*
    1-descobre qual tab está aberta
    2-se é TAB 1:
        -lê manual-load
        -define moment = 0
    3-se é TAB 2:
        -lê total
        -define moment = 0
    4-guarda os valores
    5-avisa o rotas.js para fechar o popup e aplicar os valores
    */

    // 1) Detectar tab ativa
    const tabActive = document.querySelector(".tab.active");
    //console.log("tabActive:", tabActive);
    const tabId = tabActive ? tabActive.dataset.tab : null;
    //console.log("tabId:", tabId);

    let totalWeight = 0;
    let moment = 0;

    // 2) TAB 1 — carga manual
    if (tabId === "1") {
        const manualValue = Number(document.getElementById("manual-load").value) || 0;
        //console.log("manualValue:", manualValue);
        totalWeight = manualValue;
        //console.log("totalWeight:", totalWeight);
        moment = 0; 
    }

    // 3) TAB 2 — somatório de passageiros / cargas
    if (tabId === "2") {
        const totalValue = document.getElementById("total").textContent.trim();
        totalWeight = totalValue;
        moment = 0; 
    }

    //console.log("ENVIADO PARA ROTAS:", totalWeight, moment);
    // 4) Guarda para enviar para rotas.js
    localStorage.setItem("trafficloadReturn", JSON.stringify({
        total: Number(totalWeight) || 0,
        moment: Number(moment) || 0,
    }));
    

    // 5) Manda fechar overlay em rotas
    window.parent.postMessage("closeTrafficPopup", "*");
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
    if (toggleSeatType.checked) {
        cargoImage.src = "img/large-rear-cargo.png";   // quando ON
    } else {
        cargoImage.src = "img/small-rear-cargo.png";   // quando OFF
    }
});
