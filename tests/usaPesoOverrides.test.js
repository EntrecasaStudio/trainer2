import { describe, it, expect, beforeEach, vi } from 'vitest';

// El entorno de test es node: no hay localStorage.
const localStore = {};
vi.stubGlobal('localStorage', {
  getItem: key => localStore[key] ?? null,
  setItem: (key, value) => { localStore[key] = String(value); },
  removeItem: key => { delete localStore[key]; },
  clear: () => { Object.keys(localStore).forEach(k => delete localStore[k]); },
});

const { inferUsaPeso, usaPesoBase, keywordUsaPeso } = await import('../src/utils/inferUsaPeso.js');

const KEY = 'gym_ejercicios_custom';

describe('preferencias de peso fantasma', () => {
  beforeEach(() => localStorage.clear());

  it('una preferencia fantasma tapa el catálogo (el bug del iPad de José)', () => {
    expect(inferUsaPeso('Zancadas')).toBe(true);
    localStorage.setItem(KEY, JSON.stringify({ Zancadas: { usaPeso: false } }));
    expect(inferUsaPeso('Zancadas')).toBe(false);
  });

  it('la migración la reconoce: coincide con la inferencia vieja y contradice al catálogo', () => {
    // keywordUsaPeso es exactamente lo que el checkbox mostraba antes
    expect(keywordUsaPeso('Zancadas')).toBe(false);
    expect(usaPesoBase('Zancadas')).toBe(true);
  });

  it('una decisión real del usuario NO se toca', () => {
    // Fondos en banco: catálogo true, inferencia vieja true. Si el usuario
    // puso false, fue deliberado — no coincide con la inferencia vieja.
    expect(keywordUsaPeso('Fondos en banco')).toBe(true);
    expect(usaPesoBase('Fondos en banco')).toBe(true);
    localStorage.setItem(KEY, JSON.stringify({ 'Fondos en banco': { usaPeso: false } }));
    expect(inferUsaPeso('Fondos en banco')).toBe(false);
  });

  it('los 4 de peso corporal dejan de mostrar campo de peso', () => {
    for (const n of ['Sentadilla con salto', 'Sentadilla corporal',
                     'Estocada-estocada-sentadilla con salto', 'Sentadilla con press Pallof']) {
      expect(inferUsaPeso(n), n).toBe(false);
    }
  });

  it('los 11 corregidos ahora usan peso', () => {
    for (const n of ['Empuje de cadera', 'Hip thrust a una pierna', 'Dominadas',
                     'Fondos en banco', 'Oscilaciones laterales con disco']) {
      expect(inferUsaPeso(n), n).toBe(true);
    }
  });
});
