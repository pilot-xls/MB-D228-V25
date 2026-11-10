// Diagnóstico LPVR / LPPM / LPVZ (varrimento de 330 condições por aeroporto, flaps 1, inlets OFF)
// Correr na raiz do repositório:  node --test tests/*.test.mjs
// O varrimento completo está em tests/tools/airport-sweep.mjs (demora ~11 s por aeroporto).
//
// Problema 1: "MTOW out of AFM chart"
//   - ASDA: a ASDA não chega nem para 4500 kg (peso mínimo de todos os gráficos) → limite real,
//     agora "< 4500 kg (ASDA · code 3)" e Failed para TOW >= 4500 kg
//   - 2.º seg (LPPM 11): required > 7 % (topo do gráfico do required) → limite real; falha certa
//     quando o performed é <= 7 %, não verificável quando o performed passa de 7 %
// Problema 2: obstáculos <= 400 ft entram só no 2.º segmento (code 2) por desenho
// Problema 3: o piso molhado entra só na ASDA; na LPPM 11 o 2.º seg limita sempre mais

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { loadPerformancePage } from "./helpers/performanceDom.mjs";

console.warn = () => {};

const page = await loadPerformancePage();
const { computeMtow, evaluateTakeoffStatus, formatMtow, formatMtowLimit, describeMtowChartProblem } = page.module;
const {
    evaluateSegments, findMaxTowAllSegments, getMaxTow2Seg, getMaxTow3Seg, getMaxTow4Seg,
    getTodrForWeight, obstacleDistanceFromReferenceZero, splitObstacles
} = await import("../js/cgMTOWSearch.js");
const { default: ASDR_Flaps1 } = await import("../js/asdrFlaps1_CSATH.js");
const { default: MTOW_ASDA_Flaps1 } = await import("../js/mtowASDA_Flaps1.js");
const { default: Grad2F1 } = await import("../js/cg2segFlaps1_CSATH.js");
const { default: Grad4Up } = await import("../js/cg4segFlapsUp_CSATH.js");

const AIRPORTS = JSON.parse(readFileSync(new URL("../data/airportsList.json", import.meta.url), "utf8"));
const runway = (icao, rwy) => AIRPORTS.find(a => a.icao === icao && a.rwy === rwy);
const paOf = (entry, qnh) => Math.max(0, Math.round(entry.elevation + (1013 - qnh) * 27));

// ------------------------------------------------------------------
// Problema 2: campos dos obstáculos e divisão por segmento
// ------------------------------------------------------------------

test("airportsList: obstáculos em obstacles[] com name / obstacle_ft / obstacle_dist (não há 'obstacle ft' no topo da pista)", () => {
    for (const [icao, rwy, names] of [["LPPM", "11", ["Elevação natural", "Edifícios", "Talude", "Vedação"]], ["LPVZ", "36", ["Mastro"]]]) {
        const e = runway(icao, rwy);
        assert.equal(e["obstacle ft"], undefined);
        assert.equal(e.obstacle_ft, undefined);
        assert.deepEqual(e.obstacles.map(o => o.name), names);
    }
    for (const e of AIRPORTS) {
        assert.ok(Array.isArray(e.obstacles), `${e.icao} ${e.rwy}`);
        for (const o of e.obstacles) {
            assert.ok(Number.isFinite(o.obstacle_ft) && Number.isFinite(o.obstacle_dist), `${e.icao} ${e.rwy} ${JSON.stringify(o)}`);
        }
    }
});

test("por desenho: obstáculos até 400 ft só entram no 2.º segmento (code 2); 3.º/4.º só acima de 400 ft", () => {
    for (const [icao, rwy] of [["LPPM", "11"], ["LPVZ", "36"]]) {
        const { obstacles2Seg, obstacles34Seg } = splitObstacles(runway(icao, rwy).obstacles);
        assert.equal(obstacles2Seg.length, runway(icao, rwy).obstacles.length, `${icao} ${rwy}`);
        assert.equal(obstacles34Seg.length, 0, `${icao} ${rwy}`);
    }
    const s = splitObstacles([
        { obstacle_ft: 400, obstacle_dist: 4999 }, { obstacle_ft: 400, obstacle_dist: 5000 },
        { obstacle_ft: 401, obstacle_dist: 2499 }, { obstacle_ft: 401, obstacle_dist: 2500 }
    ]);
    assert.deepEqual(s.obstacles2Seg, [{ obstacle_ft: 400, obstacle_dist: 4999 }]);
    assert.deepEqual(s.obstacles34Seg, [{ obstacle_ft: 401, obstacle_dist: 2499 }]);
});

