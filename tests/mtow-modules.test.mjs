// Testes de regressão dos módulos MTOW_* (ASDA, TORA, TODA; flaps 1 e UP)
// Correr na raiz do repositório:  node --test tests/*.test.mjs
//
// - Caso reportado: LPBG 19, flaps 1, QNH 1003, OAT 40 → "MTOW failed (TORA): no chart result"
//   (linha Weight=6400 Section=5 de mtowTORA_Flaps1.js com Y_Ref_Down < Y_Ref_Up)
// - Entradas fora do gráfico do AFM: o erro tem de dizer qual entrada, o valor e o limite
// - Nenhuma falha "sem explicação" numa grelha de entradas (varrimento reduzido)

import { test } from "node:test";
import assert from "node:assert/strict";

import { loadPerformancePage } from "./helpers/performanceDom.mjs";
import { GRID, MODULES, runSweep } from "./tools/mtow-sweep.mjs";

import MTOW_TORA_Flaps1 from "../js/mtowTORA_Flaps1.js";
import MTOW_TODA_Flaps1 from "../js/mtowTODA_Flaps1.js";
import TORR_Flaps1 from "../js/torrFlaps1_CSATH.js";

// Os módulos de cálculo escrevem avisos na consola; não interessam aqui
console.warn = () => {};

const byName = Object.fromEntries(MODULES.map(m => [m.name, m]));
const WINDS = [-10, -5, 0, 10, 20];

// ------------------------------------------------------------------
// 1) Caso reportado (entrada reproduzível do performance.js)
// ------------------------------------------------------------------

test("MTOW_TORA_Flaps1 { PA 2547, OAT 40, slope -1.2, TORA 1700 }: peso válido nos 5 ventos", () => {
    for (const Wind of WINDS) {
        const r = MTOW_TORA_Flaps1({ PA: 2547, OAT: 40, Wind, slope: -1.2, TORA: 1700 });
        assert.equal(r.status, "passed", `Wind ${Wind}: ${r.debug.error}`);
        assert.ok(r.result >= 4500 && r.result <= 6500, `Wind ${Wind}: ${r.result}`);

        // O peso devolvido cumpre o gráfico forward (TORR <= TORA)
        const torr = TORR_Flaps1({ PA: 2547, OAT: 40, Weight: r.result, Wind, slope: -1.2 });
        assert.equal(torr.status, "passed", `Wind ${Wind}`);
        assert.ok(Math.round(torr.result) <= 1700, `Wind ${Wind}: TORR ${torr.result}`);
    }
});

test("página: LPBG 19, flaps 1, inlets OFF, DRY, QNH 1003, OAT 40 → MTOW calculado, sem 'no chart result'", async () => {
    const page = await loadPerformancePage();
    // cauda 10, cauda 5, calmo, frente 10, frente 20
    for (const wind of ["010/10", "010/05", "000/00", "190/10", "190/20"]) {
        const r = await page.calc({ airport: "LPBG", runway: "19", wind, oat: "40", qnh: "1003", flaps: "1", inlets: "off", surface: "dry", tow: "5000" });
        assert.match(r.mtow, /^\d+ kg$/, `${wind}: ${r.mtow} ${r.reason}`);
        assert.doesNotMatch(r.reason || "", /no chart result/, wind);
    }
});

// ------------------------------------------------------------------
// 2) Fora do gráfico: diz qual entrada, o valor e o limite
// ------------------------------------------------------------------

const call = (name, p) => byName[name].fn(byName[name].call({ Wind: 0, slope: 0, ...p }, GRID));

test("OAT acima do envelope PA/OAT: erro explícito em todos os módulos", () => {
    for (const m of MODULES) {
        const r = call(m.name, { PA: 2547, OAT: 45 });
        assert.equal(r.status, "failed", m.name);
        assert.equal(r.debug.outOfChart?.input, "OAT", `${m.name}: ${r.debug.error}`);
        // No gráfico TODA flaps UP a curva de 4000 ft só vai até 30 °C; nos outros até 40 °C
        const max = m.name === "MTOW_TODA_FlapsUp" ? 30 : 40;
        assert.equal(r.debug.outOfChart.reason, `OAT 45 °C above chart at PA 2547 ft (max ${max} °C at 4000 ft)`, m.name);
        assert.match(r.debug.error, /OAT 45 ºC fora do gráfico para PA 2547 ft/, m.name);
    }
});

