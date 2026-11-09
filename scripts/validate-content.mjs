// Validación del banco de ejercicios: banco no vacío, IDs únicos, campos mínimos y tipo de `esperado` por clase de respuesta.
// La validación completa contra el esquema Zod se ejercita en tests/unit/contenido.test.ts.
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dirEjercicios = join(raiz, 'src', 'content', 'ejercicios');

const archivos = readdirSync(dirEjercicios).filter((f) => f.endsWith('.json'));

if (archivos.length === 0) {
  console.error('El banco está vacío: no hay ejercicios en src/content/ejercicios.');
  process.exit(1);
}

const ids = new Set();
const porModulo = new Map();

for (const archivo of archivos) {
  const contenido = JSON.parse(readFileSync(join(dirEjercicios, archivo), 'utf8'));
  if (!contenido.id || !contenido.modulo || !contenido.enunciado || !Array.isArray(contenido.partes) || contenido.partes.length === 0) {
    console.error(`Campos mínimos incompletos en ${archivo}`);
    process.exit(1);
  }
  if (ids.has(contenido.id)) {
    console.error(`ID duplicado: ${contenido.id}`);
    process.exit(1);
  }
  ids.add(contenido.id);
  for (const parte of contenido.partes) {
    const error = validarEsperado(parte, archivo);
    if (error) {
      console.error(error);
      process.exit(1);
    }
  }
  porModulo.set(contenido.modulo, (porModulo.get(contenido.modulo) ?? 0) + 1);
}

console.log(`Ejercicios válidos: ${ids.size}.`);
console.log('Por módulo:', Object.fromEntries([...porModulo.entries()].sort()));

function validarEsperado(parte, archivo) {
  const { id, tipo, esperado } = parte;
  const esNumero = typeof esperado === 'number' && Number.isFinite(esperado);
  const esLista = Array.isArray(esperado);
  const esFraccion =
    typeof esperado === 'object' && esperado !== null && 'numerador' in esperado && 'denominador' in esperado;
  switch (tipo) {
    case 'numero':
    case 'probabilidad':
      if (!esNumero && !esFraccion) return `${archivo}/${id}: el tipo "${tipo}" espera un número o una fracción.`;
      return null;
    case 'numeroConjunto':
    case 'moda':
      if (!esLista) return `${archivo}/${id}: el tipo "${tipo}" espera una lista.`;
      return null;
    case 'select':
      if (typeof esperado !== 'string') return `${archivo}/${id}: el tipo "select" espera una cadena.`;
      return null;
    case 'rubrica':
    case 'tabla':
    case 'barras':
      return null; // estructura libre / respuesta embebida en `detalle`
    default:
      return `${archivo}/${id}: tipo desconocido "${tipo}".`;
  }
}
