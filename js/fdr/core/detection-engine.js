import { FDR_CONFIG, FDR_PHASES } from '../config.js';
import { deriveSpeedMs, metersToFeet, msToKnots } from '../utils/geo.js';
import { exponentialSmoothing, movingAverage, rollingWindow } from '../utils/smoothing.js';
import { safeTimeDiffSeconds } from '../utils/time.js';

/**
 * Motor de deteção de fases de voo.
 * Objetivo: inferir taxi/takeoff/airborne/approach/landing com scores, histerese e debounce temporal.
 */
export function createDetectionEngine(options = {}) {
    const cfg = deepMerge(FDR_CONFIG, options);

    const state = {
        samples: [],
        smoothedSpeedKt: 0,
        smoothedVerticalFpm: 0,
        counters: {
            taxi: 0,
            takeoffRoll: 0,
            airborne: 0,
            approach: 0,
            landingRoll: 0,
            ended: 0,
            rejectTakeoff: 0,
            goAround: 0
        },
        flight: {
            takeoffAt: null,
            landingAt: null,
            lastAirborneAt: null,
            airborneBaselineFt: null
        }
    };

    return {
        /**
         * Avalia um novo ponto e devolve sugestão de fase/eventos.
         * @param {{timestamp:number, latitude:number, longitude:number, speed:number|null, altitude:number|null, accuracy:number}} sample amostra GPS.
         * @param {string} currentPhase fase atual da máquina de estados.
         * @returns {{phaseSuggestion:string|null, event:string|null, confidence:number, metrics:object, reasonCodes:string[]}} decisão do motor.
         */
        evaluateSample(sample, currentPhase = FDR_PHASES.IDLE) {
            const reasonCodes = [];
            const prevSample = state.samples.at(-1) ?? null;

            if (isPoorAccuracy(sample, cfg)) {
                reasonCodes.push('REJECT_POINT_POOR_ACCURACY');
                return {
                    phaseSuggestion: null,
                    event: null,
                    confidence: 0,
                    metrics: defaultMetrics(sample),
                    reasonCodes,
                    debug: {
                        scores: {},
                        windowMetrics: {},
                        lastPoints: []
                    }
                };
            }

            const speedKt = resolveSpeedKt(sample, prevSample, reasonCodes, cfg);
            const altitudeFt = sample.altitude !== null ? metersToFeet(sample.altitude) : null;
            const verticalFpm = resolveVerticalSpeedFpm(sample, prevSample, reasonCodes);

            pushSample(state.samples, {
                ...sample,
                speedKt,
                altitudeFt,
                verticalFpm
            }, cfg.windows.altitudeSamples * 3);

            const speedSeries = state.samples.map(item => item.speedKt);
            const verticalSeries = state.samples
                .map(item => item.verticalFpm)
                .filter(value => Number.isFinite(value));
            const altitudeSeries = state.samples
                .map(item => item.altitudeFt)
                .filter(value => Number.isFinite(value));

            state.smoothedSpeedKt = exponentialSmoothing(speedSeries, cfg.smoothing.speedAlpha);
            state.smoothedVerticalFpm = verticalSeries.length
                ? exponentialSmoothing(verticalSeries, cfg.smoothing.verticalAlpha)
                : 0;

            const altitudeTrendFpm = computeAltitudeTrendFpm(state.samples, cfg.windows.trendSamples);

            const metrics = {
                speedKt,
                derivedSpeedKt: prevSample ? msToKnots(deriveSpeedMs(prevSample, sample) ?? 0) : null,
                smoothedSpeedKt: state.smoothedSpeedKt,
                altitudeFt,
                smoothedAltitudeFt: movingAverage(altitudeSeries, cfg.windows.altitudeSamples),
                verticalSpeedFpm: verticalFpm,
                smoothedVerticalFpm: state.smoothedVerticalFpm,
                altitudeTrendFpm
            };

            const scores = scorePhases(metrics, state, cfg, reasonCodes);
            const confidence = Math.min(cfg.confidence.maxScore, Math.max(...Object.values(scores), 0));

            const decision = decideTransition(currentPhase, scores, metrics, state, cfg, reasonCodes);
            return {
                phaseSuggestion: decision.phaseSuggestion,
                event: decision.event,
                confidence,
                metrics,
                reasonCodes,
                debug: {
                    scores,
                    windowMetrics: {
                        smoothedSpeedKt: state.smoothedSpeedKt,
                        smoothedVerticalFpm: state.smoothedVerticalFpm,
                        altitudeTrendFpm,
                        counters: state.counters
                    },
                    lastPoints: state.samples.slice(-5).map(item => ({
                        t: item.timestamp,
                        lat: Number(item.latitude.toFixed(5)),
                        lon: Number(item.longitude.toFixed(5)),
                        speedKt: Number((item.speedKt ?? 0).toFixed(1)),
                        altitudeFt: Number(((item.altitudeFt ?? 0)).toFixed(0)),
                        accuracy: Number((item.accuracy ?? 0).toFixed(1))
                    }))
                }
            };
        }
    };
}

