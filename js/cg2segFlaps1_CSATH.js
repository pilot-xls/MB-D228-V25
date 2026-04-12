// cg2seg_CSATH.js
// ----------------------
// 1) TABELAS DE DADOS
// ----------------------

// PA / OAT → y_ref
const PA_OAT_TABLE = [
  {
    pressure_altitude: 12000,
    values: [
      { oat: -40, y_ref: 826 },
      { oat: -30, y_ref: 884 },
      { oat: -20, y_ref: 941 },
      { oat: -10, y_ref: 999 },
      { oat: 0, y_ref: 1062 },
      { oat: 10, y_ref: 1120 }
    ]
  },
  {
    pressure_altitude: 10000,
    values: [
      { oat: -40, y_ref: 701 },
      { oat: -30, y_ref: 769 },
      { oat: -20, y_ref: 834 },
      { oat: -10, y_ref: 899 },
      { oat: 0, y_ref: 968 },
      { oat: 10, y_ref: 1030 },
      { oat: 20, y_ref: 1098 },
      { oat: 30, y_ref: 1160 }
    ]
  },
  {
    pressure_altitude: 8000,
    values: [
      { oat: -40, y_ref: 646 },
      { oat: -30, y_ref: 675 },
      { oat: -20, y_ref: 711 },
      { oat: -10, y_ref: 787 },
      { oat: 0, y_ref: 863 },
      { oat: 10, y_ref: 936 },
      { oat: 20, y_ref: 1012 },
      { oat: 30, y_ref: 1087 },
      { oat: 40, y_ref: 1160 }
    ]
  },
  {
    pressure_altitude: 6000,
    values: [
      { oat: -30, y_ref: 636 },
      { oat: -20, y_ref: 657 },
      { oat: -10, y_ref: 683 },
      { oat: 0, y_ref: 751 },
      { oat: 10, y_ref: 834 },
      { oat: 20, y_ref: 914 },
      { oat: 30, y_ref: 997 },
      { oat: 40, y_ref: 1080 }
    ]
  },
  {
    pressure_altitude: 4000,
    values: [
      { oat: -30, y_ref: 596 },
      { oat: -20, y_ref: 614 },
      { oat: -10, y_ref: 639 },
      { oat: 0, y_ref: 657 },
      { oat: 10, y_ref: 708 },
      { oat: 20, y_ref: 809 },
      { oat: 30, y_ref: 907 },
      { oat: 40, y_ref: 1008 }
    ]
  },
  {
    pressure_altitude: 2000,
    values: [
      { oat: -20, y_ref: 578 },
      { oat: -10, y_ref: 599 },
      { oat: 0, y_ref: 621 },
      { oat: 10, y_ref: 639 },
      { oat: 20, y_ref: 690 },
      { oat: 30, y_ref: 802 },
      { oat: 40, y_ref: 918 },
      { oat: 50, y_ref: 1030 }
    ]
  },
  {
    pressure_altitude: 0,
    values: [
      { oat: -20, y_ref: 542 },
      { oat: -10, y_ref: 563 },
      { oat: 0, y_ref: 585 },
      { oat: 10, y_ref: 603 },
      { oat: 20, y_ref: 625 },
      { oat: 30, y_ref: 693 },
      { oat: 40, y_ref: 813 },
      { oat: 50, y_ref: 936 }
    ]
  }
];

// Sections de referência
const REF_SECTIONS = [
  { section: 1, y_ref_bottom: 1185, y_ref_top: 1092 },
  { section: 2, y_ref_bottom: 1092, y_ref_top: 1000 },
  { section: 3, y_ref_bottom: 1000, y_ref_top: 907 },
  { section: 4, y_ref_bottom: 907, y_ref_top: 810 },
  { section: 5, y_ref_bottom: 810, y_ref_top: 718 },
  { section: 6, y_ref_bottom: 718, y_ref_top: 625 },
  { section: 7, y_ref_bottom: 625, y_ref_top: 528 }
];

