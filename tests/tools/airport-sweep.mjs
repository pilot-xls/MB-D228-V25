// Varrimento da página Performance por aeroporto (corre o js/performance.js real, como o botão Calc)
//
// Grelha por pista (165 condições; 330 por aeroporto com 2 pistas):
//   QNH {1003, 1013, 1023} × OAT -10..40 ºC (passo 5) × vento {cauda 10, cauda 5, 0, frente 10, frente 20}
//   flaps 1, inlets OFF, TOW 5000 kg (só conta para o selo), DRY e WET
//
// Correr na raiz do repositório:
//   node tests/tools/airport-sweep.mjs LPVR LPPM LPVZ          (resumo por pista/piso + casos sem MTOW numérico)
//   node tests/tools/airport-sweep.mjs LPPM --full             (todas as células)
//   node tests/tools/airport-sweep.mjs LPPM --surface wet --tow 5500 --flaps up --inlets on

import { readFileSync } from "node:fs";
import { loadPerformancePage } from "../helpers/performanceDom.mjs";

export const SWEEP_GRID = {
    qnh: [1003, 1013, 1023],
    oat: [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40],
    // componente de vento (kt): negativo = cauda
    wind: [-10, -5, 0, 10, 20]
};

const AIRPORTS = JSON.parse(readFileSync(new URL("../../data/airportsList.json", import.meta.url), "utf8"));

// Vento "ddd/ss" com a componente pedida (cauda = de trás da pista)
export function windString(heading, component) {
    const dir = component >= 0 ? heading : heading + 180;
    const ddd = ((dir % 360) + 360) % 360 || 360;
    return String(ddd).padStart(3, "0") + "/" + String(Math.abs(component)).padStart(2, "0");
}

// Código do limitante a partir do texto da página: "(2nd seg · code 2)" → "2"; sem código → texto do MTOW
function codeOf(row) {
    const m = /code (\d+)/.exec(row.limit || "");
    return m ? m[1] : row.mtow;
}

/**
 * Corre a grelha para as pistas pedidas. Devolve [{ icao, rwy, surface, rows: [{ qnh, oat, wind, mtow, limit, badge, reason }] }]
 * page: página já carregada (loadPerformancePage), para reutilizar entre chamadas.
 */
export async function runAirportSweep({ icaos, runways = null, surfaces = ["dry", "wet"], tow = 5000, flaps = "1", inlets = "off", grid = SWEEP_GRID, page = null }) {
    page = page || await loadPerformancePage();
    const out = [];
    for (const icao of icaos) {
        for (const surface of surfaces) {
            for (const entry of AIRPORTS.filter(a => a.icao === icao && (!runways || runways.includes(a.rwy)))) {
                const rows = [];
                for (const qnh of grid.qnh) for (const oat of grid.oat) for (const wind of grid.wind) {
                    const r = await page.calc({
                        airport: icao, runway: entry.rwy, wind: windString(entry.heading, wind), surface,
                        oat: String(oat), qnh: String(qnh), tow: String(tow), flaps, inlets
                    });
                    rows.push({ qnh, oat, wind, mtow: r.mtow, limit: r.limit, badge: r.badgeText, reason: r.reason });
                }
                out.push({ icao, rwy: entry.rwy, surface, rows });
            }
        }
    }
    return out;
}

// Resumo: contagem por código do limitante e células sem MTOW numérico
export function summarize(rows) {
    const codes = {};
    for (const r of rows) codes[codeOf(r)] = (codes[codeOf(r)] || 0) + 1;
    return { total: rows.length, codes, notNumeric: rows.filter(r => !/^\d+ kg$/.test(r.mtow)) };
}

const isMain = import.meta.url === new URL(process.argv[1], "file://").href;
if (isMain) {
    console.warn = () => {};
    console.error = () => {};
    const argv = process.argv.slice(2);
    const opt = name => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
    const optValues = new Set(["--surface", "--tow", "--flaps", "--inlets"].map(opt).filter(Boolean));
    const icaos = argv.filter(a => !a.startsWith("--") && !optValues.has(a));
    if (icaos.length === 0) {
        console.log("Uso: node tests/tools/airport-sweep.mjs <ICAO> [<ICAO> ...] [--full] [--surface dry|wet] [--tow 5000] [--flaps 1|up] [--inlets off|on]");
        process.exit(1);
    }
    const t0 = Date.now();
    const report = await runAirportSweep({
        icaos,
        surfaces: opt("--surface") ? [opt("--surface")] : ["dry", "wet"],
        tow: Number(opt("--tow") || 5000),
        flaps: opt("--flaps") || "1",
        inlets: opt("--inlets") || "off"
    });
    for (const { icao, rwy, surface, rows } of report) {
        const s = summarize(rows);
        console.log(`\n=== ${icao} ${rwy} ${surface.toUpperCase()}: ${s.total} condições · por código ${JSON.stringify(s.codes)} · sem MTOW numérico ${s.notNumeric.length}`);
        const list = argv.includes("--full") ? rows : s.notNumeric;
        for (const r of list) {
            console.log(`  QNH ${r.qnh} OAT ${String(r.oat).padStart(3)} vento ${String(r.wind).padStart(3)}: ${r.mtow} ${r.limit} · ${r.badge}${r.reason ? " — " + r.reason : ""}`);
        }
    }
    console.log(`\n(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
}
