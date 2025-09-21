

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

// lista das páginas na ordem de navegação
const paginas = [
  "index.html",
  "mb.html",
  "rotas.html",
  "performance.html",  
  "calculadora.html",
  "settings.html"
];

// descobrir em que página estou
const atual = window.location.pathname.split("/").pop();
const pos = paginas.indexOf(atual);

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", e => {
  touchEndX = e.changedTouches[0].screenX;
  handleGesture();
});

function handleGesture() {
  const deltaX = touchEndX - touchStartX;

  if (deltaX > 100 && pos > 0) {
    // swipe direita → página anterior
    window.location.href = paginas[pos - 1];
  } else if (deltaX < -100 && pos < paginas.length - 1) {
    // swipe esquerda → página seguinte
    window.location.href = paginas[pos + 1];
  }
}


