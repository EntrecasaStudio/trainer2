import { store } from './store.js';
import { formatDateISO, getCycleWeek, getFocusForDay, getISODayOfWeek, getRioFocusForSaturday } from './utils/calendar.js';

const BACKUP_URL_REMOTE = 'https://raw.githubusercontent.com/EntrecasaStudio/trainer2/main/data/backup-v1.json';
const BACKUP_URL_LOCAL = './data/backup-v1.json';

function uid() { return crypto.randomUUID(); }

function getThisMonday() {
  const d = new Date();
  const dow = d.getDay();
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function ej(nombre, series = 2, reps = '8-12', opts = {}) {
  return { id: uid(), nombre, series, reps, tipo: opts.tipo || 'fuerza', ...opts };
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
    // Press A — semana 1 — Hammer (guiada) → inclinado mancuernas (estabilidad)
    rutina('#001', 'Press A — Pecho + Brazos', 'Lean', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Plancha', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press Hammer'), ej('Fondos de pecho suspendido en maquina')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado con mancuernas'), ej('Pecho con polea doble')]),
      circuito(4, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Vuelos laterales')]),
      circuito(5, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Triceps con polea')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Press B — semana 1 — Banca (estabilidad) → inclinado máquina (guiada)
    rutina('#002', 'Press B — Pecho + Hombros', 'Lean', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Zancadas con mancuernas'), ej('Sumo con barra'), ej('Dead bug', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press de banca con barra'), ej('Pecho con polea doble')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado en máquina'), ej('Aperturas con mancuernas')]),
      circuito(4, 'HOMBROS', [ej('Empuje de hombros con barra en banco'), ej('Face pulls')]),
      circuito(5, 'BRAZOS', [ej('Vuelos laterales'), ej('Extensión de triceps sobre cabeza')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Press C — semana 2 — Hammer (guiada) en pecho secundario
    rutina('#003', 'Press C — Hombros + Pecho', 'Lean', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Pallof press', 2, '30s')]),
      circuito(2, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Empuje de hombros con barra en banco')]),
      circuito(3, 'HOMBROS ALT', [ej('Vuelos laterales'), ej('Face pulls')]),
      circuito(4, 'PECHO', [ej('Press Hammer'), ej('Press inclinado con mancuernas')]),
      circuito(5, 'BRAZOS', [ej('Triceps con polea'), ej('Curl de bíceps con barra')]),
      circuito(6, 'HIIT', [ej('Burpees', 3, 10), ej('Sentadilla con salto', 3, 12), ej('Caminata a plancha', 3, 8)]),
    ]),
    // Press D — semana 2 — Banca (estabilidad) → inclinado máquina (guiada)
    rutina('#004', 'Press D — Pecho + Brazos', 'Lean', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Zancadas con mancuernas'), ej('Sentadilla sumo'), ej('Espinales con disco', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press de banca con barra'), ej('Aperturas con mancuernas')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado en máquina'), ej('Fondos de pecho suspendido en maquina')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Biceps en banco')]),
      circuito(5, 'BRAZOS ALT', [ej('Triceps con polea'), ej('Flexiones diamante', 2, '12')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Press E — semana 1
    rutina('#005', 'Press E — Hombros + Brazos', 'Lean', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Peso muerto con barra'), ej('Sentadilla con barra'), ej('Complex', 2, '30s')]),
      circuito(2, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Vuelos laterales')]),
      circuito(3, 'HOMBROS ALT', [ej('Empuje de hombros con barra en banco'), ej('Face pulls')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Curl martillo')]),
      circuito(5, 'BRAZOS ALT', [ej('Triceps con polea'), ej('Extensión de triceps sobre cabeza')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Pull A — semana 1
    rutina('#006', 'Pull A — Espalda + Hombros', 'Lean', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Plancha', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominadas abiertas'), ej('Remo en maquina')]),
      circuito(3, 'ESPALDA ALT', [ej('Remo alto en polea'), ej('Jalón al pecho')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Elevaciones de hombro adelante')]),
      circuito(5, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Curl martillo')]),
      circuito(6, 'HIIT', [ej('Saltos al cajón', 3, 10), ej('Mountain climbers', 3, 15), ej('Burpees', 3, 8)]),
    ]),
    // Pull B — semana 1
    rutina('#007', 'Pull B — Espalda + Brazos', 'Lean', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Zancadas con mancuernas'), ej('Sumo con barra'), ej('Dead bug', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Remo en maquina'), ej('Dominadas abiertas')]),
      circuito(3, 'ESPALDA ALT', [ej('Jalón al pecho'), ej('Remo alto en polea')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Biceps en banco')]),
      circuito(5, 'BRAZOS ALT', [ej('Curl martillo'), ej('Biceps alto en polea')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Pull C — semana 2
    rutina('#008', 'Pull C — Espalda + Hombros', 'Lean', 'pull', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto con barra'), ej('Pallof press', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominadas abiertas'), ej('Jalón al pecho')]),
      circuito(3, 'ESPALDA ALT', [ej('Remo en maquina'), ej('Remo alto en polea')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Vuelos laterales')]),
      circuito(5, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Curl martillo')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Pull D — semana 2
    rutina('#009', 'Pull D — Espalda + Brazos', 'Lean', 'pull', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Zancadas con mancuernas'), ej('Sentadilla sumo'), ej('Espinales con disco', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Remo en maquina'), ej('Remo alto en polea')]),
      circuito(3, 'ESPALDA ALT', [ej('Jalón al pecho'), ej('Dominadas abiertas')]),
      circuito(4, 'BRAZOS', [ej('Biceps en banco'), ej('Biceps alto en polea')]),
      circuito(5, 'BRAZOS ALT', [ej('Curl martillo'), ej('Curl de bíceps con barra')]),
      circuito(6, 'HIIT', [ej('Estocada con salto', 3, 10), ej('Jumping jacks', 3, 20), ej('Abs complex', 3, 1)]),
    ]),
    // Pull E — semana 1
    rutina('#010', 'Pull E — Espalda + Hombros', 'Lean', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Peso muerto con barra'), ej('Sentadilla con barra'), ej('Complex', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominadas abiertas'), ej('Remo en maquina')]),
      circuito(3, 'ESPALDA ALT', [ej('Jalón al pecho'), ej('Remo alto en polea')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Elevaciones de hombro adelante')]),
      circuito(5, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Curl martillo')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // ── NEW ROUTINES ──────────────────────────────────────────────────────────
    // Press F — semana 2 — Hammer (guiada) → inclinado mancuernas (estabilidad)
    rutina('#021', 'Press F — Pecho + Hombros', 'Lean', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Prensa de piernas'), ej('Sentadilla búlgara'), ej('Plancha lateral', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press Hammer'), ej('Aperturas con mancuernas')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado con mancuernas'), ej('Pullover con mancuerna')]),
      circuito(4, 'HOMBROS', [ej('Arnold press'), ej('Vuelos laterales')]),
      circuito(5, 'BRAZOS', [ej('Fondos en banco', 2, '12'), ej('Triceps con polea')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Press G — semana 1 — Banca (estabilidad) en pecho secundario
    rutina('#022', 'Press G — Hombros + Pecho', 'Lean', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Extensión de cuádriceps'), ej('Curl femoral'), ej('Crunch en polea')]),
      circuito(2, 'HOMBROS', [ej('Arnold press'), ej('Encogimientos con mancuernas')]),
      circuito(3, 'HOMBROS ALT', [ej('Elevaciones de hombro adelante'), ej('Face pulls')]),
      circuito(4, 'PECHO', [ej('Press de banca con barra'), ej('Press inclinado en máquina')]),
      circuito(5, 'BRAZOS', [ej('Extensión de triceps sobre cabeza'), ej('Fondos en banco', 2, '12')]),
      circuito(6, 'HIIT', [ej('Sentadilla con salto', 3, 12), ej('Caminata a plancha', 3, 8), ej('Abs complex', 3, 1)]),
    ]),
    // Pull F — semana 2
    rutina('#023', 'Pull F — Espalda + Brazos', 'Lean', 'pull', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Prensa de piernas'), ej('Gemelos en máquina'), ej('Plancha lateral', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Remo con mancuerna'), ej('Pulldown agarre cerrado')]),
      circuito(3, 'ESPALDA ALT', [ej('Dominadas abiertas'), ej('Remo alto en polea')]),
      circuito(4, 'BRAZOS', [ej('Curl concentrado'), ej('Curl martillo')]),
      circuito(5, 'BRAZOS ALT', [ej('Biceps alto en polea'), ej('Biceps en banco')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Pull G — semana 1
    rutina('#024', 'Pull G — Espalda + Hombros', 'Lean', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla búlgara'), ej('Curl femoral'), ej('Crunch en polea')]),
      circuito(2, 'ESPALDA', [ej('Pulldown agarre cerrado'), ej('Remo con mancuerna')]),
      circuito(3, 'ESPALDA ALT', [ej('Jalón al pecho'), ej('Remo en maquina separado')]),
      circuito(4, 'HOMBROS', [ej('Encogimientos con mancuernas'), ej('Elevaciones de hombro hacia arriba')]),
      circuito(5, 'BRAZOS', [ej('Curl concentrado'), ej('Curl de bíceps con mancuerna')]),
      circuito(6, 'HIIT', [ej('Saltos laterales', 3, 12), ej('Mountain climbers', 3, 15), ej('Jumping jacks', 3, 20)]),
    ]),
    // Press H — semana 2 — Hammer (guiada) → inclinado mancuernas (estabilidad)
    rutina('#025', 'Press H — Pecho + Brazos', 'Lean', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Gemelos en máquina'), ej('Extensión de cuádriceps'), ej('Plancha', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press Hammer'), ej('Pullover con mancuerna')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado con mancuernas'), ej('Aperturas con mancuernas')]),
      circuito(4, 'BRAZOS', [ej('Fondos en banco', 2, '12'), ej('Extensión de triceps sobre cabeza')]),
      circuito(5, 'BRAZOS ALT', [ej('Triceps con polea'), ej('Flexiones diamante', 2, '12')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
  ];
}

function createNatRoutines() {
  return [
    // Press A — Hammer (guiada) → inclinado mancuernas (estabilidad)
    rutina('#011', 'Press A — Pecho + Glúteos', 'Nat', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Plancha en codos', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press Hammer'), ej('Fondos de pecho suspendido en maquina')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado con mancuernas'), ej('Pecho con polea doble')]),
      circuito(4, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Face pulls')]),
      circuito(5, 'GLÚTEOS', [ej('Empuje de cadera en cajon'), ej('Gluteos patada en polea')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Press B — Banca (estabilidad) → inclinado máquina (guiada)
    rutina('#012', 'Press B — Pecho + Glúteos', 'Nat', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla sumo'), ej('Zancadas con mancuernas'), ej('Dead bug', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press de banca con barra'), ej('Pecho con polea doble')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado en máquina'), ej('Flexiones diamante', 2, '12')]),
      circuito(4, 'HOMBROS', [ej('Vuelos laterales'), ej('Empuje de hombros con barra en banco')]),
      circuito(5, 'GLÚTEOS', [ej('Aductores en maquina'), ej('Empuje de cadera en cajon')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Press C
    rutina('#013', 'Press C — Hombros + Glúteos', 'Nat', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Espinales con disco', 2, '30s')]),
      circuito(2, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Face pulls')]),
      circuito(3, 'HOMBROS ALT', [ej('Vuelos laterales'), ej('Elevaciones de hombro adelante')]),
      circuito(4, 'BRAZOS', [ej('Triceps con polea'), ej('Extensión de triceps sobre cabeza')]),
      circuito(5, 'GLÚTEOS', [ej('Empuje de cadera en cajon'), ej('Gluteos patada en polea')]),
      circuito(6, 'HIIT', [ej('Estocada con salto', 3, 10), ej('Abs complex', 3, 1), ej('Caminata a plancha', 3, 8)]),
    ]),
    // Press D — Hammer (guiada) en pecho secundario
    rutina('#014', 'Press D — Pecho + Glúteos', 'Nat', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sumo con rusas'), ej('Sentadilla sumo'), ej('Plancha en codos', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press Hammer'), ej('Press inclinado con mancuernas')]),
      circuito(3, 'HOMBROS', [ej('Empuje de hombros con barra en banco'), ej('Vuelos laterales')]),
      circuito(4, 'BRAZOS', [ej('Triceps con polea'), ej('Extensión de triceps sobre cabeza')]),
      circuito(5, 'GLÚTEOS', [ej('Aductores en maquina'), ej('Empuje de cadera en cajon')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Press E
    rutina('#015', 'Press E — Hombros + Glúteos', 'Nat', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Pallof press', 2, '30s')]),
      circuito(2, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Empuje de hombros con barra en banco')]),
      circuito(3, 'HOMBROS ALT', [ej('Face pulls'), ej('Elevaciones de hombro adelante')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con mancuerna'), ej('Extensión de triceps sobre cabeza')]),
      circuito(5, 'GLÚTEOS', [ej('Gluteos patada en polea'), ej('Aductores en maquina')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Pull A
    rutina('#016', 'Pull A — Espalda + Glúteos', 'Nat', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Plancha en codos', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominada en maquina ascensor'), ej('Remo en maquina separado')]),
      circuito(3, 'ESPALDA ALT', [ej('Remo alto en polea'), ej('Jalón al pecho')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Curl de bíceps con mancuerna')]),
      circuito(5, 'GLÚTEOS', [ej('Empuje de cadera en cajon'), ej('Gluteos patada en polea')]),
      circuito(6, 'HIIT', [ej('Saltos laterales', 3, 12), ej('Caminata a plancha', 3, 8), ej('Burpees', 3, 8)]),
    ]),
    // Pull B
    rutina('#017', 'Pull B — Espalda + Glúteos', 'Nat', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Zancadas con mancuernas'), ej('Sentadilla sumo'), ej('Dead bug', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Remo en maquina separado'), ej('Dominada en maquina ascensor')]),
      circuito(3, 'ESPALDA ALT', [ej('Jalón al pecho'), ej('Remo alto en polea')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con mancuerna'), ej('Curl martillo')]),
      circuito(5, 'GLÚTEOS', [ej('Aductores en maquina'), ej('Empuje de cadera en cajon')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Pull C
    rutina('#018', 'Pull C — Espalda + Glúteos', 'Nat', 'pull', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto con barra'), ej('Pallof press', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominada en maquina ascensor'), ej('Jalón al pecho')]),
      circuito(3, 'ESPALDA ALT', [ej('Remo en maquina separado'), ej('Face pulls')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con mancuerna'), ej('Curl martillo')]),
      circuito(5, 'GLÚTEOS', [ej('Gluteos patada en polea'), ej('Aductores en maquina')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Pull D
    rutina('#019', 'Pull D — Espalda + Glúteos', 'Nat', 'pull', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sumo con rusas'), ej('Zancadas con mancuernas'), ej('Espinales con disco', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Remo en maquina separado'), ej('Remo alto en polea')]),
      circuito(3, 'ESPALDA ALT', [ej('Dominada en maquina ascensor'), ej('Jalón al pecho')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Elevaciones de hombro hacia arriba')]),
      circuito(5, 'GLÚTEOS', [ej('Empuje de cadera en cajon'), ej('Gluteos patada en polea')]),
      circuito(6, 'HIIT', [ej('Burpees', 3, 8), ej('Sentadilla con salto', 3, 12), ej('Jumping jacks', 3, 20)]),
    ]),
    // Pull E
    rutina('#020', 'Pull E — Espalda + Glúteos', 'Nat', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Complex', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominada en maquina ascensor'), ej('Remo en maquina separado')]),
      circuito(3, 'ESPALDA ALT', [ej('Jalón al pecho'), ej('Remo alto en polea')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Curl de bíceps con mancuerna')]),
      circuito(5, 'GLÚTEOS', [ej('Aductores en maquina'), ej('Empuje de cadera en cajon')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // ── NEW NAT ROUTINES ──────────────────────────────────────────────────────
    // Press F — Banca (estabilidad) → inclinado máquina (guiada)
    rutina('#026', 'Press F — Pecho + Glúteos', 'Nat', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Prensa de piernas'), ej('Sentadilla búlgara'), ej('Plancha lateral', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press de banca con barra'), ej('Aperturas con mancuernas')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado en máquina'), ej('Pullover con mancuerna')]),
      circuito(4, 'HOMBROS', [ej('Arnold press'), ej('Face pulls')]),
      circuito(5, 'GLÚTEOS', [ej('Peso muerto sumo'), ej('Abductores en maquina')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Press G
    rutina('#027', 'Press G — Hombros + Glúteos', 'Nat', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Extensión de cuádriceps'), ej('Curl femoral'), ej('Crunch en polea')]),
      circuito(2, 'HOMBROS', [ej('Arnold press'), ej('Encogimientos con mancuernas')]),
      circuito(3, 'HOMBROS ALT', [ej('Elevaciones de hombro adelante'), ej('Vuelos laterales')]),
      circuito(4, 'BRAZOS', [ej('Fondos en banco', 2, '12'), ej('Extensión de triceps sobre cabeza')]),
      circuito(5, 'GLÚTEOS', [ej('Empuje de cadera en cajon'), ej('Abductores en maquina')]),
      circuito(6, 'HIIT', [ej('Burpees', 3, 10), ej('Sentadilla con salto', 3, 12), ej('Caminata a plancha', 3, 8)]),
    ]),
    // Pull F
    rutina('#028', 'Pull F — Espalda + Glúteos', 'Nat', 'pull', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Prensa de piernas'), ej('Gemelos en máquina'), ej('Plancha lateral', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Remo con mancuerna'), ej('Pulldown agarre cerrado')]),
      circuito(3, 'ESPALDA ALT', [ej('Dominada en maquina ascensor'), ej('Remo alto en polea')]),
      circuito(4, 'BRAZOS', [ej('Curl concentrado'), ej('Curl de bíceps con mancuerna')]),
      circuito(5, 'GLÚTEOS', [ej('Peso muerto sumo'), ej('Gluteos patada en polea')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
    // Pull G
    rutina('#029', 'Pull G — Espalda + Glúteos', 'Nat', 'pull', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla búlgara'), ej('Curl femoral'), ej('Crunch en polea')]),
      circuito(2, 'ESPALDA', [ej('Pulldown agarre cerrado'), ej('Remo con mancuerna')]),
      circuito(3, 'ESPALDA ALT', [ej('Jalón al pecho'), ej('Remo en maquina separado')]),
      circuito(4, 'HOMBROS', [ej('Encogimientos con mancuernas'), ej('Elevaciones de hombro hacia arriba')]),
      circuito(5, 'GLÚTEOS', [ej('Abductores en maquina'), ej('Empuje de cadera en cajon')]),
      circuito(6, 'HIIT', [ej('Saltos laterales', 3, 12), ej('Estocada con salto', 3, 10), ej('Jumping jacks', 3, 20)]),
    ]),
    // Press H — Hammer (guiada) → inclinado mancuernas (estabilidad)
    rutina('#030', 'Press H — Pecho + Glúteos', 'Nat', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Gemelos en máquina'), ej('Extensión de cuádriceps'), ej('Plancha en codos', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press Hammer'), ej('Pullover con mancuerna')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado con mancuernas'), ej('Aperturas con mancuernas')]),
      circuito(4, 'BRAZOS', [ej('Curl concentrado'), ej('Triceps con polea')]),
      circuito(5, 'GLÚTEOS', [ej('Peso muerto sumo'), ej('Gluteos patada en polea')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1)]),
    ]),
  ];
}

function rutinaRio(numero, nombre, usuario, foco, semana_ciclo, circuitos) {
  return {
    id: uid(), numero, nombre, usuario,
    lugar: 'RIO', tipo: 'cross', foco, semana_ciclo,
    circuitos, updatedAt: new Date().toISOString(), pendingSync: false,
  };
}

function createRioRoutines() {
  return [
    // ── LEAN RIO ROUTINES (15) ─────────────────────────────────────────────
    // RÍO Pull A — Lean
    rutinaRio('#001', 'RÍO Pull A — Espalda', 'Lean', 'pull', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda lateral walk', 2, '15'), ej('Rotación torácica', 2, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Sentadilla búlgara', 3, '10'), ej('Peso muerto a una pierna con kettlebell', 3, '10')]),
      circuito(3, 'ESPALDA', [ej('Dominadas australianas', 3, '12'), ej('TRX row', 3, '12')]),
      circuito(4, 'ESPALDA ALT', [ej('Remo alto en TRX', 3, '12'), ej('Banda pull-apart', 3, '20')]),
      circuito(5, 'CORE+CARDIO', [ej('Ab wheel', 3, '10'), ej('Mountain climbers', 3, '20'), ej('Pasadas de velocidad', 4, '20m')]),
      circuito(6, 'HIIT', [ej('Burpees', 3, '8'), ej('Sentadilla con salto', 3, '10'), ej('Mountain climbers', 3, '20')]),
    ]),
    // RÍO Pull B — Lean
    rutinaRio('#002', 'RÍO Pull B — Espalda', 'Lean', 'pull', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda dislocates', 2, '15'), ej('Movilidad de cadera', 2, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Empuje de cadera en cajon', 3, '12'), ej('Sentadilla sumo', 3, '12')]),
      circuito(3, 'ESPALDA', [ej('Dominadas cerradas', 3, 'AMRAP'), ej('TRX row', 3, '12')]),
      circuito(4, 'BÍCEPS', [ej('Banda curl biceps', 3, '15'), ej('Curl martillo', 3, '10')]),
      circuito(5, 'CORE+CARDIO', [ej('Hollow body', 3, '30s'), ej('Dead bug', 3, '10'), ej('Jumping jacks', 3, '30')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 4, '20m'), ej('Jumping jacks', 3, '30'), ej('Bear crawl', 3, '10m')]),
    ]),
    // RÍO Pull C — Lean
    rutinaRio('#003', 'RÍO Pull C — Espalda', 'Lean', 'pull', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('TRX face pull', 2, '15'), ej('Rotación de hombros', 2, '15')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Zancadas con kettlebell', 3, '10'), ej('Step-up en banco', 3, '10')]),
      circuito(3, 'ESPALDA', [ej('Dominadas australianas', 3, '12'), ej('TRX row', 3, '10')]),
      circuito(4, 'ESPALDA ALT', [ej('Banda pull-apart', 3, '20'), ej('Remo alto en polea', 3, '15')]),
      circuito(5, 'CORE+CARDIO', [ej('Ab wheel', 3, '10'), ej('Pasadas de velocidad', 4, '30m'), ej('Burpees', 3, '8')]),
      circuito(6, 'HIIT', [ej('Mountain climbers', 3, '25'), ej('Burpees', 3, '10'), ej('Saltos al cajón', 3, '8')]),
    ]),
    // RÍO Pull D — Lean
    rutinaRio('#004', 'RÍO Pull D — Espalda', 'Lean', 'pull', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda lateral walk', 2, '15'), ej('Cat-cow', 2, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Sentadilla sumo', 3, '15'), ej('Peso muerto a una pierna con kettlebell', 3, '12')]),
      circuito(3, 'ESPALDA', [ej('Dominadas grip neutro', 3, 'AMRAP'), ej('TRX row', 3, '12')]),
      circuito(4, 'BÍCEPS', [ej('Curl de bíceps con kettlebell', 3, '12'), ej('Banda curl biceps', 3, '1')]),
      circuito(5, 'CORE+CARDIO', [ej('Plancha con elevación alternada', 3, '10'), ej('L-sit en paralelas', 3, '20s'), ej('Mountain climbers', 3, '20')]),
      circuito(6, 'HIIT', [ej('Sentadilla con salto', 3, '12'), ej('Jumping jacks', 3, '30'), ej('Pasadas de velocidad', 4, '20m')]),
    ]),
    // RÍO Pull E — Lean
    rutinaRio('#005', 'RÍO Pull E — Espalda', 'Lean', 'pull', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Activación glúteo con loop band', 2, '15'), ej('Rotación torácica', 2, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Zancadas con kettlebell', 3, '12'), ej('Empuje de cadera en cajon', 3, '15')]),
      circuito(3, 'ESPALDA', [ej('Dominadas abiertas', 3, 'AMRAP'), ej('TRX row', 3, '12')]),
      circuito(4, 'ESPALDA ALT', [ej('Remo con kettlebell', 3, '10'), ej('Banda pull-apart', 3, '20')]),
      circuito(5, 'CORE+CARDIO', [ej('Ab wheel', 3, '10'), ej('Bear crawl', 4, '10m'), ej('Pasadas de velocidad', 4, '20m')]),
      circuito(6, 'HIIT', [ej('Bear crawl', 3, '10m'), ej('Burpees', 3, '8'), ej('Mountain climbers', 3, '20')]),
    ]),
    // RÍO Pull F — Lean
    rutinaRio('#006', 'RÍO Pull F — Espalda', 'Lean', 'pull', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda face pull', 2, '15'), ej('Movilidad de hombros', 2, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Step-up en banco', 3, '10'), ej('Sentadilla búlgara', 3, '8')]),
      circuito(3, 'ESPALDA', [ej('Muscle-up negativo en barra', 3, '5'), ej('Dominadas australianas', 3, '12')]),
      circuito(4, 'BÍCEPS·POSTERIOR', [ej('Curl de bíceps con kettlebell', 3, '12'), ej('Banda pull-apart', 3, '20')]),
      circuito(5, 'CORE+CARDIO', [ej('Hollow body', 3, '30s'), ej('Ab wheel', 3, '10'), ej('Jumping jacks', 3, '30')]),
      circuito(6, 'HIIT', [ej('Jumping jacks', 3, '30'), ej('Sentadilla con salto', 3, '10'), ej('Caminata a plancha', 3, '8')]),
    ]),
    // RÍO Pull G — Lean
    rutinaRio('#007', 'RÍO Pull G — Espalda', 'Lean', 'pull', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Activación glúteo con loop band', 2, '15'), ej('Rotación torácica', 2, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Sentadilla con salto', 3, '10'), ej('Peso muerto a una pierna con kettlebell', 3, '8')]),
      circuito(3, 'ESPALDA', [ej('Dominadas', 3, 'AMRAP'), ej('TRX row', 3, '10')]),
      circuito(4, 'ESPALDA ALT', [ej('Remo alto en TRX', 3, '12'), ej('Banda pull-apart', 3, '20')]),
      circuito(5, 'CORE+CARDIO', [ej('Ab wheel', 3, '10'), ej('Pasadas de velocidad', 4, '30m'), ej('Burpees', 3, '6')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 4, '30m'), ej('Mountain climbers', 3, '20'), ej('Burpees', 3, '8')]),
    ]),
    // RÍO Pull H — Lean
    rutinaRio('#008', 'RÍO Pull H — Espalda', 'Lean', 'pull', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda dislocates', 2, '15'), ej('Hip 90/90 mobility', 2, '8')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Sentadilla sumo', 3, '15'), ej('Zancadas con kettlebell', 3, '10')]),
      circuito(3, 'ESPALDA', [ej('Dominadas cerradas', 3, 'AMRAP'), ej('TRX row', 3, '15')]),
      circuito(4, 'BÍCEPS', [ej('Curl de bíceps con kettlebell', 3, '12'), ej('Banda curl biceps', 3, '15')]),
      circuito(5, 'CORE+CARDIO', [ej('L-sit en paralelas', 3, '20s'), ej('Mountain climbers', 3, '25'), ej('Pasadas de velocidad', 4, '20m')]),
      circuito(6, 'HIIT', [ej('Saltos al cajón', 3, '10'), ej('Jumping jacks', 3, '30'), ej('Bear crawl', 3, '10m')]),
    ]),
    // RÍO Press A — Lean
    rutinaRio('#009', 'RÍO Press A — Hombros', 'Lean', 'press', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda press de pecho', 2, '15'), ej('Rotación de hombros', 2, '10')]),
      circuito(2, 'PIERNAS·CUÁDRICEPS', [ej('Sentadilla sumo', 3, '15'), ej('Zancadas con kettlebell', 3, '10')]),
      circuito(3, 'PECHO·HOMBROS', [ej('Flexiones', 3, '12'), ej('Dips en paralelas', 3, 'AMRAP')]),
      circuito(4, 'HOMBROS', [ej('Press militar con kettlebell', 3, '10'), ej('Vuelos laterales', 3, '15')]),
      circuito(5, 'CORE+CARDIO', [ej('Plancha en paralelas', 3, '45s'), ej('Ab wheel', 3, '10'), ej('Hollow body', 3, '30s')]),
      circuito(6, 'HIIT', [ej('Burpees', 3, '8'), ej('Sentadilla con salto', 3, '10'), ej('Mountain climbers', 3, '20')]),
    ]),
    // RÍO Press B — Lean
    rutinaRio('#010', 'RÍO Press B — Pecho', 'Lean', 'press', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Rotación torácica', 2, '10'), ej('Movilidad de hombros', 2, '10')]),
      circuito(2, 'PIERNAS·CUÁDRICEPS', [ej('Saltos al cajón', 3, '8'), ej('Sentadilla sumo', 3, '12')]),
      circuito(3, 'PECHO', [ej('Flexiones diamante', 3, '12'), ej('TRX chest press', 3, '12')]),
      circuito(4, 'HOMBROS·TRÍCEPS', [ej('Press militar con kettlebell', 3, '10'), ej('Dips en paralelas', 3, 'AMRAP')]),
      circuito(5, 'CORE+CARDIO', [ej('Bear crawl', 4, '10m'), ej('Mountain climbers', 3, '20'), ej('Ab wheel', 3, '10')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 4, '20m'), ej('Jumping jacks', 3, '30'), ej('Bear crawl', 3, '10m')]),
    ]),
    // RÍO Press C — Lean
    rutinaRio('#011', 'RÍO Press C — Pecho', 'Lean', 'press', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda pull-apart', 2, '15'), ej('Movilidad de cadera', 2, '10')]),
      circuito(2, 'PIERNAS·CUÁDRICEPS', [ej('Sentadilla búlgara', 3, '10'), ej('Step-up en banco', 3, '10')]),
      circuito(3, 'PECHO', [ej('Flexiones', 3, '12'), ej('TRX chest press', 3, '12')]),
      circuito(4, 'HOMBROS', [ej('Arnold press con kettlebell', 3, '10'), ej('TRX face pull', 3, '12')]),
      circuito(5, 'CORE', [ej('L-sit en paralelas', 3, '20s'), ej('Plancha', 3, '45s'), ej('Dead bug', 3, '10')]),
      circuito(6, 'HIIT', [ej('Mountain climbers', 3, '25'), ej('Burpees', 3, '10'), ej('Saltos al cajón', 3, '8')]),
    ]),
    // RÍO Press D — Lean
    rutinaRio('#012', 'RÍO Press D — Pecho + Hombros', 'Lean', 'press', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda dislocates', 2, '15'), ej('Rotación torácica', 2, '10')]),
      circuito(2, 'PIERNAS', [ej('Sentadilla con salto', 3, '10'), ej('Zancadas con kettlebell', 3, '10')]),
      circuito(3, 'PECHO·HOMBROS', [ej('Flexiones explosivas', 3, '8'), ej('Press militar con kettlebell', 3, '10')]),
      circuito(4, 'TRÍCEPS', [ej('Fondos en banco', 3, 'AMRAP'), ej('Banda triceps pushdown', 3, '15')]),
      circuito(5, 'CORE+CARDIO', [ej('Ab wheel', 3, '10'), ej('Pasadas de velocidad', 4, '20m'), ej('Burpees', 3, '8')]),
      circuito(6, 'HIIT', [ej('Sentadilla con salto', 3, '12'), ej('Jumping jacks', 3, '30'), ej('Pasadas de velocidad', 4, '20m')]),
    ]),
    // RÍO Press E — Lean
    rutinaRio('#013', 'RÍO Press E — Pecho', 'Lean', 'press', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda press de pecho', 2, '15'), ej('Movilidad de hombros', 2, '10')]),
      circuito(2, 'PIERNAS·CUÁDRICEPS', [ej('Sentadilla sumo', 3, '15'), ej('Step-up en banco', 3, '10')]),
      circuito(3, 'PECHO', [ej('Flexiones', 3, '12'), ej('Flexiones inclinadas', 3, '15')]),
      circuito(4, 'HOMBROS', [ej('Press militar con kettlebell', 3, '10'), ej('Vuelos laterales', 3, '15')]),
      circuito(5, 'CORE+CARDIO', [ej('Hollow body', 3, '30s'), ej('Plancha lateral', 3, '20s'), ej('Ab wheel', 3, '10')]),
      circuito(6, 'HIIT', [ej('Bear crawl', 3, '10m'), ej('Burpees', 3, '8'), ej('Mountain climbers', 3, '20')]),
    ]),
    // RÍO Press F — Lean
    rutinaRio('#014', 'RÍO Press F — Pecho + Hombros', 'Lean', 'press', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda lateral walk', 2, '15'), ej('Rotación torácica', 2, '10')]),
      circuito(2, 'PIERNAS', [ej('Saltos al cajón', 3, '8'), ej('Sentadilla búlgara', 3, '8')]),
      circuito(3, 'PECHO·HOMBROS', [ej('TRX chest press', 3, '15'), ej('Dips en paralelas', 3, 'AMRAP')]),
      circuito(4, 'HOMBROS·TRÍCEPS', [ej('Press militar con kettlebell', 3, '10'), ej('Extensión de tríceps con banda', 3, '12')]),
      circuito(5, 'CORE+CARDIO', [ej('Ab wheel', 3, '10'), ej('Bear crawl', 4, '10m'), ej('Pasadas de velocidad', 4, '30m')]),
      circuito(6, 'HIIT', [ej('Jumping jacks', 3, '30'), ej('Sentadilla con salto', 3, '10'), ej('Caminata a plancha', 3, '8')]),
    ]),
    // RÍO Press G — Lean
    rutinaRio('#015', 'RÍO Press G — Pecho', 'Lean', 'press', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda press de pecho', 2, '15'), ej('Cat-cow', 2, '10')]),
      circuito(2, 'PIERNAS', [ej('Sentadilla con salto', 3, '10'), ej('Zancadas con kettlebell', 3, '10')]),
      circuito(3, 'PECHO', [ej('Flexiones diamante', 3, '12'), ej('Flexiones', 3, '10')]),
      circuito(4, 'HOMBROS', [ej('Arnold press con kettlebell', 3, '10'), ej('TRX face pull', 3, '12')]),
      circuito(5, 'CORE+CARDIO', [ej('Hollow body', 3, '30s'), ej('Ab wheel', 3, '10'), ej('Burpees', 3, '6')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 4, '30m'), ej('Mountain climbers', 3, '20'), ej('Burpees', 3, '8')]),
    ]),

    // ── NAT RIO ROUTINES (15) ──────────────────────────────────────────────
    // RÍO Pull A — Nat
    rutinaRio('#016', 'RÍO Pull A — Nat', 'Nat', 'pull', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda lateral walk', 2, '15'), ej('Banda dislocates', 2, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Sentadilla búlgara', 3, '12'), ej('Empuje de cadera en cajon', 3, '15')]),
      circuito(3, 'ESPALDA', [ej('TRX row', 3, '15'), ej('Dominadas australianas', 3, '12')]),
      circuito(4, 'ESPALDA ALT', [ej('Remo alto en TRX', 3, '12'), ej('Banda pull-apart', 3, '20')]),
      circuito(5, 'CORE+CARDIO', [ej('Ab wheel', 3, '8'), ej('Mountain climbers', 3, '20'), ej('Pasadas de velocidad', 4, '15m')]),
      circuito(6, 'HIIT', [ej('Mountain climbers', 3, '20'), ej('Burpees', 3, '6'), ej('Jumping jacks', 3, '25')]),
    ]),
    // RÍO Pull B — Nat
    rutinaRio('#017', 'RÍO Pull B — Nat', 'Nat', 'pull', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Activación glúteo con loop band', 2, '15'), ej('Rotación torácica', 2, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Empuje de cadera en cajon', 3, '15'), ej('Sentadilla sumo', 3, '12')]),
      circuito(3, 'ESPALDA', [ej('TRX row', 3, '15'), ej('Dominadas australianas', 3, '10')]),
      circuito(4, 'BÍCEPS', [ej('Curl de bíceps con kettlebell', 3, '12'), ej('Banda curl biceps', 3, '15')]),
      circuito(5, 'CORE+CARDIO', [ej('Hollow body', 3, '25s'), ej('Dead bug', 3, '10'), ej('Jumping jacks', 3, '25')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 4, '15m'), ej('Sentadilla con salto', 3, '8'), ej('Caminata a plancha', 3, '6')]),
    ]),
    // RÍO Pull C — Nat
    rutinaRio('#018', 'RÍO Pull C — Nat', 'Nat', 'pull', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('TRX face pull', 2, '15'), ej('Movilidad de cadera', 2, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Patada de glúteo con tobillera', 3, '15'), ej('Zancadas con kettlebell', 3, '10')]),
      circuito(3, 'ESPALDA', [ej('TRX row', 3, '12'), ej('Dominadas australianas', 3, '12')]),
      circuito(4, 'ESPALDA ALT', [ej('Banda pull-apart', 3, '20'), ej('Remo alto en TRX', 3, '12')]),
      circuito(5, 'CORE+CARDIO', [ej('Ab wheel', 3, '8'), ej('Burpees', 3, '6'), ej('Pasadas de velocidad', 4, '15m')]),
      circuito(6, 'HIIT', [ej('Burpees', 3, '6'), ej('Bear crawl', 3, '8m'), ej('Jumping jacks', 3, '25')]),
    ]),
    // RÍO Pull D — Nat
    rutinaRio('#019', 'RÍO Pull D — Nat', 'Nat', 'pull', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda lateral walk', 2, '15'), ej('Cat-cow', 2, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Empuje de cadera en cajon', 3, '15'), ej('Peso muerto a una pierna con kettlebell', 3, '10')]),
      circuito(3, 'ESPALDA', [ej('TRX row', 3, '15'), ej('Dominadas australianas', 3, '12')]),
      circuito(4, 'BÍCEPS', [ej('Curl de bíceps con kettlebell', 3, '12'), ej('Banda curl biceps', 3, '1')]),
      circuito(5, 'CORE+CARDIO', [ej('Plancha con elevación alternada', 3, '10'), ej('Ab wheel', 3, '8'), ej('Mountain climbers', 3, '20')]),
      circuito(6, 'HIIT', [ej('Mountain climbers', 3, '20'), ej('Jumping jacks', 3, '25'), ej('Sentadilla con salto', 3, '8')]),
    ]),
    // RÍO Pull E — Nat
    rutinaRio('#020', 'RÍO Pull E — Nat', 'Nat', 'pull', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Loop band abducción parada', 2, '15'), ej('Rotación torácica', 2, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Sentadilla sumo', 3, '15'), ej('Empuje de cadera en cajon', 3, '15')]),
      circuito(3, 'ESPALDA', [ej('TRX row', 3, '15'), ej('TRX face pull', 3, '15')]),
      circuito(4, 'ESPALDA ALT', [ej('Remo alto en TRX', 3, '12'), ej('Banda pull-apart', 3, '20')]),
      circuito(5, 'CORE+CARDIO', [ej('Hollow body', 3, '25s'), ej('Ab wheel', 3, '8'), ej('Pasadas de velocidad', 4, '15m')]),
      circuito(6, 'HIIT', [ej('Burpees', 3, '6'), ej('Mountain climbers', 3, '15'), ej('Pasadas de velocidad', 4, '15m')]),
    ]),
    // RÍO Pull F — Nat
    rutinaRio('#021', 'RÍO Pull F — Nat', 'Nat', 'pull', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda lateral walk', 2, '15'), ej('Hip 90/90 mobility', 2, '8')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Patada de glúteo con tobillera', 3, '20'), ej('Sentadilla sumo', 3, '12')]),
      circuito(3, 'ESPALDA', [ej('Dominadas australianas', 3, '15'), ej('TRX row', 3, '12')]),
      circuito(4, 'BÍCEPS', [ej('Curl de bíceps con kettlebell', 3, '12'), ej('Banda curl biceps', 3, '15')]),
      circuito(5, 'CORE+CARDIO', [ej('L-sit en paralelas', 3, '15s'), ej('Ab wheel', 3, '8'), ej('Jumping jacks', 3, '25')]),
      circuito(6, 'HIIT', [ej('Jumping jacks', 3, '25'), ej('Bear crawl', 3, '8m'), ej('Burpees', 3, '6')]),
    ]),
    // RÍO Pull G — Nat
    rutinaRio('#022', 'RÍO Pull G — Nat', 'Nat', 'pull', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda dislocates', 2, '15'), ej('Activación glúteo con loop band', 2, '15')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Zancadas con kettlebell', 3, '10'), ej('Empuje de cadera en cajon', 3, '15')]),
      circuito(3, 'ESPALDA', [ej('TRX row', 3, '12'), ej('Remo alto en TRX', 3, '15')]),
      circuito(4, 'ESPALDA ALT', [ej('Dominadas australianas', 3, '12'), ej('Banda pull-apart', 3, '20')]),
      circuito(5, 'CORE+CARDIO', [ej('Ab wheel', 3, '8'), ej('Bear crawl', 4, '8m'), ej('Pasadas de velocidad', 4, '15m')]),
      circuito(6, 'HIIT', [ej('Sentadilla con salto', 3, '8'), ej('Mountain climbers', 3, '20'), ej('Saltos al cajón', 3, '6')]),
    ]),
    // RÍO Pull H — Nat
    rutinaRio('#023', 'RÍO Pull H — Nat', 'Nat', 'pull', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Activación glúteo con loop band', 2, '15'), ej('Rotación torácica', 2, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Step-up en banco', 3, '10'), ej('Sentadilla búlgara', 3, '10')]),
      circuito(3, 'ESPALDA', [ej('TRX row', 3, '15'), ej('Dominadas australianas', 3, '12')]),
      circuito(4, 'BÍCEPS', [ej('Curl de bíceps con kettlebell', 3, '12'), ej('Banda curl biceps', 3, '15')]),
      circuito(5, 'CORE+CARDIO', [ej('Hollow body', 3, '25s'), ej('Ab wheel', 3, '8'), ej('Mountain climbers', 3, '20')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 4, '15m'), ej('Jumping jacks', 3, '25'), ej('Burpees', 3, '6')]),
    ]),
    // RÍO Press A — Nat
    rutinaRio('#024', 'RÍO Press A — Nat', 'Nat', 'press', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda press de pecho', 2, '15'), ej('Rotación de hombros', 2, '10')]),
      circuito(2, 'PIERNAS·CUÁDRICEPS', [ej('Sentadilla sumo', 3, '15'), ej('Zancadas con kettlebell', 3, '10')]),
      circuito(3, 'PECHO', [ej('Flexiones inclinadas', 3, '12'), ej('TRX chest press', 3, '12')]),
      circuito(4, 'HOMBROS', [ej('Press militar con kettlebell', 3, '12'), ej('Vuelos laterales', 3, '15')]),
      circuito(5, 'CORE+CARDIO', [ej('Plancha', 3, '45s'), ej('Ab wheel', 3, '8'), ej('Hollow body', 3, '25s')]),
      circuito(6, 'HIIT', [ej('Mountain climbers', 3, '20'), ej('Burpees', 3, '6'), ej('Jumping jacks', 3, '25')]),
    ]),
    // RÍO Press B — Nat
    rutinaRio('#025', 'RÍO Press B — Nat', 'Nat', 'press', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Rotación torácica', 2, '10'), ej('Movilidad de hombros', 2, '10')]),
      circuito(2, 'PIERNAS·CUÁDRICEPS', [ej('Step-up en banco', 3, '10'), ej('Sentadilla sumo', 3, '12')]),
      circuito(3, 'PECHO', [ej('Flexiones', 3, '10'), ej('TRX chest press', 3, '12')]),
      circuito(4, 'HOMBROS·TRÍCEPS', [ej('Press militar con kettlebell', 3, '12'), ej('Fondos en banco', 3, '15')]),
      circuito(5, 'CORE+CARDIO', [ej('Ab wheel', 3, '8'), ej('Mountain climbers', 3, '20'), ej('Bear crawl', 4, '8m')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 4, '15m'), ej('Sentadilla con salto', 3, '8'), ej('Caminata a plancha', 3, '6')]),
    ]),
    // RÍO Press C — Nat
    rutinaRio('#026', 'RÍO Press C — Nat', 'Nat', 'press', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda lateral walk', 2, '15'), ej('Banda pull-apart', 2, '15')]),
      circuito(2, 'PIERNAS·CUÁDRICEPS', [ej('Sentadilla búlgara', 3, '10'), ej('Step-up en banco', 3, '10')]),
      circuito(3, 'PECHO', [ej('Flexiones', 3, '15'), ej('TRX chest press', 3, '12')]),
      circuito(4, 'HOMBROS', [ej('Arnold press con kettlebell', 3, '10'), ej('TRX face pull', 3, '12')]),
      circuito(5, 'CORE', [ej('L-sit en paralelas', 3, '15s'), ej('Dead bug', 3, '10'), ej('Plancha', 3, '40s')]),
      circuito(6, 'HIIT', [ej('Burpees', 3, '6'), ej('Bear crawl', 3, '8m'), ej('Jumping jacks', 3, '25')]),
    ]),
    // RÍO Press D — Nat
    rutinaRio('#027', 'RÍO Press D — Nat', 'Nat', 'press', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda dislocates', 2, '15'), ej('Rotación torácica', 2, '10')]),
      circuito(2, 'PIERNAS', [ej('Sentadilla con salto', 3, '8'), ej('Zancadas con kettlebell', 3, '10')]),
      circuito(3, 'PECHO·HOMBROS', [ej('Flexiones', 3, '10'), ej('Press militar con kettlebell', 3, '12')]),
      circuito(4, 'TRÍCEPS', [ej('Fondos en banco', 3, '15'), ej('Extensión de tríceps con banda', 3, '15')]),
      circuito(5, 'CORE+CARDIO', [ej('Ab wheel', 3, '8'), ej('Pasadas de velocidad', 4, '15m'), ej('Burpees', 3, '6')]),
      circuito(6, 'HIIT', [ej('Mountain climbers', 3, '20'), ej('Jumping jacks', 3, '25'), ej('Sentadilla con salto', 3, '8')]),
    ]),
    // RÍO Press E — Nat
    rutinaRio('#028', 'RÍO Press E — Nat', 'Nat', 'press', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda press de pecho', 2, '15'), ej('Movilidad de hombros', 2, '10')]),
      circuito(2, 'PIERNAS·CUÁDRICEPS', [ej('Sentadilla sumo', 3, '15'), ej('Step-up en banco', 3, '10')]),
      circuito(3, 'PECHO', [ej('Flexiones', 3, '15'), ej('TRX chest press', 3, '12')]),
      circuito(4, 'HOMBROS', [ej('Press militar con kettlebell', 3, '12'), ej('Vuelos laterales', 3, '15')]),
      circuito(5, 'CORE+CARDIO', [ej('Hollow body', 3, '25s'), ej('Plancha lateral', 3, '20s'), ej('Ab wheel', 3, '8')]),
      circuito(6, 'HIIT', [ej('Burpees', 3, '6'), ej('Mountain climbers', 3, '15'), ej('Pasadas de velocidad', 4, '15m')]),
    ]),
    // RÍO Press F — Nat
    rutinaRio('#029', 'RÍO Press F — Nat', 'Nat', 'press', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda lateral walk', 2, '15'), ej('Rotación torácica', 2, '10')]),
      circuito(2, 'PIERNAS', [ej('Saltos al cajón', 3, '6'), ej('Sentadilla sumo', 3, '12')]),
      circuito(3, 'PECHO', [ej('TRX chest press', 3, '15'), ej('Flexiones diamante', 3, '10')]),
      circuito(4, 'HOMBROS·TRÍCEPS', [ej('Press militar con kettlebell', 3, '12'), ej('Extensión de tríceps con banda', 3, '12')]),
      circuito(5, 'CORE+CARDIO', [ej('Ab wheel', 3, '8'), ej('Bear crawl', 4, '8m'), ej('Pasadas de velocidad', 4, '15m')]),
      circuito(6, 'HIIT', [ej('Jumping jacks', 3, '25'), ej('Bear crawl', 3, '8m'), ej('Burpees', 3, '6')]),
    ]),
    // RÍO Press G — Nat
    rutinaRio('#030', 'RÍO Press G — Nat', 'Nat', 'press', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda press de pecho', 2, '15'), ej('Cat-cow', 2, '10')]),
      circuito(2, 'PIERNAS', [ej('Sentadilla con salto', 3, '8'), ej('Zancadas con kettlebell', 3, '10')]),
      circuito(3, 'PECHO', [ej('Flexiones', 3, '10'), ej('Flexiones inclinadas', 3, '12')]),
      circuito(4, 'HOMBROS', [ej('Arnold press con kettlebell', 3, '10'), ej('TRX face pull', 3, '12')]),
      circuito(5, 'CORE+CARDIO', [ej('Hollow body', 3, '25s'), ej('Ab wheel', 3, '8'), ej('Burpees', 3, '6')]),
      circuito(6, 'HIIT', [ej('Sentadilla con salto', 3, '8'), ej('Mountain climbers', 3, '20'), ej('Saltos al cajón', 3, '6')]),
    ]),
  ];
}

