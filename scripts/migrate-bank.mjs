// Migra el banco heredado (84 actividades) al formato JSON del nuevo proyecto.
// Fuente: web-estadistica/scripts/bank/{guia.js, nuevos-1-2.js, nuevos-3-4-int.js}
// Uso: npm run migrate:bank
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const aqui = dirname(fileURLToPath(import.meta.url));
const bancoOrigen = resolve(aqui, '..', '..', 'web-estadistica', 'scripts', 'bank');
const destino = resolve(aqui, '..', 'src', 'content', 'ejercicios');

const MODULO_POR_TOPIC = {
  variables: 'M1',
  frecuencias: 'M2',
  barras: 'M3',
  medidas: 'M4',
  integrador: 'M8',
};

const TIPO_PARTE = {
  number: 'numero',
  'number-set': 'numeroConjunto',
  select: 'select',
  rubric: 'rubrica',
  'freq-table': 'tabla',
  'bar-builder': 'barras',
};

// Claves de una parte que se mapean a campos de primer nivel.
// Todo lo demás se conserva sin pérdida en `detalle`.
const CLAVES_TOP_PARTE = new Set([
  'id',
  'type',
  'expected',
  'label',
  'unit',
  'roundingDecimals',
  'integerOnly',
  'options',
]);

function mapearEsperado(esperado) {
  if (
    esperado &&
    typeof esperado === 'object' &&
    !Array.isArray(esperado) &&
    'numerator' in esperado &&
    'denominator' in esperado
  ) {
    return { numerador: esperado.numerator, denominador: esperado.denominator };
  }
  return esperado;
}

function mapearParte(parte) {
  const resultado = {
    id: parte.id,
    tipo: TIPO_PARTE[parte.type] ?? parte.type,
  };
  if (parte.expected !== undefined) resultado.esperado = mapearEsperado(parte.expected);
  if (parte.label) resultado.label = parte.label;
  if (parte.unit) resultado.unidad = parte.unit;
  if (parte.roundingDecimals !== undefined) resultado.redondeo = parte.roundingDecimals;
  if (parte.integerOnly !== undefined) resultado.entero = parte.integerOnly;
  if (Array.isArray(parte.options)) {
    resultado.opciones = parte.options.map((o) => ({ valor: o.value, etiqueta: o.label }));
  }

  // Conserva el resto: placeholder, criteria, modelAnswer, totalN, columns, rows,
  // bars, inputMode, validScaleSteps, maxGridCells, subkind, optionFeedback, commonErrors, etc.
  const detalle = {};
  for (const clave of Object.keys(parte)) {
    if (!CLAVES_TOP_PARTE.has(clave)) detalle[clave] = parte[clave];
  }
  if (Object.keys(detalle).length > 0) resultado.detalle = detalle;

  return resultado;
}

function mapearEjercicio(ex) {
  const porTopic = MODULO_POR_TOPIC[ex.topic];
  if (!porTopic) {
    console.warn(`Tema sin módulo conocido: ${ex.id} (${ex.topic})`);
  }
  // L10 («¿Qué medida conviene elegir?») pertenece a M5, no a M4.
  const modulo = ex.lessonId === 'L10' ? 'M5' : porTopic ?? ex.topic;
  const ejercicio = {
    id: ex.id,
    titulo: ex.title,
    origen: ex.source.kind,
    modulo,
    nivel: ex.level,
    habilidades: ex.skills,
    enunciado: ex.prompt,
    partes: ex.parts.map(mapearParte),
    pistas: Array.isArray(ex.hints) ? [...ex.hints] : [],
    solucion: Array.isArray(ex.solutionSteps) ? ex.solutionSteps : [],
    etiquetas: [ex.source.label, ex.topic],
  };
  if (ex.commonErrorNote) ejercicio.pistas.push(ex.commonErrorNote);
  if (ex.lessonId) ejercicio.leccion = ex.lessonId;
  if (ex.source.adaptationNote) ejercicio.adaptacion = ex.source.adaptationNote;
  if (ex.allowComparableVariant !== undefined) ejercicio.variante = ex.allowComparableVariant;

  const datos = {};
  if (Array.isArray(ex.dataset)) datos.conjunto = ex.dataset;
  if (ex.chartPreview) datos.grafico = ex.chartPreview;
  if (Object.keys(datos).length > 0) ejercicio.datos = datos;

  return ejercicio;
}

const archivos = ['guia.js', 'nuevos-1-2.js', 'nuevos-3-4-int.js'];
const claves = ['GUIA_EXERCISES', 'NUEVOS_1_2', 'NUEVOS_3_4_INT'];

mkdirSync(destino, { recursive: true });

let total = 0;
const ids = new Set();
const porModulo = new Map();

for (let i = 0; i < archivos.length; i++) {
  const ruta = join(bancoOrigen, archivos[i]);
  if (!existsSync(ruta)) {
    console.error(`No se encontró la fuente: ${ruta}`);
    process.exit(1);
  }
  const modulo = require(ruta);
  const lista = modulo[claves[i]];
  for (const ex of lista) {
    if (ids.has(ex.id)) {
      console.error(`ID duplicado: ${ex.id}`);
      process.exit(1);
    }
    ids.add(ex.id);
    const ejercicio = mapearEjercicio(ex);
    const nombre = `${ex.id.toLowerCase()}.json`;
    writeFileSync(join(destino, nombre), JSON.stringify(ejercicio, null, 2) + '\n', 'utf8');
    porModulo.set(ejercicio.modulo, (porModulo.get(ejercicio.modulo) ?? 0) + 1);
    total += 1;
  }
}

console.log(`Migrados ${total} ejercicios a ${destino}`);
console.log('Por módulo:', Object.fromEntries([...porModulo.entries()].sort()));

if (total !== 84) {
  console.error(`Se esperaban 84 ejercicios, se migraron ${total}.`);
  process.exit(1);
}
