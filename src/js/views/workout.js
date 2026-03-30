import { store } from '../../store.js';
import { router } from '../../router.js';
import { inferUsaPeso } from '../../utils/inferUsaPeso.js';
import { formatTimer, getCircuitColor, formatSetsReps } from '../../utils/format.js';
import { showToast } from '../components/toast.js';

let timerInterval = null;
let elapsedSeconds = 0;
let workoutState = null;

export function mountWorkout(container, params) {
  const [rutinaId, fecha] = params;
  const rutina = store.findById(store.KEYS.rutinas, rutinaId);

  if (!rutina) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-text">Rutina no encontrada</div></div>`;
    return;
  }

  const usuario = store.getActiveUser();
  elapsedSeconds = 0;

  // Initialize workout state
  workoutState = {
    rutinaId: rutina.id,
    rutinaNombre: rutina.nombre,
    usuario,
    fecha,
    startTime: new Date().toISOString(),
    circuitos: rutina.circuitos.map(c => ({
      id: c.id,
      nombre: c.nombre,
      completed: false,
      ejercicios: c.ejercicios.map(e => ({
        id: e.id,
        nombre: e.nombre,
        tipo: e.tipo,
        series: e.series,
        reps: e.reps,
        duracion: e.duracion,
        descanso: e.descanso,
        usaPeso: inferUsaPeso(e.nombre),
        peso: null,
        seriesData: Array.from({ length: e.series }, () => ({ reps: 0, done: false })),
      })),
    })),
  };

  // Pre-fill weights from progresion
  workoutState.circuitos.forEach(c => {
    c.ejercicios.forEach(e => {
      if (e.usaPeso) {
        const prog = store.getProgresion(e.nombre, usuario);
        if (prog) {
          e.peso = prog.lastWeight;
          e._suggestion = prog.completedAllReps ? prog.lastWeight + 2.5 : null;
        }
      }
    });
  });

  render(container, rutina);
  startTimer(container);
}

function startTimer(container) {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    const timerEl = document.getElementById('workout-timer');
    if (timerEl) timerEl.textContent = formatTimer(elapsedSeconds);
  }, 1000);
}

function render(container, rutina) {
  container.innerHTML = `
    <div class="workout-header">
      <span id="workout-timer" class="workout-timer">${formatTimer(elapsedSeconds)}</span>
      <button class="workout-close" id="btn-close-workout">&times;</button>
    </div>
    <h2 style="font-size: var(--text-lg); font-weight: var(--fw-semibold); margin-bottom: var(--space-lg);">${rutina.nombre}</h2>
    <div id="workout-circuits"></div>
    <div class="workout-finish">
      <button class="btn btn-primary btn-lg" id="btn-finish-workout">Finalizar Entrenamiento</button>
    </div>
  `;

  document.getElementById('btn-close-workout')?.addEventListener('click', () => {
    if (confirm('¿Abandonar el entrenamiento?')) {
      clearInterval(timerInterval);
      router.navigate('');
    }
  });

  document.getElementById('btn-finish-workout')?.addEventListener('click', () => finishWorkout(container));

  renderCircuits();
}

function renderCircuits() {
  const circuitsEl = document.getElementById('workout-circuits');
  if (!circuitsEl) return;

  circuitsEl.innerHTML = workoutState.circuitos.map((c, ci) => {
    const color = getCircuitColor(c.nombre);
    const isHIIT = c.nombre === 'HIIT';

    return `
      <div class="workout-circuit ${c.completed ? 'completed' : ''}" data-circuit="${ci}">
        <div class="workout-circuit-header">
          <span class="workout-circuit-name" style="color: ${color}">${c.nombre}</span>
          <span class="workout-circuit-badge">${c.completed ? '✅' : ''}</span>
        </div>
        ${isHIIT ? renderHIIT(c, ci) : c.ejercicios.map((e, ei) => renderExercise(e, ci, ei)).join('')}
      </div>
    `;
  }).join('');

  // Bind events
  bindWorkoutEvents();
}

