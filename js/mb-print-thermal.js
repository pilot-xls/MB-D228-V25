// =====================================================
// mb-print-thermal.js
// Gera o talão como um PDF a sério (jsPDF): texto vetorial real
// (não pixelizado) + a imagem do envelope CG incorporada, com a
// página já definida a 80mm de largura por altura ajustada ao
// conteúdo. Isto substitui a abordagem anterior (desenhar tudo num
// <canvas> e exportar como PNG), que exigia truques de preto/branco
// puro, supersampling e redução em etapas só para compensar o facto
// de sermos nós a rasterizar o texto — um PDF deixa o texto como
// texto, e o motor de impressão/visualizador trata da nitidez.
//
// Também evita o mesmo problema de sempre com o window.print(): no
// iOS, o ecrã de impressão nativo só oferece tamanhos de papel fixos
// (A3/A4/etc., nunca 80mm/rolo) — mas como agora é a própria PDF que
// já vem com o tamanho de página embutido, abrir/partilhar esse PDF
// não passa por esse ecrã, e o tamanho fica correto onde quer que vá.
// =====================================================

const PAGE_WIDTH_MM = 80; // largura do rolo térmico
const MARGIN_MM = 2; // margem mínima — mais do que isto e a maioria das impressoras térmicas já corta fisicamente perto do bordo
const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2;
const ENVELOPE_EMBED_WIDTH_PX = 1600; // resolução da imagem do envelope incorporada no PDF — dá margem de sobra sem inchar o ficheiro
const FONT_NAME = "courier"; // fonte base do PDF (sempre disponível, sem precisar de embutir nada) — igual em toda a parte, texto e números

let lastReciboPdfBlob = null;
let lastReciboPdfUrl = null;

if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "js/vendor/pdf.worker.min.js";
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await waitForPrintPageReady();
        if (typeof exec_calculo === "function") {
            await exec_calculo();
        }
        // Gera o PDF logo à entrada, sem esperar por um clique manual.
        await gerarReciboPDF({ silent: true });
    } catch (error) {
        console.error("Erro ao preparar os dados:", error);
    }

    const btnShareThermalImage = document.getElementById("btnShareThermalImage");
    if (btnShareThermalImage && navigator.share) {
        const btnShareThermalImageWrap = document.getElementById("btnShareThermalImageWrap");
        if (btnShareThermalImageWrap) {
            btnShareThermalImageWrap.hidden = false;
        }
        btnShareThermalImage.addEventListener("click", async () => {
            await gerarReciboPDF({ silent: true });
            await partilharReciboPDF();
        });
    }

    const btnClosePrint = document.getElementById("btnClosePrint");
    if (btnClosePrint) {
        btnClosePrint.addEventListener("click", () => {
            if (window.opener) {
                window.close();
                return;
            }
            window.history.back();
        });
    }
});

function atualizarDataHoraImpressao() {
    const el = document.getElementById("mbPrintTimestamp");
    const agora = new Date();
    const texto = agora.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    const textoFinal = `Generated: ${texto}`;
    if (el) el.textContent = textoFinal;
    return textoFinal;
}

async function waitForPrintPageReady() {
    if (document.readyState !== "complete") {
        await new Promise(resolve => window.addEventListener("load", resolve, { once: true }));
    }
    const images = Array.from(document.querySelectorAll("img"));
    await Promise.allSettled(images.map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(resolve => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
            setTimeout(resolve, 1500);
        });
    }));
}

// --- Leitura dos dados a partir do DOM (depois de exec_calculo() correr) ---

function getEl(id) {
    const el = document.getElementById(id);
    return el ? String(el.textContent ?? "").trim() : "";
}

function getVal(id) {
    const el = document.getElementById(id);
    if (!el) return "";
    if ("value" in el) return String(el.value ?? "").trim();
    return String(el.textContent ?? "").trim();
}

// Converte o conteúdo da célula INFO (pode ter <br> e um
// <span class="info-warning">) numa lista de linhas de texto simples.
function getInfoLines(trEl) {
    if (!trEl) return [];
    const cell = trEl.querySelector("td:last-child");
    if (!cell) return [];
    const html = cell.innerHTML.trim();
    if (!html) return [];
    return html.split(/<br\s*\/?>/i).map(fragment => {
        const tmp = document.createElement("div");
        tmp.innerHTML = fragment;
        return {
            text: tmp.textContent.trim(),
            warning: !!tmp.querySelector(".info-warning")
        };
    }).filter(line => line.text);
}