function rutinaCasa(numero, nombre, usuario, foco, semana_ciclo, circuitos) {
  return {
    id: uid(), numero, nombre, usuario,
    lugar: 'CASA', tipo: 'cross', foco, semana_ciclo,
    circuitos, updatedAt: new Date().toISOString(), pendingSync: false,
  };
}

function createCasaRoutines() {
  // Equipamiento CASA: chaleco de peso, kettlebells 8k/12k, tobilleras 4kg,
  // platos rucking 4k, TRX, bandas BC Strength, bandas elásticas, ab wheel
  return [
    // ── LEAN PRESS ─────────────────────────────────────────
    rutinaCasa('#C01', 'Casa Press A — Lean', 'Lean', 'press', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('TRX face pull', 3, '15'), ej('Banda dislocates', 3, '10')]),
      circuito(2, 'PIERNAS·CUÁDRICEPS', [ej('Sentadilla goblet con kettlebell', 3, '12'), ej('Zancadas con chaleco de peso', 3, '10')]),
      circuito(3, 'PECHO', [ej('Flexiones con chaleco', 3, '12'), ej('TRX chest press', 3, '12')]),
      circuito(4, 'HOMBROS·TRÍCEPS', [ej('Press militar con kettlebell', 3, '10'), ej('Fondos en banco con chaleco', 3, '12')]),
      circuito(5, 'CORE', [ej('Ab wheel', 3, '10'), ej('Plancha con chaleco', 3, '30s')]),
      circuito(6, 'HIIT', [ej('Mountain climbers', 3, '20'), ej('Burpees', 3, '8'), ej('Jumping jacks', 3, '30')]),
    ]),
    rutinaCasa('#C02', 'Casa Press B — Lean', 'Lean', 'press', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Rotación de hombros con banda', 3, '10'), ej('Movilidad de hombros', 3, '10')]),
      circuito(2, 'PIERNAS·CUÁDRICEPS', [ej('Zancadas con chaleco de peso', 3, '10'), ej('Sentadilla sumo con kettlebell', 3, '12')]),
      circuito(3, 'PECHO·HOMBROS', [ej('Flexiones explosivas', 3, '8'), ej('Banda press de pecho', 3, '15')]),
      circuito(4, 'HOMBROS', [ej('Arnold press con kettlebell', 3, '10'), ej('Vuelos laterales con banda', 3, '12')]),
      circuito(5, 'CORE', [ej('Hollow body con peso', 3, '30s'), ej('Plancha con elevación alternada', 3, '10')]),
      circuito(6, 'HIIT', [ej('Burpees con chaleco', 3, '8'), ej('Jumping jacks', 3, '30'), ej('Mountain climbers', 3, '20')]),
    ]),
    rutinaCasa('#C03', 'Casa Press C — Lean', 'Lean', 'press', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('TRX face pull', 3, '15'), ej('Rotación de hombros con banda', 3, '10')]),
      circuito(2, 'PIERNAS·CUÁDRICEPS', [ej('Sentadilla goblet con kettlebell', 3, '10'), ej('Sentadilla con salto con chaleco', 3, '8')]),
      circuito(3, 'PECHO', [ej('TRX chest press', 3, '12'), ej('Flexiones diamante', 3, '10')]),
      circuito(4, 'HOMBROS·TRÍCEPS', [ej('Press militar con kettlebell', 3, '10'), ej('Extensión de tríceps con banda', 3, '15')]),
      circuito(5, 'CORE', [ej('Ab wheel', 3, '10'), ej('Plancha con chaleco', 3, '30s')]),
      circuito(6, 'HIIT', [ej('Burpees con chaleco', 3, '8'), ej('Mountain climbers', 3, '20'), ej('Jumping jacks con chaleco', 3, '30')]),
    ]),

    // ── LEAN PULL ──────────────────────────────────────────
    rutinaCasa('#C04', 'Casa Pull A — Lean', 'Lean', 'pull', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda lateral walk', 3, '15'), ej('Rotación torácica', 3, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Sentadilla búlgara con kettlebell', 3, '10'), ej('Peso muerto a una pierna con kettlebell', 3, '10')]),
      circuito(3, 'ESPALDA', [ej('Dominadas australianas con chaleco', 3, '12'), ej('TRX row', 3, '12')]),
      circuito(4, 'BÍCEPS', [ej('Curl de bíceps con kettlebell', 3, '12'), ej('Banda curl biceps', 3, '15')]),
      circuito(5, 'CORE', [ej('Ab wheel', 3, '10'), ej('Hollow body con peso', 3, '30s')]),
      circuito(6, 'HIIT', [ej('Bear crawl con chaleco', 4, '8m'), ej('Pasadas de velocidad', 4, '20m'), ej('Burpees', 3, '8')]),
    ]),
    rutinaCasa('#C05', 'Casa Pull B — Lean', 'Lean', 'pull', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('TRX face pull', 3, '15'), ej('Movilidad de cadera', 3, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Peso muerto a una pierna con kettlebell', 3, '10'), ej('Zancadas con chaleco de peso', 3, '10')]),
      circuito(3, 'ESPALDA', [ej('TRX row', 3, '12'), ej('Remo con kettlebell', 3, '10')]),
      circuito(4, 'ESPALDA ALT', [ej('Dominadas australianas con chaleco', 3, '12'), ej('Banda pull-apart', 3, '20')]),
      circuito(5, 'CORE', [ej('Plancha lateral con chaleco', 3, '20s'), ej('Ab wheel', 3, '10')]),
      circuito(6, 'HIIT', [ej('Jumping jacks con chaleco', 3, '30'), ej('Mountain climbers', 3, '20'), ej('Burpees con chaleco', 3, '8')]),
    ]),
    rutinaCasa('#C06', 'Casa Pull C — Lean', 'Lean', 'pull', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda face pull', 3, '15'), ej('Hip 90/90 mobility', 3, '8')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Empuje de cadera con plato rucking', 3, '12'), ej('Sentadilla búlgara con kettlebell', 3, '10')]),
      circuito(3, 'ESPALDA', [ej('Remo con kettlebell', 3, '10'), ej('Dominadas australianas con chaleco', 3, '12')]),
      circuito(4, 'BÍCEPS', [ej('Curl martillo con kettlebell', 3, '12'), ej('Banda curl biceps', 3, '15')]),
      circuito(5, 'CORE', [ej('Dead bug', 3, '12'), ej('Ab wheel', 3, '10')]),
      circuito(6, 'HIIT', [ej('Mountain climbers con chaleco', 3, '20'), ej('Pasadas de velocidad', 4, '20m'), ej('Jumping jacks', 3, '30')]),
    ]),

    // ── NAT PRESS ──────────────────────────────────────────
    rutinaCasa('#C01', 'Casa Press A — Nat', 'Nat', 'press', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Activación glúteo con loop band', 3, '15'), ej('Rotación de hombros con banda', 3, '15')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Empuje de cadera con plato rucking', 3, '15'), ej('Sentadilla goblet con kettlebell', 3, '12')]),
      circuito(3, 'PECHO', [ej('TRX chest press', 3, '12'), ej('Flexiones inclinadas', 3, '10')]),
      circuito(4, 'HOMBROS', [ej('Press militar con kettlebell', 3, '10'), ej('Vuelos laterales con banda', 3, '12')]),
      circuito(5, 'CORE', [ej('Ab wheel', 3, '8'), ej('Plancha', 3, '25s')]),
      circuito(6, 'HIIT', [ej('Jumping jacks', 3, '25'), ej('Mountain climbers', 3, '15'), ej('Burpees', 3, '6')]),
    ]),
    rutinaCasa('#C02', 'Casa Press B — Nat', 'Nat', 'press', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda lateral walk', 3, '15'), ej('Movilidad de hombros', 3, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Patada de glúteo con tobillera 4k', 3, '15'), ej('Zancadas con kettlebell', 3, '10')]),
      circuito(3, 'PECHO·HOMBROS', [ej('Banda press de pecho', 3, '15'), ej('Flexiones', 3, '10')]),
      circuito(4, 'HOMBROS·TRÍCEPS', [ej('Arnold press con kettlebell', 3, '10'), ej('Fondos en banco', 3, '12')]),
      circuito(5, 'CORE', [ej('Hollow body con peso', 3, '25s'), ej('Ab wheel', 3, '8')]),
      circuito(6, 'HIIT', [ej('Burpees', 3, '6'), ej('Jumping jacks', 3, '25'), ej('Mountain climbers', 3, '15')]),
    ]),
    rutinaCasa('#C03', 'Casa Press C — Nat', 'Nat', 'press', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Activación glúteo con loop band', 3, '15'), ej('Banda dislocates', 3, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Empuje de cadera con plato rucking', 3, '15'), ej('Sentadilla sumo con kettlebell', 3, '12')]),
      circuito(3, 'PECHO', [ej('Flexiones', 3, '10'), ej('TRX chest press', 3, '12')]),
      circuito(4, 'HOMBROS·TRÍCEPS', [ej('Press militar con kettlebell', 3, '10'), ej('Extensión de tríceps con banda', 3, '15')]),
      circuito(5, 'CORE', [ej('Ab wheel', 3, '8'), ej('Plancha con elevación alternada', 3, '8')]),
      circuito(6, 'HIIT', [ej('Mountain climbers', 3, '20'), ej('Burpees', 3, '6'), ej('Jumping jacks', 3, '25')]),
    ]),

    // ── NAT PULL ───────────────────────────────────────────
    rutinaCasa('#C04', 'Casa Pull A — Nat', 'Nat', 'pull', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Activación glúteo con loop band', 3, '15'), ej('Rotación torácica', 3, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Sentadilla búlgara con kettlebell', 3, '12'), ej('Empuje de cadera con plato rucking', 3, '15')]),
      circuito(3, 'ESPALDA', [ej('TRX row', 3, '15'), ej('Dominadas australianas', 3, '12')]),
      circuito(4, 'BÍCEPS', [ej('Curl de bíceps con kettlebell', 3, '12'), ej('Banda curl biceps', 3, '15')]),
      circuito(5, 'CORE', [ej('Ab wheel', 3, '8'), ej('Dead bug', 3, '10')]),
      circuito(6, 'HIIT', [ej('Jumping jacks', 3, '25'), ej('Mountain climbers', 3, '15'), ej('Burpees', 3, '6')]),
    ]),
    rutinaCasa('#C05', 'Casa Pull B — Nat', 'Nat', 'pull', 2, [
      circuito(1, 'ACTIVACIÓN', [ej('TRX face pull', 3, '15'), ej('Movilidad de cadera', 3, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Patada de glúteo con tobillera 4k', 3, '20'), ej('Peso muerto a una pierna con kettlebell', 3, '10')]),
      circuito(3, 'ESPALDA', [ej('TRX row', 3, '15'), ej('Remo con kettlebell', 3, '10')]),
      circuito(4, 'ESPALDA ALT', [ej('Banda pull-apart', 3, '20'), ej('Dominadas australianas', 3, '10')]),
      circuito(5, 'CORE', [ej('Plancha con elevación alternada', 3, '8'), ej('Ab wheel', 3, '8')]),
      circuito(6, 'HIIT', [ej('Mountain climbers', 3, '20'), ej('Jumping jacks', 3, '25'), ej('Pasadas de velocidad', 3, '15m')]),
    ]),
    rutinaCasa('#C06', 'Casa Pull C — Nat', 'Nat', 'pull', 1, [
      circuito(1, 'ACTIVACIÓN', [ej('Banda lateral walk', 3, '15'), ej('Cat-cow', 3, '10')]),
      circuito(2, 'PIERNAS·GLÚTEOS', [ej('Loop band abducción parada', 3, '15'), ej('Sentadilla goblet con kettlebell', 3, '12')]),
      circuito(3, 'ESPALDA', [ej('Dominadas australianas', 3, '15'), ej('TRX row', 3, '12')]),
      circuito(4, 'BÍCEPS', [ej('Curl de bíceps con kettlebell', 3, '12'), ej('Curl martillo con kettlebell', 3, '12')]),
      circuito(5, 'CORE', [ej('Hollow body', 3, '25s'), ej('Ab wheel', 3, '8')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 4, '15m'), ej('Mountain climbers', 3, '20'), ej('Burpees', 3, '6')]),
    ]),
  ];
}

