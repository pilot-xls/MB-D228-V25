const CACHE_NAME = 'd228-cache-v1.0.0';

const ASSETS = [
  './',
  './index.html',
  './calculadora.html',
  './mb.html',
  './performance.html',
  './rotas.html',
  './settings.html',
  './header.html',

  './css/theme.css',
  './css/menu.css',
  './css/index.css',
  './css/calculadora.css',
  './css/mb.css',
  './css/performance.css',
  './css/rotas.css',
  './css/settings.css',
  './css/popup-fuel.css',
  './css/popup-TrafficLoad.css',

  './js/general.js',
  './js/index.js',
  './js/calculadora.js',
  './js/mb.js',
  './js/rotas.js',
  './js/settings.js',
  './js/dataLoader.js',
  './js/popup-TrafficLoad.js',

  './img/icon-192.png',
  './img/sevenair.png',
  './img/calculator.png',
  './img/balance.png',
  './img/performance.png',
  './img/waypoint.png',
  './img/settings.png',
  './img/data.png',
  './img/mapa.png',
  './img/NOTAM.png',
  './img/SMS.png',
  './img/weather.png',
  './img/lay19pax.png',
  './img/front-cargo.png',
  './img/small-rear-cargo.png'
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
