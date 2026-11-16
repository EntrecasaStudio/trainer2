// Planificador de meses: reparte rutinas YA EXISTENTES sobre el calendario.
//
// Es lo que reemplaza las ~86 fechas por usuario escritas a mano en
// `ensureCalendarOverrides()`.
//
// No genera rutinas. Eso es trabajo de generador.js, y son dos cosas con
// frecuencias distintas: generar pasa cuando aparece un lugar nuevo, planificar
// pasa cada dos o tres meses y casi siempre con lo que ya está afinado. Si van
// juntos, planificar obliga a regenerar, que es justo lo que no se quiere.
//
// ── Tramos ────────────────────────────────────────────────────────────────
//
// El lugar no se elige por día de la semana sino por TRAMO, porque "estas dos
// semanas estoy de viaje" no se puede decir con un mapa de día→lugar:
//
//   Tramo 1   01 dic – 20 dic    L M V      Casa
//   Tramo 2   21 dic – 04 ene    L X V S    Playa     ← el viaje
//   Tramo 3   05 ene – 28 feb    L M V      Casa
//
// Un plan normal es un tramo. Un viaje son tres. Y al volver, la rotación de
// Casa SIGUE DONDE QUEDÓ en vez de reiniciarse: si no, se vuelve siempre a
// Press A y las últimas letras no se usan nunca.

import { ordenRotacion } from './adyacencia.js';
import { formatDateISO, getISODayOfWeek } from './utils/calendar.js';

// Con menos de 5 rutinas el anillo es tan corto que cada una es vecina de
// todas (la regla mira ±2), así que no hay dónde colocar nada sin chocar.
export const MINIMO_ROTACION = 5;

// Las rutinas de un lugar, en el orden en que rotan.
export function rutinasDeLugar(rutinas, usuario, lugar) {
  const propias = (rutinas || []).filter(r =>
    r.usuario === usuario && r.lugar === lugar && !r.deletedAt);
  const enAnillo = ordenRotacion(propias);
  // Las que no entran en el esquema Press/Pull + letra igual sirven: se agregan
  // al final para no perderlas, sólo que su orden no lo decide la rotación.
  const sueltas = propias.filter(r => !enAnillo.includes(r));
  return [...enAnillo, ...sueltas];
}

// ── Dónde retomar ──────────────────────────────────────────────────────────

// Mira el calendario que ya existe y devuelve, por lugar, la posición
// siguiente del anillo. Así un plan nuevo continúa el anterior en vez de
// reiniciarlo. Sólo mira fechas ANTERIORES al comienzo del plan.
export function posicionesIniciales(overridesUsuario, rutinas, usuario, antesDe) {
  const pos = {};
  const porLugar = {};
  for (const [fecha, ov] of Object.entries(overridesUsuario || {})) {
    if (antesDe && fecha >= antesDe) continue;
    const r = (rutinas || []).find(x => x.id === ov?.rutinaId);
    if (!r?.lugar) continue;
    if (!porLugar[r.lugar] || fecha > porLugar[r.lugar].fecha) {
      porLugar[r.lugar] = { fecha, rutinaId: r.id };
    }
  }
  for (const [lugar, ultimo] of Object.entries(porLugar)) {
    const anillo = rutinasDeLugar(rutinas, usuario, lugar);
    const i = anillo.findIndex(r => r.id === ultimo.rutinaId);
    if (i >= 0) pos[lugar] = (i + 1) % anillo.length;
  }
  return pos;
}

// ── Validación ─────────────────────────────────────────────────────────────

function validarTramos(tramos) {
  const avisos = [];
  const ordenados = [...tramos].sort((a, b) => (a.desde < b.desde ? -1 : 1));
  for (let i = 0; i < ordenados.length; i++) {
    const t = ordenados[i];
    if (!t.desde || !t.hasta) { avisos.push({ tipo: 'tramo_incompleto', tramo: i + 1 }); continue; }
    if (t.hasta < t.desde) avisos.push({ tipo: 'fechas_invertidas', tramo: i + 1, desde: t.desde, hasta: t.hasta });
    if (!t.dias?.length) avisos.push({ tipo: 'sin_dias', tramo: i + 1 });
    const sig = ordenados[i + 1];
    if (sig && sig.desde <= t.hasta) {
      avisos.push({ tipo: 'tramos_superpuestos', tramo: i + 1, con: i + 2, desde: sig.desde, hasta: t.hasta });
    }
    if (sig && sig.desde > sumarDias(t.hasta, 1)) {
      avisos.push({ tipo: 'hueco', tramo: i + 1, con: i + 2, desde: sumarDias(t.hasta, 1), hasta: sumarDias(sig.desde, -1) });
    }
  }
  return avisos;
}

