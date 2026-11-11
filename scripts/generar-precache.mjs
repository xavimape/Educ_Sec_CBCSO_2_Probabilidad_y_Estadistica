// Genera la lista de precache del service worker a partir de dist/ (no manual).
// Se ejecuta después de `astro build` (npm run build) y escribe dist/sw-precache.js.
import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const dist = resolve(aqui, '..', 'dist');

if (!existsSync(dist)) {
  console.error('No existe dist/. Ejecutá `npm run build` primero.');
  process.exit(1);
}

const EXCLUIR = new Set(['sw.js', 'sw-registro.js', 'sw-precache.js', '.nojekyll']);
const CARPETAS_EXCLUIDAS = ['fichas', 'documentos'];

function recorrer(dir, base) {
  const urls = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    const rel = relative(base, ruta).split(sep).join('/');
    if (entrada.isDirectory()) {
      urls.push(...recorrer(ruta, base));
      continue;
    }
    if (EXCLUIR.has(rel)) continue;
    if (CARPETAS_EXCLUIDAS.some((c) => rel.startsWith(c + '/'))) continue;
    urls.push('./' + rel.replace(/index\.html$/, ''));
  }
  return urls;
}

const urls = recorrer(dist, dist);
writeFileSync(join(dist, 'sw-precache.js'), `self.__PRECACHE__ = ${JSON.stringify(urls, null, 2)};\n`, 'utf8');
console.log(`Precache generado: ${urls.length} recursos → dist/sw-precache.js`);
