document.addEventListener('DOMContentLoaded', () => {
    const totalDisplay = document.getElementById('totalDisplay');
    const hoursInput = document.getElementById('hoursInput');
    const minutesInput = document.getElementById('minutesInput');
    const manualAddBtn = document.getElementById('manualAddBtn');
    const manualSubtractBtn = document.getElementById('manualSubtractBtn');
    const resetTotalBtn = document.getElementById('resetTotalBtn');

    let totalMinutes = 0;

    const pad = (value) => String(value).padStart(2, '0');

    const minutesToReadable = (minutes) => {
        const signal = minutes < 0 ? '-' : '';
        const absolute = Math.abs(minutes);
        const hours = Math.floor(absolute / 60);
        const mins = absolute % 60;
        return `${signal}${pad(hours)}h ${pad(mins)}m`;
    };

    const inputToMinutes = () => {
        const hours = Math.max(0, parseInt(hoursInput.value || '0', 10));
        const minutes = Math.max(0, parseInt(minutesInput.value || '0', 10));
        return (hours * 60) + minutes;
    };

    const renderTotal = () => {
        totalDisplay.textContent = minutesToReadable(totalMinutes);
    };

    const clearInputs = () => {
        hoursInput.value = '';
        minutesInput.value = '';
    };

    const applyOperation = (operator) => {
        const delta = inputToMinutes();

        if (delta <= 0) return;

        if (operator === '-') {
            totalMinutes -= delta;
        } else {
            totalMinutes += delta;
        }

        clearInputs();
        renderTotal();
    };

    manualAddBtn.addEventListener('click', () => {
        applyOperation('+');
    });

    manualSubtractBtn.addEventListener('click', () => {
        applyOperation('-');
    });

    resetTotalBtn.addEventListener('click', () => {
        totalMinutes = 0;
        clearInputs();
        renderTotal();
    });

    renderTotal();
});
function lbToKg() {
    const lb = parseFloat(document.getElementById('lb').value) || 0;
    document.getElementById('kg').value = (lb * 0.453592).toFixed(1);
}

function kgToLb() {
    const kg = parseFloat(document.getElementById('kg').value) || 0;
    document.getElementById('lb').value = (kg / 0.453592).toFixed(1);
}

function usgToL() {
    const usg = parseFloat(document.getElementById('usg').value) || 0;
    document.getElementById('l').value = (usg * 3.78541).toFixed(1);
}

function lToUsg() {
    const l = parseFloat(document.getElementById('l').value) || 0;
    document.getElementById('usg').value = (l / 3.78541).toFixed(1);
}

function ftToM() {
    const ft = parseFloat(document.getElementById('ft').value) || 0;
    document.getElementById('m').value = (ft * 0.3048).toFixed(1);
}

function mToFt() {
    const m = parseFloat(document.getElementById('m').value) || 0;
    document.getElementById('ft').value = (m / 0.3048).toFixed(1);
}

function nmToKm() {
    const nm = parseFloat(document.getElementById('nm').value) || 0;
    document.getElementById('km').value = (nm * 1.852).toFixed(2);
}

function kmToNm() {
    const km = parseFloat(document.getElementById('km').value) || 0;
    document.getElementById('nm').value = (km / 1.852).toFixed(2);
}

function ktToKmh() {
    const kt = parseFloat(document.getElementById('kt').value) || 0;
    document.getElementById('kmh').value = (kt * 1.852).toFixed(1);
}

function kmhToKt() {
    const kmh = parseFloat(document.getElementById('kmh').value) || 0;
    document.getElementById('kt').value = (kmh / 1.852).toFixed(1);
}

function lToLbA1() {
    const l = parseFloat(document.getElementById('Lts').value) || 0;
    document.getElementById('lbA1').value = (l * 1.76).toFixed(1);
}

function lbA1ToL() {
    const lb = parseFloat(document.getElementById('lbA1').value) || 0;
    document.getElementById('Lts').value = (lb / 1.76).toFixed(1);
}
