// =====================================
//  TABELA WAT – FLAPS UP & FLAPS 1
// =====================================

const WAT_TABLE = {
  flaps_up: [
    { pressure_altitude: 0, oat: 55, wat: 5610 },
    { pressure_altitude: 0, oat: 50, wat: 5800 },
    { pressure_altitude: 0, oat: 45, wat: 6225 },
    { pressure_altitude: 0, oat: 40, wat: 6525 },

    { pressure_altitude: 1000, oat: 55, wat: 5400 },
    { pressure_altitude: 1000, oat: 50, wat: 5700 },
    { pressure_altitude: 1000, oat: 45, wat: 6000 },
    { pressure_altitude: 1000, oat: 40, wat: 6275 },
    { pressure_altitude: 1000, oat: 35, wat: 6525 },

    { pressure_altitude: 2000, oat: 55, wat: 5200 },
    { pressure_altitude: 2000, oat: 50, wat: 5475 },
    { pressure_altitude: 2000, oat: 45, wat: 5775 },
    { pressure_altitude: 2000, oat: 40, wat: 6050 },
    { pressure_altitude: 2000, oat: 35, wat: 6300 },
    { pressure_altitude: 2000, oat: 30, wat: 6550 },

    { pressure_altitude: 3000, oat: 55, wat: 5000 },
    { pressure_altitude: 3000, oat: 50, wat: 5275 },
    { pressure_altitude: 3000, oat: 45, wat: 5550 },
    { pressure_altitude: 3000, oat: 40, wat: 5850 },
    { pressure_altitude: 3000, oat: 35, wat: 6050 },
    { pressure_altitude: 3000, oat: 30, wat: 6575 },

    { pressure_altitude: 4000, oat: 55, wat: 4800 },
    { pressure_altitude: 4000, oat: 50, wat: 5075 },
    { pressure_altitude: 4000, oat: 45, wat: 5350 },
    { pressure_altitude: 4000, oat: 40, wat: 5600 },
    { pressure_altitude: 4000, oat: 35, wat: 5850 },
    { pressure_altitude: 4000, oat: 30, wat: 6100 },
    { pressure_altitude: 4000, oat: 25, wat: 6300 },
    { pressure_altitude: 4000, oat: 20, wat: 6525 },

    { pressure_altitude: 5000, oat: 55, wat: 4600 },
    { pressure_altitude: 5000, oat: 50, wat: 4875 },
    { pressure_altitude: 5000, oat: 45, wat: 5150 },
    { pressure_altitude: 5000, oat: 40, wat: 5400 },
    { pressure_altitude: 5000, oat: 35, wat: 5625 },
    { pressure_altitude: 5000, oat: 30, wat: 5875 },
    { pressure_altitude: 5000, oat: 25, wat: 6050 },
    { pressure_altitude: 5000, oat: 20, wat: 6250 },

    { pressure_altitude: 6000, oat: 55, wat: 4400 },
    { pressure_altitude: 6000, oat: 50, wat: 4675 },
    { pressure_altitude: 6000, oat: 45, wat: 4950 },
    { pressure_altitude: 6000, oat: 40, wat: 5200 },
    { pressure_altitude: 6000, oat: 35, wat: 5425 },
    { pressure_altitude: 6000, oat: 30, wat: 5650 },
    { pressure_altitude: 6000, oat: 25, wat: 5850 },
    { pressure_altitude: 6000, oat: 20, wat: 6050 },
    { pressure_altitude: 6000, oat: 10, wat: 6425 },

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

    { pressure_altitude: 1000, oat: 55, wat: 5250 },
    { pressure_altitude: 1000, oat: 50, wat: 5550 },
    { pressure_altitude: 1000, oat: 45, wat: 5800 },
    { pressure_altitude: 1000, oat: 40, wat: 6050 },
    { pressure_altitude: 1000, oat: 35, wat: 6350 },

    { pressure_altitude: 2000, oat: 55, wat: 5075 },
    { pressure_altitude: 2000, oat: 50, wat: 5350 },
    { pressure_altitude: 2000, oat: 45, wat: 5600 },
    { pressure_altitude: 2000, oat: 40, wat: 5850 },
    { pressure_altitude: 2000, oat: 35, wat: 6125 },
    { pressure_altitude: 2000, oat: 30, wat: 6375 },

    { pressure_altitude: 3000, oat: 55, wat: 4900 },
    { pressure_altitude: 3000, oat: 50, wat: 5150 },
    { pressure_altitude: 3000, oat: 45, wat: 5400 },
    { pressure_altitude: 3000, oat: 40, wat: 5650 },
    { pressure_altitude: 3000, oat: 35, wat: 5900 },
    { pressure_altitude: 3000, oat: 30, wat: 6150 },
    { pressure_altitude: 3000, oat: 25, wat: 6350 },

    { pressure_altitude: 4000, oat: 55, wat: 4700 },
    { pressure_altitude: 4000, oat: 50, wat: 4950 },
    { pressure_altitude: 4000, oat: 45, wat: 5200 },
    { pressure_altitude: 4000, oat: 40, wat: 5425 },
    { pressure_altitude: 4000, oat: 35, wat: 5700 },
    { pressure_altitude: 4000, oat: 30, wat: 5925 },
    { pressure_altitude: 4000, oat: 25, wat: 6125 },
    { pressure_altitude: 4000, oat: 20, wat: 6375 },

    { pressure_altitude: 5000, oat: 55, wat: 4550 },
    { pressure_altitude: 5000, oat: 50, wat: 4775 },
    { pressure_altitude: 5000, oat: 45, wat: 5000 },
    { pressure_altitude: 5000, oat: 40, wat: 5250 },
    { pressure_altitude: 5000, oat: 35, wat: 5450 },
    { pressure_altitude: 5000, oat: 30, wat: 5675 },
    { pressure_altitude: 5000, oat: 25, wat: 5900 },
    { pressure_altitude: 5000, oat: 20, wat: 6125 },
    { pressure_altitude: 5000, oat: 10, wat: 6500 },

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

    { pressure_altitude: 7000, oat: 30, wat: 5250 },
    { pressure_altitude: 7000, oat: 25, wat: 5450 },
    { pressure_altitude: 7000, oat: 20, wat: 5650 },
    { pressure_altitude: 7000, oat: 10, wat: 5975 },
    { pressure_altitude: 7000, oat: 0, wat: 6350 },

    { pressure_altitude: 8000, oat: 25, wat: 5250 },
    { pressure_altitude: 8000, oat: 20, wat: 5400 },
    { pressure_altitude: 8000, oat: 10, wat: 5750 },
    { pressure_altitude: 8000, oat: 0, wat: 6050 },
    { pressure_altitude: 8000, oat: -10, wat: 6350 }
  ]
};

