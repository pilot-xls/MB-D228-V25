// --- Funções de tempo ---
    function parseTempo(str) {
  if (!str) return 0;
  const partes = str.split(":").map(Number);
  let h = 0, m = 0, s = 0;

  if (partes.length === 1) {
    // só horas
    h = partes[0];
  } else if (partes.length === 2) {
    // horas:minutos
    h = partes[0];
    m = partes[1];
  } else if (partes.length === 3) {
    // horas:minutos:segundos
    h = partes[0];
    m = partes[1];
    s = partes[2];
  }
  return (h * 3600) + (m * 60) + s;
}

    function formatTempo(segundos) {
      const h = Math.floor(segundos / 3600);
      const m = Math.floor((segundos % 3600) / 60);
      const s = segundos % 60;
      return [h,m,s].map(x => String(x).padStart(2,"0")).join(":");
    }
    function somarTempos() {
      const t1 = parseTempo(document.getElementById("tempo1").value);
      const t2 = parseTempo(document.getElementById("tempo2").value);
      document.getElementById("resultado-tempo").textContent = formatTempo(t1 + t2);
    }
    function subtrairTempos() {
      const t1 = parseTempo(document.getElementById("tempo1").value);
      const t2 = parseTempo(document.getElementById("tempo2").value);
      const dif = Math.max(0, t1 - t2);
      document.getElementById("resultado-tempo").textContent = formatTempo(dif);
    }

    // --- Conversões bidirecionais ---
    function lbToKg() {
      const lb = parseFloat(document.getElementById("lb").value) || 0;
      document.getElementById("kg").value = (lb * 0.453592).toFixed(1);
    }
    function kgToLb() {
      const kg = parseFloat(document.getElementById("kg").value) || 0;
      document.getElementById("lb").value = (kg / 0.453592).toFixed(1);
    }

    function usgToL() {
      const usg = parseFloat(document.getElementById("usg").value) || 0;
      document.getElementById("l").value = (usg * 3.78541).toFixed(1);
    }
    function lToUsg() {
      const l = parseFloat(document.getElementById("l").value) || 0;
      document.getElementById("usg").value = (l / 3.78541).toFixed(1);
    }

    function ftToM() {
      const ft = parseFloat(document.getElementById("ft").value) || 0;
      document.getElementById("m").value = (ft * 0.3048).toFixed(1);
    }
    function mToFt() {
      const m = parseFloat(document.getElementById("m").value) || 0;
      document.getElementById("ft").value = (m / 0.3048).toFixed(1);
    }

    function nmToKm() {
      const nm = parseFloat(document.getElementById("nm").value) || 0;
      document.getElementById("km").value = (nm * 1.852).toFixed(2);
    }
    function kmToNm() {
      const km = parseFloat(document.getElementById("km").value) || 0;
      document.getElementById("nm").value = (km / 1.852).toFixed(2);
    }

    function ktToKmh() {
      const kt = parseFloat(document.getElementById("kt").value) || 0;
      document.getElementById("kmh").value = (kt * 1.852).toFixed(1);
    }
    function kmhToKt() {
      const kmh = parseFloat(document.getElementById("kmh").value) || 0;
      document.getElementById("kt").value = (kmh / 1.852).toFixed(1);
    }

    //quando entro no campo, todo o conteúdo fica selecionado automaticamente.
document.querySelectorAll("input").forEach(inp => {
  inp.addEventListener("focus", function() {
    this.select();
  });
});
