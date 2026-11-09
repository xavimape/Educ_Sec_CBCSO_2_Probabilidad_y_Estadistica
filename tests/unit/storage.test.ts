import { describe, it, expect, beforeEach } from 'vitest';
import {
  progresoVacio,
  marcarEjercicio,
  alternarFavorito,
  alternarRepasar,
  cargarProgreso,
  guardarProgreso,
  reiniciarProgreso,
  exportarProgreso,
  importarProgreso,
} from '../../src/lib/storage';

beforeEach(() => {
  reiniciarProgreso();
});

describe('progreso vacío', () => {
  it('tiene la versión y colecciones vacías', () => {
    const p = progresoVacio();
    expect(p.schemaVersion).toBe(1);
    expect(p.ejercicios).toEqual({});
    expect(p.favoritos).toEqual([]);
    expect(p.repasar).toEqual([]);
  });
});

describe('marcar y alternar', () => {
  it('marca el estado de un ejercicio', () => {
    const p = marcarEjercicio(progresoVacio(), 'g4-05', 'resuelto_sin_ayuda');
    expect(p.ejercicios['g4-05']).toBe('resuelto_sin_ayuda');
  });

  it('alterna favorito', () => {
    let p = progresoVacio();
    p = alternarFavorito(p, 'g4-05');
    expect(p.favoritos).toContain('g4-05');
    p = alternarFavorito(p, 'g4-05');
    expect(p.favoritos).not.toContain('g4-05');
  });

  it('alterna repasar', () => {
    let p = progresoVacio();
    p = alternarRepasar(p, 'g4-05');
    expect(p.repasar).toContain('g4-05');
    p = alternarRepasar(p, 'g4-05');
    expect(p.repasar).not.toContain('g4-05');
  });
});

describe('persistencia', () => {
  it('round-trip guardar/cargar', () => {
    const p = marcarEjercicio(progresoVacio(), 'g4-05', 'resuelto_con_ayuda');
    expect(guardarProgreso(p)).toBe(true);
    expect(cargarProgreso().ejercicios['g4-05']).toBe('resuelto_con_ayuda');
  });

  it('reiniciar deja el progreso vacío', () => {
    guardarProgreso(marcarEjercicio(progresoVacio(), 'g4-05', 'resuelto_sin_ayuda'));
    reiniciarProgreso();
    expect(cargarProgreso().ejercicios).toEqual({});
  });
});

describe('importar/exportar', () => {
  it('round-trip', () => {
    const p = marcarEjercicio(progresoVacio(), 'g4-05', 'resuelto_sin_ayuda');
    const r = importarProgreso(exportarProgreso(p));
    expect(r.ok).toBe(true);
    expect(r.progreso?.ejercicios['g4-05']).toBe('resuelto_sin_ayuda');
  });

  it('rechaza una versión distinta', () => {
    const malo = JSON.stringify({ schemaVersion: 99, ejercicios: {}, favoritos: [], repasar: [] });
    expect(importarProgreso(malo).ok).toBe(false);
  });

  it('rechaza HTML en los ids', () => {
    const malo = JSON.stringify({ schemaVersion: 1, ejercicios: { '<script>': 'resuelto_sin_ayuda' }, favoritos: [], repasar: [] });
    expect(importarProgreso(malo).ok).toBe(false);
  });

  it('rechaza un estado inválido', () => {
    const malo = JSON.stringify({ schemaVersion: 1, ejercicios: { 'g4-05': 'cualquier_cosa' }, favoritos: [], repasar: [] });
    expect(importarProgreso(malo).ok).toBe(false);
  });

  it('rechaza un JSON inválido', () => {
    expect(importarProgreso('no es json').ok).toBe(false);
  });
});