function buildRows() {
    const fuelTr = document.getElementById("fuel")?.closest("tr");
    const payloadTr = document.getElementById("manualPayload")?.closest("tr");
    const zfwTr = document.getElementById("zfw")?.closest("tr");
    const rampTr = document.getElementById("rampRow");
    const takeoffTr = document.getElementById("takeoffRow");
    const landingTr = document.getElementById("landingRow");

    return [
        { label: "Basic weight", weight: getEl("basicWeight"), moment: getEl("basicMoment") },
        { label: "Pilots", weight: getVal("pilots"), moment: getEl("momentPilots") },
        { label: "Payload", weight: getVal("manualPayload"), moment: getEl("momentPayload"), info: getInfoLines(payloadTr) },
        { label: "ZFW", weight: getEl("zfw"), moment: getEl("momentZfw"), info: getInfoLines(zfwTr), gray: true, exceeded: zfwTr?.classList.contains("limit-exceed") },
        { label: "Fuel loading", weight: getVal("fuel"), moment: getEl("momentFuel"), info: getInfoLines(fuelTr), exceeded: fuelTr?.classList.contains("limit-exceed") },
        { label: "Ramp Weight", weight: getEl("rampWeight"), moment: getEl("momentRamp"), info: getInfoLines(rampTr), gray: true, exceeded: rampTr?.classList.contains("limit-exceed") },
        { label: "Fuel taxi", weight: getVal("fuelTaxi"), moment: getEl("momentTaxi") },
        { label: "Take-off Weight", weight: getEl("takeoffWeight"), moment: getEl("momentTakeoff"), info: getInfoLines(takeoffTr), gray: true, exceeded: takeoffTr?.classList.contains("limit-exceed") },
        { label: "Fuel to destination", weight: getVal("fuelDest"), moment: getEl("momentDest") },
        { label: "Landing Weight", weight: getEl("landingWeight"), moment: getEl("momentLanding"), info: getInfoLines(landingTr), gray: true, exceeded: landingTr?.classList.contains("limit-exceed") }
    ];
}

// --- Geração do PDF ---

async function gerarReciboPDF({ silent = false } = {}) {
    try {
        if (typeof exec_calculo === "function") {
            await exec_calculo();
        }
        const timestamp = atualizarDataHoraImpressao();

        const doc = construirReciboPDF(timestamp);
        const blob = doc.output("blob");

        if (lastReciboPdfUrl) {
            URL.revokeObjectURL(lastReciboPdfUrl);
        }
        lastReciboPdfBlob = blob;
        lastReciboPdfUrl = URL.createObjectURL(blob);

        const wrap = document.getElementById("mbThermalPreviewWrap");
        const canvas = document.getElementById("mbThermalPreviewCanvas");

        if (wrap) {
            wrap.hidden = false;
            if (!silent) {
                wrap.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
        // Em vez de meter o PDF num <iframe> e confiar no visualizador
        // nativo do browser/SO para o encolher e encher a caixa (o
        // comportamento varia entre motores — no Safari/iOS sobrava
        // espaço em branco por baixo do talão), desenha-se aqui a
        // própria página 1 do PDF num <canvas> com o pdf.js. Um canvas
        // dimensiona-se como qualquer imagem (width:100%; height:auto),
        // por isso a pré-visualização fica sempre com a proporção real
        // do talão, em qualquer browser.
        if (canvas) {
            await desenharPreviaPDF(blob, canvas);
        }
    } catch (error) {
        console.error("Erro ao gerar o PDF do talão:", error);
        if (!silent) {
            alert("Não foi possível gerar o PDF: " + (error?.message || error));
        }
    }
}

// Partilha o PDF gerado (Web Share API) — apps como o Thermer recebem o
// ficheiro tal como foi construído, já com o tamanho de página certo.
async function partilharReciboPDF() {
    if (!lastReciboPdfBlob) return;

    const file = new File([lastReciboPdfBlob], "weight-balance-80mm.pdf", { type: "application/pdf" });

    if (!navigator.canShare || !navigator.canShare({ files: [file] })) {
        alert("Este browser não suporta partilhar este PDF diretamente.");
        return;
    }

    try {
        await navigator.share({ files: [file], title: "Weight & Balance" });
    } catch (error) {
        if (error?.name !== "AbortError") {
            console.error("Erro ao partilhar o PDF:", error);
        }
    }
}

// Renderiza a página 1 do PDF gerado para o <canvas> de pré-visualização
// usando o pdf.js — ver nota em gerarReciboPDF() sobre porquê (evitar o
// visualizador de PDF nativo do browser/SO, que se comporta de forma
// inconsistente dentro de um <iframe>).
async function desenharPreviaPDF(blob, canvas) {
    if (!window.pdfjsLib) return;
    try {
        const bytes = await blob.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;
        const page = await pdf.getPage(1);
        const dpr = window.devicePixelRatio || 1;
        const escala = (2 * dpr); // resolução extra para ficar nítido em ecrãs retina
        const viewport = page.getViewport({ scale: escala });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport }).promise;
        canvas.dataset.rendered = "true";
    } catch (error) {
        console.error("Erro ao desenhar a pré-visualização do PDF:", error);
    }
}