function rutinaRecovery(numero, nombre, usuario, semana_ciclo, circuitos) {
  return {
    id: uid(), numero, nombre, usuario,
    lugar: 'RECOVERY', tipo: 'cross', foco: 'recovery', semana_ciclo,
    circuitos, updatedAt: new Date().toISOString(), pendingSync: false,
  };
}

function createRecoveryRoutines() {
  // Recovery post-cirugía ósea (injerto + membrana + tachuelas)
  // Reglas: sin Valsalva, sin inversiones, sin presión abdominal alta,
  // cargas livianas 40-50%, respiración continua.
  return [
    // Lunes 13 — Movilidad y activación suave
    rutinaRecovery('#R01', 'Recovery 1 · Movilidad y activación', 'Nat', 1, [
      circuito(1, 'MOVILIDAD', [ej('Cat-cow', 3, '10'), ej('Yoga suave', 1, '8 min', { tipo: 'movilidad' })]),
      circuito(2, 'ACTIVACIÓN SUAVE', [ej('Puente de glúteos', 3, '12'), ej('Bird-dog', 3, '10')]),
      circuito(3, 'PIERNAS LIVIANAS', [ej('Sentadilla corporal', 3, '12'), ej('Calf raises', 3, '15')]),
      circuito(4, 'CORE POSTURAL', [ej('Plancha isométrica', 3, '20s'), ej('Face pull con banda', 3, '15')]),
    ]),
    // Martes 14 — Glúteos y piernas sin carga axial
    rutinaRecovery('#R02', 'Recovery 2 · Glúteos y piernas suave', 'Nat', 1, [
      circuito(1, 'MOVILIDAD', [ej('Cat-cow', 2, '10'), ej('Rotación de hombros con banda', 2, '12')]),
      circuito(2, 'GLÚTEOS', [ej('Puente de glúteos una pierna', 3, '10'), ej('Extensión de cadera en 4 puntos', 3, '12')]),
      circuito(3, 'PIERNAS', [ej('Estocadas estáticas', 3, '10'), ej('Hip hinge corporal', 3, '12')]),
      circuito(4, 'CORE SUAVE', [ej('Plancha lateral', 3, '15s'), ej('Bird-dog', 3, '10')]),
    ]),
    // Miércoles 15 — Core, movilidad y tren superior muy liviano
    rutinaRecovery('#R03', 'Recovery 3 · Core y movilidad', 'Nat', 1, [
      circuito(1, 'MOVILIDAD', [ej('Yoga suave', 1, '10 min', { tipo: 'movilidad' })]),
      circuito(2, 'CORE SIN PRESIÓN', [ej('Plancha isométrica', 3, '20s'), ej('Bird-dog', 3, '10'), ej('Cat-cow', 3, '8')]),
      circuito(3, 'POSTURA', [ej('Face pull con banda', 3, '15'), ej('Banda pull-apart', 3, '15')]),
      circuito(4, 'ACTIVACIÓN PIERNA', [ej('Sentadilla corporal', 3, '12'), ej('Puente de glúteos', 3, '15')]),
    ]),
    // Jueves 16 — Tren superior liviano con kettlebell chica
    rutinaRecovery('#R04', 'Recovery 4 · Tren superior liviano', 'Nat', 1, [
      circuito(1, 'MOVILIDAD', [ej('Rotación de hombros con banda', 3, '12'), ej('Cat-cow', 2, '10')]),
      circuito(2, 'HOMBROS SUAVE', [ej('Press militar suave con kettlebell', 3, '10'), ej('Face pull con banda', 3, '15')]),
      circuito(3, 'BRAZOS', [ej('Curl de bíceps suave', 3, '12'), ej('Banda curl biceps', 3, '15')]),
      circuito(4, 'GLÚTEOS', [ej('Puente de glúteos', 3, '15'), ej('Extensión de cadera en 4 puntos', 3, '12')]),
    ]),
    // Viernes 17 — Integrativa suave cierre de semana
    rutinaRecovery('#R05', 'Recovery 5 · Integrativa suave', 'Nat', 1, [
      circuito(1, 'MOVILIDAD', [ej('Cat-cow', 3, '10'), ej('Rotación de hombros con banda', 2, '12')]),
      circuito(2, 'PIERNAS · GLÚTEOS', [ej('Sentadilla corporal', 3, '12'), ej('Puente de glúteos una pierna', 3, '10')]),
      circuito(3, 'CORE', [ej('Plancha isométrica', 3, '25s'), ej('Plancha lateral', 3, '15s'), ej('Bird-dog', 3, '10')]),
      circuito(4, 'CIERRE', [ej('Face pull con banda', 3, '15'), ej('Yoga suave', 1, '6 min', { tipo: 'movilidad' })]),
    ]),
  ];
}

