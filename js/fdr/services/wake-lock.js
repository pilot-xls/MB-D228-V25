/**
 * Serviço de Wake Lock do FDR.
 * Objetivo: evitar ecrã bloqueado durante tracking (quando suportado).
 */

let wakeLockSentinel = null;

/**
 * Pede wake lock de ecrã ao browser.
 * @returns {Promise<boolean>} true quando lock foi obtido.
 */
export async function requestWakeLock() {
    if (!('wakeLock' in navigator) || !navigator.wakeLock.request) {
        return false;
    }

    try {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        return true;
    } catch (error) {
        console.warn('[FDR] Wake lock não disponível.', error);
        return false;
    }
}

/**
 * Liberta wake lock ativo.
 * @returns {Promise<void>}
 */
export async function releaseWakeLock() {
    if (!wakeLockSentinel) {
        return;
    }

    await wakeLockSentinel.release();
    wakeLockSentinel = null;
}
