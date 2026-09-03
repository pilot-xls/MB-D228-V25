// =====================================================
// cat-printer-protocol.js
// Implementação do protocolo binário "cat printer" (cabeçalho
// 0x51 0x78 + checksum próprio), usado por vários clones
// Phomemo/GOOJPRT/Paperang/PeriPage — incluindo a GOOJPRT MTP-3
// que temos. Transcrito e verificado byte a byte contra o
// projeto open-source rbaron/catprinter (catprinter/cmds.py).
//
// Confirmado a funcionar em hardware real: um pacote GET_DEV_STATE
// sozinho e uma sequência completa (config + energia + 1 linha
// preta) imprimiram mesmo no papel (ver testes em ble-print-test.html).
//
// Nota importante descoberta a testar: a impressora tem de estar
// com a BATERIA colocada (não só ligada por cabo USB) — sem
// bateria, o motor + cabeça de impressão em simultâneo faziam-na
// desligar-se a meio (falta de corrente), independentemente do
// protocolo usado.
// =====================================================

const CAT_PRINT_WIDTH = 384; // ponto de partida — ajustável se a imagem sair cortada ou só ocupar parte do papel

const CAT_CHECKSUM_TABLE_RAW = [0,7,14,9,28,27,18,21,56,63,54,49,36,35,42,45,112,119,126,121,108,107,98,101,72,79,70,65,84,83,90,93,-32,-25,-18,-23,-4,-5,-14,-11,-40,-33,-42,-47,-60,-61,-54,-51,-112,-105,-98,-103,-116,-117,-126,-123,-88,-81,-90,-95,-76,-77,-70,-67,-57,-64,-55,-50,-37,-36,-43,-46,-1,-8,-15,-10,-29,-28,-19,-22,-73,-80,-71,-66,-85,-84,-91,-94,-113,-120,-127,-122,-109,-108,-99,-102,39,32,41,46,59,60,53,50,31,24,17,22,3,4,13,10,87,80,89,94,75,76,69,66,111,104,97,102,115,116,125,122,-119,-114,-121,-128,-107,-110,-101,-100,-79,-74,-65,-72,-83,-86,-93,-92,-7,-2,-9,-16,-27,-30,-21,-20,-63,-58,-49,-56,-35,-38,-45,-44,105,110,103,96,117,114,123,124,81,86,95,88,77,74,67,68,25,30,23,16,5,2,11,12,33,38,47,40,61,58,51,52,78,73,64,71,82,85,92,91,118,113,120,127,106,109,100,99,62,57,48,55,34,37,44,43,6,1,8,15,26,29,20,19,-82,-87,-96,-89,-78,-75,-68,-69,-106,-111,-104,-97,-118,-115,-124,-125,-34,-39,-48,-41,-62,-59,-52,-53,-26,-31,-24,-17,-6,-3,-12,-13];
const CAT_CHECKSUM_TABLE = CAT_CHECKSUM_TABLE_RAW.map(v => v & 0xff);

function catChecksum(dataBytes) {
    let b2 = 0;
    for (const byte of dataBytes) {
        b2 = CAT_CHECKSUM_TABLE[(b2 ^ byte) & 0xff];
    }
    return b2;
}

function catToUnsignedBytes(arr) {
    return arr.map(v => v & 0xff);
}

// Constrói um pacote [0x51,0x78, cmd, 0x00, lenLo, lenHi, ...dados, checksum, 0xff]
function buildCatPacket(cmdByte, dataBytes) {
    const len = dataBytes.length;
    const header = [0x51, 0x78, cmdByte & 0xff, 0x00, len & 0xff, (len >> 8) & 0xff];
    const packet = header.concat(dataBytes, [0x00, 0xff]);
    packet[packet.length - 2] = catChecksum(dataBytes);
    return packet;
}

