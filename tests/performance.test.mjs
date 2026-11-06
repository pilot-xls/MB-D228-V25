// Testes da página Performance (D228 CS-ATH)
// Correr na raiz do repositório:  node --test tests/performance.test.mjs
//
// Requer Node 22+ (importa os ficheiros .js do site como ES modules). Usa só node:test e node:assert.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// performance.js regista um listener de DOMContentLoaded ao ser importado.
// Em Node não há DOM, por isso basta um stub mínimo de "document".
globalThis.document = { addEventListener() {} };

const {
    parseQnh,
    getPressureAltitude,
    describeThirdSegment,
    QNH_MIN,
    QNH_MAX
} = await import("../js/performance.js");
const { default: ThirdSegmentDistanceFlaps1 } = await import("../js/cg3segFlaps1_CSATH.js");
const { getMaxTow3Seg, getMaxTow4Seg, evaluateSegments, obstacleDistanceFromReferenceZero } = await import("../js/cgMTOWSearch.js");
const { default: Gradient_Required2Seg } = await import("../js/cgRequired2Seg_CSATH.js");

const airports = JSON.parse(readFileSync(new URL("../data/airportsList.json", import.meta.url), "utf8"));
const LPBG_01 = airports.find(a => a.icao === "LPBG" && a.rwy === "01");
const LPBG_19 = airports.find(a => a.icao === "LPBG" && a.rwy === "19");

// 3º segmento com os parâmetros do anexo A (TOW 5000, inlet off, sem obstáculo)
function seg3(pa, oat, extra = {}) {
    return ThirdSegmentDistanceFlaps1({
        pressureAltitude: pa,
        oat,
        tow: 5000,
        inlet: "off",
        obstacleDistance: 0,
        ...extra
    });
}

// ------------------------------------------------------------------
// 1) QNH
// ------------------------------------------------------------------

test("airportsList: elevação de LPBG é número (01 = 2215, 19 = 2277)", () => {
    assert.equal(typeof LPBG_01.elevation, "number");
    assert.equal(typeof LPBG_19.elevation, "number");
    assert.equal(LPBG_01.elevation, 2215);
    assert.equal(LPBG_19.elevation, 2277);
});

test("parseQnh aceita um separador decimal (. ou ,)", () => {
    assert.equal(parseQnh("1003.25"), 1003.25);
    assert.equal(parseQnh("1003,25"), 1003.25);
    assert.equal(parseQnh("1013"), 1013);
    assert.equal(parseQnh(" 1013 "), 1013);
    assert.equal(parseQnh("1003."), 1003);
    assert.equal(parseQnh(String(QNH_MIN)), QNH_MIN);
    assert.equal(parseQnh(String(QNH_MAX)), QNH_MAX);
});

test("parseQnh rejeita valores inválidos ou fora de 900–1100 hPa", () => {
    for (const bad of ["", "abc", "100325", "10.03.25", "1003,2,5", ".5", "899", "1101", "-1013", null, undefined]) {
        assert.equal(parseQnh(bad), null, `"${bad}" devia ser inválido`);
    }
});

test('QNH "1003.25" → PA = elevação + 263 (nunca 0)', () => {
    const qnh = parseQnh("1003.25");
    assert.equal(getPressureAltitude(qnh, LPBG_19), 2277 + 263);
    assert.equal(getPressureAltitude(qnh, LPBG_01), 2215 + 263);
    assert.notEqual(getPressureAltitude(qnh, LPBG_19), 0);
});

test("PA usa a elevação da pista selecionada (fórmula 1013, 27 ft/hPa)", () => {
    assert.equal(getPressureAltitude(1013, LPBG_19), 2277);
    assert.equal(getPressureAltitude(1013, LPBG_01), 2215);
    assert.equal(getPressureAltitude(1023, LPBG_19), 2007);
    assert.equal(getPressureAltitude(1023, LPBG_01), 1945);
    assert.equal(getPressureAltitude(1003, LPBG_19), 2547);
});

test("PA com elevação em string não concatena; dados em falta lançam erro", () => {
    assert.equal(getPressureAltitude(1013, { ...LPBG_19, elevation: "2277" }), 2277);
    assert.throws(() => getPressureAltitude(1013, undefined), /Runway has no data/);
    assert.throws(() => getPressureAltitude(1013, { ...LPBG_19, elevation: undefined }), /Invalid elevation/);
    assert.throws(() => getPressureAltitude(1013, { ...LPBG_19, elevation: "" }), /Invalid elevation/);
    assert.throws(() => getPressureAltitude(NaN, LPBG_19), /Invalid QNH/);
});

