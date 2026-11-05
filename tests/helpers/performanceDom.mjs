// DOM mínimo para correr o js/performance.js real em Node (sem browser).
//
// Cria um elemento falso para cada id de performance.html, simula localStorage, fetch,
// ensureSettingsData (dataLoader.js) e alert, executa o DOMContentLoaded da página e
// devolve calc(inputs), que preenche o formulário e carrega no botão Calc.
//
// Uso:
//   const page = await loadPerformancePage();
//   const r = await page.calc({ airport: "LPBG", runway: "01", wind: "190/10", oat: "35",
//                               qnh: "1003", tow: "6100", flaps: "1", inlets: "off" });
//   r.mtow, r.limit, r.badgeText, r.badgeOk, r.reason, r.alerts ...

import { readFileSync } from "node:fs";

const ROOT = new URL("../../", import.meta.url);

function makeClassList() {
    const set = new Set();
    return {
        add: (...c) => c.forEach(x => set.add(x)),
        remove: (...c) => c.forEach(x => set.delete(x)),
        contains: c => set.has(c),
        toggle: (c, force) => {
            const on = force === undefined ? !set.has(c) : !!force;
            if (on) set.add(c); else set.delete(c);
            return on;
        },
        toString: () => [...set].join(" ")
    };
}

function makeElement(id = "") {
    const listeners = {};
    return {
        id,
        value: "",
        textContent: "",
        innerHTML: "",
        title: "",
        disabled: false,
        hidden: false,
        style: {},
        dataset: {},
        children: [],
        classList: makeClassList(),
        listeners,
        addEventListener(type, fn) {
            (listeners[type] ||= []).push(fn);
        },
        appendChild(child) {
            this.children.push(child);
            return child;
        },
        setAttribute(name, value) {
            this[name] = String(value);
        },
        getBoundingClientRect: () => ({ left: 500 })
    };
}

/**
 * Carrega a página Performance num DOM falso.
 * opts.aircraftId: aeronave default (por defeito CS-ATH, série 212)
 * opts.aircraftOverride: campos a sobrepor na aeronave (ex.: { MTOW: undefined })
 */
export async function loadPerformancePage(opts = {}) {
    const html = readFileSync(new URL("performance.html", ROOT), "utf8");
    const ids = [...html.matchAll(/\sid="([^"]*)"/g)].map(m => m[1]);

    const elements = new Map(ids.map(id => [id, makeElement(id)]));
    const wrap = makeElement("wrap");
    const domListeners = {};
    const alerts = [];

    const document = {
        getElementById: id => elements.get(id) || null,
        querySelector: sel => (sel === ".wrap" ? wrap : null),
        querySelectorAll: () => [],
        createElement: () => makeElement(),
        addEventListener(type, fn) {
            (domListeners[type] ||= []).push(fn);
        }
    };

    const store = new Map();
    const localStorage = {
        getItem: k => (store.has(k) ? store.get(k) : null),
        setItem: (k, v) => store.set(k, String(v)),
        removeItem: k => store.delete(k),
        clear: () => store.clear()
    };

    const fetch = async path => {
        const text = readFileSync(new URL(path, ROOT), "utf8");
        return { json: async () => JSON.parse(text) };
    };

    const aircraftJson = JSON.parse(readFileSync(new URL("data/aircraft.json", ROOT), "utf8"));
    const aircraftId = opts.aircraftId || "CS-ATH";
    const aircraftData = structuredClone(aircraftJson.aircraft);
    if (opts.aircraftOverride) {
        Object.assign(aircraftData[aircraftId], opts.aircraftOverride);
        for (const [k, v] of Object.entries(opts.aircraftOverride)) {
            if (v === undefined) delete aircraftData[aircraftId][k];
        }
    }
    const ensureSettingsData = async () => ({ aircraftData, defaultId: aircraftId });
    const alert = msg => alerts.push(String(msg));

    // performance.js usa os globais do browser: cada página repõe os seus antes de correr
    const useGlobals = () => Object.assign(globalThis, { document, localStorage, fetch, ensureSettingsData, alert });
    useGlobals();

    // Query string única: cada página carregada recebe uma instância nova do módulo
    const url = new URL("js/performance.js", ROOT);
    url.search = "?t=" + Math.random();
    const mod = await import(url.href);

    for (const fn of domListeners.DOMContentLoaded || []) {
        await fn();
    }

    const el = id => elements.get(id);

    async function calc(inputs) {
        useGlobals();
        alerts.length = 0;
        const defaults = { surface: "dry", flaps: "1", inlets: "off" };
        for (const [k, v] of Object.entries({ ...defaults, ...inputs })) {
            el(k).value = String(v);
        }
        for (const fn of el("calc-btn").listeners.click || []) {
            await fn();
        }
        return {
            mtow: el("outMTOW").textContent,
            limit: el("outMTOWLimit")?.textContent ?? null,
            badgeText: el("cgText").textContent,
            badgeOk: el("cgBadge").classList.contains("ok"),
            reason: el("cgReason")?.textContent ?? null,
            tod: el("outTakeoffDistance").textContent,
            cg2: el("ttCg2").textContent,
            cg3: el("ttCg3").textContent,
            cg4: el("ttCg4").textContent,
            alerts: [...alerts]
        };
    }

    return { calc, el, alerts, module: mod };
}
