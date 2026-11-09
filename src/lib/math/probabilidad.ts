// Azar y probabilidad (nivel 2.º año).

/** Espacio muestral como producto cartesiano de las opciones de cada etapa. */
export function espacioMuestral<T>(opciones: T[][]): T[][] {
  if (opciones.length === 0) return [];
  // Una etapa sin opciones vacía todo el espacio muestral (producto cartesiano vacío).
  if (opciones.some((etapa) => etapa.length === 0)) return [];
  return opciones.reduce<T[][]>(
    (combinaciones, etapa) =>
      combinaciones.length === 0
        ? etapa.map((opcion) => [opcion])
        : combinaciones.flatMap((combo) => etapa.map((opcion) => [...combo, opcion])),
    [],
  );
}

/** Principio de conteo: multiplica la cantidad de opciones de cada etapa. */
export function conteo(opcionesPorEtapa: number[]): number | null {
  if (opcionesPorEtapa.length === 0) return null;
  let resultado = 1;
  for (const n of opcionesPorEtapa) {
    if (!Number.isInteger(n) || n <= 0) return null;
    resultado *= n;
  }
  return resultado;
}

/**
 * Probabilidad clásica: casos favorables ÷ casos posibles.
 * Solo válida con resultados elementales equiprobables; el llamador lo garantiza.
 */
export function probabilidadClasica(favorables: number, posibles: number): number | null {
  if (!Number.isInteger(posibles) || posibles <= 0) return null;
  if (!Number.isInteger(favorables) || favorables < 0 || favorables > posibles) return null;
  return favorables / posibles;
}

/** Suceso complementario: P(no A) = 1 − P(A). Devuelve null fuera de [0, 1]. */
export function complemento(p: number): number | null {
  if (!Number.isFinite(p) || p < 0 || p > 1) return null;
  return 1 - p;
}

/** Generador pseudoaleatorio determinístico (mulberry32). Permite variantes con semilla. */
export function mulberry32(semilla: number): () => number {
  let a = semilla >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Simula `tiradas` de un dado de `caras` lados con semilla fija. Devuelve conteo por cara. */
export function simularDado(caras: number, tiradas: number, semilla: number): number[] {
  const aleatorio = mulberry32(semilla);
  const conteos = new Array(caras).fill(0);
  for (let i = 0; i < tiradas; i++) {
    const cara = Math.floor(aleatorio() * caras);
    conteos[cara] += 1;
  }
  return conteos;
}