// ------------------------------------------------------------------
// 2) 3º segmento: OUT_OF_CHART em vez de FAILED com 0 m
// ------------------------------------------------------------------

test("anexo A: linha OAT 30 mantém os valores (sem alterações às tabelas)", () => {
    const expected = { 1900: 848.4, 2000: 862.9, 2007: 864.7, 2100: 886.7, 2277: 925.6, 2300: 930.8, 2500: 969.6, 2547: 975.5, 2600: 982.2, 3000: 1030.9, 4000: 1169.3 };
    for (const [pa, dist] of Object.entries(expected)) {
        const r = seg3(Number(pa), 30);
        assert.equal(r.status, "PASSED", `PA ${pa}`);
        assert.equal(r.distance, dist, `PA ${pa}`);
    }
});

test("anexo A: PA <= 2000 com OAT 31/35 continua a passar com os mesmos valores", () => {
    assert.deepEqual([seg3(1900, 31).distance, seg3(1900, 31).status], [892.0, "PASSED"]);
    assert.deepEqual([seg3(2000, 31).distance, seg3(2000, 31).status], [904.9, "PASSED"]);
    assert.deepEqual([seg3(1900, 35).distance, seg3(1900, 35).status], [1012.3, "PASSED"]);
    assert.deepEqual([seg3(2000, 35).distance, seg3(2000, 35).status], [1020.8, "PASSED"]);
});

test("anexo A: PA > 2000 com OAT 31–40 devolve OUT_OF_CHART (não FAILED, não 0 m)", () => {
    for (const pa of [2007, 2100, 2277, 2300, 2500, 2547, 2600, 3000, 4000]) {
        for (const oat of [31, 35, 40]) {
            const r = seg3(pa, oat);
            assert.equal(r.status, "OUT_OF_CHART", `PA ${pa} OAT ${oat}`);
            assert.equal(r.distance, null, `PA ${pa} OAT ${oat}`);
        }
    }
});

test("LPBG 19, QNH 1013: OAT 30 válido, OAT 35 fora do gráfico", () => {
    const pa = getPressureAltitude(parseQnh("1013"), LPBG_19);
    const r30 = seg3(pa, 30);
    assert.equal(r30.status, "PASSED");
    assert.equal(r30.distance, 925.6);
    assert.equal(seg3(pa, 35).status, "OUT_OF_CHART");
});

test("QNH 1023: pista 19 (PA 2007) fora do gráfico; pista 01 (PA 1945) passa com 1016.1 m", () => {
    const pa19 = getPressureAltitude(1023, LPBG_19);
    const pa01 = getPressureAltitude(1023, LPBG_01);
    assert.equal(seg3(pa19, 35).status, "OUT_OF_CHART");
    const r01 = seg3(pa01, 35);
    assert.equal(r01.status, "PASSED");
    assert.equal(r01.distance, 1016.1);
});

test("PA <= 2000 ft com OAT 40 continua a passar", () => {
    const cases = [0, 1000, 2000, getPressureAltitude(1023, LPBG_01), getPressureAltitude(1026, LPBG_19)];
    for (const pa of cases) {
        assert.ok(pa <= 2000, `PA ${pa}`);
        const r = seg3(pa, 40);
        assert.equal(r.status, "PASSED", `PA ${pa}`);
        assert.ok(r.distance > 0, `PA ${pa}`);
    }
});

test("peso fora da tabela do 3º segmento também devolve OUT_OF_CHART", () => {
    assert.equal(seg3(1000, 15, { tow: 6600 }).status, "OUT_OF_CHART");
    assert.equal(seg3(1000, 15, { tow: 4400 }).status, "OUT_OF_CHART");
});

test("a comparação com obstáculo continua igual (PASSED / FAILED)", () => {
    assert.equal(seg3(2277, 30, { obstacleDistance: 1000 }).status, "PASSED");
    assert.equal(seg3(2277, 30, { obstacleDistance: 900 }).status, "FAILED");
});

