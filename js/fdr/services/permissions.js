/**
 * Serviço de permissões do FDR.
 * Objetivo: centralizar leitura da permissão de geolocalização e atualização visual associada.
 */

const VALID_PERMISSION_STATES = new Set(['granted', 'prompt', 'denied']);

/**
 * Normaliza o estado devolvido pela Permissions API para os estados suportados no FDR.
 * @param {string} state estado bruto da API.
 * @returns {'granted'|'prompt'|'denied'} estado normalizado para a UI e fluxo FDR.
 */
function normalizePermissionState(state) {
    if (VALID_PERMISSION_STATES.has(state)) {
        return state;
    }

    return 'prompt';
}

/**
 * Obtém o estado da permissão de localização.
 * Input: nenhum.
 * Output: estado atual entre granted/prompt/denied.
 * Objetivo: permitir decisões de UX antes de iniciar o tracking.
 * @returns {Promise<'granted'|'prompt'|'denied'>}
 */
export async function getLocationPermissionState() {
    if (!('permissions' in navigator) || !navigator.permissions.query) {
        return 'prompt';
    }

    try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        return normalizePermissionState(result.state);
    } catch (error) {
        console.warn('[FDR] Falha ao ler permissões.', error);
        return 'prompt';
    }
}

/**
 * Atualiza um elemento visual com o estado atual de permissão.
 * Input: elemento target e estado.
 * Output: sem retorno; altera texto/dataset/classes do elemento.
 * Objetivo: helper simples para o bootstrap FDR manter UI sincronizada com permissões.
 * @param {HTMLElement} target elemento visual do estado de permissão.
 * @param {'granted'|'prompt'|'denied'} state estado da permissão.
 */
export function updatePermissionUi(target, state) {
    const uiMap = {
        granted: { text: 'Permitido', tone: 'ok' },
        prompt: { text: 'Pendente', tone: 'pending' },
        denied: { text: 'Negado', tone: 'error' }
    };

    const visualState = uiMap[state] ?? uiMap.prompt;
    target.textContent = visualState.text;
    target.dataset.permissionState = state;
    target.className = `status-badge status-${visualState.tone}`;
}
