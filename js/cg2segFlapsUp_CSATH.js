// cg2seg_CSATH.js
// ----------------------
// 1) TABELAS DE DADOS
// ----------------------

// PA / OAT → y_ref
const PA_OAT_TABLE = [
  {
    pressure_altitude: 12000,
    values: [
      { oat: -40, y_ref: 841 },
      { oat: -30, y_ref: 895 },
      { oat: -20, y_ref: 952 },
      { oat: -10, y_ref: 1013 },
      { oat: 0, y_ref: 1071 },
      { oat: 10, y_ref: 1128 },
      { oat: 20, y_ref: 1189 }
    ]
  },
  {
    pressure_altitude: 10000,
    values: [
      { oat: -40, y_ref: 734 },
      { oat: -30, y_ref: 791 },
      { oat: -20, y_ref: 852 },
      { oat: -10, y_ref: 913 },
      { oat: 0, y_ref: 978 },
      { oat: 10, y_ref: 1042 },
      { oat: 20, y_ref: 1107 },
      { oat: 30, y_ref: 1171 }
    ]
  },
  {
    pressure_altitude: 8000,
    values: [
      { oat: -40, y_ref: 677 },
      { oat: -30, y_ref: 702 },
      { oat: -20, y_ref: 734 },
      { oat: -10, y_ref: 806 },
      { oat: 0, y_ref: 881 },
      { oat: 10, y_ref: 956 },
      { oat: 20, y_ref: 1028 },
      { oat: 30, y_ref: 1103 }
    ]
  },
  {
    pressure_altitude: 6000,
    values: [
      { oat: -30, y_ref: 659 },
      { oat: -20, y_ref: 684 },
      { oat: -10, y_ref: 705 },
      { oat: 0, y_ref: 773 },
      { oat: 10, y_ref: 856 },
      { oat: 20, y_ref: 942 },
      { oat: 30, y_ref: 1021 },
      { oat: 40, y_ref: 1103 }
    ]
  },
  {
    pressure_altitude: 4000,
    values: [
      { oat: -30, y_ref: 626 },
      { oat: -20, y_ref: 644 },
      { oat: -10, y_ref: 669 },
      { oat: 0, y_ref: 691 },
      { oat: 10, y_ref: 741 },
      { oat: 20, y_ref: 838 },
      { oat: 30, y_ref: 935 },
      { oat: 40, y_ref: 1028 }
    ]
  },
  {
    pressure_altitude: 2000,
    values: [
      { oat: -20, y_ref: 605 },
      { oat: -10, y_ref: 630 },
      { oat: 0, y_ref: 648 },
      { oat: 10, y_ref: 666 },
      { oat: 20, y_ref: 712 },
      { oat: 30, y_ref: 816 },
      { oat: 40, y_ref: 931 },
      { oat: 50, y_ref: 1042 }
    ]
  },
  {
    pressure_altitude: 0,
    values: [
      { oat: -20, y_ref: 565 },
      { oat: -10, y_ref: 587 },
      { oat: 0, y_ref: 612 },
      { oat: 10, y_ref: 634 },
      { oat: 20, y_ref: 655 },
      { oat: 30, y_ref: 727 },
      { oat: 40, y_ref: 849 },
      { oat: 50, y_ref: 967 }
    ]
  }
];

// Sections de referência
const REF_SECTIONS = [
  { section: 1, y_ref_bottom: 1230, y_ref_top: 1138 },
  { section: 2, y_ref_bottom: 1138, y_ref_top: 1048 },
  { section: 3, y_ref_bottom: 1048, y_ref_top: 952 },
  { section: 4, y_ref_bottom: 952, y_ref_top: 864 },
  { section: 5, y_ref_bottom: 864, y_ref_top: 764 },
  { section: 6, y_ref_bottom: 764, y_ref_top: 677 },
  { section: 7, y_ref_bottom: 677, y_ref_top: 585 },
  { section: 8, y_ref_bottom: 585, y_ref_top: 489 }
];

