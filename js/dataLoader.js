// dataLoader.js
// Garante que os dados de settings (aviões, payload, etc.) existem no localStorage
// Devolve sempre os objetos carregados para uso imediato

// Garante que existem settings (aviões, payload e rotas) no localStorage
async function ensureSettingsData() {
  let aircraftData = JSON.parse(localStorage.getItem("aircraftData") || "{}");
  let defaultId = localStorage.getItem("defaultAircraft");
  let payloadDefaults = JSON.parse(localStorage.getItem("payloadDefaults") || "{}");
  let estadoRotas = JSON.parse(localStorage.getItem("estadoRotas") || "{}");

  // carregar aviões se ainda não existirem
  if (Object.keys(aircraftData).length === 0) {
    const response = await fetch("data/aircraft.json");
    const json = await response.json();
    aircraftData = json.aircraft;
    localStorage.setItem("aircraftData", JSON.stringify(aircraftData));

    if (!defaultId && json.default) {
      defaultId = json.default;
      localStorage.setItem("defaultAircraft", defaultId);
    }
  }

  // carregar payload se ainda não existir
  if (Object.keys(payloadDefaults).length === 0) {
    const response = await fetch("data/payload.json");
    const json = await response.json();
    payloadDefaults = json;
    localStorage.setItem("payloadDefaults", JSON.stringify(payloadDefaults));
  }

  // carregar rotas se ainda não existirem
  if (Object.keys(estadoRotas).length === 0) {
    const response = await fetch("data/rotas.json");
    const json = await response.json();
    estadoRotas = json;
    localStorage.setItem("estadoRotas", JSON.stringify(estadoRotas));
  }

  return { aircraftData, defaultId, payloadDefaults, estadoRotas };
}
