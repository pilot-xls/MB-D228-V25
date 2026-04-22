import { FDR_CONFIG, FDR_PHASES } from './fdr/config.js';
import { createStateMachine } from './fdr/core/state-machine.js';
import { createDetectionEngine } from './fdr/core/detection-engine.js';
import { createGeolocationService } from './fdr/services/geolocation.js';
import { getLocationPermissionState, updatePermissionUi } from './fdr/services/permissions.js';
import {
    acquireWakeLock,
    isWakeLockSupported,
    releaseWakeLock,
    setupWakeLockAutoReacquire
} from './fdr/services/wake-lock.js';
import { createFdrRepository } from './fdr/storage/fdr-repository.js';
import {
    appendEventLog,
    renderDebugPanel,
    renderGpsAlert,
    renderLiveMetrics,
    renderPermissionState,
    renderPhase,
    renderSessionState,
    renderUxState,
    renderWakeLockAlert
} from './fdr/ui/fdr-screen.js';
import { buildSessionSummary, renderSummary } from './fdr/ui/fdr-summary.js';
import { metersToFeet, msToKnots } from './fdr/utils/geo.js';
import { formatTimestamp } from './fdr/utils/time.js';

/**
 * Bootstrap do módulo FDR.
 * Objetivo: iniciar persistência IndexedDB, restaurar sessão ativa e ligar UI/serviços.
 */