const WEIGHT_TABLE = [
  {
    weight: 4500,
    sections: [
      { section: 1, y_ref_bottom: 778, y_ref_top: 666 },
      { section: 2, y_ref_bottom: 666, y_ref_top: 557 },
      { section: 3, y_ref_bottom: 557, y_ref_top: 442 },
      { section: 4, y_ref_bottom: 442, y_ref_top: 322 },
      { section: 5, y_ref_bottom: 322, y_ref_top: 203 },
      { section: 6, y_ref_bottom: 203, y_ref_top: 66 }
    ]
  },
  {
    weight: 4600,
    sections: [
      { section: 1, y_ref_bottom: 814, y_ref_top: 702 },
      { section: 2, y_ref_bottom: 702, y_ref_top: 590 },
      { section: 3, y_ref_bottom: 590, y_ref_top: 478 },
      { section: 4, y_ref_bottom: 478, y_ref_top: 362 },
      { section: 5, y_ref_bottom: 362, y_ref_top: 247 },
      { section: 6, y_ref_bottom: 247, y_ref_top: 109 }
    ]
  },
  {
    weight: 4700,
    sections: [
      { section: 1, y_ref_bottom: 847, y_ref_top: 735 },
      { section: 2, y_ref_bottom: 735, y_ref_top: 626 },
      { section: 3, y_ref_bottom: 626, y_ref_top: 514 },
      { section: 4, y_ref_bottom: 514, y_ref_top: 402 },
      { section: 5, y_ref_bottom: 402, y_ref_top: 290 },
      { section: 6, y_ref_bottom: 290, y_ref_top: 153 }
    ]
  },
  {
    weight: 4800,
    sections: [
      { section: 1, y_ref_bottom: 879, y_ref_top: 771 },
      { section: 2, y_ref_bottom: 771, y_ref_top: 662 },
      { section: 3, y_ref_bottom: 662, y_ref_top: 550 },
      { section: 4, y_ref_bottom: 550, y_ref_top: 445 },
      { section: 5, y_ref_bottom: 445, y_ref_top: 326 },
      { section: 6, y_ref_bottom: 326, y_ref_top: 196 },
      { section: 7, y_ref_bottom: 196, y_ref_top: 69 }
    ]
  },
  {
    weight: 4900,
    sections: [
      { section: 1, y_ref_bottom: 908, y_ref_top: 800 },
      { section: 2, y_ref_bottom: 800, y_ref_top: 695 },
      { section: 3, y_ref_bottom: 695, y_ref_top: 583 },
      { section: 4, y_ref_bottom: 583, y_ref_top: 478 },
      { section: 5, y_ref_bottom: 478, y_ref_top: 369 },
      { section: 6, y_ref_bottom: 369, y_ref_top: 239 },
      { section: 7, y_ref_bottom: 239, y_ref_top: 116 }
    ]
  },
  {
    weight: 5000,
    sections: [
      { section: 1, y_ref_bottom: 937, y_ref_top: 832 },
      { section: 2, y_ref_bottom: 832, y_ref_top: 727 },
      { section: 3, y_ref_bottom: 727, y_ref_top: 619 },
      { section: 4, y_ref_bottom: 619, y_ref_top: 507 },
      { section: 5, y_ref_bottom: 507, y_ref_top: 402 },
      { section: 6, y_ref_bottom: 402, y_ref_top: 283 },
      { section: 7, y_ref_bottom: 283, y_ref_top: 160 }
    ]
  },
  {
    weight: 5100,
    sections: [
      { section: 1, y_ref_bottom: 966, y_ref_top: 861 },
      { section: 2, y_ref_bottom: 861, y_ref_top: 756 },
      { section: 3, y_ref_bottom: 756, y_ref_top: 651 },
      { section: 4, y_ref_bottom: 651, y_ref_top: 543 },
      { section: 5, y_ref_bottom: 543, y_ref_top: 435 },
      { section: 6, y_ref_bottom: 435, y_ref_top: 322 },
      { section: 7, y_ref_bottom: 322, y_ref_top: 200 }
    ]
  },
  {
    weight: 5200,
    sections: [
      { section: 1, y_ref_bottom: 995, y_ref_top: 890 },
      { section: 2, y_ref_bottom: 890, y_ref_top: 789 },
      { section: 3, y_ref_bottom: 789, y_ref_top: 684 },
      { section: 4, y_ref_bottom: 684, y_ref_top: 572 },
      { section: 5, y_ref_bottom: 572, y_ref_top: 467 },
      { section: 6, y_ref_bottom: 467, y_ref_top: 359 },
      { section: 7, y_ref_bottom: 359, y_ref_top: 243 }
    ]
  },
  {
    weight: 5300,
    sections: [
      { section: 1, y_ref_bottom: 1020, y_ref_top: 919 },
      { section: 2, y_ref_bottom: 919, y_ref_top: 814 },
      { section: 3, y_ref_bottom: 814, y_ref_top: 717 },
      { section: 4, y_ref_bottom: 717, y_ref_top: 604 },
      { section: 5, y_ref_bottom: 604, y_ref_top: 503 },
      { section: 6, y_ref_bottom: 503, y_ref_top: 395 },
      { section: 7, y_ref_bottom: 395, y_ref_top: 286 }
    ]
  },
  {
    weight: 5400,
    sections: [
      { section: 1, y_ref_bottom: 1042, y_ref_top: 952 },
      { section: 2, y_ref_bottom: 952, y_ref_top: 843 },
      { section: 3, y_ref_bottom: 843, y_ref_top: 742 },
      { section: 4, y_ref_bottom: 742, y_ref_top: 637 },
      { section: 5, y_ref_bottom: 637, y_ref_top: 532 },
      { section: 6, y_ref_bottom: 532, y_ref_top: 427 },
      { section: 7, y_ref_bottom: 427, y_ref_top: 326 }
    ]
  },
  {
    weight: 5500,
    sections: [
      { section: 1, y_ref_bottom: 1071, y_ref_top: 977 },
      { section: 2, y_ref_bottom: 977, y_ref_top: 872 },
      { section: 3, y_ref_bottom: 872, y_ref_top: 771 },
      { section: 4, y_ref_bottom: 771, y_ref_top: 670 },
      { section: 5, y_ref_bottom: 670, y_ref_top: 568 },
      { section: 6, y_ref_bottom: 568, y_ref_top: 463 },
      { section: 7, y_ref_bottom: 463, y_ref_top: 366 }
    ]
  },
  {
    weight: 5600,
    sections: [
      { section: 1, y_ref_bottom: 1093, y_ref_top: 1006 },
      { section: 2, y_ref_bottom: 1006, y_ref_top: 897 },
      { section: 3, y_ref_bottom: 897, y_ref_top: 800 },
      { section: 4, y_ref_bottom: 800, y_ref_top: 698 },
      { section: 5, y_ref_bottom: 698, y_ref_top: 594 },
      { section: 6, y_ref_bottom: 594, y_ref_top: 496 },
      { section: 7, y_ref_bottom: 496, y_ref_top: 402 }
    ]
  },
  {
    weight: 5700,
    sections: [
      { section: 1, y_ref_bottom: 1118, y_ref_top: 1027 },
      { section: 2, y_ref_bottom: 1027, y_ref_top: 926 },
      { section: 3, y_ref_bottom: 926, y_ref_top: 832 },
      { section: 4, y_ref_bottom: 832, y_ref_top: 731 },
      { section: 5, y_ref_bottom: 731, y_ref_top: 630 },
      { section: 6, y_ref_bottom: 630, y_ref_top: 525 },
      { section: 7, y_ref_bottom: 525, y_ref_top: 431 }
    ]
  },
  {
    weight: 5800,
    sections: [
      { section: 1, y_ref_bottom: 1140, y_ref_top: 1046 },
      { section: 2, y_ref_bottom: 1046, y_ref_top: 952 },
      { section: 3, y_ref_bottom: 952, y_ref_top: 858 },
      { section: 4, y_ref_bottom: 858, y_ref_top: 756 },
      { section: 5, y_ref_bottom: 756, y_ref_top: 659 },
      { section: 6, y_ref_bottom: 659, y_ref_top: 568 },
      { section: 7, y_ref_bottom: 568, y_ref_top: 463 }
    ]
  },
  {
    weight: 5900,
    sections: [
      { section: 1, y_ref_bottom: 1165, y_ref_top: 1071 },
      { section: 2, y_ref_bottom: 1071, y_ref_top: 977 },
      { section: 3, y_ref_bottom: 977, y_ref_top: 879 },
      { section: 4, y_ref_bottom: 879, y_ref_top: 782 },
      { section: 5, y_ref_bottom: 782, y_ref_top: 691 },
      { section: 6, y_ref_bottom: 691, y_ref_top: 597 },
      { section: 7, y_ref_bottom: 597, y_ref_top: 492 }
    ]
  },
  {
    weight: 6000,
    sections: [
      { section: 1, y_ref_bottom: 1183, y_ref_top: 1089 },
      { section: 2, y_ref_bottom: 1089, y_ref_top: 995 },
      { section: 3, y_ref_bottom: 995, y_ref_top: 901 },
      { section: 4, y_ref_bottom: 901, y_ref_top: 807 },
      { section: 5, y_ref_bottom: 807, y_ref_top: 720 },
      { section: 6, y_ref_bottom: 720, y_ref_top: 626 },
      { section: 7, y_ref_bottom: 626, y_ref_top: 525 }
    ]
  },
  {
    weight: 6100,
    sections: [
      { section: 1, y_ref_bottom: 1187, y_ref_top: 1111 },
      { section: 2, y_ref_bottom: 1111, y_ref_top: 1020 },
      { section: 3, y_ref_bottom: 1020, y_ref_top: 926 },
      { section: 4, y_ref_bottom: 926, y_ref_top: 832 },
      { section: 5, y_ref_bottom: 832, y_ref_top: 745 },
      { section: 6, y_ref_bottom: 745, y_ref_top: 651 },
      { section: 7, y_ref_bottom: 651, y_ref_top: 554 }
    ]
  },
  {
    weight: 6200,
    sections: [
      { section: 1, y_ref_bottom: 1182, y_ref_top: 1135 },
      { section: 2, y_ref_bottom: 1135, y_ref_top: 1041 },
      { section: 3, y_ref_bottom: 1041, y_ref_top: 944 },
      { section: 4, y_ref_bottom: 944, y_ref_top: 853 },
      { section: 5, y_ref_bottom: 853, y_ref_top: 770 },
      { section: 6, y_ref_bottom: 770, y_ref_top: 676 },
      { section: 7, y_ref_bottom: 676, y_ref_top: 578 }
    ]
  },
  {
    weight: 6300,
    sections: [
      { section: 1, y_ref_bottom: 1186, y_ref_top: 1150 },
      { section: 2, y_ref_bottom: 1150, y_ref_top: 1059 },
      { section: 3, y_ref_bottom: 1059, y_ref_top: 965 },
      { section: 4, y_ref_bottom: 965, y_ref_top: 879 },
      { section: 5, y_ref_bottom: 879, y_ref_top: 788 },
      { section: 6, y_ref_bottom: 788, y_ref_top: 701 },
      { section: 7, y_ref_bottom: 701, y_ref_top: 611 }
    ]
  },
  {
    weight: 6400,
    sections: [
      { section: 1, y_ref_bottom: 1182, y_ref_top: 1171 },
      { section: 2, y_ref_bottom: 1171, y_ref_top: 1077 },
      { section: 3, y_ref_bottom: 1077, y_ref_top: 987 },
      { section: 4, y_ref_bottom: 987, y_ref_top: 900 },
      { section: 5, y_ref_bottom: 900, y_ref_top: 817 },
      { section: 6, y_ref_bottom: 817, y_ref_top: 723 },
      { section: 7, y_ref_bottom: 723, y_ref_top: 636 }
    ]
  },
  {
    weight: 6500,
    sections: [
      { section: 1, y_ref_bottom: 1182, y_ref_top: 1182 },
      { section: 2, y_ref_bottom: 1182, y_ref_top: 1095 },
      { section: 3, y_ref_bottom: 1095, y_ref_top: 1005 },
      { section: 4, y_ref_bottom: 1005, y_ref_top: 922 },
      { section: 5, y_ref_bottom: 922, y_ref_top: 835 },
      { section: 6, y_ref_bottom: 835, y_ref_top: 748 },
      { section: 7, y_ref_bottom: 748, y_ref_top: 662 }
    ]
  }
];
  // INLET ON/OFF
