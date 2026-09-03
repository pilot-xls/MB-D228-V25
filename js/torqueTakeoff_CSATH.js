/* torqueLib.js
   Biblioteca standalone com:
   - dados (PA,OAT)->y_ref
   - dados (torque%)->y_ref
   - interpolação 2D (PA x OAT) e 1D (y_ref -> torque%)
   Uso (noutro ficheiro):
     import { computeEngineTorquePercent } from "./torqueLib.js";
     const pct = computeEngineTorquePercent(20, 2000);
*/

export const torqueLib = (() => {
  // ---------- Dados (PA, OAT) -> y_ref ----------
  // Estrutura por PA, com pontos (temp, y_ref) ordenáveis.
  const graphicData = [
    { pa: 10000, points: [
      { t: -30, y: 151.2 }, { t: -20, y: 202.4 }, { t: -10, y: 260.5 },
      { t:   0, y: 325.7 }, { t:  10, y: 397.3 }, { t:  20, y: 468.5 },
    ]},
    { pa: 8000, points: [
      { t: -30, y: 42.9 }, { t: -20, y: 95.2 }, { t: -10, y: 158.0 },
      { t:   0, y: 224.5 }, { t:  10, y: 301.2 }, { t:  20, y: 383.7 },
      { t:  30, y: 471.6 },
    ]},
    { pa: 6000, points: [
      { t: -14, y: 23.2 }, { t: -10, y: 49.4 },
      { t:   0, y: 124.0 }, { t:  10, y: 206.2 }, { t:  20, y: 296.5 },
      { t:  30, y: 393.5 }, { t:  40, y: 496.7 },
    ]},
    { pa: 4000, points: [
      { t:   2, y: 22.6 }, { t:  10, y: 85.7 }, { t:  20, y: 186.2 },
      { t:  30, y: 303.3 }, { t:  40, y: 422.0 },
    ]},
    { pa: 2000, points: [
      { t:  20, y: 88.1 }, { t:  30, y: 201.8 }, { t:  40, y: 329.0 },
      { t:  50, y: 463.8 },
    ]},
    { pa: 0, points: [
      { t:  22, y: 22.9 }, { t:  30, y: 116.2 }, { t:  40, y: 245.5 },
      { t:  50, y: 388.8 },
    ]},
  ];

  // ---------- Dados (torque%) -> y_ref ----------
  // Atenção: aqui y_ref desce quando torque% sobe.
  const torqueRef = [
    { torque: 70,  y: 464.5 },
    { torque: 75,  y: 391.5 },
    { torque: 80,  y: 317.5 },
    { torque: 85,  y: 243.5 },
    { torque: 90,  y: 170.5 },
    { torque: 95,  y: 96.5  },
    { torque: 100, y: 23.5  },
  ];

  // ---------- Helpers ----------
  function assertNumber(name, v) {
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new Error(`${name} tem de ser número finito. Recebi: ${v}`);
    }
  }

  function lerp(x0, y0, x1, y1, x) {
    if (x1 === x0) return y0; // evita divisão por zero
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }

  function sortByPA() {
    graphicData.sort((a, b) => a.pa - b.pa);
    for (const row of graphicData) row.points.sort((a, b) => a.t - b.t);
  }
  sortByPA();

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function getPAExtent() {
    const pas = graphicData.map(r => r.pa).sort((a,b)=>a-b);
    return { minPA: pas[0], maxPA: pas[pas.length - 1] };
  }

  function getTExtentForPA(pa) {
    const row = graphicData.find(r => r.pa === pa);
    if (!row) return null;
    const ts = row.points.map(p => p.t).sort((a,b)=>a-b);
    return { minT: ts[0], maxT: ts[ts.length - 1] };
  }

  // Encontra [low, high] em lista ordenada, para valor x.
  // Se x for exact match -> low=high=esse valor.
  function bracket(sortedArr, x, accessor = v => v) {
    const xs = sortedArr.map(accessor);
    if (x <= xs[0]) return { low: sortedArr[0], high: sortedArr[0], clamped: true };
    if (x >= xs[xs.length - 1]) return { low: sortedArr[xs.length - 1], high: sortedArr[xs.length - 1], clamped: true };

    for (let i = 0; i < xs.length - 1; i++) {
      if (x === xs[i]) return { low: sortedArr[i], high: sortedArr[i], clamped: false };
      if (x > xs[i] && x < xs[i + 1]) return { low: sortedArr[i], high: sortedArr[i + 1], clamped: false };
      if (x === xs[i + 1]) return { low: sortedArr[i + 1], high: sortedArr[i + 1], clamped: false };
    }
    // Teoricamente nunca chega aqui
    return { low: sortedArr[0], high: sortedArr[0], clamped: true };
  }

  // Interpolação 1D dentro de uma PA fixa: OAT -> y_ref
  function interpolateYAtPA(oat, paRow, opts) {
    const pts = paRow.points;
    const { low, high, clamped } = bracket(pts, oat, p => p.t);

    if (opts?.clampInputs && clamped) {
      // oat fora do intervalo dessa PA: clamp para extremo
      return low.y; // low==high no caso de clamp
    }

    if (low.t === high.t) return low.y;
    return lerp(low.t, low.y, high.t, high.y, oat);
  }

  // Interpolação 2D: (PA, OAT) -> y_ref
  function computeYRef(oat, pa, opts = { clampInputs: true }) {
    assertNumber("OAT", oat);
    assertNumber("PA", pa);

    const rows = [...graphicData].sort((a,b)=>a.pa-b.pa);
    const { low: paLow, high: paHigh, clamped: paClamped } = bracket(rows, pa, r => r.pa);

    // Se clampInputs, clamp PA para extremos e segue
    if (!opts.clampInputs && paClamped) {
      throw new Error(`PA fora do intervalo (${rows[0].pa}..${rows[rows.length - 1].pa}). PA=${pa}`);
    }

    // y_ref no PA low e high (com interpolação em temperatura dentro de cada PA)
    // Atenção: as gamas de temperatura variam por PA; com clampInputs ligadas, clamp por PA.
    const yLow = interpolateYAtPA(
      opts.clampInputs ? clamp(oat, getTExtentForPA(paLow.pa).minT, getTExtentForPA(paLow.pa).maxT) : oat,
      paLow,
      opts
    );

    const yHigh = interpolateYAtPA(
      opts.clampInputs ? clamp(oat, getTExtentForPA(paHigh.pa).minT, getTExtentForPA(paHigh.pa).maxT) : oat,
      paHigh,
      opts
    );

    if (paLow.pa === paHigh.pa) return yLow;

    // Interpola entre PA low e high
    const y = lerp(paLow.pa, yLow, paHigh.pa, yHigh, pa);
    return y;
  }

  // Interpolação 1D invertida: y_ref -> torque%
  function computeTorquePercentFromYRef(yRef, opts = { clampInputs: true }) {
    assertNumber("y_ref", yRef);

    // Vamos ordenar por y (descendente) para “bracket” em y.
    const ref = [...torqueRef].sort((a,b)=>b.y - a.y);

    const ys = ref.map(r => r.y);
    const yMax = ys[0];                 // maior y (torque menor)
    const yMin = ys[ys.length - 1];     // menor y (torque maior)

    if (yRef >= yMax) {
      if (!opts.clampInputs) throw new Error(`y_ref acima do máximo (${yMax}). y_ref=${yRef}`);
      return ref[0].torque; // torque mínimo disponível (70)
    }
    if (yRef <= yMin) {
      if (!opts.clampInputs) throw new Error(`y_ref abaixo do mínimo (${yMin}). y_ref=${yRef}`);
      return ref[ref.length - 1].torque; // torque máximo disponível (100)
    }

    // encontra segmento onde yRef cai entre y[i] e y[i+1] (descendente)
    for (let i = 0; i < ref.length - 1; i++) {
      const a = ref[i];
      const b = ref[i + 1];

      if (yRef === a.y) return a.torque;
      if (yRef === b.y) return b.torque;

      // Como está descendente: a.y > b.y
      if (yRef < a.y && yRef > b.y) {
        // Interpola torque em função de y
        return lerp(a.y, a.torque, b.y, b.torque, yRef);
      }
    }

    // fallback (não deve acontecer)
    return ref[ref.length - 1].torque;
  }

  // Pipeline completo: (OAT, PA) -> torque%
  function computeEngineTorquePercent(oat, pa, opts = { clampInputs: true }) {
    const yRef = computeYRef(oat, pa, opts);
    const torquePct = computeTorquePercentFromYRef(yRef, opts);
    return {
      input: { oat, pa },
      y_ref: yRef,
      torque_percent: torquePct,
    };
  }

  return {
    data: { graphicData, torqueRef },
    computeYRef,
    computeTorquePercentFromYRef,
    computeEngineTorquePercent,
    utils: { lerp, clamp },
    limits: {
      pa: getPAExtent(),
      // limites de temperatura variam por PA; não exponho um único range global para não te iludir.
    },
  };
})();

export const computeEngineTorquePercent = torqueLib.computeEngineTorquePercent;
export const computeYRef = torqueLib.computeYRef;
export const computeTorquePercentFromYRef = torqueLib.computeTorquePercentFromYRef;
