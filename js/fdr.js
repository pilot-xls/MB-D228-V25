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
    renderGpsAlert,
    renderLiveMetrics,
    renderPermissionState,
    renderPhase,
    renderSessionState,
    renderWakeLockAlert
} from './fdr/ui/fdr-screen.js';
import { renderSummary } from './fdr/ui/fdr-summary.js';
import { metersToFeet, msToKnots } from './fdr/utils/geo.js';
import { formatDuration, formatTimestamp, safeTimeDiffSeconds } from './fdr/utils/time.js';

/**
 * Bootstrap do módulo FDR.
 * Objetivo: ligar DOM, permissões, tracking, wake lock e estado de sessão ativa.
 */
async function initFdrPage() {
    const elements = mapDomElements();
    const machine = createStateMachine(FDR_CONFIG.defaultPhase);
    const detector = createDetectionEngine();
    const repository = createFdrRepository(FDR_CONFIG.storageKey);
    const geoService = createGeolocationService();

    let removeWakeVisibilityListener = () => {};
    let sessionClockId = null;

    /**
     * Estado ativo da sessão em memória (não persistente completo nesta fase).
     * Guarda metadados, métricas em tempo real, buffer de pontos e eventos base.
     */
    const activeSession = {
        startedAt: null,
        phase: machine.getPhase(),
        metrics: {
            gpsAccuracy: null,
            speedKt: null,
            altitudeFt: null,
            verticalSpeedFpm: null,
            confidence: 0
        },
        takeoffAt: null,
        landingAt: null,
        pointsBuffer: [],
        events: []
    };

    bindStaticActions(elements);
    subscribeGeolocation(geoService, elements, activeSession, detector, machine);
    renderPhase(elements.phaseIndicator, machine.getPhase());
    renderSessionState(elements.sessionStatus, 'stopped');
    await syncPermissionState(elements.permissionStatus);
    await populateAircraftProfiles(elements.aircraftProfile);
    setupInitialAlerts(elements);

    const savedSession = repository.loadSession();
    if (savedSession?.startedAt) {
        appendEventLog(elements.eventLog, 'Sessão anterior encontrada (snapshot).');
    }

    elements.btnStart.addEventListener('click', async () => {
        const permissionState = await syncPermissionState(elements.permissionStatus);
        if (permissionState === 'denied') {
            renderGpsAlert(elements.gpsAlert, {
                visible: true,
                tone: 'error',
                message: 'Permissão de localização negada. Ative nas definições do browser.'
            });
            appendSessionEvent(activeSession, 'start-blocked-permission-denied');
            appendEventLog(elements.eventLog, 'Início bloqueado: permissão negada.');
            return;
        }

        if (!geoService.startTracking()) {
            renderGpsAlert(elements.gpsAlert, {
                visible: true,
                tone: 'error',
                message: 'GPS indisponível neste dispositivo.'
            });
            appendSessionEvent(activeSession, 'start-blocked-gps-unsupported');
            return;
        }

        const toPreflight = machine.transition(FDR_PHASES.PREFLIGHT, { source: 'start-button' });
        if (!toPreflight.changed) {
            appendEventLog(elements.eventLog, 'Transição para preflight inválida.');
            geoService.stopTracking();
            return;
        }

        activeSession.startedAt = Date.now();
        activeSession.phase = machine.getPhase();
        appendSessionEvent(activeSession, 'tracking-started', { to: toPreflight.to });

        renderPhase(elements.phaseIndicator, machine.getPhase());
        renderSessionState(elements.sessionStatus, 'active');
        toggleTrackingButtons(elements, true);
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

        repository.saveSession({ startedAt: activeSession.startedAt, phase: activeSession.phase });
        appendEventLog(elements.eventLog, 'Tracking iniciado.');
        updateDebug(elements.debugOutput, { activeSession, geo: geoService.getStatus() });
    });

    elements.btnStop.addEventListener('click', async () => {
        stopSession({ elements, machine, geoService, activeSession, removeWakeVisibilityListener, sessionClockId });
        sessionClockId = null;
        removeWakeVisibilityListener = () => {};

        await releaseWakeLock();
        renderWakeLockAlert(elements.wakeLockAlert, { visible: false });

        repository.saveSession({ startedAt: null, phase: machine.getPhase() });
        appendEventLog(elements.eventLog, 'Tracking parado.');
        updateDebug(elements.debugOutput, { activeSession, geo: geoService.getStatus() });
    });

    elements.btnTakeoff.addEventListener('click', () => {
        const transitioned = machine.transition(FDR_PHASES.AIRBORNE, { source: 'manual' });
        if (transitioned.changed) {
            activeSession.phase = machine.getPhase();
            activeSession.takeoffAt = Date.now();
            appendSessionEvent(activeSession, 'manual-takeoff');
            renderPhase(elements.phaseIndicator, machine.getPhase());
            renderSummary(elements.summary, { takeoff: formatTimestamp(activeSession.takeoffAt) });
            appendEventLog(elements.eventLog, 'Takeoff manual registado.');
        }
    });

    elements.btnLanding.addEventListener('click', () => {
        const transitioned = machine.transition(FDR_PHASES.LANDING_ROLL, { source: 'manual' });
        if (transitioned.changed) {
            activeSession.phase = machine.getPhase();
            activeSession.landingAt = Date.now();
            appendSessionEvent(activeSession, 'manual-landing');
            renderPhase(elements.phaseIndicator, machine.getPhase());
            renderSummary(elements.summary, {
                landing: formatTimestamp(activeSession.landingAt),
                flyTime: calculateFlyTime(activeSession)
            });
            appendEventLog(elements.eventLog, 'Landing manual registado.');
        }
    });
}