async function initFdrPage() {
    const elements = mapDomElements();
    const machine = createStateMachine(FDR_CONFIG.defaultPhase);
    const detector = createDetectionEngine();
    const repository = createFdrRepository();
    const geoService = createGeolocationService();

    let removeWakeVisibilityListener = () => {};
    let sessionClockId = null;

    /**
     * Estado em memória da sessão atual.
     * Mantém informação operacional da página e timeline para validação prática.
     */
    const activeSession = {
        id: null,
        startedAt: null,
        phase: machine.getPhase(),
        state: 'stopped',
        metrics: {
            gpsAccuracy: null,
            speedKt: null,
            altitudeFt: null,
            verticalSpeedFpm: null,
            confidence: 0
        },
        takeoffAutoAt: null,
        landingAutoAt: null,
        manualTakeoffAt: null,
        manualLandingAt: null,
        confidence: { avg: 0, max: 0, samples: 0 },
        timeline: [],
        debug: {
            reasonCodes: [],
            scores: {},
            windowMetrics: {},
            lastPoints: []
        }
    };

    bindStaticActions(elements);
    subscribeGeolocation(geoService, elements, activeSession, detector, machine, repository);

    await repository.initDb();
    await syncPermissionState(elements.permissionStatus);
    let selectedAircraft = await bindDefaultAircraft(elements.activeAircraftProfile);
    appendEventLog(elements.eventLog, `Perfil em uso: ${selectedAircraft.label}.`);
    appendAircraftProfileValidation(elements.eventLog, selectedAircraft.validation);

    const refreshSelectedAircraft = async () => {
        selectedAircraft = await bindDefaultAircraft(elements.activeAircraftProfile);
    };
    window.addEventListener('defaultAircraftChanged', refreshSelectedAircraft);
    window.addEventListener('storage', event => {
        if (event.key === 'defaultAircraft' || event.key === 'aircraftData') {
            refreshSelectedAircraft();
        }
    });

    renderPhase(elements.phaseIndicator, machine.getPhase());
    renderSessionState(elements.sessionStatus, 'stopped');
    setupInitialAlerts(elements);
    renderUxState(elements.uxState, { visible: true, tone: 'warning', message: 'Tracking parado.' });
    renderSummary(elements.summary, buildSessionSummary(null), []);

    const restoredSession = await restoreActiveSession(repository, elements, machine, activeSession);
    if (restoredSession) {
        const resumedAutomatically = await continueRestoredSession({
            elements,
            machine,
            repository,
            activeSession,
            geoService,
            removeWakeVisibilityListener,
            setWakeListener: listener => {
                removeWakeVisibilityListener = listener;
            },
            sessionClockId,
            setClockRef: id => {
                sessionClockId = id;
            }
        });

        if (!resumedAutomatically) {
            renderRecoveryBlock(elements, true, {
                sessionId: activeSession.id,
                phase: activeSession.phase
            });
        }
    }

    elements.btnContinueSession.addEventListener('click', async () => {
        await continueRestoredSession({
            elements,
            machine,
            repository,
            activeSession,
            geoService,
            removeWakeVisibilityListener,
            setWakeListener: listener => {
                removeWakeVisibilityListener = listener;
            },
            sessionClockId,
            setClockRef: id => {
                sessionClockId = id;
            }
        });
    });

    elements.btnTerminateSession.addEventListener('click', async () => {
        if (!activeSession.id) {
            return;
        }

        await repository.finalizeSession(activeSession.id, { phase: FDR_PHASES.ENDED, endedAt: Date.now() });
        await repository.appendEvent(activeSession.id, {
            type: 'session-terminated-from-restore',
            source: 'manual',
            timestamp: Date.now(),
            payload: { reason: 'user_terminated_restored_session' }
        });

        resetInMemorySession(activeSession, machine);
        renderRecoveryBlock(elements, false);
        renderSessionState(elements.sessionStatus, 'stopped');
        renderPhase(elements.phaseIndicator, machine.getPhase());
        updateSummaryFromSession(elements, activeSession);
        toggleTrackingButtons(elements, false);
        appendEventLog(elements.eventLog, 'Sessão restaurada foi terminada pelo utilizador.');
        renderUxState(elements.uxState, { visible: true, tone: 'warning', message: 'Sessão incompleta (terminada manualmente).' });
        updateDebug(elements.debug, activeSession, geoService.getStatus());
    });

    elements.btnStart.addEventListener('click', async () => {
        selectedAircraft = await bindDefaultAircraft(elements.activeAircraftProfile);
        const permissionState = await syncPermissionState(elements.permissionStatus);
        if (permissionState === 'denied') {
            renderGpsAlert(elements.gpsAlert, {
                visible: true,
                tone: 'error',
                message: 'Permissão de localização negada. Ative nas definições do browser.'
            });
            renderUxState(elements.uxState, { visible: true, tone: 'error', message: 'Sem permissão de localização.' });
            appendEventLog(elements.eventLog, 'Início bloqueado: permissão negada.');
            return;
        }

        if (!geoService.startTracking()) {
            renderGpsAlert(elements.gpsAlert, {
                visible: true,
                tone: 'error',
                message: 'GPS indisponível neste dispositivo.'
            });
            renderUxState(elements.uxState, { visible: true, tone: 'error', message: 'Sem GPS compatível neste dispositivo.' });
            return;
        }

        const toPreflight = machine.transition(FDR_PHASES.PREFLIGHT, { source: 'start-button' });
        if (!toPreflight.changed) {
            appendEventLog(elements.eventLog, 'Transição para preflight inválida.');
            geoService.stopTracking();
            return;
        }

        const newSession = await repository.createSession({
            phase: machine.getPhase(),
            aircraftProfileId: selectedAircraft.id || null,
            startedAt: Date.now()
        });

        hydrateSessionFromDb(activeSession, newSession, machine);
        activeSession.state = 'active';

        await repository.appendEvent(activeSession.id, {
            type: 'tracking-started',
            source: 'manual',
            timestamp: Date.now(),
            payload: { to: toPreflight.to }
        });

        renderPhase(elements.phaseIndicator, machine.getPhase());
        renderSessionState(elements.sessionStatus, 'active');
        toggleTrackingButtons(elements, true);
        renderRecoveryBlock(elements, false);
        startSessionClock(elements, activeSession, sessionClockId, id => {
            sessionClockId = id;
        });

        const wakeSupported = isWakeLockSupported();
        const wakeAcquired = await acquireWakeLock();
        renderWakeLockAlert(elements.wakeLockAlert, {
            visible: !wakeAcquired,
            message: wakeSupported
                ? 'Wake lock não pôde ser adquirido; mantenha o ecrã ativo manualmente.'
                : 'Wake lock indisponível neste browser; sessão continua normalmente.'
        });

        removeWakeVisibilityListener();
        removeWakeVisibilityListener = setupWakeLockAutoReacquire(acquired => {
            if (!acquired) {
                renderWakeLockAlert(elements.wakeLockAlert, {
                    visible: true,
                    message: 'Não foi possível reaquisição de wake lock após retorno da tab.'
                });
            }
        });

        appendTimelineEntry(activeSession, 'Tracking iniciado', Date.now(), 'manual');
        appendEventLog(elements.eventLog, 'Tracking iniciado e sessão persistida em IndexedDB.');
        renderUxState(elements.uxState, { visible: true, tone: 'ok', message: 'Tracking ativo.' });
        updateSummaryFromSession(elements, activeSession);
        updateDebug(elements.debug, activeSession, geoService.getStatus());
    });

    elements.btnStop.addEventListener('click', async () => {
        await stopSession({
            elements,
            machine,
            geoService,
            repository,
            activeSession,
            removeWakeVisibilityListener,
            sessionClockId
        });

        sessionClockId = null;
        removeWakeVisibilityListener = () => {};

        await releaseWakeLock();
        renderWakeLockAlert(elements.wakeLockAlert, { visible: false });

        appendTimelineEntry(activeSession, 'Tracking parado', Date.now(), 'manual');
        appendEventLog(elements.eventLog, 'Tracking parado e sessão finalizada.');
        renderUxState(elements.uxState, { visible: true, tone: 'warning', message: 'Tracking parado.' });
        updateDebug(elements.debug, activeSession, geoService.getStatus());
    });

}

