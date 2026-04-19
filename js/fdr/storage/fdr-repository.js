import { loadLocalRecord, saveLocalRecord } from './fdr-db.js';

/**
 * Repositório da sessão FDR.
 * Objetivo: centralizar leitura/escrita da sessão atual.
 */

/**
 * Cria repositório de sessão com chave configurável.
 * @param {string} storageKey chave de persistência.
 * @returns {{saveSession: Function, loadSession: Function}}
 */
export function createFdrRepository(storageKey) {
    return {
        /**
         * Persiste estado da sessão.
         * @param {object} session sessão atual.
         */
        saveSession(session) {
            saveLocalRecord(storageKey, session);
        },

        /**
         * Lê sessão previamente guardada.
         * @returns {object|null} sessão guardada.
         */
        loadSession() {
            return loadLocalRecord(storageKey);
        }
    };
}
