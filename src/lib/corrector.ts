// Corrector: compara la respuesta del estudiante con lo esperado de cada parte.
// Reglas del proyecto: aceptar coma y punto; sin eval; distinguir 0,4 de 40 %;
// modas como conjuntos; probabilidad en [0, 1] o con % explícito; no autocorregir lo libre.
import { parseDecimal, redondear, aproximadamente, formatearComa } from './math';

export type ParteTipo =
  | 'numero'
  | 'numeroConjunto'
  | 'moda'
  | 'select'
  | 'rubrica'
  | 'probabilidad'
  | 'tabla'
  | 'barras';

export type Parte = {
  id: string;
  tipo: ParteTipo;
  label?: string;
  esperado?: unknown;
  unidad?: string;
  aceptaPorcentaje?: boolean;
  tolerancia?: number;
  redondeo?: number;
  entero?: boolean;
  opciones?: { valor: string; etiqueta: string }[];
  detalle?: unknown;
};

export type Resultado = {
  /** true = correcto; false = incorrecto; null = no se auto-corrige (rúbrica, tabla, barras). */
  correcto: boolean | null;
  mensaje: string;
  esperado?: string;
};

const TOLERANCIA_DEFECTO = 1e-9;

/** Valor numérico de un `esperado` (número directo o fracción {numerador, denominador}). */
function valorEsperado(esperado: unknown): number | null {
  if (typeof esperado === 'number' && Number.isFinite(esperado)) return esperado;
  if (esperado && typeof esperado === 'object' && !Array.isArray(esperado)) {
    const e = esperado as { numerador?: unknown; denominador?: unknown };
    if (typeof e.numerador === 'number' && typeof e.denominador === 'number' && e.denominador !== 0) {
      return e.numerador / e.denominador;
    }
  }
  return null;
}

/** Parsea un número (coma/punto, fracción o «x %» conservando la magnitud tal cual). */
function parseNumero(raw: string): number | null {
  const s = raw.trim().replace(/\s/g, '');
  const fraccion = s.match(/^(-?\d+)\/(\d+)$/);
  if (fraccion) {
    const den = Number(fraccion[2]);
    return den === 0 ? null : Number(fraccion[1]) / den;
  }
  const porcentaje = s.match(/^(-?\d+(?:[.,]\d+)?)%$/);
  if (porcentaje) return parseDecimal(porcentaje[1]);
  return parseDecimal(s);
}

/** Parsea una probabilidad: fracción a/b, decimal en [0,1] o «x %» → proporción. */
function parseProbabilidad(raw: string): number | null {
  const s = raw.trim().replace(/\s/g, '');
  const fraccion = s.match(/^(-?\d+)\/(\d+)$/);
  if (fraccion) {
    const den = Number(fraccion[2]);
    return den === 0 ? null : Number(fraccion[1]) / den;
  }
  const porcentaje = s.match(/^(-?\d+(?:[.,]\d+)?)%$/);
  if (porcentaje) {
    const v = parseDecimal(porcentaje[1]);
    return v === null ? null : v / 100;
  }
  return parseDecimal(s);
}

function formatearEsperado(parte: Parte): string {
  const e = parte.esperado;
  if (e && typeof e === 'object' && !Array.isArray(e) && 'numerador' in e) {
    const f = e as { numerador: number; denominador: number };
    if (parte.redondeo !== undefined) {
      const v = f.numerador / f.denominador;
      return `${f.numerador}/${f.denominador} (≈ ${formatearComa(redondear(v, parte.redondeo), parte.redondeo)})`;
    }
    return `${f.numerador}/${f.denominador}`;
  }
  if (typeof e === 'number') {
    return Number.isInteger(e) ? String(e) : formatearComa(e, parte.redondeo);
  }
  return String(e);
}

