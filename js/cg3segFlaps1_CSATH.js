// cg3segFlaps1_CSATH.js
// ----------------------
// 1) TABELAS DE DADOS
// ----------------------

// PA / OAT → y_ref  (DISTANCE | FLAPS 1)
const PA_OAT_TABLE = [
  {
    pressure_altitude: 12000,
    values: [
      { oat: -40, y_ref: 454 },
      { oat: -30, y_ref: 154 }
    ]
  },
  {
    pressure_altitude: 10000,
    values: [
      { oat: -40, y_ref: 738 },
      { oat: -30, y_ref: 594 },
      { oat: -20, y_ref: 384 }
    ]
  },
  {
    pressure_altitude: 8000,
    values: [
      { oat: -40, y_ref: 827 },
      { oat: -30, y_ref: 794 },
      { oat: -20, y_ref: 713 },
      { oat: -10, y_ref: 554 },
      { oat: 0, y_ref: 295 }
    ]
  },
  {
    pressure_altitude: 6000,
    values: [
      { oat: -30, y_ref: 853 },
      { oat: -20, y_ref: 820 },
      { oat: -10, y_ref: 779 },
      { oat: 0, y_ref: 665 },
      { oat: 10, y_ref: 446 }
    ]
  },
  {
    pressure_altitude: 4000,
    values: [
      { oat: -30, y_ref: 905 },
      { oat: -20, y_ref: 879 },
      { oat: -10, y_ref: 853 },
      { oat: 0, y_ref: 820 },
      { oat: 10, y_ref: 742 },
      { oat: 20, y_ref: 546 },
      { oat: 30, y_ref: 173 }
    ]
  },
  {
    pressure_altitude: 2000,
    values: [
      { oat: -20, y_ref: 927 },
      { oat: -10, y_ref: 901 },
      { oat: 0, y_ref: 875 },
      { oat: 10, y_ref: 846 },
      { oat: 20, y_ref: 779 },
      { oat: 30, y_ref: 580 },
      { oat: 40, y_ref: 203 }
    ]
  },
  {
    pressure_altitude: 0,
    values: [
      { oat: -20, y_ref: 968 },
      { oat: -10, y_ref: 945 },
      { oat: 0, y_ref: 927 },
      { oat: 10, y_ref: 905 },
      { oat: 20, y_ref: 879 },
      { oat: 30, y_ref: 809 },
      { oat: 40, y_ref: 587 }
    ]
  }
];

// Sections de referência (REF LINE)
const REF_SECTIONS = [
  { section: 1, y_ref_bottom: 934, y_ref_top: 846 },
  { section: 2, y_ref_bottom: 846, y_ref_top: 753 },
  { section: 3, y_ref_bottom: 753, y_ref_top: 661 },
  { section: 4, y_ref_bottom: 661, y_ref_top: 568 },
  { section: 5, y_ref_bottom: 568, y_ref_top: 491 },
  { section: 6, y_ref_bottom: 491, y_ref_top: 391 },
  { section: 7, y_ref_bottom: 391, y_ref_top: 302 }
];

