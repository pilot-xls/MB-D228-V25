// performanceDiagram.js
// Desenhos SVG da página Performance: planta (pista + WDI + vento) e perfil lateral
// (obstáculos + flight path com 2º, 3º e 4º segmentos). Os desenhos ficam escondidos
// até o utilizador os abrir (botão no cabeçalho do cartão) e adaptam-se à largura do ecrã.

const NS = "http://www.w3.org/2000/svg";
const REF_HEIGHT_FT = 35; // altura do Reference Zero (fim do TOD)
const SEG2_END_FT = 400; // o 2º segmento acaba aos 400 ft; segue-se o 3º (nivelado)
const FT_PER_M = 3.28084;
const STORAGE_KEY = "perfDiagramOpen";

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const f1 = v => v.toFixed(1);

/** Parse "270/15" → { dir, speed } ou null. */
export function parseWind(raw) {
  const [d, s] = String(raw || "").split("/");
  const dir = parseInt(d, 10);
  const speed = parseInt(s, 10);
  return Number.isFinite(dir) && Number.isFinite(speed) ? { dir, speed } : null;
}

/** Componentes de vento (kt) em relação ao heading da pista. head<0 = tailwind; cross>0 = da direita. */
export function windComponents(wind, heading) {
  const rad = ((wind.dir - heading) * Math.PI) / 180;
  return { head: wind.speed * Math.cos(rad), cross: wind.speed * Math.sin(rad) };
}

/**
 * Trajetória (flight path) em segmentos, com x em metros desde o início da pista:
 *  - 2º segmento: sobe com g2 (%) do Reference Zero (35 ft) até 400 ft
 *  - 3º segmento: nivelado a 400 ft durante d3 m (distância do gráfico do AFM), logo a seguir ao 2º segmento
 *  - 4º segmento: sobe com g4 (%) a partir daí
 * Devolve null se não houver dados para a desenhar.
 */
export function buildFlightPath({ todr, tor, g2, d3, g4 }) {
  if (!Number.isFinite(todr) || !Number.isFinite(g2) || g2 <= 0) return null;
  const x400 = todr + ((SEG2_END_FT - REF_HEIGHT_FT) / (g2 / 100)) / FT_PER_M;
  const xLevelEnd = Number.isFinite(d3) && d3 > 0 ? x400 + d3 : x400;
  const g4eff = Number.isFinite(g4) && g4 > 0 ? g4 : g2;
  const torOk = Number.isFinite(tor) && tor > 0 && tor < todr;
  const path_torOk = torOk;
  const heightAt = x => {
    if (path_torOk && x >= tor && x < todr) return (REF_HEIGHT_FT * (x - tor)) / (todr - tor);
    if (x < todr) return null;
    if (x <= x400) return REF_HEIGHT_FT + (g2 / 100) * (x - todr) * FT_PER_M;
    if (x <= xLevelEnd) return SEG2_END_FT;
    return SEG2_END_FT + (g4eff / 100) * (x - xLevelEnd) * FT_PER_M;
  };
  return { todr, tor: torOk ? tor : null, x400, xLevelEnd, g2, g4: g4eff, hasLevel: xLevelEnd > x400, heightAt };
}

