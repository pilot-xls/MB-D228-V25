// =====================================
//  TABELA WAT – FLAPS UP & FLAPS 1
// =====================================

// Valores verificados contra o gráfico WAT do AFM (D5-POHX-05-0007-01), digitalizado: todos
// os pontos lidos do gráfico estão a -35/+16 kg da reta medida.
//
// extrapolated: true → nessa PA a reta da OAT já saiu pela borda direita do gráfico (6600 kg).
// O valor foi obtido prolongando a reta e é conservador: arredondado para baixo a 25 kg e,
// a mais de 400 ft da borda, o menor de dois ajustes (troço final da reta / reta inteira).
// Estes pontos servem para interpolar entre linhas de PA: sem eles, a linha de PA mais baixa
// caía no cold cap e a interpolação com a linha de cima dava um WAT abaixo do real (ex.:
// LPBG 19, 25 °C, QNH 1013 → 6386 em vez de 6400), ou "out of chart" quando o gráfico tem
// valor (ex.: flaps up, 5000 ft, 15 °C).
export const WAT_TABLE = {
  flaps_up: [
    { pressure_altitude: 0, oat: 55, wat: 5610 },
    { pressure_altitude: 0, oat: 50, wat: 5900 }, // corrigido: era 5800 (gráfico ~5905)
    { pressure_altitude: 0, oat: 45, wat: 6225 },
    { pressure_altitude: 0, oat: 40, wat: 6525 },
    { pressure_altitude: 0, oat: 35, wat: 6700, extrapolated: true },
    { pressure_altitude: 0, oat: 30, wat: 6975, extrapolated: true },

    { pressure_altitude: 1000, oat: 55, wat: 5400 },
    { pressure_altitude: 1000, oat: 50, wat: 5700 },
    { pressure_altitude: 1000, oat: 45, wat: 6000 },
    { pressure_altitude: 1000, oat: 40, wat: 6275 },
    { pressure_altitude: 1000, oat: 35, wat: 6525 },
    { pressure_altitude: 1000, oat: 30, wat: 6750, extrapolated: true },
    { pressure_altitude: 1000, oat: 25, wat: 6900, extrapolated: true },

    { pressure_altitude: 2000, oat: 55, wat: 5200 },
    { pressure_altitude: 2000, oat: 50, wat: 5475 },
    { pressure_altitude: 2000, oat: 45, wat: 5775 },
    { pressure_altitude: 2000, oat: 40, wat: 6050 },
    { pressure_altitude: 2000, oat: 35, wat: 6300 },
    { pressure_altitude: 2000, oat: 30, wat: 6550 },
    { pressure_altitude: 2000, oat: 25, wat: 6675, extrapolated: true },
    { pressure_altitude: 2000, oat: 20, wat: 6925, extrapolated: true },

    { pressure_altitude: 3000, oat: 55, wat: 5000 },
    { pressure_altitude: 3000, oat: 50, wat: 5275 },
    { pressure_altitude: 3000, oat: 45, wat: 5550 },
    { pressure_altitude: 3000, oat: 40, wat: 5850 },
    { pressure_altitude: 3000, oat: 35, wat: 6050 },
    { pressure_altitude: 3000, oat: 30, wat: 6325 }, // corrigido: era 6575 (gráfico ~6335; 2000 ft = 6550, 4000 ft = 6100)
    { pressure_altitude: 3000, oat: 25, wat: 6575 }, // faltava (gráfico ~6580)
    { pressure_altitude: 3000, oat: 20, wat: 6700, extrapolated: true },
    { pressure_altitude: 3000, oat: 10, wat: 7075, extrapolated: true },

    { pressure_altitude: 4000, oat: 55, wat: 4800 },
    { pressure_altitude: 4000, oat: 50, wat: 5075 },
    { pressure_altitude: 4000, oat: 45, wat: 5350 },
    { pressure_altitude: 4000, oat: 40, wat: 5600 },
    { pressure_altitude: 4000, oat: 35, wat: 5850 },
    { pressure_altitude: 4000, oat: 30, wat: 6100 },
    { pressure_altitude: 4000, oat: 25, wat: 6300 },
    { pressure_altitude: 4000, oat: 20, wat: 6525 },
    { pressure_altitude: 4000, oat: 10, wat: 6850, extrapolated: true },

    { pressure_altitude: 5000, oat: 55, wat: 4600 },
    { pressure_altitude: 5000, oat: 50, wat: 4875 },
    { pressure_altitude: 5000, oat: 45, wat: 5150 },
    { pressure_altitude: 5000, oat: 40, wat: 5400 },
    { pressure_altitude: 5000, oat: 35, wat: 5625 },
    { pressure_altitude: 5000, oat: 30, wat: 5875 },
    { pressure_altitude: 5000, oat: 25, wat: 6050 },
    { pressure_altitude: 5000, oat: 20, wat: 6250 },
    { pressure_altitude: 5000, oat: 10, wat: 6675, extrapolated: true },
    { pressure_altitude: 5000, oat: 0, wat: 6950, extrapolated: true },

    { pressure_altitude: 6000, oat: 55, wat: 4400 },
    { pressure_altitude: 6000, oat: 50, wat: 4675 },
    { pressure_altitude: 6000, oat: 45, wat: 4950 },
    { pressure_altitude: 6000, oat: 40, wat: 5200 },
    { pressure_altitude: 6000, oat: 35, wat: 5425 },
    { pressure_altitude: 6000, oat: 30, wat: 5650 },
    { pressure_altitude: 6000, oat: 25, wat: 5850 },
    { pressure_altitude: 6000, oat: 20, wat: 6050 },
    { pressure_altitude: 6000, oat: 10, wat: 6425 },
    { pressure_altitude: 6000, oat: 0, wat: 6725, extrapolated: true },
    { pressure_altitude: 6000, oat: -10, wat: 7000, extrapolated: true },

    { pressure_altitude: 7000, oat: 55, wat: 4200 },
    { pressure_altitude: 7000, oat: 50, wat: 4450 },
    { pressure_altitude: 7000, oat: 45, wat: 4725 },
    { pressure_altitude: 7000, oat: 40, wat: 4975 },
    { pressure_altitude: 7000, oat: 35, wat: 5200 },
    { pressure_altitude: 7000, oat: 30, wat: 5425 },
    { pressure_altitude: 7000, oat: 25, wat: 5625 },
    { pressure_altitude: 7000, oat: 20, wat: 5800 },
    { pressure_altitude: 7000, oat: 10, wat: 6175 },
    { pressure_altitude: 7000, oat: 0, wat: 6500 },
    { pressure_altitude: 7000, oat: -10, wat: 6750, extrapolated: true },

    { pressure_altitude: 8000, oat: 55, wat: 4000 },
    { pressure_altitude: 8000, oat: 50, wat: 4250 },
    { pressure_altitude: 8000, oat: 45, wat: 4500 },
    { pressure_altitude: 8000, oat: 40, wat: 4775 },
    { pressure_altitude: 8000, oat: 35, wat: 5000 },
    { pressure_altitude: 8000, oat: 30, wat: 5200 },
    { pressure_altitude: 8000, oat: 25, wat: 5400 },
    { pressure_altitude: 8000, oat: 20, wat: 5600 },
    { pressure_altitude: 8000, oat: 10, wat: 5950 },
    { pressure_altitude: 8000, oat: 0, wat: 6250 },
    { pressure_altitude: 8000, oat: -10, wat: 6550 }
  ],

  flaps_1: [
    { pressure_altitude: 0, oat: 55, wat: 5425 },
    { pressure_altitude: 0, oat: 50, wat: 5750 },
    { pressure_altitude: 0, oat: 45, wat: 6025 },
    { pressure_altitude: 0, oat: 40, wat: 6300 },
    { pressure_altitude: 0, oat: 35, wat: 6600 },
    { pressure_altitude: 0, oat: 30, wat: 6830, extrapolated: true },
    { pressure_altitude: 0, oat: 25, wat: 7050, extrapolated: true },

    { pressure_altitude: 1000, oat: 55, wat: 5250 },
    { pressure_altitude: 1000, oat: 50, wat: 5550 },
    { pressure_altitude: 1000, oat: 45, wat: 5800 },
    { pressure_altitude: 1000, oat: 40, wat: 6050 },
    { pressure_altitude: 1000, oat: 35, wat: 6350 },
    { pressure_altitude: 1000, oat: 30, wat: 6625, extrapolated: true },
    { pressure_altitude: 1000, oat: 25, wat: 6800, extrapolated: true },

    { pressure_altitude: 2000, oat: 55, wat: 5075 },
    { pressure_altitude: 2000, oat: 50, wat: 5350 },
    { pressure_altitude: 2000, oat: 45, wat: 5600 },
    { pressure_altitude: 2000, oat: 40, wat: 5850 },
    { pressure_altitude: 2000, oat: 35, wat: 6125 },
    { pressure_altitude: 2000, oat: 30, wat: 6375 },
    { pressure_altitude: 2000, oat: 25, wat: 6620, extrapolated: true },
    { pressure_altitude: 2000, oat: 20, wat: 6850, extrapolated: true },

    { pressure_altitude: 3000, oat: 55, wat: 4900 },
    { pressure_altitude: 3000, oat: 50, wat: 5150 },
    { pressure_altitude: 3000, oat: 45, wat: 5400 },
    { pressure_altitude: 3000, oat: 40, wat: 5650 },
    { pressure_altitude: 3000, oat: 35, wat: 5900 },
    { pressure_altitude: 3000, oat: 30, wat: 6150 },
    { pressure_altitude: 3000, oat: 25, wat: 6350 },
    { pressure_altitude: 3000, oat: 20, wat: 6625, extrapolated: true },
    { pressure_altitude: 3000, oat: 10, wat: 6975, extrapolated: true },

    { pressure_altitude: 4000, oat: 55, wat: 4700 },
    { pressure_altitude: 4000, oat: 50, wat: 4950 },
    { pressure_altitude: 4000, oat: 45, wat: 5200 },
    { pressure_altitude: 4000, oat: 40, wat: 5425 },
    { pressure_altitude: 4000, oat: 35, wat: 5700 },
    { pressure_altitude: 4000, oat: 30, wat: 5925 },
    { pressure_altitude: 4000, oat: 25, wat: 6125 },
    { pressure_altitude: 4000, oat: 20, wat: 6375 },
    { pressure_altitude: 4000, oat: 10, wat: 6725, extrapolated: true },
    { pressure_altitude: 4000, oat: 0, wat: 7100, extrapolated: true },

    { pressure_altitude: 5000, oat: 55, wat: 4550 },
    { pressure_altitude: 5000, oat: 50, wat: 4775 },
    { pressure_altitude: 5000, oat: 45, wat: 5000 },
    { pressure_altitude: 5000, oat: 40, wat: 5250 },
    { pressure_altitude: 5000, oat: 35, wat: 5450 },
    { pressure_altitude: 5000, oat: 30, wat: 5675 },
    { pressure_altitude: 5000, oat: 25, wat: 5900 },
    { pressure_altitude: 5000, oat: 20, wat: 6125 },
    { pressure_altitude: 5000, oat: 10, wat: 6500 },
    { pressure_altitude: 5000, oat: 0, wat: 6850, extrapolated: true },

    { pressure_altitude: 6000, oat: 55, wat: 4350 },
    { pressure_altitude: 6000, oat: 50, wat: 4600 },
    { pressure_altitude: 6000, oat: 45, wat: 4825 },
    { pressure_altitude: 6000, oat: 40, wat: 5050 },
    { pressure_altitude: 6000, oat: 35, wat: 5250 },
    { pressure_altitude: 6000, oat: 30, wat: 5450 },
    { pressure_altitude: 6000, oat: 25, wat: 5675 },
    { pressure_altitude: 6000, oat: 20, wat: 5850 },
    { pressure_altitude: 6000, oat: 10, wat: 6225 },
    { pressure_altitude: 6000, oat: 0, wat: 6575 },
    { pressure_altitude: 6000, oat: -10, wat: 6875, extrapolated: true },

    { pressure_altitude: 7000, oat: 30, wat: 5250 },
    { pressure_altitude: 7000, oat: 25, wat: 5450 },
    { pressure_altitude: 7000, oat: 20, wat: 5650 },
    { pressure_altitude: 7000, oat: 10, wat: 5975 },
    { pressure_altitude: 7000, oat: 0, wat: 6350 },
    { pressure_altitude: 7000, oat: -10, wat: 6650, extrapolated: true },

    { pressure_altitude: 8000, oat: 25, wat: 5250 },
    { pressure_altitude: 8000, oat: 20, wat: 5400 },
    { pressure_altitude: 8000, oat: 10, wat: 5750 },
    { pressure_altitude: 8000, oat: 0, wat: 6050 },
    { pressure_altitude: 8000, oat: -10, wat: 6375 } // corrigido: era 6350 (gráfico ~6390)
  ]
};