// As imagens do envelope CG (img/serieXXX.png) vêm gigantes (algumas com
// mais de 15000px de largura). Embutir isso directamente no PDF criaria
// um ficheiro enorme e lento a partilhar; reduzimos primeiro para uma
// resolução generosa mas razoável (ENVELOPE_EMBED_WIDTH_PX). Fazemo-lo
// sempre a metade de cada vez (em vez de um salto grande de uma só vez)
// porque é isso que preserva bem as linhas finas da grelha — reduções
// muito agressivas num único passo deixam-nas aos pontos.
function criarCanvasReduzidoEmEtapas(img, larguraAlvo, alturaAlvo) {
    const MAX_INTERMEDIATE = 4096; // limite seguro de tamanho de canvas no Safari/iOS
    let origem = img;
    let largura = img.naturalWidth;
    let altura = img.naturalHeight;

    if (largura > MAX_INTERMEDIATE || altura > MAX_INTERMEDIATE) {
        const escala = MAX_INTERMEDIATE / Math.max(largura, altura);
        largura = Math.round(largura * escala);
        altura = Math.round(altura * escala);
        const c = document.createElement("canvas");
        c.width = largura;
        c.height = altura;
        const cctx = c.getContext("2d");
        cctx.imageSmoothingEnabled = true;
        cctx.imageSmoothingQuality = "high";
        cctx.drawImage(img, 0, 0, largura, altura);
        origem = c;
    }

    while (largura > larguraAlvo * 2 && altura > alturaAlvo * 2) {
        const novaLargura = Math.round(largura / 2);
        const novaAltura = Math.round(altura / 2);
        const c = document.createElement("canvas");
        c.width = novaLargura;
        c.height = novaAltura;
        const cctx = c.getContext("2d");
        cctx.imageSmoothingEnabled = true;
        cctx.imageSmoothingQuality = "high";
        cctx.drawImage(origem, 0, 0, novaLargura, novaAltura);
        origem = c;
        largura = novaLargura;
        altura = novaAltura;
    }

    const final = document.createElement("canvas");
    final.width = larguraAlvo;
    final.height = alturaAlvo;
    const fctx = final.getContext("2d");
    fctx.imageSmoothingEnabled = true;
    fctx.imageSmoothingQuality = "high";
    fctx.drawImage(origem, 0, 0, larguraAlvo, alturaAlvo);
    return final;
}

// A fonte "Courier" standard do PDF só suporta a codificação WinAnsi
// (essencialmente Latin-1) — mas os números do talão vêm formatados
// com espaços Unicode "especiais" como separador de milhares (ex:
// "28 051,1", um "narrow no-break space"), que não existem nessa
// codificação e faziam o jsPDF espaçar as letras todas de forma
// estranha nessa linha. Trocamos por um espaço normal antes de desenhar.
function textoSeguroPdf(str) {
    return String(str)
        .replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, " ")
        .replace(/[\u2010-\u2015]/g, "-")
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"');
}

