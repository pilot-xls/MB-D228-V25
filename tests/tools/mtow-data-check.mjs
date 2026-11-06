// Verificação de integridade dos dados digitalizados dos gráficos do AFM
// (módulos MTOW_* e, para comparação, os módulos "forward" TORR/TODR/ASDR que usam o mesmo gráfico)
//
// Correr na raiz do repositório:
//   node tests/tools/mtow-data-check.mjs           (relatório em texto)
//   node tests/tools/mtow-data-check.mjs --json    (relatório em JSON)
//
// Não altera nenhum ficheiro: lê o código-fonte, extrai os datasets (com o nº de linha de cada
// registo) e lista os registos que violam a convenção que o motor assume:
//   - em cada secção/faixa: Y_Ref_Down > Y_Ref_Up (eixo y cresce para cima no gráfico)
//   - faixas contíguas: Up da secção i = Down da secção i+1 (sem buracos nem sobreposições)
//   - cada peso/vento/slope tem as mesmas secções que a base
//   - monotonia: a mesma linha-guia desce (y menor) quando o peso aumenta, etc. (valores iguais são
//     aceites: resolução da digitalização; só se assinalam inversões)
//   - diferenças face ao módulo forward correspondente (mesmo gráfico do AFM)
//
// ERRO  = o motor rejeita/não consegue usar o registo (ex.: down <= up → "secção inválida")
// AVISO = o motor aceita, mas o valor parece errado (buraco, salto, não monótono, difere do forward)

import { readFileSync } from "node:fs";

const ROOT = new URL("../../", import.meta.url);

export const MODULE_PAIRS = [
    { mtow: "js/mtowTORA_Flaps1.js", forward: "js/torrFlaps1_CSATH.js", kind: "slope" },
    { mtow: "js/mtowTORA_FlapsUp.js", forward: "js/torrFlapsUP_CSATH.js", kind: "slope" },
    { mtow: "js/mtowTODA_Flaps1.js", forward: "js/todrFlaps1_CSATH.js", kind: "slope" },
    { mtow: "js/mtowTODA_FlapsUp.js", forward: "js/todrFlapsUP_CSATH.js", kind: "slope" },
    { mtow: "js/mtowASDA_Flaps1.js", forward: "js/asdrFlaps1_CSATH.js", kind: "runway" },
    { mtow: "js/mtowASDA_FlapsUp.js", forward: "js/asdrFlapsUP_CSATH.js", kind: "runway" }
];

// ------------------------------------------------------------------
// Extração dos datasets do código-fonte (sem executar o módulo)
// ------------------------------------------------------------------

function lineAt(text, index) {
    let n = 1;
    for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) n++;
    return n;
}

// Devolve [{ ...row, __line }] para "const <name> = [ ... ]" ou "{ ... }"
export function extractDataset(src, name) {
    const m = new RegExp("const\\s+" + name + "\\s*=\\s*([\\[{])").exec(src);
    if (!m) return null;
    const open = m[1];
    const close = open === "[" ? "]" : "}";
    const start = m.index + m[0].length - 1;
    let depth = 0;
    let end = -1;
    for (let i = start; i < src.length; i++) {
        const c = src[i];
        if (c === "[" || c === "{") depth++;
        else if (c === "]" || c === "}") {
            depth--;
            if (depth === 0) { end = i; break; }
        }
    }
    if (end < 0 || src[end] !== close) throw new Error(`Não consegui delimitar ${name}`);

    const body = src.slice(start, end + 1);
    const rows = [];
    const re = /\{[^{}]*\}/g;
    let r;
    while ((r = re.exec(body))) {
        // Ignorar comentários de linha dentro do objecto (não existem nos datasets, mas por segurança)
        const literal = r[0].replace(/\/\/[^\n]*/g, "");
        const obj = Function("return (" + literal + ")")();
        obj.__line = lineAt(src, start + r.index);
        rows.push(obj);
    }
    return rows;
}

function loadModule(path, kind) {
    const src = readFileSync(new URL(path, ROOT), "utf8");
    const pick = (...names) => {
        for (const n of names) {
            const d = extractDataset(src, n);
            if (d) return d;
        }
        return null;
    };
    return {
        path,
        pat: pick("pressureAltTemperatureData"),
        refline: pick("reflineWeightData"),
        weight: pick("weightSectionData"),
        wind: pick("windData"),
        // TORA/TODA: slope; ASDA: condição de pista (DRY/WET)
        corr: kind === "slope" ? pick("runwaySlopeData", "slopeData") : pick("runwayConditionData"),
        result: pick("resultData")
    };
}

