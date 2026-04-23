// Espera que o HTML da página esteja carregado antes de executar o resto do código
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Espera que a página fique pronta para impressão: imagens, fontes e layout
        await waitForPrintPageReady();

        // Preenche a página de impressão com os dados e converte inputs em valores estáticos
        await hydratePrintPage();

        // Volta a esperar pelo layout final depois de preencher a página
        await waitForPrintPageReady();

        // Dá um pequeno atraso extra para garantir estabilidade visual antes de imprimir
        await new Promise(resolve => setTimeout(resolve, 250));

        // Se esta página foi aberta a partir do botão de impressão, atualiza a data/hora e imprime logo
        if (localStorage.getItem("mbPrintRequestedAt")) {
            // Atualiza o texto com a data/hora exacta da impressão
            atualizarDataHoraImpressao();

            // Abre o diálogo de impressão do browser
            window.print();
        }
    } catch (error) {
        // Mostra erro na consola caso algo falhe na preparação da página
        console.error("Erro ao preparar a página de impressão:", error);
    }

    // Vai buscar o botão de imprimir manualmente, caso exista na página
    const btnPrintNow = document.getElementById("btnPrintNow");

    // Se o botão existir, associa o clique à impressão manual
    if (btnPrintNow) {
        btnPrintNow.addEventListener("click", () => {
            // Actualiza a data/hora imediatamente antes de imprimir
            atualizarDataHoraImpressao();

            // Abre o diálogo de impressão
            window.print();
        });
    }

    // Vai buscar o botão de fechar/voltar, caso exista
    const btnClosePrint = document.getElementById("btnClosePrint");

    // Se o botão existir, associa o clique ao fecho da página ou ao retrocesso no histórico
    if (btnClosePrint) {
        btnClosePrint.addEventListener("click", () => {
            // Se a página foi aberta por outra janela, tenta fechá-la
            if (window.opener) {
                window.close();
                return;
            }

            // Se não houver janela pai, volta para a página anterior
            window.history.back();
        });
    }

    // Depois da impressão, limpa a marca usada para auto-impressão
    window.addEventListener("afterprint", () => {
        // Remove a flag que indica que a impressão foi pedida a partir da página anterior
        localStorage.removeItem("mbPrintRequestedAt");
    }, { once: true });
});

// Preenche a página com os dados finais necessários para impressão
async function hydratePrintPage() {
    // Se a função de cálculo existir, executa-a para garantir que os valores estão actualizados
    if (typeof exec_calculo === "function") {
        await exec_calculo();
    }

    // Converte todos os inputs da área de impressão em valores fixos visíveis
    convertInputsToStaticValues();
}

// Converte os campos input em caixas de texto estáticas para a impressão ficar limpa
function convertInputsToStaticValues() {
    // Procura todos os inputs visíveis dentro da área de impressão
    const inputs = Array.from(document.querySelectorAll('#mbPrintCapture input:not([type="hidden"])'));

    // Percorre cada input encontrado
    inputs.forEach(input => {
        // Cria um novo elemento div para substituir o input
        const staticValue = document.createElement("div");

        // Define uma classe para poderes estilizar o valor estático via CSS
        staticValue.className = "mb-static-value";

        // Copia o valor do input; se estiver vazio, mostra 0
        staticValue.textContent = String(input.value ?? "").trim() || "0";

        // Define o modelo de caixa para evitar problemas de cálculo de dimensão
        staticValue.style.boxSizing = "border-box";

        // Usa flex para centrar o conteúdo dentro da caixa
        staticValue.style.display = "flex";

        // Centra verticalmente o texto
        staticValue.style.alignItems = "center";

        // Centra horizontalmente o texto
        staticValue.style.justifyContent = "center";

        // Define a largura do valor estático
        staticValue.style.width = "85%";

        // Define a altura do valor estático
        staticValue.style.height = "7mm";

        // Centra a caixa no espaço disponível
        staticValue.style.margin = "0 auto";

        // Define o espaçamento interno horizontal
        staticValue.style.padding = "0 8px";

        // Aplica uma borda semelhante à do input original
        staticValue.style.border = "1px dotted #bcbcbc";

        // Arredonda os cantos
        staticValue.style.borderRadius = "8px";

        // Define o fundo branco
        staticValue.style.background = "#ffffff";

        // Define a cor do texto
        staticValue.style.color = "#111";

        // Substitui o input original pelo valor estático
        input.replaceWith(staticValue);
    });
}

// Actualiza o carimbo temporal da impressão no elemento da página
function atualizarDataHoraImpressao() {
    // Vai buscar o elemento onde a data/hora deve aparecer
    const el = document.getElementById("mbPrintTimestamp");

    // Se o elemento não existir, termina sem erro
    if (!el) return;

    // Cria um objecto com a data e hora actuais
    const agora = new Date();

    // Formata a data e hora em português de Portugal
    const texto = agora.toLocaleString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    // Escreve o texto final no elemento visível
    el.textContent = `Generated: ${texto}`;
}

// Espera que a página fique pronta antes de imprimir
async function waitForPrintPageReady() {
    // Se o documento ainda não estiver totalmente carregado, espera pelo evento load
    if (document.readyState !== "complete") {
        await new Promise(resolve => window.addEventListener("load", resolve, { once: true }));
    }

    // Se a API de fonts estiver disponível, espera que as fontes carreguem
    if (document.fonts && document.fonts.ready) {
        try {
            await document.fonts.ready;
        } catch (error) {
            // Se falhar, mostra apenas aviso e continua
            console.warn("fonts.ready falhou:", error);
        }
    }

    // Procura todas as imagens existentes na página
    const images = Array.from(document.querySelectorAll("img"));

    // Espera que todas as imagens terminem de carregar ou falhar
    await Promise.allSettled(images.map(img => {
        // Se a imagem já estiver pronta, tenta decodificá-la
        if (img.complete && img.naturalWidth > 0) {
            if (typeof img.decode === "function") {
                return img.decode().catch(() => undefined);
            }

            // Se não existir decode, continua de imediato
            return Promise.resolve();
        }

        // Se a imagem ainda não estiver pronta, espera pelo load ou error
        return new Promise(resolve => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
            setTimeout(resolve, 1500);
        });
    }));

    // Espera dois frames para garantir que o layout ficou estável
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}