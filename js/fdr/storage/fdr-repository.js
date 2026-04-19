import {
    addRecord,
    getAllByIndex,
    getAllRecords,
    getByKey,
    openFdrDb,
    putRecord
} from './fdr-db.js';

/**
 * Repositório de persistência do FDR.
 * Objetivo: encapsular regras de sessão/pontos/eventos sobre IndexedDB.
 */
export function createFdrRepository() {
    let db = null;

    /**
     * Garante que a base está aberta antes de qualquer operação.
     * @returns {Promise<IDBDatabase>} base pronta.
     */
    async function initDb() {
        if (!db) {
            db = await openFdrDb();
        }
        return db;
    }

    /**
     * Cria nova sessão ativa.
     * @param {{phase?:string, aircraftProfileId?:string|null, startedAt?:number}} params dados iniciais.
     * @returns {Promise<object>} sessão criada.
     */
    async function createSession(params = {}) {
        const now = Date.now();
        const session = {
            id: crypto.randomUUID(),
            state: 'active',
            phase: params.phase ?? 'preflight',
            aircraftProfileId: params.aircraftProfileId ?? null,
            startedAt: params.startedAt ?? now,
            endedAt: null,
            lastPointAt: null,
            pointsCount: 0,
            eventsCount: 0,
            metricsSnapshot: null,
            takeoffAutoAt: null,
            landingAutoAt: null,
            manualTakeoffAt: null,
            manualLandingAt: null,
            takeoffSource: null,
            landingSource: null,
            confidence: {
                avg: 0,
                max: 0,
                samples: 0
            },
            createdAt: now,
            updatedAt: now
        };

        await putRecord(await initDb(), 'flight_sessions', session);
        return session;
    }

    /**
     * Devolve sessão ativa mais recente, caso exista.
     * @returns {Promise<object|null>} sessão ativa.
     */
    async function getActiveSession() {
        const sessions = await getAllByIndex(await initDb(), 'flight_sessions', 'by_state', 'active');
        if (!sessions.length) {
            return null;
        }

        return sessions.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))[0];
    }

    /**
     * Obtém sessão por id.
     * @param {string} sessionId id da sessão.
     * @returns {Promise<object|null>} sessão encontrada.
     */
    async function getSessionById(sessionId) {
        return getByKey(await initDb(), 'flight_sessions', sessionId);
    }

    /**
     * Lista sessões ordenadas por atualização mais recente.
     * @param {number} limit limite opcional.
     * @returns {Promise<object[]>} lista de sessões.
     */
    async function listSessions(limit = 20) {
        const sessions = await getAllRecords(await initDb(), 'flight_sessions');
        return sessions
            .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
            .slice(0, limit);
    }

    /**
     * Acrescenta ponto de tracking a uma sessão.
     * Input: ponto bruto GPS + confiança opcional.
     * Output: id do ponto gravado.
     */
    async function appendPoint(sessionId, point, confidence = null) {
        const database = await initDb();
        const now = Date.now();
        const pointRecord = {
            sessionId,
            timestamp: point.timestamp,
            latitude: point.latitude,
            longitude: point.longitude,
            speed: point.speed,
            altitude: point.altitude,
            accuracy: point.accuracy,
            heading: point.heading ?? null,
            source: 'gps',
            createdAt: now
        };

        const pointId = await addRecord(database, 'flight_points', pointRecord);

        const session = await getSessionById(sessionId);
        if (session) {
            const previousSamples = session.confidence?.samples ?? 0;
            const previousAvg = session.confidence?.avg ?? 0;
            const nextSamples = previousSamples + 1;
            const nextAvg = confidence === null
                ? previousAvg
                : ((previousAvg * previousSamples) + confidence) / nextSamples;
            const nextMax = Math.max(session.confidence?.max ?? 0, confidence ?? 0);

            session.pointsCount = (session.pointsCount ?? 0) + 1;
            session.lastPointAt = point.timestamp ?? now;
            session.updatedAt = now;
            session.confidence = {
                avg: Number.isFinite(nextAvg) ? nextAvg : previousAvg,
                max: nextMax,
                samples: nextSamples
            };

            await putRecord(database, 'flight_sessions', session);
        }

        return pointId;
    }

    /**
     * Acrescenta evento de sessão (manual, automático, erro, etc.).
     * @returns {Promise<number>} id do evento criado.
     */
    async function appendEvent(sessionId, event) {
        const database = await initDb();
        const now = Date.now();
        const eventRecord = {
            sessionId,
            type: event.type,
            timestamp: event.timestamp ?? now,
            payload: event.payload ?? {},
            source: event.source ?? 'system',
            createdAt: now
        };

        const eventId = await addRecord(database, 'flight_events', eventRecord);

        const session = await getSessionById(sessionId);
        if (session) {
            session.eventsCount = (session.eventsCount ?? 0) + 1;
            session.updatedAt = now;
            await putRecord(database, 'flight_sessions', session);
        }

        return eventId;
    }

    /**
     * Atualiza estado da sessão (fase, snapshot de métricas e metadados).
     * @returns {Promise<object|null>} sessão atualizada.
     */
    async function updateSessionState(sessionId, patch = {}) {
        const database = await initDb();
        const session = await getSessionById(sessionId);
        if (!session) {
            return null;
        }

        const nextSession = {
            ...session,
            ...patch,
            updatedAt: Date.now()
        };

        await putRecord(database, 'flight_sessions', nextSession);
        return nextSession;
    }

    /**
     * Finaliza sessão ativa mantendo histórico.
     * @returns {Promise<object|null>} sessão finalizada.
     */
    async function finalizeSession(sessionId, patch = {}) {
        const now = Date.now();
        return updateSessionState(sessionId, {
            state: 'finalized',
            endedAt: patch.endedAt ?? now,
            phase: patch.phase ?? 'ended',
            ...patch
        });
    }

    /**
     * Define correção manual de takeoff sem apagar deteção automática.
     * @returns {Promise<object|null>} sessão atualizada.
     */
    async function saveManualTakeoff(sessionId, timestamp = Date.now()) {
        return updateSessionState(sessionId, {
            manualTakeoffAt: timestamp,
            takeoffSource: 'manual'
        });
    }

    /**
     * Define correção manual de landing sem apagar deteção automática.
     * @returns {Promise<object|null>} sessão atualizada.
     */
    async function saveManualLanding(sessionId, timestamp = Date.now()) {
        return updateSessionState(sessionId, {
            manualLandingAt: timestamp,
            landingSource: 'manual'
        });
    }

    /**
     * Limpa correções manuais, voltando para origem automática quando existir.
     * @returns {Promise<object|null>} sessão atualizada.
     */
    async function clearManualOverrides(sessionId) {
        const session = await getSessionById(sessionId);
        if (!session) {
            return null;
        }

        return updateSessionState(sessionId, {
            manualTakeoffAt: null,
            manualLandingAt: null,
            takeoffSource: session.takeoffAutoAt ? 'auto' : null,
            landingSource: session.landingAutoAt ? 'auto' : null
        });
    }

    /**
     * Obtém eventos de uma sessão ordenados por timestamp.
     */
    async function listEventsBySession(sessionId) {
        const events = await getAllByIndex(await initDb(), 'flight_events', 'by_session_id', sessionId);
        return events.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));
    }

    return {
        initDb,
        createSession,
        getActiveSession,
        getSessionById,
        listSessions,
        appendPoint,
        appendEvent,
        updateSessionState,
        finalizeSession,
        saveManualTakeoff,
        saveManualLanding,
        clearManualOverrides,
        listEventsBySession
    };
}
