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
const { getMaxTow3Seg, getMaxTow4Seg } = await import("../js/cgMTOWSearch.js");

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
    assert.throws(() => getPressureAltitude(1013, undefined), /sem dados/);
    assert.throws(() => getPressureAltitude(1013, { ...LPBG_19, elevation: undefined }), /Elevação inválida/);
    assert.throws(() => getPressureAltitude(1013, { ...LPBG_19, elevation: "" }), /Elevação inválida/);
    assert.throws(() => getPressureAltitude(NaN, LPBG_19), /QNH inválido/);
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
    assert.equal(noObs.text, "0m / fora do gráfico do AFM");

    const withObs = describeThirdSegment(seg3(2277, 35, { obstacleDistance: 1500 }), 1500, true);
    assert.equal(withObs.state, "ooc");
    assert.match(withObs.text, /fora do gráfico do AFM/);

    assert.equal(describeThirdSegment(seg3(2277, 30), 0, false).state, "ok");
    assert.equal(describeThirdSegment(seg3(2277, 30, { obstacleDistance: 900 }), 900, true).state, "bad");
});

// ------------------------------------------------------------------
// 3) MTOW por segmento (cgMTOWSearch.js)
// ------------------------------------------------------------------

const base34 = { inlet: "off", wind: 0 };

test("getMaxTow3Seg: sem obstáculos não limita, mesmo fora do gráfico (OAT 35)", () => {
    assert.equal(getMaxTow3Seg({ ...base34, pa: 2277, oat: 35, slope: -1.2, obstacles: [] }), 6500);
});

test("getMaxTow3Seg: com obstáculo e fora do gráfico devolve null (nenhum peso verificável)", () => {
    const obstacles = [{ obstacle_ft: 500, obstacle_dist: 2000 }];
    assert.equal(getMaxTow3Seg({ ...base34, pa: 2277, oat: 35, slope: 0, obstacles }), null);
    // Dentro do gráfico há um MTOW numérico
    const mtow = getMaxTow3Seg({ ...base34, pa: 2277, oat: 15, slope: 0, obstacles });
    assert.equal(typeof mtow, "number");
});

test("getMaxTow4Seg: required a null não é ignorado (antes era tratado como 0)", () => {
    // slope -1.2 está fora da SlopeTable do required 3º/4º seg (0, 1, 2) → required null
    const obstacles = [{ obstacle_ft: 500, obstacle_dist: 2000 }];
    assert.equal(getMaxTow4Seg({ ...base34, pa: 2277, oat: 15, slope: -1.2, obstacles }), null);
});
