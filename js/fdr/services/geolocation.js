/**
 * Serviço de geolocalização FDR.
 * Objetivo: gerir ciclo de vida do watchPosition (start/stop/pause/resume) e distribuição de pontos normalizados.
 */

const TRACKING_OPTIONS = {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 12000
};

/**
 * Normaliza um ponto geográfico da Geolocation API.
 * Input: GeolocationPosition nativo.
 * Output: objeto de telemetria normalizado para a app.
 * Objetivo: garantir formato estável para UI e motor de deteção.
 * @param {GeolocationPosition} position posição bruta do browser.
 * @returns {{
 *  timestamp: number,
 *  latitude: number,
 *  longitude: number,
 *  accuracy: number,
 *  altitude: number|null,
 *  altitudeAccuracy: number|null,
 *  heading: number|null,
 *  speed: number|null,
 *  source: 'watchPosition'
 * }} ponto normalizado.
 */
function normalizePosition(position) {
    const { coords, timestamp } = position;

    return {
        timestamp,
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        altitude: Number.isFinite(coords.altitude) ? coords.altitude : null,
        altitudeAccuracy: Number.isFinite(coords.altitudeAccuracy) ? coords.altitudeAccuracy : null,
        heading: Number.isFinite(coords.heading) ? coords.heading : null,
        speed: Number.isFinite(coords.speed) ? coords.speed : null,
        source: 'watchPosition'
    };
}

/**
 * Cria um serviço de tracking geográfico com subscrição de eventos.
 * @returns {{
 *  startTracking: Function,
 *  stopTracking: Function,
 *  pauseTracking: Function,
 *  resumeTracking: Function,
 *  subscribe: Function,
 *  getStatus: Function
 * }} API pública do serviço.
 */
export function createGeolocationService() {
    let watchId = null;
    let isPaused = false;
    let isTracking = false;
    const subscribers = new Set();

    /**
     * Emite um evento para todos os subscritores.
     * @param {{type: string, payload?: any, error?: any}} event evento interno.
     */
    function emit(event) {
        subscribers.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.warn('[FDR] Subscriber geolocation falhou.', error);
            }
        });
    }

    /**
     * Inicia watchPosition se houver suporte e se ainda não existir watch ativo.
     */
    function startTracking() {
        if (!('geolocation' in navigator)) {
            emit({ type: 'unsupported', error: new Error('Geolocation API indisponível neste dispositivo.') });
            return false;
        }

        if (isTracking) {
            return true;
        }

        isPaused = false;
        watchId = navigator.geolocation.watchPosition(
            position => {
                if (isPaused) {
                    return;
                }

                emit({ type: 'point', payload: normalizePosition(position) });
            },
            error => {
                emit({ type: 'error', error });
            },
            TRACKING_OPTIONS
        );

        isTracking = true;
        emit({ type: 'tracking-started' });
        return true;
    }

    /**
     * Para completamente o tracking e limpa o watch ativo.
     */
    function stopTracking() {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }

        const wasTracking = isTracking;
        isTracking = false;
        isPaused = false;

        if (wasTracking) {
            emit({ type: 'tracking-stopped' });
        }
    }

    /**
     * Pausa a emissão de pontos mantendo o watch ativo em background.
     */
    function pauseTracking() {
        if (!isTracking || isPaused) {
            return;
        }

        isPaused = true;
        emit({ type: 'tracking-paused' });
    }

    /**
     * Retoma a emissão de pontos após pausa.
     */
    function resumeTracking() {
        if (!isTracking || !isPaused) {
            return;
        }

        isPaused = false;
        emit({ type: 'tracking-resumed' });
    }

    /**
     * Regista listener para eventos do serviço.
     * Input: função callback(event).
     * Output: função unsubscribe.
     * @param {(event: object) => void} listener consumidor de eventos.
     * @returns {() => void} remove o listener.
     */
    function subscribe(listener) {
        subscribers.add(listener);

        return () => {
            subscribers.delete(listener);
        };
    }

    /**
     * Devolve estado atual interno do serviço.
     * @returns {{isTracking: boolean, isPaused: boolean}} snapshot de estado.
     */
    function getStatus() {
        return { isTracking, isPaused };
    }

    return {
        startTracking,
        stopTracking,
        pauseTracking,
        resumeTracking,
        subscribe,
        getStatus
    };
}
