import { store } from '../../store.js';
import { router } from '../../router.js';
import { getGreeting, formatDateLong, getLugarBadge, getCircuitColor, formatSetsReps } from '../../utils/format.js';
import { formatDateISO, getNextTrainingDay, isTrainingDay, WEEKDAY_LABELS, MONTH_NAMES, getISODayOfWeek, getCycleWeek, getFocusForDay } from '../../utils/calendar.js';
import { openModal, closeModal } from '../components/modal.js';

let selectedDate = new Date();
let activeUsuario = null;

export function mountHome(container) {
  activeUsuario = store.getActiveUser();
  selectedDate = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  render(container);
}

function render(container) {
  const greeting = getGreeting();

  container.innerHTML = `
    <p class="greeting">${greeting}</p>
    <div class="user-toggle">
      <button class="user-toggle-btn ${activeUsuario === 'Lean' ? 'active' : ''}" data-usuario="Lean">Lean</button>
      <button class="user-toggle-btn ${activeUsuario === 'Nat' ? 'active' : ''}" data-usuario="Nat">Nat</button>
    </div>
    <div id="routine-card-container"></div>
    <div id="calendar-container"></div>
    <div id="next-workout-container"></div>
  `;

  // Toggle handlers
  container.querySelectorAll('.user-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeUsuario = btn.dataset.usuario;
      store.setActiveUser(activeUsuario);
      container.querySelectorAll('.user-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRoutineCard();
      renderCalendar();
      renderNextWorkout();
    });
  });

  renderRoutineCard();
  renderCalendar();
  renderNextWorkout();
}

function getRoutineForDate(date, usuario) {
  const dateStr = formatDateISO(date);
  const overrides = store.getObj(store.KEYS.overrides);
  const override = overrides[usuario]?.[dateStr];

  if (!override) return null;

  const rutinas = store.getAll(store.KEYS.rutinas);
  return rutinas.find(r => r.id === override.rutinaId) || null;
}

function renderRoutineCard() {
  const container = document.getElementById('routine-card-container');
  if (!container) return;

  const rutina = getRoutineForDate(selectedDate, activeUsuario);

  if (!rutina) {
    const nextDay = getNextTrainingDay(selectedDate);
    const nextRutina = getRoutineForDate(nextDay, activeUsuario);
    container.innerHTML = `
      <div class="rest-day-card">
        <div class="rest-day-emoji">🔒</div>
        <div class="rest-day-text">Hoy descansas</div>
        <div class="rest-day-next">
          Próximo: ${nextRutina ? nextRutina.nombre : 'Sin asignar'} · ${formatDateLong(nextDay)}
        </div>
      </div>
    `;
    return;
  }

  const badge = getLugarBadge(rutina.lugar);

  container.innerHTML = `
    <div class="routine-card">
      <div class="routine-card-header">
        <span class="routine-code">${rutina.numero}</span>
        <span class="badge ${badge.cls}">${badge.text}</span>
      </div>
      <div class="routine-name">${rutina.nombre}</div>
      <div class="routine-divider"></div>
      ${rutina.circuitos.map(c => renderCircuit(c)).join('')}
      <div class="routine-card-actions">
        <button class="btn btn-secondary" id="btn-edit-routine">✏️ Editar</button>
        <button class="btn btn-primary btn-lg" id="btn-start-workout">▶ Iniciar</button>
      </div>
    </div>
  `;

  document.getElementById('btn-start-workout')?.addEventListener('click', () => {
    router.navigate(`workout/${rutina.id}/${formatDateISO(selectedDate)}`);
  });

  document.getElementById('btn-edit-routine')?.addEventListener('click', () => {
    openEditSheet(rutina);
  });
}

