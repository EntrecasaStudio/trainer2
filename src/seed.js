import { store } from './store.js';
import { formatDateISO, getCycleWeek, getFocusForDay, getISODayOfWeek } from './utils/calendar.js';

const BACKUP_URL = 'https://raw.githubusercontent.com/EntrecasaStudio/trainer2/main/data/backup-v1.json';

function uid() { return crypto.randomUUID(); }

function ej(nombre, series = 2, reps = '8-12', opts = {}) {
  return { id: uid(), nombre, series, reps, tipo: opts.tipo || 'fuerza', ...opts };
}

function hiitEj() {
  return ej('Pasadas de velocidad', 5, '60s', { tipo: 'hiit', duracion: 60, descanso: 60 });
}

function circuito(numero, nombre, ejercicios) {
  return { id: uid(), numero, nombre, ejercicios };
}

function rutina(numero, nombre, usuario, foco, semana_ciclo, circuitos) {
  return {
    id: uid(), numero, nombre, usuario,
    lugar: 'SPORT_FITNESS', tipo: 'gimnasio', foco, semana_ciclo,
    circuitos, updatedAt: new Date().toISOString(), pendingSync: false,
  };
}

function createLeanRoutines() {
  return [
    // Press A — semana 1
    rutina('C#001', 'Press A — Pecho + Brazos', 'Lean', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Plancha', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press de pecho'), ej('Fondos de pecho suspendido en maquina')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado con mancuernas'), ej('Pecho con polea doble')]),
      circuito(4, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Vuelos laterales')]),
      circuito(5, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Triceps con polea')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Press B — semana 1
    rutina('C#002', 'Press B — Pecho + Hombros', 'Lean', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Zancadas con mancuernas'), ej('Sumo con barra'), ej('Dead bug', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Fondos de pecho suspendido en maquina'), ej('Pecho con polea doble')]),
      circuito(3, 'PECHO ALT', [ej('Press de pecho'), ej('Press inclinado con mancuernas')]),
      circuito(4, 'HOMBROS', [ej('Empuje de hombros con barra en banco'), ej('Face pulls')]),
      circuito(5, 'BRAZOS', [ej('Vuelos laterales'), ej('Extensión de triceps sobre cabeza')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Press C — semana 2
    rutina('C#003', 'Press C — Hombros + Pecho', 'Lean', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Pallof press', 2, '30s')]),
      circuito(2, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Empuje de hombros con barra en banco')]),
      circuito(3, 'HOMBROS ALT', [ej('Vuelos laterales'), ej('Face pulls')]),
      circuito(4, 'PECHO', [ej('Press de pecho'), ej('Fondos de pecho suspendido en maquina')]),
      circuito(5, 'BRAZOS', [ej('Triceps con polea'), ej('Curl de bíceps con barra')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Press D — semana 2
    rutina('C#004', 'Press D — Pecho + Brazos', 'Lean', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Zancadas con mancuernas'), ej('Sentadilla sumo'), ej('Espinales con disco', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press de pecho'), ej('Pecho con polea doble')]),
      circuito(3, 'PECHO ALT', [ej('Fondos de pecho suspendido en maquina'), ej('Press inclinado con mancuernas')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Biceps en banco')]),
      circuito(5, 'BRAZOS ALT', [ej('Triceps con polea'), ej('Flexiones diamante', 2, '12')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Press E — semana 1
    rutina('C#005', 'Press E — Hombros + Brazos', 'Lean', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Peso muerto con barra'), ej('Sentadilla con barra'), ej('Complex', 2, '30s')]),
      circuito(2, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Vuelos laterales')]),
      circuito(3, 'HOMBROS ALT', [ej('Empuje de hombros con barra en banco'), ej('Face pulls')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Curl martillo')]),
      circuito(5, 'BRAZOS ALT', [ej('Triceps con polea'), ej('Extensión de triceps sobre cabeza')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Pull A — semana 1
    rutina('C#006', 'Pull A — Espalda + Hombros', 'Lean', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Plancha', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominadas abiertas'), ej('Remo en maquina')]),
      circuito(3, 'ESPALDA ALT', [ej('Remo alto en polea'), ej('Jalón al pecho')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Elevaciones de hombro adelante')]),
      circuito(5, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Curl martillo')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Pull B — semana 1
    rutina('C#007', 'Pull B — Espalda + Brazos', 'Lean', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Zancadas con mancuernas'), ej('Sumo con barra'), ej('Dead bug', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Remo en maquina'), ej('Dominadas abiertas')]),
      circuito(3, 'ESPALDA ALT', [ej('Jalón al pecho'), ej('Remo alto en polea')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Biceps en banco')]),
      circuito(5, 'BRAZOS ALT', [ej('Curl martillo'), ej('Biceps alto en polea')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Pull C — semana 2
    rutina('C#008', 'Pull C — Espalda + Hombros', 'Lean', 'pull', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto con barra'), ej('Pallof press', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominadas abiertas'), ej('Jalón al pecho')]),
      circuito(3, 'ESPALDA ALT', [ej('Remo en maquina'), ej('Remo alto en polea')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Vuelos laterales')]),
      circuito(5, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Curl martillo')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Pull D — semana 2
    rutina('C#009', 'Pull D — Espalda + Brazos', 'Lean', 'pull', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Zancadas con mancuernas'), ej('Sentadilla sumo'), ej('Espinales con disco', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Remo en maquina'), ej('Remo alto en polea')]),
      circuito(3, 'ESPALDA ALT', [ej('Jalón al pecho'), ej('Dominadas abiertas')]),
      circuito(4, 'BRAZOS', [ej('Biceps en banco'), ej('Biceps alto en polea')]),
      circuito(5, 'BRAZOS ALT', [ej('Curl martillo'), ej('Curl de bíceps con barra')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Pull E — semana 1
    rutina('C#010', 'Pull E — Espalda + Hombros', 'Lean', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Peso muerto con barra'), ej('Sentadilla con barra'), ej('Complex', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominadas abiertas'), ej('Remo en maquina')]),
      circuito(3, 'ESPALDA ALT', [ej('Jalón al pecho'), ej('Remo alto en polea')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Elevaciones de hombro adelante')]),
      circuito(5, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Curl martillo')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
  ];
}

function createNatRoutines() {
  return [
    // Press A
    rutina('C#011', 'Press A — Pecho + Glúteos', 'Nat', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Plancha en codos', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Fondos de pecho suspendido en maquina'), ej('Press inclinado con mancuernas')]),
      circuito(3, 'PECHO ALT', [ej('Pecho con polea doble'), ej('Flexiones diamante', 2, '12')]),
      circuito(4, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Face pulls')]),
      circuito(5, 'GLÚTEOS', [ej('Empuje de cadera en cajon'), ej('Gluteos patada en polea')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Press B
    rutina('C#012', 'Press B — Pecho + Glúteos', 'Nat', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla sumo'), ej('Zancadas con mancuernas'), ej('Dead bug', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Pecho con polea doble'), ej('Fondos de pecho suspendido en maquina')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado con mancuernas'), ej('Flexiones diamante', 2, '12')]),
      circuito(4, 'HOMBROS', [ej('Vuelos laterales'), ej('Empuje de hombros con barra en banco')]),
      circuito(5, 'GLÚTEOS', [ej('Aductores en maquina'), ej('Empuje de cadera en cajon')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Press C
    rutina('C#013', 'Press C — Hombros + Glúteos', 'Nat', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Espinales con disco', 2, '30s')]),
      circuito(2, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Face pulls')]),
      circuito(3, 'HOMBROS ALT', [ej('Vuelos laterales'), ej('Elevaciones de hombro adelante')]),
      circuito(4, 'BRAZOS', [ej('Triceps con polea'), ej('Extensión de triceps sobre cabeza')]),
      circuito(5, 'GLÚTEOS', [ej('Empuje de cadera en cajon'), ej('Gluteos patada en polea')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Press D
    rutina('C#014', 'Press D — Pecho + Glúteos', 'Nat', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sumo con rusas'), ej('Sentadilla sumo'), ej('Plancha en codos', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Fondos de pecho suspendido en maquina'), ej('Pecho con polea doble')]),
      circuito(3, 'HOMBROS', [ej('Empuje de hombros con barra en banco'), ej('Vuelos laterales')]),
      circuito(4, 'BRAZOS', [ej('Triceps con polea'), ej('Extensión de triceps sobre cabeza')]),
      circuito(5, 'GLÚTEOS', [ej('Aductores en maquina'), ej('Empuje de cadera en cajon')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Press E
    rutina('C#015', 'Press E — Hombros + Glúteos', 'Nat', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Pallof press', 2, '30s')]),
      circuito(2, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Empuje de hombros con barra en banco')]),
      circuito(3, 'HOMBROS ALT', [ej('Face pulls'), ej('Elevaciones de hombro adelante')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con mancuerna'), ej('Extensión de triceps sobre cabeza')]),
      circuito(5, 'GLÚTEOS', [ej('Gluteos patada en polea'), ej('Aductores en maquina')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Pull A
    rutina('C#016', 'Pull A — Espalda + Glúteos', 'Nat', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Plancha en codos', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominada en maquina ascensor'), ej('Remo en maquina separado')]),
      circuito(3, 'ESPALDA ALT', [ej('Remo alto en polea'), ej('Jalón al pecho')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Curl de bíceps con mancuerna')]),
      circuito(5, 'GLÚTEOS', [ej('Empuje de cadera en cajon'), ej('Gluteos patada en polea')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Pull B
    rutina('C#017', 'Pull B — Espalda + Glúteos', 'Nat', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Zancadas con mancuernas'), ej('Sentadilla sumo'), ej('Dead bug', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Remo en maquina separado'), ej('Dominada en maquina ascensor')]),
      circuito(3, 'ESPALDA ALT', [ej('Jalón al pecho'), ej('Remo alto en polea')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con mancuerna'), ej('Curl martillo')]),
      circuito(5, 'GLÚTEOS', [ej('Aductores en maquina'), ej('Empuje de cadera en cajon')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Pull C
    rutina('C#018', 'Pull C — Espalda + Glúteos', 'Nat', 'pull', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto con barra'), ej('Pallof press', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominada en maquina ascensor'), ej('Jalón al pecho')]),
      circuito(3, 'ESPALDA ALT', [ej('Remo en maquina separado'), ej('Face pulls')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con mancuerna'), ej('Curl martillo')]),
      circuito(5, 'GLÚTEOS', [ej('Gluteos patada en polea'), ej('Aductores en maquina')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Pull D
    rutina('C#019', 'Pull D — Espalda + Glúteos', 'Nat', 'pull', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sumo con rusas'), ej('Zancadas con mancuernas'), ej('Espinales con disco', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Remo en maquina separado'), ej('Remo alto en polea')]),
      circuito(3, 'ESPALDA ALT', [ej('Dominada en maquina ascensor'), ej('Jalón al pecho')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Elevaciones de hombro hacia arriba')]),
      circuito(5, 'GLÚTEOS', [ej('Empuje de cadera en cajon'), ej('Gluteos patada en polea')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
    // Pull E
    rutina('C#020', 'Pull E — Espalda + Glúteos', 'Nat', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Complex', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominada en maquina ascensor'), ej('Remo en maquina separado')]),
      circuito(3, 'ESPALDA ALT', [ej('Jalón al pecho'), ej('Remo alto en polea')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Curl de bíceps con mancuerna')]),
      circuito(5, 'GLÚTEOS', [ej('Aductores en maquina'), ej('Empuje de cadera en cajon')]),
      circuito(6, 'HIIT', [hiitEj()]),
    ]),
  ];
}

function assignCalendar(rutinas, startDate) {
  const overrides = { Lean: {}, Nat: {} };
  const today = new Date(startDate);
  today.setHours(0, 0, 0, 0);

  for (const usuario of ['Lean', 'Nat']) {
    const userRutinas = rutinas.filter(r => r.usuario === usuario && r.lugar === 'SPORT_FITNESS');
    const pressVariants = userRutinas.filter(r => r.foco === 'press');
    const pullVariants = userRutinas.filter(r => r.foco === 'pull');
    let pressIdx = 0, pullIdx = 0;

    // 8 weeks = 56 days
    for (let dayOffset = 0; dayOffset < 56; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);
      const dow = getISODayOfWeek(date);

      if (dow !== 1 && dow !== 3 && dow !== 5) continue;

      const cycleWeek = getCycleWeek(date, startDate);
      const foco = getFocusForDay(dow, cycleWeek);
      if (!foco) continue;

      let r;
      if (foco === 'press') {
        r = pressVariants[pressIdx % pressVariants.length];
        pressIdx++;
      } else {
        r = pullVariants[pullIdx % pullVariants.length];
        pullIdx++;
      }

      overrides[usuario][formatDateISO(date)] = { rutinaId: r.id, tipo: foco };
    }
  }

  return overrides;
}

async function loadBackup() {
  try {
    const res = await fetch(BACKUP_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('Backup no disponible, arrancando limpio', e);
    return null;
  }
}

function migrateBackup(backup) {
  if (!backup) return;

  // Sesiones
  if (backup.sesiones) {
    const existing = store.getAll(store.KEYS.sesiones);
    if (existing.length === 0) {
      store.set(store.KEYS.sesiones, backup.sesiones);
    }
  }

  // Progresion
  if (backup.progresion) {
    const existing = store.getObj(store.KEYS.progresion);
    if (Object.keys(existing).length === 0) {
      store.set(store.KEYS.progresion, backup.progresion);
    }
  }

  // Theme
  if (backup.theme) {
    const existing = store.get(store.KEYS.theme);
    if (!existing) {
      store.set(store.KEYS.theme, backup.theme);
    }
  }

  // Rutinas RIO
  if (backup.rutinas_rio_uruguay) {
    const existing = store.getAll(store.KEYS.rutinas);
    const rioIds = existing.filter(r => r.lugar === 'RIO').map(r => r.id);
    const newRio = backup.rutinas_rio_uruguay
      .map(r => ({ ...r, id: r.id || uid(), lugar: 'RIO', tipo: 'cross', pendingSync: false }))
      .filter(r => !rioIds.includes(r.id));
    if (newRio.length > 0) {
      store.set(store.KEYS.rutinas, [...existing, ...newRio]);
    }
  }
}

export function verifySeedV2() {
  const rutinas = store.getAll(store.KEYS.rutinas);
  const sf = rutinas.filter(r => r.lugar === 'SPORT_FITNESS');
  // Use specific patterns to avoid false positives like "jalón al pecho"
  const PRESS_PATTERNS = [/press de pecho/, /press inclinado/, /fondos de pecho/, /\bbanca\b/, /pecho con polea/, /flexiones diamante/];
  const PULL_PATTERNS = [/\bremo\b/, /\bjalón\b/, /\bjalon\b/, /\bdominad/, /\btracción\b/];
  const errors = [];

  sf.forEach(r => {
    if (r.circuitos.length !== 6) errors.push(`${r.nombre}: ${r.circuitos.length} circuitos`);
    if (r.circuitos[5]?.nombre !== 'HIIT') errors.push(`${r.nombre}: C6 no es HIIT`);

    const upperEjs = r.circuitos.slice(1, 5).flatMap(c => c.ejercicios.map(e => e.nombre.toLowerCase()));

    if (r.foco === 'pull' && upperEjs.some(e => PRESS_PATTERNS.some(p => p.test(e)))) {
      errors.push(`${r.nombre}: Pull tiene ejercicios de press`);
    }
    if (r.foco === 'press' && upperEjs.some(e => PULL_PATTERNS.some(p => p.test(e)))) {
      errors.push(`${r.nombre}: Press tiene ejercicios de pull`);
    }
    if (r.usuario === 'Nat' && r.circuitos[4]?.nombre !== 'GLÚTEOS') {
      errors.push(`${r.nombre}: Nat C5 no es GLÚTEOS`);
    }
  });

  if (sf.length !== 20) errors.push(`Total SF: ${sf.length} (debe ser 20)`);

  if (errors.length) {
    console.error('[Seed v2 ERRORS]', errors);
    return false;
  }
  console.log('[Seed v2 OK] ✅');
  return true;
}

export async function seedV2() {
  const version = store.getVersion();
  if (version === '2.1') {
    console.log('[Seed] Already at v2.0');
    return;
  }

  console.log('[Seed] Initializing v2.0...');

  // Create SPORT_FITNESS routines
  const leanRoutines = createLeanRoutines();
  const natRoutines = createNatRoutines();
  const allRoutines = [...leanRoutines, ...natRoutines];

  // Load and migrate backup
  const backup = await loadBackup();
  migrateBackup(backup);

  // Merge with existing (backup RIO routines)
  const existing = store.getAll(store.KEYS.rutinas);
  const nonSF = existing.filter(r => r.lugar !== 'SPORT_FITNESS');
  store.set(store.KEYS.rutinas, [...nonSF, ...allRoutines]);

  // Assign calendar — start from today's Monday
  const today = new Date();
  const monday = new Date(today);
  const dayOfWeek = monday.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const planStartDate = formatDateISO(monday);
  store.set(store.KEYS.plan, { startDate: planStartDate });

  const allWithRio = store.getAll(store.KEYS.rutinas);
  const overrides = assignCalendar(allWithRio, planStartDate);
  store.set(store.KEYS.overrides, overrides);

  // Set version
  store.setVersion('2.1');

  // Verify
  verifySeedV2();

  console.log('[Seed] v2.0 complete');
}

// Export for testing
export { createLeanRoutines, createNatRoutines, assignCalendar };