// ------------------------------------------------------------------
// Verificações
// ------------------------------------------------------------------

const uniq = arr => [...new Set(arr)].sort((a, b) => a - b);
const ref = (path, row) => `${path}:${row.__line}`;

function checkPAT(mod, out) {
    const rows = mod.pat;
    const seen = new Map();
    for (const r of rows) {
        const k = r.Pressure_Altitude + "/" + r.Temperature;
        if (seen.has(k)) out.push({ sev: "ERRO", where: ref(mod.path, r), table: "pressureAltTemperatureData", msg: `registo duplicado PA=${r.Pressure_Altitude} OAT=${r.Temperature} (também na linha ${seen.get(k).__line})` });
        else seen.set(k, r);
    }
    const PAs = uniq(rows.map(r => r.Pressure_Altitude));
    const temps = uniq(rows.map(r => r.Temperature));

    // Envelope (gama de OAT de cada curva de PA) e buracos dentro da curva
    const envelope = [];
    for (const pa of PAs) {
        const line = rows.filter(r => r.Pressure_Altitude === pa).sort((a, b) => a.Temperature - b.Temperature);
        const tMin = line[0].Temperature, tMax = line[line.length - 1].Temperature;
        envelope.push({ PA: pa, OAT_min: tMin, OAT_max: tMax });
        for (const t of temps.filter(t => t > tMin && t < tMax)) {
            if (!line.some(r => r.Temperature === t)) out.push({ sev: "AVISO", where: ref(mod.path, line[0]), table: "pressureAltTemperatureData", msg: `buraco: PA=${pa} não tem OAT=${t} (entre ${tMin} e ${tMax})` });
        }
        // Y_REF1 deve descer quando a OAT sobe
        for (let i = 0; i < line.length - 1; i++) {
            if (line[i + 1].Y_REF1 > line[i].Y_REF1) out.push({ sev: "AVISO", where: ref(mod.path, line[i + 1]), table: "pressureAltTemperatureData", msg: `não monótono em OAT: PA=${pa} OAT ${line[i].Temperature}→${line[i + 1].Temperature}: Y_REF1 ${line[i].Y_REF1}→${line[i + 1].Y_REF1} (esperado a descer)` });
        }
    }
    // Y_REF1 deve descer quando a PA sobe (mesma OAT)
    for (const t of temps) {
        const col = rows.filter(r => r.Temperature === t).sort((a, b) => a.Pressure_Altitude - b.Pressure_Altitude);
        for (let i = 0; i < col.length - 1; i++) {
            if (col[i + 1].Y_REF1 > col[i].Y_REF1) out.push({ sev: "AVISO", where: ref(mod.path, col[i + 1]), table: "pressureAltTemperatureData", msg: `não monótono em PA: OAT=${t} PA ${col[i].Pressure_Altitude}→${col[i + 1].Pressure_Altitude}: Y_REF1 ${col[i].Y_REF1}→${col[i + 1].Y_REF1} (esperado a descer)` });
        }
    }
    return envelope;
}

function checkBands(path, table, rows, downKey, upKey, label, out) {
    for (const r of rows) {
        if (!(r[downKey] > r[upKey])) out.push({ sev: "ERRO", where: ref(path, r), table, msg: `${label(r)}: ${downKey}=${r[downKey]} não é > ${upKey}=${r[upKey]} (o motor lança "secção inválida")` });
    }
    for (let i = 0; i < rows.length - 1; i++) {
        const a = rows[i], b = rows[i + 1];
        if (a[upKey] !== b[downKey]) {
            const kind = a[upKey] > b[downKey] ? "buraco" : "sobreposição";
            out.push({ sev: "AVISO", where: ref(path, b), table, msg: `${kind} entre ${label(a)} (${upKey}=${a[upKey]}) e ${label(b)} (${downKey}=${b[downKey]})` });
        }
    }
}

function checkRefline(mod, out) {
    const rows = [...mod.refline].sort((a, b) => a.sectionNum - b.sectionNum);
    checkBands(mod.path, "reflineWeightData", rows, "Y_Refline_Section_Down", "Y_Refline_Section_Up", r => `secção ${r.sectionNum}`, out);
    return rows.map(r => r.sectionNum);
}

