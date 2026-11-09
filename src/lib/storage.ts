// Progreso local: intentos, favoritos y «para repasar», persistidos en el navegador.
// Sin cuentas ni sincronización. Degrada con gracia si el almacenamiento está bloqueado.
export type EstadoEjercicio =
  | 'sin_intentar'
  | 'para_repasar'
  | 'resuelto_con_ayuda'
  | 'resuelto_sin_ayuda';

export type Progreso = {
  schemaVersion: number;
  ejercicios: Record<string, EstadoEjercicio>;
  favoritos: string[];
  repasar: string[];
};

const VERSION = 1;
const CLAVE = 'ep-estadistica-progreso-v1';
const LIMITE_CARACTERES = 512 * 1024; // ~512 KB

const ESTADOS: EstadoEjercicio[] = ['sin_intentar', 'para_repasar', 'resuelto_con_ayuda', 'resuelto_sin_ayuda'];

// Espejo en memoria: sirve de respaldo cuando localStorage no está disponible o está bloqueado.
const memoria = new Map<string, string>();

function leer(): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const v = window.localStorage.getItem(CLAVE);
      if (v !== null) return v;
    }
  } catch {
    /* almacenamiento bloqueado: se usa la memoria */
  }
  return memoria.get(CLAVE) ?? null;
}

function escribir(raw: string): void {
  memoria.set(CLAVE, raw);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(CLAVE, raw);
    }
  } catch {
    /* queda en memoria */
  }
}

export function progresoVacio(): Progreso {
  return { schemaVersion: VERSION, ejercicios: {}, favoritos: [], repasar: [] };
}

export function cargarProgreso(): Progreso {
  const raw = leer();
  if (!raw) return progresoVacio();
  try {
    const p = JSON.parse(raw);
    return validarProgreso(p) ? p : progresoVacio();
  } catch {
    return progresoVacio();
  }
}

export function guardarProgreso(p: Progreso): boolean {
  const raw = JSON.stringify(p);
  if (raw.length > LIMITE_CARACTERES) return false;
  escribir(raw);
  return true;
}

export function marcarEjercicio(p: Progreso, id: string, estado: EstadoEjercicio): Progreso {
  return { ...p, ejercicios: { ...p.ejercicios, [id]: estado } };
}

export function alternarFavorito(p: Progreso, id: string): Progreso {
  const favoritos = p.favoritos.includes(id) ? p.favoritos.filter((f) => f !== id) : [...p.favoritos, id];
  return { ...p, favoritos };
}

export function alternarRepasar(p: Progreso, id: string): Progreso {
  const repasar = p.repasar.includes(id) ? p.repasar.filter((f) => f !== id) : [...p.repasar, id];
  return { ...p, repasar };
}

export function exportarProgreso(p: Progreso): string {
  return JSON.stringify(p);
}

export function importarProgreso(json: string): { ok: boolean; progreso?: Progreso; error?: string } {
  if (json.length > LIMITE_CARACTERES) {
    return { ok: false, error: 'El archivo es demasiado grande.' };
  }
  let p: unknown;
  try {
    p = JSON.parse(json);
  } catch {
    return { ok: false, error: 'No se pudo leer el archivo: no es un JSON válido.' };
  }
  if (!validarProgreso(p)) {
    return { ok: false, error: 'El archivo no tiene un formato de progreso válido.' };
  }
  return { ok: true, progreso: p };
}

export function reiniciarProgreso(): Progreso {
  const vacio = progresoVacio();
  guardarProgreso(vacio);
  return vacio;
}

function validarProgreso(p: unknown): p is Progreso {
  if (!p || typeof p !== 'object' || Array.isArray(p)) return false;
  const obj = p as Record<string, unknown>;
  if (obj.schemaVersion !== VERSION) return false;
  if (typeof obj.ejercicios !== 'object' || obj.ejercicios === null || Array.isArray(obj.ejercicios)) return false;
  if (!Array.isArray(obj.favoritos) || !Array.isArray(obj.repasar)) return false;

  for (const [id, estado] of Object.entries(obj.ejercicios as Record<string, unknown>)) {
    if (/[<>]/.test(id) || !ESTADOS.includes(estado as EstadoEjercicio)) return false;
  }
  for (const lista of [obj.favoritos, obj.repasar]) {
    for (const id of lista as unknown[]) {
      if (typeof id !== 'string' || /[<>]/.test(id)) return false;
    }
  }
  return true;
}
