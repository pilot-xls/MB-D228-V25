/**
 * Máquina de estados básica do FDR.
 * Objetivo: gerir transições de estado sem ainda implementar regras avançadas.
 */
const ALLOWED_TRANSITIONS = {
    IDLE: ['TRACKING'],
    TRACKING: ['AIRBORNE', 'IDLE'],
    AIRBORNE: ['TRACKING', 'IDLE']
};

/**
 * Cria uma máquina de estados simples para a sessão FDR.
 * @param {string} initialPhase fase inicial da sessão.
 * @returns {{getPhase: Function, transition: Function}} API de leitura e transição.
 */
export function createStateMachine(initialPhase = 'IDLE') {
    let currentPhase = initialPhase;

    return {
        /**
         * Devolve a fase atual.
         * @returns {string} fase atual.
         */
        getPhase() {
            return currentPhase;
        },

        /**
         * Tenta mudar de fase se a transição for permitida.
         * @param {string} nextPhase próxima fase pretendida.
         * @returns {boolean} true quando a transição é aplicada.
         */
        transition(nextPhase) {
            const canTransition = ALLOWED_TRANSITIONS[currentPhase]?.includes(nextPhase);
            if (!canTransition) {
                return false;
            }

            currentPhase = nextPhase;
            return true;
        }
    };
}