function assignCalendar(rutinas, startDate, calendarStart) {
  const overrides = { Lean: {}, Nat: {} };
  const today = new Date(calendarStart || startDate);
  today.setHours(0, 0, 0, 0);

  for (const usuario of ['Lean', 'Nat']) {
    // SPORT_FITNESS for Mon/Wed/Fri
    const sfRutinas = rutinas.filter(r => r.usuario === usuario && r.lugar === 'SPORT_FITNESS');
    const sfPress = sfRutinas.filter(r => r.foco === 'press');
    const sfPull = sfRutinas.filter(r => r.foco === 'pull');
    let sfPressIdx = 0, sfPullIdx = 0;

    // RIO for Saturday
    const rioRutinas = rutinas.filter(r => r.usuario === usuario && r.lugar === 'RIO');
    const rioPress = rioRutinas.filter(r => r.foco === 'press');
    const rioPull = rioRutinas.filter(r => r.foco === 'pull');
    let rioPressIdx = 0, rioPullIdx = 0;

    // 8 weeks = 56 days
    for (let dayOffset = 0; dayOffset < 56; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);
      const dow = getISODayOfWeek(date);
      const cycleWeek = getCycleWeek(date, startDate);

      // Mon(1), Wed(3), Fri(5) → SPORT_FITNESS
      if (dow === 1 || dow === 3 || dow === 5) {
        const foco = getFocusForDay(dow, cycleWeek);
        if (!foco) continue;

        let r;
        if (foco === 'press') {
          r = sfPress[sfPressIdx % sfPress.length];
          sfPressIdx++;
        } else {
          r = sfPull[sfPullIdx % sfPull.length];
          sfPullIdx++;
        }
        overrides[usuario][formatDateISO(date)] = { rutinaId: r.id, tipo: foco };
      }

      // Saturday(6) → RIO (inverse foco of Friday)
      if (dow === 6 && rioRutinas.length > 0) {
        const rioFoco = getRioFocusForSaturday(cycleWeek);
        let r;
        if (rioFoco === 'press') {
          if (rioPress.length > 0) {
            r = rioPress[rioPressIdx % rioPress.length];
            rioPressIdx++;
          }
        } else {
          if (rioPull.length > 0) {
            r = rioPull[rioPullIdx % rioPull.length];
            rioPullIdx++;
          }
        }
        if (r) {
          overrides[usuario][formatDateISO(date)] = { rutinaId: r.id, tipo: rioFoco, lugar: 'RIO' };
        }
      }
    }
  }

  return overrides;
}

