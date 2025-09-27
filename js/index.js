if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(reg => console.log("Service Worker registado:", reg))
    .catch(err => console.error("Erro ao registar SW:", err));
}
