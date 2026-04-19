/**
 * Configuração central do módulo FDR.
 * Objetivo: concentrar constantes e caminhos para facilitar manutenção.
 */
export const FDR_CONFIG = {
    storageKey: 'flytools_fdr_session',
    profilesPath: './data/fdr-aircraft-profiles.json',
    demoTrackPath: './data/fdr-demo-track.json',
    defaultPhase: 'IDLE',
    updateIntervalMs: 1000,
    gpsWeakAccuracyThreshold: 60,
    maxPointsBuffer: 120
};
