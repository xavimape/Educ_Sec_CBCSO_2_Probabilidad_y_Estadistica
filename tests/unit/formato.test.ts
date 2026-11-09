import { describe, it, expect } from 'vitest';
import { parseDecimal, formatearComa, redondear, fraccionADecimal } from '../../src/lib/math';

describe('parseDecimal', () => {
  it('acepta coma decimal', () => {
    expect(parseDecimal('7,94')).toBeCloseTo(7.94, 10);
  });

  it('acepta punto decimal', () => {
    expect(parseDecimal('7.94')).toBeCloseTo(7.94, 10);
  });

  it('rechaza cadenas parcialmente numéricas', () => {
    expect(parseDecimal('7abc')).toBeNull();
  });

  it('rechaza dos separadores', () => {
    expect(parseDecimal('1.2.3')).toBeNull();
  });

  it('rechaza espacios internos', () => {
    expect(parseDecimal('1 2')).toBeNull();
  });

  it('rechaza la cadena vacía', () => {
    expect(parseDecimal('')).toBeNull();
  });
});

describe('formato', () => {
  it('formatea con coma decimal', () => {
    expect(formatearComa(7.9375, 2)).toBe('7,94');
  });

  it('redondea a dos decimales', () => {
    expect(redondear(7.9375, 2)).toBeCloseTo(7.94, 10);
  });

  it('fracción con denominador 0 devuelve null', () => {
    expect(fraccionADecimal(1, 0)).toBeNull();
  });
});