/**
 * Restaura sessão ativa ao abrir a página, caso exista em IndexedDB.
 */
async function restoreActiveSession(repository, elements, machine, activeSession) {
    const restored = await repository.getActiveSession();
    if (!restored) {
        return false;
    }

    hydrateSessionFromDb(activeSession, restored, machine);
    renderSessionState(elements.sessionStatus, 'paused');
    renderPhase(elements.phaseIndicator, activeSession.phase);
    updateSummaryFromSession(elements, activeSession);
    renderRecoveryBlock(elements, false);

    renderUxState(elements.uxState, { visible: true, tone: 'warning', message: 'Sessão restaurada. Retoma automática em curso...' });
    appendEventLog(elements.eventLog, `Sessão ativa restaurada (${restored.id.slice(0, 8)}...). A retomar automaticamente.`);
    return true;
}

/**
 * Continua sessão restaurada, retomando tracking sem perder histórico.
 */
async function continueRestoredSession(args) {
    const {
        elements,
        machine,
        repository,
        activeSession,
        geoService,
        removeWakeVisibilityListener,
        setWakeListener,
        sessionClockId,
        setClockRef
    } = args;

    if (!activeSession.id) {
        return false;
    }

    const permissionState = await syncPermissionState(elements.permissionStatus);
    if (permissionState === 'denied') {
        appendEventLog(elements.eventLog, 'Continuação bloqueada: permissão negada.');
        renderUxState(elements.uxState, { visible: true, tone: 'error', message: 'Sem permissão de localização.' });
        return false;
    }

    if (!geoService.startTracking()) {
        appendEventLog(elements.eventLog, 'Continuação bloqueada: GPS indisponível.');
        return false;
    }

    await repository.updateSessionState(activeSession.id, {
        state: 'active',
        phase: activeSession.phase,
        metricsSnapshot: activeSession.metrics
    });
    await repository.appendEvent(activeSession.id, {
        type: 'tracking-resumed-after-restore',
        source: 'manual',
        timestamp: Date.now()
    });

    machine.transition(activeSession.phase, { source: 'restore' });
    renderSessionState(elements.sessionStatus, 'active');
    renderPhase(elements.phaseIndicator, activeSession.phase);
    renderRecoveryBlock(elements, false);
    toggleTrackingButtons(elements, true);

    startSessionClock(elements, activeSession, sessionClockId, setClockRef);

    removeWakeVisibilityListener();
    const wakeAcquired = await acquireWakeLock();
    if (!wakeAcquired) {
        renderWakeLockAlert(elements.wakeLockAlert, {
            visible: true,
            message: 'Wake lock indisponível durante continuação; mantenha ecrã ativo manualmente.'
        });
    }

    setWakeListener(setupWakeLockAutoReacquire(() => {}));
    renderUxState(elements.uxState, { visible: true, tone: 'ok', message: 'Tracking ativo (sessão restaurada).' });
    appendEventLog(elements.eventLog, 'Sessão restaurada retomada com sucesso.');
    return true;
}

/**
 * Regista subscrição ao serviço de geolocalização.
 * Atualiza UI e persiste pontos/eventos da sessão ativa de forma progressiva.
 */
