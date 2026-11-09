import { describe, it, expect } from 'vitest';
import { contar, totalObservaciones, relativa, porcentual, acumuladas, verificarTabla } from '../../src/lib/math';

describe('frecuencias', () => {
  it('cuenta conservando el orden de primera aparición', () => {
    expect(contar([1, 2, 1, 0, 2, 1])).toEqual([
      { valor: 1, frecuencia: 3 },
      { valor: 2, frecuencia: 2 },
      { valor: 0, frecuencia: 1 },
    ]);
  });

  it('suma el total de observaciones', () => {
    expect(totalObservaciones([3, 8, 6, 2, 1])).toBe(20);
  });

  it('relativa: 8 de 20 es 0,40', () => {
    expect(relativa(8, 20)).toBeCloseTo(0.4, 10);
  });

  it('porcentual: 8 de 20 es 40 %', () => {
    expect(porcentual(8, 20)).toBeCloseTo(40, 10);
  });

  it('relativa devuelve null con total 0', () => {
    expect(relativa(1, 0)).toBeNull();
  });

  it('relativa rechaza frecuencia mayor que el total', () => {
    expect(relativa(5, 3)).toBeNull();
  });

  it('acumuladas de G2-01: 5, 11, 14, 15', () => {
    expect(acumuladas([5, 6, 3, 1])).toEqual([5, 11, 14, 15]);
  });

  it('verificarTabla detecta una fila inconsistente', () => {
    expect(verificarTabla([2, 3, 5, 7, 4, 5, 4], 30).ok).toBe(true);
    expect(verificarTabla([2, 3, 5, 7, 4, 5, 5], 30).ok).toBe(false);
  });

  it('verificarTabla rechaza frecuencias negativas', () => {
    expect(verificarTabla([-1, 3], 2).ok).toBe(false);
  });
});
