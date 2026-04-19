/**
 * Serviço de geolocalização FDR.
 * Objetivo: encapsular acesso ao navigator.geolocation com fallback seguro.
 */

/**
 * Inicia watchPosition e entrega amostras via callbacks.
 * @param {{onPosition: Function, onError: Function}} handlers callbacks de posição/erro.
 * @returns {{stop: Function}} controlador para parar o tracking.
 */
export function startGeolocationWatch({ onPosition, onError }) {
    if (!('geolocation' in navigator)) {
        onError?.(new Error('Geolocation API indisponível neste dispositivo.'));
        return { stop() {} };
    }

    const watchId = navigator.geolocation.watchPosition(
        position => onPosition?.(position),
        error => onError?.(error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );

    return {
        /**
         * Para a escuta de localização em execução.
         */
        stop() {
            navigator.geolocation.clearWatch(watchId);
        }
    };
}