test("UI: fora do gráfico sem obstáculo não conta como falha; com obstáculo não passa", () => {
    const ooc = seg3(2277, 35);
    const noObs = describeThirdSegment(ooc, 0, false);
    assert.equal(noObs.state, "na");
    assert.equal(noObs.text, "0m / out of AFM chart");

    const withObs = describeThirdSegment(seg3(2277, 35, { obstacleDistance: 1500 }), 1500, true);
    assert.equal(withObs.state, "ooc");
    assert.match(withObs.text, /out of AFM chart/);

    assert.equal(describeThirdSegment(seg3(2277, 30), 0, false).state, "ok");
    assert.equal(describeThirdSegment(seg3(2277, 30, { obstacleDistance: 900 }), 900, true).state, "bad");
});

// ------------------------------------------------------------------
// 3) MTOW por segmento (cgMTOWSearch.js)
// ------------------------------------------------------------------

// obstacle_dist é medida a partir do fim da TODA: com obstáculos é preciso a TODA
const base34 = { inlet: "off", wind: 0, toda: 1700 };

test("getMaxTow3Seg: sem obstáculos não limita, mesmo fora do gráfico (OAT 35)", () => {
    assert.equal(getMaxTow3Seg({ ...base34, pa: 2277, oat: 35, slope: -1.2, obstacles: [] }), 6500);
});

test("getMaxTow3Seg: com obstáculo e fora do gráfico devolve null (nenhum peso verificável)", () => {
    // TODA de 1000 m: o obstáculo fica a (1000 - TOD) + 2000 m do RZ, dentro do gráfico (0-2400 m)
    const obstacles = [{ obstacle_ft: 500, obstacle_dist: 2000 }];
    assert.equal(getMaxTow3Seg({ ...base34, toda: 1000, pa: 2277, oat: 35, slope: 0, obstacles }), null);
    // Dentro do gráfico há um MTOW numérico
    const mtow = getMaxTow3Seg({ ...base34, toda: 1000, pa: 2277, oat: 15, slope: 0, obstacles });
    assert.equal(typeof mtow, "number");
});

test("getMaxTow4Seg: required a null não é ignorado (antes era tratado como 0)", () => {
    // slope -1.2 está fora da SlopeTable do required 3º/4º seg (0, 1, 2) → required null
    const obstacles = [{ obstacle_ft: 500, obstacle_dist: 2000 }];
    assert.equal(getMaxTow4Seg({ ...base34, pa: 2277, oat: 15, slope: -1.2, obstacles }), null);
});

// ------------------------------------------------------------------
// 4) 2.º segmento: required gradient (cgRequired2Seg_CSATH.js) e obstáculos
// ------------------------------------------------------------------

const req2 = (h, d = 1500, wind = 0) => Gradient_Required2Seg({ obstacleDistance: d, wind, obstacle_height_ft: h });

test("required 2.º seg: alturas fora da grelha de 10 ft interpolam entre linhas (antes davam 7 %)", () => {
    assert.equal(req2(50).result_CG_required, 1);
    assert.equal(req2(60).result_CG_required, 1.3);
    assert.equal(req2(56).result_CG_required, 1.2);
    const r131 = req2(131).result_CG_required;
    assert.ok(r131 >= req2(130).result_CG_required && r131 <= req2(140).result_CG_required, String(r131));
    assert.ok(req2(164, 2000).result_CG_required < 7);
});

test("required 2.º seg: abaixo de 50 ft é proporcional à linha de 50 ft; 0 ft não exige nada", () => {
    // WDI de LPBG 19 (26 ft) a 1323 m do Reference Zero: linha de 50 ft = 1.2 % → 1.2 × 26/50
    assert.equal(req2(50, 1323).result_CG_required, 1.2);
    assert.equal(req2(26, 1323).result_CG_required, 0.6);
    assert.equal(req2(0).result_CG_required, 0);
});

test("required 2.º seg: acima de 7 % fica assinalado (antes devolvia null e o obstáculo era ignorado)", () => {
    for (const [h, d] of [[200, 400], [60, 100], [60, 3], [26, 50]]) {
        const q = req2(h, d);
        assert.equal(q.result_CG_required, null, `${h} ft a ${d} m`);
        assert.equal(q.aboveChart, true, `${h} ft a ${d} m`);
    }
    // Para lá dos 5000 m do gráfico não é "acima de 7 %": não conta
    assert.notEqual(req2(60, 5200).aboveChart, true);
});