function catConcatBytes(arrays) {
    const total = arrays.reduce((sum, a) => sum + a.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    arrays.forEach(a => {
        out.set(a, offset);
        offset += a.length;
    });
    return out;
}

// --- Comandos fixos (transcritos do cmds.py) ---
const CAT_CMD_GET_DEV_STATE = catToUnsignedBytes([81, 120, -93, 0, 1, 0, 0, 0, -1]);
const CAT_CMD_SET_QUALITY_200_DPI = catToUnsignedBytes([81, 120, -92, 0, 1, 0, 50, -98, -1]);
const CAT_CMD_LATTICE_START = catToUnsignedBytes([81, 120, -90, 0, 11, 0, -86, 85, 23, 56, 68, 95, 95, 95, 68, 56, 44, -95, -1]);
const CAT_CMD_LATTICE_END = catToUnsignedBytes([81, 120, -90, 0, 11, 0, -86, 85, 23, 0, 0, 0, 0, 0, 0, 0, 23, 17, -1]);
const CAT_CMD_SET_PAPER = catToUnsignedBytes([81, 120, -95, 0, 2, 0, 48, 0, -7, -1]);

function catCmdFeedPaper(howMuch) {
    return buildCatPacket(-67 & 0xff, [howMuch & 0xff]);
}

function catCmdSetEnergy(val) {
    return buildCatPacket(-81 & 0xff, [(val >> 8) & 0xff, val & 0xff]);
}

function catCmdApplyEnergy() {
    return buildCatPacket(-66 & 0xff, [1]);
}

// Linha toda preta (útil só para testes) — comando 0xA2 (-94).
function catCmdPrintBlackRow(width = CAT_PRINT_WIDTH) {
    const rowBytes = new Array(width / 8).fill(0xff);
    return buildCatPacket(-94 & 0xff, rowBytes);
}

// --- Compressão run-length (igual ao run_length_encode do cmds.py) ---
// Cada pixel é 0 (branco) ou 1 (preto). Cada byte de saída codifica até
// 127 pixels seguidos com o mesmo valor: bit 7 = valor do pixel, bits 0-6 = quantos.
function catEncodeRunLengthRepetition(n, val) {
    const res = [];
    while (n > 0x7f) {
        res.push(0x7f | (val << 7));
        n -= 0x7f;
    }
    if (n > 0) {
        res.push((val << 7) | n);
    }
    return res;
}

function catRunLengthEncode(pixelRow) {
    const res = [];
    let count = 0;
    let lastVal = -1;
    for (const val of pixelRow) {
        if (val === lastVal) {
            count += 1;
        } else {
            res.push(...catEncodeRunLengthRepetition(count, lastVal));
            count = 1;
        }
        lastVal = val;
    }
    if (count > 0) {
        res.push(...catEncodeRunLengthRepetition(count, lastVal));
    }
    return res;
}

// Empacota 8 pixels por byte. IMPORTANTE: a ordem dos bits é LSB-first
// (o pixel mais à esquerda do grupo de 8 fica no bit 0, não no bit 7) —
// é assim que o firmware desta família de impressoras espera, confirmado
// contra o byte_encode() do cmds.py original.
function catByteEncode(pixelRow) {
    const res = [];
    for (let chunkStart = 0; chunkStart < pixelRow.length; chunkStart += 8) {
        let byte = 0;
        for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
            if (pixelRow[chunkStart + bitIndex]) {
                byte |= (1 << bitIndex);
            }
        }
        res.push(byte);
    }
    return res;
}

// Constrói o pacote de uma linha de imagem: tenta comprimir com
// run-length (comando 0xBF); se isso não compensar (ficar maior do que
// a codificação simples), usa a codificação fixa de 1 bit/pixel
// (comando 0xA2) — exactamente a lógica do cmd_print_row() original.
function catBuildImageRowPacket(pixelRow) {
    const rle = catRunLengthEncode(pixelRow);
    if (rle.length > pixelRow.length / 8) {
        return buildCatPacket(-94 & 0xff, catByteEncode(pixelRow));
    }
    return buildCatPacket(-65 & 0xff, rle);
}

function catSleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Escreve em blocos pequenos (20 bytes) — MTU antigo do BLE não garante
// mais do que isso numa escrita só. Usa sempre "sem resposta" quando
// disponível (confirmado necessário nesta impressora).
async function catWriteInChunks(bytes, characteristic, delayMs = 30) {
    const CHUNK = 20;
    const semResposta = typeof characteristic.writeValueWithoutResponse === "function"
        && characteristic.properties.writeWithoutResponse;

    for (let offset = 0; offset < bytes.length; offset += CHUNK) {
        const chunk = bytes.slice(offset, offset + CHUNK);
        if (semResposta) {
            await characteristic.writeValueWithoutResponse(chunk);
        } else {
            await characteristic.writeValue(chunk);
        }
        await catSleep(delayMs);
    }
}
