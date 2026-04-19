/**
 * Camada IndexedDB do FDR.
 * Objetivo: criar/abrir base de dados e disponibilizar helpers genéricos
 * para operações CRUD nos stores de sessão, pontos, eventos e sincronização.
 */

const DB_NAME = 'flytools_fdr';
const DB_VERSION = 1;

/**
 * Abre a base IndexedDB do FDR, criando stores/indexes na primeira execução.
 * @returns {Promise<IDBDatabase>} instância pronta da base.
 */
export function openFdrDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = event => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains('flight_sessions')) {
                const sessions = db.createObjectStore('flight_sessions', { keyPath: 'id' });
                sessions.createIndex('by_state', 'state', { unique: false });
                sessions.createIndex('by_updated_at', 'updatedAt', { unique: false });
            }

            if (!db.objectStoreNames.contains('flight_points')) {
                const points = db.createObjectStore('flight_points', { keyPath: 'id', autoIncrement: true });
                points.createIndex('by_session_id', 'sessionId', { unique: false });
                points.createIndex('by_session_timestamp', ['sessionId', 'timestamp'], { unique: false });
            }

            if (!db.objectStoreNames.contains('flight_events')) {
                const events = db.createObjectStore('flight_events', { keyPath: 'id', autoIncrement: true });
                events.createIndex('by_session_id', 'sessionId', { unique: false });
                events.createIndex('by_session_timestamp', ['sessionId', 'timestamp'], { unique: false });
                events.createIndex('by_type', 'type', { unique: false });
            }

            if (!db.objectStoreNames.contains('aircraft_profiles')) {
                db.createObjectStore('aircraft_profiles', { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains('sync_queue')) {
                const queue = db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
                queue.createIndex('by_status', 'status', { unique: false });
                queue.createIndex('by_created_at', 'createdAt', { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('Falha ao abrir IndexedDB do FDR.'));
    });
}

/**
 * Executa uma transação simples e devolve o resultado do pedido principal.
 * @param {IDBDatabase} db instância IndexedDB.
 * @param {string|string[]} storeNames stores envolvidos.
 * @param {'readonly'|'readwrite'} mode modo de transação.
 * @param {(tx: IDBTransaction) => IDBRequest|IDBRequest[]} callback operação a executar.
 * @returns {Promise<unknown>} resultado do request principal.
 */
export function withTransaction(db, storeNames, mode, callback) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeNames, mode);
        let mainRequest;

        try {
            mainRequest = callback(tx);
        } catch (error) {
            reject(error);
            return;
        }

        tx.oncomplete = () => {
            if (Array.isArray(mainRequest)) {
                resolve(mainRequest.map(request => request.result));
                return;
            }

            resolve(mainRequest?.result ?? null);
        };

        tx.onerror = () => reject(tx.error ?? new Error('Erro de transação IndexedDB.'));
        tx.onabort = () => reject(tx.error ?? new Error('Transação IndexedDB abortada.'));
    });
}

/**
 * Lê um único registo por chave.
 * @param {IDBDatabase} db instância DB.
 * @param {string} storeName nome do store.
 * @param {IDBValidKey} key chave primária.
 * @returns {Promise<any>} registo encontrado.
 */
export function getByKey(db, storeName, key) {
    return withTransaction(db, storeName, 'readonly', tx => tx.objectStore(storeName).get(key));
}

/**
 * Grava/atualiza um registo no store indicado.
 * @param {IDBDatabase} db instância DB.
 * @param {string} storeName nome do store.
 * @param {object} payload dados a persistir.
 * @returns {Promise<any>} chave/resultado da operação put.
 */
export function putRecord(db, storeName, payload) {
    return withTransaction(db, storeName, 'readwrite', tx => tx.objectStore(storeName).put(payload));
}

/**
 * Adiciona novo registo (auto-increment quando aplicável).
 * @param {IDBDatabase} db instância DB.
 * @param {string} storeName nome do store.
 * @param {object} payload dados a persistir.
 * @returns {Promise<any>} id criado.
 */
export function addRecord(db, storeName, payload) {
    return withTransaction(db, storeName, 'readwrite', tx => tx.objectStore(storeName).add(payload));
}

/**
 * Lista todos os registos de um store.
 * @param {IDBDatabase} db instância DB.
 * @param {string} storeName nome do store.
 * @returns {Promise<any[]>} lista completa.
 */
export function getAllRecords(db, storeName) {
    return withTransaction(db, storeName, 'readonly', tx => tx.objectStore(storeName).getAll());
}

/**
 * Lista registos por index usando chave exata.
 * @param {IDBDatabase} db instância DB.
 * @param {string} storeName nome do store.
 * @param {string} indexName nome do index.
 * @param {IDBValidKey|IDBKeyRange} query query do index.
 * @returns {Promise<any[]>} resultados.
 */
export function getAllByIndex(db, storeName, indexName, query) {
    return withTransaction(db, storeName, 'readonly', tx => {
        const index = tx.objectStore(storeName).index(indexName);
        return index.getAll(query);
    });
}
