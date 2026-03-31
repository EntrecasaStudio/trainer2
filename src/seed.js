import { store } from './store.js';
import { formatDateISO, getCycleWeek, getFocusForDay, getISODayOfWeek } from './utils/calendar.js';

const BACKUP_URL_REMOTE = 'https://raw.githubusercontent.com/EntrecasaStudio/trainer2/main/data/backup-v1.json';
const BACKUP_URL_LOCAL = './data/backup-v1.json';

function uid() { return crypto.randomUUID(); }

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
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Burpees', 3, 10), ej('Jumping jacks', 3, 20)]),
    ]),
    // Press B — semana 1 — Banca (estabilidad) → inclinado máquina (guiada)
    rutina('#002', 'Press B — Pecho + Hombros', 'Lean', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Zancadas con mancuernas'), ej('Sumo con barra'), ej('Dead bug', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press de banca con barra'), ej('Pecho con polea doble')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado en máquina'), ej('Aperturas con mancuernas')]),
      circuito(4, 'HOMBROS', [ej('Empuje de hombros con barra en banco'), ej('Face pulls')]),
      circuito(5, 'BRAZOS', [ej('Vuelos laterales'), ej('Extensión de triceps sobre cabeza')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Sentadilla con salto', 3, 12), ej('Mountain climbers', 3, 15)]),
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
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Saltos laterales', 3, 12), ej('Abs complex', 3, 1)]),
    ]),
    // Press E — semana 1
    rutina('#005', 'Press E — Hombros + Brazos', 'Lean', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Peso muerto con barra'), ej('Sentadilla con barra'), ej('Complex', 2, '30s')]),
      circuito(2, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Vuelos laterales')]),
      circuito(3, 'HOMBROS ALT', [ej('Empuje de hombros con barra en banco'), ej('Face pulls')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Curl martillo')]),
      circuito(5, 'BRAZOS ALT', [ej('Triceps con polea'), ej('Extensión de triceps sobre cabeza')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Estocada con salto', 3, 10), ej('Jumping jacks', 3, 20)]),
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
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Saltos al cajón', 3, 10), ej('Sentadilla con salto', 3, 12)]),
    ]),
    // Pull C — semana 2
    rutina('#008', 'Pull C — Espalda + Hombros', 'Lean', 'pull', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto con barra'), ej('Pallof press', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominadas abiertas'), ej('Jalón al pecho')]),
      circuito(3, 'ESPALDA ALT', [ej('Remo en maquina'), ej('Remo alto en polea')]),
      circuito(4, 'HOMBROS', [ej('Face pulls'), ej('Vuelos laterales')]),
      circuito(5, 'BRAZOS', [ej('Curl de bíceps con barra'), ej('Curl martillo')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Caminata a plancha', 3, 8), ej('Mountain climbers', 3, 15)]),
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
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Saltos laterales', 3, 12), ej('Burpees', 3, 8)]),
    ]),
    // ── NEW ROUTINES ──────────────────────────────────────────────────────────
    // Press F — semana 2 — Hammer (guiada) → inclinado mancuernas (estabilidad)
    rutina('#021', 'Press F — Pecho + Hombros', 'Lean', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Prensa de piernas'), ej('Sentadilla búlgara'), ej('Plancha lateral', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press Hammer'), ej('Aperturas con mancuernas')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado con mancuernas'), ej('Pullover con mancuerna')]),
      circuito(4, 'HOMBROS', [ej('Arnold press'), ej('Vuelos laterales')]),
      circuito(5, 'BRAZOS', [ej('Fondos en banco', 2, '12'), ej('Triceps con polea')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Burpees', 3, 10), ej('Mountain climbers', 3, 15)]),
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
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Estocada con salto', 3, 10), ej('Saltos al cajón', 3, 10)]),
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
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Sentadilla con salto', 3, 12), ej('Abs complex', 3, 1)]),
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
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Jumping jacks', 3, 20), ej('Mountain climbers', 3, 15)]),
    ]),
    // Press B — Banca (estabilidad) → inclinado máquina (guiada)
    rutina('#012', 'Press B — Pecho + Glúteos', 'Nat', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla sumo'), ej('Zancadas con mancuernas'), ej('Dead bug', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press de banca con barra'), ej('Pecho con polea doble')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado en máquina'), ej('Flexiones diamante', 2, '12')]),
      circuito(4, 'HOMBROS', [ej('Vuelos laterales'), ej('Empuje de hombros con barra en banco')]),
      circuito(5, 'GLÚTEOS', [ej('Aductores en maquina'), ej('Empuje de cadera en cajon')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Burpees', 3, 8), ej('Saltos laterales', 3, 12)]),
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
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Sentadilla con salto', 3, 12), ej('Jumping jacks', 3, 20)]),
    ]),
    // Press E
    rutina('#015', 'Press E — Hombros + Glúteos', 'Nat', 'press', 1, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto rumano'), ej('Pallof press', 2, '30s')]),
      circuito(2, 'HOMBROS', [ej('Press militar con mancuernas'), ej('Empuje de hombros con barra en banco')]),
      circuito(3, 'HOMBROS ALT', [ej('Face pulls'), ej('Elevaciones de hombro adelante')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con mancuerna'), ej('Extensión de triceps sobre cabeza')]),
      circuito(5, 'GLÚTEOS', [ej('Gluteos patada en polea'), ej('Aductores en maquina')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Estocada con salto', 3, 10), ej('Mountain climbers', 3, 15)]),
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
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Saltos al cajón', 3, 10), ej('Abs complex', 3, 1)]),
    ]),
    // Pull C
    rutina('#018', 'Pull C — Espalda + Glúteos', 'Nat', 'pull', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Sentadilla con barra'), ej('Peso muerto con barra'), ej('Pallof press', 2, '30s')]),
      circuito(2, 'ESPALDA', [ej('Dominada en maquina ascensor'), ej('Jalón al pecho')]),
      circuito(3, 'ESPALDA ALT', [ej('Remo en maquina separado'), ej('Face pulls')]),
      circuito(4, 'BRAZOS', [ej('Curl de bíceps con mancuerna'), ej('Curl martillo')]),
      circuito(5, 'GLÚTEOS', [ej('Gluteos patada en polea'), ej('Aductores en maquina')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Caminata a plancha', 3, 8), ej('Saltos laterales', 3, 12)]),
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
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Estocada con salto', 3, 10), ej('Saltos al cajón', 3, 10)]),
    ]),
    // ── NEW NAT ROUTINES ──────────────────────────────────────────────────────
    // Press F — Banca (estabilidad) → inclinado máquina (guiada)
    rutina('#026', 'Press F — Pecho + Glúteos', 'Nat', 'press', 2, [
      circuito(1, 'PIERNAS · CORE', [ej('Prensa de piernas'), ej('Sentadilla búlgara'), ej('Plancha lateral', 2, '30s')]),
      circuito(2, 'PECHO', [ej('Press de banca con barra'), ej('Aperturas con mancuernas')]),
      circuito(3, 'PECHO ALT', [ej('Press inclinado en máquina'), ej('Pullover con mancuerna')]),
      circuito(4, 'HOMBROS', [ej('Arnold press'), ej('Face pulls')]),
      circuito(5, 'GLÚTEOS', [ej('Peso muerto sumo'), ej('Abductores en maquina')]),
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Jumping jacks', 3, 20), ej('Mountain climbers', 3, 15)]),
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
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Saltos al cajón', 3, 10), ej('Abs complex', 3, 1)]),
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
      circuito(6, 'HIIT', [ej('Pasadas de velocidad', 5, 1), ej('Burpees', 3, 8), ej('Saltos laterales', 3, 12)]),
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

  // Rutinas RIO + URUGUAY (deduplicate — backup has 4x copies of each)
  if (backup.rutinas_rio_uruguay) {
    const existing = store.getAll(store.KEYS.rutinas);
    const existingIds = existing.filter(r => r.lugar === 'RIO' || r.lugar === 'URUGUAY').map(r => r.id);

    // Deduplicate by usuario+numero (keep first occurrence)
    const seen = new Set();
    const deduped = backup.rutinas_rio_uruguay.filter(r => {
      const key = `${r.usuario}|${r.numero}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const newRutinas = deduped
      .map(r => {
        const isUY = (r.nombre || '').includes('🇺🇾');
        return { ...r, id: r.id || uid(), lugar: isUY ? 'URUGUAY' : 'RIO', tipo: 'cross', pendingSync: false };
      })
      .filter(r => !existingIds.includes(r.id));

    // Renumber per lugar: #001, #002, ...
    const counters = { RIO: 0, URUGUAY: 0 };
    newRutinas.forEach(r => {
      counters[r.lugar] = (counters[r.lugar] || 0) + 1;
      r.numero = `#${String(counters[r.lugar]).padStart(3, '0')}`;
    });

    if (newRutinas.length > 0) {
      store.set(store.KEYS.rutinas, [...existing, ...newRutinas]);
      console.log(`[Seed] Loaded ${newRutinas.length} RIO/UY routines (deduped from ${backup.rutinas_rio_uruguay.length})`);
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

  if (sf.length !== 30) errors.push(`Total SF: ${sf.length} (debe ser 30)`);

  if (errors.length) {
    console.error('[Seed v2 ERRORS]', errors);
    return false;
  }
  console.log('[Seed v2 OK] ✅');
  return true;
}

export async function seedV2() {
  const version = store.getVersion();
  if (version === '2.10') {
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
  store.setVersion('2.10');

  // Verify
  verifySeedV2();

  console.log('[Seed] v2.0 complete');
}

// Export for testing
export { createLeanRoutines, createNatRoutines, assignCalendar };
