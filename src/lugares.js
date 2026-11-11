// Los lugares de entrenamiento, como dato.
//
// Hasta acá `lugar` era un enum escrito a mano en seis lugares distintos:
// LUGAR_ORDER / LUGAR_CHIPS / LUGAR_LABELS en home.js (dos veces), LUGAR_LABELS
// en rutinas.js, LUGAR_OPTIONS en rutina-edit.js, el switch de getLugarBadge()
// en format.js y cinco clases .badge-* en components.css. Agregar un lugar
// significaba tocar los seis y nadie podía hacerlo desde la app.
//
// Acá los cinco de siempre viven como registros `builtin`, y los que crea el
// usuario se guardan en `gym_lugares`. Un registro guardado con el mismo id que
// un builtin lo pisa, así que también se puede editar el equipamiento de Casa
// sin tocar código.

import { store } from './store.js';

// El equipamiento de cada lugar fijo NO está inventado: sale de unir lo que
// exigen los ejercicios que sus propias rutinas usan. Si una rutina de Casa
// pidiera una polea, aparecería acá y sería una señal de que algo está mal
// puesto — de hecho así se encontraron tres mapeos equivocados.
export const LUGARES_BUILTIN = [
  {
    id: 'SPORT_FITNESS', nombre: 'Sport Fitness', corto: 'Sport', badge: 'SPORT',
    color: '#FFCD00', icono: 'ph-barbell', builtin: true,
    equipo: ['mancuernas', 'barra', 'barra_z', 'discos', 'kettlebell', 'balon_medicinal',
             'polea', 'maquina_fuerza', 'smith', 'cardio', 'banco_plano', 'banco_regulable',
             'rack', 'barra_dominadas', 'cajon', 'trx', 'bandas', 'loop_band', 'cuerda',
             'colchoneta', 'espacio_desplazamiento', 'espacio_salto'],
  },
  {
    id: 'RIO', nombre: 'Río', corto: 'Río', badge: 'RÍO',
    color: '#0A84FF', icono: 'ph-waves', builtin: true,
    equipo: ['mancuernas', 'kettlebell', 'discos', 'trx', 'bandas', 'loop_band',
             'tobilleras', 'ab_wheel', 'chaleco', 'cajon', 'paralelas', 'barra_dominadas',
             'colchoneta', 'exterior', 'espacio_desplazamiento', 'espacio_salto'],
  },
  {
    id: 'CASA', nombre: 'Casa', corto: 'Casa', badge: 'CASA',
    color: '#30D158', icono: 'ph-house-line', builtin: true,
    equipo: ['mancuernas', 'kettlebell', 'discos', 'trx', 'bandas', 'loop_band',
             'chaleco', 'tobilleras', 'ab_wheel', 'sliders', 'cajon', 'colchoneta',
             'espacio_desplazamiento', 'espacio_salto'],
  },
  {
    id: 'URUGUAY', nombre: '🇺🇾 Uruguay', corto: '🇺🇾', badge: '🇺🇾',
    color: '#A78BFA', icono: 'ph-sun-horizon', builtin: true,
    equipo: ['mancuernas', 'kettlebell', 'bandas', 'loop_band', 'trx', 'cajon',
             'colchoneta', 'exterior', 'espacio_desplazamiento', 'espacio_salto'],
  },
  {
    id: 'RECOVERY', nombre: 'Recovery', corto: 'Recovery', badge: 'REC',
    color: '#FF6B8B', icono: 'ph-heartbeat', builtin: true,
    equipo: ['bandas', 'loop_band', 'kettlebell', 'trx', 'colchoneta'],
  },
];

const BUILTIN_IDS = LUGARES_BUILTIN.map(l => l.id);

// Paleta para lugares nuevos: se elige el primer color que no esté en uso.
export const COLORES_LUGAR = [
  '#F97316', '#14B8A6', '#EC4899', '#8B5CF6', '#06B6D4',
  '#84CC16', '#EF4444', '#F59E0B', '#6366F1', '#10B981',
];

export const ICONOS_LUGAR = [
  'ph-house-line', 'ph-barbell', 'ph-buildings', 'ph-tree', 'ph-waves',
  'ph-sun-horizon', 'ph-suitcase', 'ph-briefcase', 'ph-mountains', 'ph-garage',
];

// ── Lectura ────────────────────────────────────────────────────────────────

function guardados() {
  const arr = store.getAll(store.KEYS.lugares);
  return Array.isArray(arr) ? arr : [];
}

