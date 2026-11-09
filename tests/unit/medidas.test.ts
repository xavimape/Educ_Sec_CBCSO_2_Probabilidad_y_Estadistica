import { describe, it, expect } from 'vitest';
import { media, mediana, moda, mediaDesdeTabla, medianaDesdeTabla } from '../../src/lib/math';

describe('media', () => {
  it('promedia 2, 3 y 4', () => {
    expect(media([2, 3, 4])).toBe(3);
  });

  it('devuelve null para una lista vacía', () => {
    expect(media([])).toBeNull();
  });

  it('regresión G4-05: suma 127, media 7,9375', () => {
    const datos = [5, 6, 6, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 10, 10, 10];
    expect(media(datos)).toBeCloseTo(7.9375, 10);
  });

  it('regresión G4-07: 20 ÷ 11 ≈ 1,82', () => {
    const datos = [0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 11];
    expect(media(datos)).toBeCloseTo(20 / 11, 10);
  });
});

describe('mediana', () => {
  it('con cantidad impar elige el central', () => {
    expect(mediana([3, 1, 2])).toBe(2);
  });

  it('con cantidad par promedia los dos centrales', () => {
    expect(mediana([4, 1, 3, 2])).toBe(2.5);
  });

  it('regresión G4-07: con 11 datos es 1', () => {
    expect(mediana([0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 11])).toBe(1);
  });

  it('regresión G4-07: sin el extremo es 0,5', () => {
    expect(mediana([0, 0, 0, 0, 0, 1, 1, 2, 2, 3])).toBe(0.5);
  });

  it('regresión G4-05: mediana 8', () => {
    expect(mediana([5, 6, 6, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 10, 10, 10])).toBe(8);
  });
});

describe('moda', () => {
  it('unimodal', () => {
    expect(moda([1, 2, 2, 3])).toEqual([2]);
  });

  it('bimodal devuelve las dos modas', () => {
    expect(moda([1, 1, 2, 2, 3])).toEqual([1, 2]);
  });

  it('serie amodal devuelve lista vacía', () => {
    expect(moda([10, 12, 15, 18])).toEqual([]);
  });

  it('todas las frecuencias iguales (aunque se repitan) es amodal', () => {
    expect(moda([2, 2, 3, 3])).toEqual([]);
  });

  it('regresión G4-05: moda 8', () => {
    expect(moda([5, 6, 6, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 10, 10, 10])).toEqual([8]);
  });
});

describe('medidas desde tabla', () => {
  it('mediaDesdeTabla del ejemplo de 20 libros es 1,5', () => {
    expect(mediaDesdeTabla([0, 1, 2, 3, 4], [3, 8, 6, 2, 1])).toBeCloseTo(1.5, 10);
  });

  it('medianaDesdeTabla del ejemplo de 20 libros es 1', () => {
    expect(medianaDesdeTabla([0, 1, 2, 3, 4], [3, 8, 6, 2, 1])).toBe(1);
  });

  it('divide por observaciones, no por cantidad de filas (ejemplo de 10 fichas)', () => {
    expect(mediaDesdeTabla([0, 1, 2, 3, 4], [2, 4, 2, 1, 1])).toBeCloseTo(1.5, 10);
  });

  it('rechaza frecuencias negativas', () => {
    expect(mediaDesdeTabla([1, 5], [-1, 3])).toBeNull();
  });
});