function renderExercise(e, ci, ei) {
  const usuario = workoutState.usuario;
  const prog = store.getProgresion(e.nombre, usuario);
  const suggestion = e._suggestion;

  return `
    <div class="workout-exercise" data-circuit="${ci}" data-exercise="${ei}">
      <div class="workout-exercise-name">${e.nombre}</div>
      <div class="workout-exercise-info">
        <span>${e.series}×${e.reps}</span>
        ${suggestion ? `<span class="weight-suggestion">↑ +2.5kg sugerido</span>` : ''}
      </div>
      ${e.usaPeso ? `
        <div class="weight-input-row">
          <input type="number" class="weight-input" data-ci="${ci}" data-ei="${ei}"
                 value="${e.peso || ''}" placeholder="kg" inputmode="decimal" step="0.5">
          <span class="weight-unit">kg</span>
          ${prog ? `<span style="font-size: var(--text-xs); color: var(--color-text-muted);">Último: ${prog.lastWeight}kg</span>` : ''}
        </div>
      ` : ''}
      <div class="series-rows">
        ${e.seriesData.map((s, si) => `
          <div class="series-row">
            <span class="series-label">S${si + 1}</span>
            <input type="number" class="reps-input" data-ci="${ci}" data-ei="${ei}" data-si="${si}"
                   value="${s.reps || ''}" placeholder="${e.reps}" inputmode="numeric">
            <button class="series-check ${s.done ? 'done' : ''}" data-ci="${ci}" data-ei="${ei}" data-si="${si}">
              ${s.done ? '✓' : ''}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderHIIT(c, ci) {
  const e = c.ejercicios[0];
  if (!e) return '';

  return `
    <div class="hiit-container" data-circuit="${ci}">
      <div class="workout-exercise-name">${e.nombre}</div>
      <div class="workout-exercise-info">
        <span>${e.series} rondas · ${e.duracion}s trabajo / ${e.descanso}s descanso</span>
      </div>
      <button class="btn btn-primary" id="btn-hiit-start-${ci}">Iniciar HIIT</button>
      <div id="hiit-display-${ci}" class="hidden">
        <div class="hiit-round" id="hiit-round-${ci}">Ronda 1/${e.series}</div>
        <div class="hiit-time work" id="hiit-time-${ci}">${e.duracion}</div>
        <div class="hiit-label" id="hiit-label-${ci}">TRABAJO</div>
        <div class="hiit-controls">
          <button class="btn btn-secondary" id="btn-hiit-pause-${ci}">⏸</button>
          <button class="btn btn-danger" id="btn-hiit-stop-${ci}">⏹</button>
        </div>
      </div>
    </div>
  `;
}

function bindWorkoutEvents() {
  // Weight inputs
  document.querySelectorAll('.weight-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const { ci, ei } = e.target.dataset;
      workoutState.circuitos[ci].ejercicios[ei].peso = parseFloat(e.target.value) || null;
    });
  });

  // Reps inputs
  document.querySelectorAll('.reps-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const { ci, ei, si } = e.target.dataset;
      workoutState.circuitos[ci].ejercicios[ei].seriesData[si].reps = parseInt(e.target.value) || 0;
    });
  });

  // Series check buttons
  document.querySelectorAll('.series-check').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const { ci, ei, si } = btn.dataset;
      const series = workoutState.circuitos[ci].ejercicios[ei].seriesData[si];
      series.done = !series.done;
      btn.classList.toggle('done', series.done);
      btn.textContent = series.done ? '✓' : '';

      // Check if all series in circuit are done
      const circuit = workoutState.circuitos[ci];
      const allDone = circuit.ejercicios.every(ex =>
        ex.seriesData.every(s => s.done)
      );
      circuit.completed = allDone;
      const circuitEl = document.querySelector(`.workout-circuit[data-circuit="${ci}"]`);
      if (circuitEl) {
        circuitEl.classList.toggle('completed', allDone);
        const badge = circuitEl.querySelector('.workout-circuit-badge');
        if (badge) badge.textContent = allDone ? '✅' : '';
      }
    });
  });

  // HIIT buttons
  workoutState.circuitos.forEach((c, ci) => {
    if (c.nombre !== 'HIIT') return;
    const startBtn = document.getElementById(`btn-hiit-start-${ci}`);
    if (startBtn) {
      startBtn.addEventListener('click', () => startHIIT(ci, c.ejercicios[0]));
    }
  });
}

