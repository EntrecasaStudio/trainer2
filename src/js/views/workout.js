import { store } from '../../store.js';
import { router } from '../../router.js';
import { inferUsaPeso } from '../../utils/inferUsaPeso.js';
import { formatTimer } from '../../utils/format.js';
import { showToast } from '../components/toast.js';
import { openEjercicioInfo } from './ejercicios.js';

// ── Persistent workout state (survives navigation) ───────────────────────────
let workoutState = null;
let timerInterval = null;
let elapsedSeconds = 0;
let activeCircuitIdx = 0;
let incremento = 2.5; // kg per step: 1 | 2.5 | 5
let expandedExercises = new Set();

// Called from outside to check if workout is active
export function hasActiveWorkout() {
  return workoutState !== null;
}

export function resumeWorkout(container) {
  if (workoutState) renderWorkout(container);
}

export function mountWorkout(container, params) {
  const [rutinaId, fecha] = params;

  // If resuming existing session
  if (workoutState && workoutState.rutinaId === rutinaId) {
    renderWorkout(container);
    return;
  }

  const rutina = store.findById(store.KEYS.rutinas, rutinaId);
  if (!rutina) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-text">Rutina no encontrada</div></div>`;
    return;
  }

  const usuario = store.getActiveUser();
  elapsedSeconds = 0;
  activeCircuitIdx = 0;
  expandedExercises = new Set([0]); // expand first exercise by default
  incremento = 2.5;

  workoutState = {
    rutinaId:     rutina.id,
    rutinaNombre: rutina.nombre,
    rutinaNumero: rutina.numero,
    usuario,
    fecha:        fecha || new Date().toISOString().slice(0, 10),
    startTime:    new Date().toISOString(),
    circuitos:    rutina.circuitos.map(c => ({
      id:        c.id,
      nombre:    c.nombre,
      completed: false,
      ejercicios: c.ejercicios.map(e => ({
        id:       e.id,
        nombre:   e.nombre,
        tipo:     e.tipo || 'fuerza',
        series:   e.series || 2,
        reps:     e.reps || '8-12',
        duracion: e.duracion,
        descanso: e.descanso,
        usaPeso:  inferUsaPeso(e.nombre),
        // Per-series data: each series has its own reps + peso
        seriesData: Array.from({ length: e.series || 2 }, () => ({
          reps: typeof e.reps === 'number' ? e.reps : parseRepsDefault(e.reps),
          peso: 0,
          done: false,
        })),
      })),
    })),
  };

  // Pre-fill weights from progression
  workoutState.circuitos.forEach(c => {
    c.ejercicios.forEach(e => {
      if (e.usaPeso) {
        const prog = store.getProgresion(e.nombre, usuario);
        if (prog) {
          e.seriesData.forEach(s => { s.peso = prog.lastWeight || 0; });
          e._lastWeight    = prog.lastWeight;
          e._suggestion    = prog.completedAllReps ? prog.lastWeight + incremento : null;
        }
      }
    });
  });

  renderWorkout(container);
}

function parseRepsDefault(reps) {
  if (!reps) return 8;
  if (typeof reps === 'number') return reps;
  const n = parseInt(reps);
  return isNaN(n) ? 8 : n;
}