// =====================================
//  FORA DO GRÁFICO
// =====================================
//
// O WAT desce com a OAT e com a PA. Por isso:
//  - OAT ABAIXO da menor OAT de uma linha de PA: a curva já saiu pelo topo do gráfico.
//    Para OAT mais frias o WAT real é PELO MENOS o do ponto mais frio da linha (o WAT
//    sobe quando a OAT desce). Se esse ponto já está perto do peso máximo do avião (dentro
//    de 50 kg) ou acima, devolve-se o maior dos dois (status "cold_cap"): um mínimo
//    garantido do WAT, nunca abaixo do peso máximo do avião. Não se devolve só o peso
//    máximo: com inlets ON (-250 kg) isso daria 6150 em vez de 6400, e misturado com
//    pontos reais na interpolação o MTOW descia quando a OAT descia. Se o ponto mais
//    frio ainda está longe desse peso máximo, a curva continua a subir fora do gráfico
//    e não há valor seguro a devolver: status "out_of_chart".
//  - OAT ACIMA da maior OAT de uma linha de PA, ou PA acima da maior PA da tabela:
//    fora do gráfico do AFM. Usar a borda seria NÃO conservador, por isso não se
//    devolve número (status "out_of_chart").
//  - PA abaixo da menor PA (0 ft): usa-se a linha de 0 ft (conservador).