/** PLANTA: pista horizontal (descolagem para a direita), setas de vento e WDI, tudo relativo ao heading. */
export function buildTopViewSvg({ rwy, heading, tora, toda, wind, width = 640 }) {
  const W = width, H = 222;
  const rx = 12, ry = 92, rh = 42;
  const rw0 = W - 24;
  const clearway = Math.max(0, toda - tora);
  const cwW = clearway > 0 ? clamp((clearway / (tora + clearway)) * rw0, 10, 45) : 0;
  const rw = rw0 - cwW;

  // Direção para onde o ar se move, no sistema do desenho (x = descolagem, y = para baixo = direita da pista)
  const toRad = ((wind.dir - heading + 180) * Math.PI) / 180;
  const vx = Math.cos(toRad), vy = Math.sin(toRad);

  const arrowLen = 26 + Math.min(wind.speed, 40) * 0.9;
  const arrows = [0.14, 0.4, 0.66].map((fx, i) => {
    const cx = W * fx, cy = 48 + (i % 2) * 12;
    return `<line x1="${f1(cx - (vx * arrowLen) / 2)}" y1="${f1(cy - (vy * arrowLen) / 2)}" x2="${f1(cx + (vx * arrowLen) / 2)}" y2="${f1(cy + (vy * arrowLen) / 2)}" class="dg-wind" marker-end="url(#dgArrow)"/>`;
  }).join("");

  // WDI numa zona livre por baixo da pista; com pouco vento a manga cai
  const px = W - 70, py = 182;
  const sockLen = 22 + Math.min(wind.speed, 30) * 0.9;
  const droop = Math.max(0, 1 - wind.speed / 15) * 14;
  const sx = px + vx * sockLen, sy = py + vy * sockLen + droop;
  const nx = -vy, ny = vx;
  const at = (t, w) => `${f1(px + (sx - px) * t + nx * w)},${f1(py + (sy - py) * t + ny * w)}`;
  const sock = `${at(0, 9)} ${at(1, 4)} ${at(1, -4)} ${at(0, -9)}`;
  const stripe = t => `<line x1="${at(t, 7).split(",")[0]}" y1="${at(t, 7).split(",")[1]}" x2="${at(t, -7).split(",")[0]}" y2="${at(t, -7).split(",")[1]}" class="dg-stripe"/>`;

  return `<svg xmlns="${NS}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Runway top view with wind">
  <defs><marker id="dgArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="dg-wind-fill"/></marker></defs>
  <text x="12" y="20" class="dg-title">Top view</text>
  <text x="${W - 12}" y="20" class="dg-title" text-anchor="end">Wind ${String(wind.dir).padStart(3, "0")}/${wind.speed}</text>
  ${arrows}
  <rect x="${rx}" y="${ry}" width="${f1(rw)}" height="${rh}" class="dg-rwy"/>
  ${cwW > 0 ? `<rect x="${f1(rx + rw)}" y="${ry + 8}" width="${f1(cwW)}" height="${rh - 16}" class="dg-clearway"/>` : ""}
  <line x1="${rx + 40}" y1="${ry + rh / 2}" x2="${f1(rx + rw - 14)}" y2="${ry + rh / 2}" class="dg-centre"/>
  <text x="${rx + 8}" y="${ry + rh / 2 + 6}" class="dg-rwy-num">${esc(rwy)}</text>
  <path d="M${f1(rx + rw - 70)} ${ry - 10} h54 m-8 -6 l8 6 l-8 6" class="dg-toarrow"/>
  <text x="${f1(rx + rw - 70)}" y="${ry - 20}" class="dg-small">Take-off</text>
  <line x1="${px}" y1="${py + 26}" x2="${px}" y2="${py}" class="dg-pole"/>
  <polygon points="${sock}" class="dg-sock"/>
  ${stripe(0.4)}${stripe(0.72)}
  <text x="${px + 10}" y="${py + 30}" class="dg-small">WDI</text>
</svg>`;
}

export function topInfoHtml({ rwy, heading, tora, toda, slope, wind }) {
  const comp = windComponents(wind, heading);
  const tail = comp.head < -0.5;
  const headTxt = tail ? `Tailwind ${Math.round(-comp.head)} kt` : `Headwind ${Math.round(comp.head)} kt`;
  const crossTxt = `Crosswind ${Math.round(Math.abs(comp.cross))} kt ${comp.cross >= 0 ? "(R)" : "(L)"}`;
  return `<div class="dg-info"><strong class="${tail ? "bad" : ""}">${headTxt} · ${crossTxt}</strong>
  <div>RWY ${esc(rwy)} (${String(heading).padStart(3, "0")}°) · TORA ${tora} m · TODA ${toda} m · slope ${slope > 0 ? "+" : ""}${slope}%</div></div>`;
}