// ── Main render ──────────────────────────────────────────────────────────────
function renderWorkout(container) {
  if (!workoutState) return;

  startTimer(container);

  const c = workoutState.circuitos[activeCircuitIdx];
  const isHIIT = c.nombre === 'HIIT';

  container.innerHTML = `
    <div class="workout-top-bar">
      <div class="workout-top-left">
        <div class="workout-routine-name">${workoutState.rutinaNombre}</div>
        <div id="workout-timer" class="workout-timer-sm">${formatTimer(elapsedSeconds)}</div>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-salir">Salir</button>
    </div>

    <div class="circuit-tabs-bar">
      ${workoutState.circuitos.map((circ, i) => `
        <button class="circuit-tab ${i === activeCircuitIdx ? 'active' : ''} ${circ.completed ? 'done' : ''}"
                data-idx="${i}">${i + 1}</button>
      `).join('')}
      <button class="circuit-tab-edit" id="btn-edit-during-workout" title="Editar rutina">
        <i class="ph ph-pencil-simple"></i>
      </button>
    </div>

    <div class="circuit-progress-bar">
      <div class="circuit-progress-fill" style="width:${Math.round((workoutState.circuitos.filter(c=>c.completed).length/workoutState.circuitos.length)*100)}%"></div>
    </div>

    <div class="workout-circuit-label">
      <span class="circuit-label-text" style="color:${getCircuitColor(c.nombre)}">${c.nombre}</span>
      ${c.completed ? '<span style="font-size:18px;">✅</span>' : ''}
    </div>

    <div id="exercises-container">
      ${isHIIT ? renderHIITSection(c, activeCircuitIdx) : c.ejercicios.map((e, ei) => renderExerciseCard(e, activeCircuitIdx, ei)).join('')}
    </div>

    ${!isHIIT ? `
    <div class="incremento-bar">
      <span style="font-size:var(--text-xs);color:var(--color-text-muted);margin-right:var(--space-sm);">Incremento:</span>
      ${[1, 2.5, 5].map(v => `
        <button class="incremento-btn ${incremento === v ? 'active' : ''}" data-inc="${v}">${v}kg</button>
      `).join('')}
    </div>` : ''}

    <div class="circuit-nav-row">
      <button class="btn btn-secondary" id="btn-prev-circuit" ${activeCircuitIdx === 0 ? 'disabled' : ''}>
        <i class="ph ph-arrow-left"></i> Anterior
      </button>
      ${activeCircuitIdx < workoutState.circuitos.length - 1
        ? `<button class="btn btn-primary" id="btn-next-circuit">
             Siguiente <i class="ph ph-arrow-right"></i>
           </button>`
        : `<button class="btn btn-primary" id="btn-finish-workout" style="background:var(--color-tag-espalda);color:#1A1A1A;">
             <i class="ph ph-check-circle"></i> Finalizar
           </button>`
      }
    </div>
  `;

  bindEvents(container);
}