function corregirNumero(parte: Parte, raw: string): Resultado {
  const esperado = valorEsperado(parte.esperado);
  if (esperado === null) {
    return { correcto: false, mensaje: 'Este ejercicio no tiene una respuesta numérica definida.' };
  }
  const valor = parseNumero(raw);
  if (valor === null) {
    return { correcto: false, mensaje: 'Escribí un número válido (podés usar coma o punto decimal).' };
  }
  if (parte.entero && !Number.isInteger(valor)) {
    return { correcto: false, mensaje: 'Se espera un número entero.' };
  }
  const tol = parte.tolerancia ?? TOLERANCIA_DEFECTO;
  const correcto =
    parte.redondeo !== undefined
      ? aproximadamente(redondear(valor, parte.redondeo), redondear(esperado, parte.redondeo), tol)
      : aproximadamente(valor, esperado, tol);
  const esperadoTexto = formatearEsperado(parte);
  return correcto
    ? { correcto: true, mensaje: '¡Correcto!', esperado: esperadoTexto }
    : { correcto: false, mensaje: `No es correcto. La respuesta esperada es ${esperadoTexto}.`, esperado: esperadoTexto };
}

function corregirProbabilidad(parte: Parte, raw: string): Resultado {
  const esperado = valorEsperado(parte.esperado);
  if (esperado === null) {
    return { correcto: false, mensaje: 'No hay una probabilidad definida para este ejercicio.' };
  }
  const valor = parseProbabilidad(raw);
  if (valor === null) {
    return { correcto: false, mensaje: 'Escribí la probabilidad como fracción (3/4), decimal (0,75) o porcentaje (75 %).' };
  }
  if (valor < 0 || valor > 1) {
    return { correcto: false, mensaje: 'Una probabilidad va de 0 a 1 (o de 0 % a 100 %).' };
  }
  const tol = parte.tolerancia ?? 1e-6;
  const correcto = aproximadamente(valor, esperado, tol);
  const esperadoTexto = formatearEsperado(parte);
  return correcto
    ? { correcto: true, mensaje: '¡Correcto!', esperado: esperadoTexto }
    : { correcto: false, mensaje: `No es correcto. La probabilidad esperada es ${esperadoTexto}.`, esperado: esperadoTexto };
}

function corregirConjunto(parte: Parte, raw: string): Resultado {
  const esperado = Array.isArray(parte.esperado) ? parte.esperado : [];
  const normalizar = (t: string): string | number => {
    const n = parseDecimal(t);
    return n !== null ? n : t.trim().toLowerCase();
  };
  const esAmodal = /amodal|ninguna|sin moda|no hay|ningún/i.test(raw.toLowerCase());
  const conjuntoRespuesta = new Set<string | number>(
    esAmodal ? [] : raw.split(/[,;]|\s+y\s+/i).map(normalizar).filter((t) => t !== ''),
  );
  const conjuntoEsperado = new Set<string | number>(
    esperado.map((e) => (typeof e === 'number' ? e : String(e).toLowerCase())),
  );
  const iguales =
    conjuntoRespuesta.size === conjuntoEsperado.size &&
    [...conjuntoEsperado].every((x) => conjuntoRespuesta.has(x));
  const esperadoTexto =
    esperado.length === 0
      ? 'sin moda destacada (amodal)'
      : esperado.map((e) => (typeof e === 'number' ? formatearComa(e) : String(e))).join(' y ');
  return iguales
    ? { correcto: true, mensaje: '¡Correcto!', esperado: esperadoTexto }
    : { correcto: false, mensaje: `No es correcto. La respuesta esperada es: ${esperadoTexto}.`, esperado: esperadoTexto };
}

function corregirSelect(parte: Parte, raw: string): Resultado {
  const correcto = raw.trim() === parte.esperado;
  return correcto
    ? { correcto: true, mensaje: '¡Correcto!' }
    : { correcto: false, mensaje: 'Esa no es la opción correcta.' };
}

export function corregir(parte: Parte, respuesta: string): Resultado {
  const raw = (respuesta ?? '').trim();
  if (raw === '') return { correcto: false, mensaje: 'Escribí una respuesta antes de comprobar.' };

  switch (parte.tipo) {
    case 'numero':
      return corregirNumero(parte, raw);
    case 'probabilidad':
      return corregirProbabilidad(parte, raw);
    case 'moda':
    case 'numeroConjunto':
      return corregirConjunto(parte, raw);
    case 'select':
      return corregirSelect(parte, raw);
    case 'rubrica':
    case 'tabla':
    case 'barras':
      return { correcto: null, mensaje: 'Esta parte se revisa con la rúbrica o la tabla; no se corrige sola.' };
    default:
      return { correcto: false, mensaje: `Tipo de respuesta no reconocido: ${(parte as Parte).tipo}.` };
  }
}
