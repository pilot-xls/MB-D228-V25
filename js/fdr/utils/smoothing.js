/**
 * Utilitários de smoothing.
 * Objetivo: reduzir ruído de sinais de velocidade/altitude de forma legível e previsível.
 */

/**
 * Calcula média simples de uma lista numérica.
 * @param {number[]} values coleção de valores.
 * @returns {number} média calculada (0 quando vazio).
 */
export function simpleAverage(values = []) {
    if (!values.length) {
        return 0;
    }

    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
}

/**
 * Devolve os últimos N valores de uma lista (janela móvel).
 * @param {number[]} values coleção de valores.
 * @param {number} size tamanho máximo da janela.
 * @returns {number[]} subconjunto com no máximo size itens.
 */
export function rollingWindow(values = [], size = 1) {
    if (!Array.isArray(values) || size <= 0) {
        return [];
    }

    return values.slice(Math.max(0, values.length - size));
}

/**
 * Aplica média móvel simples sobre os últimos N valores.
 * @param {number[]} values coleção de valores.
 * @param {number} size tamanho da janela.
 * @returns {number} valor suavizado.
 */
export function movingAverage(values = [], size = 3) {
    const window = rollingWindow(values, size);
    return simpleAverage(window);
}

/**
 * Aplica suavização exponencial discreta.
 * @param {number[]} values coleção de valores ordenados no tempo.
 * @param {number} alpha fator de suavização (0..1).
 * @returns {number} último valor suavizado.
 */
export function exponentialSmoothing(values = [], alpha = 0.3) {
    if (!values.length) {
        return 0;
    }

    const clampedAlpha = Math.min(1, Math.max(0.01, alpha));
    return values.slice(1).reduce((smoothed, value) => {
        return clampedAlpha * value + (1 - clampedAlpha) * smoothed;
    }, values[0]);
}