function renderExerciseCard(e, ci, ei) {
  const isExpanded = expandedExercises.has(`${ci}-${ei}`);
  const key = `${ci}-${ei}`;

  return `
    <div class="exercise-card ${isExpanded ? 'expanded' : ''} ${e.seriesData.every(s=>s.done) ? 'all-done' : ''}"
         data-ci="${ci}" data-ei="${ei}">
      <div class="exercise-card-header" data-expand-key="${key}">
        <div class="exercise-card-left">
          <div class="exercise-card-name">${e.nombre}</div>
          <div class="exercise-card-meta">
            ${e.seriesData.length} series · ${e.reps}
            ${e.usaPeso && e._lastWeight ? ` · <span style="color:var(--color-accent)">${e._lastWeight}kg</span>` : ''}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:var(--space-sm);">
          ${e.seriesData.every(s=>s.done) ? '<span style="font-size:18px;line-height:1;">✅</span>' : ''}
          <button class="btn-icon info-btn" data-nombre="${e.nombre}" title="Info del ejercicio">
            <i class="ph ph-info" style="font-size:18px;color:var(--color-text-muted);"></i>
          </button>
          <i class="ph ph-caret-${isExpanded?'up':'down'}" style="color:var(--color-text-muted);font-size:16px;pointer-events:none;"></i>
        </div>
      </div>

      ${isExpanded ? `
        <div class="exercise-card-body">
          ${e._suggestion ? `
            <div class="suggestion-banner">
              <i class="ph ph-trend-up"></i> Sugerido: ${e._suggestion}kg (+${incremento}kg)
            </div>` : ''}

          <div class="series-table">
            <div class="series-table-header">
              <span>Serie</span><span>Reps</span><span>Peso (kg)</span><span></span>
            </div>
            ${e.seriesData.map((s, si) => `
              <div class="series-table-row ${s.done ? 'done' : ''}" data-si="${si}">
                <span class="series-label">S${si+1}</span>
                <div class="stepper" data-field="reps" data-ci="${ci}" data-ei="${ei}" data-si="${si}">
                  <button class="stepper-btn" data-action="dec">-</button>
                  <span class="stepper-val">${s.reps}</span>
                  <button class="stepper-btn" data-action="inc">+</button>
                </div>
                ${e.usaPeso ? `
                <div class="stepper" data-field="peso" data-ci="${ci}" data-ei="${ei}" data-si="${si}">
                  <button class="stepper-btn" data-action="dec">-</button>
                  <span class="stepper-val">${s.peso}</span>
                  <button class="stepper-btn" data-action="inc">+</button>
                </div>` : `<span style="color:var(--color-text-muted);font-size:var(--text-xs);">—</span>`}
                <button class="series-done-btn ${s.done ? 'done' : ''}"
                        data-ci="${ci}" data-ei="${ei}" data-si="${si}">
                  <i class="ph ph-check${s.done ? '-circle' : ''}"></i>
                </button>
              </div>
            `).join('')}
          </div>

          <button class="add-serie-btn" data-ci="${ci}" data-ei="${ei}">
            <i class="ph ph-plus"></i> Serie
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

function renderHIITSection(c, ci) {
  const e = c.ejercicios[0];
  if (!e) return '';

  return `
    <div class="hiit-card">
      <div class="exercise-card-name" style="margin-bottom:var(--space-sm);">${e.nombre}</div>
      <div class="hiit-meta">${e.series} rondas · ${e.duracion}s trabajo / ${e.descanso}s descanso</div>

      <div id="hiit-inactive-${ci}">
        <button class="btn btn-primary btn-lg" style="width:100%;margin-top:var(--space-lg);" id="btn-start-hiit">
          <i class="ph ph-play"></i> Iniciar HIIT
        </button>
      </div>

      <div id="hiit-active-${ci}" class="hidden hiit-active">
        <div class="hiit-round-label" id="hiit-round-${ci}">Ronda 1/${e.series}</div>
        <div class="hiit-big-timer work" id="hiit-time-${ci}">${e.duracion}</div>
        <div class="hiit-phase-label" id="hiit-label-${ci}">TRABAJO</div>
        <div class="hiit-controls">
          <button class="btn btn-secondary" id="btn-hiit-pause">
            <i class="ph ph-pause"></i>
          </button>
          <button class="btn btn-danger" id="btn-hiit-stop">
            <i class="ph ph-stop"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ── Event binding ────────────────────────────────────────────────────────────
function bindEvents(container) {
  // Salir button
  container.querySelector('#btn-salir')?.addEventListener('click', () => {
    showExitDialog(container);
  });

  // Circuit tabs
  container.querySelectorAll('.circuit-tab[data-idx]').forEach(tab => {
    tab.addEventListener('click', () => {
      activeCircuitIdx = parseInt(tab.dataset.idx);
      renderWorkout(container);
    });
  });

  // Edit during workout
  container.querySelector('#btn-edit-during-workout')?.addEventListener('click', () => {
    showEditDuringWorkout(container);
  });

  // Incremento buttons
  container.querySelectorAll('.incremento-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      incremento = parseFloat(btn.dataset.inc);
      container.querySelectorAll('.incremento-btn').forEach(b => b.classList.toggle('active', parseFloat(b.dataset.inc) === incremento));
    });
  });

  // Prev / Next circuit
  container.querySelector('#btn-prev-circuit')?.addEventListener('click', () => {
    if (activeCircuitIdx > 0) {
      activeCircuitIdx--;
      renderWorkout(container);
    }
  });

  container.querySelector('#btn-next-circuit')?.addEventListener('click', () => {
    if (activeCircuitIdx < workoutState.circuitos.length - 1) {
      activeCircuitIdx++;
      renderWorkout(container);
    }
  });

  container.querySelector('#btn-finish-workout')?.addEventListener('click', () => {
    finishWorkout(container);
  });

  // Exercise card expand / collapse
  container.querySelectorAll('.exercise-card-header[data-expand-key]').forEach(header => {
    header.addEventListener('click', (evt) => {
      // Don't trigger if clicking info button
      if (evt.target.closest('.info-btn')) return;
      const key = header.dataset.expandKey;
      if (expandedExercises.has(key)) expandedExercises.delete(key);
      else expandedExercises.add(key);
      refreshExercisesContainer(container);
    });
  });

  // Info buttons
  container.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEjercicioInfo(btn.dataset.nombre);
    });
  });

  // Stepper buttons
  container.querySelectorAll('.stepper').forEach(stepper => {
    stepper.querySelectorAll('.stepper-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const { field, ci, ei, si } = stepper.dataset;
        const action = btn.dataset.action;
        const series = workoutState.circuitos[ci].ejercicios[ei].seriesData[si];

        if (field === 'reps') {
          series.reps = Math.max(0, series.reps + (action === 'inc' ? 1 : -1));
        } else if (field === 'peso') {
          series.peso = Math.max(0, parseFloat((series.peso + (action === 'inc' ? incremento : -incremento)).toFixed(2)));
        }

        const valEl = stepper.querySelector('.stepper-val');
        if (valEl) valEl.textContent = field === 'peso' ? series.peso : series.reps;
      });
    });
  });

  // Series done buttons
  container.querySelectorAll('.series-done-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { ci, ei, si } = btn.dataset;
      const series = workoutState.circuitos[ci].ejercicios[ei].seriesData[si];
      series.done = !series.done;

      const ejercicio = workoutState.circuitos[ci].ejercicios[ei];
      const allDone = ejercicio.seriesData.every(s => s.done);

      // Auto-mark circuit complete if all exercises done
      const circ = workoutState.circuitos[ci];
      circ.completed = circ.ejercicios.every(ex => ex.seriesData.every(s => s.done));

      refreshExercisesContainer(container);
      updateCircuitTabs(container);
      updateProgressBar(container);

      // Auto-advance to next circuit when completed
      if (circ.completed && activeCircuitIdx < workoutState.circuitos.length - 1) {
        setTimeout(() => {
          activeCircuitIdx++;
          expandedExercises = new Set([`${activeCircuitIdx}-0`]);
          renderWorkout(container);
        }, 800);
      }
    });
  });

  // Add serie
  container.querySelectorAll('.add-serie-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { ci, ei } = btn.dataset;
      const ejercicio = workoutState.circuitos[ci].ejercicios[ei];
      const last = ejercicio.seriesData[ejercicio.seriesData.length - 1];
      ejercicio.seriesData.push({ reps: last?.reps || 8, peso: last?.peso || 0, done: false });
      refreshExercisesContainer(container);
    });
  });

  // HIIT
  container.querySelector('#btn-start-hiit')?.addEventListener('click', () => {
    startHIIT(container, activeCircuitIdx);
  });
}

function refreshExercisesContainer(container) {
  const exercisesContainer = document.getElementById('exercises-container');
  if (!exercisesContainer) return;
  const c = workoutState.circuitos[activeCircuitIdx];
  if (c.nombre === 'HIIT') return;
  exercisesContainer.innerHTML = c.ejercicios.map((e, ei) => renderExerciseCard(e, activeCircuitIdx, ei)).join('');
  // Rebind just the exercises part
  rebindExerciseEvents(container, exercisesContainer);
}

function rebindExerciseEvents(container, exercisesContainer) {
  // Expand/collapse
  exercisesContainer.querySelectorAll('.exercise-card-header[data-expand-key]').forEach(header => {
    header.addEventListener('click', (evt) => {
      if (evt.target.closest('.info-btn')) return;
      const key = header.dataset.expandKey;
      if (expandedExercises.has(key)) expandedExercises.delete(key);
      else expandedExercises.add(key);
      refreshExercisesContainer(container);
    });
  });
  // Info
  exercisesContainer.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEjercicioInfo(btn.dataset.nombre);
    });
  });
  // Steppers
  exercisesContainer.querySelectorAll('.stepper').forEach(stepper => {
    stepper.querySelectorAll('.stepper-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const { field, ci, ei, si } = stepper.dataset;
        const action = btn.dataset.action;
        const series = workoutState.circuitos[ci].ejercicios[ei].seriesData[si];
        if (field === 'reps') {
          series.reps = Math.max(0, series.reps + (action === 'inc' ? 1 : -1));
        } else {
          series.peso = Math.max(0, parseFloat((series.peso + (action === 'inc' ? incremento : -incremento)).toFixed(2)));
        }
        const valEl = stepper.querySelector('.stepper-val');
        if (valEl) valEl.textContent = field === 'peso' ? series.peso : series.reps;
      });
    });
  });
  // Done buttons
  exercisesContainer.querySelectorAll('.series-done-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { ci, ei, si } = btn.dataset;
      const series = workoutState.circuitos[ci].ejercicios[ei].seriesData[si];
      series.done = !series.done;
      const circ = workoutState.circuitos[ci];
      circ.completed = circ.ejercicios.every(ex => ex.seriesData.every(s => s.done));
      refreshExercisesContainer(container);
      updateCircuitTabs(container);
      updateProgressBar(container);
      if (circ.completed && activeCircuitIdx < workoutState.circuitos.length - 1) {
        setTimeout(() => {
          activeCircuitIdx++;
          expandedExercises = new Set([`${activeCircuitIdx}-0`]);
          renderWorkout(container);
        }, 800);
      }
    });
  });
  // Add serie
  exercisesContainer.querySelectorAll('.add-serie-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { ci, ei } = btn.dataset;
      const ejercicio = workoutState.circuitos[ci].ejercicios[ei];
      const last = ejercicio.seriesData[ejercicio.seriesData.length - 1];
      ejercicio.seriesData.push({ reps: last?.reps || 8, peso: last?.peso || 0, done: false });
      refreshExercisesContainer(container);
    });
  });
}

function updateCircuitTabs(container) {
  workoutState.circuitos.forEach((c, i) => {
    const tab = container.querySelector(`.circuit-tab[data-idx="${i}"]`);
    if (tab) tab.classList.toggle('done', c.completed);
  });
}

function updateProgressBar(container) {
  const fill = container.querySelector('.circuit-progress-fill');
  if (fill) {
    const pct = Math.round((workoutState.circuitos.filter(c=>c.completed).length / workoutState.circuitos.length) * 100);
    fill.style.width = `${pct}%`;
  }
}

// ── Timer ────────────────────────────────────────────────────────────────────
function startTimer(container) {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    const el = document.getElementById('workout-timer');
    if (el) el.textContent = formatTimer(elapsedSeconds);
  }, 1000);
}

// ── Exit dialog ──────────────────────────────────────────────────────────────
function showExitDialog(container) {
  clearInterval(timerInterval);
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <div class="modal-sheet" style="text-align:center;">
      <h2 class="modal-title" style="margin-bottom:var(--space-lg);">¿Qué querés hacer?</h2>
      <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
        <button class="btn btn-primary btn-lg" id="btn-volver">Volver al entrenamiento</button>
        <button class="btn btn-secondary btn-lg" id="btn-pausar">
          <i class="ph ph-pause"></i> Pausar y navegar
        </button>
        <button class="btn btn-secondary btn-lg" id="btn-finalizar-guardar">
          <i class="ph ph-check"></i> Finalizar y guardar
        </button>
        <button class="btn btn-lg" id="btn-descartar" style="color:var(--color-danger);">Descartar</button>
      </div>
    </div>
  `;

  overlay.querySelector('#btn-volver').addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    startTimer(container);
  });

  overlay.querySelector('#btn-pausar').addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    // Navigate away but keep workoutState — workout banner will show
    router.navigate('');
  });

  overlay.querySelector('#btn-finalizar-guardar').addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    finishWorkout(container);
  });

  overlay.querySelector('#btn-descartar').addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    workoutState = null;
    clearInterval(timerInterval);
    router.navigate('');
  });
}