function defaultMetrics(sample) {
    return {
        speedKt: sample.speed !== null ? msToKnots(sample.speed) : null,
        derivedSpeedKt: null,
        smoothedSpeedKt: 0,
        altitudeFt: sample.altitude !== null ? metersToFeet(sample.altitude) : null,
        smoothedAltitudeFt: null,
        verticalSpeedFpm: null,
        smoothedVerticalFpm: 0,
        altitudeTrendFpm: 0
    };
}

function isPoorAccuracy(sample, cfg) {
    return !sample || typeof sample.accuracy !== 'number' || sample.accuracy > cfg.gps.minUsableAccuracy;
}

function resolveSpeedKt(sample, prevSample, reasonCodes, cfg) {
    const gpsSpeedKt = sample.speed !== null ? msToKnots(sample.speed) : null;
    const derivedSpeedKt = prevSample ? msToKnots(deriveSpeedMs(prevSample, sample) ?? 0) : null;

    if (gpsSpeedKt !== null && gpsSpeedKt >= 0) {
        if (derivedSpeedKt !== null && Math.abs(gpsSpeedKt - derivedSpeedKt) > 25) {
            reasonCodes.push('SPEED_DERIVED_GPS_DIVERGENCE');
        }
        return gpsSpeedKt;
    }

    if (derivedSpeedKt !== null) {
        reasonCodes.push('SPEED_DERIVED_USED');
        return derivedSpeedKt;
    }

    reasonCodes.push('SPEED_UNAVAILABLE');
    return 0;
}

function resolveVerticalSpeedFpm(sample, prevSample, reasonCodes) {
    if (!prevSample || sample.altitude === null || prevSample.altitude === null) {
        return null;
    }

    const dtSeconds = safeTimeDiffSeconds(prevSample.timestamp, sample.timestamp);
    if (dtSeconds <= 0) {
        return null;
    }

    const deltaFeet = metersToFeet(sample.altitude - prevSample.altitude);
    const verticalFpm = (deltaFeet / dtSeconds) * 60;

    if (Math.abs(verticalFpm) > 4000) {
        reasonCodes.push('VERTICAL_SPEED_SPIKE_CLAMPED');
        return Math.sign(verticalFpm) * 4000;
    }

    return verticalFpm;
}

function pushSample(samples, next, maxSize) {
    samples.push(next);
    if (samples.length > maxSize) {
        samples.shift();
    }
}

function computeAltitudeTrendFpm(samples, trendWindow) {
    const recent = rollingWindow(samples, trendWindow).filter(item => Number.isFinite(item.altitudeFt));
    if (recent.length < 4) {
        return 0;
    }

    const middle = Math.floor(recent.length / 2);
    const firstHalf = recent.slice(0, middle).map(item => item.altitudeFt);
    const secondHalf = recent.slice(middle).map(item => item.altitudeFt);

    const firstAvg = movingAverage(firstHalf, firstHalf.length);
    const secondAvg = movingAverage(secondHalf, secondHalf.length);
    const dtSeconds = safeTimeDiffSeconds(recent[0].timestamp, recent.at(-1).timestamp);

    if (dtSeconds <= 0) {
        return 0;
    }

    return ((secondAvg - firstAvg) / dtSeconds) * 60;
}

