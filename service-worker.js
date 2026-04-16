const CACHE_NAME = 'd228-cache-v1.4.2';
const APP_SHELL_FALLBACK = './index.html';
const NETWORK_TIMEOUT_MS = 2500;

const ASSETS = [
  './',
  './index.html',
  './calculadora.html',
  './mb.html',
  './performance.html',
  './rotas.html',
  './settings.html',
  './header.html',
  './popup-fuel.html',

  /* CSS */
  './css/calculadora.css',
  './css/index.css',
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

  /* DATA (CRÍTICO PARA OFFLINE REAL) */
  './data/aircraft.json',
  './data/payload.json',
  './data/airportsList.json',
  './data/rotas.json',
  './data/TrafficLoad.json',

  /* IMAGENS — TODAS */
  './img/app-192.png',
  './img/app-512.png',
  './img/balance.png',
  './img/calculator.png',
  './img/data.png',
  './img/front-cargo.png',
  './img/icon-192.png',
  './img/icon-512.png',
  './img/iphone-share.png',
  './img/large-rear-cargo.png',
  './img/lay19pax.png',
  './img/laycargo.png',
  './img/mapa.png',
  './img/NOTAM.png',
  './img/performance.png',
  './img/serie200.png',
  './img/serie212-Standard.png',
  './img/serie212.png',
  './img/serieError.png',
  './img/settings.png',
  './img/sevenair.png',
  './img/small-rear-cargo.png',
  './img/SMS.png',
  './img/waypoint.png',
  './img/weather.png',

  /* JS */
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
  './js/cgRequired2Seg_CSATH.js',
  './js/cgRequired34Seg_CSATH.js',
  './js/dataLoader.js',
  './js/general.js',
  './js/index.js',
  './js/mb.js',
  './js/mtowASDA_Flaps1.js',
  './js/mtowASDA_FlapsUp.js',
  './js/mtowTODA_Flaps1.js',
  './js/mtowTODA_FlapsUp.js',
  './js/mtowTORA_Flaps1.js',
  './js/mtowTORA_FlapsUp.js',
  './js/cgMTOWSearch.js',
  './js/netGradient_CSATH.js',
  './js/performance.js',
  './js/popup-TLoad.js',
  './js/rotas.js',
  './js/settings.js',
  './js/todrFlaps1_CSATH.js',
  './js/todrFlapsUP_CSATH.js',
  './js/torqueTakeoff_CSATH.js',
  './js/torrFlaps1_CSATH.js',
  './js/torrFlapsUP_CSATH.js'
];


async function fetchWithTimeout(request, timeoutMs = NETWORK_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function cacheResponse(request, response) {
  if (!response || !response.ok) return;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
}

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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const request = event.request;
  const requestUrl = new URL(request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  // Permite probes de conectividade real sem interceptação do SW.
  if (requestUrl.searchParams.has('sw-bypass')) {
    return;
  }

  // Navegação: serve cache imediatamente e atualiza em background.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cachedNavigation = await caches.match(request);

      const networkPromise = fetchWithTimeout(request)
        .then(async (networkResponse) => {
          await cacheResponse(request, networkResponse);
          return networkResponse;
        })
        .catch(() => null);

      if (cachedNavigation) {
        event.waitUntil(networkPromise);
        return cachedNavigation;
      }

      const networkResponse = await networkPromise;
      if (networkResponse) return networkResponse;

      const appShell = await caches.match(APP_SHELL_FALLBACK);
      if (appShell) return appShell;

      return new Response('Offline', {
        status: 503,
        statusText: 'Offline'
      });
    })());
    return;
  }

  // Recursos same-origin: cache primeiro, atualiza em background quando possível.
  if (isSameOrigin) {
    event.respondWith((async () => {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) return cachedResponse;

      try {
        const networkResponse = await fetchWithTimeout(request);
        if (networkResponse && networkResponse.type === 'basic') {
          await cacheResponse(request, networkResponse);
        }
        return networkResponse;
      } catch (error) {
        return new Response('Offline', {
          status: 503,
          statusText: 'Offline'
        });
      }
    })());
    return;
  }

  // Recursos cross-origin: rede com fallback de cache.
  event.respondWith(
    fetchWithTimeout(request, 3000).catch(() => caches.match(request))
  );
});