const WEIGHT_TABLE = [
  {
    weight: 4500,
    sections: [
      { section: 1, y_ref_bottom: 1091, y_ref_top: 1045 },
      { section: 2, y_ref_bottom: 1045, y_ref_top: 1016 },
      { section: 3, y_ref_bottom: 1016, y_ref_top: 992 },
      { section: 4, y_ref_bottom: 992, y_ref_top: 963 },
      { section: 5, y_ref_bottom: 963, y_ref_top: 943 },
      { section: 6, y_ref_bottom: 943, y_ref_top: 926 },
      { section: 7, y_ref_bottom: 926, y_ref_top: 917 }
    ]
  },
  {
    weight: 4600,
    sections: [
      { section: 1, y_ref_bottom: 1089, y_ref_top: 1039 },
      { section: 2, y_ref_bottom: 1039, y_ref_top: 1010 },
      { section: 3, y_ref_bottom: 1010, y_ref_top: 981 },
      { section: 4, y_ref_bottom: 981, y_ref_top: 949 },
      { section: 5, y_ref_bottom: 949, y_ref_top: 926 },
      { section: 6, y_ref_bottom: 926, y_ref_top: 911 },
      { section: 7, y_ref_bottom: 911, y_ref_top: 899 }
    ]
  },
  {
    weight: 4700,
    sections: [
      { section: 1, y_ref_bottom: 1083, y_ref_top: 1030 },
      { section: 2, y_ref_bottom: 1030, y_ref_top: 1001 },
      { section: 3, y_ref_bottom: 1001, y_ref_top: 972 },
      { section: 4, y_ref_bottom: 972, y_ref_top: 934 },
      { section: 5, y_ref_bottom: 934, y_ref_top: 911 },
      { section: 6, y_ref_bottom: 911, y_ref_top: 894 },
      { section: 7, y_ref_bottom: 894, y_ref_top: 879 }
    ]
  },
  {
    weight: 4800,
    sections: [
      { section: 1, y_ref_bottom: 1074, y_ref_top: 1025 },
      { section: 2, y_ref_bottom: 1025, y_ref_top: 990 },
      { section: 3, y_ref_bottom: 990, y_ref_top: 958 },
      { section: 4, y_ref_bottom: 958, y_ref_top: 923 },
      { section: 5, y_ref_bottom: 923, y_ref_top: 894 },
      { section: 6, y_ref_bottom: 894, y_ref_top: 876 },
      { section: 7, y_ref_bottom: 876, y_ref_top: 859 }
    ]
  },
  {
    weight: 4900,
    sections: [
      { section: 1, y_ref_bottom: 1068, y_ref_top: 1016 },
      { section: 2, y_ref_bottom: 1016, y_ref_top: 981 },
      { section: 3, y_ref_bottom: 981, y_ref_top: 946 },
      { section: 4, y_ref_bottom: 946, y_ref_top: 905 },
      { section: 5, y_ref_bottom: 905, y_ref_top: 876 },
      { section: 6, y_ref_bottom: 876, y_ref_top: 859 },
      { section: 7, y_ref_bottom: 859, y_ref_top: 838 }
    ]
  },
  {
    weight: 5000,
    sections: [
      { section: 1, y_ref_bottom: 1057, y_ref_top: 1007 },
      { section: 2, y_ref_bottom: 1007, y_ref_top: 969 },
      { section: 3, y_ref_bottom: 969, y_ref_top: 931 },
      { section: 4, y_ref_bottom: 931, y_ref_top: 888 },
      { section: 5, y_ref_bottom: 888, y_ref_top: 859 },
      { section: 6, y_ref_bottom: 859, y_ref_top: 838 },
      { section: 7, y_ref_bottom: 838, y_ref_top: 815 }
    ]
  },
  {
    weight: 5100,
    sections: [
      { section: 1, y_ref_bottom: 1054, y_ref_top: 998 },
      { section: 2, y_ref_bottom: 998, y_ref_top: 960 },
      { section: 3, y_ref_bottom: 960, y_ref_top: 920 },
      { section: 4, y_ref_bottom: 920, y_ref_top: 873 },
      { section: 5, y_ref_bottom: 873, y_ref_top: 841 },
      { section: 6, y_ref_bottom: 841, y_ref_top: 818 },
      { section: 7, y_ref_bottom: 818, y_ref_top: 792 }
    ]
  },
  {
    weight: 5200,
    sections: [
      { section: 1, y_ref_bottom: 1043, y_ref_top: 988 },
      { section: 2, y_ref_bottom: 988, y_ref_top: 947 },
      { section: 3, y_ref_bottom: 947, y_ref_top: 904 },
      { section: 4, y_ref_bottom: 904, y_ref_top: 857 },
      { section: 5, y_ref_bottom: 857, y_ref_top: 822 },
      { section: 6, y_ref_bottom: 822, y_ref_top: 796 },
      { section: 7, y_ref_bottom: 796, y_ref_top: 773 }
    ]
  },
  {
    weight: 5300,
    sections: [
      { section: 1, y_ref_bottom: 1035, y_ref_top: 974 },
      { section: 2, y_ref_bottom: 974, y_ref_top: 930 },
      { section: 3, y_ref_bottom: 930, y_ref_top: 886 },
      { section: 4, y_ref_bottom: 886, y_ref_top: 834 },
      { section: 5, y_ref_bottom: 834, y_ref_top: 799 },
      { section: 6, y_ref_bottom: 799, y_ref_top: 770 },
      { section: 7, y_ref_bottom: 770, y_ref_top: 738 }
    ]
  },
  {
    weight: 5400,
    sections: [
      { section: 1, y_ref_bottom: 1020, y_ref_top: 956 },
      { section: 2, y_ref_bottom: 956, y_ref_top: 907 },
      { section: 3, y_ref_bottom: 907, y_ref_top: 860 },
      { section: 4, y_ref_bottom: 860, y_ref_top: 799 },
      { section: 5, y_ref_bottom: 799, y_ref_top: 761 },
      { section: 6, y_ref_bottom: 761, y_ref_top: 723 },
      { section: 7, y_ref_bottom: 723, y_ref_top: 685 }
    ]
  },
  {
    weight: 5500,
    sections: [
      { section: 1, y_ref_bottom: 1007, y_ref_top: 940 },
      { section: 2, y_ref_bottom: 940, y_ref_top: 882 },
      { section: 3, y_ref_bottom: 882, y_ref_top: 827 },
      { section: 4, y_ref_bottom: 827, y_ref_top: 765 },
      { section: 5, y_ref_bottom: 765, y_ref_top: 713 },
      { section: 6, y_ref_bottom: 713, y_ref_top: 675 },
      { section: 7, y_ref_bottom: 675, y_ref_top: 632 }
    ]
  },
  {
    weight: 5600,
    sections: [
      { section: 1, y_ref_bottom: 992, y_ref_top: 920 },
      { section: 2, y_ref_bottom: 920, y_ref_top: 856 },
      { section: 3, y_ref_bottom: 856, y_ref_top: 797 },
      { section: 4, y_ref_bottom: 797, y_ref_top: 731 },
      { section: 5, y_ref_bottom: 731, y_ref_top: 675 },
      { section: 6, y_ref_bottom: 675, y_ref_top: 620 },
      { section: 7, y_ref_bottom: 620, y_ref_top: 565 }
    ]
  },
  {
    weight: 5700,
    sections: [
      { section: 1, y_ref_bottom: 978, y_ref_top: 899 },
      { section: 2, y_ref_bottom: 899, y_ref_top: 830 },
      { section: 3, y_ref_bottom: 830, y_ref_top: 765 },
      { section: 4, y_ref_bottom: 765, y_ref_top: 690 },
      { section: 5, y_ref_bottom: 690, y_ref_top: 632 },
      { section: 6, y_ref_bottom: 632, y_ref_top: 565 },
      { section: 7, y_ref_bottom: 565, y_ref_top: 506 }
    ]
  },
  {
    weight: 5800,
    sections: [
      { section: 1, y_ref_bottom: 963, y_ref_top: 879 },
      { section: 2, y_ref_bottom: 879, y_ref_top: 806 },
      { section: 3, y_ref_bottom: 806, y_ref_top: 733 },
      { section: 4, y_ref_bottom: 733, y_ref_top: 655 },
      { section: 5, y_ref_bottom: 655, y_ref_top: 588 },
      { section: 6, y_ref_bottom: 588, y_ref_top: 509 },
      { section: 7, y_ref_bottom: 509, y_ref_top: 445 }
    ]
  },
  {
    weight: 5900,
    sections: [
      { section: 1, y_ref_bottom: 949, y_ref_top: 864 },
      { section: 2, y_ref_bottom: 864, y_ref_top: 777 },
      { section: 3, y_ref_bottom: 777, y_ref_top: 699 },
      { section: 4, y_ref_bottom: 699, y_ref_top: 614 },
      { section: 5, y_ref_bottom: 614, y_ref_top: 536 },
      { section: 6, y_ref_bottom: 536, y_ref_top: 451 },
      { section: 7, y_ref_bottom: 451, y_ref_top: 375 }
    ]
  },
  {
    weight: 6000,
    sections: [
      { section: 1, y_ref_bottom: 931, y_ref_top: 841 },
      { section: 2, y_ref_bottom: 841, y_ref_top: 754 },
      { section: 3, y_ref_bottom: 754, y_ref_top: 664 },
      { section: 4, y_ref_bottom: 664, y_ref_top: 570 },
      { section: 5, y_ref_bottom: 570, y_ref_top: 486 },
      { section: 6, y_ref_bottom: 486, y_ref_top: 393 },
      { section: 7, y_ref_bottom: 393, y_ref_top: 300 }
    ]
  },
  {
    weight: 6100,
    sections: [
      { section: 1, y_ref_bottom: 920, y_ref_top: 818 },
      { section: 2, y_ref_bottom: 818, y_ref_top: 725 },
      { section: 3, y_ref_bottom: 725, y_ref_top: 623 },
      { section: 4, y_ref_bottom: 623, y_ref_top: 521 },
      { section: 5, y_ref_bottom: 521, y_ref_top: 428 },
      { section: 6, y_ref_bottom: 428, y_ref_top: 320 },
      { section: 7, y_ref_bottom: 320, y_ref_top: 221 }
    ]
  },
  {
    weight: 6200,
    sections: [
      { section: 1, y_ref_bottom: 899, y_ref_top: 795 },
      { section: 2, y_ref_bottom: 795, y_ref_top: 693 },
      { section: 3, y_ref_bottom: 693, y_ref_top: 582 },
      { section: 4, y_ref_bottom: 582, y_ref_top: 474 },
      { section: 5, y_ref_bottom: 474, y_ref_top: 367 },
      { section: 6, y_ref_bottom: 367, y_ref_top: 247 },
      { section: 7, y_ref_bottom: 247, y_ref_top: 131 }
    ]
  },
  {
    weight: 6300,
    sections: [
      { section: 1, y_ref_bottom: 888, y_ref_top: 771 },
      { section: 2, y_ref_bottom: 771, y_ref_top: 664 },
      { section: 3, y_ref_bottom: 664, y_ref_top: 541 },
      { section: 4, y_ref_bottom: 541, y_ref_top: 422 },
      { section: 5, y_ref_bottom: 422, y_ref_top: 306 },
      { section: 6, y_ref_bottom: 306, y_ref_top: 172 }
    ]
  },
  {
    weight: 6400,
    sections: [
      { section: 1, y_ref_bottom: 869, y_ref_top: 755 },
      { section: 2, y_ref_bottom: 755, y_ref_top: 633 },
      { section: 3, y_ref_bottom: 633, y_ref_top: 496 },
      { section: 4, y_ref_bottom: 496, y_ref_top: 371 },
      { section: 5, y_ref_bottom: 371, y_ref_top: 243 }
    ]
  },
  {
    weight: 6500,
    sections: [
      { section: 1, y_ref_bottom: 848, y_ref_top: 729 },
      { section: 2, y_ref_bottom: 729, y_ref_top: 604 },
      { section: 3, y_ref_bottom: 604, y_ref_top: 453 },
      { section: 4, y_ref_bottom: 453, y_ref_top: 316 },
      { section: 5, y_ref_bottom: 316, y_ref_top: 176 }
    ]
  }
];