const WEIGHT_TABLE = [
  {
    weight: 4500,
    sections: [
      { section: 1, y_ref_bottom: 897, y_ref_top: 785 },
      { section: 2, y_ref_bottom: 785, y_ref_top: 664 },
      { section: 3, y_ref_bottom: 664, y_ref_top: 542 },
      { section: 4, y_ref_bottom: 542, y_ref_top: 420 },
      { section: 5, y_ref_bottom: 420, y_ref_top: 284 },
      { section: 6, y_ref_bottom: 284, y_ref_top: 148 }
    ]
  },
  {
    weight: 4600,
    sections: [
      { section: 1, y_ref_bottom: 925, y_ref_top: 811 },
      { section: 2, y_ref_bottom: 811, y_ref_top: 696 },
      { section: 3, y_ref_bottom: 696, y_ref_top: 578 },
      { section: 4, y_ref_bottom: 578, y_ref_top: 456 },
      { section: 5, y_ref_bottom: 456, y_ref_top: 327 },
      { section: 6, y_ref_bottom: 327, y_ref_top: 187 }
    ]
  },
  {
    weight: 4700,
    sections: [
      { section: 1, y_ref_bottom: 954, y_ref_top: 839 },
      { section: 2, y_ref_bottom: 839, y_ref_top: 725 },
      { section: 3, y_ref_bottom: 725, y_ref_top: 613 },
      { section: 4, y_ref_bottom: 613, y_ref_top: 492 },
      { section: 5, y_ref_bottom: 492, y_ref_top: 366 },
      { section: 6, y_ref_bottom: 366, y_ref_top: 226 },
      { section: 7, y_ref_bottom: 226, y_ref_top: 133 }
    ]
  },
  {
    weight: 4800,
    sections: [
      { section: 1, y_ref_bottom: 983, y_ref_top: 871 },
      { section: 2, y_ref_bottom: 871, y_ref_top: 757 },
      { section: 3, y_ref_bottom: 757, y_ref_top: 646 },
      { section: 4, y_ref_bottom: 646, y_ref_top: 527 },
      { section: 5, y_ref_bottom: 527, y_ref_top: 406 },
      { section: 6, y_ref_bottom: 406, y_ref_top: 269 },
      { section: 7, y_ref_bottom: 269, y_ref_top: 176 }
    ]
  },
  {
    weight: 4900,
    sections: [
      { section: 1, y_ref_bottom: 1004, y_ref_top: 893 },
      { section: 2, y_ref_bottom: 893, y_ref_top: 789 },
      { section: 3, y_ref_bottom: 789, y_ref_top: 678 },
      { section: 4, y_ref_bottom: 678, y_ref_top: 560 },
      { section: 5, y_ref_bottom: 560, y_ref_top: 441 },
      { section: 6, y_ref_bottom: 441, y_ref_top: 305 },
      { section: 7, y_ref_bottom: 305, y_ref_top: 212 }
    ]
  },
  {
    weight: 5000,
    sections: [
      { section: 1, y_ref_bottom: 1026, y_ref_top: 922 },
      { section: 2, y_ref_bottom: 922, y_ref_top: 818 },
      { section: 3, y_ref_bottom: 818, y_ref_top: 710 },
      { section: 4, y_ref_bottom: 710, y_ref_top: 592 },
      { section: 5, y_ref_bottom: 592, y_ref_top: 477 },
      { section: 6, y_ref_bottom: 477, y_ref_top: 348 },
      { section: 7, y_ref_bottom: 348, y_ref_top: 255 },
      { section: 8, y_ref_bottom: 255, y_ref_top: 144 }
    ]
  },
  {
    weight: 5100,
    sections: [
      { section: 1, y_ref_bottom: 1058, y_ref_top: 947 },
      { section: 2, y_ref_bottom: 947, y_ref_top: 839 },
      { section: 3, y_ref_bottom: 839, y_ref_top: 735 },
      { section: 4, y_ref_bottom: 735, y_ref_top: 624 },
      { section: 5, y_ref_bottom: 624, y_ref_top: 510 },
      { section: 6, y_ref_bottom: 510, y_ref_top: 384 },
      { section: 7, y_ref_bottom: 384, y_ref_top: 291 },
      { section: 8, y_ref_bottom: 291, y_ref_top: 180 }
    ]
  },
  {
    weight: 5200,
    sections: [
      { section: 1, y_ref_bottom: 1079, y_ref_top: 972 },
      { section: 2, y_ref_bottom: 972, y_ref_top: 868 },
      { section: 3, y_ref_bottom: 868, y_ref_top: 760 },
      { section: 4, y_ref_bottom: 760, y_ref_top: 653 },
      { section: 5, y_ref_bottom: 653, y_ref_top: 542 },
      { section: 6, y_ref_bottom: 542, y_ref_top: 420 },
      { section: 7, y_ref_bottom: 420, y_ref_top: 327 },
      { section: 8, y_ref_bottom: 327, y_ref_top: 219 }
    ]
  },
  {
    weight: 5300,
    sections: [
      { section: 1, y_ref_bottom: 1104, y_ref_top: 1000 },
      { section: 2, y_ref_bottom: 1000, y_ref_top: 893 },
      { section: 3, y_ref_bottom: 893, y_ref_top: 785 },
      { section: 4, y_ref_bottom: 785, y_ref_top: 678 },
      { section: 5, y_ref_bottom: 678, y_ref_top: 578 },
      { section: 6, y_ref_bottom: 578, y_ref_top: 463 },
      { section: 7, y_ref_bottom: 463, y_ref_top: 363 },
      { section: 8, y_ref_bottom: 363, y_ref_top: 255 }
    ]
  },
  {
    weight: 5400,
    sections: [
      { section: 1, y_ref_bottom: 1122, y_ref_top: 1018 },
      { section: 2, y_ref_bottom: 1018, y_ref_top: 918 },
      { section: 3, y_ref_bottom: 918, y_ref_top: 814 },
      { section: 4, y_ref_bottom: 814, y_ref_top: 707 },
      { section: 5, y_ref_bottom: 707, y_ref_top: 606 },
      { section: 6, y_ref_bottom: 606, y_ref_top: 495 },
      { section: 7, y_ref_bottom: 495, y_ref_top: 398 },
      { section: 8, y_ref_bottom: 398, y_ref_top: 298 }
    ]
  },
  {
    weight: 5500,
    sections: [
      { section: 1, y_ref_bottom: 1147, y_ref_top: 1043 },
      { section: 2, y_ref_bottom: 1043, y_ref_top: 943 },
      { section: 3, y_ref_bottom: 943, y_ref_top: 839 },
      { section: 4, y_ref_bottom: 839, y_ref_top: 732 },
      { section: 5, y_ref_bottom: 732, y_ref_top: 635 },
      { section: 6, y_ref_bottom: 635, y_ref_top: 531 },
      { section: 7, y_ref_bottom: 531, y_ref_top: 434 },
      { section: 8, y_ref_bottom: 434, y_ref_top: 334 }
    ]
  },
  {
    weight: 5600,
    sections: [
      { section: 1, y_ref_bottom: 1165, y_ref_top: 1065 },
      { section: 2, y_ref_bottom: 1065, y_ref_top: 965 },
      { section: 3, y_ref_bottom: 965, y_ref_top: 861 },
      { section: 4, y_ref_bottom: 861, y_ref_top: 764 },
      { section: 5, y_ref_bottom: 764, y_ref_top: 660 },
      { section: 6, y_ref_bottom: 660, y_ref_top: 560 },
      { section: 7, y_ref_bottom: 560, y_ref_top: 467 },
      { section: 8, y_ref_bottom: 467, y_ref_top: 366 }
    ]
  },
  {
    weight: 5700,
    sections: [
      { section: 1, y_ref_bottom: 1187, y_ref_top: 1083 },
      { section: 2, y_ref_bottom: 1083, y_ref_top: 986 },
      { section: 3, y_ref_bottom: 986, y_ref_top: 886 },
      { section: 4, y_ref_bottom: 886, y_ref_top: 785 },
      { section: 5, y_ref_bottom: 785, y_ref_top: 685 },
      { section: 6, y_ref_bottom: 685, y_ref_top: 592 },
      { section: 7, y_ref_bottom: 592, y_ref_top: 495 },
      { section: 8, y_ref_bottom: 495, y_ref_top: 398 }
    ]
  },
  {
    weight: 5800,
    sections: [
      { section: 1, y_ref_bottom: 1205, y_ref_top: 1108 },
      { section: 2, y_ref_bottom: 1108, y_ref_top: 1015 },
      { section: 3, y_ref_bottom: 1015, y_ref_top: 911 },
      { section: 4, y_ref_bottom: 911, y_ref_top: 814 },
      { section: 5, y_ref_bottom: 814, y_ref_top: 714 },
      { section: 6, y_ref_bottom: 714, y_ref_top: 617 },
      { section: 7, y_ref_bottom: 617, y_ref_top: 527 },
      { section: 8, y_ref_bottom: 527, y_ref_top: 431 }
    ]
  },
  {
    weight: 5900,
    sections: [
      { section: 1, y_ref_bottom: 1223, y_ref_top: 1126 },
      { section: 2, y_ref_bottom: 1126, y_ref_top: 1029 },
      { section: 3, y_ref_bottom: 1029, y_ref_top: 932 },
      { section: 4, y_ref_bottom: 932, y_ref_top: 839 },
      { section: 5, y_ref_bottom: 839, y_ref_top: 739 },
      { section: 6, y_ref_bottom: 739, y_ref_top: 642 },
      { section: 7, y_ref_bottom: 642, y_ref_top: 556 },
      { section: 8, y_ref_bottom: 556, y_ref_top: 463 }
    ]
  },
  {
    weight: 6000,
    sections: [
      { section: 1, y_ref_bottom: 1230, y_ref_top: 1140 },
      { section: 2, y_ref_bottom: 1140, y_ref_top: 1051 },
      { section: 3, y_ref_bottom: 1051, y_ref_top: 954 },
      { section: 4, y_ref_bottom: 954, y_ref_top: 864 },
      { section: 5, y_ref_bottom: 864, y_ref_top: 764 },
      { section: 6, y_ref_bottom: 764, y_ref_top: 671 },
      { section: 7, y_ref_bottom: 671, y_ref_top: 585 },
      { section: 8, y_ref_bottom: 585, y_ref_top: 488 }
    ]
  },
  {
    weight: 6100,
    sections: [
      { section: 1, y_ref_bottom: 1230, y_ref_top: 1158 },
      { section: 2, y_ref_bottom: 1158, y_ref_top: 1069 },
      { section: 3, y_ref_bottom: 1069, y_ref_top: 972 },
      { section: 4, y_ref_bottom: 972, y_ref_top: 886 },
      { section: 5, y_ref_bottom: 886, y_ref_top: 789 },
      { section: 6, y_ref_bottom: 789, y_ref_top: 707 },
      { section: 7, y_ref_bottom: 707, y_ref_top: 613 },
      { section: 8, y_ref_bottom: 613, y_ref_top: 513 }
    ]
  },
  {
    weight: 6200,
    sections: [
      { section: 1, y_ref_bottom: 1230, y_ref_top: 1176 },
      { section: 2, y_ref_bottom: 1176, y_ref_top: 1086 },
      { section: 3, y_ref_bottom: 1086, y_ref_top: 993 },
      { section: 4, y_ref_bottom: 993, y_ref_top: 907 },
      { section: 5, y_ref_bottom: 907, y_ref_top: 814 },
      { section: 6, y_ref_bottom: 814, y_ref_top: 728 },
      { section: 7, y_ref_bottom: 728, y_ref_top: 642 },
      { section: 8, y_ref_bottom: 642, y_ref_top: 542 }
    ]
  },
  {
    weight: 6300,
    sections: [
      { section: 1, y_ref_bottom: 1230, y_ref_top: 1190 },
      { section: 2, y_ref_bottom: 1190, y_ref_top: 1101 },
      { section: 3, y_ref_bottom: 1101, y_ref_top: 1008 },
      { section: 4, y_ref_bottom: 1008, y_ref_top: 925 },
      { section: 5, y_ref_bottom: 925, y_ref_top: 836 },
      { section: 6, y_ref_bottom: 836, y_ref_top: 750 },
      { section: 7, y_ref_bottom: 750, y_ref_top: 664 },
      { section: 8, y_ref_bottom: 664, y_ref_top: 570 }
    ]
  },
  {
    weight: 6400,
    sections: [
      { section: 1, y_ref_bottom: 1233, y_ref_top: 1205 },
      { section: 2, y_ref_bottom: 1205, y_ref_top: 1119 },
      { section: 3, y_ref_bottom: 1119, y_ref_top: 1026 },
      { section: 4, y_ref_bottom: 1026, y_ref_top: 943 },
      { section: 5, y_ref_bottom: 943, y_ref_top: 854 },
      { section: 6, y_ref_bottom: 854, y_ref_top: 775 },
      { section: 7, y_ref_bottom: 775, y_ref_top: 689 },
      { section: 8, y_ref_bottom: 689, y_ref_top: 599 }
    ]
  },
  {
    weight: 6500,
    sections: [
      { section: 1, y_ref_bottom: 1230, y_ref_top: 1219 },
      { section: 2, y_ref_bottom: 1219, y_ref_top: 1129 },
      { section: 3, y_ref_bottom: 1129, y_ref_top: 1043 },
      { section: 4, y_ref_bottom: 1043, y_ref_top: 957 },
      { section: 5, y_ref_bottom: 957, y_ref_top: 875 },
      { section: 6, y_ref_bottom: 875, y_ref_top: 796 },
      { section: 7, y_ref_bottom: 796, y_ref_top: 707 },
      { section: 8, y_ref_bottom: 707, y_ref_top: 621 }
    ]
  }
];
  // INLET ON/OFF
