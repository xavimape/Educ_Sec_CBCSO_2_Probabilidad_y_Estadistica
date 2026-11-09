import { describe, it, expect } from 'vitest';
import { espacioMuestral, conteo, probabilidadClasica, complemento, simularDado } from '../../src/lib/math';

describe('espacio muestral y conteo', () => {
  it('moneda + dado da 12 resultados', () => {
    const opciones: (string | number)[][] = [
      ['C', 'X'],
      [1, 2, 3, 4, 5, 6],
    ];
    expect(espacioMuestral(opciones)).toHaveLength(12);
  });

  it('una etapa vacía deja el espacio muestral vacío', () => {
    expect(espacioMuestral([[1], [], [2]])).toEqual([]);
  });

  it('el principio de conteo multiplica las etapas', () => {
    expect(conteo([2, 6])).toBe(12);
  });

  it('rechaza una etapa sin opciones', () => {
    expect(conteo([2, 0])).toBeNull();
  });
});

describe('probabilidad clásica', () => {
  it('un caso favorable de seis es 1/6', () => {
    expect(probabilidadClasica(1, 6)).toBeCloseTo(1 / 6, 10);
  });

  it('rechaza favorables mayores que posibles', () => {
    expect(probabilidadClasica(7, 6)).toBeNull();
  });

  it('rechaza denominador 0', () => {
    expect(probabilidadClasica(1, 0)).toBeNull();
  });

  it('rechaza favorables no enteros', () => {
    expect(probabilidadClasica(1.5, 6)).toBeNull();
  });

  it('complemento: P(no 6) = 5/6', () => {
    expect(complemento(1 / 6)).toBeCloseTo(5 / 6, 10);
  });
});

describe('simulación determinística', () => {
  it('con la misma semilla produce el mismo conteo', () => {
    expect(simularDado(6, 1000, 42)).toEqual(simularDado(6, 1000, 42));
  });
});
