
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

// Lista de pesos a testar
const WEIGHTS = [
  4500, 4600, 4700, 4800, 4900,
  5000, 5100, 5200, 5300, 5400,
  5500, 5600, 5700, 5800, 5900,
  6000, 6100, 6200, 6300, 6400, 6500
];

/**
 * Calcula o TODR para um peso específico.
 */
function getTodrForWeight({ flaps, pa, oat, tow, wind, slope }) {
  // Se os flaps estiverem UP usa a função correspondente
  if (flaps === "up") {
    // Calcula o TODR para flaps UP
    const res = TODR_FLAPSUP({
      PA: pa,
      OAT: oat,
      Weight: tow,
      Wind: wind,
      slope: slope
    });

    // Se falhar devolve null
    if (!res || res.status === "failed") return null;

    // Devolve o valor numérico do resultado
    return Number(res.result);
  }

  // Se os flaps estiverem em 1 usa a função correspondente
  if (flaps === "1") {
    // Calcula o TODR para flaps 1
    const res = TODR_FLAPS1({
      PA: pa,
      OAT: oat,
      Weight: tow,
      Wind: wind,
      slope: slope
    });

    // Se falhar devolve null
    if (!res || res.status === "failed") return null;

    // Devolve o valor numérico do resultado
    return Number(res.result);
  }

  // Se a configuração de flaps for inválida devolve null
  return null;
}

/**
 * Procura o maior peso que passa uma verificação.
 */
function findMaxTow(checkFn) {
  // Guarda o último peso que passou
  let best = null;

  // Percorre os pesos por ordem crescente
  for (const tow of WEIGHTS) {
    // Se este peso passar, fica como melhor até agora
    if (checkFn(tow)) {
      best = tow;
    }
  }

  // Devolve o maior peso que passou
  return best;
}

/**
 * Calcula o MTOW do 2º segmento.
 */
export function getMaxTow2Seg({
  flaps,
  pa,
  oat,
  inlet,
  wind,
  slope,
  obstacles
}) {
  // Procura o maior peso que passa o 2º segmento
  return findMaxTow((tow) => {
    // Calcula o TODR para este peso
    const todr = getTodrForWeight({
      flaps,
      pa,
      oat,
      tow,
      wind,
      slope
    });

    // Se falhar, este peso falha
    if (todr == null) return false;

    // Guarda o maior gradient required encontrado para este peso
    let maxRequired = 0;

    // Percorre os obstáculos do 2º segmento
    for (const obs of obstacles) {
      // Calcula a distância do obstáculo relativamente ao REF ZERO
      const obstacleDistanceFromREFZERO = obs.obstacle_dist - todr;

      // Calcula o gradient required deste obstáculo
      const requiredRes = Gradient_Required2Seg({
        obstacleDistance: obstacleDistanceFromREFZERO,
        wind: wind,
        obstacle_height_ft: obs.obstacle_ft
      });

      // Se houver valor válido, compara com o máximo atual
      if (requiredRes && requiredRes.result_CG_required != null) {
        maxRequired = Math.max(maxRequired, requiredRes.result_CG_required);
      }
    }

    // Calcula o performed do 2º segmento para este mesmo peso
    const performedRes =
      flaps === "up"
        ? Gradient_2segFlapsUp({
            pressureAltitude: pa,
            oat: oat,
            tow: tow,
            inlet: inlet,
            gradientRequired: maxRequired
          })
        : Gradient_2segFlaps1({
            pressureAltitude: pa,
            oat: oat,
            tow: tow,
            inlet: inlet,
            gradientRequired: maxRequired
          });

    // O peso só passa se a função disser PASSED
    return performedRes && performedRes.status === "PASSED";
  });
}

/**
 * Calcula os dados críticos do 3º/4º segmento para um peso específico.
 */
function getCritical34Data({ pa, oat, tow, wind, slope, obstacles }) {
  // O teu código atual usa o TODR de flaps 1 para a lógica 3º/4º segmento
  const todr = getTodrForWeight({
    flaps: "1",
    pa,
    oat,
    tow,
    wind,
    slope
  });

  // Se falhar, devolve null
  if (todr == null) return null;

  // Guarda a análise dos obstáculos
  const obstacleAnalysis = [];

  // Percorre os obstáculos do 3º/4º segmento
  for (const obs of obstacles) {
    // Calcula a distância do obstáculo relativamente ao REF ZERO
    const obstacleDistanceFromREFZERO = obs.obstacle_dist - todr;

    // Calcula o gradient required para este obstáculo
    const requiredRes = Gradient_Required34Seg({
      obstacleDistance: obstacleDistanceFromREFZERO,
      runway_slope: slope,
      wind: wind,
      obstacle_height: obs.obstacle_ft
    });

    // Se houver valor válido, guarda os dados
    if (requiredRes && requiredRes.result_CG_required != null) {
      obstacleAnalysis.push({
        requiredGradient: requiredRes.result_CG_required,
        obstacleDistance: obstacleDistanceFromREFZERO
      });
    }
  }

  // Se não houver obstáculos válidos, devolve neutro
  if (obstacleAnalysis.length === 0) {
    return {
      criticalObstacleDistance3Seg: 0,
      requiredGradient4Seg: 0
    };
  }

  // Procura o obstáculo mais crítico
  let critical = obstacleAnalysis[0];

  // Percorre os restantes obstáculos e fica com o pior
  for (const item of obstacleAnalysis) {
    if (item.requiredGradient > critical.requiredGradient) {
      critical = item;
    }
  }

  // Devolve os dados críticos
  return {
    criticalObstacleDistance3Seg: critical.obstacleDistance,
    requiredGradient4Seg: critical.requiredGradient
  };
}

/**
 * Calcula o MTOW do 3º segmento.
 */
export function getMaxTow3Seg({
  pa,
  oat,
  inlet,
  wind,
  slope,
  obstacles
}) {
  // Procura o maior peso que passa o 3º segmento
  return findMaxTow((tow) => {
    // Calcula os dados críticos para este peso
    const critical = getCritical34Data({
      pa,
      oat,
      tow,
      wind,
      slope,
      obstacles
    });

    // Se falhar, este peso falha
    if (!critical) return false;

    // Calcula a performance do 3º segmento
    const performedRes = Gradient_3segFlaps1({
      pressureAltitude: pa,
      oat: oat,
      tow: tow,
      inlet: inlet,
      obstacleDistance: critical.criticalObstacleDistance3Seg
    });

    // O peso só passa se a função disser PASSED
    return performedRes && performedRes.status === "PASSED";
  });
}

/**
 * Calcula o MTOW do 4º segmento.
 */
export function getMaxTow4Seg({
  pa,
  oat,
  inlet,
  wind,
  slope,
  obstacles
}) {
  // Procura o maior peso que passa o 4º segmento
  return findMaxTow((tow) => {
    // Calcula os dados críticos para este peso
    const critical = getCritical34Data({
      pa,
      oat,
      tow,
      wind,
      slope,
      obstacles
    });

    // Se falhar, este peso falha
    if (!critical) return false;

    // Calcula a performance do 4º segmento
    const performedRes = Gradient_4segFlapsUp({
      pressureAltitude: pa,
      oat: oat,
      tow: tow,
      inlet: inlet,
      gradientRequired: critical.requiredGradient4Seg
    });

    // O peso só passa se a função disser PASSED
    return performedRes && performedRes.status === "PASSED";
  });
}
