// ===============================
//  TABELAS DE DADOS
// ===============================

const TO_Speeds = {
  flaps_up: [
    { weight: 4500, v1: 85, vr: 85, v2: 86 },
    { weight: 4600, v1: 85, vr: 85, v2: 87 },
    { weight: 4700, v1: 85, vr: 85, v2: 88 },
    { weight: 4800, v1: 85, vr: 85, v2: 89 },
    { weight: 4900, v1: 85, vr: 85, v2: 90 },
    { weight: 5000, v1: 85, vr: 85, v2: 91 },
    { weight: 5100, v1: 86, vr: 86, v2: 91 },
    { weight: 5200, v1: 87, vr: 87, v2: 92 },
    { weight: 5300, v1: 88, vr: 88, v2: 93 },
    { weight: 5400, v1: 89, vr: 89, v2: 94 },
    { weight: 5500, v1: 90, vr: 90, v2: 95 },
    { weight: 5600, v1: 91, vr: 91, v2: 95 },
    { weight: 5700, v1: 92, vr: 92, v2: 96 },
    { weight: 5800, v1: 93, vr: 93, v2: 97 },
    { weight: 5900, v1: 93, vr: 93, v2: 98 },
    { weight: 6000, v1: 94, vr: 94, v2: 98 },
    { weight: 6100, v1: 95, vr: 95, v2: 99 },
    { weight: 6200, v1: 96, vr: 96, v2: 100 },
    { weight: 6300, v1: 97, vr: 97, v2: 100 },
    { weight: 6400, v1: 98, vr: 98, v2: 101 }
  ],

  flaps_1: [
    { weight: 4500, v1: 85, vr: 85, v2: 85 },
    { weight: 4600, v1: 85, vr: 85, v2: 85 },
    { weight: 4700, v1: 85, vr: 85, v2: 85 },
    { weight: 4800, v1: 85, vr: 85, v2: 85 },
    { weight: 4900, v1: 85, vr: 85, v2: 85 },
    { weight: 5000, v1: 85, vr: 85, v2: 85 },
    { weight: 5100, v1: 85, vr: 85, v2: 85 },
    { weight: 5200, v1: 85, vr: 85, v2: 85 },
    { weight: 5300, v1: 85, vr: 85, v2: 86 },
    { weight: 5400, v1: 85, vr: 85, v2: 86 },
    { weight: 5500, v1: 85, vr: 85, v2: 87 },
    { weight: 5600, v1: 85, vr: 85, v2: 88 },
    { weight: 5700, v1: 86, vr: 86, v2: 88 },
    { weight: 5800, v1: 86, vr: 86, v2: 89 },
    { weight: 5900, v1: 87, vr: 87, v2: 90 },
    { weight: 6000, v1: 88, vr: 88, v2: 90 },
    { weight: 6100, v1: 88, vr: 88, v2: 91 },
    { weight: 6200, v1: 89, vr: 89, v2: 92 },
    { weight: 6300, v1: 90, vr: 90, v2: 93 },
    { weight: 6400, v1: 91, vr: 91, v2: 93 }
  ]
};

// ===============================
//  VYSE TABLE
// ===============================

const VYSE_Table = [
  { weight: 4500, vyse: 101 },
  { weight: 4600, vyse: 101 },
  { weight: 4700, vyse: 101 },
  { weight: 4800, vyse: 102 },
  { weight: 4900, vyse: 102 },
  { weight: 5000, vyse: 103 },
  { weight: 5100, vyse: 103 },
  { weight: 5200, vyse: 104 },
  { weight: 5300, vyse: 104 },
  { weight: 5400, vyse: 105 },
  { weight: 5500, vyse: 105 },
  { weight: 5600, vyse: 105 },
  { weight: 5700, vyse: 106 },
  { weight: 5800, vyse: 106 },
  { weight: 5900, vyse: 107 },
  { weight: 6000, vyse: 107 },
  { weight: 6100, vyse: 108 },
  { weight: 6200, vyse: 108 },
  { weight: 6300, vyse: 109 },
  { weight: 6400, vyse: 109 },
  { weight: 6500, vyse: 110 }
];

// ===============================
//  FUNÇÃO DE INTERPOLAÇÃO
// ===============================

function interpolate(table, tow, fields) {
  // peso exato
  const exact = table.find(r => r.weight === tow);
  if (exact) return exact;

  // ordenar tabela
  const sorted = [...table].sort((a, b) => a.weight - b.weight);

  // encontrar intervalo
  let lower = null;
  let upper = null;

  for (let i = 0; i < sorted.length - 1; i++) {
    if (tow > sorted[i].weight && tow < sorted[i + 1].weight) {
      lower = sorted[i];
      upper = sorted[i + 1];
      break;
    }
  }

  // fora dos limites
  if (!lower) {
    return tow < sorted[0].weight ? sorted[0] : sorted[sorted.length - 1];
  }

  // interpolação linear
  const ratio = (tow - lower.weight) / (upper.weight - lower.weight);

  const result = { weight: tow };

  fields.forEach(f => {
    result[f] = lower[f] + (upper[f] - lower[f]) * ratio;
    result[f] = Math.round(result[f]); // arredondar
  });

  return result;
}

// ===============================
//  FUNÇÃO PRINCIPAL
// ===============================

export function getTakeoffData(flaps, tow) {
  const flapKey = flaps === "up" ? "flaps_up" : "flaps_1";

  const speeds = interpolate(TO_Speeds[flapKey], tow, ["v1", "vr", "v2"]);
  const vyse = interpolate(VYSE_Table, tow, ["vyse"]);

  return {
    v1: speeds.v1,
    vr: speeds.vr,
    v2: speeds.v2,
    vyse: vyse.vyse
  };
}