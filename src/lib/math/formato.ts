// Formato y parseo de números decimales.
// Regla del proyecto: aceptar coma y punto; normalizar a coma en pantalla; nunca usar eval.

/** Convierte una cadena con coma o punto en número, o devuelve null si no es un número válido. */
export function parseDecimal(input: string): number | null {
  if (typeof input !== 'string') return null;
  const recortado = input.trim();
  if (recortado === '') return null;
  // Rechaza espacios internos ("1 2" no es un número): solo se toleran espacios en los bordes.
  if (/\s/.test(recortado)) return null;
  const normalizada = recortado.replace(',', '.');
  // Acepta solo números (enteros o decimales), con signo opcional. Rechaza "7abc", "1.2.3".
  if (!/^-?\d+(\.\d+)?$/.test(normalizada)) return null;
  const valor = Number(normalizada);
  if (!Number.isFinite(valor)) return null;
  return valor;
}

/** Da formato con coma decimal, para mostrar en español. */
export function formatearComa(valor: number, decimales?: number): string {
  if (!Number.isFinite(valor)) return String(valor);
  const texto = decimales === undefined ? String(valor) : valor.toFixed(decimales);
  return texto.replace('.', ',');
}

/** Redondea a una cantidad de decimales (corrige el punto flotante con EPSILON). */
export function redondear(valor: number, decimales: number): number {
  const factor = 10 ** decimales;
  return Math.round((valor + Number.EPSILON) * factor) / factor;
}

/** Divide dos enteros; devuelve null si el denominador es 0. */
export function fraccionADecimal(numerador: number, denominador: number): number | null {
  if (denominador === 0) return null;
  return numerador / denominador;
}

/** Verifica si dos números son iguales dentro de una tolerancia. */
export function aproximadamente(a: number, b: number, tolerancia = 1e-9): boolean {
  return Math.abs(a - b) <= tolerancia;
}
