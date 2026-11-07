
// Importa as funções já existentes para calcular TODR
import TODR_FLAPSUP from "./todrFlapsUP_CSATH.js";
import TODR_FLAPS1 from "./todrFlaps1_CSATH.js";

// Importa as funções já existentes dos gradientes
import Gradient_2segFlapsUp from "./cg2segFlapsUp_CSATH.js";
import Gradient_2segFlaps1 from "./cg2segFlaps1_CSATH.js";
import Gradient_3segFlaps1 from "./cg3segFlaps1_CSATH.js";
import Gradient_4segFlapsUp from "./cg4segFlapsUp_CSATH.js";

// Importa as funções já existentes dos gradients required
import Gradient_Required2Seg from "./cgRequired2Seg_CSATH.js";
import Gradient_Required34Seg from "./cgRequired34Seg_CSATH.js";

// Gama de pesos usada na procura do MTOW
export const MIN_WEIGHT = 4500;
export const MAX_WEIGHT = 6500;

// Texto mostrado quando o gráfico do AFM não cobre as condições
export const OUT_OF_CHART_TEXT = "out of AFM chart";

// Segmentos avaliados, pela ordem em que são reportados
export const SEGMENT_KEYS = ["SEG2", "SEG3", "SEG4"];

/**
 * Um segmento conta como cumprido se passou ("ok") ou se não há nada a comparar ("na").
 * "bad" = falhou a comparação; "ooc" = fora do gráfico do AFM (não verificável, não passa).
 */
export function segmentPasses(state) {
  return state === "ok" || state === "na";
}

/**
 * Formata um gradiente (%) com 1 casa decimal para a UI, evitando dízimas
 * resultantes de erro de precisão de ponto flutuante (ex.: 3.5000000000000004).
 */
function fmt1(n) {
  return Number.isFinite(n) ? (Math.round(n * 10) / 10).toFixed(1) : n;
}

/**
 * Calcula o TODR (m) para um peso específico, arredondado ao metro (o mesmo valor que a UI mostra).
 * Devolve null se o cálculo falhar.
 */
export function getTodrForWeight({ flaps, pa, oat, tow, wind, slope }) {
  const fn = flaps === "up" ? TODR_FLAPSUP : flaps === "1" ? TODR_FLAPS1 : null;

  // Configuração de flaps inválida
  if (!fn) return null;

  const res = fn({ PA: pa, OAT: oat, Weight: tow, Wind: wind, slope: slope });

  // Se falhar devolve null
  if (!res || res.status === "failed" || !Number.isFinite(Number(res.result))) return null;

  return Number(Number(res.result).toFixed(0));
}

/**
 * Traduz o resultado do 3º segmento para a UI.
 * state: "ok" (passed), "bad" (failed), "ooc" (fora do gráfico com obstáculo: não verificável),
 *        "na" (fora do gráfico sem obstáculo: não há comparação a fazer, não conta como falha).
 */
export function describeThirdSegment(result, obstacleDistance, hasObstacle) {
  if (result && result.status === "OUT_OF_CHART") {
    if (!hasObstacle) {
      return { state: "na", text: obstacleDistance + "m / " + OUT_OF_CHART_TEXT };
    }
    return { state: "ooc", text: obstacleDistance + "m / " + OUT_OF_CHART_TEXT };
  }

  const text = obstacleDistance + "m / " + result.distance + "m";

  if (result.status === "PASSED") {
    return { state: "ok", text };
  }

  return { state: "bad", text };
}

/**
 * Distância (m) de um obstáculo ao Reference Zero (fim do TOD).
 * obstacle_dist é medida a partir do fim da TODA (DER), como nas cartas de obstáculos:
 * do Reference Zero ao fim da TODA vão (TODA - TOD) metros.
 */
export function obstacleDistanceFromReferenceZero(obs, todr, toda) {
  return (Number(toda) - todr) + Number(obs.obstacle_dist);
}

/**
 * Texto curto de um obstáculo para os motivos (ex.: "Mastro 131 ft @ 750 m from DER").
 */
export function describeObstacle(obs) {
  const name = obs.name ? obs.name + " " : "";
  return name + obs.obstacle_ft + " ft @ " + obs.obstacle_dist + " m from DER";
}

/**
 * Sem TOD ou sem TODA não se sabe onde ficam os obstáculos em relação ao Reference Zero.
 * Devolve o texto do motivo, ou null se for possível posicionar os obstáculos.
 */
function cannotPlaceObstacles(todr, toda) {
  if (todr == null) return "TOD: " + OUT_OF_CHART_TEXT;
  if (!(Number(toda) > 0)) return "TODA missing";
  return null;
}

/**
 * 2º segmento para um peso: gradient required (obstáculo mais exigente) vs gradient performed.
 */