async function loadBackup() {
  // Try local first (works in dev and deployed), then remote fallback
  for (const url of [BACKUP_URL_LOCAL, BACKUP_URL_REMOTE]) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log(`[Seed] Backup loaded from ${url}`);
      return data;
    } catch (e) {
      console.warn(`[Seed] Backup not available at ${url}`, e.message);
    }
  }
  console.warn('[Seed] No backup available, starting clean');
  return null;
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

  // Rutinas URUGUAY only from backup (RIO routines are now generated by createRioRoutines)
  if (backup.rutinas_rio_uruguay) {
    const existing = store.getAll(store.KEYS.rutinas);
    const existingIds = existing.filter(r => r.lugar === 'URUGUAY').map(r => r.id);

    // Deduplicate by usuario+numero (keep first occurrence)
    const seen = new Set();
    const deduped = backup.rutinas_rio_uruguay.filter(r => {
      const key = `${r.usuario}|${r.numero}`;
      if (seen.has(key)) return false;
      seen.add(key);
      // Only keep URUGUAY routines — RIO are now generated fresh
      const isUY = (r.nombre || '').includes('🇺🇾');
      return isUY;
    });

    const newRutinas = deduped
      .map(r => {
        return { ...r, id: r.id || uid(), lugar: 'URUGUAY', tipo: 'cross', pendingSync: false };
      })
      .filter(r => !existingIds.includes(r.id));

    // Renumber: #001, #002, ...
    newRutinas.forEach((r, i) => {
      r.numero = `#${String(i + 1).padStart(3, '0')}`;
    });

    if (newRutinas.length > 0) {
      store.set(store.KEYS.rutinas, [...existing, ...newRutinas]);
      console.log(`[Seed] Loaded ${newRutinas.length} URUGUAY routines (from ${backup.rutinas_rio_uruguay.length} backup entries)`);
    }
  }
}

