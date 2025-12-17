if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(reg => console.log("Service Worker registado:", reg))
    .catch(err => console.error("Erro ao registar SW:", err));
}

const SHEET_ID = "install-sheet";
const WARN_ID = "install-warning";
const LAST_KEY = "pwa-install-last";
const INTERVAL_MIN = 0.1;

let deferredPrompt = null;

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
}
function isChromeIOS() {
  // Chrome no iOS identifica-se como "CriOS"
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && /crios/i.test(navigator.userAgent);
}

// ANDROID (tem evento)
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  mostrarSheet("android");
});

// iOS / outros

/* se estiver em iPhone e for Chrome (ou outro que não seja Safari), em vez de mostrar o sheet de instalação mostras uma nota tipo “Para instalar usa o Safari”.*/
document.addEventListener("DOMContentLoaded", () => {
  if (!isIOS()) return;
  if (isStandalone()) return; // já instalada

  if (isChromeIOS()) {
    mostrarAvisoNavegador();
  } else {
    mostrarSheet("ios");
  }
});

function passouTempo() {
  const last = Number(localStorage.getItem(LAST_KEY)) || 0;
  const diff = (Date.now() - last) / 1000 / 60;
  return diff >= INTERVAL_MIN;
}

function mostrarSheet(tipo) {
  if (!passouTempo()) return;
  const sheet = document.getElementById(SHEET_ID);
  if (!sheet) return;

  const ios = document.getElementById("install-ios");
  const android = document.getElementById("install-android");

  if (tipo === "android") {
    ios.classList.add("hidden");
    android.classList.remove("hidden");
  } else {
    android.classList.add("hidden");
    ios.classList.remove("hidden");
  }

  sheet.classList.remove("hidden");
  sheet.classList.add("show");
  sheet.setAttribute("aria-hidden", "false");
  localStorage.setItem(LAST_KEY, String(Date.now()));
}

function mostrarAvisoNavegador() {
  const box = document.getElementById(WARN_ID);
  if (!box) return;
  box.classList.remove("hidden");
  box.setAttribute("aria-hidden", "false");
}

document.addEventListener("click", async (e) => {
  // fechar sheet
  if (e.target.id === "install-close") {
    const sheet = document.getElementById(SHEET_ID);
    if (sheet) {
      sheet.classList.remove("show");
      sheet.classList.add("hidden");
      sheet.setAttribute("aria-hidden", "true");
    }
  }

  // fechar aviso
  if (e.target.id === "install-warning-close") {
    const box = document.getElementById(WARN_ID);
    if (box) {
      box.classList.add("hidden");
      box.setAttribute("aria-hidden", "true");
    }
  }

  // instalar android
  if (e.target.id === "install-android-btn") {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    }
    const sheet = document.getElementById(SHEET_ID);
    if (sheet) {
      sheet.classList.remove("show");
      sheet.classList.add("hidden");
    }
  }
});


// FORÇAR PARA TESTE EM DESKTOP
//if (!/iphone|ipad|ipod|android/i.test(navigator.userAgent)) {
  // mostra versão iOS só para testar no PC
  //mostrarSheet("ios");
//}