function evaluate2Seg({ flaps, pa, oat, tow, inlet, wind, obstacles, todr, toda }) {
  // Guarda o maior gradient required encontrado para este peso
  let required = 0;
  // Obstáculos que exigem mais de 7 % (fora do gráfico): não podem ser ignorados
  const aboveChartObstacles = [];

  if (obstacles.length > 0) {
    const noPlace = cannotPlaceObstacles(todr, toda);
    if (noPlace) {
      return { state: "ooc", required: null, gradient: null, text: noPlace };
    }

    for (const obs of obstacles) {
      const requiredRes = Gradient_Required2Seg({
        obstacleDistance: obstacleDistanceFromReferenceZero(obs, todr, toda),
        wind: wind,
        obstacle_height_ft: obs.obstacle_ft
      });

      if (requiredRes && requiredRes.aboveChart) {
        aboveChartObstacles.push(obs);
      } else if (requiredRes && requiredRes.result_CG_required != null) {
        required = Math.max(required, requiredRes.result_CG_required);
      }
      // Required a null sem aboveChart: obstáculo para lá dos 5000 m do gráfico (não conta)
    }
  }

  // Calcula o performed do 2º segmento para este mesmo peso
  const params = { pressureAltitude: pa, oat: oat, tow: tow, inlet: inlet, gradientRequired: required };
  const performed = flaps === "up" ? Gradient_2segFlapsUp(params) : Gradient_2segFlaps1(params);
  const gradient = performed ? performed.gradient : null;

  // Required acima de 7 %: fora do gráfico do AFM, não verificável (não passa)
  // detail: quais obstáculos (para explicar um MTOW não determinado)
  if (aboveChartObstacles.length > 0) {
    return {
      state: "ooc",
      required: null,
      gradient,
      text: "Req > 7% / " + fmt1(gradient) + "%",
      aboveChartObstacles,
      detail: "required > 7% (AFM chart max) for " + aboveChartObstacles.map(describeObstacle).join(", ")
    };
  }

  return {
    state: performed && performed.status === "PASSED" ? "ok" : "bad",
    required,
    gradient,
    text: fmt1(required) + "% / " + fmt1(gradient) + "%"
  };
}

/**
 * 3º e 4º segmentos para um peso: obstáculo crítico (maior gradient required),
 * distância horizontal do 3º segmento e gradiente do 4º segmento.
 */
function evaluate34Seg({ pa, oat, tow, inlet, wind, slope, obstacles, todr, toda }) {
  // Sem TOD/TODA não se sabe onde ficam os obstáculos em relação ao Reference Zero
  const noPlace = obstacles.length > 0 ? cannotPlaceObstacles(todr, toda) : null;
  if (noPlace) {
    return { seg3: { state: "ooc", text: noPlace }, seg4: { state: "ooc", text: noPlace } };
  }

  // Inicializa o obstáculo crítico
  let critical = null;

  for (const obs of obstacles) {
    // Distância do obstáculo relativamente ao Reference Zero
    const obstacleDistance = obstacleDistanceFromReferenceZero(obs, todr, toda);

    const requiredRes = Gradient_Required34Seg({
      obstacleDistance: obstacleDistance,
      runway_slope: slope,
      wind: wind,
      obstacle_height: obs.obstacle_ft
    });

    // Required a null (distância/slope/vento/altura fora do gráfico, CG > 7%):
    // não pode entrar na comparação como 0 → 3º/4º segmento não verificáveis.
    if (!requiredRes || requiredRes.result_CG_required == null) {
      const text = "Req: " + OUT_OF_CHART_TEXT;
      return { seg3: { state: "ooc", text }, seg4: { state: "ooc", text } };
    }

    // Fica com o obstáculo de maior gradient required
    if (!critical || requiredRes.result_CG_required > critical.requiredGradient) {
      critical = { requiredGradient: requiredRes.result_CG_required, obstacleDistance };
    }
  }

  // Sem obstáculo o requisito é 0 (0 m / 0 %)
  const requiredGradient4Seg = critical ? critical.requiredGradient : 0;
  const obstacleDistance3Seg = critical ? critical.obstacleDistance : 0;

  // 3º segmento: distância percorrida vs distância ao obstáculo crítico
  const thirdSegment = Gradient_3segFlaps1({
    pressureAltitude: pa,
    oat: oat,
    tow: tow,
    inlet: inlet,
    obstacleDistance: obstacleDistance3Seg
  });
  const seg3 = describeThirdSegment(thirdSegment, obstacleDistance3Seg, critical != null);

  // 4º segmento: gradiente disponível vs gradient required do obstáculo crítico
  const fourthSegment = Gradient_4segFlapsUp({
    pressureAltitude: pa,
    oat: oat,
    tow: tow,
    inlet: inlet,
    gradientRequired: requiredGradient4Seg
  });
  const gradient4 = fourthSegment ? fourthSegment.gradient : null;
  const seg4 = {
    state: fourthSegment && fourthSegment.status === "PASSED" ? "ok" : "bad",
    required: requiredGradient4Seg,
    gradient: gradient4,
    text: fmt1(requiredGradient4Seg) + "% / " + fmt1(gradient4) + "%"
  };

  return { seg3, seg4 };
}