// INLET ON/OFF
const INLET_TABLE = [
  {
    mode: "off",
    sections: [
      { section: 1, y_ref_bottom: 1122, y_ref_top: 1029 },
      { section: 2, y_ref_bottom: 1029, y_ref_top: 936 },
      { section: 3, y_ref_bottom: 936, y_ref_top: 846 },
      { section: 4, y_ref_bottom: 846, y_ref_top: 755 },
      { section: 5, y_ref_bottom: 755, y_ref_top: 659 },
      { section: 6, y_ref_bottom: 659, y_ref_top: 569 },
      { section: 7, y_ref_bottom: 569, y_ref_top: 476 },
      { section: 8, y_ref_bottom: 476, y_ref_top: 383 },
      { section: 9, y_ref_bottom: 383, y_ref_top: 293 }
    ]
  },
  {
    mode: "on",
    sections: [
      { section: 1, y_ref_bottom: 1102, y_ref_top: 997 },
      { section: 2, y_ref_bottom: 997, y_ref_top: 898 },
      { section: 3, y_ref_bottom: 898, y_ref_top: 793 },
      { section: 4, y_ref_bottom: 793, y_ref_top: 688 },
      { section: 5, y_ref_bottom: 688, y_ref_top: 563 },
      { section: 6, y_ref_bottom: 563, y_ref_top: 447 },
      { section: 7, y_ref_bottom: 447, y_ref_top: 327 },
      { section: 8, y_ref_bottom: 327, y_ref_top: 220 },
      { section: 9, y_ref_bottom: 220, y_ref_top: 109 }
    ]
  }
];