function elementoParaDataUrl(imgEl) {
    const c = document.createElement("canvas");
    c.width = imgEl.naturalWidth;
    c.height = imgEl.naturalHeight;
    c.getContext("2d").drawImage(imgEl, 0, 0);
    return c.toDataURL("image/png");
}

// Constrói a lista de elementos a desenhar (texto/linhas/imagem/pontos),
// medindo a altura total ao mesmo tempo — só depois de sabermos a altura
// exacta é que criamos o documento jsPDF com o tamanho de página certo
// (80mm de largura, altura ajustada ao conteúdo deste talão específico).
function construirReciboPDF(timestamp) {
    const rows = buildRows();

    const LINE_LABEL_H = 4;
    const LINE_SECOND_H = 2.8;
    const ROW_PAD = 0.6;

    let y = MARGIN_MM;
    const desenhos = [];

    // --- Logo ---
    const logoImg = document.getElementById("thermalLogo");
    if (logoImg && logoImg.naturalWidth) {
        const logoWmm = 26;
        const logoHmm = logoWmm * (logoImg.naturalHeight / logoImg.naturalWidth);
        desenhos.push({ tipo: "imagem-el", el: logoImg, x: (PAGE_WIDTH_MM - logoWmm) / 2, y, w: logoWmm, h: logoHmm });
        y += logoHmm + 2;
    }

    // --- Título / aeronave / leg / hora ---
    desenhos.push({ tipo: "texto", texto: "Weight & Balance", x: PAGE_WIDTH_MM / 2, y: y + 4, tamanho: 15, align: "center" });
    y += 6.5;

    const acSelected = getEl("ac-selected");
    const nomeLeg = getEl("nomeLeg");
    if (acSelected) {
        desenhos.push({ tipo: "texto", texto: acSelected, x: PAGE_WIDTH_MM / 2, y: y + 3, tamanho: 10, align: "center" });
        y += 3.6;
    }
    if (nomeLeg) {
        desenhos.push({ tipo: "texto", texto: nomeLeg, x: PAGE_WIDTH_MM / 2, y: y + 3, tamanho: 10, align: "center" });
        y += 3.6;
    }

    desenhos.push({ tipo: "texto", texto: timestamp, x: PAGE_WIDTH_MM / 2, y: y + 2.6, tamanho: 7, align: "center" });
    y += 4.5;

    desenhos.push({ tipo: "linha", x1: MARGIN_MM, x2: PAGE_WIDTH_MM - MARGIN_MM, y, espessura: 0.4 });
    y += 1;

    // --- Linhas da tabela ---
    rows.forEach(row => {
        const infoLinesH = row.info && row.info.length ? row.info.length * LINE_SECOND_H : 0;
        const secondH = Math.max(row.moment ? LINE_SECOND_H : 0, infoLinesH);
        const rowH = ROW_PAD + LINE_LABEL_H + secondH + ROW_PAD;
        const rowTop = y;

        let ty = rowTop + ROW_PAD + 2.6;
        desenhos.push({ tipo: "texto", texto: row.label, x: MARGIN_MM, y: ty, tamanho: 9.5, align: "left" });
        desenhos.push({ tipo: "texto", texto: String(row.weight ?? "0"), x: PAGE_WIDTH_MM - MARGIN_MM, y: ty, tamanho: 12, align: "right" });

        ty += LINE_SECOND_H;
        if (row.moment) {
            desenhos.push({ tipo: "texto", texto: `Moment ${row.moment}`, x: MARGIN_MM, y: ty, tamanho: 7, align: "left" });
        }
        if (row.info && row.info.length) {
            row.info.forEach((line, idx) => {
                desenhos.push({ tipo: "texto", texto: line.text, x: PAGE_WIDTH_MM - MARGIN_MM, y: ty + idx * LINE_SECOND_H, tamanho: 7, align: "right" });
            });
        }

        y = rowTop + rowH;
        desenhos.push({ tipo: "linha", x1: MARGIN_MM, x2: PAGE_WIDTH_MM - MARGIN_MM, y, espessura: 0.15 });
    });

    y += 1.5;

    // --- Envelope CG ---
    const envelopeImg = document.getElementById("loadsheet-base");
    if (envelopeImg && envelopeImg.naturalWidth) {
        const imgWmm = CONTENT_WIDTH_MM;
        const imgHmm = imgWmm * (envelopeImg.naturalHeight / envelopeImg.naturalWidth);
        const alturaAlvoPx = Math.round(ENVELOPE_EMBED_WIDTH_PX * (envelopeImg.naturalHeight / envelopeImg.naturalWidth));
        const canvasReduzido = criarCanvasReduzidoEmEtapas(envelopeImg, ENVELOPE_EMBED_WIDTH_PX, alturaAlvoPx);
        desenhos.push({ tipo: "imagem-canvas", canvas: canvasReduzido, x: MARGIN_MM, y, w: imgWmm, h: imgHmm });

        // Pontos ZFW/TOW/LDG lidos directamente do SVG já desenhado pelo
        // mb.js (desenharPontos()), para não duplicar essa lógica aqui.
        // Desenhados sempre a preto — quem identifica cada ponto é a
        // etiqueta ao lado, não a cor.
        const svg = document.getElementById("cg-svg");
        if (svg) {
            // A viewBox do SVG (400x300, proporção 4:3) não bate certo com a
            // proporção real das imagens do envelope (mais altas que largas,
            // ~0.90) — por isso o mb.html, sem preserveAspectRatio definido,
            // usa o comportamento por omissão do SVG ("xMidYMid meet"): um
            // único factor de escala uniforme, com o conteúdo centrado e
            // espaço vazio ("letterboxing") a preencher a diferença. Replica-
            // -se aqui esse mesmo cálculo — escalar X e Y de forma
            // independente (como se fazia antes) distorcia e desalinhava os
            // pontos face ao que se vê no ecrã.
            const VB_W = 400, VB_H = 300;
            const scale = Math.min(imgWmm / VB_W, imgHmm / VB_H);
            const offsetX = (imgWmm - VB_W * scale) / 2;
            const offsetY = (imgHmm - VB_H * scale) / 2;

            svg.querySelectorAll("circle.ponto").forEach(circle => {
                const cx = MARGIN_MM + offsetX + parseFloat(circle.getAttribute("cx")) * scale;
                const cy = y + offsetY + parseFloat(circle.getAttribute("cy")) * scale;
                const r = Math.max(0.9, parseFloat(circle.getAttribute("r")) * scale);
                desenhos.push({ tipo: "circulo", x: cx, y: cy, r });
            });

            svg.querySelectorAll("text.label").forEach(text => {
                const tx = MARGIN_MM + offsetX + parseFloat(text.getAttribute("x")) * scale;
                const ty2 = y + offsetY + parseFloat(text.getAttribute("y")) * scale;
                desenhos.push({
                    tipo: "texto",
                    texto: text.textContent,
                    x: tx,
                    y: ty2,
                    tamanho: 7,
                    align: text.getAttribute("text-anchor") === "end" ? "right" : "left"
                });
            });
        }

        y += imgHmm;
    }

    y += MARGIN_MM;

    // --- Criar o documento com a altura exacta e "reproduzir" os desenhos ---
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: [PAGE_WIDTH_MM, y], compress: true });
    doc.setFont(FONT_NAME, "normal");
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor(0, 0, 0);

    desenhos.forEach(d => {
        if (d.tipo === "texto") {
            doc.setFontSize(d.tamanho);
            doc.text(textoSeguroPdf(d.texto), d.x, d.y, { align: d.align });
        } else if (d.tipo === "linha") {
            doc.setLineWidth(d.espessura);
            doc.line(d.x1, d.y, d.x2, d.y);
        } else if (d.tipo === "circulo") {
            doc.circle(d.x, d.y, d.r, "F");
        } else if (d.tipo === "imagem-el") {
            const dataUrl = elementoParaDataUrl(d.el);
            if (dataUrl) doc.addImage(dataUrl, "PNG", d.x, d.y, d.w, d.h);
        } else if (d.tipo === "imagem-canvas") {
            doc.addImage(d.canvas.toDataURL("image/png"), "PNG", d.x, d.y, d.w, d.h);
        }
    });

    return doc;
}
