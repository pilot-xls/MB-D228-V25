document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('timeInput');
    const keypad = document.querySelector('.keypad'); 
    
    // Variáveis de estado
    let storedTime = null; 
    let operator = null;

    // --- Funções de Formatação e Conversão ---

    /**
     * Limpa a string de entrada e formata-a como H+:MM
     * Ex: "150" -> "01:50", "4000020" -> "40000:20"
     */
    const formatInputTime = (timeString) => {
        // 1. Remove tudo o que não seja dígito.
        let digits = timeString.replace(/[^\d]/g, '');
        
        // 2. Remove zeros à esquerda em excesso (ex: "00150" torna-se "150").
        // A menos que o valor seja zero, deve ser limpo.
        digits = digits.replace(/^0+/, '');
        
        if (digits.length === 0) {
            return '00:00';
        }
        
        // 3. Os últimos dois dígitos são sempre os minutos
        const minutes = digits.slice(-2).padStart(2, '0');
        
        // 4. O resto dos dígitos são as horas
        const hours = digits.slice(0, -2); 

        // Se só houver 1 ou 2 dígitos, a hora é 0.
        if (hours.length === 0) {
            return `00:${minutes}`;
        }

        return `${hours}:${minutes}`;
    };

    /**
     * Converte HH:MM (ou H+:MM) para minutos totais.
     */
    const timeToMinutes = (timeString) => {
        // Usa a função de formatação para garantir que está no formato correto antes de calcular
        const formattedTime = formatInputTime(timeString); 
        const parts = formattedTime.split(':');
        
        if (parts.length !== 2) return NaN;
        
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        
        if (isNaN(hours) || isNaN(minutes)) return NaN;
        
        return (hours * 60) + minutes;
    };

    /**
     * Converte minutos totais para HH:MM (com suporte a horas grandes).
     */
    const minutesToTime = (totalMinutes) => {
        if (isNaN(totalMinutes)) return 'Erro';

        const sign = totalMinutes < 0 ? '-' : '';
        const absMinutes = Math.abs(totalMinutes);

        const totalHours = Math.floor(absMinutes / 60);
        const displayMinutes = absMinutes % 60;
        
        const pad = (num) => String(num).padStart(2, '0');

        return `${sign}${totalHours}:${pad(displayMinutes)}`;
    };

    // --- Lógica de Manipulação de Botões (+, -, =, C) ---

    const handleButtonClick = (value) => {
        // Obtém o valor atual do input (que está sempre formatado)
        const currentValue = input.value;
        
        // 1. Operadores (+ ou -)
        if (value === '+' || value === '-') {
            // Só avança se o valor atual não for a representação de zero ou vazio
            if (currentValue && currentValue !== '00:00') {
                
                // Converte o valor atual para minutos
                const currentMinutes = timeToMinutes(currentValue);

                // Se já houver um cálculo pendente, executa-o (cálculo em cadeia)
                if (storedTime !== null && operator !== null) {
                    executeCalculation(currentMinutes); // O resultado é o novo storedTime
                } else {
                    // Armazena a primeira hora convertida
                    storedTime = currentMinutes;
                }
                
                operator = value;
                input.value = '00:00'; // Limpa o display para a próxima hora
                // Força o foco no input
                input.focus(); 
            }
        }
        
        // 2. Igual (=)
        else if (value === '=') {
            executeCalculation();
        }
        
        // 3. Limpar (C)
        else if (value === 'C') {
            input.value = '00:00';
            storedTime = null;
            operator = null;
        }
    };

    // Função para executar o cálculo final
    const executeCalculation = (secondMinutes = null) => {
        if (storedTime === null || operator === null) return;

        // Se o segundo tempo não for fornecido, usa a entrada atual
        const secondTimeMinutes = secondMinutes !== null ? secondMinutes : timeToMinutes(input.value);

        if (isNaN(secondTimeMinutes)) return; 

        let resultMinutes;

        if (operator === '+') {
            resultMinutes = storedTime + secondTimeMinutes;
        } else if (operator === '-') {
            resultMinutes = storedTime - secondTimeMinutes;
        }

        // Prepara para a próxima operação (o resultado torna-se o storedTime)
        storedTime = resultMinutes;
        operator = null; 
        input.value = minutesToTime(resultMinutes);
    };

    // --- LIGAÇÃO DE EVENTOS ---
    
    // Adicionar event listener aos botões (+, -, =, C)
    keypad.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            handleButtonClick(event.target.textContent);
        }
    });
    
    // Adicionar event listener para formatar a hora enquanto o utilizador digita
    input.addEventListener('input', (event) => {
        const rawValue = event.target.value;
        
        // Apenas dígitos, garantindo que o valor seja limpo
        const cleanDigits = rawValue.replace(/[^\d]/g, ''); 
        
        // Formatamos o valor limpo
        const formatted = formatInputTime(cleanDigits);
        
        // Atualiza o campo com a hora formatada
        if (event.target.value !== formatted) {
            event.target.value = formatted; 
        }
    });

    // NOVO BLOCO: Selecionar o conteúdo ao focar
    input.addEventListener('focus', function() {
        this.select();
    });

    // Inicializa o display
    input.value = '00:00';
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
