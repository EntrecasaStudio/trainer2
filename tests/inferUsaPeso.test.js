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

  it('Pallof press === false', () => {
    expect(inferUsaPeso('Pallof press')).toBe(false);
  });

  it('Empuje de cadera en cajon === true', () => {
    expect(inferUsaPeso('Empuje de cadera en cajon')).toBe(true);
  });

  it('Aductores en maquina === true', () => {
    expect(inferUsaPeso('Aductores en maquina')).toBe(true);
  });

  it('Espinales con disco === false', () => {
    expect(inferUsaPeso('Espinales con disco')).toBe(false);
  });

  it('TRX chest press === false', () => {
    expect(inferUsaPeso('TRX chest press')).toBe(false);
  });

  it('Banda press de pecho === false', () => {
    expect(inferUsaPeso('Banda press de pecho')).toBe(false);
  });

  it('null/empty returns false', () => {
    expect(inferUsaPeso(null)).toBe(false);
    expect(inferUsaPeso('')).toBe(false);
    expect(inferUsaPeso(undefined)).toBe(false);
  });
});
