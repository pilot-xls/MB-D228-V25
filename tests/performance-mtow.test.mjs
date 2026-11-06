// Testes do MTOW, do fator limitante e do selo global da página Performance (D228 CS-ATH)
// Correr na raiz do repositório:  node --test tests/*.test.mjs
//
// Usa o js/performance.js real num DOM mínimo (tests/helpers/performanceDom.mjs):
// preenche o formulário, carrega no Calc e lê o que a página mostra.

import { test } from "node:test";
import assert from "node:assert/strict";

import { loadPerformancePage } from "./helpers/performanceDom.mjs";

// Os módulos de cálculo escrevem avisos na consola (gráficos sem resultado); não interessam aqui
console.warn = () => {};

const page = await loadPerformancePage();
const {
    computeMtow,
    evaluateTakeoffStatus,
    formatMtow,
    formatMtowLimit,
    MTOW_LIMITS
} = page.module;
const { getWAT } = await import("../js/ToWAT.js");
const { evaluateSegments, findMaxTowAllSegments } = await import("../js/cgMTOWSearch.js");

// "6016 kg" → 6016; "failed" → null
const mtowOf = r => {
    const n = parseInt(r.mtow, 10);
    return Number.isFinite(n) ? n : null;
};

// Vento (direção/velocidade) para cada pista de LPBG
const WINDS = {
    "19": { "calmo": "000/00", "TW10": "010/10", "HW10": "190/10", "HW20": "190/20" },
    "01": { "calmo": "000/00", "TW10": "190/10", "HW10": "010/10", "HW20": "010/20" }
};

// ------------------------------------------------------------------
// 1) Exemplo da auditoria: LPBG 01, 190/10, OAT 35, QNH 1003, flaps 1, inlets OFF
// ------------------------------------------------------------------

const EXAMPLE = { airport: "LPBG", runway: "01", wind: "190/10", oat: "35", qnh: "1003", flaps: "1", inlets: "off" };

test("exemplo: TOW 6100 → MTOW 6016 (WAT, cód. 10), selo Failed com a razão", async () => {
    const r = await page.calc({ ...EXAMPLE, tow: "6100" });
    assert.equal(r.mtow, "6016 kg");
    assert.equal(r.limit, "(WAT · code 10)");
    assert.equal(r.badgeText, "Failed");
    assert.equal(r.badgeOk, false);
    assert.equal(r.reason, "TOW above MTOW (limit: WAT)");
    // A 6100 kg o TOD (1731 m) excede a TODA (1700 m)
    assert.equal(r.tod.trim(), "1731 m");
    assert.equal(page.el("tow").classList.contains("input-error"), true);
});

test("exemplo: TOW 6016 (= MTOW) → Passed; 6017 → Failed", async () => {
    const ok = await page.calc({ ...EXAMPLE, tow: "6016" });
    assert.equal(ok.badgeText, "Passed");
    assert.equal(ok.badgeOk, true);
    assert.equal(ok.reason, "");
    assert.equal(page.el("tow").classList.contains("input-error"), false);

    const over = await page.calc({ ...EXAMPLE, tow: "6017" });
    assert.equal(over.badgeText, "Failed");
    assert.equal(over.reason, "TOW above MTOW (limit: WAT)");
});

// ------------------------------------------------------------------
// 2) Para cada condição: peso = MTOW dá Passed e MTOW + 1 dá Failed
// ------------------------------------------------------------------