function subscribeGeolocation(geoService, elements, activeSession, detector, machine, repository) {
    geoService.subscribe(async event => {
        if (event.type === 'point') {
            await processIncomingPoint(event.payload, detector, machine, activeSession, elements, repository);
            return;
        }

        if (event.type === 'error') {
            renderGpsAlert(elements.gpsAlert, {
                visible: true,
                tone: 'error',
                message: 'Erro de leitura GPS. Verifique permissões e sinal.'
            });
            renderUxState(elements.uxState, { visible: true, tone: 'error', message: 'Falha de leitura GPS.' });
            appendEventLog(elements.eventLog, `Erro GPS: ${event.error.message}`);
            if (activeSession.id) {
                await repository.appendEvent(activeSession.id, {
                    type: 'gps-error',
                    source: 'system',
                    payload: { message: event.error.message },
                    timestamp: Date.now()
                });
            }
            return;
        }

        if (event.type === 'unsupported') {
            renderGpsAlert(elements.gpsAlert, {
                visible: true,
                tone: 'error',
                message: 'GPS sem suporte neste browser/dispositivo.'
            });
            renderUxState(elements.uxState, { visible: true, tone: 'error', message: 'GPS não suportado.' });
            appendEventLog(elements.eventLog, 'Geolocation API indisponível.');
            return;
        }

        if (event.type === 'tracking-paused') {
            renderSessionState(elements.sessionStatus, 'paused');
            renderUxState(elements.uxState, { visible: true, tone: 'warning', message: 'Tracking em pausa.' });
            appendEventLog(elements.eventLog, 'Tracking em pausa.');
            if (activeSession.id) {
                await repository.appendEvent(activeSession.id, {
                    type: 'tracking-paused',
                    source: 'system',
                    timestamp: Date.now()
                });
                await repository.updateSessionState(activeSession.id, { state: 'paused' });
            }
            return;
        }

        if (event.type === 'tracking-resumed') {
            renderSessionState(elements.sessionStatus, 'active');
            renderUxState(elements.uxState, { visible: true, tone: 'ok', message: 'Tracking retomado.' });
            appendEventLog(elements.eventLog, 'Tracking retomado.');
            if (activeSession.id) {
                await repository.appendEvent(activeSession.id, {
                    type: 'tracking-resumed',
                    source: 'system',
                    timestamp: Date.now()
                });
                await repository.updateSessionState(activeSession.id, { state: 'active' });
            }
            return;
        }

        if (event.type === 'tracking-stopped') {
            machine.reset();
            activeSession.phase = machine.getPhase();
            renderPhase(elements.phaseIndicator, machine.getPhase());
            renderSessionState(elements.sessionStatus, 'stopped');
        }
    });
}

/**
 * Processa um ponto GPS para deteção, persistência e UI.
 */
async function processIncomingPoint(point, detector, machine, activeSession, elements, repository) {
    const detectionResult = detector.evaluateSample(point, machine.getPhase());

    activeSession.metrics = {
        gpsAccuracy: point.accuracy,
        speedKt: detectionResult.metrics.speedKt ?? (point.speed !== null ? msToKnots(point.speed) : null),
        altitudeFt: detectionResult.metrics.altitudeFt ?? (point.altitude !== null ? metersToFeet(point.altitude) : null),
        verticalSpeedFpm: detectionResult.metrics.smoothedVerticalFpm ?? detectionResult.metrics.verticalSpeedFpm ?? null,
        confidence: detectionResult.confidence
    };

    activeSession.debug.reasonCodes = detectionResult.reasonCodes ?? [];
    activeSession.debug.scores = detectionResult.debug?.scores ?? {};
    activeSession.debug.windowMetrics = detectionResult.debug?.windowMetrics ?? {};
    activeSession.debug.lastPoints = detectionResult.debug?.lastPoints ?? [];

    renderLiveMetrics(elements.metrics, {
        gpsAccuracy: `${Math.round(point.accuracy)} m`,
        speed: activeSession.metrics.speedKt !== null ? `${activeSession.metrics.speedKt.toFixed(1)} kt` : '-- kt',
        altitude: activeSession.metrics.altitudeFt !== null ? `${activeSession.metrics.altitudeFt.toFixed(0)} ft` : '-- ft',
        vspeed: activeSession.metrics.verticalSpeedFpm !== null ? `${Math.round(activeSession.metrics.verticalSpeedFpm)} ft/min` : '-- ft/min',
        confidence: `${Math.round(detectionResult.confidence)} %`
    });

    if (point.accuracy > FDR_CONFIG.gps.weakAccuracyThreshold) {
        renderGpsAlert(elements.gpsAlert, {
            visible: true,
            tone: 'warning',
            message: `Sinal GPS fraco (${Math.round(point.accuracy)} m).`
        });
        renderUxState(elements.uxState, { visible: true, tone: 'warning', message: 'GPS fraco.' });
    } else {
        renderGpsAlert(elements.gpsAlert, { visible: false });
        if (detectionResult.confidence < 60) {
            renderUxState(elements.uxState, { visible: true, tone: 'warning', message: 'Baixa confiança de deteção.' });
        } else if (activeSession.state === 'active') {
            renderUxState(elements.uxState, { visible: true, tone: 'ok', message: 'Tracking ativo.' });
        }
    }

    await applyDetectionDecision({
        detectionResult,
        machine,
        activeSession,
        elements,
        repository
    });

    const phaseInfo = deriveOperationalPhase(detectionResult.metrics, activeSession.phase);
    renderPhase(elements.phaseIndicator, phaseInfo.displayPhase);

    if (activeSession.id) {
        await repository.appendPoint(activeSession.id, point, detectionResult.confidence);
        const sessionPatch = {
            phase: activeSession.phase,
            metricsSnapshot: activeSession.metrics,
            confidence: activeSession.confidence
        };
        const updated = await repository.updateSessionState(activeSession.id, sessionPatch);
        if (updated) {
            activeSession.confidence = updated.confidence ?? activeSession.confidence;
        }
    }

    updateSummaryFromSession(elements, activeSession);
    updateDebug(elements.debug, activeSession, { isTracking: true, isPaused: false });
}

