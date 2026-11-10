// Inventario de ejercicios que `auditar:banco` no puede verificar automáticamente.
// Genera docs/REVISION_MANUAL.md para el trabajo de revisión manual (Codex).
// Uso: npm run inventario
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const dir = resolve(aqui, '..', 'src', 'content', 'ejercicios');
const docs = resolve(aqui, '..', 'docs');

const RE_MEDIBLE = /\bmedia\b|\bpromedio\b|x̄|\bmediana\b|\bsuma\b/;

const ejercicios = readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));

const auto = [];
const manual = [];

for (const e of ejercicios) {
  const conjunto = e.datos?.conjunto;
  const numerico = Array.isArray(conjunto) && conjunto.every((x) => typeof x === 'number');
  const tieneMedible =
    numerico &&
    e.partes.some(
      (p) =>
        (p.tipo === 'moda' || p.tipo === 'numeroConjunto') ||
        (p.tipo === 'numero' && RE_MEDIBLE.test((p.label ?? p.id ?? '').toLowerCase())),
    );
  if (tieneMedible) auto.push(e);
  else manual.push(e);
}

const lineas = [
  '# Revisión manual requerida',
  '',
  `Ejercicios fuera del alcance de \`auditar:banco\`. Total: **${ejercicios.length}**; auto-verificados: ${auto.length}; requieren revisión manual: **${manual.length}**.`,
  '',
  'Motivos: sin datos numéricos (conceptual/cualitativo) o con datos pero sin una parte de media/mediana/moda/suma que el script pueda recalcular.',
  '',
  '| ID | Título | Módulo | Nivel | Motivo |',
  '| --- | --- | --- | --- | --- |',
];

for (const e of manual) {
  const conjunto = e.datos?.conjunto;
  const numerico = Array.isArray(conjunto) && conjunto.every((x) => typeof x === 'number');
  const motivo = numerico ? 'Datos numéricos, parte no medible automáticamente' : 'Sin datos numéricos (conceptual/cualitativo)';
  lineas.push(`| \`${e.id}\` | ${e.titulo} | ${e.modulo} | ${e.nivel} | ${motivo} |`);
}

mkdirSync(docs, { recursive: true });
writeFileSync(join(docs, 'REVISION_MANUAL.md'), lineas.join('\n') + '\n', 'utf8');
console.log(`Inventario: ${auto.length} auto-verificados, ${manual.length} para revisión manual → docs/REVISION_MANUAL.md`);