function scorePhases(metrics, state, cfg, reasonCodes) {
    const scores = {
        taxi: 0,
        takeoff_roll: 0,
        airborne: 0,
        approach: 0,
        landing_roll: 0,
        ended: 0
    };

    if (metrics.smoothedSpeedKt >= cfg.thresholds.taxiMinKt && metrics.smoothedSpeedKt <= cfg.thresholds.taxiMaxKt) {
        scores.taxi += 45;
        reasonCodes.push('TAXI_SCORE_SPEED_IN_RANGE');
    }

    if (metrics.smoothedSpeedKt >= cfg.thresholds.takeoffRollMinKt) {
        scores.takeoff_roll += 40;
        reasonCodes.push('TAKEOFF_SCORE_SPEED_SUSTAINED');
    }

    if (metrics.smoothedSpeedKt >= cfg.thresholds.rotationMinKt) {
        scores.takeoff_roll += 20;
        reasonCodes.push('TAKEOFF_SCORE_ROTATION_SPEED_REACHED');
    }

    if ((metrics.smoothedVerticalFpm ?? 0) >= cfg.thresholds.airborneMinVSpeedFpm) {
        scores.airborne += 30;
        reasonCodes.push('TAKEOFF_SCORE_CLIMB_DETECTED');
    }

    if ((metrics.altitudeTrendFpm ?? 0) >= cfg.thresholds.airborneMinVSpeedFpm) {
        scores.airborne += 20;
        reasonCodes.push('AIRBORNE_SCORE_ALTITUDE_TREND_UP');
    }

    const baseline = state.flight.airborneBaselineFt ?? metrics.altitudeFt;
    if (metrics.altitudeFt !== null && baseline !== null
        && metrics.altitudeFt - baseline >= cfg.thresholds.airborneMinAltAglFt) {
        scores.airborne += 25;
        reasonCodes.push('AIRBORNE_SCORE_ALTITUDE_ABOVE_GROUND');
    }

    if ((metrics.smoothedVerticalFpm ?? 0) <= cfg.thresholds.approachMaxVSpeedFpm
        && metrics.smoothedSpeedKt <= cfg.thresholds.approachMaxKt) {
        scores.approach += 55;
        reasonCodes.push('APPROACH_SCORE_DESCENT_AND_SPEED');
    }

    if (metrics.smoothedSpeedKt <= cfg.thresholds.landingRollMaxKt) {
        scores.landing_roll += 35;
        reasonCodes.push('LANDING_SCORE_GROUNDSPEED_DROP');
    }

    if ((metrics.smoothedVerticalFpm ?? 0) < 80 && (metrics.smoothedVerticalFpm ?? 0) > -250) {
        scores.landing_roll += 20;
        reasonCodes.push('LANDING_SCORE_VERTICAL_STABILIZED');
    }

    if (metrics.altitudeFt !== null && baseline !== null
        && Math.abs(metrics.altitudeFt - baseline) <= cfg.thresholds.landingGroundAltFt) {
        scores.landing_roll += 20;
        reasonCodes.push('LANDING_SCORE_NEAR_GROUND_ALTITUDE');
    }

    if (metrics.smoothedSpeedKt <= cfg.thresholds.fullStopMaxKt) {
        scores.ended += 75;
        reasonCodes.push('ENDED_SCORE_NEAR_FULL_STOP');
    }

    return scores;
}