test("LPVZ 36, QNH 1013, OAT 15, vento 0: Mastro 131 ft a 750 m do fim da TODA → MTOW 5975 kg (2nd seg · code 2)", async () => {
    const e = runway("LPVZ", "36");
    const params = { flaps: "1", pa: paOf(e, 1013), oat: 15, inlet: "off", wind: 0, slope: e.slope, toda: e.toda };
    const { obstacles2Seg, obstacles34Seg } = splitObstacles(e.obstacles);
    assert.equal(params.pa, 2061);

    // A 5975 kg: TOD 768 m → Reference Zero a (1160 − 768) + 750 = 1142 m do Mastro (distância medida do fim da TODA)
    const at = evaluateSegments({ ...params, tow: 5975, obstacles2Seg, obstacles34Seg });
    assert.equal(at.todr, 768);
    assert.equal(obstacleDistanceFromReferenceZero(obstacles2Seg[0], at.todr, e.toda), 1142);
    assert.equal(at.SEG2.required, 3.7);
    assert.ok(at.SEG2.gradient >= 3.7, String(at.SEG2.gradient));
    assert.equal(at.SEG2.state, "ok");
    assert.equal(evaluateSegments({ ...params, tow: 5976, obstacles2Seg, obstacles34Seg }).SEG2.state, "bad");

    // MTOW de cada segmento isolado: só o 2.º limita (o 3.º/4.º não têm obstáculos)
    assert.equal(getMaxTow2Seg({ ...params, obstacles: obstacles2Seg, maxWeight: 6400 }), 5975);
    assert.equal(getMaxTow3Seg({ ...params, obstacles: obstacles34Seg, maxWeight: 6400 }), 6400);
    assert.equal(getMaxTow4Seg({ ...params, obstacles: obstacles34Seg, maxWeight: 6400 }), 6400);

    const r = await page.calc({ airport: "LPVZ", runway: "36", wind: "000/00", oat: "15", qnh: "1013", tow: "5975" });
    assert.equal(r.mtow, "5975 kg");
    assert.equal(r.limit, "(2nd seg · code 2)");
    assert.equal(r.badgeText, "Passed");
    assert.equal(r.cg2, "3.7% / 3.7%");
    assert.equal(r.cg4, "0.0% / 3.1%");
});

// ------------------------------------------------------------------
// Problema 1: ASDA abaixo do peso mínimo do gráfico (limite real)
// ------------------------------------------------------------------

test("ASDA (LPPM 29, QNH 1003, OAT 40, cauda 10 kt): o forward ASDR já excede a ASDA a 4500 kg → limite real do gráfico", () => {
    // 4500 kg é o peso mínimo de todos os gráficos (ASDR, TORR, TODR, MTOW, segmentos): não falta nenhum ponto
    assert.equal(Math.round(ASDR_Flaps1({ PA: 275, OAT: 40, Weight: 4500, Wind: -10, runway: "DRY" }).result), 861);
    const problem = describeMtowChartProblem(MTOW_ASDA_Flaps1({ PA: 275, OAT: 40, Wind: -10, runway_conditions: "DRY", ASDA: 860 }));
    assert.equal(problem.belowWeight, 4500);
    assert.equal(problem.outOfChart, true);

    // Contínuo com a PA: perto de 4500 kg cada metro de ASD vale ~20 kg, por isso QNH 1013 → 1003 cai de 4663 para < 4500
    const mtowAt = PA => MTOW_ASDA_Flaps1({ PA, OAT: 40, Wind: -10, runway_conditions: "DRY", ASDA: 860 }).result;
    assert.deepEqual([0, 5, 100, 200, 275].map(mtowAt), [4666, 4663, 4621, 4548, 0]);
});

test("UI ASDA: '< 4500 kg (ASDA · code 3)', Failed com TOW >= 4500 kg; QNH 1013/1023 continuam 4663/4666 kg", async () => {
    const cond = { airport: "LPPM", runway: "29", wind: "110/10", oat: "40", qnh: "1003" };
    const r = await page.calc({ ...cond, tow: "5000" });
    assert.equal(r.mtow, "< 4500 kg");
    assert.equal(r.limit, "(ASDA · code 3)");
    assert.equal(r.badgeText, "Failed");
    assert.equal(r.reason, "TOW above MTOW (limit: ASDA, MTOW < 4500 kg) — ASDA: ASDA 860 m: MTOW below chart minimum weight (4500 kg)");

    // TOW abaixo dos gráficos: não se sabe → Out of AFM chart (nunca Passed nem Failed)
    const low = await page.calc({ ...cond, tow: "4400" });
    assert.equal(low.badgeText, "Out of AFM chart");

    assert.equal((await page.calc({ ...cond, qnh: "1013", tow: "4663" })).mtow, "4663 kg");
    assert.equal((await page.calc({ ...cond, qnh: "1023", tow: "4663" })).mtow, "4666 kg");
});

