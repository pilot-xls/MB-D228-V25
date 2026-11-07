// performanceDiagram.js
// Desenhos SVG da página Performance: planta (pista + WDI + vento) e perfil lateral
// (obstáculos + flight path). Funções puras: recebem dados já calculados e devolvem SVG.

const NS = "http://www.w3.org/2000/svg";
const REF_HEIGHT_FT = 35; // altura do Reference Zero (fim do TOD)
const SEG2_END_FT = 400;
const FT_PER_M = 3.28084;

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const num = (v, d = 1) => (Number.isFinite(v) ? v.toFixed(d) : "—");

/** Parse "270/15" → { dir, speed } ou null. */
export function parseWind(raw) {
  const [d, s] = String(raw || "").split("/");
  const dir = parseInt(d, 10);
  const speed = parseInt(s, 10);
  return Number.isFinite(dir) && Number.isFinite(speed) ? { dir, speed } : null;
}

/** Componentes de vento (kt) em relação ao heading da pista. headwind<0 = tailwind; cross>0 = da direita. */
export function windComponents(wind, heading) {
  const rad = ((wind.dir - heading) * Math.PI) / 180;
  return { head: wind.speed * Math.cos(rad), cross: wind.speed * Math.sin(rad) };
}

/**
 * PLANTA: pista na horizontal com a direção de descolagem para a direita (norte rodado),
 * WDI e setas de vento. Tudo desenhado em relação ao heading da pista.
 */