// Builtins primero, en su orden de siempre, seguidos por los del usuario por
// orden de creación. Un guardado con el id de un builtin lo reemplaza.
export function getLugares({ incluirBorrados = false } = {}) {
  const porId = new Map(LUGARES_BUILTIN.map(l => [l.id, l]));
  const propios = [];
  for (const l of guardados()) {
    if (!l?.id) continue;
    if (porId.has(l.id)) porId.set(l.id, { ...porId.get(l.id), ...l, builtin: true });
    else propios.push(l);
  }
  const todos = [...BUILTIN_IDS.map(id => porId.get(id)), ...propios];
  return incluirBorrados ? todos : todos.filter(l => !l.deletedAt);
}

// Nunca devuelve undefined. Un id desconocido —dato viejo, o un lugar creado en
// otro dispositivo que todavía no bajó por sync— devuelve un registro sintético
// para que la vista muestre algo en vez de romperse.
export function getLugar(id) {
  if (!id) return null;
  const encontrado = getLugares({ incluirBorrados: true }).find(l => l.id === id);
  if (encontrado) return encontrado;
  return {
    id, nombre: id, corto: id, badge: id.slice(0, 5).toUpperCase(),
    color: '#8E8E93', icono: 'ph-map-pin', builtin: false, equipo: null, huerfano: true,
  };
}

// `equipo: null` significa "no sé qué hay acá", y entonces todo está permitido.
// Es el caso de un lugar huérfano. Devolver una lista vacía dejaría al lugar sin
// un solo ejercicio, que es peor que no filtrar.
export function getEquipoDeLugar(id) {
  return getLugar(id)?.equipo ?? null;
}

export function esLugarConocido(id) {
  return getLugares().some(l => l.id === id);
}

// ── Escritura ──────────────────────────────────────────────────────────────

// Id estable a partir del nombre, sin pisar uno existente.
export function generarIdLugar(nombre) {
  const base = (nombre || 'lugar')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '')
    .slice(0, 24) || 'LUGAR';
  const usados = new Set(getLugares({ incluirBorrados: true }).map(l => l.id));
  if (!usados.has(base)) return base;
  let n = 2;
  while (usados.has(`${base}_${n}`)) n++;
  return `${base}_${n}`;
}

export function colorLibre() {
  const usados = new Set(getLugares().map(l => l.color));
  return COLORES_LUGAR.find(c => !usados.has(c)) || COLORES_LUGAR[0];
}

// Cortar a lo bruto deja cosas como "Gimnasio de " y "GIMNASI". Para el chip se
// usa la primera palabra cuando el nombre no entra; para el badge, que convive
// con CASA, RÍO y SPORT, la primera palabra en mayúsculas y corta. Son sólo
// valores por defecto: el wizard deja cambiar los dos.
export function abreviarNombre(nombre, largo) {
  const limpio = (nombre || '').trim().replace(/\s+/g, ' ');
  if (limpio.length <= largo) return limpio;
  const primera = limpio.split(' ')[0];
  return (primera.length <= largo ? primera : primera.slice(0, largo)).trim();
}

export function addLugar({ nombre, equipo = [], color, icono, corto, badge }) {
  const id = generarIdLugar(nombre);
  const limpio = (nombre || '').trim().replace(/\s+/g, ' ') || id;
  const lugar = {
    id,
    nombre: limpio,
    corto: (corto || '').trim() || abreviarNombre(limpio, 12),
    badge: ((badge || '').trim() || abreviarNombre(limpio, 6)).toUpperCase(),
    color: color || colorLibre(),
    icono: icono || 'ph-map-pin',
    equipo: [...equipo],
    builtin: false,
    creadoEn: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.set(store.KEYS.lugares, [...guardados(), lugar]);
  return lugar;
}

export function updateLugar(id, cambios) {
  const arr = guardados();
  const i = arr.findIndex(l => l.id === id);
  const base = i >= 0 ? arr[i] : (LUGARES_BUILTIN.find(l => l.id === id) || { id });
  const actualizado = { ...base, ...cambios, id, updatedAt: new Date().toISOString() };
  if (i >= 0) arr[i] = actualizado; else arr.push(actualizado);
  store.set(store.KEYS.lugares, arr);
  return actualizado;
}

// Borrado blando, con lápida: `mergeArraysById` resuelve por `updatedAt` /
// `deletedAt`, así que un borrado hecho en un dispositivo gana sobre la copia
// vieja del otro. Borrarlo de verdad lo haría reaparecer en el próximo sync.
// Los builtin no se borran: se esconden.
export function deleteLugar(id) {
  return updateLugar(id, { deletedAt: new Date().toISOString() });
}

export function restoreLugar(id) {
  return updateLugar(id, { deletedAt: null });
}
