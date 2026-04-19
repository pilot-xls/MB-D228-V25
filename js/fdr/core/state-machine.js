import { FDR_PHASES } from '../config.js';

/**
 * Mapa de transições explícitas da máquina de estados FDR.
 * Objetivo: garantir fluxo determinístico das fases operacionais do voo.
 */
const TRANSITIONS = {
    [FDR_PHASES.IDLE]: [FDR_PHASES.PREFLIGHT],
    [FDR_PHASES.PREFLIGHT]: [FDR_PHASES.TAXI],
    [FDR_PHASES.TAXI]: [FDR_PHASES.TAKEOFF_ROLL, FDR_PHASES.ENDED],
    [FDR_PHASES.TAKEOFF_ROLL]: [FDR_PHASES.AIRBORNE, FDR_PHASES.TAXI],
    [FDR_PHASES.AIRBORNE]: [FDR_PHASES.APPROACH],
    [FDR_PHASES.APPROACH]: [FDR_PHASES.LANDING_ROLL, FDR_PHASES.AIRBORNE],
    [FDR_PHASES.LANDING_ROLL]: [FDR_PHASES.ENDED, FDR_PHASES.AIRBORNE],
    [FDR_PHASES.ENDED]: []
};

/**
 * Cria uma máquina de estados explícita para a sessão FDR.
 * @param {string} initialPhase fase inicial.
 * @returns {{getPhase: Function, canTransition: Function, transition: Function, reset: Function, getAllowedTransitions: Function}} API da máquina.
 */
export function createStateMachine(initialPhase = FDR_PHASES.IDLE) {
    let currentPhase = TRANSITIONS[initialPhase] ? initialPhase : FDR_PHASES.IDLE;

    return {
        /**
         * Devolve a fase atual.
         * @returns {string} fase atual.
         */
        getPhase() {
            return currentPhase;
        },

        /**
         * Verifica se uma transição é válida para a fase atual.
         * @param {string} nextPhase fase destino.
         * @returns {boolean} true quando permitida.
         */
        canTransition(nextPhase) {
            return Boolean(TRANSITIONS[currentPhase]?.includes(nextPhase));
        },

        /**
         * Devolve transições possíveis da fase atual.
         * @returns {string[]} lista de fases destino.
         */
        getAllowedTransitions() {
            return [...(TRANSITIONS[currentPhase] ?? [])];
        },

        /**
         * Tenta aplicar transição explícita.
         * @param {string} nextPhase fase destino.
         * @param {object} meta metadados opcionais (reasonCodes, confidence).
         * @returns {{changed:boolean, from:string, to:string, meta:object}} resultado da transição.
         */
        transition(nextPhase, meta = {}) {
            const from = currentPhase;
            if (!this.canTransition(nextPhase)) {
                return { changed: false, from, to: from, meta };
            }

            currentPhase = nextPhase;
            return { changed: true, from, to: nextPhase, meta };
        },

        /**
         * Reinicia a máquina para idle ao terminar/parar sessão.
         * @returns {{changed:boolean, from:string, to:string}} resultado do reset.
         */
        reset() {
            const from = currentPhase;
            currentPhase = FDR_PHASES.IDLE;
            return { changed: from !== currentPhase, from, to: currentPhase };
        }
    };
}
