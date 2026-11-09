// Auditoría del banco: recalcula media, mediana, moda y suma desde los datos de cada ejercicio
// y las contrasta con lo guardado, usando implementaciones independientes del motor.
// Uso: npm run auditar:banco
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const dirEjercicios = resolve(aqui, '..', 'src', 'content', 'ejercicios');

// Implementaciones independientes (no importan el motor, para no autovalidar).
function suma(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
function media(arr) {
  return arr.length ? suma(arr) / arr.length : null;
}
function mediana(arr) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
function moda(arr) {
  if (!arr.length) return null;
  const c = new Map();
  for (const v of arr) c.set(v, (c.get(v) ?? 0) + 1);
  const freqs = [...c.values()];
  const max = Math.max(...freqs);
  const min = Math.min(...freqs);
  if (max === min) return []; // amodal
  return [...c.entries()].filter(([, f]) => f === max).map(([v]) => v);
}
function redondear(v, d) {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}
function valorEsperado(e) {
  if (typeof e === 'number') return e;
  if (e && typeof e === 'object' && !Array.isArray(e) && 'numerador' in e && 'denominador' in e) {
    return e.numerador / e.denominador;
  }
  return null;
}
function cerca(a, b, tol = 1e-6) {
  return a !== null && b !== null && Math.abs(a - b) <= tol;
}
function mismaLista(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const B = b.map(String).sort();
  return a.map(String).sort().every((x, i) => x === B[i]);
}

const archivos = readdirSync(dirEjercicios).filter((f) => f.endsWith('.json'));
let verificadas = 0;
let discrepancias = 0;
let sinDatos = 0;

for (const archivo of archivos) {
  const ej = JSON.parse(readFileSync(join(dirEjercicios, archivo), 'utf8'));
  const conjunto = ej.datos?.conjunto;
  if (!Array.isArray(conjunto) || !conjunto.every((x) => typeof x === 'number')) {
    sinDatos += 1;
    continue;
  }

  const s = suma(conjunto);
  const m = media(conjunto);
  const md = mediana(conjunto);
  const mo = moda(conjunto);

  for (const parte of ej.partes) {
    const label = (parte.label ?? parte.id ?? '').toLowerCase();
    const tipo = parte.tipo;

    if (tipo === 'moda' || tipo === 'numeroConjunto') {
      if (mismaLista(parte.esperado, mo)) {
        verificadas += 1;
      } else {
        discrepancias += 1;
        console.log(`⚠ ${ej.id}/${parte.id} moda: esperado ${JSON.stringify(parte.esperado)} vs calculado ${JSON.stringify(mo)}`);
      }
      continue;
    }

    if (tipo !== 'numero') continue;
    const v = valorEsperado(parte.esperado);
    if (v === null) continue;

    const redondeo = parte.redondeo;
    const comparar = (calculado) =>
      redondeo !== undefined ? cerca(redondear(v, redondeo), redondear(calculado, redondeo), 1e-9) : cerca(v, calculado);

    if (/\bmediana\b/.test(label)) {
      // Si la etiqueta especifica sin el extremo o n=10, el cálculo sobre el conjunto completo no aplica directamente
      if (/sin el extremo|n\s*=\s*10|10\s*alumnos/i.test(label)) continue;
      if (comparar(md)) verificadas += 1;
      else {
        discrepancias += 1;
        console.log(`⚠ ${ej.id}/${parte.id} mediana: esperado ${v} vs calculado ${md}`);
      }
    } else if (/\bmedia\b|\bpromedio\b|x̄/.test(label)) {
      // Si la etiqueta pide un total necesario (ej: "para promedio 7") o sin el extremo, no compara con la media simple
      if (/para que|sin el extremo|n\s*=\s*10|10\s*alumnos/i.test(label)) continue;
      if (comparar(m)) verificadas += 1;
      else {
        discrepancias += 1;
        console.log(`⚠ ${ej.id}/${parte.id} media: esperado ${v} vs calculado ${m}`);
      }
    } else if (/\bsuma\b/.test(label)) {
      if (comparar(s)) verificadas += 1;
      else {
        discrepancias += 1;
        console.log(`⚠ ${ej.id}/${parte.id} suma: esperado ${v} vs calculado ${s}`);
      }
    }
    // Otras etiquetas (total, frecuencia específica, relativa) no se auto-verifican aquí.
  }
}

console.log(`\nPartes auto-verificadas: ${verificadas}. Discrepancias: ${discrepancias}. Ejercicios sin datos numéricos: ${sinDatos}.`);
if (discrepancias > 0) {
  console.log('Revisá las líneas ⚠ de arriba: pueden ser errores reales o etiquetas que el script no supo clasificar.');
}
