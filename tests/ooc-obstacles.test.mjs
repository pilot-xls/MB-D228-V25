// Testes: casos "out of AFM chart" do varrimento de 330 condições e obstáculos (code 2 vs code 4)
// Correr na raiz do repositório:  node --test tests/*.test.mjs
//
// Página Performance real (tests/helpers/performanceDom.mjs), flaps 1, inlets OFF, piso seco.
// Para reproduzir o varrimento completo:  node tests/tools/performance-sweep.mjs LPVR LPPM LPVZ

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { loadPerformancePage } from "./helpers/performanceDom.mjs";
import ASDR_Flaps1 from "../js/asdrFlaps1_CSATH.js";
import { getWAT } from "../js/ToWAT.js";
import Gradient_Required2Seg from "../js/cgRequired2Seg_CSATH.js";
import {
    evaluateSegments,
    findMaxTowAllSegments,
    obstacleDistanceFromReferenceZero,
    getTodrForWeight,
    MIN_WEIGHT
} from "../js/cgMTOWSearch.js";

// Os módulos de cálculo escrevem avisos na consola (gráficos sem resultado); não interessam aqui
console.warn = () => {};

const page = await loadPerformancePage();
const { getPressureAltitude } = page.module;

const AIRPORTS = JSON.parse(readFileSync(new URL("../data/airportsList.json", import.meta.url), "utf8"));
const runway = (icao, rwy) => AIRPORTS.find(a => a.icao === icao && a.rwy === rwy);

const pad3 = n => String(((n % 360) + 360) % 360).padStart(3, "0");
const tailwind = (entry, kt) => pad3(entry.heading + 180) + "/" + String(kt).padStart(2, "0");

// Obstáculos ≤ 400 ft vão para o 2.º segmento; > 400 ft (e < 2500 m) para o 3.º/4.º (como em performance.js)
const obstacles2Seg = entry => entry.obstacles.filter(o => o.obstacle_ft <= 400 && o.obstacle_dist < 5000);
const obstacles34Seg = entry => entry.obstacles.filter(o => o.obstacle_ft > 400 && o.obstacle_dist < 2500);

// ------------------------------------------------------------------
// PROBLEMA 1a — ASDA: QNH 1003, OAT 40, cauda 10 kt
// A ASDR no peso mínimo do gráfico (4500 kg) já excede a ASDA: fora do gráfico de verdade
// ------------------------------------------------------------------

const ASDA_FLOOR_CASES = [["LPVR", "02", 948], ["LPVR", "20", 949], ["LPPM", "11", 861], ["LPPM", "29", 861]];

test("ASDA abaixo do peso mínimo do gráfico: o motivo diz quanto precisam os 4500 kg", async () => {
    for (const [icao, rwy, needs] of ASDA_FLOOR_CASES) {
        const entry = runway(icao, rwy);
        const r = await page.calc({ airport: icao, runway: rwy, wind: tailwind(entry, 10), oat: "40", qnh: "1003", tow: "4500" });
        assert.equal(r.mtow, "out of AFM chart", `${icao} ${rwy}`);
        assert.equal(r.limit, "(ASDA)", `${icao} ${rwy}`);
        assert.equal(r.reason, `MTOW not determined — ASDA: ASDA ${entry.asda} m: MTOW below chart minimum weight (4500 kg needs ${needs} m)`, `${icao} ${rwy}`);
        assert.ok(needs > entry.asda);
    }
});

test("ASDA abaixo do gráfico: não é lacuna de dados (os gráficos de distância acabam nos 4500 kg)", () => {
    for (const [icao, rwy, needs] of ASDA_FLOOR_CASES) {
        const entry = runway(icao, rwy);
        const pa = getPressureAltitude(1003, entry);
        // ASDR no peso mínimo do gráfico, com o vento de cauda de 10 kt: excede a ASDA
        const atMin = ASDR_Flaps1({ PA: pa, OAT: 40, Weight: MIN_WEIGHT, Wind: -10, runway: "DRY" });
        assert.equal(atMin.status, "passed");
        assert.equal(Math.round(atMin.result), needs, `${icao} ${rwy}`);
        // Abaixo dos 4500 kg o gráfico não tem linhas de peso
        assert.equal(ASDR_Flaps1({ PA: pa, OAT: 40, Weight: MIN_WEIGHT - 1, Wind: -10, runway: "DRY" }).status, "failed");
    }
});

