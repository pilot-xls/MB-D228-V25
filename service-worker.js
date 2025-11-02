const CACHE_NAME = "mb-d228-cache-v3";

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
  // IMG
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
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./img/iphone-share.png",
  "./img/app-192.png",
  "./img/app-512.png",
  
  // MANIFESTO
  "./manifest.json",
  // IMPORTANTE: NÃO pôr ./service-worker.js
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // NÃO interceptar o próprio SW
  if (req.url.endsWith("service-worker.js")) {
    event.respondWith(fetch(req));
    return;
  }

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

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      if (cached) {
        // atualiza em background
        fetch(req).then((resp) => {
          if (resp && resp.ok && resp.url.startsWith(self.location.origin)) {
            cache.put(req, resp.clone());
          }
        }).catch(() => {});
        return cached;
      }

      try {
        const resp = await fetch(req);
        if (resp && resp.ok && resp.url.startsWith(self.location.origin)) {
          cache.put(req, resp.clone());
        }
        return resp;
      } catch (err) {
        return new Response("Offline", { status: 503 });
      }
    })()
  );
});
