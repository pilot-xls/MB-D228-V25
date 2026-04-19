/**
 * Motor de deteção (stub desta fase).
 * Objetivo: preparar interface pública para a lógica futura de takeoff/landing automáticos.
 */

/**
 * Cria o motor de deteção em modo base.
 * @returns {{evaluateSample: Function}} API pública mínima do motor.
 */
export function createDetectionEngine() {
    return {
        /**
         * Avalia uma amostra de telemetria.
         * @param {object} sample ponto GPS/telemetria da sessão.
         * @returns {{event: string|null, confidence: number}} decisão atual (placeholder).
         */
        evaluateSample(sample) {
            void sample;
            return {
                event: null,
                confidence: 0
            };
        }
    };
}