test("required 2.º seg: nunca sobe quando o obstáculo se afasta (0-5000 m, vento -20..30 kt)", () => {
    // inclui: para lá da última linha usa a de menor CG; vento de frente com a linha de vento
    // já fora do gráfico usa a borda dessa linha (antes perdia o efeito do vento a 4000/4500 m)
    for (const wind of [-20, 0, 15, 30]) {
        for (const h of [7, 26, 50, 60, 170, 300]) {
            let prev = Infinity;
            for (let d = 0; d <= 5000; d += 10) {
                const q = req2(h, d, wind);
                const v = q.aboveChart ? 99 : q.result_CG_required;
                if (v == null) continue;
                assert.ok(v <= prev, `vento ${wind} ${h} ft: ${d} m = ${v} > ${prev}`);
                prev = v;
            }
        }
    }
});

test("segmentos: distância ao Reference Zero = (TODA - TOD) + obstacle_dist (medida do fim da TODA)", () => {
    assert.equal(obstacleDistanceFromReferenceZero({ obstacle_dist: 715 }, 1092, 1700), 1323);
    assert.equal(obstacleDistanceFromReferenceZero({ obstacle_dist: 0 }, 1700, 1700), 0);
});

const seg2Params = { flaps: "1", pa: 0, oat: 15, tow: 6000, inlet: "off", wind: 0, slope: 0, obstacles34Seg: [] };

test("2.º segmento: obstáculo que exige mais de 7 % não passa (fora do gráfico)", () => {
    // 200 ft a 50 m do fim de uma TODA de 1000 m: muito perto do Reference Zero
    const e = evaluateSegments({ ...seg2Params, toda: 1000, obstacles2Seg: [{ obstacle_ft: 200, obstacle_dist: 50 }] });
    assert.equal(e.SEG2.state, "ooc");
    assert.match(e.SEG2.text, /Req > 7%/);
    assert.equal(e.passed, false);
});

test("2.º segmento: com obstáculos e sem TODA não se ignora nada (fora do gráfico)", () => {
    const e = evaluateSegments({ ...seg2Params, obstacles2Seg: [{ obstacle_ft: 100, obstacle_dist: 500 }] });
    assert.equal(e.SEG2.state, "ooc");
    assert.equal(e.SEG2.text, "TODA missing");
    // Sem obstáculos a TODA não é precisa
    assert.equal(evaluateSegments({ ...seg2Params, obstacles2Seg: [] }).SEG2.state, "ok");
});

test("required 2.º seg: nunca sobe com mais vento de frente (-20..50 kt)", () => {
    // inclui ventos de frente cuja linha já saiu do gráfico e o ruído da digitalização no início da tabela
    for (const h of [7, 26, 60, 160, 310, 400]) {
        for (let d = 0; d <= 5000; d += 50) {
            let prev = Infinity;
            for (let wind = -20; wind <= 50; wind += 1) {
                const q = req2(h, d, wind);
                const v = q.aboveChart ? 99 : q.result_CG_required;
                if (v == null) continue;
                assert.ok(v <= prev, `${h} ft ${d} m: vento ${wind} = ${v} > ${prev}`);
                prev = v;
            }
        }
    }
});

test("required 2.º seg: entre duas linhas, a de cima acima de 7 % não atira o obstáculo para fora do gráfico", () => {
    // Edifícios de LPPM 11 (102 ft) a 585 m: linha de 100 ft = 6.4 %, linha de 110 ft > 7 % (prolongada)
    const q = req2(102, 585);
    assert.equal(q.aboveChart, undefined);
    assert.ok(q.result_CG_required >= req2(100, 585).result_CG_required && q.result_CG_required <= 7, String(q.result_CG_required));
});

test("required 2.º seg: abaixo de 50 ft com a linha de 50 ft acima de 7 % → linha prolongada (geometria do gráfico)", () => {
    // Vedação de 7 ft de LPPM 11 a 275 m do RZ: antes "> 7 %", agora ~1.3 %
    const fence = req2(7, 275);
    assert.equal(fence.aboveChart, undefined);
    assert.equal(fence.extended, true);
    assert.equal(fence.result_CG_required, 1.3);
    // Contínuo com o gráfico no ponto de 7 % da linha de 50 ft (~318 m)
    const a = req2(40, 316).result_CG_required, b = req2(40, 318).result_CG_required;
    assert.ok(Math.abs(a - b) <= 0.2, `${a} vs ${b}`);
    // Muito perto do Reference Zero continua acima do gráfico
    assert.equal(req2(11, 26).aboveChart, true);
    assert.equal(req2(7, 100).aboveChart, true);
});