function checkWeight(mod, sections, out) {
    const rows = mod.weight;
    const T = "weightSectionData";
    const weights = uniq(rows.map(r => r.Weight));
    const seen = new Map();
    for (const r of rows) {
        const k = r.Weight + "/" + r.Section;
        if (seen.has(k)) out.push({ sev: "ERRO", where: ref(mod.path, r), table: T, msg: `registo duplicado Weight=${r.Weight} Section=${r.Section} (também na linha ${seen.get(k).__line})` });
        else seen.set(k, r);
    }
    for (const w of weights) {
        const line = rows.filter(r => r.Weight === w).sort((a, b) => a.Section - b.Section);
        const have = line.map(r => r.Section);
        const missing = sections.filter(s => !have.includes(s));
        const extra = have.filter(s => !sections.includes(s));
        if (missing.length) out.push({ sev: "AVISO", where: ref(mod.path, line[0]), table: T, msg: `Weight=${w} não tem a(s) secção(ões) ${missing.join(", ")} (o motor só interpola até ao último peso com essa secção)` });
        if (extra.length) out.push({ sev: "ERRO", where: ref(mod.path, line[0]), table: T, msg: `Weight=${w} tem secção(ões) ${extra.join(", ")} que não existem na refline` });
        checkBands(mod.path, T, line, "Y_Ref_Down", "Y_Ref_Up", r => `Weight=${r.Weight} S${r.Section}`, out);
    }
    // Monotonia: a mesma linha-guia (fronteira) desce quando o peso aumenta
    for (const s of sections) {
        const col = rows.filter(r => r.Section === s).sort((a, b) => a.Weight - b.Weight);
        for (const key of ["Y_Ref_Down", "Y_Ref_Up"]) {
            for (let i = 0; i < col.length - 1; i++) {
                const a = col[i], b = col[i + 1];
                if (b[key] > a[key]) out.push({ sev: "AVISO", where: ref(mod.path, b), table: T, msg: `não monótono: S${s} ${key} Weight ${a.Weight}→${b.Weight}: ${a[key]}→${b[key]} (esperado a descer)` });
            }
        }
    }
    return weights;
}

function checkWind(mod, out) {
    const rows = mod.wind;
    const T = "windData";
    const winds = uniq(rows.map(r => r.Wind));
    // O motor ordena cada vento por Y_Ref_Down desc e alinha as faixas por índice
    const byWind = new Map(winds.map(w => [w, rows.filter(r => r.Wind === w).sort((a, b) => b.Y_Ref_Down - a.Y_Ref_Down)]));
    const base = byWind.get(0) || [];
    for (const w of winds) {
        const line = byWind.get(w);
        if (line.length !== base.length) out.push({ sev: "AVISO", where: ref(mod.path, line[0]), table: T, msg: `Wind=${w} tem ${line.length} faixas, Wind=0 tem ${base.length} (o motor falha com "sectionIndex fora de range" se cair numa faixa em falta)` });
        checkBands(mod.path, T, line, "Y_Ref_Down", "Y_Ref_Up", r => `Wind=${r.Wind} faixa ${line.indexOf(r) + 1}`, out);
    }
    // Monotonia: com mais vento de frente, a mesma linha-guia sobe (y maior)
    const n = Math.max(...[...byWind.values()].map(l => l.length));
    for (let i = 0; i < n - 1; i++) { // a última faixa termina na base do gráfico (Up ~ constante)
        const col = winds.map(w => byWind.get(w)[i]).filter(Boolean);
        for (let j = 0; j < col.length - 1; j++) {
            const a = col[j], b = col[j + 1];
            for (const key of ["Y_Ref_Down", "Y_Ref_Up"]) {
                if (b[key] < a[key]) out.push({ sev: "AVISO", where: ref(mod.path, b), table: T, msg: `não monótono: faixa ${i + 1} ${key} Wind ${a.Wind}→${b.Wind}: ${a[key]}→${b[key]} (esperado a subir)` });
            }
        }
    }
}

