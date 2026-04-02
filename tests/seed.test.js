import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStore = {};
const localStorageMock = {
  getItem: vi.fn(key => localStore[key] || null),
  setItem: vi.fn((key, value) => { localStore[key] = value; }),
  removeItem: vi.fn(key => { delete localStore[key]; }),
  clear: vi.fn(() => { Object.keys(localStore).forEach(k => delete localStore[k]); }),
};

// Mock crypto
const cryptoMock = { randomUUID: () => `${Date.now()}-${Math.random().toString(36).slice(2)}` };

vi.stubGlobal('localStorage', localStorageMock);
vi.stubGlobal('crypto', cryptoMock);
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false })));

// Now import
const { createLeanRoutines, createNatRoutines, createRioRoutines, assignCalendar, verifySeedV2, seedV2 } = await import('../src/seed.js');
const { store } = await import('../src/store.js');

describe('Seed v2', () => {
  beforeEach(() => {
    localStorageMock.clear();
    Object.keys(localStore).forEach(k => delete localStore[k]);
  });

  describe('SPORT_FITNESS routines', () => {
    const leanRoutines = createLeanRoutines();
    const natRoutines = createNatRoutines();
    const allRoutines = [...leanRoutines, ...natRoutines];

    it('seed genera 30 rutinas SPORT_FITNESS exactas', () => {
      expect(allRoutines.length).toBe(30);
      expect(leanRoutines.length).toBe(15);
      expect(natRoutines.length).toBe(15);
    });

    it('todas SF tienen 6 circuitos', () => {
      allRoutines.forEach(r => {
        expect(r.circuitos.length, `${r.nombre} tiene ${r.circuitos.length} circuitos`).toBe(6);
      });
    });

    it('C6 nombre === "HIIT" en todas', () => {
      allRoutines.forEach(r => {
        expect(r.circuitos[5].nombre, `${r.nombre}: C6 es ${r.circuitos[5].nombre}`).toBe('HIIT');
      });
    });

    it('ninguna Pull tiene keywords de press', () => {
      // "jalón al pecho" is a pull exercise (pull to chest), not a press
      // "face pulls" contains "pull" — these are exceptions
      const PRESS_PATTERNS = [
        /\bpress de pecho\b/,
        /\bpress inclinado\b/,
        /\bfondos de pecho\b/,
        /\bbanca\b/,
        /\bpecho con polea\b/,
        /\btrx chest\b/,
        /\bbanda press de pecho\b/,
        /\bflexiones diamante\b/,
      ];
      const pullRoutines = allRoutines.filter(r => r.foco === 'pull');

      pullRoutines.forEach(r => {
        const upperEjs = r.circuitos.slice(1, 5).flatMap(c =>
          c.ejercicios.map(e => e.nombre.toLowerCase())
        );
        upperEjs.forEach(nombre => {
          PRESS_PATTERNS.forEach(pat => {
            expect(pat.test(nombre), `${r.nombre}: "${nombre}" matches press pattern "${pat}"`).toBe(false);
          });
        });
      });
    });

    it('ninguna Press tiene keywords de pull', () => {
      const PULL_PATTERNS = [
        /\bremo\b/,
        /\bjalón\b/,
        /\bjalon\b/,
        /\bdominad/,
        /\btracción\b/,
      ];
      const pressRoutines = allRoutines.filter(r => r.foco === 'press');

      pressRoutines.forEach(r => {
        const upperEjs = r.circuitos.slice(1, 5).flatMap(c =>
          c.ejercicios.map(e => e.nombre.toLowerCase())
        );
        upperEjs.forEach(nombre => {
          PULL_PATTERNS.forEach(pat => {
            expect(pat.test(nombre), `${r.nombre}: "${nombre}" matches pull pattern "${pat}"`).toBe(false);
          });
        });
      });
    });

    it('Nat C5 siempre es GLÚTEOS', () => {
      natRoutines.forEach(r => {
        expect(r.circuitos[4].nombre, `${r.nombre}: C5 es ${r.circuitos[4].nombre}`).toBe('GLÚTEOS');
      });
    });

    it('C1 siempre es PIERNAS · CORE con 3 ejercicios', () => {
      allRoutines.forEach(r => {
        expect(r.circuitos[0].nombre).toBe('PIERNAS · CORE');
        expect(r.circuitos[0].ejercicios.length, `${r.nombre}: C1 tiene ${r.circuitos[0].ejercicios.length} ejercicios`).toBe(3);
      });
    });

    it('C2-C4 tienen 2 ejercicios cada uno', () => {
      allRoutines.forEach(r => {
        for (let i = 1; i <= 3; i++) {
          expect(r.circuitos[i].ejercicios.length,
            `${r.nombre}: C${i + 1} tiene ${r.circuitos[i].ejercicios.length} ejercicios`
          ).toBe(2);
        }
      });
    });
  });
});