// =====================================
//  INTERPOLAÇÃO 1D (OAT)
// =====================================

function interpolate1D(rows, oat) {
  const tOAT = Number(oat);
  const sorted = [...rows].sort((a, b) => a.oat - b.oat);

  const exact = sorted.find(r => r.oat === tOAT);
  if (exact) return { wat: exact.wat };

  let lower = null;
  let upper = null;

  for (let i = 0; i < sorted.length - 1; i++) {
    if (tOAT > sorted[i].oat && tOAT < sorted[i + 1].oat) {
      lower = sorted[i];
      upper = sorted[i + 1];
      break;
    }
  }

  if (!lower) {
    const edge = tOAT < sorted[0].oat ? sorted[0] : sorted[sorted.length - 1];
    return { wat: edge.wat };
  }

  const ratio = (tOAT - lower.oat) / (upper.oat - lower.oat);
  const wat = lower.wat + (upper.wat - lower.wat) * ratio;

  return { wat: Math.round(wat) };
}

// =====================================
//  INTERPOLAÇÃO 2D (PA + OAT)
// =====================================

function interpolate2D(table, pa, oat) {
  const tPA = Number(pa);

  const samePA = table.filter(r => r.pressure_altitude === tPA);
  if (samePA.length > 0) {
    return interpolate1D(samePA, oat);
  }

  const sorted = [...table].sort((a, b) => a.pressure_altitude - b.pressure_altitude);

  let lowerPA = null;
  let upperPA = null;

  for (let i = 0; i < sorted.length - 1; i++) {
    const paLow = sorted[i].pressure_altitude;
    const paHigh = sorted[i + 1].pressure_altitude;
    if (tPA > paLow && tPA < paHigh) {
      lowerPA = paLow;
      upperPA = paHigh;
      break;
    }
  }

  if (lowerPA === null) {
    const minPA = sorted[0].pressure_altitude;
    const maxPA = sorted[sorted.length - 1].pressure_altitude;
    const closestPA = tPA < minPA ? minPA : maxPA;
    return interpolate1D(sorted.filter(r => r.pressure_altitude === closestPA), oat);
  }

  const watLower = interpolate1D(
    sorted.filter(r => r.pressure_altitude === lowerPA),
    oat
  ).wat;

  const watUpper = interpolate1D(
    sorted.filter(r => r.pressure_altitude === upperPA),
    oat
  ).wat;

  const ratio = (tPA - lowerPA) / (upperPA - lowerPA);
  const wat = watLower + (watUpper - watLower) * ratio;

  return { wat: Math.round(wat) };
}

// =====================================
//  FUNÇÃO PRINCIPAL
// =====================================

export function getWAT(flaps, pressureAltitude, oat) {
	
	//>>>>>>>>>>>>>>>>>>>se o inlet swith estiver ON, wat -250kg (falta adicionar)<<<<<<<<<<<<<<<<<<<<<<<<<<
	
  if (flaps !== "up" && flaps !== "1") {
    throw new Error('Configuração de flaps inválida ["up" ou "1"]');
  }

  if (flaps === "up") {
    flaps = "flaps_up";
  }

  if (flaps === "1") {
    flaps = "flaps_1";
  }

  const table = WAT_TABLE[flaps];
  const { wat } = interpolate2D(table, pressureAltitude, oat);
  return wat;
}