function checkCorrection(mod, kind, out) {
    const T = kind === "slope" ? "runwaySlopeData" : "runwayConditionData";
    const groupKey = kind === "slope" ? "Slope" : "Condition";
    const rows = mod.corr;
    const groups = [...new Set(rows.map(r => r[groupKey]))];
    const baseKey = kind === "slope" ? 0 : "DRY";
    const baseSecs = rows.filter(r => r[groupKey] === baseKey).map(r => r.Section).sort((a, b) => a - b);
    for (const g of groups) {
        const line = rows.filter(r => r[groupKey] === g).sort((a, b) => a.Section - b.Section);
        const have = line.map(r => r.Section);
        const missing = baseSecs.filter(s => !have.includes(s));
        if (missing.length) out.push({ sev: "ERRO", where: ref(mod.path, line[0]), table: T, msg: `${groupKey}=${g} não tem a(s) secção(ões) ${missing.join(", ")}` });
        checkBands(mod.path, T, line, "Y_Ref_Down", "Y_Ref_Up", r => `${groupKey}=${r[groupKey]} S${r.Section}`, out);
    }
    if (kind === "slope") {
        // Monotonia: com slope a subir (rampa ascendente), a mesma linha-guia desce (y menor)
        const slopes = uniq(groups);
        for (const s of baseSecs.slice(0, -1)) { // a última faixa termina na base do gráfico
            const col = slopes.map(v => rows.find(r => r.Slope === v && r.Section === s)).filter(Boolean);
            for (let j = 0; j < col.length - 1; j++) {
                const a = col[j], b = col[j + 1];
                for (const key of ["Y_Ref_Down", "Y_Ref_Up"]) {
                    if (b[key] > a[key]) out.push({ sev: "AVISO", where: ref(mod.path, b), table: T, msg: `não monótono: S${s} ${key} Slope ${a.Slope}→${b.Slope}: ${a[key]}→${b[key]} (esperado a descer)` });
                }
            }
        }
    }
}

function distKey(row) {
    return Object.keys(row).find(k => k !== "Y_Ref" && k !== "__line");
}

function checkResult(mod, out) {
    const rows = mod.result;
    const T = "resultData";
    const key = distKey(rows[0]);
    const sorted = [...rows].sort((a, b) => a[key] - b[key]);
    for (let i = 0; i < sorted.length - 1; i++) {
        const a = sorted[i], b = sorted[i + 1];
        if (b.Y_Ref >= a.Y_Ref) out.push({ sev: "ERRO", where: ref(mod.path, b), table: T, msg: `não monótono: ${key} ${a[key]}→${b[key]}: Y_Ref ${a.Y_Ref}→${b.Y_Ref} (esperado a descer)` });
    }
    return { key, min: sorted[0][key], max: sorted[sorted.length - 1][key] };
}

// Diferenças face ao módulo forward (mesmo gráfico do AFM digitalizado à parte)
function compareWithForward(mod, fwd, kind, out) {
    const diffs = [];
    const cmp = (table, a, b, keyFn, fields, labelFn) => {
        const mapB = new Map(b.map(r => [keyFn(r), r]));
        const mapA = new Map(a.map(r => [keyFn(r), r]));
        for (const r of a) {
            const o = mapB.get(keyFn(r));
            if (!o) { diffs.push({ table, where: ref(mod.path, r), msg: `${labelFn(r)}: não existe no forward (${fwd.path})` }); continue; }
            const changed = fields.filter(f => r[f] !== o[f]);
            if (changed.length) diffs.push({ table, where: ref(mod.path, r), fwd: ref(fwd.path, o), msg: `${labelFn(r)}: ` + changed.map(f => `${f} MTOW=${r[f]} / forward=${o[f]}`).join(", ") });
        }
        for (const o of b) {
            if (!mapA.has(keyFn(o))) diffs.push({ table, where: ref(fwd.path, o), msg: `${labelFn(o)}: existe no forward mas não no MTOW` });
        }
    };
    cmp("pressureAltTemperatureData", mod.pat, fwd.pat, r => r.Pressure_Altitude + "/" + r.Temperature, ["Y_REF1"], r => `PA=${r.Pressure_Altitude} OAT=${r.Temperature}`);
    cmp("reflineWeightData", mod.refline, fwd.refline, r => r.sectionNum, ["Y_Refline_Section_Down", "Y_Refline_Section_Up"], r => `secção ${r.sectionNum}`);
    cmp("weightSectionData", mod.weight, fwd.weight, r => r.Weight + "/" + r.Section, ["Y_Ref_Down", "Y_Ref_Up"], r => `Weight=${r.Weight} S${r.Section}`);
    const windIdx = rows => {
        const out = [];
        for (const w of uniq(rows.map(r => r.Wind))) rows.filter(r => r.Wind === w).sort((a, b) => b.Y_Ref_Down - a.Y_Ref_Down).forEach((r, i) => out.push({ ...r, __i: i + 1 }));
        return out;
    };
    cmp("windData", windIdx(mod.wind), windIdx(fwd.wind), r => r.Wind + "/" + r.__i, ["Y_Ref_Down", "Y_Ref_Up"], r => `Wind=${r.Wind} faixa ${r.__i}`);
    const gk = kind === "slope" ? "Slope" : "Condition";
    cmp(kind === "slope" ? "runwaySlopeData" : "runwayConditionData", mod.corr, fwd.corr, r => r[gk] + "/" + r.Section, ["Y_Ref_Down", "Y_Ref_Up"], r => `${gk}=${r[gk]} S${r.Section}`);
    const kA = distKey(mod.result[0]), kB = distKey(fwd.result[0]);
    cmp("resultData", mod.result.map(r => ({ ...r, __d: r[kA] })), fwd.result.map(r => ({ ...r, __d: r[kB] })), r => r.__d, ["Y_Ref"], r => `${kA}=${r.__d}`);
    out.push(...diffs.map(d => ({ sev: "AVISO", where: d.where, table: d.table, msg: "difere do forward: " + d.msg + (d.fwd ? ` (forward em ${d.fwd})` : "") })));
    return diffs.length;
}