/**
 * Aplica estado inicial dos alertas da página.
 */
function setupInitialAlerts(elements) {
    renderGpsAlert(elements.gpsAlert, { visible: false });

    if (!isWakeLockSupported()) {
        renderWakeLockAlert(elements.wakeLockAlert, {
            visible: true,
            message: 'Wake lock indisponível neste browser; tracking continua disponível.'
        });
    } else {
        renderWakeLockAlert(elements.wakeLockAlert, { visible: false });
    }
}

/**
 * Para sessão ativa, finaliza-a em IndexedDB e sincroniza UI.
 */
async function stopSession({ elements, machine, geoService, repository, activeSession, removeWakeVisibilityListener, sessionClockId }) {
    geoService.stopTracking();
    removeWakeVisibilityListener();

    if (sessionClockId) {
        clearInterval(sessionClockId);
    }

    if (activeSession.id) {
        await repository.appendEvent(activeSession.id, {
            type: 'tracking-stopped',
            source: 'manual',
            timestamp: Date.now()
        });
        await repository.finalizeSession(activeSession.id, { phase: FDR_PHASES.ENDED, endedAt: Date.now() });
    }

    machine.reset();
    activeSession.phase = machine.getPhase();
    activeSession.state = 'stopped';

    renderPhase(elements.phaseIndicator, machine.getPhase());
    renderSessionState(elements.sessionStatus, 'stopped');
    toggleTrackingButtons(elements, false);
    renderGpsAlert(elements.gpsAlert, { visible: false });

    updateSummaryFromSession(elements, {
        ...activeSession,
        endedAt: Date.now()
    });
}

/**
 * Inicia relógio para atualizar Session time e Fly time em tempo real.
 */
function startSessionClock(elements, activeSession, clockRef, setClockRef) {
    if (clockRef) {
        clearInterval(clockRef);
    }

    const intervalId = setInterval(() => {
        if (!activeSession.startedAt) {
            return;
        }
        updateSummaryFromSession(elements, activeSession);
    }, FDR_CONFIG.updateIntervalMs);

    setClockRef(intervalId);
}

/**
 * Aplica sugestões do motor (fase + eventos auto) e persiste alterações da sessão.
 */