export function buildTopViewSvg({ rwy, heading, tora, toda, slope, wind }) {
  const W = 640, H = 230;
  const rx = 40, ry = 105, rw = 470, rh = 44;
  const clearwayLen = Math.max(0, toda - tora);
  const cwW = Math.min(60, (clearwayLen / Math.max(tora, 1)) * rw);
  const comp = windComponents(wind, heading);

  // Ângulo do vento relativo ao eixo da pista (0° = vento de frente, vem da direita do desenho)
  // Direção "de onde vem" rodada: vento de frente → seta aponta para a esquerda (contra a descolagem).
  const rel = wind.dir - heading; // graus, sentido horário
  // vetor de movimento do ar (para onde vai) no sistema do desenho (x → direção de descolagem, y → baixo = direita da pista)
  const toRad = ((rel + 180) * Math.PI) / 180;
  const vx = Math.cos(toRad), vy = Math.sin(toRad);
  const len = 30 + Math.min(wind.speed, 40) * 1.2;

  // Setas de vento (3) por cima da pista
  const arrows = [0, 1, 2].map(i => {
    const cx = 120 + i * 110, cy = 45 + (i % 2) * 14;
    const x1 = cx - (vx * len) / 2, y1 = cy - (vy * len) / 2;
    const x2 = cx + (vx * len) / 2, y2 = cy + (vy * len) / 2;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="dg-wind" marker-end="url(#dgArrow)"/>`;
  }).join("");

  // WDI: pólo fixo à direita da pista; a manga aponta para onde o ar vai
  const px = 560, py = 175;
  const sockLen = 28 + Math.min(wind.speed, 30) * 1.3;
  const droop = Math.max(0, 1 - wind.speed / 15) * 18; // com pouco vento a manga cai
  const sx = px + vx * sockLen, sy = py + vy * sockLen + droop;
  const nx = -vy, ny = vx, wBase = 9, wTip = 4;
  const ptsSock = [
    [px + nx * wBase, py + ny * wBase], [sx + nx * wTip, sy + ny * wTip],
    [sx - nx * wTip, sy - ny * wTip], [px - nx * wBase, py - ny * wBase]
  ].map(p => p.map(n => n.toFixed(1)).join(",")).join(" ");

  const tail = comp.head < -0.5;
  const headTxt = tail ? `Tailwind ${Math.round(-comp.head)} kt` : `Headwind ${Math.round(comp.head)} kt`;
  const crossTxt = `Crosswind ${Math.round(Math.abs(comp.cross))} kt ${comp.cross >= 0 ? "(R)" : "(L)"}`;

  return `<svg xmlns="${NS}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Runway top view with wind">
  <defs><marker id="dgArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="dg-wind-fill"/></marker></defs>
  <text x="14" y="20" class="dg-title">Top view</text>
  <text x="${W - 14}" y="20" class="dg-title" text-anchor="end">Wind ${String(wind.dir).padStart(3, "0")}/${wind.speed}</text>
  ${arrows}
  <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" class="dg-rwy"/>
  ${cwW > 0 ? `<rect x="${rx + rw}" y="${ry + 8}" width="${cwW.toFixed(1)}" height="${rh - 16}" class="dg-clearway"/>` : ""}
  <line x1="${rx + 36}" y1="${ry + rh / 2}" x2="${rx + rw - 36}" y2="${ry + rh / 2}" class="dg-centre"/>
  <text x="${rx + 8}" y="${ry + rh / 2 + 5}" class="dg-rwy-num">${esc(rwy)}</text>
  <path d="M${rx + rw - 70} ${ry - 12} h50 m-8 -6 l8 6 l-8 6" class="dg-toarrow"/>
  <text x="${rx + rw - 70}" y="${ry - 20}" class="dg-small">Take-off</text>
  <line x1="${px}" y1="${py + 25}" x2="${px}" y2="${py}" class="dg-pole"/>
  <polygon points="${ptsSock}" class="dg-sock"/>
  <line x1="${(px + (sx - px) * 0.4 + nx * 7).toFixed(1)}" y1="${(py + (sy - py) * 0.4 + ny * 7).toFixed(1)}" x2="${(px + (sx - px) * 0.4 - nx * 7).toFixed(1)}" y2="${(py + (sy - py) * 0.4 - ny * 7).toFixed(1)}" class="dg-stripe"/>
  <line x1="${(px + (sx - px) * 0.7 + nx * 6).toFixed(1)}" y1="${(py + (sy - py) * 0.7 + ny * 6).toFixed(1)}" x2="${(px + (sx - px) * 0.7 - nx * 6).toFixed(1)}" y2="${(py + (sy - py) * 0.7 - ny * 6).toFixed(1)}" class="dg-stripe"/>
  <text x="${px + 12}" y="${py + 40}" class="dg-small">WDI</text>
  <text x="14" y="${H - 38}" class="dg-label ${tail ? "bad" : ""}">${headTxt} · ${crossTxt}</text>
  <text x="14" y="${H - 16}" class="dg-small">RWY ${esc(rwy)} (${String(heading).padStart(3, "0")}°) · TORA ${tora} m · TODA ${toda} m · slope ${slope > 0 ? "+" : ""}${slope}%</text>
</svg>`;
}

/**
 * Altura (ft) da trajetória a uma distância x (m) do início da pista.
 * 2º segmento até 400 ft, depois 4º segmento (o nivelamento do 3º segmento não é desenhado).
 */
export function pathHeightFt(x, { todr, g2, g4 }) {
  if (!Number.isFinite(todr) || !Number.isFinite(g2) || x < todr) return null;
  const dx = (x - todr) * FT_PER_M; // ft horizontais
  const dxTo400 = ((SEG2_END_FT - REF_HEIGHT_FT) / Math.max(g2, 0.01)) * 100;
  if (dx <= dxTo400) return REF_HEIGHT_FT + (g2 / 100) * dx;
  const g = Number.isFinite(g4) ? g4 : g2;
  return SEG2_END_FT + (g / 100) * (dx - dxTo400);
}

/**
 * PERFIL LATERAL: pista, clearway, obstáculos (verde/vermelho consoante a trajetória) e flight path.
 * obstacles: distância medida a partir do fim da TODA (como no airportsList.json).
 */
export function buildSideViewSvg({ tora, toda, todr, obstacles, g2, g4, req2 }) {
  const W = 640, H = 270;
  const padL = 40, padR = 20, top = 34, base = 210;
  const farthest = obstacles.reduce((m, o) => Math.max(m, toda + o.obstacle_dist), 0);
  const maxX = Math.max(toda + 600, farthest + 300, (todr || 0) + 600);
  const maxObs = obstacles.reduce((m, o) => Math.max(m, o.obstacle_ft), 0);
  const havePath = Number.isFinite(todr) && Number.isFinite(g2);
  const pathAtEnd = havePath ? pathHeightFt(maxX, { todr, g2, g4 }) : 0;
  const maxH = Math.max(150, maxObs * 1.2, Math.min(pathAtEnd || 0, 1500) * 1.05, SEG2_END_FT * 0.5);
  const sx = x => padL + (x / maxX) * (W - padL - padR);
  const sy = h => base - (h / maxH) * (base - top);

  // Trajetória como polyline (amostrada)
  let pathPts = "";
  if (havePath) {
    const pts = [];
    pts.push(`${sx(todr).toFixed(1)},${sy(REF_HEIGHT_FT).toFixed(1)}`);
    for (let x = todr; x <= maxX; x += maxX / 120) {
      const h = pathHeightFt(x, { todr, g2, g4 });
      if (h == null || h > maxH) break;
      pts.push(`${sx(x).toFixed(1)},${sy(h).toFixed(1)}`);
    }
    pathPts = pts.join(" ");
  }

  // Linha do gradiente requerido (2º seg) a partir do Reference Zero
  let reqLine = "";
  if (havePath && Number.isFinite(req2) && req2 > 0) {
    const hEnd = REF_HEIGHT_FT + (req2 / 100) * (maxX - todr) * FT_PER_M;
    const xEnd = hEnd > maxH ? todr + ((maxH - REF_HEIGHT_FT) / (req2 / 100)) / FT_PER_M : maxX;
    const yEnd = Math.min(hEnd, maxH);
    reqLine = `<line x1="${sx(todr).toFixed(1)}" y1="${sy(REF_HEIGHT_FT).toFixed(1)}" x2="${sx(xEnd).toFixed(1)}" y2="${sy(yEnd).toFixed(1)}" class="dg-req"/>`;
  }

  let anyBad = false;
  const obs = obstacles.map(o => {
    const x = toda + o.obstacle_dist;
    const h = havePath ? pathHeightFt(x, { todr, g2, g4 }) : null;
    const margin = h == null ? null : h - o.obstacle_ft;
    const bad = margin != null && margin < 0;
    if (bad) anyBad = true;
    const cls = margin == null ? "dg-obs" : bad ? "dg-obs bad" : "dg-obs ok";
    const x0 = sx(x), y0 = sy(o.obstacle_ft);
    const label = `${esc(o.name || "obstacle")} ${o.obstacle_ft} ft @ ${o.obstacle_dist} m`;
    const mtxt = margin == null ? "" : ` (${margin >= 0 ? "+" : ""}${Math.round(margin)} ft)`;
    const anchor = x0 > W - 170 ? "end" : "start";
    const tx = anchor === "end" ? x0 - 6 : x0 + 6;
    return `<g class="${cls}"><line x1="${x0.toFixed(1)}" y1="${base}" x2="${x0.toFixed(1)}" y2="${y0.toFixed(1)}" class="dg-obs-bar"/>
      <polygon points="${(x0 - 6).toFixed(1)},${(y0 + 8).toFixed(1)} ${(x0 + 6).toFixed(1)},${(y0 + 8).toFixed(1)} ${x0.toFixed(1)},${(y0 - 4).toFixed(1)}" class="dg-obs-top"/>
      <text x="${tx.toFixed(1)}" y="${(y0 - 8).toFixed(1)}" text-anchor="${anchor}" class="dg-small">${label}${mtxt}</text></g>`;
  }).join("");

  const noObsTxt = obstacles.length === 0 ? `<text x="${W / 2}" y="${top + 30}" text-anchor="middle" class="dg-small">No obstacles in database for this runway</text>` : "";
  const verdict = !havePath ? "Flight path not available (TOD / gradient out of AFM chart)"
    : obstacles.length === 0 ? "No obstacle to clear"
      : anyBad ? "Flight path below at least one obstacle" : "Flight path clears all obstacles";

  const gridFt = [0, 100, 200, 300, 400, 500, 1000, 1500].filter(v => v <= maxH);

  return `<svg xmlns="${NS}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Side view with obstacles and flight path">
  <text x="14" y="20" class="dg-title">Side view (distance from start of TORA)</text>
  ${gridFt.map(v => `<line x1="${padL}" y1="${sy(v).toFixed(1)}" x2="${W - padR}" y2="${sy(v).toFixed(1)}" class="dg-grid"/><text x="${padL - 4}" y="${(sy(v) + 3).toFixed(1)}" text-anchor="end" class="dg-axis">${v}</text>`).join("")}
  <text x="6" y="${top - 8}" class="dg-axis">ft</text>
  <rect x="${sx(0).toFixed(1)}" y="${base}" width="${(sx(tora) - sx(0)).toFixed(1)}" height="8" class="dg-rwy"/>
  ${toda > tora ? `<rect x="${sx(tora).toFixed(1)}" y="${base}" width="${(sx(toda) - sx(tora)).toFixed(1)}" height="8" class="dg-clearway"/>` : ""}
  <line x1="${padL}" y1="${base + 8}" x2="${W - padR}" y2="${base + 8}" class="dg-ground"/>
  <text x="${sx(0)}" y="${base + 24}" class="dg-small">TORA ${tora} m</text>
  ${toda > tora ? `<text x="${sx(toda)}" y="${base + 24}" text-anchor="end" class="dg-small">TODA ${toda} m</text>` : ""}
  ${havePath ? `<line x1="${sx(todr).toFixed(1)}" y1="${base}" x2="${sx(todr).toFixed(1)}" y2="${sy(REF_HEIGHT_FT).toFixed(1)}" class="dg-ref"/><text x="${sx(todr).toFixed(1)}" y="${base + 38}" text-anchor="middle" class="dg-small">TOD ${todr} m</text>` : ""}
  ${reqLine}
  ${havePath ? `<polyline points="${pathPts}" class="dg-path ${anyBad ? "bad" : "ok"}"/>` : ""}
  ${obs}
  ${noObsTxt}
  <text x="14" y="${H - 8}" class="dg-label ${anyBad || !havePath ? "bad" : "ok"}">${verdict}</text>
  <text x="${W - 14}" y="${H - 8}" text-anchor="end" class="dg-small">${havePath ? `2nd seg ${num(g2)}%${Number.isFinite(req2) ? ` (req ${num(req2)}%)` : ""} · 4th seg ${num(g4)}% · schematic` : ""}</text>
</svg>`;
}

/** Renderiza os dois desenhos no cartão #diagramCard. */
export function renderPerformanceDiagrams({ runwayEntry, windRaw, todr, segments }) {
  const card = document.getElementById("diagramCard");
  if (!card) return;
  const wind = parseWind(windRaw);
  if (!wind) { clearPerformanceDiagrams(); return; }

  document.getElementById("diagramTop").innerHTML = buildTopViewSvg({
    rwy: runwayEntry.rwy, heading: runwayEntry.heading, tora: runwayEntry.tora,
    toda: runwayEntry.toda, slope: runwayEntry.slope, wind
  });
  document.getElementById("diagramSide").innerHTML = buildSideViewSvg({
    tora: runwayEntry.tora, toda: runwayEntry.toda, todr,
    obstacles: runwayEntry.obstacles || [],
    g2: segments && segments.SEG2 ? segments.SEG2.gradient : null,
    g4: segments && segments.SEG4 ? segments.SEG4.gradient : null,
    req2: segments && segments.SEG2 ? segments.SEG2.required : null
  });
  card.hidden = false;
}

export function clearPerformanceDiagrams() {
  const card = document.getElementById("diagramCard");
  if (!card) return;
  card.hidden = true;
  document.getElementById("diagramTop").innerHTML = "";
  document.getElementById("diagramSide").innerHTML = "";
}