export const WAT_OK = "ok";
export const WAT_COLD_CAP = "cold_cap";
export const WAT_OUT_OF_CHART = "out_of_chart";

// Peso máximo do avião usado pelo cap do lado frio quando getWAT não recebe um
// aircraftMTOW explícito (em produção, performance.js passa sempre o MTOW das settings).
const DEFAULT_AIRCRAFT_MAX_WEIGHT = 6400;

// Margem (kg): o ponto mais frio da linha tem de estar a esta distância do peso
// máximo do avião, ou menos, para se considerar que a curva já encostou ao cap.
const COLD_CAP_MARGIN = 50;

// =====================================
//  INTERPOLAÇÃO 1D (OAT)
// =====================================

function interpolate1D(rows, oat, aircraftMTOW) {
  const tOAT = Number(oat);
  const sorted = [...rows].sort((a, b) => a.oat - b.oat);
  const minOAT = sorted[0].oat;
  const maxOAT = sorted[sorted.length - 1].oat;

  // Acima da maior OAT desta linha de PA: fora do gráfico
  if (tOAT > maxOAT) {
    return { wat: null, outOfChart: true, reason: `OAT ${tOAT} °C above chart (max ${maxOAT} °C at ${sorted[0].pressure_altitude} ft)` };
  }

  // Abaixo da menor OAT: a curva do AFM já saiu do gráfico
  if (tOAT < minOAT) {
    const coldest = sorted[0];

    // O ponto mais frio da linha já está encostado ao peso máximo do avião (ou acima):
    // para temperaturas mais frias o WAT é pelo menos esse ponto, nunca menos do que o
    // peso máximo do avião (code 7), não a borda.
    if (coldest.wat >= aircraftMTOW - COLD_CAP_MARGIN) {
      return { wat: Math.max(aircraftMTOW, coldest.wat), coldCap: true };
    }

    // O ponto mais frio ainda está longe do peso máximo: a curva continua a subir
    // fora do gráfico e não há valor seguro a devolver.
    return { wat: null, outOfChart: true, reason: `OAT ${tOAT} °C below chart (min ${minOAT} °C = ${coldest.wat} kg at ${coldest.pressure_altitude} ft, below aircraft MTOW cap)` };
  }

  const exact = sorted.find(r => r.oat === tOAT);
  if (exact) return { wat: exact.wat };

  for (let i = 0; i < sorted.length - 1; i++) {
    const lower = sorted[i];
    const upper = sorted[i + 1];
    if (tOAT > lower.oat && tOAT < upper.oat) {
      const ratio = (tOAT - lower.oat) / (upper.oat - lower.oat);
      return { wat: Math.round(lower.wat + (upper.wat - lower.wat) * ratio) };
    }
  }

  // Não deve acontecer (OAT dentro de [minOAT, maxOAT])
  return { wat: null, outOfChart: true, reason: `OAT ${tOAT} °C not in WAT table` };
}

