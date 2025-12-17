/**
 * generate-assets.js
 * Gera automaticamente assets.js com a lista COMPLETA de ficheiros a cachear.
 * Corre no teu PC (Node.js), não corre no browser.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT = 'assets.js';

// Extensões que queremos incluir na cache
const ALLOWED_EXT = new Set([
  '.html', '.css', '.js', '.json',
  '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif',
  '.ico', '.txt'
]);

// Pastas a ignorar (ajusta se tiveres mais)
const IGNORE_DIRS = new Set(['.git', 'node_modules']);

// Ficheiros gerados/geradores a ignorar
const IGNORE_FILES = new Set(['assets.js', 'generate-assets.js']);

function walk(dir) {
  let results = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    if (IGNORE_DIRS.has(item)) continue;

    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
      continue;
    }

    // Ignorar este próprio script e o assets.js gerado
    if (IGNORE_FILES.has(item)) continue;

    const ext = path.extname(item).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) continue;

    // Caminho relativo com "./" e slashes unix
    results.push('./' + fullPath.replace(/\\/g, '/'));
  }

  return results;
}

let assets = walk('.')
  // Não meter o service worker na cache (evita efeitos estranhos ao atualizar)
  .filter(p => p !== './service-worker.js')
  .sort();

/**
 * generate-assets.js
 * Gera automaticamente assets.js com a lista COMPLETA de ficheiros a cachear.
 * Corre no teu PC (Node.js), não corre no browser.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT = 'assets.js';

// Extensões que queremos incluir na cache
const ALLOWED_EXT = new Set([
  '.html', '.css', '.js', '.json',
  '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif',
  '.ico', '.txt'
]);

// Pastas a ignorar (ajusta se tiveres mais)
const IGNORE_DIRS = new Set(['.git', 'node_modules']);

// Ficheiros gerados/geradores a ignorar
const IGNORE_FILES = new Set(['assets.js', 'generate-assets.js']);

function walk(dir) {
  let results = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    if (IGNORE_DIRS.has(item)) continue;

    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
      continue;
    }

    // Ignorar este próprio script e o assets.js gerado
    if (IGNORE_FILES.has(item)) continue;

    const ext = path.extname(item).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) continue;

    // Caminho relativo com "./" e slashes unix
    results.push('./' + fullPath.replace(/\\/g, '/'));
  }

  return results;
}

let assets = walk('.')
  // Não meter o service worker na cache (evita efeitos estranhos ao atualizar)
  .filter(p => p !== './service-worker.js')
  .sort();

// Garantir que a raiz (./) está incluída (útil em GH Pages)
if (!assets.includes('./')) assets.unshift('./');

const content =
`// GERADO AUTOMATICAMENTE — NÃO EDITAR À MÃO
// Executa: node generate-assets.js
self.__ASSETS__ = ${JSON.stringify(assets, null, 2)};
`;

fs.writeFileSync(OUTPUT, content, 'utf8');
console.log(`✔ Gerado ${OUTPUT} com ${assets.length} ficheiros`);