export function checkAll() {
    const report = [];
    for (const pair of MODULE_PAIRS) {
        const mod = loadModule(pair.mtow, pair.kind);
        const fwd = loadModule(pair.forward, pair.kind);
        const issues = [];
        const envelope = checkPAT(mod, issues);
        const sections = checkRefline(mod, issues);
        const weights = checkWeight(mod, sections, issues);
        checkWind(mod, issues);
        checkCorrection(mod, pair.kind, issues);
        const result = checkResult(mod, issues);

        // As mesmas verificações no forward, só para saber se o forward tem os mesmos problemas
        const fwdIssues = [];
        checkPAT(fwd, fwdIssues);
        checkWeight(fwd, checkRefline(fwd, fwdIssues), fwdIssues);
        checkWind(fwd, fwdIssues);
        checkCorrection(fwd, pair.kind, fwdIssues);
        checkResult(fwd, fwdIssues);

        const diffIssues = [];
        compareWithForward(mod, fwd, pair.kind, diffIssues);

        report.push({ module: pair.mtow, forward: pair.forward, envelope, sections, weights, result, issues, diffIssues, forwardIssues: fwdIssues });
    }
    return report;
}

function printReport(report) {
    for (const r of report) {
        const err = r.issues.filter(i => i.sev === "ERRO").length;
        const warn = r.issues.filter(i => i.sev === "AVISO").length;
        console.log(`\n=== ${r.module}  (${err} erro(s), ${warn} aviso(s); ${r.diffIssues.length} diferença(s) face a ${r.forward})`);
        console.log(`    pesos ${r.weights[0]}..${r.weights[r.weights.length - 1]} kg · secções refline ${r.sections.join(",")} · ${r.result.key} ${r.result.min}..${r.result.max} m`);
        console.log(`    envelope PA/OAT: ` + r.envelope.map(e => `${e.PA}ft:${e.OAT_min}..${e.OAT_max}`).join("  "));
        for (const i of r.issues) console.log(`  ${i.sev.padEnd(5)} ${i.where}  [${i.table}] ${i.msg}`);
        if (r.diffIssues.length) {
            console.log(`  -- diferenças face ao forward --`);
            for (const i of r.diffIssues) console.log(`  ${i.sev.padEnd(5)} ${i.where}  [${i.table}] ${i.msg}`);
        }
        if (r.forwardIssues.length) {
            console.log(`  -- problemas no próprio forward (${r.forward}) --`);
            for (const i of r.forwardIssues) console.log(`  ${i.sev.padEnd(5)} ${i.where}  [${i.table}] ${i.msg}`);
        }
    }
}

const isMain = import.meta.url === new URL(process.argv[1], "file://").href;
if (isMain) {
    const report = checkAll();
    if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
    else printReport(report);
}
