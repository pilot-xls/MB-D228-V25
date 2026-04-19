/**
 * Camada UI principal do FDR.
 * Objetivo: atualizar elementos principais do ecrã sem lógica de negócio pesada.
 */

/**
 * Atualiza badge de permissão.
 * @param {HTMLElement} target elemento destino.
 * @param {string} state estado da permissão.
 */
export function renderPermissionState(target, state) {
    const statusMap = {
        granted: { text: 'Permitido', className: 'status-ok' },
        prompt: { text: 'Pendente', className: 'status-pending' },
        denied: { text: 'Negado', className: 'status-error' },
        unsupported: { text: 'Sem suporte', className: 'status-error' }
    };

    const uiState = statusMap[state] ?? statusMap.unsupported;
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
 * Acrescenta entrada no log visual.
 * @param {HTMLOListElement} list elemento da lista.
 * @param {string} message mensagem de evento.
 */
export function appendEventLog(list, message) {
    const item = document.createElement('li');
    item.textContent = message;
    list.prepend(item);
}