function renderCircuit(c) {
  const color = getCircuitColor(c.nombre);
  return `
    <div class="circuit-item">
      <div class="circuit-header">
        <span class="circuit-number">${c.numero}</span>
        <span class="circuit-name" style="color: ${color}">${c.nombre}</span>
      </div>
      <div class="circuit-exercises">
        ${c.ejercicios.map(e => `
          <div class="exercise-row">
            <span class="exercise-name">${e.nombre}</span>
            <span class="exercise-sets">${formatSetsReps(e)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function openEditSheet(currentRutina) {
  const rutinas = store.getAll(store.KEYS.rutinas);
  const candidates = rutinas.filter(r =>
    r.usuario === activeUsuario &&
    r.lugar === currentRutina.lugar &&
    r.foco === currentRutina.foco
  );

  const listHTML = candidates.map(r => `
    <div class="rutina-list-item" data-id="${r.id}" style="${r.id === currentRutina.id ? 'border-left: 3px solid var(--color-accent);' : ''}">
      <div class="rutina-list-header">
        <span class="rutina-list-code">${r.numero}</span>
      </div>
      <div class="rutina-list-name">${r.nombre}</div>
    </div>
  `).join('');

  openModal('Cambiar rutina', listHTML, {
    onMount(body) {
      body.querySelectorAll('.rutina-list-item').forEach(item => {
        item.addEventListener('click', () => {
          const newId = item.dataset.id;
          const dateStr = formatDateISO(selectedDate);
          const overrides = store.getObj(store.KEYS.overrides);
          if (!overrides[activeUsuario]) overrides[activeUsuario] = {};
          overrides[activeUsuario][dateStr] = { rutinaId: newId, tipo: currentRutina.foco };
          store.set(store.KEYS.overrides, overrides);
          closeModal();
          renderRoutineCard();
        });
      });
    }
  });
}

function renderCalendar() {
  const container = document.getElementById('calendar-container');
  if (!container) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const viewMonth = selectedDate.getMonth();
  const viewYear = selectedDate.getFullYear();

  // Get first day of month and pad to Monday
  const firstDay = new Date(viewYear, viewMonth, 1);
  const startDow = firstDay.getDay();
  const startOffset = startDow === 0 ? -6 : 1 - startDow;
  const calStart = new Date(firstDay);
  calStart.setDate(calStart.getDate() + startOffset);

  // Generate 6 weeks of days
  const days = [];
  const d = new Date(calStart);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }

  // Check overrides for dots
  const overrides = store.getObj(store.KEYS.overrides);
  const sesiones = store.getAll(store.KEYS.sesiones);

  const monthName = MONTH_NAMES[viewMonth];

  container.innerHTML = `
    <div class="calendar">
      <div class="calendar-header">
        <span class="calendar-title">Hoy · ${formatDateLong(today)}</span>
      </div>
      <div class="calendar-grid">
        ${WEEKDAY_LABELS.map(l => `<span class="cal-weekday">${l}</span>`).join('')}
        ${days.map(day => {
          const dateStr = formatDateISO(day);
          const isToday = dateStr === formatDateISO(today);
          const isSelected = dateStr === formatDateISO(selectedDate);
          const isOtherMonth = day.getMonth() !== viewMonth;
          const hasWorkout = overrides[activeUsuario]?.[dateStr];
          const isCompleted = sesiones.some(s => s.fecha === dateStr && s.usuario === activeUsuario);

          const classes = [
            'cal-day',
            isToday ? 'today' : '',
            isSelected ? 'selected' : '',
            isOtherMonth ? 'other-month' : '',
            hasWorkout ? 'has-workout' : '',
            isCompleted ? 'completed' : '',
          ].filter(Boolean).join(' ');

          return `<span class="${classes}" data-date="${dateStr}">${day.getDate()}</span>`;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.cal-day').forEach(dayEl => {
    dayEl.addEventListener('click', () => {
      const date = new Date(dayEl.dataset.date + 'T00:00:00');
      selectedDate = date;
      renderRoutineCard();
      renderCalendar();
      renderNextWorkout();
    });
  });
}

function renderNextWorkout() {
  const container = document.getElementById('next-workout-container');
  if (!container) return;

  const nextDay = getNextTrainingDay(selectedDate);
  const nextRutina = getRoutineForDate(nextDay, activeUsuario);

  if (nextRutina) {
    container.innerHTML = `
      <div class="next-workout">
        Próximo: <strong>${nextRutina.nombre}</strong> · ${formatDateLong(nextDay)}
      </div>
    `;
  } else {
    container.innerHTML = '';
  }
}