test("LPPM 29, OAT 40, cauda 10: QNH 1013/1023 dão 4663/4666 (ASDA); em 1003 a PA sobe 270 ft e passa o mínimo", async () => {
    const entry = runway("LPPM", "29");
    const wind = tailwind(entry, 10);
    for (const [qnh, mtow] of [["1013", "4663 kg"], ["1023", "4666 kg"]]) {
        const r = await page.calc({ airport: "LPPM", runway: "29", wind, oat: "40", qnh, tow: "4500" });
        assert.equal(r.mtow, mtow);
        assert.equal(r.limit, "(ASDA · code 3)");
    }
    // PA 5 ft (QNH 1013) → 848 m a 4500 kg; PA 275 ft (QNH 1003) → 861 m > ASDA 860 m
    assert.equal(getPressureAltitude(1013, entry), 5);
    assert.equal(getPressureAltitude(1003, entry), 275);
    assert.equal(Math.round(ASDR_Flaps1({ PA: 5, OAT: 40, Weight: 4500, Wind: -10, runway: "DRY" }).result), 848);
    assert.equal(Math.round(ASDR_Flaps1({ PA: 275, OAT: 40, Weight: 4500, Wind: -10, runway: "DRY" }).result), 861);
});

// ------------------------------------------------------------------
// PROBLEMA 1b — LPPM 11 com vento de cauda: 2.º segmento com required > 7 %
// ------------------------------------------------------------------

// Condições do varrimento sem MTOW pelo 2.º segmento: [QNH, OAT, cauda kt]
const LPPM11_SEG2_OOC = [
    ...[5, 10, 15, 20, 25, 30, 35].map(oat => ["1003", oat, 10]),
    ...[10, 15, 20, 25, 30, 35, 40].map(oat => ["1013", oat, 10]),
    ...[10, 15, 20, 25, 30, 35, 40].map(oat => ["1023", oat, 10]),
    ...["1003", "1013", "1023"].flatMap(qnh => [[qnh, 35, 5], [qnh, 40, 5]])
];

test("LPPM 11, cauda 5/10 kt: 27 condições sem MTOW pelo 2.º seg, com o obstáculo que exige > 7 % a 4500 kg", async () => {
    const entry = runway("LPPM", "11");
    assert.equal(LPPM11_SEG2_OOC.length, 27);
    for (const [qnh, oat, kt] of LPPM11_SEG2_OOC) {
        const r = await page.calc({ airport: "LPPM", runway: "11", wind: tailwind(entry, kt), oat: String(oat), qnh, tow: "4500" });
        const label = `QNH ${qnh} OAT ${oat} cauda ${kt}`;
        assert.equal(r.mtow, "out of AFM chart", label);
        assert.equal(r.limit, "(2nd seg)", label);
        assert.match(r.reason, /^MTOW not determined — no weight up to \d+ kg meets 2nd seg\. At 4500 kg, 2nd seg: required > 7% \(AFM chart max\) for Elevação natural 164 ft @ 700 m from DER/, label);
    }
});

test("LPPM 11, cauda 10 kt: condições vizinhas continuam com MTOW (code 2)", async () => {
    const entry = runway("LPPM", "11");
    const cases = [["1003", 0, 10], ["1013", 5, 10], ["1023", 5, 10], ["1013", 30, 5], ["1013", 15, 0]];
    for (const [qnh, oat, kt] of cases) {
        const wind = kt === 0 ? "000/00" : tailwind(entry, kt);
        const r = await page.calc({ airport: "LPPM", runway: "11", wind, oat: String(oat), qnh, tow: "4500" });
        assert.match(r.mtow, /^\d+ kg$/, `QNH ${qnh} OAT ${oat} cauda ${kt}: ${r.mtow} ${r.reason}`);
        assert.equal(r.limit, "(2nd seg · code 2)");
    }
});

test("LPPM 11, cauda 10 kt: a 4500 kg o required passa de 7 % e o calculado também (comparação fora do gráfico)", () => {
    const entry = runway("LPPM", "11");
    const pa = getPressureAltitude(1013, entry);
    const ev = evaluateSegments({
        flaps: "1", pa, oat: 15, tow: MIN_WEIGHT, inlet: "off", wind: -10, slope: entry.slope, toda: entry.toda,
        obstacles2Seg: obstacles2Seg(entry), obstacles34Seg: obstacles34Seg(entry)
    });
    assert.equal(ev.SEG2.state, "ooc");
    assert.deepEqual(ev.SEG2.aboveChartObstacles.map(o => o.name), ["Elevação natural", "Edifícios"]);
    // O gráfico do required acaba nos 7 %; o gradiente calculado (8.5 %) também está acima: não há comparação no AFM
    assert.ok(ev.SEG2.gradient > 7, String(ev.SEG2.gradient));
    // Sem obstáculos no 3.º/4.º segmento
    assert.equal(obstacles34Seg(entry).length, 0);
});