test("PA, OAT, vento, slope e distância fora da gama do gráfico: erro com a entrada e o limite", () => {
    const cases = [
        ["MTOW_TORA_Flaps1", { PA: 13000, OAT: -30 }, "PA", /^PA 13000 ft above chart \(max 12000 ft\)$/],
        ["MTOW_TORA_Flaps1", { PA: 0, OAT: 60 }, "OAT", /^OAT 60 °C above chart \(max 50 °C\)$/],
        ["MTOW_TORA_Flaps1", { PA: 0, OAT: 15, Wind: -25 }, "Wind", /^Wind -25 kt below chart \(min -20 kt\)$/],
        ["MTOW_TORA_Flaps1", { PA: 0, OAT: 15, slope: 2.5 }, "slope", /^slope 2\.5 % above chart \(max 2 %\)$/],
        ["MTOW_TODA_Flaps1", { PA: 0, OAT: 15 }, null, null], // referência (passa)
        ["MTOW_ASDA_FlapsUp", { PA: 0, OAT: 15, Wind: -25 }, "Wind", /^Wind -25 kt below chart \(min -20 kt\)$/]
    ];
    for (const [name, p, input, re] of cases) {
        const r = call(name, p);
        if (!input) {
            assert.equal(r.status, "passed", name);
            continue;
        }
        assert.equal(r.status, "failed", `${name} ${JSON.stringify(p)}`);
        assert.equal(r.debug.outOfChart?.input, input, `${name} ${JSON.stringify(p)}`);
        assert.match(r.debug.outOfChart.reason, re, `${name} ${JSON.stringify(p)}`);
    }

    // Distância abaixo do mínimo do gráfico (TODA começa em 400 m)
    const shortToda = MTOW_TODA_Flaps1({ PA: 0, OAT: 15, Wind: 0, slope: 0, TODA: 300 });
    assert.equal(shortToda.debug.outOfChart?.input, "TODA");
    assert.match(shortToda.debug.outOfChart.reason, /^TODA 300 m below chart \(min 400 m\)$/);
});

test("distância acima do gráfico (ex.: LIRP, TORA 2736 m) usa o máximo do gráfico em todos os módulos", () => {
    for (const m of MODULES) {
        const r = m.fn(m.call({ PA: 0, OAT: 15, Wind: 0, slope: 0 }, { ...GRID, distance: 2736 }));
        assert.equal(r.status, "passed", `${m.name}: ${r.debug.error}`);
        assert.ok(r.result > 0, m.name);
        const clamp = r.debug.toraClamp || r.debug.asdaClamp;
        assert.equal(clamp?.requested, 2736, m.name);
    }
});

test("MTOW_TODA_*: aceita a TODA no parâmetro TODA (e TORA por compatibilidade)", () => {
    const a = MTOW_TODA_Flaps1({ PA: 1000, OAT: 20, Wind: 0, slope: 0, TODA: 1700 });
    const b = MTOW_TODA_Flaps1({ PA: 1000, OAT: 20, Wind: 0, slope: 0, TORA: 1700 });
    assert.equal(a.status, "passed");
    assert.equal(a.result, b.result);
    assert.equal(a.input.TODA, 1700);
});

// ------------------------------------------------------------------
// 3) Varrimento reduzido: nenhuma falha sem explicação
// ------------------------------------------------------------------

test("varrimento (PA 0..4000 passo 250, OAT -10..50, 5 ventos, 5 slopes, 1700 m): todas as falhas são 'fora do gráfico'", () => {
    const grid = { ...GRID, PA: GRID.PA.filter(pa => pa % 250 === 0) };
    for (const r of runSweep(MODULES, grid)) {
        const unexplained = r.failures.filter(f => !f.outOfChart);
        assert.equal(unexplained.length, 0, `${r.module}: ` + unexplained.slice(0, 3).map(f => `PA ${f.PA} OAT ${f.OAT} Wind ${f.Wind} slope ${f.slope} → ${f.error}`).join("; "));
    }
});

// ------------------------------------------------------------------
// 3b) Vento e slope entre linhas do gráfico: interpolados (antes usava-se só a linha de baixo)
// ------------------------------------------------------------------

test("vento intermédio: cauda 5 kt fica entre cauda 10 kt e calmo; frente 5 kt entre calmo e frente 10 kt", () => {
    for (const m of MODULES) {
        const W = Wind => m.fn(m.call({ PA: 1000, OAT: 25, Wind, slope: 0 }, { ...GRID, distance: 1000 })).result;
        const [tw10, tw5, calm, hw5, hw10] = [-10, -5, 0, 5, 10].map(W);
        assert.ok(tw10 <= tw5 && tw5 <= calm, `${m.name}: TW10 ${tw10} <= TW5 ${tw5} <= calmo ${calm}`);
        // Se calmo dá mais do que cauda 10 kt, cauda 5 kt também tem de dar mais (já não é tratado como cauda 10 kt)
        if (calm > tw10) assert.ok(tw5 > tw10, `${m.name}: TW5 ${tw5} igual a TW10 ${tw10}`);
        assert.ok(calm <= hw5 && hw5 <= hw10, `${m.name}: calmo ${calm} <= HW5 ${hw5} <= HW10 ${hw10}`);
        // Se frente 10 kt dá mais do que calmo, frente 5 kt também tem de dar mais (já não é tratado como calmo)
        if (hw10 > calm) assert.ok(hw5 > calm, `${m.name}: HW5 ${hw5} igual a calmo ${calm}`);
    }
});

