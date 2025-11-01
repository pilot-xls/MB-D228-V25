if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(reg => console.log("Service Worker registado:", reg))
    .catch(err => console.error("Erro ao registar SW:", err));
}
// --- PWA INSTALL SHEET ---

const INSTALL_SHEET_ID = "install-sheet";
const INSTALL_LAST_SHOWN_KEY = "pwa-install-last-shown";
const INSTALL_INTERVAL_MIN = 5; // mostrar no máximo a cada 5 min

let deferredPrompt = null;

// se o browser suportar "instalar" (Android/Chrome)
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  tentarMostrarSheet("android");
});

// iOS / outros: mostrar na mesma (com intervalo)
document.addEventListener("DOMContentLoaded", () => {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIOS) {
    tentarMostrarSheet("ios");
  } else if (!deferredPrompt) {
    // desktop http ou browser que não dispara o evento
    tentarMostrarSheet("generic");
  }
});

function tentarMostrarSheet(modo = "generic") {
  const sheet = document.getElementById(INSTALL_SHEET_ID);
  if (!sheet) return;

  const agora = Date.now();
  const ultimo = Number(localStorage.getItem(INSTALL_LAST_SHOWN_KEY)) || 0;
  const diffMin = (agora - ultimo) / 1000 / 60;

  // respeitar intervalo
  if (diffMin < INSTALL_INTERVAL_MIN) return;

  // mostrar bloco certo
  const iosBlock = document.getElementById("sheet-ios");
  const androidBlock = document.getElementById("sheet-android");

  if (androidBlock) androidBlock.classList.add("hidden");
  if (iosBlock) iosBlock.classList.add("hidden");

  if (modo === "android") {
    androidBlock?.classList.remove("hidden");
  } else {
    iosBlock?.classList.remove("hidden");
  }

  // mostrar o sheet
  sheet.classList.remove("hidden");
  sheet.classList.add("show"); // <--- FALTAVA ISTO
  sheet.setAttribute("aria-hidden", "false");

  // registar que já mostrámos
  localStorage.setItem(INSTALL_LAST_SHOWN_KEY, String(agora));
}

// handlers dos botões
document.addEventListener("click", async (e) => {
  // fechar
  if (e.target.matches("[data-install-close]")) {
    const sheet = document.getElementById(INSTALL_SHEET_ID);
    if (sheet) {
      sheet.classList.remove("show");
      // atraso pequeno para não “saltar”
      setTimeout(() => sheet.classList.add("hidden"), 200);
      sheet.setAttribute("aria-hidden", "true");
    }
  }

  // instalar no Android/Chrome
  if (e.target.matches("[data-install-cta]")) {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    }
    // fecha sempre
    const sheet = document.getElementById(INSTALL_SHEET_ID);
    if (sheet) {
      sheet.classList.remove("show");
      setTimeout(() => sheet.classList.add("hidden"), 200);
    }
  }
});


