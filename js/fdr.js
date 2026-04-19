import { FDR_CONFIG } from './fdr/config.js';
import { createStateMachine } from './fdr/core/state-machine.js';
import { createDetectionEngine } from './fdr/core/detection-engine.js';
import { startGeolocationWatch } from './fdr/services/geolocation.js';
import { getLocationPermissionState } from './fdr/services/permissions.js';
import { releaseWakeLock, requestWakeLock } from './fdr/services/wake-lock.js';
import { createFdrRepository } from './fdr/storage/fdr-repository.js';
import { appendEventLog, renderPermissionState, renderPhase } from './fdr/ui/fdr-screen.js';
import { renderSummary } from './fdr/ui/fdr-summary.js';
import { metersToFeet, msToKnots } from './fdr/utils/geo.js';
import { formatDuration } from './fdr/utils/time.js';

/**
 * Bootstrap do módulo FDR.
 * Objetivo: ligar DOM, estado base e serviços sem implementar motor final nesta fase.
 */
async function initFdrPage() {
    const elements = mapDomElements();
    const machine = createStateMachine(FDR_CONFIG.defaultPhase);
    const detector = createDetectionEngine();
    const repository = createFdrRepository(FDR_CONFIG.storageKey);

    let geoController = null;
    let sessionStartedAt = null;

    bindStaticActions(elements);
    renderPhase(elements.phaseIndicator, machine.getPhase());
    await renderPermission(elements.permissionStatus);
    await populateAircraftProfiles(elements.aircraftProfile);

    const savedSession = repository.loadSession();
    if (savedSession?.startedAt) {
        appendEventLog(elements.eventLog, 'Sessão anterior encontrada (base).');
    }

    setInterval(() => {
        if (!sessionStartedAt) {
            return;
        }

        const elapsedSeconds = Math.floor((Date.now() - sessionStartedAt) / 1000);
        renderSummary(elements.summary, { sessionTime: formatDuration(elapsedSeconds) });
    }, FDR_CONFIG.updateIntervalMs);

    elements.btnStart.addEventListener('click', async () => {
        const transitioned = machine.transition('TRACKING');
        if (!transitioned) {
            appendEventLog(elements.eventLog, 'Transição para TRACKING inválida.');
            return;
        }

        renderPhase(elements.phaseIndicator, machine.getPhase());
        toggleTrackingButtons(elements, true);
        sessionStartedAt = Date.now();

        const wakeLockEnabled = await requestWakeLock();
        appendEventLog(elements.eventLog, wakeLockEnabled ? 'Wake lock ativo.' : 'Wake lock não suportado.');

        geoController = startGeolocationWatch({
            onPosition: position => {
                updateMetricsFromPosition(elements, position);
                const detectionResult = detector.evaluateSample(position.coords);
                elements.metricConfidence.textContent = `${Math.round(detectionResult.confidence)} %`;
            },
            onError: error => {
                appendEventLog(elements.eventLog, `Erro GPS: ${error.message}`);
            }
        });

        repository.saveSession({ startedAt: sessionStartedAt, phase: machine.getPhase() });
        appendEventLog(elements.eventLog, 'Tracking iniciado.');
        updateDebug(elements.debugOutput, { state: machine.getPhase(), sessionStartedAt });
    });

    elements.btnStop.addEventListener('click', async () => {
        geoController?.stop();
        geoController = null;
        await releaseWakeLock();

        machine.transition('IDLE');
        renderPhase(elements.phaseIndicator, machine.getPhase());
        toggleTrackingButtons(elements, false);
        appendEventLog(elements.eventLog, 'Tracking parado.');
        updateDebug(elements.debugOutput, { state: machine.getPhase(), sessionStartedAt });
    });

    elements.btnTakeoff.addEventListener('click', () => {
        const transitioned = machine.transition('AIRBORNE');
        if (transitioned) {
            renderPhase(elements.phaseIndicator, machine.getPhase());
            renderSummary(elements.summary, { takeoff: new Date().toLocaleTimeString('pt-PT', { hour12: false }) });
            appendEventLog(elements.eventLog, 'Takeoff manual registado.');
        }
    });

    elements.btnLanding.addEventListener('click', () => {
        const transitioned = machine.transition('TRACKING');
        if (transitioned) {
            renderPhase(elements.phaseIndicator, machine.getPhase());
            renderSummary(elements.summary, { landing: new Date().toLocaleTimeString('pt-PT', { hour12: false }) });
            appendEventLog(elements.eventLog, 'Landing manual registado.');
        }
    });
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
        aircraftProfile: document.getElementById('aircraft-profile'),
        phaseIndicator: document.getElementById('phase-indicator'),
        eventLog: document.getElementById('event-log'),
        debugOutput: document.getElementById('debug-output'),
        metricGpsAccuracy: document.getElementById('metric-gps-accuracy'),
        metricSpeed: document.getElementById('metric-speed'),
        metricAltitude: document.getElementById('metric-altitude'),
        metricVspeed: document.getElementById('metric-vspeed'),
        metricConfidence: document.getElementById('metric-confidence'),
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
 * Atualiza estado visual da permissão GPS.
 * @param {HTMLElement} target badge da permissão.
 */
async function renderPermission(target) {
    const permissionState = await getLocationPermissionState();
    renderPermissionState(target, permissionState);
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
 * Atualiza cartões de métricas com dados de posição.
 * @param {object} elements elementos do ecrã.
 * @param {GeolocationPosition} position posição GPS.
 */
function updateMetricsFromPosition(elements, position) {
    const { accuracy = 0, speed = 0, altitude = 0 } = position.coords;

    elements.metricGpsAccuracy.textContent = `${Math.round(accuracy)} m`;
    elements.metricSpeed.textContent = `${msToKnots(speed || 0).toFixed(1)} kt`;
    elements.metricAltitude.textContent = `${metersToFeet(altitude || 0).toFixed(0)} ft`;
    elements.metricVspeed.textContent = '-- ft/min';
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