test("amostra LPBG 19/01 × QNH × OAT × vento × flaps × inlets: MTOW → Passed, MTOW+1 → Failed", async () => {
    let checked = 0;
    let withoutMtow = 0;

    for (const flaps of ["1", "up"]) {
        for (const inlets of ["off", "on"]) {
            for (const runway of ["19", "01"]) {
                for (const qnh of ["1003", "1013", "1023"]) {
                    for (const oat of ["-10", "15", "35", "40"]) {
                        for (const [windName, wind] of Object.entries(WINDS[runway])) {
                            const cond = { airport: "LPBG", runway, wind, oat, qnh, flaps, inlets };
                            const label = `${runway} QNH ${qnh} OAT ${oat} ${windName} flaps ${flaps} inlets ${inlets}`;

                            const first = await page.calc({ ...cond, tow: "5500" });
                            const mtow = mtowOf(first);

                            if (mtow == null) {
                                // Sem MTOW nenhum peso pode passar
                                withoutMtow++;
                                assert.notEqual(first.badgeText, "Passed", label);
                                assert.match(first.reason, /^MTOW not determined/, label);
                                const light = await page.calc({ ...cond, tow: "4600" });
                                assert.notEqual(light.badgeText, "Passed", label);
                                continue;
                            }

                            const atMtow = await page.calc({ ...cond, tow: String(mtow) });
                            assert.equal(atMtow.badgeText, "Passed", `${label}: MTOW ${mtow} → ${atMtow.reason}`);
                            assert.equal(atMtow.mtow, first.mtow, label);

                            const above = await page.calc({ ...cond, tow: String(mtow + 1) });
                            assert.equal(above.badgeText, "Failed", `${label}: MTOW+1 ${mtow + 1}`);
                            assert.match(above.reason, /^TOW above MTOW \(limit: /, label);
                            checked++;
                        }
                    }
                }
            }
        }
    }

    // A amostra tem de exercitar sobretudo casos com MTOW
    assert.ok(checked >= 250, `só ${checked} condições com MTOW`);
    assert.ok(withoutMtow < checked, `${withoutMtow} condições sem MTOW`);
});

// ------------------------------------------------------------------
// 3) Pista 19 com vento de frente forte (2.º segmento não monótono)
// ------------------------------------------------------------------

test("LPBG 19, vento 190/20, OAT -10..0: o MTOW mostrado dá sempre Passed", async () => {
    for (const qnh of ["1003", "1013", "1023"]) {
        for (const oat of ["-10", "-5", "0"]) {
            const cond = { airport: "LPBG", runway: "19", wind: "190/20", oat, qnh, flaps: "1", inlets: "off" };
            const mtow = mtowOf(await page.calc({ ...cond, tow: "5000" }));
            assert.ok(mtow != null, `QNH ${qnh} OAT ${oat}`);
            assert.equal((await page.calc({ ...cond, tow: String(mtow) })).badgeText, "Passed", `QNH ${qnh} OAT ${oat}`);
            assert.equal((await page.calc({ ...cond, tow: String(mtow + 1) })).badgeText, "Failed", `QNH ${qnh} OAT ${oat}`);
        }
    }
});

test("LPBG 19, QNH 1003, OAT -10, 190/20: 6252 kg (antes MTOW e Failed) já não é MTOW", async () => {
    const r = await page.calc({ airport: "LPBG", runway: "19", wind: "190/20", oat: "-10", qnh: "1003", flaps: "1", inlets: "off", tow: "6252" });
    assert.ok(mtowOf(r) < 6252);
    assert.equal(r.limit, "(2nd seg · code 2)");
    assert.equal(r.badgeText, "Failed");
    assert.equal(r.reason, "TOW above MTOW (limit: 2nd seg)");
});

test("procura do MTOW: o peso encontrado cumpre os segmentos e o peso acima não (mesma função da UI)", () => {
    const obstacles2Seg = [{ obstacle_ft: 26, obstacle_dist: 715 }];
    for (const oat of [-10, 0, 15]) {
        for (const wind of [0, 10, 20]) {
            const params = { flaps: "1", pa: 2547, oat, inlet: "off", wind, slope: -1.2, obstacles2Seg, obstacles34Seg: [] };
            const cap = 6300;
            const { mtow, limitedBy } = findMaxTowAllSegments(params, cap);
            if (mtow == null) continue;
            assert.equal(evaluateSegments({ ...params, tow: mtow }).passed, true, `OAT ${oat} vento ${wind}`);
            if (mtow < cap) {
                const above = evaluateSegments({ ...params, tow: mtow + 1 });
                assert.equal(above.passed, false, `OAT ${oat} vento ${wind}`);
                assert.deepEqual(limitedBy, above.failing);
            }
        }
    }
});

// ------------------------------------------------------------------
// 4) Fator limitante e códigos da folha
// ------------------------------------------------------------------

const noSegments = cap => ({ mtow: cap, limitedBy: [], atTop: null });
const LIMITS = { WAT: 6200, ASDA: 6500, TORA: 6500, TODA: 6300, STRUCT: 6400 };

test("códigos da folha: 10 WAT, 3 pista, 2 2.º seg, 4 obstáculos, 7 peso do avião", () => {
    assert.equal(MTOW_LIMITS.WAT.code, 10);
    assert.equal(MTOW_LIMITS.ASDA.code, 3);
    assert.equal(MTOW_LIMITS.TORA.code, 3);
    assert.equal(MTOW_LIMITS.TODA.code, 3);
    assert.equal(MTOW_LIMITS.SEG2.code, 2);
    assert.equal(MTOW_LIMITS.SEG3.code, 4);
    assert.equal(MTOW_LIMITS.SEG4.code, 4);
    assert.equal(MTOW_LIMITS.STRUCT.code, 7);
});

test("computeMtow: o limitante é o menor dos limites", () => {
    const cases = [
        [{}, "WAT", 6200],
        [{ TODA: 6070 }, "TODA", 6070],
        [{ ASDA: 6000 }, "ASDA", 6000],
        [{ TORA: 5900 }, "TORA", 5900],
        [{ WAT: 6600, TODA: 6600 }, "STRUCT", 6400]
    ];
    for (const [over, key, value] of cases) {
        const r = computeMtow({ limits: { ...LIMITS, ...over }, searchSegments: noSegments });
        assert.equal(r.limitKey, key);
        assert.equal(r.mtow, value);
        assert.equal(r.limit, MTOW_LIMITS[key]);
    }
    // Empate: fica o primeiro pela ordem WAT, ASDA, TORA, TODA, peso do avião
    assert.equal(computeMtow({ limits: { ...LIMITS, WAT: 6300 }, searchSegments: noSegments }).limitKey, "WAT");
});

test("computeMtow: um segmento que obriga a descer passa a ser o limitante", () => {
    const r2 = computeMtow({ limits: LIMITS, searchSegments: () => ({ mtow: 6100, limitedBy: ["SEG2"] }) });
    assert.deepEqual([r2.mtow, r2.limitKey, formatMtowLimit(r2)], [6100, "SEG2", "(2nd seg · code 2)"]);

    const r4 = computeMtow({ limits: LIMITS, searchSegments: () => ({ mtow: 6050, limitedBy: ["SEG4"] }) });
    assert.deepEqual([r4.mtow, r4.limitKey, formatMtowLimit(r4)], [6050, "SEG4", "(4th seg · code 4)"]);

    // A procura parte do menor dos limites diretos
    let capSeen = null;
    computeMtow({ limits: LIMITS, searchSegments: cap => { capSeen = cap; return noSegments(cap); } });
    assert.equal(capSeen, 6200);
});

test("computeMtow: nenhum peso cumpre os segmentos → sem MTOW, com o segmento", () => {
    const atTop = { SEG2: { state: "bad" }, SEG3: { state: "ok" }, SEG4: { state: "ok" } };
    const r = computeMtow({ limits: LIMITS, searchSegments: () => ({ mtow: null, limitedBy: ["SEG2"], atTop }) });
    assert.equal(r.mtow, null);
    assert.equal(r.outOfChart, false);
    assert.equal(formatMtow(r), "failed");
    assert.equal(formatMtowLimit(r), "(2nd seg)");
    assert.match(r.reason, /2nd seg/);
});

test("UI: MTOW limitado pelo peso do avião mostra cód. 7", async () => {
    // OAT -10: ponto mais frio do gráfico WAT já encostado ao peso máximo do avião →
    // WAT e STRUCT empatam a 6400 kg; o empate fica para o WAT (cold cap), mostrado com code 7
    const r = await page.calc({ airport: "LPBG", runway: "01", wind: "010/10", oat: "-10", qnh: "1023", flaps: "up", inlets: "off", tow: "6400" });
    assert.equal(r.mtow, "6400 kg");
    assert.equal(r.limit, "(WAT, cold cap · code 7)");
    assert.equal(r.badgeText, "Passed");
});

test("formatMtowLimit: STRUCT continua a mostrar cód. 7 quando o WAT não está no cold cap", () => {
    // WAT acima do peso máximo do avião (status "ok", não "cold_cap"): quem limita é o
    // peso máximo do avião (STRUCT), mostrado sem a nota "cold cap"
    const r = computeMtow({ limits: { WAT: 6525, ASDA: 6500, TORA: 6500, TODA: 6450, STRUCT: 6400 }, searchSegments: noSegments });
    assert.equal(r.limitKey, "STRUCT");
    assert.equal(formatMtowLimit(r, /* watColdCap */ false), "(aircraft max weight · code 7)");
});

test("UI: sem MTOW do avião nas settings → failed com motivo (nunca NaN)", async () => {
    const noStruct = await loadPerformancePage({ aircraftOverride: { MTOW: undefined } });
    const r = await noStruct.calc({ ...EXAMPLE, oat: "15", tow: "5500" });
    assert.equal(r.mtow, "failed");
    assert.equal(r.badgeText, "Failed");
    assert.match(r.reason, /aircraft MTOW missing in settings/);
    assert.doesNotMatch(JSON.stringify(r), /NaN/);
});

// ------------------------------------------------------------------
// 5) Selo global
// ------------------------------------------------------------------

const SEG_OK = { SEG2: { state: "ok" }, SEG3: { state: "na" }, SEG4: { state: "ok" } };
const MTOW_6016 = { mtow: 6016, limitKey: "WAT", limit: MTOW_LIMITS.WAT };

test("evaluateTakeoffStatus: TOW > MTOW falha mesmo com os segmentos a passar", () => {
    assert.deepEqual(evaluateTakeoffStatus({ tow: 6100, mtowResult: MTOW_6016, segments: SEG_OK }),
        { state: "bad", text: "Failed", reason: "TOW above MTOW (limit: WAT)" });
    assert.equal(evaluateTakeoffStatus({ tow: 6016, mtowResult: MTOW_6016, segments: SEG_OK }).state, "ok");
});

test("evaluateTakeoffStatus: segmento falhado ou fora do gráfico no TOW", () => {
    const bad = evaluateTakeoffStatus({ tow: 5000, mtowResult: MTOW_6016, segments: { ...SEG_OK, SEG2: { state: "bad" } } });
    assert.deepEqual([bad.state, bad.text, bad.reason], ["bad", "Failed", "Climb gradient not met: 2nd seg"]);

    const ooc = evaluateTakeoffStatus({ tow: 5000, mtowResult: MTOW_6016, segments: { ...SEG_OK, SEG3: { state: "ooc" } } });
    assert.deepEqual([ooc.state, ooc.text], ["ooc", "Out of AFM chart"]);
});

test("evaluateTakeoffStatus: sem MTOW nunca passa", () => {
    const failed = evaluateTakeoffStatus({ tow: 4600, mtowResult: { mtow: null, outOfChart: false, reason: "TODA: no chart result" }, segments: SEG_OK });
    assert.equal(failed.text, "Failed");
    assert.equal(failed.reason, "MTOW not determined — TODA: no chart result");

    const ooc = evaluateTakeoffStatus({ tow: 4600, mtowResult: { mtow: null, outOfChart: true, reason: "WAT: x" }, segments: SEG_OK });
    assert.equal(ooc.state, "ooc");
});

// ------------------------------------------------------------------
// 6) getWAT fora do gráfico
// ------------------------------------------------------------------

test("getWAT dentro do gráfico mantém os valores", () => {
    const cases = [["1", 2485, 35, 6016], ["1", 2000, 30, 6375], ["1", 2000, 35, 6125], ["up", 2000, 35, 6300], ["up", 4500, 42, 5400], ["1", 0, 55, 5425]];
    for (const [flaps, pa, oat, wat] of cases) {
        assert.deepEqual(getWAT(flaps, pa, oat), { status: "ok", wat, reason: null }, `${flaps} ${pa} ${oat}`);
    }
});

// Ponto mais frio da linha, exatamente na tabela: devolve o valor real do gráfico
test("getWAT: OAT igual ao ponto mais frio da tabela devolve o valor real (não o cap)", () => {
    assert.deepEqual(getWAT("1", 3000, 25), { status: "ok", wat: 6350, reason: null });
});

// Flaps 1: curvas que saem pela borda direita do gráfico (6600 kg). Os pontos extrapolados
// evitam que a linha de PA mais baixa caia no cold cap (6400) e puxe a interpolação para baixo.
test("getWAT flaps 1: pontos extrapolados acima de 6600 kg (fim do gráfico)", () => {
    assert.deepEqual(getWAT("1", 2000, 25), { status: "ok", wat: 6620, reason: null });
    assert.deepEqual(getWAT("1", 0, 30), { status: "ok", wat: 6830, reason: null });
    // LPBG 19 (2277 ft), 25 °C: 6620 (2000 ft) com 6350 (3000 ft), já não 6400 (cap) com 6350 → 6386
    assert.deepEqual(getWAT("1", 2277, 25), { status: "ok", wat: 6545, reason: null });
});

// Lado frio: ponto mais frio da linha já encostado ao peso máximo do avião (6400 kg) →
// para OAT mais frias o limite é esse peso máximo, não o valor da borda do gráfico
test("getWAT: OAT mais fria do que o gráfico, com o cap de peso máximo encostado → cold_cap no peso máximo", () => {
    const r = getWAT("1", 2277, -10);
    assert.deepEqual(r, { status: "cold_cap", wat: 6400, reason: null });

    // Mesmo com um aircraftMTOW explícito diferente do default
    const r2 = getWAT("1", 2277, -10, 6400);
    assert.deepEqual(r2, { status: "cold_cap", wat: 6400, reason: null });

    // O cap nunca é excedido: nunca acima do peso máximo do avião
    assert.ok(getWAT("1", 2000, -40).wat <= 6400);
});

// Lado frio: ponto mais frio da linha ainda longe do peso máximo (aircraftMTOW maior do
// que o habitual) → a curva continua a subir fora do gráfico, sem valor seguro a devolver
test("getWAT: ponto mais frio ainda longe do peso máximo do avião → out_of_chart, sem valor da borda", () => {
    const r = getWAT("1", 2000, -10, 7000); // cap a 7000 kg: 6375 kg fica bem abaixo de 6950
    assert.equal(r.status, "out_of_chart");
    assert.equal(r.wat, null);
    assert.match(r.reason, /below chart/);
});

test("getWAT: OAT acima do gráfico ou PA acima de 8000 ft → out_of_chart sem número", () => {
    for (const [flaps, pa, oat] of [["1", 2277, 56], ["up", 2000, 60], ["1", 8500, 0], ["up", 9000, -10], ["1", 6500, 35], ["1", 7000, 31], ["1", 9000, -10]]) {
        const r = getWAT(flaps, pa, oat);
        assert.equal(r.status, "out_of_chart", `${flaps} ${pa} ${oat}`);
        assert.equal(r.wat, null, `${flaps} ${pa} ${oat}`);
        assert.match(r.reason, /above chart/, `${flaps} ${pa} ${oat}`);
    }
});

test("WAT fora do gráfico: MTOW 'out of AFM chart' e selo com o motivo", () => {
    const wat = getWAT("1", 2215, 56);
    const r = computeMtow({
        limits: { ...LIMITS, WAT: null },
        problems: { WAT: { outOfChart: true, reason: wat.reason } },
        searchSegments: noSegments
    });
    assert.equal(r.outOfChart, true);
    assert.equal(formatMtow(r), "out of AFM chart");
    const s = evaluateTakeoffStatus({ tow: 5000, mtowResult: r, segments: SEG_OK });
    assert.equal(s.text, "Out of AFM chart");
    assert.match(s.reason, /WAT: OAT 56 °C above chart/);
});

test("UI: OAT 56 °C mostra o WAT fora do gráfico no motivo", async () => {
    const r = await page.calc({ ...EXAMPLE, oat: "56", tow: "5000" });
    assert.equal(r.badgeOk, false);
    assert.match(r.reason, /WAT: OAT 56 °C above chart/);
    assert.match(r.limit, /WAT/);
});

test("UI: OAT abaixo do gráfico WAT indica 'cold cap' (peso máximo, code 7) quando o WAT limita", async () => {
    const r = await page.calc({ ...EXAMPLE, oat: "15", tow: "5000" });
    assert.equal(r.limit, "(WAT, cold cap · code 7)");
    // Lado frio já encostado ao peso máximo do avião, não ao valor da borda do gráfico
    assert.equal(mtowOf(r), 6400);
});

// ------------------------------------------------------------------
// 7) Regressões
// ------------------------------------------------------------------

test("UI: LPBG 19, 25 °C, QNH 1013, flaps 1 → MTOW 6400 (peso máximo do avião, code 7), não 6386", async () => {
    const cond = { airport: "LPBG", runway: "19", wind: "000/00", oat: "25", qnh: "1013", flaps: "1" };
    const off = await page.calc({ ...cond, inlets: "off", tow: "6400" });
    assert.equal(off.mtow, "6400 kg");
    assert.equal(off.limit, "(aircraft max weight · code 7)");
    assert.equal(off.badgeText, "Passed");

    // Inlets ON: WAT do gráfico (6545) - 250
    const on = await page.calc({ ...cond, inlets: "on", tow: "6000" });
    assert.equal(on.mtow, "6295 kg");
    assert.equal(on.limit, "(WAT · code 10)");
});

test('QNH "1003.25" / "1003,25" na UI: PA = elevação + 263 (não 0)', async () => {
    const dot = await page.calc({ ...EXAMPLE, qnh: "1003.25", tow: "5000" });
    const comma = await page.calc({ ...EXAMPLE, qnh: "1003,25", tow: "5000" });
    assert.deepEqual(dot.alerts, []);
    assert.equal(dot.mtow, comma.mtow);
    // WAT na PA da pista 01 (2215 + 263 ft); com PA = 0 seria 6600
    assert.equal(mtowOf(dot), getWAT("1", 2215 + 263, 35).wat);
});

test("sem console.log de debug por defeito", async () => {
    const original = console.log;
    let calls = 0;
    console.log = () => { calls++; };
    try {
        await page.calc({ ...EXAMPLE, tow: "6100" });
        await page.calc({ airport: "LPBG", runway: "19", wind: "190/20", oat: "0", qnh: "1013", flaps: "1", inlets: "on", tow: "6000" });
    } finally {
        console.log = original;
    }
    assert.equal(calls, 0);
});
