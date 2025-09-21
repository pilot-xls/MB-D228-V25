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
})();

// preencher dropdown
function populateSelect() {
  select.innerHTML = "";
  Object.keys(aircraftData).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = aircraftData[key].matricula;
    select.appendChild(opt);
  });
}

// atualizar tabela e formulário de edição
function updateTable(key) {
  currentAircraft = key;
  const ac = aircraftData[key];
  if (!ac) return;

  tableBody.innerHTML = `
    <tr><td>BEW</td><td>${ac.BEW || ""}</td></tr>
    <tr><td>MZFW</td><td>${ac.MZFW || ""}</td></tr>
    <tr><td>MRW</td><td>${ac.MRW || ""}</td></tr>
    <tr><td>MTOW</td><td>${ac.MTOW || ""}</td></tr>
    <tr><td>MLOW</td><td>${ac.MLOW || ""}</td></tr>
    <tr><td>Consumo</td><td>${ac.consumo || ""}</td></tr>
    <tr><td>Braço Pilotos</td><td>${ac.armPilotos || "-"}</td></tr>
    <tr><td>Braço BEW</td><td>${ac.armBEW || "-"}</td></tr>
    <tr><td>Braço Combustível</td><td>${ac.armFuel || "-"}</td></tr>
    <tr><td>Braço Payload</td><td>${ac.armPayload || "-"}</td></tr>
  `;

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
    matricula: addForm["add-matricula"].value.trim(),
    BEW: addForm["add-bew"].value,
    MZFW: addForm["add-mzfw"].value,
    MRW: addForm["add-mrw"].value,
    MTOW: addForm["add-mtow"].value,
    MLOW: addForm["add-mlow"].value,
    consumo: addForm["add-consumo"].value,
    armPilotos: 4.21,
    armBEW: 7.7,
    armFuel: 7.936,
    armPayload: 8.7
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

window.addEventListener("click", e => {
  if (e.target === editModal) editModal.style.display = "none";
  if (e.target === addModal) addModal.style.display = "none";
});

// default
defaultCheckbox.addEventListener("change", e => {
  if (e.target.checked && currentAircraft) {
    localStorage.setItem("defaultAircraft", currentAircraft);
  } else {
    localStorage.removeItem("defaultAircraft");
  }
});

// payload
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



