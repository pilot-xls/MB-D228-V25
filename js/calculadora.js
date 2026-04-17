document.addEventListener('DOMContentLoaded', () => {
    const totalDisplay = document.getElementById('totalDisplay');
    const hoursInput = document.getElementById('hoursInput');
    const minutesInput = document.getElementById('minutesInput');
    const timeKeypad = document.getElementById('timeKeypad');
    const manualAddBtn = document.getElementById('manualAddBtn');
    const manualSubtractBtn = document.getElementById('manualSubtractBtn');
    const resetTotalBtn = document.getElementById('resetTotalBtn');
    const historyList = document.getElementById('historyList');
    const historyCount = document.getElementById('historyCount');

    const MAX_DIGITS = 3;
    let activeField = 'hours';
    let hoursBuffer = '';
    let minutesBuffer = '';
    let history = [];
    let nextHistoryId = 1;
    let editingId = null;

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

    const parseBuffersToMinutes = () => {
        const hours = parseInt(hoursBuffer || '0', 10);
        const minutes = parseInt(minutesBuffer || '0', 10);
        return (hours * 60) + minutes;
    };

    const clearBuffers = () => {
        hoursBuffer = '';
        minutesBuffer = '';
        renderInputBuffers();
    };

    const setActiveField = (field) => {
        activeField = field;
        hoursInput.classList.toggle('is-active', field === 'hours');
        minutesInput.classList.toggle('is-active', field === 'minutes');
    };

    const renderInputBuffers = () => {
        hoursInput.value = hoursBuffer || '00';
        minutesInput.value = minutesBuffer || '00';
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
                    <button type="button" data-action="edit" data-id="${item.id}">Editar</button>
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
        clearBuffers();
        finishEditing();
        renderHistory();
        renderTotal();
    };

    const commitOperation = (operator) => {
        const delta = parseBuffersToMinutes();
        if (delta <= 0) return;

        if (editingId !== null) {
            const target = history.find((item) => item.id === editingId);
            if (!target) return;

            target.minutes = delta;
            finishEditing();
        } else {
            history.push({ id: nextHistoryId++, operator, minutes: delta });
        }

        clearBuffers();
        renderTotal();
        renderHistory();
    };

    const startEditing = (id) => {
        const target = history.find((item) => item.id === id);
        if (!target) return;

        editingId = id;
        const hours = Math.floor(target.minutes / 60);
        const minutes = target.minutes % 60;
        hoursBuffer = String(hours);
        minutesBuffer = String(minutes);
        renderInputBuffers();
    };

    const finishEditing = () => {
        editingId = null;
    };

    const removeHistoryItem = (id) => {
        history = history.filter((item) => item.id !== id);
        if (editingId === id) {
            finishEditing();
            clearBuffers();
        }
        renderHistory();
        renderTotal();
    };

    const setupInputPicker = (input, fieldName) => {
        const activateField = (event) => {
            event.preventDefault();
            setActiveField(fieldName);
            input.blur();
        };

        input.addEventListener('pointerdown', activateField);
        input.addEventListener('click', activateField);
        input.addEventListener('touchstart', activateField, { passive: false });
    };

    setupInputPicker(hoursInput, 'hours');
    setupInputPicker(minutesInput, 'minutes');

    timeKeypad.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        const key = button.dataset.key;

        const getBuffer = () => (activeField === 'hours' ? hoursBuffer : minutesBuffer);
        const setBuffer = (value) => {
            if (activeField === 'hours') {
                hoursBuffer = value;
            } else {
                minutesBuffer = value;
            }
        };

        if (action === 'clear') {
            resetCalculator();
            return;
        }

        if (action === 'backspace') {
            setBuffer(getBuffer().slice(0, -1));
            renderInputBuffers();
            return;
        }

        if (key) {
            const current = getBuffer();
            if (current.length >= MAX_DIGITS) return;

            const updated = current === '0' ? key : `${current}${key}`;
            setBuffer(updated);
            renderInputBuffers();
        }
    });

    manualAddBtn.addEventListener('click', () => commitOperation('+'));
    manualSubtractBtn.addEventListener('click', () => commitOperation('-'));

    resetTotalBtn.addEventListener('click', resetCalculator);

    historyList.addEventListener('click', (event) => {
        const target = event.target.closest('button[data-action]');
        if (!target) return;

        const id = parseInt(target.dataset.id || '0', 10);
        if (!id) return;

        if (target.dataset.action === 'edit') {
            startEditing(id);
        }

        if (target.dataset.action === 'delete') {
            removeHistoryItem(id);
        }
    });

    setActiveField('hours');
    renderInputBuffers();
    renderHistory();
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
