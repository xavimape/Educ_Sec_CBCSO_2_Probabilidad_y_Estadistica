// Genera docs/MAPA_DE_CONTENIDOS.md con la cobertura y el inventario del banco.
// Uso: npm run resumen
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const dirEjercicios = resolve(aqui, '..', 'src', 'content', 'ejercicios');
const docsDir = resolve(aqui, '..', 'docs');

const archivos = readdirSync(dirEjercicios).filter((f) => f.endsWith('.json'));
const ejercicios = archivos
  .map((f) => JSON.parse(readFileSync(join(dirEjercicios, f), 'utf8')))
  .sort((a, b) => (a.modulo === b.modulo ? a.id.localeCompare(b.id) : a.modulo.localeCompare(b.modulo)));

const porModulo = new Map();
const porModuloNivel = new Map();
for (const e of ejercicios) {
  porModulo.set(e.modulo, (porModulo.get(e.modulo) ?? 0) + 1);
  const clave = `${e.modulo} · ${e.nivel}`;
  porModuloNivel.set(clave, (porModuloNivel.get(clave) ?? 0) + 1);
}

const heredadas = ejercicios.filter((e) => e.origen !== 'nuevo').length;
const nuevas = ejercicios.filter((e) => e.origen === 'nuevo').length;

const lineas = [
  '# Mapa de contenidos y cobertura del banco',
  '',
  `Total: **${ejercicios.length} ejercicios** (${heredadas} heredadas + ${nuevas} nuevas). Generado por \`npm run resumen\`.`,
  '',
  '## Cobertura por módulo',
  '',
  '| Módulo | Contenido | Cantidad |',
  '| --- | --- | ---: |',
];
const TITULOS_MODULO = {
  M1: 'Dato y variable',
  M2: 'Tablas de frecuencias',
  M3: 'Gráficos',
  M4: 'Medidas de tendencia central',
  M6: 'Azar y espacio muestral',
  M7: 'Conteo y probabilidad',
  M8: 'Comunicación y lectura crítica',
};
for (const [m, c] of [...porModulo.entries()].sort()) {
  lineas.push(`| ${m} | ${TITULOS_MODULO[m] ?? ''} | ${c} |`);
}

lineas.push('', '## Cobertura por módulo y nivel', '', '| Módulo · Nivel | Cantidad |', '| --- | ---: |');
for (const [k, c] of [...porModuloNivel.entries()].sort()) {
  lineas.push(`| ${k} | ${c} |`);
}

lineas.push('', '## Inventario', '', '| ID | Título | Módulo | Nivel | Origen |', '| --- | --- | --- | --- | --- |');
for (const e of ejercicios) {
  lineas.push(`| \`${e.id}\` | ${e.titulo} | ${e.modulo} | ${e.nivel} | ${e.origen} |`);
}

mkdirSync(docsDir, { recursive: true });
writeFileSync(join(docsDir, 'MAPA_DE_CONTENIDOS.md'), lineas.join('\n') + '\n', 'utf8');
console.log(`Mapa generado: ${ejercicios.length} ejercicios en docs/MAPA_DE_CONTENIDOS.md`);
console.log('Por módulo:', Object.fromEntries([...porModulo.entries()].sort()));
