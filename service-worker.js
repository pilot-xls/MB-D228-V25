const CACHE_NAME = "mb-d228-cache-v5";
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

      // fallback: tenta rede, se falhar e for navegação -> devolve index.html
      return fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});

