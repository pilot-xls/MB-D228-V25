import { formatDuration, formatTimestamp, safeTimeDiffSeconds } from '../utils/time.js';

/**
 * Módulo de resumo FDR.
 * Objetivo: calcular e renderizar resumo final/atual da sessão,
 * respeitando precedência de timestamps manuais sobre automáticos.
 */

/**
 * Resolve timestamp efetivo de takeoff com respetiva origem.
 * @param {object} session sessão FDR.
 * @returns {{time:number|null, source:'manual'|'auto'|null}} instante efetivo e origem.
 */
export function resolveTakeoff(session) {
    if (session?.manualTakeoffAt) {
        return { time: session.manualTakeoffAt, source: 'manual' };
    }

    if (session?.takeoffAutoAt) {
        return { time: session.takeoffAutoAt, source: 'auto' };
    }

    return { time: null, source: null };
}

/**
 * Resolve timestamp efetivo de landing com respetiva origem.
 * @param {object} session sessão FDR.
 * @returns {{time:number|null, source:'manual'|'auto'|null}} instante efetivo e origem.
 */
export function resolveLanding(session) {
    if (session?.manualLandingAt) {
        return { time: session.manualLandingAt, source: 'manual' };
    }

    if (session?.landingAutoAt) {
        return { time: session.landingAutoAt, source: 'auto' };
    }

    return { time: null, source: null };
}

/**
 * Constrói dados de resumo em formato pronto para UI.
 * @param {object|null} session sessão atual/final.
 * @param {number} now timestamp de referência (normalmente Date.now()).
 * @returns {object} resumo formatado.
 */
export function buildSessionSummary(session, now = Date.now()) {
    if (!session) {
        return {
            takeoff: '--:--:--',
            landing: '--:--:--',
            flyTime: '00:00:00',
            sessionTime: '00:00:00',
            confidence: '--',
            detectionConfidence: '--',
            takeoffSource: '--',
            landingSource: '--'
        };
    }

    const takeoff = resolveTakeoff(session);
    const landing = resolveLanding(session);

    const sessionEnd = session.endedAt ?? now;
    const sessionSeconds = session.startedAt
        ? safeTimeDiffSeconds(session.startedAt, sessionEnd)
        : 0;

    let flySeconds = 0;
    if (takeoff.time) {
        const flyEnd = landing.time ?? sessionEnd;
        flySeconds = safeTimeDiffSeconds(takeoff.time, flyEnd);
    }

    const samples = session.confidence?.samples ?? 0;
    const avg = session.confidence?.avg ?? 0;
    const max = session.confidence?.max ?? 0;

    return {
        takeoff: takeoff.time ? formatTimestamp(takeoff.time) : '--:--:--',
        landing: landing.time ? formatTimestamp(landing.time) : '--:--:--',
        flyTime: formatDuration(flySeconds),
        sessionTime: formatDuration(sessionSeconds),
        confidence: samples > 0
            ? `avg ${Math.round(avg)}% · max ${Math.round(max)}% · n=${samples}`
            : '--',
        detectionConfidence: session.metrics?.confidence !== null && session.metrics?.confidence !== undefined
            ? `${Math.round(session.metrics.confidence)}%`
            : '--',
        takeoffSource: takeoff.source ?? '--',
        landingSource: landing.source ?? '--'
    };
}

/**
 * Renderiza timeline final dos eventos com badge auto/manual.
 * @param {HTMLElement} target lista UL de timeline.
 * @param {Array<{label:string,timestamp:number|null,source:'auto'|'manual'|null}>} items eventos relevantes.
 */
export function renderSummaryTimeline(target, items) {
    target.innerHTML = '';

    if (!items.length) {
        const item = document.createElement('li');
        item.textContent = 'Ainda sem eventos.';
        target.appendChild(item);
        return;
    }

    items.forEach(entry => {
        const item = document.createElement('li');
        item.textContent = `${entry.label}: ${entry.timestamp ? formatTimestamp(entry.timestamp) : '--:--:--'}`;

        if (entry.source) {
            const badge = document.createElement('span');
            badge.className = `source-badge source-${entry.source}`;
            badge.textContent = entry.source;
            item.appendChild(badge);
        }

        target.appendChild(item);
    });
}

/**
 * Atualiza os campos de resumo no ecrã.
 * @param {{takeoff:HTMLElement, landing:HTMLElement, flyTime:HTMLElement, sessionTime:HTMLElement, confidence:HTMLElement, takeoffSource:HTMLElement, landingSource:HTMLElement, timeline:HTMLElement}} fields campos UI.
 * @param {object} summary resumo formatado.
 * @param {Array<{label:string,timestamp:number|null,source:'auto'|'manual'|null}>} timelineItems eventos para timeline final.
 */
export function renderSummary(fields, summary, timelineItems = []) {
    fields.takeoff.textContent = summary.takeoff ?? '--:--:--';
    fields.landing.textContent = summary.landing ?? '--:--:--';
    fields.flyTime.textContent = summary.flyTime ?? '00:00:00';
    fields.sessionTime.textContent = summary.sessionTime ?? '00:00:00';
    fields.confidence.textContent = summary.confidence ?? '--';
    fields.takeoffSource.textContent = summary.takeoffSource ?? '--';
    fields.landingSource.textContent = summary.landingSource ?? '--';

    renderSummaryTimeline(fields.timeline, timelineItems);
}
