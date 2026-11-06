// Varrimento dos módulos MTOW_* (ASDA, TORA, TODA; flaps 1 e UP)
//
// Chama cada módulo numa grelha de entradas e lista as combinações em que o resultado
// é "failed", agrupadas por módulo / passo / motivo / secção da refline.
//
// Correr na raiz do repositório:
//   node tests/tools/mtow-sweep.mjs            (resumo)
//   node tests/tools/mtow-sweep.mjs --json     (resumo em JSON)
//   node tests/tools/mtow-sweep.mjs --full     (lista todas as combinações falhadas)
//   node tests/tools/mtow-sweep.mjs --distance 3000   (outra distância disponível; por omissão 1700 m)
//   node tests/tools/mtow-sweep.mjs --forward-gap     (também compara cada MTOW com o maior peso que o
//                                                       módulo forward TORR/TOD/ASDR aceita: deteta MTOW
//                                                       subestimado; mais lento)
//
// Grelha (por omissão):
//   PA 0..4000 ft (passo 50), OAT -10..50 ºC (passo 5), Wind {-10,-5,0,10,20},
//   slope {-2,-1.2,0,1.2,2} (só TORA/TODA), distância disponível = 1700 m, superfície DRY.

import MTOW_ASDA_Flaps1 from "../../js/mtowASDA_Flaps1.js";
import MTOW_ASDA_FlapsUp from "../../js/mtowASDA_FlapsUp.js";
import MTOW_TORA_Flaps1 from "../../js/mtowTORA_Flaps1.js";
import MTOW_TORA_FlapsUp from "../../js/mtowTORA_FlapsUp.js";
import MTOW_TODA_Flaps1 from "../../js/mtowTODA_Flaps1.js";
import MTOW_TODA_FlapsUp from "../../js/mtowTODA_FlapsUp.js";
import TORR_Flaps1 from "../../js/torrFlaps1_CSATH.js";
import TORR_FlapsUp from "../../js/torrFlapsUP_CSATH.js";
import TODR_Flaps1 from "../../js/todrFlaps1_CSATH.js";
import TODR_FlapsUp from "../../js/todrFlapsUP_CSATH.js";
import ASDR_Flaps1 from "../../js/asdrFlaps1_CSATH.js";
import ASDR_FlapsUp from "../../js/asdrFlapsUP_CSATH.js";

const argv = process.argv.slice(2);
const args = new Set(argv);
const argValue = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };

const range = (a, b, step) => {
    const out = [];
    for (let v = a; v <= b + 1e-9; v += step) out.push(Math.round(v * 100) / 100);
    return out;
};

export const GRID = {
    PA: range(0, 4000, 50),
    OAT: range(-10, 50, 5),
    Wind: [-10, -5, 0, 10, 20],
    slope: [-2, -1.2, 0, 1.2, 2],
    distance: 1700,
    surface: "DRY"
};

// O ASDA não tem correção de slope: corre só uma vez por (PA, OAT, Wind)
// call(p, g): entrada do módulo MTOW; forward(p, W, g): o mesmo ponto no módulo forward (mesmo gráfico do AFM)
export const MODULES = [
    { name: "MTOW_ASDA_Flaps1", fn: MTOW_ASDA_Flaps1, usesSlope: false, call: (p, g) => ({ PA: p.PA, OAT: p.OAT, Wind: p.Wind, runway_conditions: g.surface, ASDA: g.distance }), forward: (p, W, g) => ASDR_Flaps1({ PA: p.PA, OAT: p.OAT, Weight: W, Wind: p.Wind, runway: g.surface }) },
    { name: "MTOW_ASDA_FlapsUp", fn: MTOW_ASDA_FlapsUp, usesSlope: false, call: (p, g) => ({ PA: p.PA, OAT: p.OAT, Wind: p.Wind, runway_conditions: g.surface, ASDA: g.distance }), forward: (p, W, g) => ASDR_FlapsUp({ PA: p.PA, OAT: p.OAT, Weight: W, Wind: p.Wind, runway: g.surface }) },
    { name: "MTOW_TORA_Flaps1", fn: MTOW_TORA_Flaps1, usesSlope: true, call: (p, g) => ({ PA: p.PA, OAT: p.OAT, Wind: p.Wind, slope: p.slope, TORA: g.distance }), forward: (p, W) => TORR_Flaps1({ PA: p.PA, OAT: p.OAT, Weight: W, Wind: p.Wind, slope: p.slope }) },
    { name: "MTOW_TORA_FlapsUp", fn: MTOW_TORA_FlapsUp, usesSlope: true, call: (p, g) => ({ PA: p.PA, OAT: p.OAT, Wind: p.Wind, slope: p.slope, TORA: g.distance }), forward: (p, W) => TORR_FlapsUp({ PA: p.PA, OAT: p.OAT, Weight: W, Wind: p.Wind, slope: p.slope }) },
    { name: "MTOW_TODA_Flaps1", fn: MTOW_TODA_Flaps1, usesSlope: true, call: (p, g) => ({ PA: p.PA, OAT: p.OAT, Wind: p.Wind, slope: p.slope, TODA: g.distance }), forward: (p, W) => TODR_Flaps1({ PA: p.PA, OAT: p.OAT, Weight: W, Wind: p.Wind, slope: p.slope }) },
    { name: "MTOW_TODA_FlapsUp", fn: MTOW_TODA_FlapsUp, usesSlope: true, call: (p, g) => ({ PA: p.PA, OAT: p.OAT, Wind: p.Wind, slope: p.slope, TODA: g.distance }), forward: (p, W) => TODR_FlapsUp({ PA: p.PA, OAT: p.OAT, Weight: W, Wind: p.Wind, slope: p.slope }) }
];

