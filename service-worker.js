const CACHE_NAME = "mb-d228-cache-v3";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./mb.html",
  "./fdr.html",
  "./performance.html",
  "./calculadora.html",
  "./settings.html",
  "./rotas.html",
  "./css/theme.css",
  "./css/calculadora.css",
  "./css/settings.css",
  "./css/index.css",
  "./css/performance.css",
  "./css/style.css",
  "./css/rotas.css",
  "./css/menu.css",
  "./css/normalize.css",
  "./js/calculadora.js",
  "./js/rotas.js",
  "./js/mb.js",
  "./js/dataLoader.js",
  "./js/settings.js",
  "./data/aircraft.json",
  "./data/payload.json",
  "./data/rotas.json",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// instalar SW e guardar ficheiros em cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// ativar SW e limpar caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    )
  );
});

// servir ficheiros
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // se tiver no cache -> devolve
      if (response) return response;

      // se for navegação (sem estar em cache) -> tenta rede, se falhar devolve index.html
      if (event.request.mode === "navigate") {
        return fetch(event.request).catch(() => caches.match("./index.html"));
      }

      // fallback normal
      return fetch(event.request);
    })
  );
});
