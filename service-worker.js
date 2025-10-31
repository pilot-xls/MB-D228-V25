const CACHE_NAME = "mb-d228-cache-v1"; // ↑ muda só quando alterares a LISTA
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./rotas.html",
  "./mb.html",
  "./settings.html",
  "./calculadora.html",
  "./performance.html",
  "./fdr.html",
  "./header.html",
  // CSS
  "./css/index.css",
  "./css/rotas.css",
  "./css/mb.css",
  "./css/settings.css",
  "./css/performance.css",
  "./css/calculadora.css",
  "./css/menu.css",
  "./css/normalize.css",
  "./css/style.css",
  "./css/theme.css",
  // JS
  "./js/general.js",
  "./js/dataLoader.js",
  "./js/rotas.js",
  "./js/mb.js",
  "./js/settings.js",
  "./js/calculadora.js",
  // DATA
  "./data/aircraft.json",
  "./data/payload.json",
  "./data/rotas.json",
  // IMAGENS / ICONES
  "./img/sevenair.png",
  "./img/performance.png",
  "./img/balance.png",
  "./img/data.png",
  "./img/settings.png",
  "./img/calculator.png",
  "./img/waypoint.png",
  "./img/weather.png",
  "./img/serie200.png",
  "./img/serie212.png",
  "./img/serieError.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  // MANIFESTO
  "./manifest.json",
  "./service-worker.js"
];

// 1) INSTALL – pré-cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        FILES_TO_CACHE.map(async (file) => {
          try {
            const resp = await fetch(file, { cache: "no-store" });
            if (resp.ok) {
              await cache.put(file, resp.clone());
            } else {
              console.warn("[SW] Falhou cache de", file, resp.status);
            }
          } catch (err) {
            console.warn("[SW] Erro ao buscar", file, err);
          }
        })
      );
    })
  );
});

// 2) ACTIVATE – apagar caches velhos + limpar entradas que já não estão em FILES_TO_CACHE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // apaga caches com nome antigo
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );

      // limpa ficheiros que já não estão na lista
      const cache = await caches.open(CACHE_NAME);
      const requests = await cache.keys();
      const allowed = new Set(FILES_TO_CACHE);
      await Promise.all(
        requests.map((req) => {
          const url = new URL(req.url);
          const path =
            url.origin === self.location.origin
              ? "." + url.pathname
              : req.url;
          if (!allowed.has(path)) {
            // ficheiro já não está na lista → apaga
            return cache.delete(req);
          }
        })
      );

      self.clients.claim();
    })()
  );
});

// 3) FETCH – cache primeiro, mas atualiza em background (stale-while-revalidate light)
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // navegação (html): tenta rede, senão dá offline
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          return fresh;
        } catch (err) {
          const cached = await caches.match("./index.html");
          return cached;
        }
      })()
    );
    return;
  }

  // assets: devolve do cache e tenta atualizar
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      const fetchPromise = fetch(req)
        .then((networkResp) => {
            // só mete no cache se for da mesma origem
            if (networkResp && networkResp.ok && req.url.startsWith(self.location.origin)) {
              cache.put(req, networkResp.clone());
            }
            return networkResp;
        })
        .catch(() => null);

      // se tenho cache → devolvo já
      if (cached) {
        return cached;
      }

      // se não tenho cache → espero rede
      const networkResp = await fetchPromise;
      if (networkResp) return networkResp;

      // fallback final
      return new Response("Offline", { status: 503, statusText: "Offline" });
    })()
  );
});