// ── Edit during workout ──────────────────────────────────────────────────────
function showEditDuringWorkout(container) {
  const rutina = store.findById(store.KEYS.rutinas, workoutState.rutinaId);
  if (!rutina) return;

  const candidates = store.getAll(store.KEYS.rutinas).filter(r =>
    r.usuario === workoutState.usuario &&
    r.lugar   === rutina.lugar &&
    r.foco    === rutina.foco
  );

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-header">
        <h2 class="modal-title">Cambiar rutina</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
        ${candidates.map(r => `
          <div class="rutina-list-item ${r.id === rutina.id ? 'selected-rutina' : ''}" data-id="${r.id}">
            <div class="rutina-list-code">${r.numero}</div>
            <div class="rutina-list-name">${r.nombre}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  overlay.querySelector('.modal-close').addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
  });

  overlay.querySelectorAll('.rutina-list-item').forEach(item => {
    item.addEventListener('click', () => {
      const newRutina = store.findById(store.KEYS.rutinas, item.dataset.id);
      if (!newRutina || newRutina.id === rutina.id) {
        overlay.classList.add('hidden');
        overlay.innerHTML = '';
        return;
      }
      // Switch workout to new routine, preserving timer
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
      mountWorkout(container, [newRutina.id, workoutState.fecha]);
    });
  });
}

// ── HIIT timer ───────────────────────────────────────────────────────────────
let hiitInterval = null;

function startHIIT(container, ci) {
  const c = workoutState.circuitos[ci];
  const e = c.ejercicios[0];
  const inactive = document.getElementById(`hiit-inactive-${ci}`);
  const active = document.getElementById(`hiit-active-${ci}`);
  if (inactive) inactive.classList.add('hidden');
  if (active) active.classList.remove('hidden');

  let round = 1, timeLeft = e.duracion, isWork = true, paused = false;

  const timeEl    = document.getElementById(`hiit-time-${ci}`);
  const roundEl   = document.getElementById(`hiit-round-${ci}`);
  const labelEl   = document.getElementById(`hiit-label-${ci}`);
  const pauseBtn  = document.getElementById('btn-hiit-pause');
  const stopBtn   = document.getElementById('btn-hiit-stop');

  function update() {
    if (timeEl) { timeEl.textContent = timeLeft; timeEl.className = `hiit-big-timer ${isWork ? 'work' : 'rest'}`; }
    if (roundEl) roundEl.textContent = `Ronda ${round}/${e.series}`;
    if (labelEl) labelEl.textContent = isWork ? 'TRABAJO' : 'DESCANSO';
  }

  update();
  if (hiitInterval) clearInterval(hiitInterval);
  hiitInterval = setInterval(() => {
    if (paused) return;
    timeLeft--;
    if (timeLeft < 0) {
      if (isWork) {
        if (round >= e.series) {
          clearInterval(hiitInterval);
          c.completed = true;
          showToast('HIIT completado 🔥');
          updateCircuitTabs(container);
          updateProgressBar(container);
          if (active) active.innerHTML = `<div style="text-align:center;padding:var(--space-lg);font-size:var(--text-xl);">🏁 Completado</div>`;
          return;
        }
        isWork = false;
        timeLeft = e.descanso;
      } else {
        isWork = true;
        round++;
        timeLeft = e.duracion;
      }
    }
    update();
  }, 1000);

  pauseBtn?.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.innerHTML = paused ? '<i class="ph ph-play"></i>' : '<i class="ph ph-pause"></i>';
  });

  stopBtn?.addEventListener('click', () => {
    clearInterval(hiitInterval);
    c.completed = true;
    renderWorkout(container);
  });
}

// ── Finish workout ───────────────────────────────────────────────────────────
function finishWorkout(container) {
  clearInterval(timerInterval);
  if (hiitInterval) clearInterval(hiitInterval);

  const usuario = workoutState.usuario;

  // Save progression per exercise (use max peso of all series)
  workoutState.circuitos.forEach(c => {
    c.ejercicios.forEach(e => {
      if (!e.usaPeso) return;
      const doneSeries = e.seriesData.filter(s => s.done && s.peso > 0);
      if (doneSeries.length === 0) return;
      const maxPeso = Math.max(...doneSeries.map(s => s.peso));
      const allReps = e.seriesData.every(s => s.done);
      store.setProgresion(e.nombre, usuario, { lastWeight: maxPeso, completedAllReps: allReps });
    });
  });

  // Save sesion
  const sesion = {
    id:          crypto.randomUUID(),
    rutinaId:    workoutState.rutinaId,
    rutinaNombre: workoutState.rutinaNombre,
    usuario,
    fecha:       workoutState.fecha,
    startTime:   workoutState.startTime,
    endTime:     new Date().toISOString(),
    duracion:    elapsedSeconds,
    circuitos:   workoutState.circuitos,
    pendingSync: true,
  };
  store.push(store.KEYS.sesiones, sesion);

  const minutes    = Math.floor(elapsedSeconds / 60);
  const totalSeries = workoutState.circuitos.reduce((sum, c) =>
    sum + c.ejercicios.reduce((s2, e) => s2 + e.seriesData.filter(s => s.done).length, 0), 0);

  workoutState = null;

  container.innerHTML = `
    <div class="workout-summary">
      <div style="font-size:48px;text-align:center;margin-bottom:var(--space-md);">🏁</div>
      <div class="workout-summary-title">¡Entrenamiento completado!</div>
      <div class="workout-summary-stats">
        <div>
          <div class="workout-stat-value">${minutes}</div>
          <div class="workout-stat-label">minutos</div>
        </div>
        <div>
          <div class="workout-stat-value">${totalSeries}</div>
          <div class="workout-stat-label">series</div>
        </div>
        <div>
          <div class="workout-stat-value">${workoutState === null ? sesion.circuitos.filter(c=>c.completed).length : 0}/${sesion.circuitos.length}</div>
          <div class="workout-stat-label">circuitos</div>
        </div>
      </div>
      <button class="btn btn-primary btn-lg" id="btn-back-home" style="width:100%;margin-top:var(--space-lg);">
        <i class="ph ph-house"></i> Volver al inicio
      </button>
    </div>
  `;

  document.getElementById('btn-back-home')?.addEventListener('click', () => router.navigate(''));
  showToast('Entrenamiento guardado ✓');
}

function getCircuitColor(nombre) {
  const n = (nombre || '').toLowerCase();
  if (n.includes('pierna') || n.includes('core')) return 'var(--color-tag-piernas)';
  if (n.includes('pecho')) return 'var(--color-tag-pecho)';
  if (n.includes('espalda')) return 'var(--color-tag-espalda)';
  if (n.includes('brazo')) return 'var(--color-tag-brazos)';
  if (n.includes('glúteo') || n.includes('gluteo')) return 'var(--color-tag-gluteos)';
  if (n.includes('hombro')) return 'var(--color-tag-hombros)';
  if (n.includes('hiit')) return 'var(--color-tag-hiit)';
  return 'var(--color-text)';
}