const INLET_TABLE = [
  {
    mode: "off",
    sections: [
      { section: 1, y_ref_bottom: 1186, y_ref_top: 1092 },
      { section: 2, y_ref_bottom: 1092, y_ref_top: 998 },
      { section: 3, y_ref_bottom: 998, y_ref_top: 904 },
      { section: 4, y_ref_bottom: 904, y_ref_top: 810 },
      { section: 5, y_ref_bottom: 810, y_ref_top: 716 },
      { section: 6, y_ref_bottom: 716, y_ref_top: 625 },
      { section: 7, y_ref_bottom: 625, y_ref_top: 528 },
      { section: 8, y_ref_bottom: 528, y_ref_top: 430 },
      { section: 9, y_ref_bottom: 430, y_ref_top: 336 },
      { section: 10, y_ref_bottom: 336, y_ref_top: 242 },
      { section: 11, y_ref_bottom: 242, y_ref_top: 148 },
      { section: 12, y_ref_bottom: 148, y_ref_top: 54 }
    ]
  },
  {
    mode: "on",
    sections: [
      { section: 1, y_ref_bottom: 1186, y_ref_top: 1153 },
      { section: 2, y_ref_bottom: 1153, y_ref_top: 1056 },
      { section: 3, y_ref_bottom: 1056, y_ref_top: 958 },
      { section: 4, y_ref_bottom: 958, y_ref_top: 853 },
      { section: 5, y_ref_bottom: 853, y_ref_top: 766 },
      { section: 6, y_ref_bottom: 766, y_ref_top: 672 },
      { section: 7, y_ref_bottom: 672, y_ref_top: 568 },
      { section: 8, y_ref_bottom: 568, y_ref_top: 470 },
      { section: 9, y_ref_bottom: 470, y_ref_top: 372 },
      { section: 10, y_ref_bottom: 372, y_ref_top: 275 },
      { section: 11, y_ref_bottom: 275, y_ref_top: 174 },
      { section: 12, y_ref_bottom: 174, y_ref_top: 76 }
    ]
  }
];
// RESULT TABLE — y_ref → climb gradient (%)
const RESULT_TABLE = [
  { result: -2, section: 1, y_ref_bottom: 1186, y_ref_top: 1092 },
  { result: -1, section: 2, y_ref_bottom: 1092, y_ref_top: 998 },
  { result: 0,  section: 3, y_ref_bottom: 998,  y_ref_top: 904 },
  { result: 1,  section: 4, y_ref_bottom: 904,  y_ref_top: 806 },
  { result: 2,  section: 5, y_ref_bottom: 806,  y_ref_top: 716 },
  { result: 3,  section: 6, y_ref_bottom: 716,  y_ref_top: 618 },
  { result: 4,  section: 7, y_ref_bottom: 618,  y_ref_top: 524 },
  { result: 5,  section: 8, y_ref_bottom: 524,  y_ref_top: 430 },
  { result: 6,  section: 9, y_ref_bottom: 430,  y_ref_top: 336 },
  { result: 7,  section: 10, y_ref_bottom: 336, y_ref_top: 242 },
  { result: 8,  section: 11, y_ref_bottom: 242, y_ref_top: 148 },
  { result: 9,  section: 12, y_ref_bottom: 148, y_ref_top: 54 }
];