const INLET_TABLE = [
  {
    mode: "off",
    sections: [
      { section: 1, y_ref_bottom: 1233, y_ref_top: 1132 },
      { section: 2, y_ref_bottom: 1132, y_ref_top: 1046 },
      { section: 3, y_ref_bottom: 1046, y_ref_top: 950 },
      { section: 4, y_ref_bottom: 950, y_ref_top: 856 },
      { section: 5, y_ref_bottom: 856, y_ref_top: 763 },
      { section: 6, y_ref_bottom: 763, y_ref_top: 670 },
      { section: 7, y_ref_bottom: 670, y_ref_top: 577 },
      { section: 8, y_ref_bottom: 577, y_ref_top: 484 },
      { section: 9, y_ref_bottom: 484, y_ref_top: 394 },
      { section: 10, y_ref_bottom: 394, y_ref_top: 297 },
      { section: 11, y_ref_bottom: 297, y_ref_top: 204 },
      { section: 12, y_ref_bottom: 204, y_ref_top: 111 }
    ]
  },
  {
    mode: "on",
    sections: [
      { section: 1, y_ref_bottom: 1229, y_ref_top: 1165 },
      { section: 2, y_ref_bottom: 1165, y_ref_top: 1079 },
      { section: 3, y_ref_bottom: 1079, y_ref_top: 996 },
      { section: 4, y_ref_bottom: 996, y_ref_top: 899 },
      { section: 5, y_ref_bottom: 899, y_ref_top: 813 },
      { section: 6, y_ref_bottom: 813, y_ref_top: 724 },
      { section: 7, y_ref_bottom: 724, y_ref_top: 634 },
      { section: 8, y_ref_bottom: 634, y_ref_top: 534 },
      { section: 9, y_ref_bottom: 534, y_ref_top: 441 },
      { section: 10, y_ref_bottom: 441, y_ref_top: 344 },
      { section: 11, y_ref_bottom: 344, y_ref_top: 247 },
      { section: 12, y_ref_bottom: 247, y_ref_top: 161 }
    ]
  }
];
// RESULT TABLE — y_ref → climb gradient (%)
const RESULT_TABLE = [
  { result: -2, section: 1, y_ref_bottom: 1229, y_ref_top: 1140 },
  { result: -1, section: 2, y_ref_bottom: 1140, y_ref_top: 1043 },
  { result: 0,  section: 3, y_ref_bottom: 1043, y_ref_top: 953 },
  { result: 1,  section: 4, y_ref_bottom: 953,  y_ref_top: 856 },
  { result: 2,  section: 5, y_ref_bottom: 856,  y_ref_top: 763 },
  { result: 3,  section: 6, y_ref_bottom: 763,  y_ref_top: 670 },
  { result: 4,  section: 7, y_ref_bottom: 670,  y_ref_top: 577 },
  { result: 5,  section: 8, y_ref_bottom: 577,  y_ref_top: 484 },
  { result: 6,  section: 9, y_ref_bottom: 484,  y_ref_top: 391 },
  { result: 7,  section: 10, y_ref_bottom: 391, y_ref_top: 297 },
  { result: 8,  section: 11, y_ref_bottom: 297, y_ref_top: 201 },
  { result: 9,  section: 12, y_ref_bottom: 201, y_ref_top: 111 }
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

export function CLIMB_GRADIENTE_2SEG_FlapsUp({ pressureAltitude, oat, tow, inlet, gradientRequired }) {
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
export default CLIMB_GRADIENTE_2SEG_FlapsUp;