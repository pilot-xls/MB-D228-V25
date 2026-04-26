// Nome da cache actual da aplicação.
// Sempre que mudares ficheiros importantes, incrementa esta versão.
const CACHE_NAME = 'd228-cache-v1.4.9';

// Página principal usada como fallback quando uma navegação falha.
const APP_SHELL_FALLBACK = './index.html';

// Tempo máximo para esperar pela rede antes de desistir.
const NETWORK_TIMEOUT_MS = 2000;

// Lista de ficheiros críticos para funcionamento offline.
// Evita meter aqui ficheiros que possam não existir.
const ASSETS = [
  './',
  './index.html',
  './manifest.json',

  './Popup-TrafficLoad.html',
  './calculadora.html',
  './fdr.html',
  './mb-print.html',
  './mb.html',
  './performance.html',
  './popup-fuel.html',
  './rotas.html',
  './settings.html',

  './header.html',

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

  './img/Layout_Cargo.webp',
  './img/NOTAM.png',
  './img/SMS.png',
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
  './img/weather.png'
];

// Instala o Service Worker.
self.addEventListener('install', (event) => {
  // Garante que a instalação só termina depois da cache inicial.
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Guarda os ficheiros um a um para evitar que um único erro rebente a instalação toda.
      await Promise.all(
        ASSETS.map(async (asset) => {
          try {
            // Faz o pedido do ficheiro.
            const response = await fetch(asset, { cache: 'no-cache' });

            // Só guarda respostas válidas.
            if (response.ok) {
              await cache.put(asset, response);
            } else {
              console.warn('[SW] Ficheiro não colocado em cache:', asset, response.status);
            }
          } catch (error) {
            // Regista o erro sem impedir a instalação inteira.
            console.warn('[SW] Falhou ao colocar em cache:', asset, error);
          }
        })
      );
    })
  );

  // Activa este Service Worker assim que possível.
  self.skipWaiting();
});

// Activa o Service Worker.
self.addEventListener('activate', (event) => {
  // Remove caches antigas.
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );

  // Assume controlo imediato das páginas abertas.
  self.clients.claim();
});

// Faz fetch com limite de tempo.
async function fetchWithTimeout(request, timeoutMs = NETWORK_TIMEOUT_MS) {
  // Cria um controlador para poder cancelar o pedido.
  const controller = new AbortController();

  // Agenda o cancelamento do pedido se demorar demasiado.
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Faz o pedido à rede com suporte para cancelamento.
    return await fetch(request, {
      signal: controller.signal,
      cache: 'no-cache'
    });
  } finally {
    // Limpa o temporizador quando o pedido termina.
    clearTimeout(timeout);
  }
}

// Actualiza a cache em segundo plano.
async function updateCacheInBackground(request) {
  try {
    // Tenta obter uma versão nova pela rede.
    const response = await fetchWithTimeout(request);

    // Só guarda respostas válidas da própria origem.
    if (response && response.ok && response.type === 'basic') {
      // Abre a cache actual.
      const cache = await caches.open(CACHE_NAME);

      // Guarda uma cópia da resposta.
      await cache.put(request, response.clone());
    }

    // Devolve a resposta da rede.
    return response;
  } catch (error) {
    // Ignora falhas de rede em background.
    return null;
  }
}

// Intercepta pedidos da app.
self.addEventListener('fetch', (event) => {
  // Só trata pedidos GET.
  if (event.request.method !== 'GET') {
    return;
  }

  // Guarda o pedido original.
  const request = event.request;

  // Analisa o URL do pedido.
  const requestUrl = new URL(request.url);

  // Verifica se o pedido é da mesma origem da app.
  const isSameOrigin = requestUrl.origin === self.location.origin;

  // Trata navegações de páginas HTML.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then(async (cachedResponse) => {
        // Se houver página em cache, devolve imediatamente.
        if (cachedResponse) {
          // Tenta actualizar a página em segundo plano sem bloquear a app.
          event.waitUntil(updateCacheInBackground(request));

          // Devolve a versão em cache.
          return cachedResponse;
        }

        try {
          // Se não houver cache, tenta ir à rede.
          const networkResponse = await fetchWithTimeout(request);

          // Guarda resposta válida em cache.
          if (networkResponse && networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
          }

          // Devolve a resposta da rede.
          return networkResponse;
        } catch (error) {
          // Se a rede falhar, tenta abrir a página principal.
          const fallback = await caches.match(APP_SHELL_FALLBACK);

          // Se existir fallback, devolve-o.
          if (fallback) {
            return fallback;
          }

          // Último recurso: devolve uma resposta simples de erro.
          return new Response('Aplicação indisponível offline.', {
            status: 503,
            headers: {
              'Content-Type': 'text/plain; charset=utf-8'
            }
          });
        }
      })
    );

    return;
  }

  // Trata recursos da própria app: JS, CSS, JSON, imagens, etc.
  if (isSameOrigin) {
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then(async (cachedResponse) => {
        // Se existir em cache, devolve já.
        if (cachedResponse) {
          // Actualiza em segundo plano.
          event.waitUntil(updateCacheInBackground(request));

          // Devolve a versão em cache.
          return cachedResponse;
        }

        try {
          // Se não existir em cache, tenta ir à rede.
          const networkResponse = await fetchWithTimeout(request);

          // Guarda resposta válida em cache.
          if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
          }

          // Devolve a resposta da rede.
          return networkResponse;
        } catch (error) {
          // Devolve erro controlado em vez de deixar o browser bloquear sem explicação.
          return new Response('Recurso indisponível offline.', {
            status: 503,
            headers: {
              'Content-Type': 'text/plain; charset=utf-8'
            }
          });
        }
      })
    );

    return;
  }

  // Trata recursos externos.
  event.respondWith(
    caches.match(request).then(async (cachedResponse) => {
      // Se existir em cache, devolve.
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        // Tenta obter recurso externo pela rede.
        return await fetchWithTimeout(request);
      } catch (error) {
        // Se falhar e não houver cache, devolve erro controlado.
        return new Response('', {
          status: 504,
          statusText: 'Gateway Timeout'
        });
      }
    })
  );
});