test("UI ASDA WET (LPVR 02, QNH 1013, OAT 15, cauda 10 kt): WET < 4500 kg, DRY 5704 kg", async () => {
    const cond = { airport: "LPVR", runway: "02", wind: "200/10", oat: "15", qnh: "1013", tow: "5000" };
    const wet = await page.calc({ ...cond, surface: "wet" });
    assert.deepEqual([wet.mtow, wet.limit, wet.badgeText], ["< 4500 kg", "(ASDA · code 3)", "Failed"]);
    const dry = await page.calc({ ...cond, surface: "dry" });
    assert.deepEqual([dry.mtow, dry.limit, dry.badgeText], ["5704 kg", "(ASDA · code 3)", "Passed"]);
});

test("computeMtow: ASDA abaixo do mínimo ganha a outro limite sem resultado (o MTOW fica abaixo de 4500 kg na mesma)", () => {
    const r = computeMtow({
        limits: { WAT: null, ASDA: 0, TORA: 6000, TODA: 6000, STRUCT: 6400 },
        problems: {
            WAT: { outOfChart: true, reason: "OAT 55 °C above chart" },
            ASDA: { outOfChart: true, belowWeight: 4500, reason: "ASDA 700 m: MTOW below chart minimum weight (4500 kg)" }
        },
        searchSegments: () => assert.fail("não deve procurar nos segmentos")
    });
    assert.deepEqual([formatMtow(r), formatMtowLimit(r), r.limitKey], ["< 4500 kg", "(ASDA · code 3)", "ASDA"]);
    const segOk = { SEG2: { state: "ok" }, SEG3: { state: "na" }, SEG4: { state: "ok" } };
    assert.equal(evaluateTakeoffStatus({ tow: 4500, mtowResult: r, segments: segOk }).text, "Failed");
    assert.equal(evaluateTakeoffStatus({ tow: 4499, mtowResult: r, segments: segOk }).state, "ooc");
});

// ------------------------------------------------------------------
// Problema 1: 2.º segmento com required > 7 % (LPPM 11)
// ------------------------------------------------------------------

const lppm11 = (qnh, oat, wind) => {
    const e = runway("LPPM", "11");
    return { flaps: "1", pa: paOf(e, qnh), oat, inlet: "off", wind, slope: e.slope, toda: e.toda, ...splitObstacles(e.obstacles) };
};

test("LPPM 11 (QNH 1003, OAT 5, cauda 10 kt): required > 7 % é o topo do gráfico; falha certa acima de 5242 kg, não verificável abaixo", () => {
    const params = lppm11(1003, 5, -10);

    // 4500 kg: Elevação natural (164 ft a 700 m) exige mais de 7 %; performed 8.5 % → o gráfico não diz se passa
    const light = evaluateSegments({ ...params, tow: 4500 });
    assert.equal(light.SEG2.state, "ooc");
    assert.equal(light.SEG2.gradient, 8.5);
    assert.deepEqual(light.SEG2.aboveChartObstacles, ["Elevação natural"]);

    // Fronteira: o performed passa a <= 7 % entre 5242 e 5243 kg
    assert.equal(evaluateSegments({ ...params, tow: 5242 }).SEG2.state, "ooc");
    const heavy = evaluateSegments({ ...params, tow: 5243 });
    assert.equal(heavy.SEG2.state, "bad");
    assert.ok(heavy.SEG2.gradient <= 7, String(heavy.SEG2.gradient));

    const s = findMaxTowAllSegments(params, 5722);
    assert.equal(s.mtow, null);
    assert.equal(s.belowWeight, undefined);
    assert.deepEqual([s.undetermined.tow, s.undetermined.lowestTow, s.undetermined.failing], [5242, 4500, ["SEG2"]]);
});

test("UI LPPM 11 (QNH 1003, OAT 5, cauda 10 kt): MTOW out of AFM chart com o obstáculo no motivo; TOW 5500 Failed, TOW 5000 Out of AFM chart", async () => {
    const cond = { airport: "LPPM", runway: "11", wind: "290/10", oat: "5", qnh: "1003" };
    const why = "no weight up to 5722 kg meets 2nd seg — 2nd seg required gradient above 7 % (AFM chart max) at 4500 kg for Elevação natural (fails above 5242 kg)";

    const heavy = await page.calc({ ...cond, tow: "5500" });
    assert.deepEqual([heavy.mtow, heavy.limit, heavy.badgeText], ["out of AFM chart", "(2nd seg)", "Failed"]);
    assert.equal(heavy.reason, "Climb gradient not met: 2nd seg — MTOW not determined — " + why);
    assert.equal(heavy.cg2, "Req > 7% / 5.9%");

    const light = await page.calc({ ...cond, tow: "5000" });
    assert.deepEqual([light.mtow, light.badgeText], ["out of AFM chart", "Out of AFM chart"]);
    assert.equal(light.reason, "MTOW not determined — " + why);
});