// =====================================
//  INTERPOLAÇÃO 2D (PA + OAT)
// =====================================

function interpolate2D(table, pa, oat, aircraftMTOW) {
  const tPA = Number(pa);
  const rowsAt = p => table.filter(r => r.pressure_altitude === p);
  const paValues = [...new Set(table.map(r => r.pressure_altitude))].sort((a, b) => a - b);
  const minPA = paValues[0];
  const maxPA = paValues[paValues.length - 1];

  // Acima da maior PA da tabela: fora do gráfico
  if (tPA > maxPA) {
    return { wat: null, outOfChart: true, reason: `PA ${tPA} ft above chart (max ${maxPA} ft)` };
  }

  // Abaixo da menor PA: usa a linha da menor PA (conservador)
  if (tPA <= minPA) {
    return interpolate1D(rowsAt(minPA), oat, aircraftMTOW);
  }

  if (paValues.includes(tPA)) {
    return interpolate1D(rowsAt(tPA), oat, aircraftMTOW);
  }

  const upperPA = paValues.find(p => p > tPA);
  const lowerPA = paValues[paValues.indexOf(upperPA) - 1];

  const atLower = interpolate1D(rowsAt(lowerPA), oat, aircraftMTOW);
  const atUpper = interpolate1D(rowsAt(upperPA), oat, aircraftMTOW);

  // Basta uma das linhas estar fora do gráfico para o ponto não ser verificável
  if (atLower.outOfChart || atUpper.outOfChart) {
    return { wat: null, outOfChart: true, reason: atLower.reason || atUpper.reason };
  }

  const ratio = (tPA - lowerPA) / (upperPA - lowerPA);
  const wat = atLower.wat + (atUpper.wat - atLower.wat) * ratio;

  return { wat: Math.round(wat), coldCap: !!(atLower.coldCap || atUpper.coldCap) };
}

