document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('timeHistory');
    const totalDisplay = document.getElementById('totalDisplay');
    const hoursInput = document.getElementById('hoursInput');
    const minutesInput = document.getElementById('minutesInput');
    const manualAddBtn = document.getElementById('manualAddBtn');
    const manualSubtractBtn = document.getElementById('manualSubtractBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const undoBtn = document.getElementById('undoBtn');
    const quickButtons = document.querySelectorAll('.quick-btn');

    let history = [];

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

    const formatAction = (item) => {
        const sign = item.operator === '-' ? '-' : '+';
        const h = Math.floor(item.minutes / 60);
        const m = item.minutes % 60;

        if (h > 0 && m > 0) return `${sign}${h}h ${m}m`;
        if (h > 0) return `${sign}${h}h`;
        return `${sign}${m} min`;
    };

    const calculateTotal = () => history.reduce((acc, item) => {
        if (item.operator === '-') return acc - item.minutes;
        return acc + item.minutes;
    }, 0);

    const editEntry = (index) => {
        const entry = history[index];
        if (!entry) return;

        const current = `${entry.operator}${entry.minutes}`;
        const updated = window.prompt('Editar entrada (ex: +90 ou -45):', current);

        if (updated === null) return;

        const cleaned = updated.replace(/\s+/g, '');
        const match = cleaned.match(/^([+-])(\d+)$/);

        if (!match) {
            window.alert('Formato inválido. Use +90 ou -45.');
            return;
        }

        const [, operator, minuteText] = match;
        const minutes = parseInt(minuteText, 10);

        if (minutes <= 0) {
            window.alert('Os minutos devem ser superiores a zero.');
            return;
        }

        history[index] = { operator, minutes };
        renderAll();
    };

    const renderHistory = () => {
        historyList.innerHTML = '';

        if (history.length === 0) {
            const emptyState = document.createElement('li');
            emptyState.className = 'history-empty';
            emptyState.textContent = 'Sem entradas ainda.';
            historyList.appendChild(emptyState);
        } else {
            history.forEach((item, index) => {
                const line = document.createElement('li');
                line.className = 'history-line';

                const action = document.createElement('span');
                action.className = 'history-action';
                action.textContent = formatAction(item);

                const controls = document.createElement('div');
                controls.className = 'history-controls';

                const editBtn = document.createElement('button');
                editBtn.type = 'button';
                editBtn.className = 'history-btn';
                editBtn.textContent = 'Editar';
                editBtn.addEventListener('click', () => editEntry(index));

                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.className = 'history-btn danger';
                deleteBtn.textContent = 'Apagar';
                deleteBtn.addEventListener('click', () => {
                    history.splice(index, 1);
                    renderAll();
                });

                controls.append(editBtn, deleteBtn);
                line.append(action, controls);
                historyList.appendChild(line);
            });
        }

        undoBtn.disabled = history.length === 0;
        clearHistoryBtn.disabled = history.length === 0;
    };

    const renderTotal = () => {
        totalDisplay.textContent = minutesToReadable(calculateTotal());
    };

    const renderAll = () => {
        renderHistory();
        renderTotal();
    };

    const clearInputs = () => {
        hoursInput.value = '';
        minutesInput.value = '';
    };

    const addEntry = (minutes, operator) => {
        if (!minutes || minutes < 0) return;
        history.push({ operator, minutes });
        clearInputs();
        renderAll();
    };

    manualAddBtn.addEventListener('click', () => {
        addEntry(inputToMinutes(), '+');
    });

    manualSubtractBtn.addEventListener('click', () => {
        addEntry(inputToMinutes(), '-');
    });

    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        clearInputs();
        renderAll();
    });

    undoBtn.addEventListener('click', () => {
        history.pop();
        renderAll();
    });

    quickButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes || '0', 10);
            const operator = btn.dataset.op === '-' ? '-' : '+';
            addEntry(minutes, operator);
        });
    });

    renderAll();
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
