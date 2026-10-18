import { describe, it, expect } from 'vitest';
import { inferUsaPeso } from '../src/utils/inferUsaPeso.js';

describe('inferUsaPeso', () => {
  it('Sentadilla con barra === true', () => {
    expect(inferUsaPeso('Sentadilla con barra')).toBe(true);
  });

  it('Plancha === false', () => {
    expect(inferUsaPeso('Plancha')).toBe(false);
  });

  it('Remo en maquina === true', () => {
    expect(inferUsaPeso('Remo en maquina')).toBe(true);
  });

  it('Plancha en codos === false', () => {
    expect(inferUsaPeso('Plancha en codos')).toBe(false);
  });

  it('Press de pecho === true', () => {
    expect(inferUsaPeso('Press de pecho')).toBe(true);
  });

  it('Pasadas de velocidad === false', () => {
    expect(inferUsaPeso('Pasadas de velocidad')).toBe(false);
  });

  it('Dead bug === false', () => {
    expect(inferUsaPeso('Dead bug')).toBe(false);
  });

  it('Dominadas abiertas === true', () => {
    expect(inferUsaPeso('Dominadas abiertas')).toBe(true);
  });

  it('Complex === false', () => {
    expect(inferUsaPeso('Complex')).toBe(false);
  });

  it('Curl de bíceps con barra === true', () => {
    expect(inferUsaPeso('Curl de bíceps con barra')).toBe(true);
  });

  it('Pallof press === true (uses cable)', () => {
    expect(inferUsaPeso('Pallof press')).toBe(true);
  });

  it('Empuje de cadera en cajon === true', () => {
    expect(inferUsaPeso('Empuje de cadera en cajon')).toBe(true);
  });

  it('Aductores en maquina === true', () => {
    expect(inferUsaPeso('Aductores en maquina')).toBe(true);
  });

  it('Espinales con disco === true (uses disco)', () => {
    expect(inferUsaPeso('Espinales con disco')).toBe(true);
  });

  it('TRX chest press === false', () => {
    expect(inferUsaPeso('TRX chest press')).toBe(false);
  });

  it('Banda press de pecho === false', () => {
    expect(inferUsaPeso('Banda press de pecho')).toBe(false);
  });

  it('Banda triceps pushdown === false (banda override)', () => {
    expect(inferUsaPeso('Banda triceps pushdown')).toBe(false);
  });

  it('Remo alto en TRX === false (trx override)', () => {
    expect(inferUsaPeso('Remo alto en TRX')).toBe(false);
  });

  it('Muscle-up negativo en barra === false (muscle-up override)', () => {
    expect(inferUsaPeso('Muscle-up negativo en barra')).toBe(false);
  });

  it('Plancha con elevación alternada === false (plancha override)', () => {
    expect(inferUsaPeso('Plancha con elevación alternada')).toBe(false);
  });

  it('Pulldown agarre cerrado === true', () => {
    expect(inferUsaPeso('Pulldown agarre cerrado')).toBe(true);
  });

  it('Face pulls === true', () => {
    expect(inferUsaPeso('Face pulls')).toBe(true);
  });

  it('Patada de glúteo con tobillera === true', () => {
    expect(inferUsaPeso('Patada de glúteo con tobillera')).toBe(true);
  });

  it('null/empty returns false', () => {
    expect(inferUsaPeso(null)).toBe(false);
    expect(inferUsaPeso('')).toBe(false);
    expect(inferUsaPeso(undefined)).toBe(false);
  });
});

describe('inferUsaPeso — el catálogo manda sobre las palabras clave', () => {
  // Una cuenta nueva no tiene ninguna preferencia guardada en
  // gym_ejercicios_custom, así que ve el resultado crudo de la inferencia.
  // Estos nombres no contienen ninguna palabra de equipamiento, así que las
  // listas de palabras clave los daban como "sin peso" y el campo de peso
  // desaparecía.
  const CON_PESO_EN_CATALOGO = [
    'Zancadas',
    'Pistol squat',
    'Step up',
    'Levantamiento turco',
    'Caminata de granjero',
    'Caminata de maleta',
    'Renegade row',
    'Plié squat',
    'Déficit reverse lunge',
    'Split squat pulses',
  ];

  for (const nombre of CON_PESO_EN_CATALOGO) {
    it(`${nombre} usa peso porque el catálogo lo dice`, () => {
      expect(inferUsaPeso(nombre)).toBe(true);
    });
  }

  it('un nombre que no está en el catálogo sigue usando las palabras clave', () => {
    expect(inferUsaPeso('Press inventado con mancuerna')).toBe(true);
    expect(inferUsaPeso('Burpee inventado')).toBe(false);
  });

  it('ningún ejercicio marcado usaPeso en el catálogo pierde el campo de peso', async () => {
    const { EJERCICIOS_CATALOGO } = await import('../src/ejercicios-catalogo.js');
    const perdidos = EJERCICIOS_CATALOGO
      .filter(e => e.usaPeso && !inferUsaPeso(e.nombre))
      .map(e => e.nombre);
    expect(perdidos).toEqual([]);
  });
});