// ------------------------------------------------------------------
// 5) Gradientes do 2.º/4.º segmento nos pesos baixos
// ------------------------------------------------------------------

const { default: Grad2Up } = await import("../js/cg2segFlapsUp_CSATH.js");
const { default: Grad2F1 } = await import("../js/cg2segFlaps1_CSATH.js");
const { default: Grad4Up } = await import("../js/cg4segFlapsUp_CSATH.js");
const GRADIENTS = { "2.º seg UP": Grad2Up, "2.º seg F1": Grad2F1, "4.º seg UP": Grad4Up };
const grad = (G, pa, oat, tow, inlet = "off") => G({ pressureAltitude: pa, oat, tow, inlet, gradientRequired: -99 });

test("gradientes: pesos baixos já não dão 0 % (antes 'Peso 4500 não contém a section 7')", () => {
    for (const [name, G] of Object.entries(GRADIENTS)) {
        for (const [pa, oat] of [[5, 15], [5, -10], [2277, 0]]) {
            const g4500 = grad(G, pa, oat, 4500).gradient, g5000 = grad(G, pa, oat, 5000).gradient;
            assert.ok(g4500 > 0 && g4500 >= g5000, `${name} PA ${pa} ${oat} °C: 4500 kg ${g4500} vs 5000 kg ${g5000}`);
        }
    }
});

test("gradientes: nunca sobem com o peso, a OAT ou a PA, e inlets ON nunca dão mais do que OFF", () => {
    const W = [4500, 4550, 4600, 4650, 4700, 4800, 4900, 5000, 5500, 6000, 6400];
    const ok = r => !(r.status === "FAILED" && r.gradient === 0);   // fora de PA/OAT do gráfico
    for (const [name, G] of Object.entries(GRADIENTS)) {
        for (let pa = 0; pa <= 8000; pa += 1000) {
            for (let oat = -20; oat <= 50; oat += 5) {
                let prev = Infinity;
                for (const tow of W) {
                    const r = grad(G, pa, oat, tow);
                    if (!ok(r)) continue;
                    assert.ok(r.gradient <= prev + 0.05, `${name} PA ${pa} ${oat} °C: ${tow} kg ${r.gradient} > ${prev}`);
                    prev = r.gradient;
                    const on = grad(G, pa, oat, tow, "on");
                    if (ok(on)) assert.ok(on.gradient <= r.gradient + 0.05, `${name} PA ${pa} ${oat} °C ${tow} kg: ON ${on.gradient} > OFF ${r.gradient}`);
                }
            }
        }
        for (const tow of [4500, 4600, 4700, 5000, 6400]) {
            for (let pa = 0; pa <= 8000; pa += 1000) {
                let prev = Infinity;
                for (let oat = -20; oat <= 50; oat++) {
                    const r = grad(G, pa, oat, tow);
                    if (!ok(r)) continue;
                    assert.ok(r.gradient <= prev + 0.05, `${name} PA ${pa} ${tow} kg: ${oat} °C ${r.gradient} > ${prev}`);
                    prev = r.gradient;
                }
            }
            for (let oat = -20; oat <= 50; oat += 5) {
                let prev = Infinity;
                for (let pa = 0; pa <= 8000; pa += 100) {
                    const r = grad(G, pa, oat, tow);
                    if (!ok(r)) continue;
                    assert.ok(r.gradient <= prev + 0.05, `${name} ${oat} °C ${tow} kg: PA ${pa} ${r.gradient} > ${prev}`);
                    prev = r.gradient;
                }
            }
        }
    }
});

test("2.º seg flaps 1: painel OAT/PA igual ao gráfico do AFM (antes ~0.5 % abaixo)", () => {
    // [PA ft, OAT °C, gradiente na reference line (6000 kg, inlets OFF) lido no gráfico D5-POHX-05-0088-01]
    const AFM = [[0, -20, 4.83], [0, 15, 4.06], [0, 40, 1.94], [2000, 11, 3.77], [2000, 35, 1.45],
                 [4000, 7, 3.41], [4000, 30, 0.95], [6000, 3, 2.34], [8000, -1, 1.50], [8000, 20, -0.15]];
    for (const [pa, oat, g] of AFM) {
        const r = grad(Grad2F1, pa, oat, 6000).gradient;
        assert.ok(Math.abs(r - g) <= 0.07, `${pa} ft ${oat} °C: app ${r.toFixed(2)} vs AFM ${g}`);
    }
});