async function applyDetectionDecision({ detectionResult, machine, activeSession, elements, repository }) {
    if (detectionResult.phaseSuggestion) {
        const transitionResult = machine.transition(detectionResult.phaseSuggestion, {
            reasonCodes: detectionResult.reasonCodes,
            confidence: detectionResult.confidence
        });

        if (transitionResult.changed) {
            activeSession.phase = transitionResult.to;
            renderPhase(elements.phaseIndicator, transitionResult.to);
            appendEventLog(elements.eventLog, `Fase ${transitionResult.from} → ${transitionResult.to}`);

            if (activeSession.id) {
                await repository.appendEvent(activeSession.id, {
                    type: 'phase-transition',
                    source: 'auto',
                    timestamp: Date.now(),
                    payload: {
                        from: transitionResult.from,
                        to: transitionResult.to,
                        reasonCodes: detectionResult.reasonCodes
                    }
                });
                await repository.updateSessionState(activeSession.id, { phase: transitionResult.to });
            }
        }
    }

    if (detectionResult.event === 'takeoff' && !activeSession.takeoffAutoAt) {
        activeSession.takeoffAutoAt = Date.now();
        if (!activeSession.manualTakeoffAt) {
            activeSession.takeoffSource = 'auto';
        }

        if (activeSession.id) {
            await repository.updateSessionState(activeSession.id, {
                takeoffAutoAt: activeSession.takeoffAutoAt,
                takeoffSource: activeSession.manualTakeoffAt ? 'manual' : 'auto'
            });
            await repository.appendEvent(activeSession.id, {
                type: 'auto-takeoff',
                source: 'auto',
                timestamp: activeSession.takeoffAutoAt,
                payload: { reasonCodes: detectionResult.reasonCodes }
            });
        }

        appendTimelineEntry(activeSession, 'Takeoff automático', activeSession.takeoffAutoAt, 'auto');
        appendEventLog(elements.eventLog, 'Takeoff automático confirmado.');
    }

    if (detectionResult.event === 'landing' && !activeSession.landingAutoAt) {
        activeSession.landingAutoAt = Date.now();
        if (!activeSession.manualLandingAt) {
            activeSession.landingSource = 'auto';
        }

        if (activeSession.id) {
            await repository.updateSessionState(activeSession.id, {
                landingAutoAt: activeSession.landingAutoAt,
                landingSource: activeSession.manualLandingAt ? 'manual' : 'auto'
            });
            await repository.appendEvent(activeSession.id, {
                type: 'auto-landing',
                source: 'auto',
                timestamp: activeSession.landingAutoAt,
                payload: { reasonCodes: detectionResult.reasonCodes }
            });
        }

        appendTimelineEntry(activeSession, 'Landing automático', activeSession.landingAutoAt, 'auto');
        appendEventLog(elements.eventLog, 'Landing automático confirmado.');
    }
}

/**
 * Mapeia elementos DOM usados pelo módulo FDR.
 */
function mapDomElements() {
    return {
        btnStart: document.getElementById('btn-start'),
        btnStop: document.getElementById('btn-stop'),
        btnContinueSession: document.getElementById('btn-continue-session'),
        btnTerminateSession: document.getElementById('btn-terminate-session'),
        recoveryPanel: document.getElementById('recovery-panel'),
        recoveryDetails: document.getElementById('recovery-details'),
        permissionStatus: document.getElementById('permission-status'),
        sessionStatus: document.getElementById('session-status'),
        activeAircraftProfile: document.getElementById('active-aircraft-profile'),
        phaseIndicator: document.getElementById('phase-indicator'),
        eventLog: document.getElementById('event-log'),
        uxState: document.getElementById('ux-state'),
        gpsAlert: document.getElementById('gps-alert'),
        wakeLockAlert: document.getElementById('wake-lock-alert'),
        metrics: {
            gpsAccuracy: document.getElementById('metric-gps-accuracy'),
            speed: document.getElementById('metric-speed'),
            altitude: document.getElementById('metric-altitude'),
            vspeed: document.getElementById('metric-vspeed'),
            confidence: document.getElementById('metric-confidence')
        },
        summary: {
            takeoff: document.getElementById('summary-takeoff'),
            landing: document.getElementById('summary-landing'),
            flyTime: document.getElementById('summary-fly-time'),
            sessionTime: document.getElementById('summary-session-time'),
            confidence: document.getElementById('summary-confidence'),
            takeoffSource: document.getElementById('summary-takeoff-source'),
            landingSource: document.getElementById('summary-landing-source'),
            timeline: document.getElementById('summary-timeline')
        },
        debug: {
            phase: document.getElementById('debug-phase'),
            gpsQuality: document.getElementById('debug-gps-quality'),
            takeoff: document.getElementById('debug-takeoff'),
            landing: document.getElementById('debug-landing'),
            scores: document.getElementById('debug-scores'),
            windowMetrics: document.getElementById('debug-window'),
            points: document.getElementById('debug-points'),
            reasons: document.getElementById('debug-reasons')
        }
    };
}

function bindStaticActions() {}

/**
 * Sincroniza estado da permissão GPS com a UI.
 */
async function syncPermissionState(permissionTarget) {
    const permissionState = await getLocationPermissionState();
    updatePermissionUi(permissionTarget, permissionState);
    renderPermissionState(permissionTarget, permissionState);
    return permissionState;
}

