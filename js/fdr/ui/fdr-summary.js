/**
 * UI de resumo de sessão.
 * Objetivo: renderizar tempos principais da sessão num formato previsível.
 */

/**
 * Atualiza os campos de resumo no ecrã.
 * @param {{takeoff: HTMLElement, landing: HTMLElement, flyTime: HTMLElement, sessionTime: HTMLElement}} fields elementos do resumo.
 * @param {{takeoff?: string, landing?: string, flyTime?: string, sessionTime?: string}} summary dados formatados.
 */
export function renderSummary(fields, summary) {
    fields.takeoff.textContent = summary.takeoff ?? '--:--:--';
    fields.landing.textContent = summary.landing ?? '--:--:--';
    fields.flyTime.textContent = summary.flyTime ?? '00:00:00';
    fields.sessionTime.textContent = summary.sessionTime ?? '00:00:00';
}
