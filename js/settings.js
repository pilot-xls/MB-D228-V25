// settings.js

let aircraftData = {};
let currentAircraft = null;

// elementos globais
const select = document.getElementById("aircraft-select");
const tableBody = document.querySelector(".settings-table tbody");
const editForm = document.getElementById("edit-form");
const addForm = document.getElementById("add-form");
const editModal = document.getElementById("edit-modal");
const addModal = document.getElementById("add-modal");
const deleteBtn = document.getElementById("delete-aircraft");
const defaultCheckbox = document.getElementById("default-aircraft");

// payload inputs
const manInput = document.getElementById("std-man");
const womanInput = document.getElementById("std-woman");
const childInput = document.getElementById("std-child");

// inicializar dados
(async () => {
  const { aircraftData: acData, defaultId, payloadDefaults } = await ensureSettingsData();
  aircraftData = acData;

  populateSelect();

  if (defaultId && aircraftData[defaultId]) {
    updateTable(select.value = defaultId);
  } else if (Object.keys(aircraftData).length > 0) {
    updateTable(select.value = Object.keys(aircraftData)[0]);
  }

  // preencher payload defaults
  manInput.value = payloadDefaults.man || "";
  womanInput.value = payloadDefaults.woman || "";
  childInput.value = payloadDefaults.child || "";

  if (!localStorage.getItem("payloadDefaults")) {
    localStorage.setItem("payloadDefaults", JSON.stringify(payloadDefaults));
    }
})();

// preencher dropdown
function populateSelect() {
  select.innerHTML = "";
  Object.keys(aircraftData).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = `${aircraftData[key].ID}`;
    select.appendChild(opt);
  });
}

// atualizar tabela e formulário de edição
function updateTable(key) {
  currentAircraft = key;
  const ac = aircraftData[key];
  if (!ac) return;

  tableBody.innerHTML = `
  <tr><td>ID</td><td>${ac.ID || ""}</td></tr>
  <tr><td>Série</td><td>${ac.Serie || ""}</td></tr>
  <tr><td>BEW</td><td>${ac.BEW || ""}</td></tr>
  <tr><td>MZFW</td><td>${ac.MZFW || ""}</td></tr>
  <tr><td>MRW</td><td>${ac.MRW || ""}</td></tr>
  <tr><td>MTOW</td><td>${ac.MTOW || ""}</td></tr>
  <tr><td>MLOW</td><td>${ac.MLOW || ""}</td></tr>
  <tr><td>Consumo (lb/h)</td><td>${ac.consumo || ""}</td></tr>
  <tr><td>Braço BEW</td><td>${ac.armBEW || "-"}</td></tr>
  <tr><td>Braço Pilotos</td><td>${ac.armPilotos || "-"}</td></tr>
  <tr><td>Braço Combustível</td><td>${ac.armFuel || "-"}</td></tr>
  <tr><td>Braço Payload</td><td>${ac.armPayload || "-"}</td></tr>
`;


  editForm["edit-id"].value = ac.ID || "";
  editForm["edit-serie"].value = ac.Serie || "";
  editForm["edit-bew"].value = ac.BEW || "";
  editForm["edit-mzfw"].value = ac.MZFW || "";
  editForm["edit-mrw"].value = ac.MRW || "";
  editForm["edit-mtow"].value = ac.MTOW || "";
  editForm["edit-mlow"].value = ac.MLOW || "";
  editForm["edit-consumo"].value = ac.consumo || "";
  editForm["edit-armPilots"].value = ac.armPilotos || "";
  editForm["edit-armBEW"].value = ac.armBEW || "";
  editForm["edit-armFuel"].value = ac.armFuel || "";
  editForm["edit-armPayload"].value = ac.armPayload || "";

  const defaultId = localStorage.getItem("defaultAircraft");
  defaultCheckbox.checked = (defaultId === key);
}

// guardar edição
editForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!currentAircraft) return;
  const ac = aircraftData[currentAircraft];
  ac.ID = editForm["edit-id"].value;
  ac.Serie = editForm["edit-serie"].value;
  ac.BEW = editForm["edit-bew"].value;
  ac.MZFW = editForm["edit-mzfw"].value;
  ac.MRW = editForm["edit-mrw"].value;
  ac.MTOW = editForm["edit-mtow"].value;
  ac.MLOW = editForm["edit-mlow"].value;
  ac.consumo = editForm["edit-consumo"].value;
  ac.armPilotos = editForm["edit-armPilots"].value;
  ac.armBEW = editForm["edit-armBEW"].value;
  ac.armFuel = editForm["edit-armFuel"].value;
  ac.armPayload = editForm["edit-armPayload"].value;

  localStorage.setItem("aircraftData", JSON.stringify(aircraftData));
  updateTable(currentAircraft);
  editModal.style.display = "none";
});