test("vento e slope intermédios: MTOW no maior peso que o forward aceita (nunca acima)", () => {
    for (const m of MODULES) {
        let n = 0, near = 0;
        for (let PA = 0; PA <= 4000; PA += 500) {
            for (let OAT = -10; OAT <= 40; OAT += 10) {
                for (const Wind of [-5, 5, 15]) {
                    for (const slope of (m.usesSlope ? [-1.2, 0.5] : [0])) {
                        for (const distance of [800, 1300, 1700]) {
                            const g = { ...GRID, distance };
                            const p = { PA, OAT, Wind, slope };
                            const r = m.fn(m.call(p, g));
                            if (r.status !== "passed") continue;
                            const ok = Wt => { const f = m.forward(p, Wt, g); return f.status === "passed" && Number.isFinite(f.result) && Math.round(f.result) <= distance; };
                            assert.ok(ok(r.result), `${m.name} ${JSON.stringify(p)} ${distance} m: ${r.result} kg excede a distância no forward`);
                            let Wmax = r.result;
                            while (Wmax < 6500 && ok(Wmax + 1)) Wmax++;
                            n++;
                            if (Wmax - r.result <= 10) near++;
                        }
                    }
                }
            }
        }
        // Antes da correção ~30 % destes casos ficavam centenas de kg abaixo (até ~880 kg)
        assert.ok(near / n >= 0.95, `${m.name}: só ${near} de ${n} a <= 10 kg do forward`);
    }
});

test("distância no limite do peso mínimo do gráfico: devolve o peso mínimo quando o forward o aceita", () => {
    // O inverso dá 'abaixo do peso mínimo' por uma fração de metro; o forward (arredondado ao metro) aceita 4500 kg
    const r = MTOW_TODA_Flaps1({ PA: 2000, OAT: 50, Wind: -10, slope: -2, TODA: 1000 });
    assert.equal(r.status, "passed", r.debug.error);
    assert.equal(r.result, 4500);
    assert.equal(r.debug.step6Conservative.edge, "CHART_MIN_WEIGHT");
});

// ------------------------------------------------------------------
// 4) Dados: nenhum erro e a mesma tabela de pesos que o módulo forward
// ------------------------------------------------------------------

test("dados: nenhum módulo MTOW tem linhas que o motor rejeita; tabelas de pesos iguais às do forward", async () => {
    const { checkAll } = await import("./tools/mtow-data-check.mjs");
    for (const r of checkAll()) {
        const errors = r.issues.filter(i => i.sev === "ERRO");
        assert.equal(errors.length, 0, `${r.module}: ` + errors.map(e => `${e.where} ${e.msg}`).join("; "));
        // weightSectionData verificada no gráfico do AFM (TORA flaps 1) e igual à do forward nos 6 módulos
        const weightDiffs = r.diffIssues.filter(i => i.table === "weightSectionData");
        assert.equal(weightDiffs.length, 0, `${r.module}: ` + weightDiffs.map(e => `${e.where} ${e.msg}`).join("; "));
    }
});

// ------------------------------------------------------------------
// 5) Motivo mostrado na página
// ------------------------------------------------------------------

test("describeMtowChartProblem: fora do gráfico usa o motivo do módulo; outro erro diz o passo e o erro", async () => {
    const page = await loadPerformancePage();
    const { describeMtowChartProblem } = page.module;

    const ooc = describeMtowChartProblem(MTOW_TORA_Flaps1({ PA: 2547, OAT: 45, Wind: 0, slope: -1.2, TORA: 1700 }));
    assert.deepEqual(ooc, { outOfChart: true, reason: "OAT 45 °C above chart at PA 2547 ft (max 40 °C at 4000 ft)" });

    const other = describeMtowChartProblem({ status: "failed", result: 0, debug: { failedAtStep: "step6", error: "Step6: dados insuficientes para Section=5" } });
    assert.deepEqual(other, { outOfChart: false, reason: "no chart result (step6: Step6: dados insuficientes para Section=5)" });
});

test("página: OAT acima do gráfico → 'out of AFM chart' com a entrada fora do gráfico no motivo", async () => {
    const page = await loadPerformancePage();
    const r = await page.calc({ airport: "LPBG", runway: "19", wind: "000/00", oat: "45", qnh: "1003", flaps: "1", inlets: "off", surface: "dry", tow: "5000" });
    assert.equal(r.mtow, "out of AFM chart");
    assert.match(r.reason, /OAT 45 °C above chart/);
    assert.doesNotMatch(r.reason, /no chart result/);
});
