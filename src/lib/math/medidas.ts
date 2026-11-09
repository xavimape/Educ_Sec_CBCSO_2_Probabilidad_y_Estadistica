// Medidas de tendencia central.

/** Media aritmética: suma ÷ cantidad. Devuelve null para lista vacía. */
export function media(datos: number[]): number | null {
  if (datos.length === 0) return null;
  const suma = datos.reduce((acc, d) => acc + d, 0);
  return suma / datos.length;
}

/** Mediana: ordena y toma el central (promedia los dos centrales si n es par). */
export function mediana(datos: number[]): number | null {
  if (datos.length === 0) return null;
  const ordenados = [...datos].sort((a, b) => a - b);
  const n = ordenados.length;
  const medio = Math.floor(n / 2);
  if (n % 2 === 1) return ordenados[medio];
  return (ordenados[medio - 1] + ordenados[medio]) / 2;
}

/**
 * Moda: el o los valores de mayor frecuencia.
 * Convención escolar: si todas las frecuencias son iguales, la serie es amodal (devuelve []).
 * Devuelve null solo para una lista vacía.
 */
export function moda<T extends string | number>(datos: T[]): T[] | null {
  if (datos.length === 0) return null;
  const conteo = new Map<T, number>();
  for (const dato of datos) {
    conteo.set(dato, (conteo.get(dato) ?? 0) + 1);
  }
  const frecuencias = [...conteo.values()];
  const maxima = Math.max(...frecuencias);
  const minima = Math.min(...frecuencias);
  // Todas iguales (incluye el caso de todos los valores distintos): no hay una moda destacada.
  if (maxima === minima) return [];
  return [...conteo.entries()].filter(([, f]) => f === maxima).map(([valor]) => valor);
}

/** Media desde una tabla de valores y frecuencias. Divide por el total de observaciones, no por las filas. */
export function mediaDesdeTabla(valores: number[], frecuencias: number[]): number | null {
  if (valores.length !== frecuencias.length || valores.length === 0) return null;
  if (!frecuencias.every((f) => Number.isInteger(f) && f >= 0)) return null;
  const total = totalEnteros(frecuencias);
  if (total === 0) return null;
  const suma = valores.reduce((acc, valor, i) => acc + valor * frecuencias[i], 0);
  return suma / total;
}

/** Mediana desde una tabla de valores y frecuencias (expande; correcto para n escolares). */
export function medianaDesdeTabla(valores: number[], frecuencias: number[]): number | null {
  if (valores.length !== frecuencias.length || valores.length === 0) return null;
  if (!frecuencias.every((f) => Number.isInteger(f) && f >= 0)) return null;
  const total = totalEnteros(frecuencias);
  if (total === 0) return null;
  const expandido: number[] = [];
  valores.forEach((valor, i) => {
    for (let k = 0; k < frecuencias[i]; k++) expandido.push(valor);
  });
  return mediana(expandido);
}

function totalEnteros(frecuencias: number[]): number {
  return frecuencias.reduce((acc, f) => acc + f, 0);
}
