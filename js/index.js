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


/**
 * Registo do SW + indicador de percentagem + bloqueios:
 * - mostra percentagem real
 * - bloqueia modo offline se cache incompleto
 * - bloqueia se versão do cache não corresponder à APP_VERSION
 */

async function registerSW() {
  if (!('serviceWorker' in navigator)) return;

  // Regista o SW
  await navigator.serviceWorker.register('./service-worker.js');

  // Espera até existir controller (pode exigir reload)
  if (!navigator.serviceWorker.controller) {
    // Primeiro carregamento após registo: força reload para ficar controlado
    location.reload();
    return;
  }
}

function ensureIndicator() {
  if (document.getElementById('offline-indicator')) return;

  const box = document.createElement('div');
  box.id = 'offline-indicator';
  box.style.cssText = `
    position:fixed;bottom:10px;right:10px;width:240px;
    padding:10px;background:#222;color:#fff;font-size:12px;
    border-radius:8px;z-index:9999;font-family:system-ui, sans-serif;
  `;
  box.innerHTML = `
    <div id="offline-text">Preparação offline…</div>
    <div style="margin-top:6px;background:#444;border-radius:4px;height:6px;">
      <div id="offline-bar" style="
        width:0%;height:6px;background:#fbc02d;border-radius:4px;transition:width .3s;
      "></div>
    </div>
  `;
  document.body.appendChild(box);
}

function requestOfflineStatus() {
  navigator.serviceWorker.controller?.postMessage({ type: 'CHECK_OFFLINE_STATUS' });
}

function requestVersionCheck() {
  navigator.serviceWorker.controller?.postMessage({
    type: 'CHECK_VERSION',
    appVersion: window.APP_VERSION
  });
}

function showHardBlock(title, message, buttonText) {
  document.body.innerHTML = `
    <div style="
      height:100vh;display:flex;align-items:center;justify-content:center;
      text-align:center;font-family:system-ui,sans-serif;padding:20px;
    ">
      <div>
        <h2>${title}</h2>
        <p>${message}</p>
        <button style="padding:10px 14px;font-size:14px;" onclick="location.reload()">
          ${buttonText}
        </button>
      </div>
    </div>
  `;
}

(async () => {
  await registerSW();
  ensureIndicator();

  // Escuta mensagens do SW (offline status + version status)
  navigator.serviceWorker.addEventListener('message', (event) => {
    const data = event.data || {};

    // Indicador de percentagem
    if (data.type === 'OFFLINE_STATUS') {
      const text = document.getElementById('offline-text');
      const bar = document.getElementById('offline-bar');

      if (!text || !bar) return;

      bar.style.width = (data.percent || 0) + '%';

      if (data.ready) {
        text.textContent = 'Offline pronto';
        bar.style.background = '#2e7d32';
      } else {
        text.textContent = `Preparação offline: ${data.percent}%`;
        bar.style.background = '#fbc02d';
        // Debug: lista do que falta (útil no DevTools)
        console.warn('Faltam assets:', data.missing);
      }

      // Bloqueio: se estiver offline e não estiver pronto
      if (!navigator.onLine && !data.ready) {
        showHardBlock(
          'Modo offline indisponível',
          'Abre a aplicação online para concluir a preparação offline.',
          'Tentar novamente'
        );
      }
    }

    // Bloqueio: versão errada
    if (data.type === 'VERSION_STATUS') {
      if (!data.match) {
        showHardBlock(
          'Atualização necessária',
          'A cache está numa versão diferente. Atualiza para continuar.',
          'Atualizar agora'
        );
      }
    }
  });

  // Pede estado e versão
  requestVersionCheck();
  requestOfflineStatus();

  // Revalida quando a conectividade muda
  window.addEventListener('online', requestOfflineStatus);
  window.addEventListener('offline', requestOfflineStatus);
})();

