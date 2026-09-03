function initCalculadora() {
    const totalDisplay = document.getElementById('totalDisplay');
    const timeDisplay = document.getElementById('timeDisplay');
    const timeKeypad = document.getElementById('timeKeypad');
    const manualAddBtn = document.getElementById('manualAddBtn');
    const manualSubtractBtn = document.getElementById('manualSubtractBtn');
    const historyList = document.getElementById('historyList');
    const historyCount = document.getElementById('historyCount');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    let buffer = '';
    let history = [];
    let nextHistoryId = 1;

    const pad = (value) => String(value).padStart(2, '0');

    const minutesToReadable = (minutes) => {
        const signal = minutes < 0 ? '-' : '';
        const absolute = Math.abs(minutes);
        const hours = Math.floor(absolute / 60);
        const mins = absolute % 60;
        return `${signal}${pad(hours)}h ${pad(mins)}m`;
    };

    const calculateTotal = () => {
        return history.reduce((acc, item) => {
            if (item.operator === '-') return acc - item.minutes;
            return acc + item.minutes;
        }, 0);
    };

    const getDisplayValue = () => {
        const padded = buffer.padStart(4, '0');
        return `${padded.slice(0, 2)}:${padded.slice(2, 4)}`;
    };

    const parseBufferToMinutes = () => {
        const padded = buffer.padStart(4, '0');
        const hours = parseInt(padded.slice(0, 2), 10);
        const minutes = parseInt(padded.slice(2, 4), 10);
        return hours * 60 + minutes;
    };

    const appendDigit = (digit) => {
        if (buffer.length < 4) buffer += digit;
    };

    const clearBuffer = () => {
        buffer = '';
        renderTimeDisplay();
    };

    const renderTimeDisplay = () => {
        timeDisplay.textContent = getDisplayValue();
    };

    const formatHistoryValue = (item) => {
        return `${item.operator} ${minutesToReadable(item.minutes)}`;
    };

    const renderHistory = () => {
        historyList.innerHTML = '';

        if (history.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'history-item';
            empty.innerHTML = '<div class="history-item-meta"><span class="history-item-value">Sem registos</span><small>Adiciona um valor para iniciar o histórico.</small></div>';
            historyList.appendChild(empty);
        }

        history.forEach((item) => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <div class="history-item-meta">
                    <span class="history-item-value">${formatHistoryValue(item)}</span>
                    <small>Registo #${item.id}</small>
                </div>
                <div class="history-item-actions">
                    <button type="button" data-action="delete" data-id="${item.id}">Apagar</button>
                </div>
            `;
            historyList.appendChild(li);
        });

        historyCount.textContent = `${history.length} registo${history.length === 1 ? '' : 's'}`;
    };

    const renderTotal = () => {
        totalDisplay.textContent = minutesToReadable(calculateTotal());
    };

    const resetCalculator = () => {
        history = [];
        nextHistoryId = 1;
        clearBuffer();
        renderHistory();
        renderTotal();
    };

    const commitOperation = (operator) => {
        const delta = parseBufferToMinutes();
        if (delta <= 0) return;

        history.push({ id: nextHistoryId++, operator, minutes: delta });

        clearBuffer();
        renderTotal();
        renderHistory();
    };

    const removeHistoryItem = (id) => {
        history = history.filter((item) => item.id !== id);
        renderHistory();
        renderTotal();
    };

    timeKeypad.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        const key = button.dataset.key;

        if (action === 'double-zero') {
            appendDigit('0');
            appendDigit('0');
            renderTimeDisplay();
            return;
        }

        if (action === 'backspace') {
            buffer = buffer.slice(0, -1);
            renderTimeDisplay();
            return;
        }

        if (key) {
            appendDigit(key);
            renderTimeDisplay();
        }
    });

    manualAddBtn.addEventListener('click', () => commitOperation('+'));
    manualSubtractBtn.addEventListener('click', () => commitOperation('-'));

    clearHistoryBtn.addEventListener('click', resetCalculator);

    historyList.addEventListener('click', (event) => {
        const target = event.target.closest('button[data-action]');
        if (!target) return;

        const id = parseInt(target.dataset.id || '0', 10);
        if (!id) return;

        if (target.dataset.action === 'delete') {
            removeHistoryItem(id);
        }
    });

    renderTimeDisplay();
    renderHistory();
    renderTotal();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculadora);
} else {
    initCalculadora();
}

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