/**
 * Carrega perfis de aeronave no seletor.
 */
async function bindDefaultAircraft(profileOutput) {
    const aircraftData = safeParseJson(localStorage.getItem('aircraftData'), {});
    const defaultAircraftId = localStorage.getItem('defaultAircraft') || '';
    const aircraft = aircraftData[defaultAircraftId] ?? null;
    const profileIdLabel = aircraft?.ID || defaultAircraftId || 'Sem aeronave default definida';
    const profileLabel = defaultAircraftId && aircraft
        ? `${profileIdLabel} (${defaultAircraftId})`
        : profileIdLabel;

    if (profileOutput) {
        profileOutput.textContent = profileLabel;
    }

    return {
        id: defaultAircraftId,
        label: profileLabel,
        aircraft,
        validation: validateAircraftProfileForFdr(defaultAircraftId, aircraft)
    };
}

function validateAircraftProfileForFdr(defaultAircraftId, aircraft) {
    const required = [
        { field: 'defaultAircraft', valid: Boolean(defaultAircraftId), detail: defaultAircraftId || 'não definido' },
        { field: 'aircraftData[defaultAircraft]', valid: Boolean(aircraft), detail: aircraft ? 'ok' : 'registo não encontrado' },
        { field: 'ID', valid: Boolean(aircraft?.ID), detail: aircraft?.ID || 'em falta' }
    ];

    return {
        isValid: required.every(item => item.valid),
        required
    };
}

function appendAircraftProfileValidation(eventLogElement, validation) {
    if (!validation) {
        return;
    }

    if (validation.isValid) {
        appendEventLog(eventLogElement, 'Perfil FDR válido: defaultAircraft + registo + ID disponíveis.');
        return;
    }

    const missing = validation.required
        .filter(item => !item.valid)
        .map(item => `${item.field} (${item.detail})`)
        .join(', ');
    appendEventLog(eventLogElement, `Perfil FDR incompleto: ${missing}.`);
}

