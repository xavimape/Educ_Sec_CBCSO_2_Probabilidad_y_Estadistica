// Frecuencias: conteo y tablas.

export type Conteo<T extends string | number> = { valor: T; frecuencia: number }[];

/** Cuenta las apariciones de cada valor, conservando el orden de primera aparición. */
export function contar<T extends string | number>(datos: T[]): Conteo<T> {
  const mapa = new Map<T, number>();
  for (const dato of datos) {
    mapa.set(dato, (mapa.get(dato) ?? 0) + 1);
  }
  return [...mapa.entries()].map(([valor, frecuencia]) => ({ valor, frecuencia }));
}

/** Suma las frecuencias absolutas (total de observaciones). */
export function totalObservaciones(frecuencias: number[]): number {
  return frecuencias.reduce((acc, f) => acc + f, 0);
}

/** Frecuencia relativa: frecuencia ÷ total. Devuelve null para entradas inválidas. */
export function relativa(frecuencia: number, total: number): number | null {
  if (!Number.isInteger(frecuencia) || !Number.isInteger(total)) return null;
  if (total <= 0 || frecuencia < 0 || frecuencia > total) return null;
  return frecuencia / total;
}

/** Frecuencia porcentual: (frecuencia ÷ total) × 100. Devuelve null si total <= 0. */
export function porcentual(frecuencia: number, total: number): number | null {
  const r = relativa(frecuencia, total);
  return r === null ? null : r * 100;
}

/** Frecuencias acumuladas (suma progresiva). Requiere un orden significativo para interpretarlas. */
export function acumuladas(frecuencias: number[]): number[] {
  const resultado: number[] = [];
  let acc = 0;
  for (const f of frecuencias) {
    acc += f;
    resultado.push(acc);
  }
  return resultado;
}

/** Comprueba que las frecuencias sean conteos válidos y sumen el total esperado (o entre sí). */
export function verificarTabla(
  frecuencias: number[],
  total?: number,
): { suma: number; esperado: number; ok: boolean } {
  const frecuenciasValidas = frecuencias.every((f) => Number.isInteger(f) && f >= 0);
  const suma = totalObservaciones(frecuencias);
  const esperado = total ?? suma;
  const esperadoValido = Number.isInteger(esperado) && esperado >= 0;
  return { suma, esperado, ok: frecuenciasValidas && esperadoValido && suma === esperado };
}