// =====================================
//  FUNÇÃO PRINCIPAL
// =====================================

/**
 * Limite WAT (kg) para flaps "up" ou "1".
 * aircraftMTOW: peso máximo estrutural do avião (settings); usado pelo cap do lado frio.
 * Devolve:
 *  - { status: "ok", wat, reason: null }        → valor normal do gráfico
 *  - { status: "cold_cap", wat, reason: null }  → OAT abaixo do gráfico, mas o ponto mais
 *    frio da linha já está encostado ao peso máximo do avião (ou acima): wat é o mínimo
 *    garantido do WAT (o ponto mais frio da linha), nunca abaixo do peso máximo do avião.
 *  - { status: "out_of_chart", wat: null, reason } → fora do gráfico do AFM, sem valor
 */
export function getWAT(flaps, pressureAltitude, oat, aircraftMTOW = DEFAULT_AIRCRAFT_MAX_WEIGHT) {
  if (flaps !== "up" && flaps !== "1") {
    throw new Error('Invalid flaps setting ["up" or "1"]');
  }

  const table = WAT_TABLE[flaps === "up" ? "flaps_up" : "flaps_1"];
  const r = interpolate2D(table, pressureAltitude, oat, Number(aircraftMTOW));

  if (r.outOfChart) {
    return { status: WAT_OUT_OF_CHART, wat: null, reason: r.reason };
  }

  if (r.coldCap) {
    return { status: WAT_COLD_CAP, wat: r.wat, reason: null };
  }

  return { status: WAT_OK, wat: r.wat, reason: null };
}
