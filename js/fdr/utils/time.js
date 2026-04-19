/**
 * Utilitários de tempo para FDR.
 * Objetivo: padronizar diferenças temporais e formatação segura.
 */

/**
 * Converte valor de data para epoch milliseconds.
 * @param {Date|string|number} value data de entrada.
 * @returns {number|null} epoch em ms, ou null se inválido.
 */
export function toEpochMs(value) {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }

    const date = new Date(value);
    const epoch = date.getTime();
    return Number.isNaN(epoch) ? null : epoch;
}

/**
 * Calcula diferença temporal segura entre dois timestamps.
 * @param {Date|string|number} from instante inicial.
 * @param {Date|string|number} to instante final.
 * @returns {number} diferença em segundos (nunca negativa).
 */
export function safeTimeDiffSeconds(from, to) {
    const start = toEpochMs(from);
    const end = toEpochMs(to);

    if (start === null || end === null) {
        return 0;
    }

    return Math.max(0, (end - start) / 1000);
}

/**
 * Formata uma duração em segundos para HH:MM:SS.
 * @param {number} totalSeconds duração total.
 * @returns {string} duração formatada.
 */
export function formatDuration(totalSeconds = 0) {
    const value = Math.max(0, Math.floor(totalSeconds));
    const hours = String(Math.floor(value / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((value % 3600) / 60)).padStart(2, '0');
    const seconds = String(value % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Formata timestamp para HH:MM:SS local.
 * @param {Date|string|number} value data de entrada.
 * @returns {string} hora local formatada.
 */
export function formatTimestamp(value) {
    const epoch = toEpochMs(value);
    if (epoch === null) {
        return '--:--:--';
    }

    return new Date(epoch).toLocaleTimeString('pt-PT', { hour12: false });
}

/**
 * Compatibilidade com chamadas já existentes na UI.
 * @param {Date|string|number} date data de entrada.
 * @returns {string} hora local formatada.
 */
export function formatClockTime(date) {
    return formatTimestamp(date);
}