function safeParseJson(value, fallback) {
    if (!value) {
        return fallback;
    }

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

/**
 * Mostra/oculta bloco de recuperação e atualiza respetivos detalhes.
 */
function renderRecoveryBlock(elements, visible, details = null) {
    elements.recoveryPanel.hidden = !visible;
    if (!visible) {
        elements.recoveryDetails.textContent = '';
        return;
    }

    elements.recoveryDetails.textContent = details
        ? `Sessão ${details.sessionId.slice(0, 8)}… | fase ${details.phase} | pontos ${details.pointsCount ?? 0} | eventos ${details.eventsCount ?? 0}`
        : 'Sessão ativa encontrada.';
}

/**
 * Atualiza estado dos botões de controlo de tracking.
 */
function toggleTrackingButtons(elements, isTracking) {
    elements.btnStart.disabled = isTracking;
    elements.btnStop.disabled = !isTracking;
}

function deriveOperationalPhase(metrics, machinePhase) {
    if (machinePhase === FDR_PHASES.TAXI) {
        return { displayPhase: 'TAXI' };
    }
    if (machinePhase === FDR_PHASES.TAKEOFF_ROLL) {
        return { displayPhase: 'TAKEOFF' };
    }
    if (machinePhase === FDR_PHASES.LANDING_ROLL || machinePhase === FDR_PHASES.ENDED) {
        return { displayPhase: 'LANDING' };
    }
    if (machinePhase === FDR_PHASES.AIRBORNE) {
        const vertical = metrics?.smoothedVerticalFpm ?? 0;
        if (vertical >= 300) {
            return { displayPhase: 'CLIMB' };
        }
        if (vertical <= -300) {
            return { displayPhase: 'DESCENT' };
        }
        return { displayPhase: 'CRUISE' };
    }
    if (machinePhase === FDR_PHASES.APPROACH) {
        return { displayPhase: 'DESCENT' };
    }
    return { displayPhase: 'IDLE' };
}

/**
 * Hidrata estado em memória com sessão persistida.
 */
function hydrateSessionFromDb(activeSession, session, machine) {
    activeSession.id = session.id;
    activeSession.startedAt = session.startedAt;
    activeSession.phase = session.phase ?? FDR_PHASES.IDLE;
    activeSession.state = session.state ?? 'paused';
    activeSession.metrics = session.metricsSnapshot ?? activeSession.metrics;
    activeSession.takeoffAutoAt = session.takeoffAutoAt ?? null;
    activeSession.landingAutoAt = session.landingAutoAt ?? null;
    activeSession.manualTakeoffAt = session.manualTakeoffAt ?? null;
    activeSession.manualLandingAt = session.manualLandingAt ?? null;
    activeSession.takeoffSource = session.takeoffSource ?? null;
    activeSession.landingSource = session.landingSource ?? null;
    activeSession.confidence = session.confidence ?? { avg: 0, max: 0, samples: 0 };
    syncMachineToPhase(machine, activeSession.phase);
}

/**
 * Sincroniza máquina de estados para uma fase alvo seguindo o fluxo permitido.
 */
function syncMachineToPhase(machine, targetPhase) {
    machine.reset();
    if (targetPhase === FDR_PHASES.IDLE) {
        return;
    }

    const phasePath = [
        FDR_PHASES.PREFLIGHT,
        FDR_PHASES.TAXI,
        FDR_PHASES.TAKEOFF_ROLL,
        FDR_PHASES.AIRBORNE,
        FDR_PHASES.APPROACH,
        FDR_PHASES.LANDING_ROLL,
        FDR_PHASES.ENDED
    ];

    for (const phase of phasePath) {
        if (machine.canTransition(phase)) {
            machine.transition(phase, { source: 'restore-sync' });
        }
        if (phase === targetPhase) {
            break;
        }
    }
}

/**
 * Reinicia estado em memória após terminar sessão.
 */
function resetInMemorySession(activeSession, machine) {
    machine.reset();
    activeSession.id = null;
    activeSession.startedAt = null;
    activeSession.phase = FDR_PHASES.IDLE;
    activeSession.state = 'stopped';
    activeSession.takeoffAutoAt = null;
    activeSession.landingAutoAt = null;
    activeSession.manualTakeoffAt = null;
    activeSession.manualLandingAt = null;
    activeSession.takeoffSource = null;
    activeSession.landingSource = null;
    activeSession.confidence = { avg: 0, max: 0, samples: 0 };
    activeSession.timeline = [];
    activeSession.debug = {
        reasonCodes: [],
        scores: {},
        windowMetrics: {},
        lastPoints: []
    };
}

/**
 * Adiciona item de timeline para resumo final com fonte auto/manual.
 */
function appendTimelineEntry(activeSession, label, timestamp, source) {
    activeSession.timeline.push({ label, timestamp, source });
}

/**
 * Renderiza resumo a partir da sessão atual em memória.
 */
function updateSummaryFromSession(elements, activeSession) {
    const timeline = [
        { label: 'Takeoff', timestamp: activeSession.manualTakeoffAt ?? activeSession.takeoffAutoAt, source: activeSession.manualTakeoffAt ? 'manual' : activeSession.takeoffAutoAt ? 'auto' : null },
        { label: 'Landing', timestamp: activeSession.manualLandingAt ?? activeSession.landingAutoAt, source: activeSession.manualLandingAt ? 'manual' : activeSession.landingAutoAt ? 'auto' : null },
        ...activeSession.timeline.slice(-6)
    ].filter(item => item.timestamp || item.label === 'Takeoff' || item.label === 'Landing');

    renderSummary(elements.summary, buildSessionSummary(activeSession), timeline);
}

/**
 * Renderiza painel de debug em formato operacional para validação em campo.
 */
function updateDebug(debugFields, activeSession, geoStatus) {
    const takeoffAt = activeSession.manualTakeoffAt ?? activeSession.takeoffAutoAt;
    const landingAt = activeSession.manualLandingAt ?? activeSession.landingAutoAt;

    const gpsQuality = activeSession.metrics.gpsAccuracy === null
        ? '--'
        : activeSession.metrics.gpsAccuracy <= FDR_CONFIG.gps.weakAccuracyThreshold
            ? 'boa'
            : 'fraca';

    renderDebugPanel(debugFields, {
        phase: activeSession.phase,
        gpsQuality: `${gpsQuality} (${Math.round(activeSession.metrics.gpsAccuracy ?? 0)}m)`,
        takeoffAt: takeoffAt ? formatTimestamp(takeoffAt) : '--',
        landingAt: landingAt ? formatTimestamp(landingAt) : '--',
        reasonCodes: activeSession.debug.reasonCodes,
        scores: activeSession.debug.scores,
        windowMetrics: {
            ...activeSession.debug.windowMetrics,
            geoStatus
        },
        lastPoints: activeSession.debug.lastPoints
    });
}

initFdrPage();