export function verifyRioSeed() {
  const rutinas = store.getAll(store.KEYS.rutinas);
  const rio = rutinas.filter(r => r.lugar === 'RIO');
  const errors = [];

  if (rio.length !== 30) errors.push(`Total RIO: ${rio.length} (debe ser 30)`);

  const leanRio = rio.filter(r => r.usuario === 'Lean');
  const natRio = rio.filter(r => r.usuario === 'Nat');
  if (leanRio.length !== 15) errors.push(`Lean RIO: ${leanRio.length} (debe ser 15)`);
  if (natRio.length !== 15) errors.push(`Nat RIO: ${natRio.length} (debe ser 15)`);

  // Check pull/press distribution
  const leanPull = leanRio.filter(r => r.foco === 'pull');
  const leanPress = leanRio.filter(r => r.foco === 'press');
  if (leanPull.length !== 8) errors.push(`Lean RIO pull: ${leanPull.length} (debe ser 8)`);
  if (leanPress.length !== 7) errors.push(`Lean RIO press: ${leanPress.length} (debe ser 7)`);

  const natPull = natRio.filter(r => r.foco === 'pull');
  const natPress = natRio.filter(r => r.foco === 'press');
  if (natPull.length !== 8) errors.push(`Nat RIO pull: ${natPull.length} (debe ser 8)`);
  if (natPress.length !== 7) errors.push(`Nat RIO press: ${natPress.length} (debe ser 7)`);

  // Each routine must have 5 circuits
  rio.forEach(r => {
    if (r.circuitos.length !== 5) errors.push(`${r.nombre}: ${r.circuitos.length} circuitos (debe ser 5)`);
    if (!r.circuitos[0] || r.circuitos[0].nombre !== 'ACTIVACIÓN') {
      errors.push(`${r.nombre}: C1 no es ACTIVACIÓN`);
    }
    // All must be tipo 'cross' and lugar 'RIO'
    if (r.tipo !== 'cross') errors.push(`${r.nombre}: tipo=${r.tipo} (debe ser cross)`);
    if (r.lugar !== 'RIO') errors.push(`${r.nombre}: lugar=${r.lugar} (debe ser RIO)`);
    // semana_ciclo must be 1 or 2
    if (r.semana_ciclo !== 1 && r.semana_ciclo !== 2) {
      errors.push(`${r.nombre}: semana_ciclo=${r.semana_ciclo} (debe ser 1 o 2)`);
    }
  });

  if (errors.length) {
    console.error('[RIO Seed ERRORS]', errors);
    return false;
  }
  console.log('[RIO Seed OK] ✅');
  return true;
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

  if (sf.length !== 30) errors.push(`Total SF: ${sf.length} (debe ser 30)`);

  if (errors.length) {
    console.error('[Seed v2 ERRORS]', errors);
    return false;
  }
  console.log('[Seed v2 OK] ✅');
  return true;
}

