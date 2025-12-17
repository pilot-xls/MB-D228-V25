/**
 * service-worker.js
 * - Cache completo total com base em assets.js
 * - Instalação rígida: se falhar 1 asset, o SW NÃO ativa (offline incompleto = bloqueado)
 * - Fornece status (percentagem + missing) para a UI
 * - Expõe versão do cache para validação
 */

importScripts('./assets.js');

// Versão do cache: MUDA SEMPRE que mudares assets/app
// Sugestão: inclui a tua versão humana (ex: 251101.1)
const CACHE = 'd228-251101.1';

/**
 * Instalação: tenta cachear TODOS os ficheiros.
 * Se um falhar, aborta a instalação (melhor falhar do que ficar “meio offline”).
 */
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);

    // Cache rígida: se um falhar, lança erro
    for (const asset of self.__ASSETS__) {
      const response = await fetch(asset, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`Falhou o download para cache: ${asset} (${response.status})`);
      }
      await cache.put(asset, response);
    }
  })());

  // Faz o SW novo “tomar posse” o mais cedo possível
  self.skipWaiting();
});

/**
 * Ativação: remove caches antigas.
 */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

/**
 * Fetch: offline-first (cache primeiro).
 * Se não estiver em cache e estiver online, vai buscar à rede.
 */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;

    // Se não estiver em cache, tenta rede
    return fetch(event.request);
  })());
});

/**
 * Mensagens: a UI pede o estado offline (percentagem + missing)
 * e validação de versão.
 */
self.addEventListener('message', (event) => {
  const data = event.data || {};

  // 1) Estado offline: percentagem real e lista do que falta
  if (data.type === 'CHECK_OFFLINE_STATUS') {
    (async () => {
      const cache = await caches.open(CACHE);
      const keys = await cache.keys();
      const cachedPaths = keys.map(r => new URL(r.url).pathname);

      const total = self.__ASSETS__.length;
      let cachedCount = 0;
      const missing = [];

      for (const asset of self.__ASSETS__) {
        // Normaliza "./x" -> "/x"
        const path = asset.replace('./', '/');
        if (cachedPaths.includes(path)) {
          cachedCount++;
        } else {
          missing.push(asset);
        }
      }

      event.source.postMessage({
        type: 'OFFLINE_STATUS',
        total,
        cached: cachedCount,
        percent: Math.round((cachedCount / total) * 100),
        ready: cachedCount === total,
        missing
      });
    })();
  }

  // 2) Validação de versão: a UI envia a versão “humana”
  if (data.type === 'CHECK_VERSION') {
    const appVersion = String(data.appVersion || '');
    event.source.postMessage({
      type: 'VERSION_STATUS',
      cacheName: CACHE,
      appVersion,
      match: CACHE.includes(appVersion)
    });
  }
});