/**
 * Regista subscrição ao serviço de geolocalização.
 * Atualiza estado de sessão/métricas e alertas em tempo real.
 */
function subscribeGeolocation(geoService, elements, activeSession, detector, machine) {
    geoService.subscribe(event => {
        if (event.type === 'point') {
            const point = event.payload;
            activeSession.pointsBuffer.push(point);
            if (activeSession.pointsBuffer.length > FDR_CONFIG.maxPointsBuffer) {
                activeSession.pointsBuffer.shift();
            }

            const detectionResult = detector.evaluateSample(point, machine.getPhase());
            applyDetectionDecision({ detectionResult, machine, activeSession, elements });
            activeSession.metrics = {
                gpsAccuracy: point.accuracy,
                speedKt: detectionResult.metrics.speedKt ?? (point.speed !== null ? msToKnots(point.speed) : null),
                altitudeFt: detectionResult.metrics.altitudeFt ?? (point.altitude !== null ? metersToFeet(point.altitude) : null),
                verticalSpeedFpm: detectionResult.metrics.smoothedVerticalFpm ?? detectionResult.metrics.verticalSpeedFpm ?? null,
                confidence: detectionResult.confidence
            };

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
            } else {
                renderGpsAlert(elements.gpsAlert, { visible: false });
            }

            updateDebug(elements.debugOutput, { activeSession, geo: geoService.getStatus() });
            return;
        }

        if (event.type === 'error') {
            renderGpsAlert(elements.gpsAlert, {
                visible: true,
                tone: 'error',
                message: 'Erro de leitura GPS. Verifique permissões e sinal.'
            });
            appendSessionEvent(activeSession, 'gps-error');
            appendEventLog(elements.eventLog, `Erro GPS: ${event.error.message}`);
            return;
        }

        if (event.type === 'unsupported') {
            renderGpsAlert(elements.gpsAlert, {
                visible: true,
                tone: 'error',
                message: 'GPS sem suporte neste browser/dispositivo.'
            });
            appendSessionEvent(activeSession, 'gps-unsupported');
            appendEventLog(elements.eventLog, 'Geolocation API indisponível.');
            return;
        }

        if (event.type === 'tracking-paused') {
            renderSessionState(elements.sessionStatus, 'paused');
            appendSessionEvent(activeSession, 'tracking-paused');
            appendEventLog(elements.eventLog, 'Tracking em pausa.');
            return;
        }

        if (event.type === 'tracking-resumed') {
            renderSessionState(elements.sessionStatus, 'active');
            appendSessionEvent(activeSession, 'tracking-resumed');
            appendEventLog(elements.eventLog, 'Tracking retomado.');
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
 * Aplica estado inicial de alertas da página.
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
 * Para sessão ativa e sincroniza UI/estado base.
 */
function stopSession({ elements, machine, geoService, activeSession, removeWakeVisibilityListener, sessionClockId }) {
    geoService.stopTracking();
    removeWakeVisibilityListener();

    if (sessionClockId) {
        clearInterval(sessionClockId);
    }

    machine.reset();
    activeSession.phase = machine.getPhase();
    appendSessionEvent(activeSession, 'tracking-stopped');

    renderPhase(elements.phaseIndicator, machine.getPhase());
    renderSessionState(elements.sessionStatus, 'stopped');
    toggleTrackingButtons(elements, false);
    renderGpsAlert(elements.gpsAlert, { visible: false });
}

/**
 * Inicia relógio da sessão para atualizar resumo em tempo real.
 */
function startSessionClock(elements, activeSession, clockRef, setClockRef) {
    if (clockRef) {
        clearInterval(clockRef);
    }

    const intervalId = setInterval(() => {
        if (!activeSession.startedAt) {
            return;
        }

        const elapsedSeconds = Math.floor((Date.now() - activeSession.startedAt) / 1000);
        renderSummary(elements.summary, { sessionTime: formatDuration(elapsedSeconds) });
    }, FDR_CONFIG.updateIntervalMs);

    setClockRef(intervalId);
}

/**
 * Aplica decisão do motor (transição + eventos) sem acoplar lógica ao render.
 * @param {object} args dependências da atualização.
 * @param {object} args.detectionResult output do motor de deteção.
 * @param {object} args.machine máquina de estados ativa.
 * @param {object} args.activeSession estado corrente da sessão.
 * @param {object} args.elements referências dos elementos UI.
 */
function applyDetectionDecision({ detectionResult, machine, activeSession, elements }) {
    if (detectionResult.phaseSuggestion) {
        const transitionResult = machine.transition(detectionResult.phaseSuggestion, {
            reasonCodes: detectionResult.reasonCodes,
            confidence: detectionResult.confidence
        });

        if (transitionResult.changed) {
            activeSession.phase = transitionResult.to;
            appendSessionEvent(activeSession, 'phase-transition', {
                from: transitionResult.from,
                to: transitionResult.to,
                reasonCodes: detectionResult.reasonCodes
            });
            renderPhase(elements.phaseIndicator, transitionResult.to);
            appendEventLog(elements.eventLog, `Fase ${transitionResult.from} → ${transitionResult.to}`);
        }
    }

    if (detectionResult.event === 'takeoff' && !activeSession.takeoffAt) {
        activeSession.takeoffAt = Date.now();
        appendSessionEvent(activeSession, 'auto-takeoff', { reasonCodes: detectionResult.reasonCodes });
        renderSummary(elements.summary, { takeoff: formatTimestamp(activeSession.takeoffAt) });
        appendEventLog(elements.eventLog, 'Takeoff automático confirmado.');
    }

    if (detectionResult.event === 'landing' && !activeSession.landingAt) {
        activeSession.landingAt = Date.now();
        appendSessionEvent(activeSession, 'auto-landing', { reasonCodes: detectionResult.reasonCodes });
        renderSummary(elements.summary, {
            landing: formatTimestamp(activeSession.landingAt),
            flyTime: calculateFlyTime(activeSession)
        });
        appendEventLog(elements.eventLog, 'Landing automático confirmado.');
    }
}

/**
 * Calcula fly time entre takeoff e landing.
 * @param {object} activeSession sessão ativa.
 * @returns {string} duração HH:MM:SS.
 */
function calculateFlyTime(activeSession) {
    if (!activeSession.takeoffAt) {
        return '00:00:00';
    }

    const endAt = activeSession.landingAt ?? Date.now();
    return formatDuration(safeTimeDiffSeconds(activeSession.takeoffAt, endAt));
}

/**
 * Adiciona evento base ao estado em memória.
 * @param {object} activeSession estado da sessão.
 * @param {string} type tipo do evento.
 */
function appendSessionEvent(activeSession, type, details = {}) {
    activeSession.events.push({ type, at: Date.now(), ...details });
}

/**
 * Mapeia elementos DOM usados pelo módulo FDR.
 * @returns {object} referências aos elementos da interface.
 */
function mapDomElements() {
    return {
        btnBack: document.getElementById('btn-back'),
        btnStart: document.getElementById('btn-start'),
        btnStop: document.getElementById('btn-stop'),
        btnTakeoff: document.getElementById('btn-takeoff'),
        btnLanding: document.getElementById('btn-landing'),
        permissionStatus: document.getElementById('permission-status'),
        sessionStatus: document.getElementById('session-status'),
        aircraftProfile: document.getElementById('aircraft-profile'),
        phaseIndicator: document.getElementById('phase-indicator'),
        eventLog: document.getElementById('event-log'),
        debugOutput: document.getElementById('debug-output'),
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
            sessionTime: document.getElementById('summary-session-time')
        }
    };
}

/**
 * Liga ações estáticas da página (ex: voltar ao menu).
 * @param {object} elements referências de UI.
 */
function bindStaticActions(elements) {
    elements.btnBack.addEventListener('click', () => {
        location.href = 'index.html';
    });
}

/**
 * Sincroniza estado da permissão GPS com a UI.
 * @returns {Promise<'granted'|'prompt'|'denied'>}
 */
async function syncPermissionState(permissionTarget) {
    const permissionState = await getLocationPermissionState();
    updatePermissionUi(permissionTarget, permissionState);
    renderPermissionState(permissionTarget, permissionState);
    return permissionState;
}

/**
 * Carrega perfis de aeronave no seletor.
 * @param {HTMLSelectElement} select seletor de perfis.
 */
async function populateAircraftProfiles(select) {
    try {
        const response = await fetch(FDR_CONFIG.profilesPath);
        const profiles = await response.json();

        select.innerHTML = '';
        profiles.forEach(profile => {
            const option = document.createElement('option');
            option.value = profile.id;
            option.textContent = `${profile.name} (${profile.type})`;
            select.appendChild(option);
        });
    } catch (error) {
        select.innerHTML = '<option value="">Erro ao carregar perfis</option>';
        console.warn('[FDR] Falha ao carregar perfis.', error);
    }
}

/**
 * Ativa/desativa botões conforme estado de tracking.
 * @param {object} elements elementos do ecrã.
 * @param {boolean} isTracking indica sessão ativa.
 */
function toggleTrackingButtons(elements, isTracking) {
    elements.btnStart.disabled = isTracking;
    elements.btnStop.disabled = !isTracking;
    elements.btnTakeoff.disabled = !isTracking;
    elements.btnLanding.disabled = !isTracking;
}

/**
 * Renderiza estado simplificado na secção de debug.
 * @param {HTMLElement} debugTarget elemento pre de debug.
 * @param {object} payload dados a apresentar.
 */
function updateDebug(debugTarget, payload) {
    debugTarget.textContent = JSON.stringify(payload, null, 2);
}

initFdrPage();