function sumarDias(iso, n) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return formatDateISO(d);
}

// ── Planificación ──────────────────────────────────────────────────────────

/**
 * @param {object} opts
 *   usuario            para quién
 *   tramos             [{ desde, hasta, dias:[1..7], lugar }]
 *   rutinas            todas las rutinas del store
 *   overridesActuales  el calendario que ya existe, para saber dónde retomar
 *                      y para avisar qué días se pisarían
 *   posiciones         opcional, fuerza dónde arranca cada lugar
 *
 * Devuelve { overrides, conflictos, avisos, resumen }. No escribe nada: la
 * vista previa y la confirmación son del que llama.
 */
export function planificar({ usuario, tramos = [], rutinas = [], overridesActuales = {}, posiciones = null }) {
  const avisos = validarTramos(tramos);
  const ordenados = [...tramos].sort((a, b) => (a.desde < b.desde ? -1 : 1));
  const primera = ordenados[0]?.desde;

  // Dónde retomar cada anillo. Lo calculado se puede pisar con `posiciones`.
  const pos = { ...posicionesIniciales(overridesActuales, rutinas, usuario, primera), ...(posiciones || {}) };

  const anillos = {};
  const overrides = {};
  const conflictos = [];
  const resumen = [];

  for (let ti = 0; ti < ordenados.length; ti++) {
    const t = ordenados[ti];
    if (!t.desde || !t.hasta || !t.dias?.length || !t.lugar) continue;

    if (!anillos[t.lugar]) anillos[t.lugar] = rutinasDeLugar(rutinas, usuario, t.lugar);
    const anillo = anillos[t.lugar];

    if (!anillo.length) {
      avisos.push({ tipo: 'lugar_sin_rutinas', tramo: ti + 1, lugar: t.lugar });
      continue;
    }
    if (anillo.length < MINIMO_ROTACION) {
      avisos.push({
        tipo: 'rotacion_corta', tramo: ti + 1, lugar: t.lugar, tiene: anillo.length,
        minimo: MINIMO_ROTACION,
      });
    }

    if (pos[t.lugar] === undefined) pos[t.lugar] = 0;
    let dias = 0;

    const d = new Date(t.desde + 'T00:00:00');
    const fin = new Date(t.hasta + 'T00:00:00');
    while (d <= fin) {
      if (t.dias.includes(getISODayOfWeek(d))) {
        const fecha = formatDateISO(d);
        const r = anillo[pos[t.lugar] % anillo.length];
        pos[t.lugar] = (pos[t.lugar] + 1) % anillo.length;

        const previo = overridesActuales?.[fecha];
        if (previo?.rutinaId && previo.rutinaId !== r.id) {
          conflictos.push({ fecha, actual: previo.rutinaId, propuesto: r.id });
        }
        overrides[fecha] = { rutinaId: r.id, tipo: r.foco || 'cross', lugar: t.lugar };
        dias++;
      }
      d.setDate(d.getDate() + 1);
    }

    resumen.push({
      tramo: ti + 1, lugar: t.lugar, desde: t.desde, hasta: t.hasta,
      dias, rutinasDelLugar: anillo.length,
      vueltas: anillo.length ? +(dias / anillo.length).toFixed(1) : 0,
    });
  }

  return { overrides, conflictos, avisos, resumen };
}

// Texto para humanos de un aviso. Vive acá y no en la vista para que el aviso
// y su explicación no se separen.
export function textoAviso(a) {
  switch (a.tipo) {
    case 'lugar_sin_rutinas':
      return `El tramo ${a.tramo} usa un lugar que todavía no tiene rutinas. Generá rutinas para ese lugar antes de planificar.`;
    case 'rotacion_corta':
      return `El tramo ${a.tramo} usa un lugar con ${a.tiene} rutinas. Con menos de ${a.minimo} cada rutina es vecina de todas y la regla de adyacencia deja de tener sentido: vas a repetir ejercicios de un día para el otro.`;
    case 'tramos_superpuestos':
      return `Los tramos ${a.tramo} y ${a.con} se pisan entre el ${a.desde} y el ${a.hasta}. Manda el segundo.`;
    case 'hueco':
      return `Entre el tramo ${a.tramo} y el ${a.con} quedan días sin plan: del ${a.desde} al ${a.hasta}.`;
    case 'fechas_invertidas':
      return `El tramo ${a.tramo} termina (${a.hasta}) antes de empezar (${a.desde}).`;
    case 'sin_dias':
      return `El tramo ${a.tramo} no tiene días de entrenamiento elegidos.`;
    case 'tramo_incompleto':
      return `Al tramo ${a.tramo} le faltan fechas.`;
    default:
      return a.tipo;
  }
}