// Motivo "agrupável": tira os valores que mudam de chamada para chamada
function reasonOf(res) {
    const d = res.debug || {};
    // Fora do gráfico: agrupa por entrada + limite (o valor de entrada fica de fora)
    if (d.outOfChart) {
        const o = d.outOfChart;
        const lim = o.max !== undefined && (o.value > o.max) ? "max " + o.max : (o.min !== undefined ? "min " + o.min : (o.minWeight !== undefined ? "peso mín. " + o.minWeight + " kg" : ""));
        return `FORA DO GRÁFICO: ${o.input} (${lim} ${o.unit || ""}${o.linePA !== undefined ? " na curva de PA " + o.linePA + " ft" : ""})`.replace(/\s+\)/, ")");
    }
    let msg = String(d.error || d.reason || res.status);
    if (d.step6 && d.step6.debug && d.step6.debug.reason) msg += " [" + d.step6.debug.reason + "]";
    // Valores de entrada (Valor=..., PA 2547 ft, ...) não entram na chave de agrupamento
    msg = msg.replace(/Valor=-?[\d.]+/g, "Valor=…");
    msg = msg.replace(/(PA|OAT|Wind|slope|TORA|TODA|ASDA)( =|=| )-?[\d.]+( ?ft| ?ºC| ?°C| ?kt| ?%| ?m)?/g, "$1=…");
    return msg;
}

// Maior peso (até maxW) que o módulo forward aceita com distância <= disponível, a subir 1 kg a partir de W
function forwardMax(mod, p, W, g, maxW = 6500) {
    const ok = w => { const r = mod.forward(p, w, g); return r.status === "passed" && Number.isFinite(r.result) && Math.round(r.result) <= g.distance; };
    while (W < maxW && ok(W + 1)) W++;
    return W;
}

