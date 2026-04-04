import { WEEKDAY_FULL, MONTH_NAMES } from './calendar.js';

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function formatDateLong(date) {
  const d = new Date(date);
  const dow = d.getDay();
  const isoDow = dow === 0 ? 6 : dow - 1;
  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()];
  return `${WEEKDAY_FULL[isoDow]} ${day} ${month}`;
}

export function formatTimer(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm ? `${h}h ${rm}m` : `${h}h`;
}

export function getLugarBadge(lugar) {
  switch (lugar) {
    case 'SPORT_FITNESS': return { text: 'SPORT', cls: 'badge-sport' };
    case 'RIO': return { text: 'RÍO', cls: 'badge-rio' };
    case 'URUGUAY': return { text: '🇺🇾', cls: 'badge-uy' };
    default: return { text: lugar, cls: '' };
  }
}

export function getCircuitColor(nombre) {
  const n = (nombre || '').toLowerCase();
  if (n.includes('pierna') || n.includes('core')) return 'var(--color-tag-piernas)';
  if (n.includes('pecho')) return 'var(--color-tag-pecho)';
  if (n.includes('espalda')) return 'var(--color-tag-espalda)';
  if (n.includes('brazo')) return 'var(--color-tag-brazos)';
  if (n.includes('glúteo') || n.includes('gluteo')) return 'var(--color-tag-gluteos)';
  if (n.includes('hombro')) return 'var(--color-tag-hombros)';
  if (n.includes('hiit')) return 'var(--color-tag-hiit)';
  return 'var(--color-tag-core)';
}

export function getGrupoColor(grupo) {
  const GRUPO_COLORS = {
    'Piernas': 'var(--color-tag-piernas)',
    'Core': 'var(--color-tag-core)',
    'Pecho': 'var(--color-tag-pecho)',
    'Espalda': 'var(--color-tag-espalda)',
    'Brazos': 'var(--color-tag-brazos)',
    'Glúteos': 'var(--color-tag-gluteos)',
    'Hombros': 'var(--color-tag-hombros)',
    'HIIT': 'var(--color-tag-hiit)',
  };
  return GRUPO_COLORS[grupo] || 'var(--color-tag-core)';
}

export function formatSetsReps(ej) {
  if (ej.tipo === 'hiit' && ej.duracion) {
    return `${ej.series?.length || ej.series || 1}×${ej.duracion}s`;
  }
  // v2: series=number, reps=string  |  v1: series=array[{reps,pesoKg}], repsObjetivo=number
  const numSeries = Array.isArray(ej.series) ? ej.series.length : (ej.series || 0);
  const reps = ej.reps || ej.repsObjetivo || (Array.isArray(ej.series) && ej.series[0]?.reps);
  if (!numSeries && !reps) return '';
  if (!numSeries) return `${reps} rep`;
  if (!reps) return `${numSeries}s`;
  return `${numSeries}×${reps}`;
}