/**
 * Avalia o 2º, 3º e 4º segmentos para um peso.
 *
 * É a ÚNICA verificação dos segmentos: a UI usa-a para o TOW introduzido e a procura
 * do MTOW usa-a para cada peso candidato. Assim o MTOW calculado dá sempre "Passed".
 *
 * params: { flaps, pa, oat, tow, inlet, wind, slope, toda, obstacles2Seg, obstacles34Seg }
 * O Reference Zero é o fim do TOD da configuração de flaps selecionada (para todos os segmentos).
 * obstacle_dist é medida a partir do fim da TODA (DER); toda é obrigatória quando há obstáculos.
 */
export function evaluateSegments({ flaps, pa, oat, tow, inlet, wind, slope, toda, obstacles2Seg = [], obstacles34Seg = [] }) {
  // O TOD só é necessário para posicionar obstáculos
  const needsTod = obstacles2Seg.length > 0 || obstacles34Seg.length > 0;
  const todr = needsTod ? getTodrForWeight({ flaps, pa, oat, tow, wind, slope }) : null;

  const seg2 = evaluate2Seg({ flaps, pa, oat, tow, inlet, wind, obstacles: obstacles2Seg, todr, toda });
  const { seg3, seg4 } = evaluate34Seg({ pa, oat, tow, inlet, wind, slope, obstacles: obstacles34Seg, todr, toda });

  const segments = { SEG2: seg2, SEG3: seg3, SEG4: seg4 };
  const failing = SEGMENT_KEYS.filter(k => !segmentPasses(segments[k].state));

  return { todr, ...segments, failing, passed: failing.length === 0 };
}

/**
 * Procura o maior peso <= maxWeight que cumpre o 2º, 3º e 4º segmentos EM SIMULTÂNEO.
 *
 * A procura desce a partir de maxWeight (normalmente o menor de WAT/ASDA/TORA/TODA/peso do avião).
 * Não basta o maior peso que passa cada segmento isoladamente: o 2º segmento não é monótono
 * com o peso (o required depende de o TOD ficar antes/depois do obstáculo), pelo que um peso
 * mais alto pode passar e um mais baixo falhar.
 *
 * Devolve:
 *  - mtow: peso encontrado, ou null se nenhum peso cumpre
 *  - limitedBy: segmentos que falham em mtow + 1 (vazio se mtow = maxWeight)
 *  - atTop: avaliação no peso de partida (para explicar porque nenhum peso cumpre)
 *  - atBottom / bottom: só quando nenhum peso cumpre — avaliação no peso mais baixo
 *    tentado (o mínimo dos gráficos): é aí que se vê porque nem descendo o peso passa
 */
export function findMaxTowAllSegments(params, maxWeight = MAX_WEIGHT) {
  const top = Math.min(MAX_WEIGHT, Math.floor(maxWeight));
  const bottom = Math.min(MIN_WEIGHT, top);

  let atTop = null;
  let above = null;

  for (let tow = top; tow >= bottom; tow--) {
    const ev = evaluateSegments({ ...params, tow });
    if (tow === top) atTop = ev;

    if (ev.passed) {
      return { mtow: tow, limitedBy: above ? above.failing : [], atTop };
    }

    above = ev;
  }

  return { mtow: null, limitedBy: atTop ? atTop.failing : [], atTop, atBottom: above, bottom };
}

/**
 * Motivo de um segmento que não passa num peso (ex.: "required > 7% (AFM chart max) for ...").
 * Usa o detalhe do segmento quando existe; senão o texto required / calculado.
 */
export function describeSegmentProblem(segment) {
  if (!segment) return "";
  return segment.detail || segment.text || "";
}

/**
 * Procura o maior peso (MIN_WEIGHT..maxWeight) que passa um segmento, isoladamente.
 * Devolve null quando nenhum peso passa.
 */
function findMaxTowSegment(key, params, maxWeight = MAX_WEIGHT) {
  const top = Math.min(MAX_WEIGHT, Math.floor(maxWeight));

  for (let tow = top; tow >= MIN_WEIGHT; tow--) {
    if (segmentPasses(evaluateSegments({ ...params, tow })[key].state)) return tow;
  }

  return null;
}

/**
 * MTOW do 2º segmento isolado (sem os outros limites).
 */
export function getMaxTow2Seg({ flaps, pa, oat, inlet, wind, slope, toda, obstacles, maxWeight }) {
  return findMaxTowSegment("SEG2", { flaps, pa, oat, inlet, wind, slope, toda, obstacles2Seg: obstacles }, maxWeight);
}

/**
 * MTOW do 3º segmento isolado (sem os outros limites).
 * Sem obstáculos o 3º segmento não limita o peso, mesmo fora do gráfico.
 */
export function getMaxTow3Seg({ flaps = "1", pa, oat, inlet, wind, slope, toda, obstacles, maxWeight }) {
  return findMaxTowSegment("SEG3", { flaps, pa, oat, inlet, wind, slope, toda, obstacles34Seg: obstacles || [] }, maxWeight);
}

/**
 * MTOW do 4º segmento isolado (sem os outros limites).
 */
export function getMaxTow4Seg({ flaps = "1", pa, oat, inlet, wind, slope, toda, obstacles, maxWeight }) {
  return findMaxTowSegment("SEG4", { flaps, pa, oat, inlet, wind, slope, toda, obstacles34Seg: obstacles || [] }, maxWeight);
}