// ------------------------------------------------------------------
// PROBLEMA 2 — obstáculos: code 2 por desenho; distância medida do fim da TODA
// ------------------------------------------------------------------

test("LPVZ 36, QNH 1013, OAT 15, vento 0: mastro de 131 ft limita o 2.º seg → 5975 kg (code 2)", async () => {
    const base = { airport: "LPVZ", runway: "36", wind: "000/00", oat: "15", qnh: "1013" };
    const r = await page.calc({ ...base, tow: "5975" });
    assert.equal(r.mtow, "5975 kg");
    assert.equal(r.limit, "(2nd seg · code 2)");
    assert.equal(r.badgeText, "Passed");
    assert.equal(r.tod.trim(), "768 m");
    // 2.º seg: required (mastro a 1142 m do Reference Zero) / calculado
    assert.equal(r.cg2, "3.7% / 3.7%");
    // 3.º/4.º seg sem obstáculos (131 ft ≤ 400 ft): requisito 0, não limitam
    assert.equal(r.cg3, "0m / 1093.1m");
    assert.equal(r.cg4, "0.0% / 3.1%");

    const over = await page.calc({ ...base, tow: "5976" });
    assert.equal(over.badgeText, "Failed");
    assert.equal(over.reason, "TOW above MTOW (limit: 2nd seg)");
});

test("LPVZ 36: o obstáculo é medido a partir do fim da TODA (DER), não da cabeceira", () => {
    const entry = runway("LPVZ", "36");
    const mast = entry.obstacles[0];
    const pa = getPressureAltitude(1013, entry);
    const tod = getTodrForWeight({ flaps: "1", pa, oat: 15, tow: 5975, wind: 0, slope: entry.slope });
    assert.equal(tod, 768);
    // Reference Zero → fim da TODA = TODA - TOD = 392 m; + 750 m do DER ao mastro
    const d = obstacleDistanceFromReferenceZero(mast, tod, entry.toda);
    assert.equal(d, (1160 - 768) + 750);
    assert.equal(d, 1142);
    assert.equal(Gradient_Required2Seg({ obstacleDistance: d, wind: 0, obstacle_height_ft: 131 }).result_CG_required, 3.7);
    // A 6400 kg o TOD é maior (914 m), o mastro fica mais perto (996 m) e exige mais
    const tod6400 = getTodrForWeight({ flaps: "1", pa, oat: 15, tow: 6400, wind: 0, slope: entry.slope });
    assert.equal(obstacleDistanceFromReferenceZero(mast, tod6400, entry.toda), 996);
    assert.equal(Gradient_Required2Seg({ obstacleDistance: 996, wind: 0, obstacle_height_ft: 131 }).result_CG_required, 4.3);
});

test("code 2 só aparece com obstáculos: sem obstáculos nenhum segmento obriga a descer abaixo do WAT", () => {
    // LPPM 11 e LPVZ 36 sem os obstáculos, em toda a grelha do varrimento.
    // Teto = min(WAT, 6400): acima do WAT o 4.º seg pode ficar < 0 % (ex.: 2331 ft, 40 °C, > 6287 kg),
    // mas esse peso nunca chega à procura porque o WAT (5784 kg) limita antes.
    for (const [icao, rwy] of [["LPPM", "11"], ["LPVZ", "36"]]) {
        const entry = runway(icao, rwy);
        for (const qnh of [1003, 1013, 1023]) {
            const pa = getPressureAltitude(qnh, entry);
            for (let oat = -10; oat <= 40; oat += 5) {
                for (const wind of [-10, -5, 0, 10, 20]) {
                    const params = { flaps: "1", pa, oat, inlet: "off", wind, slope: entry.slope, toda: entry.toda, obstacles2Seg: [], obstacles34Seg: [] };
                    const cap = Math.floor(Math.min(6400, getWAT("1", pa, oat, 6400).wat));
                    assert.equal(findMaxTowAllSegments(params, cap).mtow, cap, `${icao} ${rwy} QNH ${qnh} OAT ${oat} vento ${wind}`);
                }
            }
        }
    }
});

test("obstáculos dos dados: todos ≤ 400 ft → só entram no 2.º segmento (code 4 não é atingível com os dados atuais)", () => {
    for (const entry of AIRPORTS) {
        assert.equal(obstacles34Seg(entry).length, 0, `${entry.icao} ${entry.rwy}`);
        assert.equal(obstacles2Seg(entry).length, entry.obstacles.length, `${entry.icao} ${entry.rwy}`);
    }
});