describe('Calendar assignment', () => {
  it('lunes semana 1 = press', async () => {
    // Start from a known Monday
    const startDate = '2026-03-30'; // Monday
    const leanRoutines = createLeanRoutines();
    const natRoutines = createNatRoutines();
    const rioRoutines = createRioRoutines();
    const allRoutines = [...leanRoutines, ...natRoutines, ...rioRoutines];

    const overrides = assignCalendar(allRoutines, startDate);

    // Check Lean's Monday (day 1) in week 1
    const leanMonday = overrides.Lean[startDate];
    expect(leanMonday).toBeDefined();
    expect(leanMonday.tipo).toBe('press');
  });

  it('miércoles semana 1 = pull', () => {
    const startDate = '2026-03-30';
    const allRoutines = [...createLeanRoutines(), ...createNatRoutines(), ...createRioRoutines()];
    const overrides = assignCalendar(allRoutines, startDate);

    // Wednesday = 2026-04-01
    const leanWed = overrides.Lean['2026-04-01'];
    expect(leanWed).toBeDefined();
    expect(leanWed.tipo).toBe('pull');
  });

  it('lunes semana 2 = pull', () => {
    const startDate = '2026-03-30';
    const allRoutines = [...createLeanRoutines(), ...createNatRoutines(), ...createRioRoutines()];
    const overrides = assignCalendar(allRoutines, startDate);

    // Monday week 2 = 2026-04-06
    const leanMon2 = overrides.Lean['2026-04-06'];
    expect(leanMon2).toBeDefined();
    expect(leanMon2.tipo).toBe('pull');
  });

  it('no hay asignaciones en Mar/Jue/Dom', () => {
    const startDate = '2026-03-30';
    const allRoutines = [...createLeanRoutines(), ...createNatRoutines(), ...createRioRoutines()];
    const overrides = assignCalendar(allRoutines, startDate);

    // Check Lean dates — Mon(1), Wed(3), Fri(5), Sat(6)
    for (const [dateStr, val] of Object.entries(overrides.Lean)) {
      const d = new Date(dateStr + 'T00:00:00');
      const dow = d.getDay();
      expect([1, 3, 5, 6].includes(dow), `${dateStr} is day ${dow}`).toBe(true);
    }
  });

  describe('dedup and re-run guard', () => {
    it('seedV2 does not duplicate on re-runs', async () => {
      await seedV2();
      const count1 = store.getAll(store.KEYS.rutinas).length;
      await seedV2(); // second run
      const count2 = store.getAll(store.KEYS.rutinas).length;
      await seedV2(); // third run
      const count3 = store.getAll(store.KEYS.rutinas).length;
      expect(count2).toBe(count1);
      expect(count3).toBe(count1);
    });

    it('dedup cleans duplicated rutinas', async () => {
      // Seed once
      await seedV2();
      const rutinas = store.getAll(store.KEYS.rutinas);
      const original = rutinas.length;

      // Manually inject duplicates
      store.set(store.KEYS.rutinas, [...rutinas, ...rutinas, ...rutinas]);
      expect(store.getAll(store.KEYS.rutinas).length).toBe(original * 3);

      // Re-seed triggers dedup
      store.setVersion('0'); // force re-seed
      await seedV2();
      const cleaned = store.getAll(store.KEYS.rutinas);
      // Should not have tripled
      expect(cleaned.length).toBeLessThanOrEqual(original + 10);
    });
  });
});
