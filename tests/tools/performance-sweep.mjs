// Varrimento da página Performance (o js/performance.js real, num DOM mínimo)
//
// Para cada pista dos aeroportos pedidos corre a grelha
//   QNH {1003, 1013, 1023} × OAT -10..40 (passo 5) × vento {calmo, frente 10, cauda 5, cauda 10, frente 20}
// (330 condições por aeroporto de 2 pistas), conta os códigos do fator limitante e lista as
// condições sem MTOW, com o motivo que a página mostra.
//
// Correr na raiz do repositório:
//   node tests/tools/performance-sweep.mjs LPPM LPVZ          (flaps 1, inlets OFF, piso seco)
//   node tests/tools/performance-sweep.mjs LPPM --flaps up --inlets on --surface wet
//   node tests/tools/performance-sweep.mjs                    (todos os aeroportos)

import { readFileSync } from "node:fs";
import { loadPerformancePage } from "../helpers/performanceDom.mjs";

const argv = process.argv.slice(2);
const argValue = (name, def) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : def; };
const optionValues = new Set(["--flaps", "--inlets", "--surface"].flatMap(o => { const i = argv.indexOf(o); return i >= 0 ? [argv[i + 1]] : []; }));
const icaosArg = argv.filter(a => !a.startsWith("--") && !optionValues.has(a));

const flaps = argValue("--flaps", "1");
const inlets = argValue("--inlets", "off");
const surface = argValue("--surface", "dry");

const QNHS = ["1003", "1013", "1023"];
const OATS = [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40];

const pad3 = n => String(((n % 360) + 360) % 360).padStart(3, "0");

/**
 * Ventos (direção/velocidade) para uma pista: frente pelo heading, cauda pelo recíproco.
 */
export function sweepWinds(heading) {
    return {
        "calm": "000/00",
        "HW10": pad3(heading) + "/10",
        "TW5": pad3(heading + 180) + "/05",
        "TW10": pad3(heading + 180) + "/10",
        "HW20": pad3(heading) + "/20"
    };
}

/**
 * Corre a grelha numa pista. Devolve { codes: { "2": n, ... }, failures: [{ qnh, oat, wind, mtow, limit, reason }] }.
 */
export async function sweepRunway(page, entry, opts = {}) {
    const codes = {};
    const failures = [];
    for (const qnh of QNHS) {
        for (const oat of OATS) {
            for (const [windName, wind] of Object.entries(sweepWinds(entry.heading))) {
                const r = await page.calc({
                    airport: entry.icao, runway: entry.rwy, wind, oat: String(oat), qnh, tow: "5000",
                    flaps: opts.flaps || "1", inlets: opts.inlets || "off", surface: opts.surface || "dry"
                });
                const m = r.limit && r.limit.match(/code (\d+)/);
                const key = m ? m[1] : r.mtow;
                codes[key] = (codes[key] || 0) + 1;
                if (!m) failures.push({ qnh, oat, wind: windName, mtow: r.mtow, limit: r.limit, reason: r.reason });
            }
        }
    }
    return { codes, failures };
}

const isMain = import.meta.url === new URL(process.argv[1], "file://").href;
if (isMain) {
    console.warn = () => {};
    const t0 = Date.now();
    const airports = JSON.parse(readFileSync(new URL("../../data/airportsList.json", import.meta.url), "utf8"));
    const icaos = icaosArg.length > 0 ? icaosArg : [...new Set(airports.map(a => a.icao))];
    const page = await loadPerformancePage();
    console.log(`Flaps ${flaps} · inlets ${inlets.toUpperCase()} · ${surface}`);
    for (const icao of icaos) {
        for (const entry of airports.filter(a => a.icao === icao)) {
            const { codes, failures } = await sweepRunway(page, entry, { flaps, inlets, surface });
            const obstacles = entry.obstacles.length ? ` · obstáculos: ${entry.obstacles.map(o => `${o.obstacle_ft} ft @ ${o.obstacle_dist} m`).join(", ")}` : "";
            console.log(`\n${icao} ${entry.rwy} (elev ${entry.elevation} ft, TORA/TODA/ASDA ${entry.tora}/${entry.toda}/${entry.asda} m, slope ${entry.slope} %${obstacles})`);
            console.log("  códigos: " + Object.entries(codes).map(([k, n]) => (/^\d+$/.test(k) ? "code " + k : k) + ": " + n).join(" · "));
            for (const f of failures) {
                console.log(`  QNH ${f.qnh} OAT ${String(f.oat).padStart(3)} ${f.wind.padEnd(4)} → ${f.mtow} ${f.limit} | ${f.reason}`);
            }
        }
    }
    console.log(`\n(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
}