export function runSweep(modules = MODULES, grid = GRID, { forwardGap = false } = {}) {
    const report = [];
    for (const mod of modules) {
        const slopes = mod.usesSlope ? grid.slope : [0];
        let total = 0;
        const failures = [];
        const gaps = [];
        for (const PA of grid.PA) {
            for (const OAT of grid.OAT) {
                for (const Wind of grid.Wind) {
                    for (const slope of slopes) {
                        total++;
                        const input = mod.call({ PA, OAT, Wind, slope }, grid);
                        const res = mod.fn(input);
                        if (forwardGap && res.status === "passed" && res.result > 0) {
                            const W = forwardMax(mod, { PA, OAT, Wind, slope }, res.result, grid);
                            if (W > res.result) gaps.push({ PA, OAT, Wind, slope: mod.usesSlope ? slope : undefined, mtow: res.result, forwardMax: W, gap: W - res.result });
                        }
                        if (res.status !== "passed" || !(res.result > 0)) {
                            const d = res.debug || {};
                            failures.push({
                                PA, OAT, Wind, slope: mod.usesSlope ? slope : undefined,
                                step: d.failedAtStep || "?",
                                outOfChart: !!d.outOfChart,
                                section: d.step5 ? d.step5.sectionNum : undefined,
                                reason: reasonOf(res),
                                error: d.error || d.reason || res.status
                            });
                        }
                    }
                }
            }
        }

        // Agrupar por passo + motivo + secção da refline
        const groups = new Map();
        for (const f of failures) {
            const key = [f.step, f.section ?? "-", f.reason].join(" | ");
            if (!groups.has(key)) groups.set(key, { step: f.step, section: f.section, reason: f.reason, count: 0, PA: [Infinity, -Infinity], OAT: [Infinity, -Infinity], winds: new Set(), slopes: new Set(), example: f });
            const g = groups.get(key);
            g.count++;
            g.PA = [Math.min(g.PA[0], f.PA), Math.max(g.PA[1], f.PA)];
            g.OAT = [Math.min(g.OAT[0], f.OAT), Math.max(g.OAT[1], f.OAT)];
            g.winds.add(f.Wind);
            if (f.slope !== undefined) g.slopes.add(f.slope);
        }

        report.push({
            module: mod.name,
            total,
            failed: failures.length,
            outOfChart: failures.filter(f => f.outOfChart).length,
            unexplained: failures.filter(f => !f.outOfChart).length,
            gaps,
            groups: [...groups.values()].sort((a, b) => b.count - a.count).map(g => ({
                ...g,
                winds: [...g.winds].sort((a, b) => a - b),
                slopes: [...g.slopes].sort((a, b) => a - b)
            })),
            failures
        });
    }
    return report;
}

function printReport(report) {
    for (const r of report) {
        console.log(`\n=== ${r.module}: ${r.failed} falhas em ${r.total} combinações (${r.outOfChart} fora do gráfico, ${r.unexplained} outras)`);
        for (const g of r.groups) {
            const ex = g.example;
            console.log(`  [${g.count}] ${g.step} · secção ${g.section ?? "-"} · ${g.reason}`);
            console.log(`        PA ${g.PA[0]}..${g.PA[1]} ft · OAT ${g.OAT[0]}..${g.OAT[1]} ºC · vento {${g.winds.join(", ")}}` + (g.slopes.length ? ` · slope {${g.slopes.join(", ")}}` : ""));
            console.log(`        ex.: PA ${ex.PA}, OAT ${ex.OAT}, Wind ${ex.Wind}` + (ex.slope !== undefined ? `, slope ${ex.slope}` : "") + ` → ${ex.error}`);
        }
        if (r.gaps.length) {
            const byWind = {};
            for (const g of r.gaps) byWind[g.Wind] = (byWind[g.Wind] || 0) + 1;
            const worst = r.gaps.reduce((a, b) => (b.gap > a.gap ? b : a));
            console.log(`  MTOW abaixo do que o forward aceita: ${r.gaps.length} casos · por vento ${JSON.stringify(byWind)} · pior: ${worst.gap} kg (PA ${worst.PA}, OAT ${worst.OAT}, Wind ${worst.Wind}` + (worst.slope !== undefined ? `, slope ${worst.slope}` : "") + `: MTOW ${worst.mtow}, forward ${worst.forwardMax})`);
        }
    }
}

const isMain = import.meta.url === new URL(process.argv[1], "file://").href;
if (isMain) {
    console.warn = () => {};
    const t0 = Date.now();
    const grid = { ...GRID };
    if (argValue("--distance") !== undefined) grid.distance = Number(argValue("--distance"));
    const report = runSweep(MODULES, grid, { forwardGap: args.has("--forward-gap") });
    console.log(`Distância disponível: ${grid.distance} m · superfície ${grid.surface}`);
    if (args.has("--json")) {
        const slim = report.map(r => ({ ...r, failures: args.has("--full") ? r.failures : undefined, gaps: args.has("--full") ? r.gaps : r.gaps.length }));
        console.log(JSON.stringify(slim, null, 2));
    } else {
        printReport(report);
        if (args.has("--full")) {
            for (const r of report) {
                console.log(`\n--- ${r.module}: todas as falhas`);
                for (const f of r.failures) console.log(`  PA ${f.PA} OAT ${f.OAT} Wind ${f.Wind}` + (f.slope !== undefined ? ` slope ${f.slope}` : "") + ` · ${f.step} · secção ${f.section ?? "-"} · ${f.error}`);
            }
        }
        console.log(`\n(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
    }
}