const SEED_VERSION = '2.29';

// One-time dedup: clean duplicates from previous buggy seed runs
function deduplicateRutinas() {
  const rutinas = store.getAll(store.KEYS.rutinas);
  // Group by dedup key, collect all IDs per group, pick winner
  const groups = new Map(); // dedupKey → { winner, loserIds[] }
  for (const r of rutinas) {
    const dk = `${r.nombre}__${r.usuario}__${r.lugar}`;
    const group = groups.get(dk);
    if (!group) {
      groups.set(dk, { winner: r, loserIds: [] });
    } else {
      const existTs = group.winner.updatedAt || '';
      const curTs = r.updatedAt || '';
      if (curTs > existTs) {
        group.loserIds.push(group.winner.id);
        group.winner = r;
      } else {
        group.loserIds.push(r.id);
      }
    }
  }

  // Build ID remap: loserId → winnerId
  const idRemap = new Map();
  for (const { winner, loserIds } of groups.values()) {
    for (const lid of loserIds) {
      idRemap.set(lid, winner.id);
    }
  }

  if (idRemap.size === 0) return;

  const unique = [...groups.values()].map(g => g.winner);
  store.set(store.KEYS.rutinas, unique);

  // Remap overrides so calendar assignments survive
  const overrides = store.getObj(store.KEYS.overrides);
  let remapped = false;
  for (const usuario of Object.keys(overrides)) {
    const userOv = overrides[usuario];
    for (const date of Object.keys(userOv)) {
      const oldId = userOv[date].rutinaId;
      if (idRemap.has(oldId)) {
        userOv[date].rutinaId = idRemap.get(oldId);
        remapped = true;
      }
    }
  }
  if (remapped) store.set(store.KEYS.overrides, overrides);

  // Remap sesiones so completed days still link to current routines
  const sesiones = store.getAll(store.KEYS.sesiones);
  let sesionesRemapped = false;
  for (const s of sesiones) {
    if (s.rutinaId && idRemap.has(s.rutinaId)) {
      s.rutinaId = idRemap.get(s.rutinaId);
      sesionesRemapped = true;
    }
  }
  if (sesionesRemapped) store.set(store.KEYS.sesiones, sesiones);

  console.log(`[Dedup] ${rutinas.length} → ${unique.length} rutinas, remapped ${idRemap.size} IDs`);
}

function backfillSesionLugar() {
  const sesiones = store.getAll(store.KEYS.sesiones);
  const rutinas = store.getAll(store.KEYS.rutinas);
  let changed = false;
  for (const s of sesiones) {
    if (s.lugar) continue;
    // Try to find lugar from rutina
    if (s.rutinaId) {
      const r = rutinas.find(rt => rt.id === s.rutinaId);
      if (r?.lugar) { s.lugar = r.lugar; changed = true; continue; }
    }
    // Infer from name
    const name = (s.rutinaNombre || '').toUpperCase();
    if (name.includes('RÍO') || name.includes('RIO')) { s.lugar = 'RIO'; changed = true; }
    else if (name.includes('URUGUAY')) { s.lugar = 'URUGUAY'; changed = true; }
    else if (name.includes('CASA')) { s.lugar = 'CASA'; changed = true; }
    else { s.lugar = 'SPORT_FITNESS'; changed = true; }
  }
  if (changed) store.set(store.KEYS.sesiones, sesiones);
}