// ----------------------
// 2) FUNÇÕES DE SUPORTE
// ----------------------
let DEBUG_REPORT = [];

function reportFail(msg) {
  DEBUG_REPORT.push(msg);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(x, x1, y1, x2, y2) {
  if (x2 === x1) return y1;
  return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
}

function findBounding(array, key, value) {
  const sorted = [...array].sort((a, b) => a[key] - b[key]);

  if (value < sorted[0][key]) {
    reportFail(`${key}=${value} está abaixo do mínimo (${sorted[0][key]})`);
    return [null, null];
  }

  if (value > sorted[sorted.length - 1][key]) {
    reportFail(`${key}=${value} está acima do máximo (${sorted[sorted.length - 1][key]})`);
    return [null, null];
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (value >= a[key] && value <= b[key]) return [a, b];
  }

  reportFail(`Não foi possível encontrar bounding válido para ${key}=${value}`);
  return [null, null];
}

function findSectionByY(y, sections) {
  for (const s of sections) {
    if (y <= s.y_ref_bottom && y >= s.y_ref_top) return s;
  }

  // clamp ao mais próximo
  let closest = sections[0];
  let best = Infinity;

  for (const s of sections) {
    const mid = (s.y_ref_bottom + s.y_ref_top) / 2;
    const d = Math.abs(y - mid);
    if (d < best) {
      best = d;
      closest = s;
    }
  }

  return closest;
}

function relativePositionInSection(y, section) {
  const span = section.y_ref_bottom - section.y_ref_top;
  if (span === 0) return 0;
  return (section.y_ref_bottom - y) / span; // 0 = bottom, 1 = top
}

function yFromSectionAndRelPos(section, rel) {
  return section.y_ref_bottom - rel * (section.y_ref_bottom - section.y_ref_top);
}

// ----------------------
// 3) STEP 1 — y_ref via PA/OAT
// ----------------------

function getYRefFromPAOAT(pressureAltitude, oat) {
  const [paLow, paHigh] = findBounding(PA_OAT_TABLE, "pressure_altitude", pressureAltitude);

  if (!paLow || !paHigh) {
    reportFail(`Altitude ${pressureAltitude} fora dos limites da tabela.`);
    return null;
  }

  function interpOAT(paRow) {
    const vals = [...paRow.values].sort((a, b) => a.oat - b.oat);
    const [oLow, oHigh] = findBounding(vals, "oat", oat);

    if (!oLow || !oHigh) {
      reportFail(`Temperatura ${oat} fora dos limites da tabela.`);
      return null;
    }

    if (oLow.oat === oHigh.oat) return oLow.y_ref;
    return lerp(oat, oLow.oat, oLow.y_ref, oHigh.oat, oHigh.y_ref);
  }

  const yLow = interpOAT(paLow);
  const yHigh = interpOAT(paHigh);

  if (yLow == null || yHigh == null) return null;

  if (paLow.pressure_altitude === paHigh.pressure_altitude) return yLow;

  return lerp(
    pressureAltitude,
    paLow.pressure_altitude,
    yLow,
    paHigh.pressure_altitude,
    yHigh
  );
}

// ----------------------
// 4) STEP 2/3 — mapear via sections de referência e TOW
// ----------------------

function mapYThroughWeight(yRef, tow) {
  const refSection = findSectionByY(yRef, REF_SECTIONS);
  const rel = relativePositionInSection(yRef, refSection);

  const [wLow, wHigh] = findBounding(WEIGHT_TABLE, "weight", tow);
  if (!wLow || !wHigh) {
    reportFail(`Peso ${tow} fora dos limites da tabela (min=${WEIGHT_TABLE[0].weight}, max=${WEIGHT_TABLE[WEIGHT_TABLE.length - 1].weight}).`);
    return null;
  }

  function yAtWeight(wRow) {
    const sec = wRow.sections.find(s => s.section === refSection.section);
    if (!sec) {
      reportFail(`Peso ${wRow.weight} não contém a section ${refSection.section}.`);
      return null;
    }
    return yFromSectionAndRelPos(sec, rel);
  }

  const yLow = yAtWeight(wLow);
  const yHigh = yAtWeight(wHigh);

  if (yLow == null && yHigh == null) return null;
  if (yLow == null) return yHigh;
  if (yHigh == null) return yLow;

  if (wLow.weight === wHigh.weight) return yLow;

  return lerp(tow, wLow.weight, yLow, wHigh.weight, yHigh);
}

// ----------------------
// 5) STEP 4 — inlet ON/OFF
// ----------------------

function mapYThroughInlet(yWeight, inletMode) {
  const offRow = INLET_TABLE.find(r => r.mode === "off");
  const onRow = INLET_TABLE.find(r => r.mode === "on");

  if (inletMode === "off") {
    // OFF não altera nada
    return yWeight;
  }

  if (inletMode !== "on") {
    reportFail(`Modo inlet inválido: ${inletMode}`);
    return null;
  }

  // --- inlet ON ---
  // 1) encontrar section correspondente no modo OFF
  const offSec = findSectionByY(yWeight, offRow.sections);

  // 2) posição relativa dentro da section OFF
  const rel = relativePositionInSection(yWeight, offSec);

  // 3) aplicar a mesma section no modo ON
  const onSec = onRow.sections.find(s => s.section === offSec.section);

  if (!onSec) {
    reportFail(`Section ${offSec.section} não existe no modo ON.`);
    return null;
  }

  // 4) calcular novo Y no modo ON
  return yFromSectionAndRelPos(onSec, rel);
}


// ----------------------
// 6) STEP 5 — resultado final
// ----------------------

function getClimbGradientFromY(y) {
  if (y == null || isNaN(y)) {
  reportFail("Valor Y inválido após processamento.");
  return null;
}
  
  const sorted = [...RESULT_TABLE].sort((a, b) => b.y_ref_bottom - a.y_ref_bottom);

  // Fora dos limites → clamp
  if (y >= sorted[0].y_ref_bottom) return sorted[0].result;
  if (y <= sorted[sorted.length - 1].y_ref_top)
    return sorted[sorted.length - 1].result;

  for (let i = 0; i < sorted.length; i++) {
    const r = sorted[i];

    // Se o y está dentro da section → interpolação contínua
    if (y <= r.y_ref_bottom && y >= r.y_ref_top) {
      const nextResult = (i < sorted.length - 1) ? sorted[i + 1].result : r.result;
      return lerp(
        y,
        r.y_ref_bottom, r.result,
        r.y_ref_top, nextResult
      );
    }

    // Se está entre duas sections → interpolação entre sections
    if (i < sorted.length - 1) {
      const rNext = sorted[i + 1];
      if (y < r.y_ref_top && y > rNext.y_ref_bottom) {
        return lerp(
          y,
          r.y_ref_top, r.result,
          rNext.y_ref_bottom, rNext.result
        );
      }
    }
  }

  return sorted[sorted.length - 1].result;
}

// ---------------------------------------------------------
// 4) FUNÇÃO PRINCIPAL — CLIMB GRADIENTE 2º SEGMENTO
// ---------------------------------------------------------

export function CLIMB_GRADIENTE_2SEG_Flaps1({ pressureAltitude, oat, tow, inlet, gradientRequired }) {
  DEBUG_REPORT = []; // limpar relatório
	// STEP 1 — y_ref via PA/OAT
  const yRef = getYRefFromPAOAT(pressureAltitude, oat);
  if (yRef == null) return { gradient: 0, status: "FAILED", report: DEBUG_REPORT };
  
	// STEP 2/3 — ajustar via sections de referência + peso
  const yAfterWeight = mapYThroughWeight(yRef, tow);
  if (yAfterWeight == null) return { gradient: 0, status: "FAILED", report: DEBUG_REPORT };
  
  // STEP 4 — inlet ON/OFF
  const yAfterInlet = mapYThroughInlet(yAfterWeight, inlet);
  if (yAfterInlet == null) return { gradient: 0, status: "FAILED", report: DEBUG_REPORT };
  
	// STEP 5 — resultado final
  const gradient = getClimbGradientFromY(yAfterInlet);
	console.log("CG performed for 2º segment flaps 1 ", gradient);
	console.log("CG performed for 2º segment flaps 1 - Turn 15º ", (gradient-0.5));
  if (gradient == null) return { gradient: 0, status: "FAILED", report: DEBUG_REPORT };
  

  const rounded = Math.round((gradient-5) * 10) / 10;
  
  if (rounded < gradientRequired) {
    reportFail(`Gradient ${rounded}% está abaixo do mínimo (${gradientRequired}%).`);
    return { gradient: rounded, status: "FAILED", report: DEBUG_REPORT };
  }
	
  return {
    gradient: rounded,
    status: "PASSED",
    report: DEBUG_REPORT
  };
}
// Export default
export default CLIMB_GRADIENTE_2SEG_Flaps1;











// ---------------------------------------------------------
// FUNÇÃO — MTOW COMPATÍVEL COM O CLIMB GRADIENT REQUERIDO
// ---------------------------------------------------------

export function CLIMB_GRADIENTE_2SEG_Flaps1_MTOW({
  pressureAltitude,
  oat,
  inlet,
  gradientRequired
}) {

  // limpa o relatório de debug
  DEBUG_REPORT = [];

  // STEP 1 — calcular y_ref base através de PA e OAT
  const yRef = getYRefFromPAOAT(pressureAltitude, oat);

  // se falhar aborta
  if (yRef == null) {
    return { maxTow: null, status: "FAILED", report: DEBUG_REPORT };
  }

  // ordenar pesos
  const weights = [...WEIGHT_TABLE].sort((a, b) => a.weight - b.weight);

  let lastPassing = null;
  let firstFailing = null;

  // testar cada peso
  for (const row of weights) {

    const tow = row.weight;

    // STEP 2/3 — aplicar peso
    const yAfterWeight = mapYThroughWeight(yRef, tow);
    if (yAfterWeight == null) continue;

    // STEP 4 — aplicar inlet
    const yAfterInlet = mapYThroughInlet(yAfterWeight, inlet);
    if (yAfterInlet == null) continue;

    // STEP 5 — converter para gradient
    const gradient = getClimbGradientFromY(yAfterInlet);
    if (gradient == null) continue;

    // verificar se cumpre o requisito
    if (gradient >= gradientRequired) {
      lastPassing = { tow, gradient };
    } else if (lastPassing != null) {
      firstFailing = { tow, gradient };
      break;
    }
  }

  // nenhum peso cumpre
  if (!lastPassing) {
    reportFail(`Nenhum peso cumpre o gradient mínimo (${gradientRequired}%).`);
    return { maxTow: null, status: "FAILED", report: DEBUG_REPORT };
  }

  // se não houver falha depois → limite da tabela
  if (!firstFailing) {
    return {
      maxTow: lastPassing.tow,
      gradient: Math.round(lastPassing.gradient * 10) / 10,
      status: "PASSED",
      report: DEBUG_REPORT
    };
  }

  // interpolação do peso limite
  const towExact = lerp(
    gradientRequired,
    lastPassing.gradient, lastPassing.tow,
    firstFailing.gradient, firstFailing.tow
  );

  // arredondamento conservador para 50 lb
  const mtow = Math.floor(towExact / 50) * 50;

  return {
    maxTow: mtow,
    gradient: gradientRequired,
    status: "PASSED",
    report: DEBUG_REPORT
  };
}
