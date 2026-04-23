const CACHE_NAME = 'd228-cache-v1.4.6';
const APP_SHELL_FALLBACK = './index.html';
const NETWORK_TIMEOUT_MS = 4000;

const ASSETS = [
  './',
  './Popup-TrafficLoad.html',
  './calculadora.html',
  './css/calculadora.css',
  './css/fdr.css',
  './css/index.css',
  './css/mb-print.css',
  './css/mb.css',
  './css/menu.css',
  './css/normalize.css',
  './css/performance.css',
  './css/popup-TLoad.css',
  './css/popup-TrafficLoad.css',
  './css/popup-fuel.css',
  './css/rotas.css',
  './css/settings.css',
  './css/style.css',
  './css/theme.css',
  './data/TrafficLoad.json',
  './data/aircraft.json',
  './data/airportsList.json',
  './data/fdr-aircraft-profiles.json',
  './data/fdr-demo-track.json',
  './data/payload.json',
  './data/rotas.json',
  './fdr.html',
  './generate-assets.js',
  './header.html',
  './img/Layout_Cargo.webp',
  './img/NOTAM.png',
  './img/SMS.png',
  './img/app-192.png',
  './img/app-512.png',
  './img/balance.png',
  './img/calculator.png',
  './img/data.png',
  './img/front-cargo.png',
  './img/icon-192-old.png',
  './img/icon-192.png',
  './img/icon-512-old.png',
  './img/icon-512.png',
  './img/iphone-share.png',
  './img/large-rear-cargo.png',
  './img/lay19pax - Cópia.png',
  './img/lay19pax.png',
  './img/laycargo.png',
  './img/layout_19PAX.webp',
  './img/mapa.png',
  './img/performance.png',
  './img/serie200.png',
  './img/serie212-Standard.png',
  './img/serie212.png',
  './img/serieError.png',
  './img/settings.png',
  './img/sevenair.png',
  './img/small-rear-cargo.png',
  './img/waypoint.png',
  './img/weather.png',
  './index.html',
  './js/Popup-TrafficLoad.js',
  './js/ToSpeeds.js',
  './js/ToWAT.js',
  './js/asdrFlaps1_CSATH.js',
  './js/asdrFlapsUP_CSATH.js',
  './js/calculadora.js',
  './js/cg2segFlaps1_CSATH.js',
  './js/cg2segFlapsUp_CSATH.js',
  './js/cg3segFlaps1_CSATH.js',
  './js/cg4segFlapsUp_CSATH.js',
  './js/cgMTOWSearch.js',
  './js/cgRequired2Seg_CSATH.js',
  './js/cgRequired34Seg_CSATH.js',
  './js/dataLoader.js',
  './js/fdr.js',
  './js/fdr/config.js',
  './js/fdr/core/detection-engine.js',
  './js/fdr/core/state-machine.js',
  './js/fdr/services/geolocation.js',
  './js/fdr/services/permissions.js',
  './js/fdr/services/wake-lock.js',
  './js/fdr/storage/fdr-db.js',
  './js/fdr/storage/fdr-repository.js',
  './js/fdr/ui/fdr-screen.js',
  './js/fdr/ui/fdr-summary.js',
  './js/fdr/utils/geo.js',
  './js/fdr/utils/smoothing.js',
  './js/fdr/utils/time.js',
  './js/general.js',
  './js/index.js',
  './js/mb-print.js',
  './js/mb.js',
  './js/mtowASDA_Flaps1.js',
  './js/mtowASDA_FlapsUp.js',
  './js/mtowTODA_Flaps1.js',
  './js/mtowTODA_FlapsUp.js',
  './js/mtowTORA_Flaps1.js',
  './js/mtowTORA_FlapsUp.js',
  './js/netGradient_CSATH.js',
  './js/performance.js',
  './js/popup-TLoad.js',
  './js/rotas.js',
  './js/settings.js',
  './js/todrFlaps1_CSATH.js',
  './js/todrFlapsUP_CSATH.js',
  './js/torqueTakeoff_CSATH.js',
  './js/torrFlaps1_CSATH.js',
  './js/torrFlapsUP_CSATH.js',
  './manifest.json',
  './mb-print.html',
  './mb.html',
  './performance.html',
  './popup-fuel.html',
  './rotas.html',
  './service-worker.js',
  './settings.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

async function fetchWithTimeout(request, timeoutMs = NETWORK_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(request, {
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const request = event.request;
  const requestUrl = new URL(request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  // Navegação: tenta rede primeiro para atualizar conteúdo, fallback para cache.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetchWithTimeout(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cachedNavigation = await caches.match(request);
          if (cachedNavigation) return cachedNavigation;
          return caches.match(APP_SHELL_FALLBACK);
        })
    );
    return;
  }

  // Recursos same-origin: cache primeiro, atualiza em background quando possível.
  if (isSameOrigin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const networkFetch = fetchWithTimeout(request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              networkResponse.ok &&
              networkResponse.type === 'basic'
            ) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || networkFetch;
      })
    );
    return;
  }

  // Recursos cross-origin: rede com fallback de cache.
  event.respondWith(
    fetchWithTimeout(request).catch(() => caches.match(request))
  );
});
