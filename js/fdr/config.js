/**
 * Configuração central do módulo FDR.
 * Objetivo: concentrar thresholds, janelas, qualidade GPS e parâmetros de heurística.
 */
export const FDR_PHASES = {
    IDLE: 'idle',
    PREFLIGHT: 'preflight',
    TAXI: 'taxi',
    TAKEOFF_ROLL: 'takeoff_roll',
    AIRBORNE: 'airborne',
    APPROACH: 'approach',
    LANDING_ROLL: 'landing_roll',
    ENDED: 'ended'
};

/**
 * Configuração global do FDR usada por UI, motor e serviços.
 */
export const FDR_CONFIG = {
    storageKey: 'flytools_fdr_session',
    profilesPath: './data/fdr-aircraft-profiles.json',
    demoTrackPath: './data/fdr-demo-track.json',
    defaultPhase: FDR_PHASES.IDLE,
    updateIntervalMs: 1000,
    maxPointsBuffer: 180,
    gps: {
        weakAccuracyThreshold: 60,
        minUsableAccuracy: 120,
        maxDeltaSeconds: 15,
        minDeltaSeconds: 0.5
    },
    windows: {
        speedSamples: 7,
        altitudeSamples: 9,
        trendSamples: 8
    },
    smoothing: {
        speedAlpha: 0.35,
        verticalAlpha: 0.25
    },
    thresholds: {
        taxiMinKt: 5,
        taxiMaxKt: 40,
        takeoffRollMinKt: 35,
        rotationMinKt: 50,
        airborneMinAltAglFt: 80,
        airborneMinVSpeedFpm: 250,
        approachMaxVSpeedFpm: -150,
        approachMaxKt: 150,
        landingRollMaxKt: 70,
        landingGroundAltFt: 60,
        fullStopMaxKt: 8
    },
    debounceSamples: {
        taxi: 3,
        takeoffRoll: 3,
        airborne: 3,
        approach: 3,
        landingRoll: 3,
        ended: 4,
        rejectTakeoff: 3,
        goAround: 2
    },
    hysteresis: {
        speedKt: 4,
        altitudeFt: 25,
        verticalSpeedFpm: 80
    },
    confidence: {
        minTransitionScore: 60,
        maxScore: 100
    },
    flightRules: {
        minAirborneSecondsForLanding: 45
    },
    flags: {
        enableHeadingAssist: true,
        allowTaxiEndWithoutTakeoff: true,
        enableDebugReasons: true
    },
    profiles: {
        defaultId: 'ga-single',
        supported: ['ga-single', 'ultralight', 'helicopter', 'jet', 'custom']
    }
};