// apagar avião
deleteBtn.addEventListener("click", () => {
  if (!currentAircraft) return;
  if (!confirm("Tens a certeza que queres apagar este avião?")) return;

  delete aircraftData[currentAircraft];
  localStorage.setItem("aircraftData", JSON.stringify(aircraftData));

  const keys = Object.keys(aircraftData);
  if (keys.length > 0) {
    populateSelect();
    updateTable(select.value = keys[0]);
  } else {
    tableBody.innerHTML = "";
    select.innerHTML = "";
    currentAircraft = null;
  }

  editModal.style.display = "none";
});

// adicionar avião
addForm.addEventListener("submit", e => {
  e.preventDefault();
  const id = addForm["add-id"].value.trim();
  if (!id) return;
  
  aircraftData[id] = {    
        ID: addForm["add-id"].value.trim(),
        Serie: addForm["add-serie"].value.trim(),
        BEW: addForm["add-bew"].value.trim(),
        MZFW: addForm["add-mzfw"].value.trim(),
        MRW: addForm["add-mrw"].value.trim(),
        MTOW: addForm["add-mtow"].value.trim(),
        MLOW: addForm["add-mlow"].value.trim(),
        consumo: addForm["add-consumo"].value.trim(),
        armBEW: addForm["add-armBEW"].value.trim(),
        armPilotos: addForm["add-armPilots"].value.trim(),
        armFuel: addForm["add-armFuel"].value.trim(),
        armPayload: addForm["add-armPayload"].value.trim()
    };

  localStorage.setItem("aircraftData", JSON.stringify(aircraftData));
  populateSelect();
  updateTable(id);

  addModal.style.display = "none";
  addForm.reset();
});

// listeners de interface
select.addEventListener("change", () => updateTable(select.value));
document.getElementById("open-edit").addEventListener("click", () => {
  if (currentAircraft) editModal.style.display = "block";
});
document.getElementById("close-edit").addEventListener("click", () => editModal.style.display = "none");
document.getElementById("open-add").addEventListener("click", () => addModal.style.display = "block");
document.getElementById("close-add").addEventListener("click", () => addModal.style.display = "none");
//quando click fora do tela editar ou adicionar aviar fecha automatimance a tela
window.addEventListener("click", e => {
  if (e.target === editModal) editModal.style.display = "none";
  if (e.target === addModal) addModal.style.display = "none";
});

// SET new default Aircraft
defaultCheckbox.addEventListener("change", e => {
  if (e.target.checked && currentAircraft) {
    localStorage.setItem("defaultAircraft", currentAircraft);
  } else {
    localStorage.removeItem("defaultAircraft");
  }
});

// payload save
function savePayload() {
  const payloadDefaults = {
    man: manInput.value,
    woman: womanInput.value,
    child: childInput.value
  };
  localStorage.setItem("payloadDefaults", JSON.stringify(payloadDefaults));
  alert("Novos dados do payload foram guardados.");
}
document.getElementById("save-payload").addEventListener("click", savePayload);



// Botão "Repor valores":
// - Pede confirmação ao utilizador
// - Limpa todos os dados guardados em localStorage (aviões, payload, rotas, default)
// - Chama ensureSettingsData() para recarregar os valores de origem a partir dos ficheiros JSON
// - Atualiza dropdown, tabela e inputs de payload com os valores repostos






document.getElementById("reset-defaults").addEventListener("click", async () => {
  if (!confirm("Queres mesmo repor todos os valores por defeito?")) return;

  // limpar todos os dados de settings
  localStorage.removeItem("aircraftData");
  localStorage.removeItem("defaultAircraft");
  localStorage.removeItem("payloadDefaults");
  localStorage.removeItem("estadoRotas");

  // recarregar defaults dos ficheiros JSON
  const { aircraftData: acData, defaultId, payloadDefaults } = await ensureSettingsData();
  aircraftData = acData;

  // repor também as rotas default
  localStorage.removeItem("rotasUserV1");
const defaults = await fetch("data/rotas.json").then(r => r.json());
const sane = { rotas: Array.isArray(defaults?.rotas) ? defaults.rotas : [] };
localStorage.setItem("rotasUserV1", JSON.stringify(sane));


  // atualizar dropdown e tabela
  populateSelect();
  if (defaultId && aircraftData[defaultId]) {
    updateTable(select.value = defaultId);
  } else if (Object.keys(aircraftData).length > 0) {
    updateTable(select.value = Object.keys(aircraftData)[0]);
  }

  // atualizar inputs de payload
  manInput.value = payloadDefaults.man || "";
  womanInput.value = payloadDefaults.woman || "";
  childInput.value = payloadDefaults.child || "";

    localStorage.setItem("payloadDefaults", JSON.stringify(payloadDefaults));


  alert("Todos os dados foram repostos a partir dos ficheiros JSON.");
});
