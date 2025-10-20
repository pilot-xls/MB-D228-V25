
document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('timeInput');
    const buttons = document.querySelectorAll('.buttonCLC');

    let current = '';       // sequência de dígitos introduzidos
    let stored = null;      // valor em minutos da 1ª parte
    let operator = null;    // + ou -
    let justCalculated = false; // flag para saber se acabou de carregar em "="

    // --- Funções auxiliares ---

    // Formata string de dígitos como HH:MM
    const formatTime = (digits) => {
        digits = digits.replace(/[^\d]/g, '').replace(/^0+/, '');
        if (digits.length === 0) return '00:00';
        const minutes = digits.slice(-2).padStart(2, '0');
        const hours = digits.slice(0, -2) || '0';
        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    // Converte HH:MM → minutos
    const timeToMinutes = (time) => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    };

    // Converte minutos → HH:MM (suporta negativos e horas grandes)
    const minutesToTime = (min) => {
        const sign = min < 0 ? '-' : '';
        const abs = Math.abs(min);
        const h = Math.floor(abs / 60);
        const m = abs % 60;
        return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const updateDisplay = () => {
        display.value = formatTime(current);
    };

    const calculate = () => {
        if (stored === null || operator === null) return;
        const second = timeToMinutes(formatTime(current || '0'));
        let result = 0;
        if (operator === '+') result = stored + second;
        if (operator === '-') result = stored - second;
        current = minutesToTime(result).replace(':', '');
        stored = null;
        operator = null;
        justCalculated = true; // marca que acabou cálculo
        updateDisplay();
    };

    // --- Eventos de clique ---

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.textContent;

            if (/^\d$/.test(value)) {
                // se acabou de calcular, limpar e começar novo número
                if (justCalculated) {
                    current = '';
                    justCalculated = false;
                }
                current += value;
                updateDisplay();
            }
            else if (value === 'C') {
                current = '';
                stored = null;
                operator = null;
                justCalculated = false;
                updateDisplay();
            }
            else if (value === '+' || value === '-') {
                if (current === '' && stored === null) return;
                const currentMinutes = timeToMinutes(formatTime(current));
                if (stored !== null && operator !== null) {
                    stored = operator === '+'
                        ? stored + currentMinutes
                        : stored - currentMinutes;
                } else {
                    stored = currentMinutes;
                }
                operator = value;
                current = '';
                justCalculated = false;
                updateDisplay();
            }
            else if (value === '=') {
                calculate();
            }
        });
    });

    updateDisplay();
});



function lbToKg() {

    const lb = parseFloat(document.getElementById("lb").value) || 0;

    document.getElementById("kg").value = (lb * 0.453592).toFixed(1);

}

function kgToLb() {

    const kg = parseFloat(document.getElementById("kg").value) || 0;

    document.getElementById("lb").value = (kg / 0.453592).toFixed(1);

}

// ... e todas as outras funções de conversão...

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

// --- Conversão entre litros (L) e libras (lb) ---
// L ↔ lb (Jet A-1)
function lToLbA1() {
    const l = parseFloat(document.getElementById("Lts").value) || 0;
    document.getElementById("lbA1").value = (l * 1.76).toFixed(1);
}

function lbA1ToL() {
    const lb = parseFloat(document.getElementById("lbA1").value) || 0;
    document.getElementById("Lts").value = (lb / 1.76).toFixed(1);
}

