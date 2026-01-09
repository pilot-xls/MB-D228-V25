const CACHE_NAME = 'd228-cache-v1.4.2';
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
  './css/popup-fuel.css',
  './css/popup-TLoad.css',
  './css/rotas.css',
  './css/settings.css',
  './css/style.css',
  './css/theme.css',

  /* DATA (CRÍTICO PARA OFFLINE REAL) */
  './data/aircraft.json',
  './data/payload.json',
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
  './js/calculadora.js',
  './js/dataLoader.js',
  './js/general.js',
  './js/index.js',
  './js/mb.js',
  './js/popup-TLoad.js',
  './js/rotas.js',
  './js/settings.js'
];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
