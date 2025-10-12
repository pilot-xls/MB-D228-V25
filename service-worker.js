const CACHE_NAME = "mb-d228-cache-v1";
const FILES_TO_CACHE = [
  "./",
  "./calculadora.html",
  "./fdr.html",
  "./header.html",
  "./index.html",
  "./mb.html",
  "./performance.html",
  "./rotas.html",
  "./settings.html",
  "./css/calculadora.css",
  "./css/index.css",
  "./css/mb.css",
  "./css/menu.css",
  "./css/normalize.css",
  "./css/performance.css",
  "./css/rotas.css",
  "./css/settings.css",
  "./css/style.css",
  "./css/theme.css",
  "./data/aircraft.json",
  "./data/payload.json",
  "./data/rotas.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./img/balance.png",
  "./img/calculator.png",
  "./img/data.png",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./img/performance.png",
  "./img/serie212.png",
  "./img/serie200.png",
  "./img/serieError.png",
  "./img/settings.png",
  "./img/sevenair.png",
  "./img/waypoint.png",
  "./js/calculadora.js",
  "./js/dataLoader.js",
  "./js/general.js",
  "./js/mb.js",
  "./js/rotas.js",
  "./js/settings.js",
  "./manifest.json",
  "./service-worker.js"
];

// instalar SW e guardar ficheiros em cache (contra erros)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await Promise.all(
        FILES_TO_CACHE.map(file =>
          fetch(file).then(resp => {
            if (resp.ok) {
              return cache.put(file, resp.clone());
            } else {
              console.warn("Falhou cache de", file, resp.status);
            }
          }).catch(err => {
            console.warn("Erro ao buscar", file, err);
          })
        )
      );
    })
  );
});

// ativar SW e limpar caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// servir ficheiros
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;

      // navegação sem cache -> tenta rede, fallback index.html
      if (event.request.mode === "navigate") {
        return fetch(event.request).catch(() => caches.match("./index.html"));
      }

      // pedido normal
      return fetch(event.request);
    })
  );
});