function decideTransition(currentPhase, scores, metrics, state, cfg, reasonCodes) {
    const scoreGate = cfg.confidence.minTransitionScore;
    const decision = { phaseSuggestion: null, event: null };

    const isTaxi = scores.taxi >= scoreGate;
    const isTakeoffRoll = scores.takeoff_roll >= scoreGate;
    const isAirborne = scores.airborne >= scoreGate;
    const isApproach = scores.approach >= scoreGate;
    const isLandingRoll = scores.landing_roll >= scoreGate;
    const isEnded = scores.ended >= scoreGate;

    bumpCounter(state.counters, 'taxi', isTaxi);
    bumpCounter(state.counters, 'takeoffRoll', isTakeoffRoll);
    bumpCounter(state.counters, 'airborne', isAirborne);
    bumpCounter(state.counters, 'approach', isApproach);
    bumpCounter(state.counters, 'landingRoll', isLandingRoll);
    bumpCounter(state.counters, 'ended', isEnded);

    if (currentPhase === FDR_PHASES.IDLE) {
        decision.phaseSuggestion = FDR_PHASES.PREFLIGHT;
        reasonCodes.push('TRANSITION_IDLE_TO_PREFLIGHT');
        if (metrics.altitudeFt !== null && state.flight.airborneBaselineFt === null) {
            state.flight.airborneBaselineFt = metrics.altitudeFt;
        }
        return decision;
    }

    if (currentPhase === FDR_PHASES.PREFLIGHT && reached(state.counters.taxi, cfg.debounceSamples.taxi)) {
        decision.phaseSuggestion = FDR_PHASES.TAXI;
        reasonCodes.push('TRANSITION_PREFLIGHT_TO_TAXI');
        return decision;
    }

    if (currentPhase === FDR_PHASES.TAXI) {
        if (reached(state.counters.takeoffRoll, cfg.debounceSamples.takeoffRoll)) {
            decision.phaseSuggestion = FDR_PHASES.TAKEOFF_ROLL;
            reasonCodes.push('TRANSITION_TAXI_TO_TAKEOFF_ROLL');
            return decision;
        }

        if (cfg.flags.allowTaxiEndWithoutTakeoff && reached(state.counters.ended, cfg.debounceSamples.ended)) {
            decision.phaseSuggestion = FDR_PHASES.ENDED;
            reasonCodes.push('TRANSITION_TAXI_TO_ENDED');
            return decision;
        }
    }

    if (currentPhase === FDR_PHASES.TAKEOFF_ROLL) {
        if (reached(state.counters.airborne, cfg.debounceSamples.airborne)) {
            decision.phaseSuggestion = FDR_PHASES.AIRBORNE;
            decision.event = 'takeoff';
            state.flight.takeoffAt = Date.now();
            state.flight.lastAirborneAt = state.flight.takeoffAt;
            reasonCodes.push('TRANSITION_TAKEOFF_ROLL_TO_AIRBORNE');
            return decision;
        }

        const decelReject = metrics.smoothedSpeedKt < (cfg.thresholds.takeoffRollMinKt - cfg.hysteresis.speedKt);
        bumpCounter(state.counters, 'rejectTakeoff', decelReject);
        if (reached(state.counters.rejectTakeoff, cfg.debounceSamples.rejectTakeoff)) {
            decision.phaseSuggestion = FDR_PHASES.TAXI;
            reasonCodes.push('TRANSITION_TAKEOFF_ROLL_TO_TAXI_REJECTED');
            return decision;
        }
    }

    if (currentPhase === FDR_PHASES.AIRBORNE) {
        state.flight.lastAirborneAt = Date.now();
        if (reached(state.counters.approach, cfg.debounceSamples.approach)) {
            decision.phaseSuggestion = FDR_PHASES.APPROACH;
            reasonCodes.push('TRANSITION_AIRBORNE_TO_APPROACH');
            return decision;
        }
    }

    if (currentPhase === FDR_PHASES.APPROACH) {
        const canLand = state.flight.takeoffAt
            ? safeTimeDiffSeconds(state.flight.takeoffAt, Date.now()) >= cfg.flightRules.minAirborneSecondsForLanding
            : true;

        if (canLand && reached(state.counters.landingRoll, cfg.debounceSamples.landingRoll)) {
            decision.phaseSuggestion = FDR_PHASES.LANDING_ROLL;
            reasonCodes.push('TRANSITION_APPROACH_TO_LANDING_ROLL');
            return decision;
        }

        const climbAgain = (metrics.smoothedVerticalFpm ?? 0) > (cfg.thresholds.airborneMinVSpeedFpm + cfg.hysteresis.verticalSpeedFpm);
        bumpCounter(state.counters, 'goAround', climbAgain);
        if (reached(state.counters.goAround, cfg.debounceSamples.goAround)) {
            decision.phaseSuggestion = FDR_PHASES.AIRBORNE;
            reasonCodes.push('TRANSITION_APPROACH_TO_AIRBORNE_GO_AROUND');
            return decision;
        }
    }

    if (currentPhase === FDR_PHASES.LANDING_ROLL) {
        const touchAndGo = (metrics.smoothedVerticalFpm ?? 0) > cfg.thresholds.airborneMinVSpeedFpm
            && metrics.smoothedSpeedKt > cfg.thresholds.takeoffRollMinKt;

        if (touchAndGo) {
            decision.phaseSuggestion = FDR_PHASES.AIRBORNE;
            reasonCodes.push('TRANSITION_LANDING_ROLL_TO_AIRBORNE_TOUCH_AND_GO');
            return decision;
        }

        if (reached(state.counters.ended, cfg.debounceSamples.ended)) {
            decision.phaseSuggestion = FDR_PHASES.ENDED;
            decision.event = 'landing';
            state.flight.landingAt = Date.now();
            reasonCodes.push('TRANSITION_LANDING_ROLL_TO_ENDED');
            return decision;
        }
    }

    return decision;
}

function bumpCounter(counters, key, condition) {
    counters[key] = condition ? counters[key] + 1 : 0;
}

function reached(value, needed) {
    return value >= needed;
}

function deepMerge(base, override) {
    const merged = { ...base };

    Object.keys(override).forEach(key => {
        const baseValue = base[key];
        const overrideValue = override[key];

        if (isObject(baseValue) && isObject(overrideValue)) {
            merged[key] = deepMerge(baseValue, overrideValue);
            return;
        }

        merged[key] = overrideValue;
    });

    return merged;
}

function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