/** Silhueta do obstáculo: antena (mastro, torre, chaminé…) ou monte (tudo o resto). */
export function obstacleKind(name) {
  const n = String(name || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return /torre|antena|mast|tower|chamine|chimney|pilar|poste|cabo/.test(n) ? "tower" : "hill";
}

/** Silhueta do obstáculo, com o topo em (x0, y0) e a base a y0 + hPx. */
function obstacleShape(kind, x0, y0, hPx) {
  const base = y0 + hPx;
  if (kind === "tower") {
    return `<rect x="${f1(x0 - 2.5)}" y="${f1(y0)}" width="5" height="${f1(hPx)}" class="dg-shape"/>
      <polygon points="${f1(x0 - 9)},${f1(base)} ${f1(x0 + 9)},${f1(base)} ${f1(x0)},${f1(y0 + hPx * 0.5)}" class="dg-shape"/>
      <circle cx="${f1(x0)}" cy="${f1(y0)}" r="3" class="dg-shape"/>`;
  }
  const hw = clamp(hPx * 1.1, 16, 34);
  return `<polygon points="${f1(x0 - hw)},${f1(base)} ${f1(x0 - hw * 0.35)},${f1(y0 + hPx * 0.2)} ${f1(x0)},${f1(y0)} ${f1(x0 + hw * 0.4)},${f1(y0 + hPx * 0.25)} ${f1(x0 + hw)},${f1(base)}" class="dg-shape"/>`;
}

/** PERFIL LATERAL: pista, obstáculos e flight path (2º/3º/4º segmento). obstacle_dist é medida a partir do fim da TODA. */
export function buildSideViewSvg({ tora, toda, todr, tor, obstacles, g2, d3, g4, width = 640 }) {
  const W = width, H = 262;
  const padL = 34, padR = 12, top = 30, base = 190;
  const path = buildFlightPath({ todr, tor, g2, d3, g4 });
  const farthest = obstacles.reduce((m, o) => Math.max(m, toda + o.obstacle_dist), 0);
  const maxObs = obstacles.reduce((m, o) => Math.max(m, o.obstacle_ft), 0);
  const maxX = Math.max(toda + 600, farthest + 300, path ? path.xLevelEnd + 400 : 0);
  const maxH = Math.max(500, maxObs * 1.15);
  const sx = x => padL + (x / maxX) * (W - padL - padR);
  const sy = h => base - (h / maxH) * (base - top);

  // Trajetória em troços (cada um com a sua cor): rolagem, rotação até 35 ft, 2º, 3º e 4º segmento
  let pathSvg = "";
  if (path) {
    const P = (x, h) => `${f1(sx(x))},${f1(sy(Math.min(h, maxH)))}`;
    const line = (cls, pts) => `<polyline points="${pts.join(" ")}" class="dg-path ${cls}"/>`;
    const hEnd = path.heightAt(maxX);
    const end4 = hEnd > maxH ? [path.xLevelEnd + ((maxH - SEG2_END_FT) / (path.g4 / 100)) / FT_PER_M, maxH] : [maxX, hEnd];
    if (path.tor != null) {
      pathSvg += line("dg-roll", [P(0, 0), P(path.tor, 0)]);
      pathSvg += line("dg-lift", [P(path.tor, 0), P(path.todr, REF_HEIGHT_FT)]);
    }
    pathSvg += line("dg-s2", [P(path.todr, REF_HEIGHT_FT), P(path.x400, SEG2_END_FT)]);
    if (path.hasLevel) pathSvg += line("dg-s3", [P(path.x400, SEG2_END_FT), P(path.xLevelEnd, SEG2_END_FT)]);
    pathSvg += line("dg-s4", [P(path.hasLevel ? path.xLevelEnd : path.x400, SEG2_END_FT), P(end4[0], end4[1])]);
    // Pontos de referência: lift-off, Reference Zero (35 ft) e fim do 2º segmento (400 ft)
    const dot = (x, h) => `<circle cx="${f1(sx(x))}" cy="${f1(sy(h))}" r="3.5" class="dg-dot"/>`;
    if (path.tor != null) pathSvg += dot(path.tor, 0);
    pathSvg += dot(path.todr, REF_HEIGHT_FT) + dot(path.x400, SEG2_END_FT);
  }

  // Marcadores dos segmentos (2/3/4) junto à trajetória
  let segLabels = "";
  if (path) {
    const lab = (x, h, t) => `<text x="${f1(sx(x))}" y="${f1(sy(h) - 9)}" text-anchor="middle" class="dg-seg dg-halo dg-seg-${t}">${t}</text>`;
    segLabels += lab(path.todr + (path.x400 - path.todr) * 0.78, REF_HEIGHT_FT + (SEG2_END_FT - REF_HEIGHT_FT) * 0.78 - 4, "2nd");
    if (path.hasLevel) {
      const t3 = "3rd";
      const x3 = sx(path.x400) + 12;
      const over = x3 + t3.length * 7.4 > W - 6;
      segLabels += `<text x="${f1(over ? W - 6 : x3)}" y="${f1(sy(SEG2_END_FT) - 9)}" text-anchor="${over ? "end" : "start"}" class="dg-seg dg-halo dg-seg-3rd">${t3}</text>`;
    }
    const x4 = Math.min(path.xLevelEnd + (maxX - path.xLevelEnd) * 0.55, maxX);
    const h4 = path.heightAt(x4);
    if (h4 <= maxH * 0.95 && sx(x4) < W - 30) segLabels += lab(x4, h4, "4th");
    segLabels += `<text x="${f1(sx(path.x400) - 10)}" y="${f1(sy(SEG2_END_FT) - 6)}" text-anchor="end" class="dg-axis dg-halo">${SEG2_END_FT} ft</text>`;
  }

  // Obstáculos como silhuetas (casa, árvore, colina, torre) com a margem vertical à flight path
  let anyBad = false;
  const boxes = [];
  const obs = obstacles.map(o => {
    const x = toda + o.obstacle_dist;
    const h = path ? path.heightAt(x) : null;
    const margin = h == null ? null : h - o.obstacle_ft;
    const bad = margin != null && margin < 0;
    if (bad) anyBad = true;
    const cls = margin == null ? "dg-obs" : bad ? "dg-obs bad" : "dg-obs ok";
    const x0 = sx(x), y0 = sy(o.obstacle_ft);
    const hPx = Math.max(base - y0, 6);
    const kind = obstacleKind(o.name);
    const shape = obstacleShape(kind, x0, y0, hPx);
    const title = `${o.name || "obstacle"}: ${o.obstacle_ft} ft, ${o.obstacle_dist} m after TODA${margin == null ? "" : `, margin ${margin >= 0 ? "+" : ""}${Math.round(margin)} ft`}`;

    // Linha de margem: do topo do obstáculo até à trajetória
    let clear = "", labelY = y0;
    if (h != null) {
      const yp = sy(Math.min(h, maxH));
      clear = `<line x1="${f1(x0)}" y1="${f1(y0)}" x2="${f1(x0)}" y2="${f1(yp)}" class="dg-clear"/><line x1="${f1(x0 - 5)}" y1="${f1(yp)}" x2="${f1(x0 + 5)}" y2="${f1(yp)}" class="dg-clear"/>`;
      labelY = Math.min(y0, yp);
    }
    let label = "";
    if (margin != null) {
      const txt = `${margin >= 0 ? "+" : ""}${Math.round(margin)} ft`;
      const bw = txt.length * 7 + 4;
      const yp = sy(Math.min(h, maxH));
      const tall = Math.abs(yp - y0) >= 24;
      // Linha de margem alta: etiqueta ao lado, a meio; senão por cima do ponto mais alto
      const left = x0 + 8 + bw > W - 4;
      let xl = tall ? (left ? x0 - 8 - bw : x0 + 8) : clamp(x0 - bw / 2, 4, W - bw - 4);
      let yt = tall ? (y0 + yp) / 2 - 8 : labelY - 24;
      for (let guard = 0; guard < 8; guard++) {
        const hit = boxes.find(bx => xl < bx.x + bx.w && xl + bw > bx.x && yt < bx.y + 16 && yt + 16 > bx.y);
        if (!hit) break;
        yt = hit.y - 17;
      }
      yt = Math.max(yt, top - 6);
      boxes.push({ x: xl, w: bw, y: yt });
      label = `<rect x="${f1(xl - 3)}" y="${f1(yt - 1)}" width="${f1(bw + 2)}" height="17" rx="4" class="dg-pill"/><text x="${f1(xl)}" y="${f1(yt + 12)}" class="dg-small dg-margin">${txt}</text>`;
    }
    return {
      body: `<g class="${cls}"><title>${esc(title)}</title>${shape}${clear}</g>`,
      label: `<g class="${cls}">${label}</g>`
    };
  });
  // Etiquetas por cima de todas as silhuetas
  const obsSvg = obs.map(o => o.body).join("") + obs.map(o => o.label).join("");

  const verdict = !path ? "Flight path unavailable (out of AFM chart)"
    : obstacles.length === 0 ? "No obstacle in database"
      : anyBad ? "Flight path below an obstacle" : "Flight path clears all obstacles";
  const gridFt = [0, 100, 200, 300, 400, 500, 1000, 1500].filter(v => v <= maxH);
  const todX = path ? clamp(sx(path.todr), padL + 36, W - 40) : 0;

  return `<svg xmlns="${NS}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Side view with obstacles and flight path">
  <text x="12" y="18" class="dg-title">Side view</text>
  <text x="${W - 12}" y="18" class="dg-axis" text-anchor="end">ft · m from start of TORA</text>
  ${gridFt.map(v => `<line x1="${padL}" y1="${f1(sy(v))}" x2="${W - padR}" y2="${f1(sy(v))}" class="dg-grid"/><text x="${padL - 4}" y="${f1(sy(v) + 4)}" text-anchor="end" class="dg-axis">${v}</text>`).join("")}
  <rect x="${f1(sx(0))}" y="${base}" width="${f1(sx(tora) - sx(0))}" height="8" class="dg-rwy"/>
  ${toda > tora ? `<rect x="${f1(sx(tora))}" y="${base}" width="${f1(sx(toda) - sx(tora))}" height="8" class="dg-clearway"/>` : ""}
  <line x1="${padL}" y1="${base + 8}" x2="${W - padR}" y2="${base + 8}" class="dg-ground"/>
  <text x="${padL}" y="${base + 24}" class="dg-small">TORA ${tora} m${toda > tora ? ` · TODA ${toda} m` : ""}</text>
  ${path ? `<line x1="${f1(sx(path.todr))}" y1="${base}" x2="${f1(sx(path.todr))}" y2="${f1(sy(REF_HEIGHT_FT))}" class="dg-ref"/><text x="${f1(todX)}" y="${base + 40}" text-anchor="middle" class="dg-small">TOD ${todr} m</text>` : ""}
  ${pathSvg}
  ${segLabels}
  ${obsSvg}
  <text x="12" y="${H - 8}" class="dg-label ${anyBad || !path ? "bad" : "ok"}">${verdict}</text>
</svg>`;
}

export function sideInfoHtml(segments) {
  const row = (name, s) => s && s.text ? `<div><span class="muted">${name}</span> <span class="mono ${s.state === "ok" ? "ok" : s.state === "bad" || s.state === "ooc" ? "bad" : ""}">${esc(s.text)}</span></div>` : "";
  return `<div class="dg-info"><div class="dg-legend"><span class="lg lg-ground">Ground roll</span><span class="lg lg-lift">Lift-off → 35 ft</span><span class="lg lg-s2">2nd</span><span class="lg lg-s3">3rd</span><span class="lg lg-s4">4th</span></div>${row("2nd seg req/calc", segments.SEG2)}${row("3rd seg obstacle/dist", segments.SEG3)}${row("4th seg req/calc", segments.SEG4)}
  <div class="muted">Schematic only: 3rd segment drawn level at 400 ft with the AFM distance. The Status above is the verdict.</div></div>`;
}

// ---------------------------------------------------------------------------------------------
// UI: cartão recolhido por defeito; abre/fecha com o botão e redesenha à largura disponível.
// ---------------------------------------------------------------------------------------------
let last = null; // últimos dados, para redesenhar no resize/abrir
let bound = false;

function readOpen() {
  try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
}
function writeOpen(v) {
  try { localStorage.setItem(STORAGE_KEY, v ? "1" : "0"); } catch { /* sem storage: ignora */ }
}

function draw() {
  const body = document.getElementById("diagramBody");
  if (!last || !body || body.hidden) return;
  const topEl = document.getElementById("diagramTop");
  const w = clamp(Math.round(Number(topEl.clientWidth)) || 640, 280, 720);
  const { runwayEntry: r, wind, todr, segments } = last;
  topEl.innerHTML = buildTopViewSvg({ rwy: r.rwy, heading: r.heading, tora: r.tora, toda: r.toda, wind, width: w })
    + topInfoHtml({ rwy: r.rwy, heading: r.heading, tora: r.tora, toda: r.toda, slope: r.slope, wind });
  document.getElementById("diagramSide").innerHTML = buildSideViewSvg({
    tora: r.tora, toda: r.toda, todr, tor: last.tor, obstacles: r.obstacles || [], width: w,
    g2: segments.SEG2 ? segments.SEG2.gradient : null,
    d3: segments.SEG3 ? segments.SEG3.distance : null,
    g4: segments.SEG4 ? segments.SEG4.gradient : null
  }) + sideInfoHtml(segments);
}

function setOpen(open) {
  const body = document.getElementById("diagramBody");
  const btn = document.getElementById("diagramToggle");
  const label = document.getElementById("diagramChevron");
  if (!body || !btn) return;
  body.hidden = !open;
  btn.setAttribute("aria-expanded", String(open));
  if (label) label.textContent = open ? "Hide ▴" : "Show ▾";
  if (open) draw();
}

function bind() {
  if (bound) return;
  const btn = document.getElementById("diagramToggle");
  if (!btn || typeof btn.addEventListener !== "function") return;
  bound = true;
  btn.addEventListener("click", () => {
    const open = document.getElementById("diagramBody").hidden;
    writeOpen(open);
    setOpen(open);
  });
  if (typeof window !== "undefined" && window.addEventListener) {
    let timer = null;
    window.addEventListener("resize", () => { clearTimeout(timer); timer = setTimeout(draw, 150); });
  }
}

/** Guarda os resultados do Calc e mostra o cartão (recolhido, ou aberto se o utilizador o deixou aberto). */
export function renderPerformanceDiagrams({ runwayEntry, windRaw, todr, tor, segments }) {
  const card = document.getElementById("diagramCard");
  if (!card) return;
  const wind = parseWind(windRaw);
  if (!wind) { clearPerformanceDiagrams(); return; }
  last = { runwayEntry, wind, todr, tor, segments };
  bind();
  card.hidden = false;
  setOpen(readOpen());
}

export function clearPerformanceDiagrams() {
  last = null;
  const card = document.getElementById("diagramCard");
  if (!card) return;
  card.hidden = true;
  document.getElementById("diagramTop").innerHTML = "";
  document.getElementById("diagramSide").innerHTML = "";
}
