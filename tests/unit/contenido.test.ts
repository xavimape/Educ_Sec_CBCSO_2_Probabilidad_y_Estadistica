import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { esquemaEjercicio } from '../../src/lib/content/esquemas';

// Valida el banco contra el MISMO esquema Zod que usan las colecciones de contenido.
const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const dirEjercicios = join(raiz, 'src', 'content', 'ejercicios');

const archivos = readdirSync(dirEjercicios).filter((f) => f.endsWith('.json'));

describe('el banco de ejercicios valida contra el esquema Zod', () => {
  it('tiene al menos un ejercicio', () => {
    expect(archivos.length).toBeGreaterThan(0);
  });

  for (const archivo of archivos) {
    it(`valida ${archivo}`, () => {
      const contenido = JSON.parse(readFileSync(join(dirEjercicios, archivo), 'utf8'));
      const resultado = esquemaEjercicio.safeParse(contenido);
      expect(resultado.success, JSON.stringify(resultado.success ? null : resultado.error.issues, null, 2)).toBe(true);
    });
  }
});