function rebuildProgresionWithLugar() {
  const sesiones = store.getAll(store.KEYS.sesiones);
  const prog = store.getObj(store.KEYS.progresion);
  // Check if migration needed: any user-level entry with lastWeight (old format)
  let needsMigration = false;
  for (const [, users] of Object.entries(prog)) {
    for (const [, data] of Object.entries(users)) {
      if (data?.lastWeight !== undefined) { needsMigration = true; break; }
    }
    if (needsMigration) break;
  }
  if (!needsMigration) return;

  // Rebuild from sesiones
  const newProg = {};
  const sorted = [...sesiones].sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));
  for (const s of sorted) {
    const lugar = s.lugar || 'SPORT_FITNESS';
    const usuario = s.usuario;
    for (const c of (s.circuitos || [])) {
      for (const e of (c.ejercicios || [])) {
        if (!e.usaPeso) continue;
        const done = (e.seriesData || []).filter(sr => sr.done && sr.peso > 0);
        if (done.length === 0) continue;
        const maxPeso = Math.max(...done.map(sr => sr.peso));
        const allReps = (e.seriesData || []).every(sr => sr.done);
        if (!newProg[e.nombre]) newProg[e.nombre] = {};
        if (!newProg[e.nombre][usuario]) newProg[e.nombre][usuario] = {};
        newProg[e.nombre][usuario][lugar] = {
          lastWeight: maxPeso,
          completedAllReps: allReps,
          lastDate: s.fecha,
        };
      }
    }
  }
  store.set(store.KEYS.progresion, newProg);
  console.log('[Seed] Rebuilt progresion with lugar separation');
}

function repairOverrides() {
  const overrides = store.getObj(store.KEYS.overrides);
  const rutinas = store.getAll(store.KEYS.rutinas);
  const rutinaById = new Map(rutinas.map(r => [r.id, r]));
  let repaired = false;

  for (const usuario of Object.keys(overrides)) {
    const userOv = overrides[usuario];
    for (const date of Object.keys(userOv)) {
      const ov = userOv[date];
      if (!ov?.rutinaId) continue;
      if (rutinaById.has(ov.rutinaId)) continue; // valid

      // Stale rutinaId — try to find a matching rutina
      const lugar = ov.lugar || 'SPORT_FITNESS';
      const tipo = ov.tipo; // 'press' or 'pull'
      const match = rutinas.find(r =>
        r.usuario === usuario && r.lugar === lugar && r.foco === tipo
      );

      if (match) {
        ov.rutinaId = match.id;
        repaired = true;
      } else {
        // No match at all, remove stale override
        delete userOv[date];
        repaired = true;
      }
    }
  }

  if (repaired) {
    store.set(store.KEYS.overrides, overrides);
    console.log('[Seed] Repaired stale override rutinaIds');
  }
}

// Rename old "Peso muerto rumano/sumo" variants in CASA and RIO rutinas
// to "Peso muerto a una pierna con kettlebell" — the gym barbell equivalent
// doesn't scale at home/river with kettlebells 8/12kg, so switch to a
// single-leg version that's challenging even with light load.
function renameHomeDeadliftsToSingleLeg() {
  const rutinas = store.getAll(store.KEYS.rutinas);
  if (!Array.isArray(rutinas) || rutinas.length === 0) return;
  const OLD_NAMES = new Set([
    'Peso muerto rumano',
    'Peso muerto rumano con kettlebell',
    'Peso muerto sumo',
    'Peso muerto con barra',
  ]);
  const NEW_NAME = 'Peso muerto a una pierna con kettlebell';
  let changed = false;
  for (const r of rutinas) {
    if (r.lugar !== 'CASA' && r.lugar !== 'RIO') continue;
    for (const c of (r.circuitos || [])) {
      for (const e of (c.ejercicios || [])) {
        if (OLD_NAMES.has(e.nombre)) {
          e.nombre = NEW_NAME;
          changed = true;
        }
      }
    }
    if (changed) r.updatedAt = new Date().toISOString();
  }
  if (changed) {
    store.set(store.KEYS.rutinas, rutinas);
    console.log('[Seed] renamed peso muerto → una pierna in CASA/RIO rutinas');
  }
}

// Generic exercise rename — updates rutinas, sesiones (historical) and
// progresion keys so references stay consistent across the app.
function renameExercise(oldName, newName) {
  let anyChanged = false;

  const rutinas = store.getAll(store.KEYS.rutinas);
  let rutinasChanged = false;
  for (const r of rutinas || []) {
    for (const c of (r.circuitos || [])) {
      for (const e of (c.ejercicios || [])) {
        if (e.nombre === oldName) {
          e.nombre = newName;
          rutinasChanged = true;
        }
      }
    }
    if (rutinasChanged) r.updatedAt = new Date().toISOString();
  }
  if (rutinasChanged) { store.set(store.KEYS.rutinas, rutinas); anyChanged = true; }

  const sesiones = store.getAll(store.KEYS.sesiones);
  let sesionesChanged = false;
  for (const s of sesiones || []) {
    for (const c of (s.circuitos || [])) {
      for (const e of (c.ejercicios || [])) {
        if (e.nombre === oldName) {
          e.nombre = newName;
          sesionesChanged = true;
        }
      }
    }
  }
  if (sesionesChanged) { store.set(store.KEYS.sesiones, sesiones); anyChanged = true; }

  const prog = store.getObj(store.KEYS.progresion);
  if (prog && prog[oldName]) {
    prog[newName] = { ...(prog[newName] || {}), ...prog[oldName] };
    delete prog[oldName];
    store.set(store.KEYS.progresion, prog);
    anyChanged = true;
  }

  if (anyChanged) console.log(`[Seed] renamed exercise: "${oldName}" → "${newName}"`);
}

function applyExerciseRenames() {
  renameExercise('Hollow body con plato rucking', 'Hollow body con peso');
}

// One-off calendar adjustments that run every boot so they apply without
// needing a full re-seed (which rolls rutina IDs).
function ensureCalendarOverrides() {
  const rutinas = store.getAll(store.KEYS.rutinas);
  const overrides = store.getObj(store.KEYS.overrides);
  if (!overrides.Lean) overrides.Lean = {};
  if (!overrides.Nat) overrides.Nat = {};
  let changed = false;

  // Lean 2026-04-15 (Wed, week 3 pull) → CASA Pull S1 (Nat en recovery)
  const casaLeanPull1 = rutinas.find(r =>
    r.usuario === 'Lean' && r.lugar === 'CASA' && r.foco === 'pull' && r.semana_ciclo === 1
  );
  if (casaLeanPull1) {
    const cur = overrides.Lean['2026-04-15'];
    if (!cur || cur.rutinaId !== casaLeanPull1.id || cur.lugar !== 'CASA') {
      overrides.Lean['2026-04-15'] = { rutinaId: casaLeanPull1.id, tipo: 'pull', lugar: 'CASA' };
      changed = true;
    }
  }

  if (changed) store.set(store.KEYS.overrides, overrides);
}

export async function seedV2() {
  // Always run migrations (idempotent, fast)
  deduplicateRutinas();
  backfillSesionLugar();
  rebuildProgresionWithLugar();
  repairOverrides();
  renameHomeDeadliftsToSingleLeg();
  applyExerciseRenames();
  ensureCalendarOverrides();

  const version = store.getVersion();
  if (version === SEED_VERSION) {
    console.log(`[Seed] Already at v${SEED_VERSION}`);
    return;
  }

  console.log(`[Seed] Initializing v${SEED_VERSION}...`);

  // Create SPORT_FITNESS routines
  const leanRoutines = createLeanRoutines();
  const natRoutines = createNatRoutines();
  const sfRoutines = [...leanRoutines, ...natRoutines];

  // Create RIO routines
  const rioRoutines = createRioRoutines();

  // Create CASA routines
  const casaRoutines = createCasaRoutines();

  // Create RECOVERY routines (post-cirugía, Nat solo)
  const recoveryRoutines = createRecoveryRoutines();

  // Load and migrate backup
  const backup = await loadBackup();
  migrateBackup(backup);

  // Merge: keep URUGUAY intact, replace SPORT_FITNESS, RIO, CASA and RECOVERY
  const existing = store.getAll(store.KEYS.rutinas);
  const uruguayOnly = existing.filter(r => r.lugar === 'URUGUAY');
  store.set(store.KEYS.rutinas, [...uruguayOnly, ...sfRoutines, ...rioRoutines, ...casaRoutines, ...recoveryRoutines]);

  // Assign calendar — plan started March 30, preserve to maintain press/pull cycle
  const PLAN_ORIGIN = '2026-03-30';
  const planStartDate = PLAN_ORIGIN;

  store.set(store.KEYS.plan, { startDate: planStartDate });

  // Generate overrides from this week forward (8 weeks)
  const calendarStart = formatDateISO(getThisMonday());
  const allRutinas = store.getAll(store.KEYS.rutinas);
  const overrides = assignCalendar(allRutinas, planStartDate, calendarStart);

  // Override 2026-04-08 (Wed) with CASA press S2 — indoor training day
  const casaLeanPress2 = casaRoutines.find(r => r.usuario === 'Lean' && r.foco === 'press' && r.semana_ciclo === 2);
  const casaNatPress2 = casaRoutines.find(r => r.usuario === 'Nat' && r.foco === 'press' && r.semana_ciclo === 2);
  if (casaLeanPress2) overrides.Lean['2026-04-08'] = { rutinaId: casaLeanPress2.id, tipo: 'press', lugar: 'CASA' };
  if (casaNatPress2) overrides.Nat['2026-04-08'] = { rutinaId: casaNatPress2.id, tipo: 'press', lugar: 'CASA' };

  // Override 2026-04-10 (Fri) — Lean: CASA pull S2, Nat: rest
  const casaLeanPull2 = casaRoutines.find(r => r.usuario === 'Lean' && r.foco === 'pull' && r.semana_ciclo === 2);
  if (casaLeanPull2) overrides.Lean['2026-04-10'] = { rutinaId: casaLeanPull2.id, tipo: 'pull', lugar: 'CASA' };
  overrides.Nat['2026-04-10'] = { rest: true };

  // Nat Recovery week: 2026-04-13 (Mon) to 2026-04-17 (Fri) post-cirugía
  const recoveryDays = ['2026-04-13', '2026-04-14', '2026-04-15', '2026-04-16', '2026-04-17'];
  recoveryDays.forEach((date, i) => {
    const r = recoveryRoutines[i];
    if (r) overrides.Nat[date] = { rutinaId: r.id, tipo: 'recovery', lugar: 'RECOVERY' };
  });

  // Lean 2026-04-13 (Mon, week 1 press) → CASA Press Lean (Nat entrenando en recovery)
  const casaLeanPress1 = casaRoutines.find(r => r.usuario === 'Lean' && r.foco === 'press' && r.semana_ciclo === 1);
  if (casaLeanPress1) overrides.Lean['2026-04-13'] = { rutinaId: casaLeanPress1.id, tipo: 'press', lugar: 'CASA' };

  // Lean 2026-04-15 (Wed, week 3 pull) → CASA Pull Lean (indoor day)
  const casaLeanPull1 = casaRoutines.find(r => r.usuario === 'Lean' && r.foco === 'pull' && r.semana_ciclo === 1);
  if (casaLeanPull1) overrides.Lean['2026-04-15'] = { rutinaId: casaLeanPull1.id, tipo: 'pull', lugar: 'CASA' };

  store.set(store.KEYS.overrides, overrides);

  // Set version AFTER everything succeeds
  store.setVersion(SEED_VERSION);

  // Verify
  verifySeedV2();
  verifyRioSeed();

  console.log(`[Seed] v${SEED_VERSION} complete`);
}

// Export for testing
export { createLeanRoutines, createNatRoutines, createRioRoutines, createCasaRoutines, createRecoveryRoutines, assignCalendar };
