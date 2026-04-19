/**
 * Serviço de permissões do FDR.
 * Objetivo: consultar o estado da permissão de geolocalização com fallback.
 */

/**
 * Obtém o estado da permissão de localização.
 * @returns {Promise<'granted'|'prompt'|'denied'|'unsupported'>} estado encontrado.
 */
export async function getLocationPermissionState() {
    if (!('permissions' in navigator) || !navigator.permissions.query) {
        return 'unsupported';
    }

    try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        return result.state;
    } catch (error) {
        console.warn('[FDR] Falha ao ler permissões.', error);
        return 'unsupported';
    }
}