test("2.º seg: todos os pesos falham de certeza → '< 4500 kg (2nd seg · code 2)' e Failed", () => {
    // PA 4000, OAT 40: performed 4.6 % a 4500 kg; antena de 400 ft a ~100 m do Reference Zero exige > 7 %
    const base = { flaps: "1", pa: 4000, oat: 40, inlet: "off", wind: 0, slope: 0 };
    const toda = getTodrForWeight({ ...base, tow: 4600 });
    const params = { ...base, toda, obstacles2Seg: [{ name: "Antena", obstacle_ft: 400, obstacle_dist: 100 }], obstacles34Seg: [] };

    const s = findMaxTowAllSegments(params, 4600);
    assert.deepEqual([s.mtow, s.belowWeight, s.undetermined], [null, 4500, null]);

    const r = computeMtow({ limits: { WAT: 6000, ASDA: 4600, TORA: 6000, TODA: 6000, STRUCT: 6400 }, searchSegments: cap => findMaxTowAllSegments(params, cap) });
    assert.deepEqual([formatMtow(r), formatMtowLimit(r)], ["< 4500 kg", "(2nd seg · code 2)"]);
    assert.equal(r.reason, "2nd seg not met at any weight from 4500 to 4600 kg");
    const status = evaluateTakeoffStatus({ tow: 4550, mtowResult: r, segments: evaluateSegments({ ...params, tow: 4550 }) });
    assert.equal(status.text, "Failed");
});

test("performed fora do gráfico (ex.: TOW 4400 kg) → 'ooc', não 'bad'; abaixo do required continua 'bad'", () => {
    assert.equal(Grad2F1({ pressureAltitude: 0, oat: 15, tow: 4400, inlet: "off", gradientRequired: 0 }).outOfChart, true);
    assert.equal(Grad4Up({ pressureAltitude: 0, oat: 15, tow: 4400, inlet: "off", gradientRequired: 0 }).outOfChart, true);

    const e = evaluateSegments({ flaps: "1", pa: 0, oat: 15, tow: 4400, inlet: "off", wind: 0, slope: 0, toda: 1000 });
    assert.deepEqual([e.SEG2.state, e.SEG2.text], ["ooc", "0.0% / out of AFM chart"]);
    assert.deepEqual([e.SEG4.state, e.SEG4.text], ["ooc", "0.0% / out of AFM chart"]);

    // Gradiente calculado mas abaixo do required: falha real, sem outOfChart
    const below = Grad2F1({ pressureAltitude: 0, oat: 15, tow: 6000, inlet: "off", gradientRequired: 7 });
    assert.equal(below.status, "FAILED");
    assert.equal(below.outOfChart, undefined);
    assert.ok(below.gradient > 4 && below.gradient < 4.2, String(below.gradient));
});

// ------------------------------------------------------------------
// Problema 3: piso molhado na LPPM 11
// ------------------------------------------------------------------

test("LPPM 11: WET entra na ASDA (que baixa), mas o 2.º seg limita mais → MTOW WET = DRY", async () => {
    // O piso molhado é aplicado: PA 5, OAT 15, vento 0, ASDA 860 m → DRY 6500 (topo do gráfico), WET 6327 kg
    const asda = rc => MTOW_ASDA_Flaps1({ PA: 5, OAT: 15, Wind: 0, runway_conditions: rc, ASDA: 860 }).result;
    assert.deepEqual([asda("DRY"), asda("WET")], [6500, 6327]);

    for (const oat of ["-10", "15", "30", "40"]) {
        for (const wind of ["000/00", "110/20"]) {
            const cond = { airport: "LPPM", runway: "11", wind, oat, qnh: "1013", tow: "4600" };
            const dry = await page.calc({ ...cond, surface: "dry" });
            const wet = await page.calc({ ...cond, surface: "wet" });
            assert.equal(wet.mtow, dry.mtow, `OAT ${oat} ${wind}`);
            assert.equal(dry.limit, "(2nd seg · code 2)", `OAT ${oat} ${wind}`);
            assert.equal(wet.limit, "(2nd seg · code 2)", `OAT ${oat} ${wind}`);
        }
    }
});

// ------------------------------------------------------------------
// Comportamento a manter
// ------------------------------------------------------------------

test("mantém-se: 3.º seg fora do gráfico sem obstáculos não bloqueia (LPVZ 18, QNH 1005, OAT 35)", async () => {
    const r = await page.calc({ airport: "LPVZ", runway: "18", wind: "000/00", oat: "35", qnh: "1005", tow: "5000" });
    assert.equal(r.cg3, "0m / out of AFM chart");
    assert.equal(r.mtow, "5913 kg");
    assert.equal(r.badgeText, "Passed");
});
