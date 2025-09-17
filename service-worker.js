const CACHE_NAME = "mb-d228-cache-v1";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
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
  "./data/payload.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
