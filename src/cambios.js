// Registro de cambios de rutina.
//
// No numera versiones. Los dos análisis coincidieron en que "Casa Press B3" es
// contabilidad: la rutina de 15 ejercicios no es la unidad de análisis —no hay
// un número de "cómo me fue en Press B"— y la progresión se mide por ejercicio,
// cosa que el mapa de progresión ya hace y que sobrevive a los cambios.
//
// Lo que sí falta es poder contestar una pregunta concreta: "me empezó a
// molestar el hombro hace tres meses, ¿qué cambié en esa época?". Para eso
// alcanza con la fecha y qué se cambió.
//
// Dos reglas que salieron del mismo análisis:
//
// 1. EL CORTE LO MARCA EL ESTÍMULO, NO LA EDICIÓN. Cambiar un ejercicio por
//    otro se registra, porque cambia qué patrón se entrena. Subir de 10 a 12
//    reps NO: eso es progresión y ya queda en el historial de sesiones.
//
// 2. TIENE QUE SER PASIVO. Si cada edición "gasta" algo, aparece la resistencia
//    a cambiar un ejercicio que molesta o aburre, y eso es peor para el
//    entrenamiento que perder la historia. Así que se arma solo y no pregunta
//    nada. El motivo es opcional y se agrega después, si se quiere.

import { store } from './store.js';

const MAX = 500;   // el registro no crece sin límite; se van los más viejos

// Los ejercicios de una rutina, con su posición, para poder diferenciarlos.
function planos(rutina) {
  const out = [];
  (rutina?.circuitos || []).forEach((c, ci) => {
    (c.ejercicios || []).forEach((e, ei) => {
      out.push({ ci, ei, circuito: c.nombre, nombre: e.nombre });
    });
  });
  return out;
}

/**
 * Compara dos versiones de una rutina y devuelve los cambios de EJERCICIO.
 * Las reps, series y el orden no cuentan: eso es progresión, no cambio de
 * estímulo.
 */
export function diferencias(antes, despues) {
  const a = planos(antes), b = planos(despues);
  const cambios = [];

  const nombresAntes = a.map(x => x.nombre);
  const nombresDespues = b.map(x => x.nombre);

  // Mismo slot, otro ejercicio: un reemplazo. Pero si los DOS nombres siguen
  // estando en las dos versiones, no se reemplazó nada: se reordenó. Permutar
  // dos ejercicios de lugar no cambia el estímulo y no se registra.
  for (const s of b) {
    const par = a.find(x => x.ci === s.ci && x.ei === s.ei);
    if (!par || par.nombre === s.nombre) continue;
    const esReorden = nombresDespues.includes(par.nombre) && nombresAntes.includes(s.nombre);
    if (esReorden) continue;
    cambios.push({ tipo: 'reemplazo', circuito: s.circuito, viejo: par.nombre, nuevo: s.nombre });
  }

  // Altas y bajas, comparando por nombre para no contar un reordenamiento como
  // si hubieran cambiado todos.
  const nombresA = nombresAntes, nombresB = nombresDespues;
  const yaContados = new Set(cambios.flatMap(c => [c.viejo, c.nuevo]));
  for (const n of new Set(nombresB)) {
    if (!nombresA.includes(n) && !yaContados.has(n)) {
      cambios.push({ tipo: 'alta', circuito: b.find(x => x.nombre === n)?.circuito, nuevo: n });
    }
  }
  for (const n of new Set(nombresA)) {
    if (!nombresB.includes(n) && !yaContados.has(n)) {
      cambios.push({ tipo: 'baja', circuito: a.find(x => x.nombre === n)?.circuito, viejo: n });
    }
  }
  return cambios;
}

// Registra lo que cambió entre dos versiones de una rutina. Si no cambió ningún
// ejercicio no escribe nada: guardar una rutina tras ajustar reps no deja rastro.
export function registrarCambios(antes, despues, { motivo = null } = {}) {
  const cambios = diferencias(antes, despues);
  if (!cambios.length) return [];

  const ahora = new Date().toISOString();
  const entradas = cambios.map(c => ({
    id: crypto.randomUUID(),
    fecha: ahora,
    rutinaId: despues?.id || antes?.id,
    rutina: despues?.nombre || antes?.nombre,
    usuario: despues?.usuario || antes?.usuario,
    lugar: despues?.lugar || antes?.lugar,
    motivo,
    ...c,
  }));

  const previo = store.getAll(store.KEYS.cambios);
  store.set(store.KEYS.cambios, [...previo, ...entradas].slice(-MAX));
  return entradas;
}

// El historial, del más reciente al más viejo. Se puede filtrar por rutina,
// usuario o ejercicio — este último es el que contesta "¿cuándo metí esto?".
export function historial({ rutinaId = null, usuario = null, ejercicio = null, desde = null } = {}) {
  return store.getAll(store.KEYS.cambios)
    .filter(c => !rutinaId || c.rutinaId === rutinaId)
    .filter(c => !usuario || c.usuario === usuario)
    .filter(c => !desde || c.fecha >= desde)
    .filter(c => !ejercicio || c.viejo === ejercicio || c.nuevo === ejercicio)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

// El motivo es opcional y se puede agregar después del hecho, que es cuando
// uno se entera de que importaba.
export function ponerMotivo(id, motivo) {
  const todos = store.getAll(store.KEYS.cambios);
  const i = todos.findIndex(c => c.id === id);
  if (i < 0) return null;
  todos[i] = { ...todos[i], motivo };
  store.set(store.KEYS.cambios, todos);
  return todos[i];
}

// Agrupa por día, para mostrarlo como una línea de tiempo. Una tanda de 19
// cambios del mismo día es un bloque, no 19 entradas sueltas.
export function porDia(filtros = {}) {
  const dias = new Map();
  for (const c of historial(filtros)) {
    const d = c.fecha.slice(0, 10);
    if (!dias.has(d)) dias.set(d, []);
    dias.get(d).push(c);
  }
  return [...dias.entries()].map(([fecha, cambios]) => ({ fecha, cambios }));
}

export function textoCambio(c) {
  if (c.tipo === 'reemplazo') return `${c.viejo} → ${c.nuevo}`;
  if (c.tipo === 'alta') return `+ ${c.nuevo}`;
  return `− ${c.viejo}`;
}
