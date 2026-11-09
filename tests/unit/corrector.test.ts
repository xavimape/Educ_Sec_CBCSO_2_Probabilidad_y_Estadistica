import { describe, it, expect } from 'vitest';
import { corregir } from '../../src/lib/corrector';

describe('corregir: numero', () => {
  it('acepta coma decimal', () => {
    expect(corregir({ id: 'x', tipo: 'numero', esperado: 7.94 }, '7,94').correcto).toBe(true);
  });

  it('acepta punto decimal', () => {
    expect(corregir({ id: 'x', tipo: 'numero', esperado: 7.94 }, '7.94').correcto).toBe(true);
  });

  it('acepta fracción', () => {
    expect(corregir({ id: 'x', tipo: 'numero', esperado: { numerador: 7, denominador: 2 } }, '7/2').correcto).toBe(true);
  });

  it('redondeo: acepta 7,94 para 7,9375', () => {
    expect(corregir({ id: 'media', tipo: 'numero', esperado: 7.9375, redondeo: 2 }, '7,94').correcto).toBe(true);
  });

  it('redondeo: rechaza 8 para 7,9375', () => {
    expect(corregir({ id: 'media', tipo: 'numero', esperado: 7.9375, redondeo: 2 }, '8').correcto).toBe(false);
  });

  it('entero: rechaza decimales', () => {
    expect(corregir({ id: 'suma', tipo: 'numero', esperado: 127, entero: true }, '127,5').correcto).toBe(false);
  });

  it('rechaza entrada inválida', () => {
    expect(corregir({ id: 'x', tipo: 'numero', esperado: 5 }, 'abc').correcto).toBe(false);
  });

  it('rechaza vacío', () => {
    expect(corregir({ id: 'x', tipo: 'numero', esperado: 5 }, '').correcto).toBe(false);
  });
});

describe('corregir: probabilidad', () => {
  it('acepta fracción', () => {
    expect(corregir({ id: 'p', tipo: 'probabilidad', esperado: { numerador: 3, denominador: 4 } }, '3/4').correcto).toBe(true);
  });

  it('acepta decimal con coma', () => {
    expect(corregir({ id: 'p', tipo: 'probabilidad', esperado: { numerador: 3, denominador: 4 } }, '0,75').correcto).toBe(true);
  });

  it('acepta porcentaje explícito', () => {
    expect(corregir({ id: 'p', tipo: 'probabilidad', esperado: { numerador: 1, denominador: 2 } }, '50%').correcto).toBe(true);
  });

  it('rechaza un valor mayor que 1 sin %', () => {
    expect(corregir({ id: 'p', tipo: 'probabilidad', esperado: { numerador: 1, denominador: 2 } }, '75').correcto).toBe(false);
  });

  it('complemento 5/6', () => {
    expect(corregir({ id: 'p', tipo: 'probabilidad', esperado: { numerador: 5, denominador: 6 } }, '5/6').correcto).toBe(true);
  });
});

describe('corregir: conjunto (moda)', () => {
  it('acepta una moda', () => {
    expect(corregir({ id: 'm', tipo: 'moda', esperado: [8] }, '8').correcto).toBe(true);
  });

  it('acepta dos modas en cualquier orden', () => {
    expect(corregir({ id: 'm', tipo: 'moda', esperado: [1, 2] }, '2 y 1').correcto).toBe(true);
  });

  it('rechaza una moda distinta', () => {
    expect(corregir({ id: 'm', tipo: 'moda', esperado: [8] }, '7').correcto).toBe(false);
  });

  it('amodal: acepta «ninguna»', () => {
    expect(corregir({ id: 'm', tipo: 'moda', esperado: [] }, 'ninguna').correcto).toBe(true);
  });

  it('amodal: rechaza un valor', () => {
    expect(corregir({ id: 'm', tipo: 'moda', esperado: [] }, '8').correcto).toBe(false);
  });

  it('moda categórica (sin distinguir mayúsculas)', () => {
    expect(corregir({ id: 'm', tipo: 'moda', esperado: ['Nike'] }, 'nike').correcto).toBe(true);
  });
});

describe('corregir: select y no autocorregibles', () => {
  it('select correcto', () => {
    expect(corregir({ id: 's', tipo: 'select', esperado: 'unimodal' }, 'unimodal').correcto).toBe(true);
  });

  it('select incorrecto', () => {
    expect(corregir({ id: 's', tipo: 'select', esperado: 'unimodal' }, 'bimodal').correcto).toBe(false);
  });

  it('rubrica no se autocorrige', () => {
    expect(corregir({ id: 'r', tipo: 'rubrica' }, 'cualquier texto').correcto).toBeNull();
  });

  it('tabla no se autocorrige', () => {
    expect(corregir({ id: 't', tipo: 'tabla' }, 'x').correcto).toBeNull();
  });

  it('barras no se autocorrige', () => {
    expect(corregir({ id: 'b', tipo: 'barras' }, 'x').correcto).toBeNull();
  });
});
