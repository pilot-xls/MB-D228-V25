/**
 * Utilitários de tempo para FDR.
 * Objetivo: padronizar formatação de duração e horário.
 */

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
 * Formata uma data em hora local HH:MM:SS.
 * @param {Date|string|number} date data de entrada.
 * @returns {string} hora formatada.
 */
export function formatClockTime(date) {
    const dt = new Date(date);
    if (Number.isNaN(dt.getTime())) {
        return '--:--:--';
    }

    return dt.toLocaleTimeString('pt-PT', { hour12: false });
}