// RESULT TABLE — y_ref → distance (m)
const RESULT_TABLE = [
  { result: 0, section: 1, y_ref_bottom: 1212, y_ref_top: 1174 },
  { result: 100, section: 2, y_ref_bottom: 1174, y_ref_top: 1137 },
  { result: 200, section: 3, y_ref_bottom: 1137, y_ref_top: 1102 },
  { result: 300, section: 4, y_ref_bottom: 1102, y_ref_top: 1067 },
  { result: 400, section: 5, y_ref_bottom: 1067, y_ref_top: 1029 },
  { result: 500, section: 6, y_ref_bottom: 1029, y_ref_top: 953 },
  { result: 700, section: 7, y_ref_bottom: 953, y_ref_top: 880 },
  { result: 900, section: 8, y_ref_bottom: 880, y_ref_top: 846 },
  { result: 1000, section: 9, y_ref_bottom: 846, y_ref_top: 808 },
  { result: 1100, section: 10, y_ref_bottom: 808, y_ref_top: 770 },
  { result: 1200, section: 11, y_ref_bottom: 770, y_ref_top: 732 },
  { result: 1300, section: 12, y_ref_bottom: 732, y_ref_top: 694 },
  { result: 1400, section: 13, y_ref_bottom: 694, y_ref_top: 659 },
  { result: 1500, section: 14, y_ref_bottom: 659, y_ref_top: 620 },
  { result: 1600, section: 15, y_ref_bottom: 620, y_ref_top: 591 },
  { result: 1700, section: 16, y_ref_bottom: 591, y_ref_top: 551 },
  { result: 1800, section: 17, y_ref_bottom: 551, y_ref_top: 514 },
  { result: 1900, section: 18, y_ref_bottom: 514, y_ref_top: 477 },
  { result: 2000, section: 19, y_ref_bottom: 477, y_ref_top: 440 },
  { result: 2100, section: 20, y_ref_bottom: 440, y_ref_top: 403 },
  { result: 2200, section: 21, y_ref_bottom: 403, y_ref_top: 366 },
  { result: 2300, section: 22, y_ref_bottom: 366, y_ref_top: 329 },
  { result: 2400, section: 23, y_ref_bottom: 329, y_ref_top: 292 },
  { result: 2500, section: 24, y_ref_bottom: 292, y_ref_top: 255 },
  { result: 2600, section: 25, y_ref_bottom: 255, y_ref_top: 218 },
  { result: 2700, section: 26, y_ref_bottom: 218, y_ref_top: 181 },
  { result: 2800, section: 27, y_ref_bottom: 181, y_ref_top: 144 },
  { result: 2900, section: 28, y_ref_bottom: 144, y_ref_top: 111 }
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
// 4) FUNÇÃO PRINCIPAL — CLIMB GRADIENTE 3º SEGMENTO
// ---------------------------------------------------------

export function CLIMB_GRADIENTE_3SEG_Flaps1({ pressureAltitude, oat, tow, inlet, gradientRequired }) {
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
  if (gradient == null) return { gradient: 0, status: "FAILED", report: DEBUG_REPORT };

  const rounded = Math.round(gradient * 10) / 10;
  
  if (rounded < gradientRequired) {
    reportFail(`Gradient ${rounded} está abaixo do mínimo (${gradientRequired}).`);
    return { gradient: rounded, status: "PASSED", report: DEBUG_REPORT };
  }

  return {
    gradient: rounded,
    status: "PASSED",
    report: DEBUG_REPORT
  };
}
// Export default
export default CLIMB_GRADIENTE_3SEG_Flaps1;