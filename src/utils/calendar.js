// Semana del ciclo (1 o 2)
export function getCycleWeek(date, startDate) {
  const d = new Date(date);
  const s = new Date(startDate);
  // Reset to start of day
  d.setHours(0, 0, 0, 0);
  s.setHours(0, 0, 0, 0);
  const diff = Math.floor((d - s) / (7 * 24 * 60 * 60 * 1000));
  return (((diff % 2) + 2) % 2) + 1; // always 1 or 2
}

// Foco del día — 1=Lunes, 3=Miércoles, 5=Viernes
export function getFocusForDay(dow, cycleWeek) {
  const map = {
    1: { 1: 'press', 2: 'pull' },
    3: { 1: 'pull',  2: 'press' },
    5: { 1: 'press', 2: 'pull' }
  };
  return map[dow]?.[cycleWeek] || null;
}

// Check if a date is a training day (Lun, Mie, Vie)
export function isTrainingDay(date) {
  const dow = date.getDay(); // 0=Sun, 1=Mon, ...
  return dow === 1 || dow === 3 || dow === 5;
}

// Get day of week (ISO: 1=Mon, 7=Sun)
export function getISODayOfWeek(date) {
  const d = date.getDay();
  return d === 0 ? 7 : d;
}

// Get monday of the week containing date
export function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Format date as YYYY-MM-DD (local timezone, not UTC)
export function formatDateISO(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Get next training day from a given date
export function getNextTrainingDay(fromDate) {
  const d = new Date(fromDate);
  do {
    d.setDate(d.getDate() + 1);
  } while (!isTrainingDay(d));
  return d;
}

// RIO Saturday focus — inverse of Friday's foco
export function getRioFocusForSaturday(cycleWeek) {
  // Friday: semana 1 → press, semana 2 → pull
  // Saturday (inverse): semana 1 → pull, semana 2 → press
  return cycleWeek === 1 ? 'pull' : 'press';
}

// Days of week labels in Spanish
export const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
export const WEEKDAY_FULL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
