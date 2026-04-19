/**
 * Serviço de Wake Lock do FDR.
 * Objetivo: manter o ecrã ativo durante tracking sem quebrar a página em browsers sem suporte.
 */

let wakeLockSentinel = null;

/**
 * Indica se o browser suporta a API de wake lock.
 * @returns {boolean} true quando wake lock de ecrã está disponível.
 */
export function isWakeLockSupported() {
    return 'wakeLock' in navigator && Boolean(navigator.wakeLock?.request);
}

/**
 * Adquire wake lock de ecrã quando suportado.
 * Input: nenhum.
 * Output: true/false consoante sucesso.
 * Objetivo: evitar bloqueio do ecrã em sessão ativa.
 * @returns {Promise<boolean>}
 */
export async function acquireWakeLock() {
    if (!isWakeLockSupported()) {
        return false;
    }

    if (wakeLockSentinel && !wakeLockSentinel.released) {
        return true;
    }

    try {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        wakeLockSentinel.addEventListener('release', () => {
            wakeLockSentinel = null;
        });
        return true;
    } catch (error) {
        console.warn('[FDR] Wake lock não pôde ser adquirido.', error);
        wakeLockSentinel = null;
        return false;
    }
}

/**
 * Liberta o wake lock ativo, se existir.
 * @returns {Promise<void>}
 */
export async function releaseWakeLock() {
    if (!wakeLockSentinel) {
        return;
    }

    try {
        await wakeLockSentinel.release();
    } catch (error) {
        console.warn('[FDR] Falha ao libertar wake lock.', error);
    } finally {
        wakeLockSentinel = null;
    }
}

/**
 * Liga reaquisição automática quando o documento volta a ficar visível.
 * Input: callback que informa o resultado da tentativa.
 * Output: função para remover listener.
 * Objetivo: recuperar lock após mudanças de visibilidade/tab.
 * @param {(acquired: boolean) => void} onReacquire callback de resultado da reaquisição.
 * @returns {() => void} remove listener de visibilidade.
 */
export function setupWakeLockAutoReacquire(onReacquire) {
    if (!isWakeLockSupported()) {
        return () => {};
    }

    const handleVisibilityChange = async () => {
        if (document.visibilityState !== 'visible') {
            return;
        }

        const acquired = await acquireWakeLock();
        onReacquire?.(acquired);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}
