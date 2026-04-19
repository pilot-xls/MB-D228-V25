/**
 * Camada UI principal do FDR.
 * Objetivo: concentrar renderização do ecrã (fase, métricas, permissões e alertas operacionais).
 */

/**
 * Atualiza badge de permissão.
 * @param {HTMLElement} target elemento destino.
 * @param {'granted'|'prompt'|'denied'} state estado da permissão.
 */
export function renderPermissionState(target, state) {
    const statusMap = {
        granted: { text: 'Permitido', className: 'status-ok' },
        prompt: { text: 'Pendente', className: 'status-pending' },
        denied: { text: 'Negado', className: 'status-error' }
    };

    const uiState = statusMap[state] ?? statusMap.prompt;
    target.textContent = uiState.text;
    target.className = `status-badge ${uiState.className}`;
    target.dataset.permissionState = state;
}

/**
 * Renderiza estado de sessão (ativo/parado/pausado).
 * @param {HTMLElement} target elemento da badge de sessão.
 * @param {'active'|'stopped'|'paused'} sessionState estado da sessão.
 */
export function renderSessionState(target, sessionState) {
    const map = {
        active: { text: 'Ativo', className: 'status-ok' },
        stopped: { text: 'Parado', className: 'status-pending' },
        paused: { text: 'Pausado', className: 'status-pending' }
    };

    const uiState = map[sessionState] ?? map.stopped;
    target.textContent = uiState.text;
    target.className = `status-badge ${uiState.className}`;
}

/**
 * Escreve fase atual no ecrã.
 * @param {HTMLElement} target elemento da fase.
 * @param {string} phase fase atual.
 */
export function renderPhase(target, phase) {
    target.textContent = phase;
}

/**
 * Renderiza métricas principais em tempo real.
 * @param {object} metricElements referências de elementos de métricas.
 * @param {{gpsAccuracy?: string, speed?: string, altitude?: string, vspeed?: string, confidence?: string}} metrics métricas formatadas.
 */
export function renderLiveMetrics(metricElements, metrics) {
    metricElements.gpsAccuracy.textContent = metrics.gpsAccuracy ?? '-- m';
    metricElements.speed.textContent = metrics.speed ?? '-- kt';
    metricElements.altitude.textContent = metrics.altitude ?? '-- ft';
    metricElements.vspeed.textContent = metrics.vspeed ?? '-- ft/min';
    metricElements.confidence.textContent = metrics.confidence ?? '-- %';
}

/**
 * Renderiza alertas relacionados com GPS (fraco, indisponível, sem suporte).
 * @param {HTMLElement} target elemento do alerta GPS.
 * @param {{visible: boolean, message?: string, tone?: 'warning'|'error'}} alert dados do alerta.
 */
export function renderGpsAlert(target, alert) {
    target.hidden = !alert.visible;
    target.textContent = alert.message ?? '';
    target.className = `fdr-alert ${alert.tone === 'error' ? 'fdr-alert-error' : 'fdr-alert-warning'}`;
}

/**
 * Renderiza alerta informativo do wake lock.
 * @param {HTMLElement} target elemento do alerta de wake lock.
 * @param {{visible: boolean, message?: string}} alert dados do alerta.
 */
export function renderWakeLockAlert(target, alert) {
    target.hidden = !alert.visible;
    target.textContent = alert.message ?? '';
    target.className = 'fdr-alert fdr-alert-warning';
}

/**
 * Acrescenta entrada no log visual.
 * @param {HTMLOListElement} list elemento da lista.
 * @param {string} message mensagem de evento.
 */
export function appendEventLog(list, message) {
    const item = document.createElement('li');
    item.textContent = message;
    list.prepend(item);
}
