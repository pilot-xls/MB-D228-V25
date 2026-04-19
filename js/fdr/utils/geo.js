/**
 * Utilitários geográficos para FDR.
 * Objetivo: concentrar cálculos de distância, velocidade derivada e orientação básica.
 */

const EARTH_RADIUS_METERS = 6371000;

/**
 * Converte graus em radianos.
 * @param {number} degrees ângulo em graus.
 * @returns {number} ângulo em radianos.
 */
function toRadians(degrees = 0) {
    return degrees * (Math.PI / 180);
}

/**
 * Converte m/s para knots.
 * @param {number} metersPerSecond velocidade em m/s.
 * @returns {number} velocidade em knots.
 */
export function msToKnots(metersPerSecond = 0) {
    return metersPerSecond * 1.943844;
}

/**
 * Converte knots para m/s.
 * @param {number} knots velocidade em knots.
 * @returns {number} velocidade em m/s.
 */
export function knotsToMs(knots = 0) {
    return knots / 1.943844;
}

/**
 * Converte metros para pés.
 * @param {number} meters altitude em metros.
 * @returns {number} altitude em pés.
 */
export function metersToFeet(meters = 0) {
    return meters * 3.28084;
}

/**
 * Calcula distância Haversine entre dois pontos geográficos.
 * @param {{latitude:number, longitude:number}} from ponto inicial.
 * @param {{latitude:number, longitude:number}} to ponto final.
 * @returns {number} distância em metros.
 */
export function haversineDistance(from, to) {
    if (!from || !to) {
        return 0;
    }

    const lat1 = toRadians(from.latitude);
    const lat2 = toRadians(to.latitude);
    const deltaLat = toRadians(to.latitude - from.latitude);
    const deltaLon = toRadians(to.longitude - from.longitude);

    const a = Math.sin(deltaLat / 2) ** 2
        + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_METERS * c;
}

/**
 * Alias semântico para cálculo de distância entre pontos GPS.
 * @param {{latitude:number, longitude:number}} from ponto inicial.
 * @param {{latitude:number, longitude:number}} to ponto final.
 * @returns {number} distância em metros.
 */
export function distanceBetweenPoints(from, to) {
    return haversineDistance(from, to);
}

/**
 * Deriva velocidade (m/s) com base em distância e delta temporal.
 * @param {{latitude:number, longitude:number, timestamp:number}} from ponto inicial.
 * @param {{latitude:number, longitude:number, timestamp:number}} to ponto final.
 * @returns {number|null} velocidade em m/s (null quando inválido).
 */
export function deriveSpeedMs(from, to) {
    if (!from || !to || typeof from.timestamp !== 'number' || typeof to.timestamp !== 'number') {
        return null;
    }

    const dtSeconds = (to.timestamp - from.timestamp) / 1000;
    if (dtSeconds <= 0) {
        return null;
    }

    return distanceBetweenPoints(from, to) / dtSeconds;
}

/**
 * Calcula heading inicial entre dois pontos (0-360 graus).
 * @param {{latitude:number, longitude:number}} from ponto inicial.
 * @param {{latitude:number, longitude:number}} to ponto final.
 * @returns {number|null} rumo em graus (null quando inválido).
 */
export function calculateHeadingDeg(from, to) {
    if (!from || !to) {
        return null;
    }

    const lat1 = toRadians(from.latitude);
    const lat2 = toRadians(to.latitude);
    const dLon = toRadians(to.longitude - from.longitude);

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2)
        - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    const raw = (Math.atan2(y, x) * 180) / Math.PI;
    return (raw + 360) % 360;
}
