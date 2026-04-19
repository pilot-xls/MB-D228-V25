/**
 * Utilitários geográficos para FDR.
 * Objetivo: concentrar cálculos de unidades para métricas de voo.
 */

/**
 * Converte m/s para knots.
 * @param {number} metersPerSecond velocidade em m/s.
 * @returns {number} velocidade em knots.
 */
export function msToKnots(metersPerSecond = 0) {
    return metersPerSecond * 1.943844;
}

/**
 * Converte metros para pés.
 * @param {number} meters altitude em metros.
 * @returns {number} altitude em pés.
 */
export function metersToFeet(meters = 0) {
    return meters * 3.28084;
}
