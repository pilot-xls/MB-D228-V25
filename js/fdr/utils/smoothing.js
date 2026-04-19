/**
 * Utilitário de smoothing.
 * Objetivo: fornecer base simples para suavização de sinais no futuro.
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
