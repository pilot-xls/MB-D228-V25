// Seleciona todo o conteúdo de qualquer INPUT ao focar
document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todos os campos <input> na página
    document.querySelectorAll("input").forEach(inp => {
        // Adiciona um 'listener' para o evento 'focus' (quando o campo é ativado)
        inp.addEventListener("focus", function() {
            // Usa o método 'select()' para selecionar todo o texto
            this.select();
        });
    });
});
// Força teclado numérico em todos os inputs (exceto a calculadora de tempo)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input").forEach(inp => {
    // ADICIONAR ESTA CONDIÇÃO: Ignorar se o ID for 'timeInput'
    if (inp.id !== 'timeInput') { 
      if (!inp.type || inp.type === "text") inp.type = "number";
      inp.setAttribute("inputmode", "decimal");
      inp.setAttribute("pattern", "[0-9.]*");
    }
  });
});

// Fecha teclado ao clicar fora dos inputs
document.addEventListener("touchstart", function (event) {
  const isInput = event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA";
  if (!isInput) {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
      activeElement.blur();
    }
  }
});



// Fecha o menu sempre que se clica ou toca fora do botão hamburger e do próprio menu
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const hamburger = document.querySelector('.hamburger');

  // abre/fecha ao clicar no botão
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // evita fechar logo
    menu.classList.toggle('active');
  });

  // fecha ao clicar fora do menu
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('active') && 
        !menu.contains(e.target) && 
        !hamburger.contains(e.target)) {
      menu.classList.remove('active');
    }
  });
});

// Carrega o ficheiro header.html em todas as páginas e ativa a lógica de abrir/fechar o menu
document.addEventListener('DOMContentLoaded', () => {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;

      // ativar o JS do menu depois de inserir o header
      const menu = document.querySelector('.menu');
      const hamburger = document.querySelector('.hamburger');

      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (menu.classList.contains('active') &&
            !menu.contains(e.target) &&
            !hamburger.contains(e.target)) {
          menu.classList.remove('active');
        }
      });
    });
});



/*
 Script para navegação por gestos (swipe) no telemóvel
 - Swipe para a direita (>100px) → vai para proxima.html
 - Swipe para a esquerda (<-100px) → vai para anterior.html
*/


// Navegação por gestos com transição e fade
const paginas = [
  "index.html",
  "mb.html",
  "rotas.html",
  "performance.html",  
  "calculadora.html",
  "settings.html"
];

const atual = window.location.pathname.split("/").pop();
const pos = paginas.indexOf(atual);

let touchStartX = 0;
let deltaX = 0;
let preview = null;

// cria pré-visualização da próxima página (iframe)
function preloadNextPage(nextUrl, direction) {
  preview = document.createElement("iframe");
  preview.src = nextUrl;
  preview.style.position = "fixed";
  preview.style.top = "0";
  preview.style.left = direction === "left" ? "100%" : "-100%";
  preview.style.width = "100%";
  preview.style.height = "100%";
  preview.style.border = "none";
  preview.style.opacity = "0";
  preview.style.transition = "transform 0.25s ease, opacity 0.25s ease";
  document.body.appendChild(preview);
  // ligeiro atraso para ativar transição
  requestAnimationFrame(() => (preview.style.opacity = "1"));
}

document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchmove", e => {
  deltaX = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(deltaX) < 20) return;

  if (deltaX < 0 && pos < paginas.length - 1) {
    if (!preview) preloadNextPage(paginas[pos + 1], "left");
    preview.style.transform = `translateX(${deltaX}px)`;
  } else if (deltaX > 0 && pos > 0) {
    if (!preview) preloadNextPage(paginas[pos - 1], "right");
    preview.style.transform = `translateX(${deltaX - window.innerWidth}px)`;
  }
});

document.addEventListener("touchend", () => {
  if (!preview) return;

  if (deltaX < -100 && pos < paginas.length - 1) {
    // swipe esquerda → próxima página
    preview.style.transform = "translateX(-100%)";
    preview.style.opacity = "1";
    setTimeout(() => (window.location.href = paginas[pos + 1]), 200);
  } else if (deltaX > 100 && pos > 0) {
    // swipe direita → página anterior
    preview.style.transform = "translateX(0)";
    preview.style.opacity = "1";
    setTimeout(() => (window.location.href = paginas[pos - 1]), 200);
  } else {
    // gesto cancelado → reverter
    preview.style.transform = "translateX(0)";
    preview.style.opacity = "0";
    setTimeout(() => {
      preview.remove();
      preview = null;
    }, 200);
  }
});

