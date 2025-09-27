const CACHE_NAME = "mb-d228-cache-v2";
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

// instalar SW e colocar ficheiros em cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// ativar SW e remover caches antigos
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

// servir ficheiros do cache quando offline
self.addEventListener("fetch", event => {
  // para navegações diretas (sem ficheiro) -> devolve index.html
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then(response => {
        return response || fetch("./index.html");
      })
    );
    return;
  }

  // para restantes pedidos (JS, CSS, JSON, imagens, etc.)
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
