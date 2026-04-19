/**
 * Camada de DB simplificada para FDR.
 * Objetivo: abstrair persistência mínima usando localStorage nesta fase.
 */

/**
 * Grava um objeto no localStorage.
 * @param {string} key chave de armazenamento.
 * @param {object} value dados a persistir.
 */
export function saveLocalRecord(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Lê um objeto do localStorage.
 * @param {string} key chave de armazenamento.
 * @returns {object|null} valor lido ou null.
 */
export function loadLocalRecord(key) {
    const raw = localStorage.getItem(key);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        console.warn('[FDR] Registo inválido no armazenamento.', error);
        return null;
    }
}
