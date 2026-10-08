// =====================================================
// mb-thermal-launcher.js
// Botão ADICIONAL para abrir a versão de impressão térmica
// (mb-print-thermal.html, 80mm). Ficheiro totalmente à parte:
// não altera o mb.js nem o botão "btnMbPrint" existente, por
// isso quem não tiver este botão no HTML simplesmente não é
// afetado.
// =====================================================

function initMbThermalLauncher() {
    const btn = document.getElementById("btnMbPrintThermal");
    if (!btn) return;

    btn.addEventListener("click", async () => {
        try {
            if (typeof exec_calculo === "function") {
                await exec_calculo();
            }
            localStorage.setItem("mbPrintRequestedAt", String(Date.now()));

            // Abre na MESMA janela. O window.open(..., "noopener") que aqui
            // estava devolve sempre null, por isso o fallback corria sempre e a
            // página de impressão abria duas vezes (janela nova + esta): o PDF
            // era gerado a dobrar e a janela extra ficava esquecida em memória.
            window.location.href = new URL("mb-print-thermal.html", window.location.href).toString();
        } catch (error) {
            console.error("Erro ao abrir a impressão térmica:", error);
            alert("Não foi possível abrir a impressão térmica.");
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMbThermalLauncher);
} else {
    initMbThermalLauncher();
}
