if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(reg => console.log("Service Worker registado:", reg))
    .catch(err => console.error("Erro ao registar SW:", err));
}



// js/pwa-sheet.js

const INSTALL_SHEET_ID = "install-sheet";
const INSTALL_LAST_SHOWN_KEY = "pwa-install-last-shown";
const INSTALL_INTERVAL_MIN = 5; // minutos

let deferredPrompt = null;

// 1) apanhar o beforeinstallprompt (Android / Chrome)
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  tentarMostrarSheet();
});

// 2) iOS não tem beforeinstallprompt → mostramos sempre
document.addEventListener("DOMContentLoaded", () => {
  // se for iOS Safari, também mostramos
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIOS) {
    tentarMostrarSheet();
  }
});

// função que verifica tempo e mostra
function tentarMostrarSheet() {
  const sheet = document.getElementById(INSTALL_SHEET_ID);
  if (!sheet) return;

  const agora = Date.now();
  const ultimo = Number(localStorage.getItem(INSTALL_LAST_SHOWN_KEY)) || 0;
  const diffMin = (agora - ultimo) / 1000 / 60;

  if (diffMin < INSTALL_INTERVAL_MIN) {
    return; // ainda não passaram 5 min
  }

  sheet.classList.remove("hidden");
  sheet.setAttribute("aria-hidden", "false");
  localStorage.setItem(INSTALL_LAST_SHOWN_KEY, String(agora));
}

// botões do sheet
document.addEventListener("click", async (e) => {
  // fechar
  if (e.target.matches("[data-install-close]")) {
    const sheet = document.getElementById(INSTALL_SHEET_ID);
    if (sheet) {
      sheet.classList.add("hidden");
      sheet.setAttribute("aria-hidden", "true");
    }
  }

  // instalar (Android / Chrome)
  if (e.target.matches("[data-install-cta]")) {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      // podes tratar outcome === "accepted" ou "dismissed"
      deferredPrompt = null;
    } else {
      // iOS: só fecha e o utilizador segue as instruções
      const sheet = document.getElementById(INSTALL_SHEET_ID);
      if (sheet) {
        sheet.classList.add("hidden");
        sheet.setAttribute("aria-hidden", "true");
      }
    }
  }
});