let hiitInterval = null;

function startHIIT(ci, ejercicio) {
  const startBtn = document.getElementById(`btn-hiit-start-${ci}`);
  const display = document.getElementById(`hiit-display-${ci}`);
  if (startBtn) startBtn.classList.add('hidden');
  if (display) display.classList.remove('hidden');

  let round = 1;
  let timeLeft = ejercicio.duracion;
  let isWork = true;
  let paused = false;

  const timeEl = document.getElementById(`hiit-time-${ci}`);
  const roundEl = document.getElementById(`hiit-round-${ci}`);
  const labelEl = document.getElementById(`hiit-label-${ci}`);
  const pauseBtn = document.getElementById(`btn-hiit-pause-${ci}`);
  const stopBtn = document.getElementById(`btn-hiit-stop-${ci}`);

  function updateDisplay() {
    if (timeEl) { timeEl.textContent = timeLeft; timeEl.className = `hiit-time ${isWork ? 'work' : 'rest'}`; }
    if (roundEl) roundEl.textContent = `Ronda ${round}/${ejercicio.series}`;
    if (labelEl) labelEl.textContent = isWork ? 'TRABAJO' : 'DESCANSO';
  }

  updateDisplay();

  hiitInterval = setInterval(() => {
    if (paused) return;
    timeLeft--;
    if (timeLeft <= 0) {
      if (isWork) {
        if (round >= ejercicio.series) {
          // Done
          clearInterval(hiitInterval);
          workoutState.circuitos[ci].completed = true;
          showToast('HIIT completado!');
          renderCircuits();
          return;
        }
        isWork = false;
        timeLeft = ejercicio.descanso;
      } else {
        isWork = true;
        round++;
        timeLeft = ejercicio.duracion;
      }
    }
    updateDisplay();
  }, 1000);

  pauseBtn?.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.textContent = paused ? '▶' : '⏸';
  });

  stopBtn?.addEventListener('click', () => {
    clearInterval(hiitInterval);
    workoutState.circuitos[ci].completed = true;
    renderCircuits();
  });
}

function finishWorkout(container) {
  clearInterval(timerInterval);
  if (hiitInterval) clearInterval(hiitInterval);

  const usuario = workoutState.usuario;

  // Save progresion for each exercise
  workoutState.circuitos.forEach(c => {
    c.ejercicios.forEach(e => {
      if (e.usaPeso && e.peso) {
        const allReps = e.seriesData.every(s => s.done);
        store.setProgresion(e.nombre, usuario, {
          lastWeight: e.peso,
          completedAllReps: allReps,
        });
      }
    });
  });

  // Save sesion
  const sesion = {
    id: crypto.randomUUID(),
    rutinaId: workoutState.rutinaId,
    rutinaNombre: workoutState.rutinaNombre,
    usuario,
    fecha: workoutState.fecha,
    startTime: workoutState.startTime,
    endTime: new Date().toISOString(),
    duracion: elapsedSeconds,
    circuitos: workoutState.circuitos,
    pendingSync: true,
  };

  store.push(store.KEYS.sesiones, sesion);

  // Show summary
  const minutes = Math.floor(elapsedSeconds / 60);
  const totalSeries = workoutState.circuitos.reduce((sum, c) =>
    sum + c.ejercicios.reduce((s2, e) => s2 + e.seriesData.filter(s => s.done).length, 0), 0);

  container.innerHTML = `
    <div class="workout-summary">
      <div class="workout-summary-title">🎉 Entrenamiento Completado</div>
      <div class="workout-summary-stats">
        <div>
          <div class="workout-stat-value">${minutes}</div>
          <div class="workout-stat-label">minutos</div>
        </div>
        <div>
          <div class="workout-stat-value">${totalSeries}</div>
          <div class="workout-stat-label">series completadas</div>
        </div>
      </div>
      <button class="btn btn-primary btn-lg" id="btn-back-home" style="width:100%;">Volver al inicio</button>
    </div>
  `;

  document.getElementById('btn-back-home')?.addEventListener('click', () => {
    router.navigate('');
  });

  showToast('Entrenamiento guardado ✓');
}
