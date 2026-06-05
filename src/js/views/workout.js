import { store } from '../../store.js';
import { router } from '../../router.js';
import { inferUsaPeso } from '../../utils/inferUsaPeso.js';
import { formatTimer } from '../../utils/format.js';
import { formatDateISO } from '../../utils/calendar.js';
import { showToast, showToastAction } from '../components/toast.js';
import { openEjercicioInfo } from './ejercicios.js';
import { EJERCICIOS_CATALOGO, GRUPOS_MUSCULARES, searchEjercicios } from '../../ejercicios-catalogo.js';

// Patterns where the chaleco doesn't add real load (handheld weight isolated
// movements) or isn't advisable (axial load on spinal mobility drills).
const NO_CHALECO_PATTERNS = [
  'press militar', 'arnold press', 'vuelos laterales',
  'bíceps curl',
  'extensión de tríceps', 'extension de triceps',
  'hollow body',
  'remo',
  'swing',
  'rotación torácica', 'rotacion toracica',
  'rotación de hombros', 'rotacion de hombros', 'movilidad de hombros',
  'abs complex',
  '90/90', 'mobility',
  'dead bug',
  'floor press',
  'banda',
];
const CHALECO_OVERRIDE = ['bíceps curl en trx', 'remo alto en trx'];
function chalecoApplies(nombre) {
  const n = (nombre || '').toLowerCase();
  if (CHALECO_OVERRIDE.some(p => n.includes(p))) return true;
  return !NO_CHALECO_PATTERNS.some(p => n.includes(p));
}

// Default kettlebell weight when no progression data exists yet
function defaultKettlebellWeight(nombre, usuario) {
  const n = (nombre || '').toLowerCase();
  if (!n.includes('kettlebell')) return null;
  if (n.includes('suave')) return null; // recovery exercises stay at 0
  return usuario === 'Lean' ? 12 : 8;
}

// BC Strength miniband exercises — track per-series size (Sm/Lg) + level (1-3)
const BANDA_MINI_PATTERNS = [
  'banda lateral walk', 'loop band',
];
function bandaAplica(nombre) {
  const n = (nombre || '').toLowerCase();
  return BANDA_MINI_PATTERNS.some(p => n.includes(p));
}
// Pick the most recent banda values for this exercise/user from past sesiones
function lastBandaValues(nombre, usuario) {
  try {
    const sesiones = store.getAll(store.KEYS.sesiones) || [];
    for (let i = sesiones.length - 1; i >= 0; i--) {
      const s = sesiones[i];
      if (s.usuario !== usuario) continue;
      for (const c of (s.circuitos || [])) {
        for (const e of (c.ejercicios || [])) {
          if (e.nombre !== nombre) continue;
          const sr = (e.seriesData || []).find(x => x.bandaSize || x.bandaNivel);
          if (sr) return { size: sr.bandaSize || 'sm', nivel: sr.bandaNivel || 1 };
        }
      }
    }
  } catch {}
  return null;
}

// Pick the most recent chaleco peso for this exercise/user from past sesiones
function lastChalecoPeso(nombre, usuario) {
  try {
    const sesiones = store.getAll(store.KEYS.sesiones) || [];
    for (let i = sesiones.length - 1; i >= 0; i--) {
      const s = sesiones[i];
      if (s.usuario !== usuario) continue;
      for (const c of (s.circuitos || [])) {
        for (const e of (c.ejercicios || [])) {
          if (e.nombre !== nombre) continue;
          if (e.chaleco && e.chalecoPeso > 0) return e.chalecoPeso;
        }
      }
    }
  } catch {}
  return null;
}

// Pick the reps from the most recent session where this exercise was done
// (prefers same lugar, falls back to any lugar). Only counts series marked done.
function lastRepsValue(nombre, usuario, lugar) {
  try {
    const sesiones = store.getAll(store.KEYS.sesiones) || [];
    const sorted = [...sesiones].sort((a, b) =>
      (b.fecha || '').localeCompare(a.fecha || '') ||
      (b.startTime || '').localeCompare(a.startTime || '')
    );
    const findIn = (matchLugar) => {
      for (const s of sorted) {
        if (s.usuario !== usuario) continue;
        if (matchLugar && s.lugar !== lugar) continue;
        for (const c of (s.circuitos || [])) {
          for (const e of (c.ejercicios || [])) {
            if (e.nombre !== nombre) continue;
            const series = e.seriesData || [];
            if (series.length > 0 && typeof series[0].reps === 'number' && series[0].reps > 0) {
              return series[0].reps;
            }
          }
        }
      }
      return null;
    };
    return findIn(true) ?? findIn(false);
  } catch {
    return null;
  }
}

// ── SVG icons ────────────────────────────────────────────────────────────────
const SVG_CHECK = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

// ── Auto-derive muscle groups from exercises ────────────────────────────────
function getCircuitGrupos(circ) {
  const freq = new Map();
  for (const ej of circ.ejercicios) {
    const cat = EJERCICIOS_CATALOGO.find(c => c.nombre === ej.nombre);
    if (cat?.grupo) freq.set(cat.grupo, (freq.get(cat.grupo) || 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([g]) => g);
}

const TAG_CLASS = {
  Core: 'tag-core', Piernas: 'tag-piernas', Pecho: 'tag-pecho',
  Espalda: 'tag-espalda', Brazos: 'tag-brazos', 'Glúteos': 'tag-gluteos',
  Hombros: 'tag-hombros', Cardio: 'tag-cardio', HIIT: 'tag-hiit',
};

// ── Persistent workout state (survives navigation + page reload) ─────────────
let workoutState = null;
let finishedSummary = null;
let timerInterval = null;
let elapsedSeconds = 0;
let activeCircuitIdx = 0;
let incremento = 2.5;
let expandedExercises = new Set();
let editMode = false;

const WS_KEY = 'gym_active_workout';

function persistWorkout() {
  if (!workoutState) { localStorage.removeItem(WS_KEY); return; }
  localStorage.setItem(WS_KEY, JSON.stringify({
    workoutState, elapsedSeconds, activeCircuitIdx, incremento,
    savedAt: Date.now(),
  }));
}

function restoreWorkout() {
  try {
    const raw = localStorage.getItem(WS_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    // Discard sessions older than 6 hours
    if (data.savedAt && Date.now() - data.savedAt > 6 * 60 * 60 * 1000) {
      localStorage.removeItem(WS_KEY);
      return false;
    }
    workoutState = data.workoutState;
    elapsedSeconds = getElapsedSeconds();
    activeCircuitIdx = data.activeCircuitIdx || 0;
    incremento = data.incremento || 2.5;
    return true;
  } catch { return false; }
}

window.addEventListener('beforeunload', () => { persistWorkout(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    persistWorkout();
  } else if (workoutState) {
    // Screen turned back on — resync timer from startTime
    elapsedSeconds = getElapsedSeconds();
    const el = document.getElementById('workout-timer');
    if (el) el.textContent = formatTimer(elapsedSeconds);
  }
});

export function hasActiveWorkout() { return workoutState !== null; }

export function resumeWorkout(container) {
  if (workoutState) renderWorkout(container);
}

export function mountWorkout(container, params) {
  const [rutinaId, fecha] = params;

  if (finishedSummary) {
    renderSummary(container);
    return;
  }

  if (workoutState && workoutState.rutinaId === rutinaId) {
    renderWorkout(container);
    return;
  }

  if (!workoutState && restoreWorkout()) {
    if (!rutinaId || workoutState.rutinaId === rutinaId) {
      renderWorkout(container);
      return;
    }
  }

  const rutina = store.findById(store.KEYS.rutinas, rutinaId);
  if (!rutina) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-text">Rutina no encontrada</div></div>`;
    return;
  }

  const usuario = store.getActiveUser();
  elapsedSeconds = 0;
  activeCircuitIdx = 0;
  incremento = 2.5;
  editMode = false;
  expandedExercises = new Set();

  workoutState = {
    rutinaId: rutina.id,
    rutinaNombre: rutina.nombre,
    rutinaNumero: rutina.numero,
    lugar: rutina.lugar || 'SPORT_FITNESS',
    usuario,
    fecha: fecha || formatDateISO(new Date()),
    startTime: new Date().toISOString(),
    circuitos: rutina.circuitos.map(c => ({
      id: c.id,
      nombre: c.nombre || (Array.isArray(c.grupoMuscular) ? c.grupoMuscular.join(' · ') : (typeof c.grupoMuscular === 'string' ? c.grupoMuscular : 'Circuito')),
      completed: false,
      ejercicios: c.ejercicios.map(e => ({
        id: e.id,
        nombre: e.nombre,
        tipo: e.tipo || 'fuerza',
        series: e.series || 2,
        reps: e.reps || e.repsObjetivo || '8-12',
        duracion: e.duracion,
        descanso: e.descanso,
        usaPeso: inferUsaPeso(e.nombre),
        seriesData: Array.from({ length: e.series || 2 }, () => ({
          reps: typeof (e.reps || e.repsObjetivo) === 'number' ? (e.reps || e.repsObjetivo) : parseRepsDefault(e.reps || e.repsObjetivo),
          peso: 0,
          done: false,
        })),
      })),
    })),
  };

  // Pre-fill weights from progression (lugar-aware)
  const lugar = workoutState.lugar;
  workoutState.circuitos.forEach(c => {
    c.ejercicios.forEach(e => {
      if (e.usaPeso) {
        const prog = store.getProgresion(e.nombre, usuario, lugar);
        if (prog) {
          e.seriesData.forEach(s => { s.peso = prog.lastWeight || 0; });
          e._lastWeight = prog.lastWeight;
          const count = prog.consecutiveComplete ?? (prog.completedAllReps ? 1 : 0);
          const cat = EJERCICIOS_CATALOGO.find(c => c.nombre === e.nombre);
          const smartInc = cat?.tipo === 'maquina' ? 2.5 : 1;
          if (count >= 2) {
            e._suggestion = prog.lastWeight + smartInc;
            e._sugInc = smartInc;
          } else if (count === 1) {
            e._progressCount = 1;
          }
        } else {
          const kbDefault = defaultKettlebellWeight(e.nombre, usuario);
          if (kbDefault != null) {
            e.seriesData.forEach(s => { s.peso = kbDefault; });
          }
        }
      }
      // Pre-fill banda size/nivel from last session for miniband exercises
      if (bandaAplica(e.nombre)) {
        const last = lastBandaValues(e.nombre, usuario) || { size: 'sm', nivel: 1 };
        e.seriesData.forEach(s => {
          if (s.bandaSize == null) s.bandaSize = last.size;
          if (s.bandaNivel == null) s.bandaNivel = last.nivel;
        });
      }
      // Pre-fill reps from last session (overrides template if user progressed)
      const lastReps = lastRepsValue(e.nombre, usuario, lugar);
      if (lastReps != null) {
        e.seriesData.forEach(s => { s.reps = lastReps; });
      }
    });
  });

  persistWorkout();
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

  container.innerHTML = `
    <div class="workout-top-bar">
      <div class="workout-top-left">
        <div class="workout-routine-name">${workoutState.rutinaNombre}</div>
        <div id="workout-timer" class="workout-timer-sm">${formatTimer(elapsedSeconds)}</div>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-salir">Salir</button>
    </div>

    <div class="circuit-tabs-wrap">
      <div class="circuit-tabs-bar">
        ${workoutState.circuitos.map((circ, i) => `
          <button class="circuit-tab ${i === activeCircuitIdx ? 'active' : ''} ${circ.completed ? 'done' : ''}"
                  data-idx="${i}">
            ${circ.completed ? SVG_CHECK : i + 1}
            ${editMode && workoutState.circuitos.length > 1 ? `<span class="circuit-tab-remove" data-remove-ci="${i}">×</span>` : ''}
          </button>
        `).join('')}
        ${editMode ? `<button class="circuit-tab-add" id="btn-add-circuit" title="Agregar circuito"><i class="ph ph-plus"></i></button>` : ''}
        <button class="circuit-tab-edit ${editMode ? 'edit-active' : ''}" id="btn-toggle-edit" title="Editar">
          <i class="ph ph-pencil-simple"></i>
        </button>
      </div>
      <div class="circuit-progress-bar">
        <div class="circuit-progress-fill" style="width:${getOverallProgress()}%"></div>
      </div>
    </div>

    <div class="workout-circuit-label">
      <span class="circuit-label-text" style="color:${getCircuitColor(c.nombre)}">${c.nombre}</span>
      ${c.completed ? `<span class="circuit-done-check">${SVG_CHECK}</span>` : ''}
      <div class="circuit-grupo-tags">
        ${getCircuitGrupos(c).map(g => `<span class="tag tag-sm ${TAG_CLASS[g] || ''}">${g}</span>`).join('')}
      </div>
    </div>

    <div id="exercises-container">
      ${c.ejercicios.map((e, ei) => renderExerciseCard(e, activeCircuitIdx, ei)).join('')}
      ${editMode ? `<button class="btn-add-ej" data-ci="${activeCircuitIdx}"><i class="ph ph-plus" style="font-size:14px;"></i> Ejercicio</button>` : ''}
    </div>

    <div class="incremento-bar">
      <span style="font-size:var(--text-xs);color:var(--color-text-muted);margin-right:var(--space-sm);">Incremento:</span>
      ${[1, 2.5, 5].map(v => `
        <button class="incremento-btn ${incremento === v ? 'active' : ''}" data-inc="${v}">${v}kg</button>
      `).join('')}
    </div>

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

// ── Exercise card (v1-style: collapsed summary+check, expanded steppers) ────
function renderExerciseCard(e, ci, ei) {
  const key = `${ci}-${ei}`;
  const isExpanded = expandedExercises.has(key);
  const totalSeries = e.seriesData.length;
  const doneCount = e.seriesData.filter(s => s.done).length;
  const allDone = doneCount === totalSeries;
  const circ = workoutState.circuitos[ci];
  const canRemove = editMode && circ.ejercicios.length > 1;

  const chalecoExtra = e.chaleco ? (e.chalecoPeso || 0) : 0;
  const summaryParts = [`${totalSeries} series`];
  if (e.seriesData[0]) summaryParts.push(`${e.seriesData[0].reps} rep`);
  if (e.usaPeso && e.seriesData[0]) {
    const effective = (e.seriesData[0].peso || 0) + chalecoExtra;
    summaryParts.push(`${effective} kg${chalecoExtra ? ` (+${chalecoExtra} chaleco)` : ''}`);
  } else if (chalecoExtra) {
    summaryParts.push(`${chalecoExtra} kg chaleco`);
  }
  if (doneCount > 0) summaryParts.push(`${doneCount}/${totalSeries} ✓`);
  const summaryText = summaryParts.join(' · ');

  return `
    <div class="exercise-card ${isExpanded ? 'expanded' : ''} ${allDone ? 'all-done' : ''}" data-ci="${ci}" data-ei="${ei}">
      <div class="exercise-card-header" data-expand-key="${key}">
        <div class="exercise-name-group">
          ${editMode ? `<i class="ph ph-dots-six-vertical drag-handle" style="font-size:20px;color:var(--color-text-muted);cursor:grab;touch-action:none;flex-shrink:0;"></i>` : ''}
          <div class="exercise-card-name">${e.nombre}</div>
          <button class="btn-icon info-btn" data-nombre="${e.nombre}" title="Info">
            <i class="ph ph-info" style="font-size:20px;color:var(--color-text-muted);"></i>
          </button>
        </div>
        <div style="display:flex;align-items:center;gap:4px;">
          ${editMode ? `
            <button class="btn-icon edit-action-btn" data-action="replace-exercise" data-ci="${ci}" data-ei="${ei}" title="Reemplazar">
              <i class="ph ph-swap" style="font-size:18px;color:var(--color-text-muted);"></i>
            </button>
            ${canRemove ? `
            <button class="btn-icon edit-action-btn" data-action="remove-exercise" data-ci="${ci}" data-ei="${ei}" title="Quitar">
              <i class="ph ph-trash" style="font-size:18px;color:var(--color-danger);"></i>
            </button>` : ''}
          ` : ''}
        </div>
      </div>

      <div class="exercise-collapse-wrap ${isExpanded ? '' : 'show'}" data-summary-key="${key}">
        <div class="exercise-collapse-inner">
          <div class="exercise-summary">
            <span>${summaryText}</span>
            <button class="check-all-btn ${allDone ? 'all-done' : ''}" data-ci="${ci}" data-ei="${ei}">
              <i class="${allDone ? 'ph-fill' : 'ph'} ph-check-circle" style="font-size:24px;"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="exercise-collapse-wrap ${isExpanded ? 'show' : ''}" data-body-key="${key}">
        <div class="exercise-collapse-inner">
          <div class="exercise-body">
        ${(() => {
          const cat = EJERCICIOS_CATALOGO.find(c => c.nombre === e.nombre);
          const isFuncional = cat?.tipo === 'funcional';
          return isFuncional && chalecoApplies(e.nombre) ? `
        <div class="peso-toggle-row">
          <button class="chaleco-toggle-btn ${e.chaleco ? 'active' : ''}" data-ci="${ci}" data-ei="${ei}" title="Chaleco">
            <i class="${e.chaleco ? 'ph-fill' : 'ph'} ph-check-circle" style="font-size:20px;"></i>
            <i class="ph ph-shield-plus" style="font-size:14px;"></i> Chaleco
          </button>
          ${e.chaleco ? `
          <div class="chaleco-peso-input" style="display:flex;align-items:center;gap:4px;margin-left:var(--space-sm);">
            <input type="number" class="stepper-input chaleco-peso-field" data-ci="${ci}" data-ei="${ei}" value="${e.chalecoPeso || 0}" inputmode="decimal" style="width:60px;text-align:center;">
            <span style="font-size:var(--text-xs);color:var(--color-text-muted);">kg</span>
          </div>` : ''}
        </div>` : '';
        })()}
        ${e._suggestion ? `
          <div class="suggestion-banner">
            <i class="ph ph-trend-up"></i> +${e._sugInc}kg sugerido (→ ${e._suggestion}kg)
          </div>` : e._progressCount === 1 ? `
          <div class="suggestion-banner suggestion-banner--progress">
            <i class="ph ph-timer"></i> 1/2 sesiones — mantener peso
          </div>` : ''}

        <div class="vuelta-headers">
          <span>Reps</span>
          ${e.usaPeso ? '<span>Peso (kg)</span>' : ''}
          <span class="vuelta-header-right"></span>
        </div>

        ${(() => {
          const showBanda = bandaAplica(e.nombre);
          return e.seriesData.map((s, si) => `
          <div class="vuelta-row ${s.done ? 'vuelta-done' : ''}">
            <div class="vuelta-left">
              <div class="vuelta-group">
                <div class="stepper stepper-sm">
                  <button class="stepper-btn" data-action="dec" data-field="reps" data-ci="${ci}" data-ei="${ei}" data-si="${si}">−</button>
                  <input type="number" class="stepper-input" data-field="reps" data-ci="${ci}" data-ei="${ei}" data-si="${si}" value="${s.reps}" inputmode="numeric">
                  <button class="stepper-btn" data-action="inc" data-field="reps" data-ci="${ci}" data-ei="${ei}" data-si="${si}">+</button>
                </div>
              </div>
              ${e.usaPeso ? `
              <div class="vuelta-group">
                <div class="stepper stepper-sm">
                  <button class="stepper-btn" data-action="dec" data-field="peso" data-ci="${ci}" data-ei="${ei}" data-si="${si}">−</button>
                  <input type="number" class="stepper-input" data-field="peso" data-ci="${ci}" data-ei="${ei}" data-si="${si}" value="${s.peso}" inputmode="decimal">
                  <button class="stepper-btn" data-action="inc" data-field="peso" data-ci="${ci}" data-ei="${ei}" data-si="${si}">+</button>
                </div>
              </div>` : ''}
              ${showBanda ? `
              <div class="banda-selector">
                <button class="banda-size-btn" data-ci="${ci}" data-ei="${ei}" data-si="${si}" title="Tamaño">${(s.bandaSize || 'sm') === 'lg' ? 'Lg' : 'Sm'}</button>
                <div class="banda-level-group">
                  ${[1,2,3].map(n => `<button class="banda-level-btn ${(s.bandaNivel || 1) === n ? 'active' : ''}" data-ci="${ci}" data-ei="${ei}" data-si="${si}" data-nivel="${n}">${n}</button>`).join('')}
                </div>
              </div>` : ''}
            </div>
            <div class="vuelta-right">
              <span class="vuelta-label">S${si + 1}</span>
              <button class="vuelta-check" data-ci="${ci}" data-ei="${ei}" data-si="${si}">
                <i class="${s.done ? 'ph-fill' : 'ph'} ph-check-circle" style="font-size:22px;"></i>
              </button>
              ${totalSeries > 1 ? `
              <button class="vuelta-remove" data-ci="${ci}" data-ei="${ei}" data-si="${si}" title="Quitar serie">
                <i class="ph ph-x" style="font-size:14px;"></i>
              </button>` : ''}
            </div>
          </div>
        `).join('');
        })()}

        <button class="add-serie-btn" data-ci="${ci}" data-ei="${ei}">
          <i class="ph ph-plus"></i> Serie
        </button>
          </div>
        </div>
      </div>
    </div>
  `;
}


// ── Event binding (delegated where possible) ────────────────────────────────
function bindEvents(container) {
  container.querySelector('#btn-salir')?.addEventListener('click', () => showExitDialog(container));

  container.querySelectorAll('.circuit-tab[data-idx]').forEach(tab => {
    tab.addEventListener('click', (e) => {
      if (e.target.closest('.circuit-tab-remove')) return;
      activeCircuitIdx = parseInt(tab.dataset.idx);
      renderWorkout(container);
    });
  });

  // Toggle edit mode
  container.querySelector('#btn-toggle-edit')?.addEventListener('click', () => {
    editMode = !editMode;
    renderWorkout(container);
  });

  // Add circuit (edit mode)
  container.querySelector('#btn-add-circuit')?.addEventListener('click', () => {
    const newCircuit = {
      id: crypto.randomUUID(),
      nombre: `CIRCUITO ${workoutState.circuitos.length + 1}`,
      completed: false,
      ejercicios: [{
        id: crypto.randomUUID(),
        nombre: 'Nuevo ejercicio',
        tipo: 'fuerza',
        series: 2,
        reps: '8-12',
        usaPeso: false,
        seriesData: [{ reps: 8, peso: 0, done: false }, { reps: 8, peso: 0, done: false }],
      }],
    };
    workoutState.circuitos.push(newCircuit);
    activeCircuitIdx = workoutState.circuitos.length - 1;
    persistWorkout();
    renderWorkout(container);
    showToastAction('Circuito agregado', '↺ Deshacer', () => {
      workoutState.circuitos.pop();
      activeCircuitIdx = Math.min(activeCircuitIdx, workoutState.circuitos.length - 1);
      persistWorkout();
      renderWorkout(container);
    });
  });

  // Remove circuit (edit mode)
  container.querySelectorAll('.circuit-tab-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ci = parseInt(btn.dataset.removeCi);
      if (workoutState.circuitos.length <= 1) return;
      const removed = workoutState.circuitos.splice(ci, 1)[0];
      const prevIdx = activeCircuitIdx;
      if (activeCircuitIdx >= workoutState.circuitos.length) activeCircuitIdx = workoutState.circuitos.length - 1;
      persistWorkout();
      renderWorkout(container);
      showToastAction('Circuito eliminado', '↺ Deshacer', () => {
        workoutState.circuitos.splice(ci, 0, removed);
        activeCircuitIdx = prevIdx;
        persistWorkout();
        renderWorkout(container);
      });
    });
  });

  container.querySelectorAll('.incremento-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      incremento = parseFloat(btn.dataset.inc);
      container.querySelectorAll('.incremento-btn').forEach(b => b.classList.toggle('active', parseFloat(b.dataset.inc) === incremento));
    });
  });

  container.querySelector('#btn-prev-circuit')?.addEventListener('click', () => {
    if (activeCircuitIdx > 0) { activeCircuitIdx--; renderWorkout(container); }
  });
  container.querySelector('#btn-next-circuit')?.addEventListener('click', () => {
    if (activeCircuitIdx < workoutState.circuitos.length - 1) { activeCircuitIdx++; renderWorkout(container); }
  });
  container.querySelector('#btn-finish-workout')?.addEventListener('click', () => finishWorkout(container));

  bindExerciseEvents(container, container);
  if (editMode) initDragReorder(container);
}

// ── Drag-to-reorder exercises within a circuit ───────────────────────────────
function initDragReorder(container) {
  const exercisesContainer = container.querySelector('#exercises-container');
  if (!exercisesContainer) return;

  let dragEl = null;
  let placeholder = null;
  let startY = 0;
  let offsetY = 0;
  let cards = [];

  exercisesContainer.querySelectorAll('.drag-handle').forEach(handle => {
    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragEl = handle.closest('.exercise-card');
      if (!dragEl) return;

      const rect = dragEl.getBoundingClientRect();
      startY = e.clientY;
      offsetY = e.clientY - rect.top;

      placeholder = document.createElement('div');
      placeholder.className = 'drag-placeholder';
      placeholder.style.height = rect.height + 'px';

      dragEl.style.position = 'fixed';
      dragEl.style.top = rect.top + 'px';
      dragEl.style.left = rect.left + 'px';
      dragEl.style.width = rect.width + 'px';
      dragEl.style.zIndex = '1000';
      dragEl.style.opacity = '0.9';
      dragEl.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
      dragEl.style.transition = 'none';
      dragEl.style.pointerEvents = 'none';

      dragEl.parentNode.insertBefore(placeholder, dragEl);

      cards = [...exercisesContainer.querySelectorAll('.exercise-card:not([style*="position: fixed"])')];

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp, { once: true });
    });
  });

  function onMove(e) {
    if (!dragEl) return;
    const y = e.clientY - offsetY;
    dragEl.style.top = y + 'px';

    const centerY = e.clientY;
    for (const card of cards) {
      const r = card.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      if (centerY < mid) {
        exercisesContainer.insertBefore(placeholder, card);
        return;
      }
    }
    const addBtn = exercisesContainer.querySelector('.btn-add-ej');
    exercisesContainer.insertBefore(placeholder, addBtn || null);
  }

  function onUp() {
    document.removeEventListener('pointermove', onMove);
    if (!dragEl || !placeholder) return;

    dragEl.style.position = '';
    dragEl.style.top = '';
    dragEl.style.left = '';
    dragEl.style.width = '';
    dragEl.style.zIndex = '';
    dragEl.style.opacity = '';
    dragEl.style.boxShadow = '';
    dragEl.style.transition = '';
    dragEl.style.pointerEvents = '';

    placeholder.replaceWith(dragEl);

    const newOrder = [...exercisesContainer.querySelectorAll('.exercise-card')].map(c => parseInt(c.dataset.ei));
    const circ = workoutState.circuitos[activeCircuitIdx];
    const reordered = newOrder.map(i => circ.ejercicios[i]);
    circ.ejercicios = reordered;
    persistWorkout();
    renderWorkout(container);

    dragEl = null;
    placeholder = null;
    cards = [];
  }
}

function bindExerciseEvents(container, scope) {
  // Expand/collapse — header tap (no chevron)
  scope.querySelectorAll('.exercise-card-header[data-expand-key]').forEach(header => {
    header.addEventListener('click', (evt) => {
      if (evt.target.closest('.btn-icon') || evt.target.closest('.edit-action-btn') || evt.target.closest('.drag-handle')) return;
      toggleExpand(header.dataset.expandKey, container);
    });
  });

  // Check-all button (collapsed)
  scope.querySelectorAll('.check-all-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { ci, ei } = btn.dataset;
      const ejercicio = workoutState.circuitos[ci].ejercicios[ei];
      const allDone = ejercicio.seriesData.every(s => s.done);
      ejercicio.seriesData.forEach(s => { s.done = !allDone; });
      checkCircuitCompletion(ci);
      persistWorkout();
      refreshExercises(container);
    });
  });

  // Info buttons
  scope.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEjercicioInfo(btn.dataset.nombre, ({ renamed, oldName, newName } = {}) => {
        if (renamed) {
          workoutState.circuitos.forEach(c => {
            c.ejercicios.forEach(ej => { if (ej.nombre === oldName) ej.nombre = newName; });
          });
        }
        workoutState.circuitos.forEach(c => {
          c.ejercicios.forEach(ej => { ej.usaPeso = inferUsaPeso(ej.nombre); });
        });
        persistWorkout();
        renderWorkout(document.getElementById('view-container'));
      });
    });
  });

  // Stepper buttons
  scope.querySelectorAll('.stepper-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { action, field, ci, ei, si } = btn.dataset;
      const series = workoutState.circuitos[ci].ejercicios[ei].seriesData[si];
      if (field === 'reps') {
        series.reps = Math.max(0, series.reps + (action === 'inc' ? 1 : -1));
      } else {
        series.peso = Math.max(0, parseFloat((series.peso + (action === 'inc' ? incremento : -incremento)).toFixed(2)));
      }
      const valEl = btn.closest('.stepper')?.querySelector('.stepper-input');
      if (valEl) {
        valEl.value = field === 'peso' ? series.peso : series.reps;
        valEl.classList.remove('value-bump');
        void valEl.offsetWidth;
        valEl.classList.add('value-bump');
      }
      persistWorkout();
    });
  });

  // Stepper direct input (exclude chaleco peso which has its own handler)
  scope.querySelectorAll('.stepper-input:not(.chaleco-peso-field)').forEach(input => {
    let debounceTimer;
    const save = () => {
      clearTimeout(debounceTimer);
      const { field, ci, ei, si } = input.dataset;
      const series = workoutState.circuitos[ci].ejercicios[ei].seriesData[si];
      const val = parseFloat(input.value) || 0;
      if (field === 'reps') {
        series.reps = Math.max(0, Math.round(val));
      } else {
        series.peso = Math.max(0, parseFloat(val.toFixed(2)));
      }
      persistWorkout();
    };
    input.addEventListener('input', () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(save, 600); });
    input.addEventListener('change', () => save());
    input.addEventListener('focus', () => { input.select(); });
  });

  // Chaleco toggle
  scope.querySelectorAll('.chaleco-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { ci, ei } = btn.dataset;
      const ejercicio = workoutState.circuitos[ci].ejercicios[ei];
      ejercicio.chaleco = !ejercicio.chaleco;
      if (ejercicio.chaleco && !ejercicio.chalecoPeso) {
        const last = lastChalecoPeso(ejercicio.nombre, workoutState.usuario);
        ejercicio.chalecoPeso = last || 9;
      }
      if (!ejercicio.chaleco) ejercicio.chalecoPeso = 0;
      persistWorkout();
      refreshExercises(container);
    });
  });

  // Chaleco peso input — no refreshExercises to avoid destroying the input on iPad
  scope.querySelectorAll('.chaleco-peso-field').forEach(input => {
    let debounceTimer;
    const save = () => {
      clearTimeout(debounceTimer);
      const { ci, ei } = input.dataset;
      const ejercicio = workoutState.circuitos[ci].ejercicios[ei];
      ejercicio.chalecoPeso = Math.max(0, parseFloat(input.value) || 0);
      persistWorkout();
    };
    input.addEventListener('input', () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(save, 600); });
    input.addEventListener('change', () => save());
    input.addEventListener('focus', () => { input.select(); });
  });

  // Banda size toggle (sm/lg)
  scope.querySelectorAll('.banda-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { ci, ei, si } = btn.dataset;
      const s = workoutState.circuitos[ci].ejercicios[ei].seriesData[si];
      s.bandaSize = (s.bandaSize || 'sm') === 'sm' ? 'lg' : 'sm';
      persistWorkout();
      refreshExercises(container);
    });
  });

  // Banda level (1/2/3)
  scope.querySelectorAll('.banda-level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { ci, ei, si, nivel } = btn.dataset;
      const s = workoutState.circuitos[ci].ejercicios[ei].seriesData[si];
      s.bandaNivel = parseInt(nivel);
      persistWorkout();
      refreshExercises(container);
    });
  });

  // Series done
  scope.querySelectorAll('.vuelta-check').forEach(btn => {
    btn.addEventListener('click', () => {
      const { ci, ei, si } = btn.dataset;
      const series = workoutState.circuitos[ci].ejercicios[ei].seriesData[si];
      series.done = !series.done;
      checkCircuitCompletion(ci);
      persistWorkout();
      refreshExercises(container);
    });
  });

  // Remove serie
  scope.querySelectorAll('.vuelta-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const { ci, ei, si } = btn.dataset;
      const ejercicio = workoutState.circuitos[ci].ejercicios[ei];
      if (ejercicio.seriesData.length > 1) {
        ejercicio.seriesData.splice(parseInt(si), 1);
        persistWorkout();
        refreshExercises(container);
      }
    });
  });

  // Add serie
  scope.querySelectorAll('.add-serie-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { ci, ei } = btn.dataset;
      const ejercicio = workoutState.circuitos[ci].ejercicios[ei];
      const last = ejercicio.seriesData[ejercicio.seriesData.length - 1];
      const newSerie = { reps: last?.reps || 8, peso: last?.peso || 0, done: false };
      if (bandaAplica(ejercicio.nombre)) {
        newSerie.bandaSize = last?.bandaSize || 'sm';
        newSerie.bandaNivel = last?.bandaNivel || 1;
      }
      ejercicio.seriesData.push(newSerie);
      persistWorkout();
      refreshExercises(container);
    });
  });

  // Edit mode: add exercise to circuit
  scope.querySelectorAll('.btn-add-ej').forEach(btn => {
    btn.addEventListener('click', () => {
      const ci = parseInt(btn.dataset.ci);
      showExercisePicker(container, ci, null);
    });
  });

  // Edit mode: replace exercise
  scope.querySelectorAll('[data-action="replace-exercise"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ci = parseInt(btn.dataset.ci);
      const ei = parseInt(btn.dataset.ei);
      showExercisePicker(container, ci, ei);
    });
  });

  // Edit mode: remove exercise
  scope.querySelectorAll('[data-action="remove-exercise"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ci = parseInt(btn.dataset.ci);
      const ei = parseInt(btn.dataset.ei);
      const circ = workoutState.circuitos[ci];
      if (circ.ejercicios.length > 1) {
        const removed = circ.ejercicios.splice(ei, 1)[0];
        persistWorkout();
        refreshExercises(container);
        showToastAction('Ejercicio eliminado', '↺ Deshacer', () => {
          circ.ejercicios.splice(ei, 0, removed);
          persistWorkout();
          refreshExercises(container);
        });
      }
    });
  });
}

function toggleExpand(key, container) {
  if (expandedExercises.has(key)) expandedExercises.delete(key);
  else expandedExercises.add(key);
  const summaryWrap = document.querySelector(`[data-summary-key="${key}"]`);
  const bodyWrap = document.querySelector(`[data-body-key="${key}"]`);
  const card = summaryWrap?.closest('.exercise-card');
  if (summaryWrap && bodyWrap) {
    const isNowExpanded = expandedExercises.has(key);
    summaryWrap.classList.add('animate');
    bodyWrap.classList.add('animate');
    summaryWrap.classList.toggle('show', !isNowExpanded);
    bodyWrap.classList.toggle('show', isNowExpanded);
    card?.classList.toggle('expanded', isNowExpanded);
  }
}

function refreshExercises(container) {
  const el = document.getElementById('exercises-container');
  if (!el) return;
  const c = workoutState.circuitos[activeCircuitIdx];
  el.innerHTML = c.ejercicios.map((e, ei) => renderExerciseCard(e, activeCircuitIdx, ei)).join('');
  bindExerciseEvents(container, el);
  updateCircuitTabs(container);
  updateProgressBar(container);
}

function getOverallProgress() {
  if (!workoutState) return 0;
  let done = 0, total = 0;
  workoutState.circuitos.forEach(c => {
    c.ejercicios.forEach(e => {
      total += e.seriesData.length;
      done += e.seriesData.filter(s => s.done).length;
    });
  });
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function checkCircuitCompletion(ci) {
  const circ = workoutState.circuitos[ci];
  circ.completed = circ.ejercicios.every(ex => ex.seriesData.every(s => s.done));
}

function updateCircuitTabs(container) {
  workoutState.circuitos.forEach((c, i) => {
    const tab = container.querySelector(`.circuit-tab[data-idx="${i}"]`);
    if (tab) {
      tab.classList.toggle('done', c.completed);
      tab.innerHTML = c.completed ? SVG_CHECK : `${i + 1}`;
    }
  });
}

function updateProgressBar(container) {
  const fill = container.querySelector('.circuit-progress-fill');
  if (fill) fill.style.width = `${getOverallProgress()}%`;
}

// ── Exercise picker modal (for edit mode replace) ───────────────────────────
function showExercisePicker(container, ci, ei) {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');

  let searchQuery = '';

  function renderPicker() {
    const results = searchQuery ? searchEjercicios(searchQuery, 'todos') : EJERCICIOS_CATALOGO;
    const grouped = {};
    results.forEach(e => {
      if (!grouped[e.grupo]) grouped[e.grupo] = [];
      grouped[e.grupo].push(e);
    });

    overlay.innerHTML = `
      <div class="modal-sheet" style="max-height:85vh;">
        <div class="modal-header">
          <h2 class="modal-title">${ei === null ? 'Agregar ejercicio' : 'Reemplazar ejercicio'}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div style="position:relative;margin-bottom:var(--space-md);">
          <input type="text" class="search-input" placeholder="Buscar ejercicio..." value="${searchQuery}" style="width:100%;box-sizing:border-box;">
        </div>
        <div style="max-height:60vh;overflow-y:auto;display:flex;flex-direction:column;gap:2px;">
          ${Object.entries(grouped).map(([grupo, ejs]) => `
            <div style="font-size:var(--text-xs);color:var(--color-accent);font-weight:var(--fw-semibold);letter-spacing:0.5px;padding:var(--space-sm) var(--space-xs);">${grupo}</div>
            ${ejs.map(e => `
              <div class="ejercicio-picker-item" data-nombre="${e.nombre}" style="padding:var(--space-sm) var(--space-md);background:var(--color-surface-alt);border-radius:var(--radius-sm);cursor:pointer;">
                <span style="font-size:var(--text-sm);">${e.nombre}</span>
              </div>
            `).join('')}
          `).join('')}
        </div>
      </div>
    `;

    overlay.querySelector('.modal-close').addEventListener('click', () => {
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
    });

    overlay.querySelector('.search-input').addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderPicker();
      // Re-focus input and restore cursor
      const input = overlay.querySelector('.search-input');
      if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
    });

    overlay.querySelectorAll('.ejercicio-picker-item').forEach(item => {
      item.addEventListener('click', () => {
        const nombre = item.dataset.nombre;
        const circ = workoutState.circuitos[ci];

        if (ei === null) {
          // ADD new exercise
          const newEj = {
            id: crypto.randomUUID(),
            nombre,
            tipo: 'fuerza',
            series: 3,
            reps: '10',
            usaPeso: inferUsaPeso(nombre),
            seriesData: Array.from({ length: 3 }, () => ({ reps: 10, peso: 0, done: false })),
          };
          circ.ejercicios.push(newEj);
          overlay.classList.add('hidden');
          overlay.innerHTML = '';
          persistWorkout();
          refreshExercises(container);
          showToastAction(`Agregado: ${nombre}`, '↺ Deshacer', () => {
            circ.ejercicios.pop();
            persistWorkout();
            refreshExercises(container);
          });
        } else {
          // REPLACE existing exercise
          const oldE = circ.ejercicios[ei];
          const backup = { ...oldE };
          circ.ejercicios[ei] = {
            id: crypto.randomUUID(),
            nombre,
            tipo: 'fuerza',
            series: oldE.series,
            reps: oldE.reps,
            usaPeso: inferUsaPeso(nombre),
            seriesData: Array.from({ length: oldE.seriesData.length }, () => ({
              reps: oldE.seriesData[0]?.reps || 8,
              peso: 0,
              done: false,
            })),
          };
          overlay.classList.add('hidden');
          overlay.innerHTML = '';
          persistWorkout();
          refreshExercises(container);
          showToastAction(`Reemplazado → ${nombre}`, '↺ Deshacer', () => {
            circ.ejercicios[ei] = backup;
            persistWorkout();
            refreshExercises(container);
          });
        }
      });
    });
  }

  renderPicker();
}

// ── Timer ────────────────────────────────────────────────────────────────────
function getElapsedSeconds() {
  if (!workoutState?.startTime) return 0;
  return Math.floor((Date.now() - new Date(workoutState.startTime).getTime()) / 1000);
}

function startTimer(container) {
  if (timerInterval) clearInterval(timerInterval);
  // Immediately sync display
  elapsedSeconds = getElapsedSeconds();
  const el = document.getElementById('workout-timer');
  if (el) el.textContent = formatTimer(elapsedSeconds);
  timerInterval = setInterval(() => {
    elapsedSeconds = getElapsedSeconds();
    const el = document.getElementById('workout-timer');
    if (el) el.textContent = formatTimer(elapsedSeconds);
  }, 1000);
}

// ── Routine modification detection & save ───────────────────────────────────
function detectRoutineModifications(rutinaId, currentCircuitos) {
  const rutina = store.findById(store.KEYS.rutinas, rutinaId);
  if (!rutina) return false;
  const orig = rutina.circuitos;
  if (orig.length !== currentCircuitos.length) return true;
  for (let ci = 0; ci < orig.length; ci++) {
    const oe = orig[ci].ejercicios;
    const ce = currentCircuitos[ci].ejercicios;
    if (oe.length !== ce.length) return true;
    for (let ei = 0; ei < oe.length; ei++) {
      if (oe[ei].nombre !== ce[ei].nombre) return true;
      if ((oe[ei].series || 2) !== (ce[ei].seriesData?.length || ce[ei].series || 2)) return true;
    }
  }
  return false;
}

function workoutCircuitosToRoutine(circuitos) {
  return circuitos.map((c, i) => ({
    id: c.id || crypto.randomUUID(),
    numero: i + 1,
    nombre: c.nombre,
    ejercicios: c.ejercicios.map(e => ({
      id: crypto.randomUUID(),
      nombre: e.nombre,
      series: e.seriesData?.length || e.series || 2,
      reps: e.reps || '8-12',
      tipo: e.tipo || 'fuerza',
    })),
  }));
}

function showSaveRoutineChangesModal(container, rutinaId, circuitos, skipLabel, onDone) {
  const rutina = store.findById(store.KEYS.rutinas, rutinaId);
  if (!rutina) { onDone(); return; }

  let nextLetter = '';
  const match = rutina.nombre.match(/^(.+) ([A-Z]) (— .+)$/);
  if (match) {
    const [, prefix, , suffix] = match;
    const rutinas = store.getAll(store.KEYS.rutinas);
    const letters = rutinas
      .filter(r => r.nombre?.startsWith(prefix + ' ') && r.nombre.endsWith(suffix))
      .map(r => { const m = r.nombre.match(/ ([A-Z]) —/); return m ? m[1] : null; })
      .filter(Boolean);
    const maxCode = letters.length ? Math.max(...letters.map(l => l.charCodeAt(0))) : 64;
    nextLetter = String.fromCharCode(maxCode + 1);
  }

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <div class="modal-sheet" style="text-align:center;">
      <h2 class="modal-title" style="margin-bottom:var(--space-xs);">Cambios en la rutina</h2>
      <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-lg);">
        Modificaste ejercicios durante la sesión.
      </p>
      <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
        <button class="btn btn-primary btn-lg" id="btn-update-rutina">
          <i class="ph ph-arrows-clockwise"></i> Actualizar ${rutina.nombre}
        </button>
        <button class="btn btn-secondary btn-lg" id="btn-save-new-rutina">
          <i class="ph ph-copy"></i> Guardar como nueva${nextLetter ? ` (${nextLetter})` : ''}
        </button>
        <button class="btn btn-lg" id="btn-skip-save" style="color:var(--color-text-muted);">
          ${skipLabel}
        </button>
      </div>
    </div>
  `;

  const cleanCircuitos = workoutCircuitosToRoutine(circuitos);
  const close = () => { overlay.classList.add('hidden'); overlay.innerHTML = ''; };

  overlay.querySelector('#btn-update-rutina').addEventListener('click', () => {
    store.update(store.KEYS.rutinas, rutina.id, { circuitos: cleanCircuitos });
    close();
    showToast(`Rutina ${rutina.numero} actualizada`);
    onDone();
  });

  overlay.querySelector('#btn-save-new-rutina').addEventListener('click', () => {
    const rutinas = store.getAll(store.KEYS.rutinas);
    const nums = rutinas
      .filter(r => typeof r.numero === 'string' && r.numero.startsWith('#'))
      .map(r => parseInt(r.numero.replace('#', '')) || 0);
    const nextNum = `#${String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, '0')}`;

    let newNombre = rutina.nombre;
    const match = rutina.nombre.match(/^(.+) ([A-Z]) (— .+)$/);
    if (match) {
      const [, prefix, , suffix] = match;
      const letters = rutinas
        .filter(r => r.nombre?.startsWith(prefix + ' ') && r.nombre.endsWith(suffix))
        .map(r => { const m = r.nombre.match(/ ([A-Z]) —/); return m ? m[1] : null; })
        .filter(Boolean);
      const maxCode = letters.length ? Math.max(...letters.map(l => l.charCodeAt(0))) : 64;
      newNombre = `${prefix} ${String.fromCharCode(maxCode + 1)} ${suffix}`;
    }

    store.push(store.KEYS.rutinas, {
      ...rutina,
      id: crypto.randomUUID(),
      nombre: newNombre,
      numero: nextNum,
      custom: true,
      circuitos: cleanCircuitos,
      updatedAt: new Date().toISOString(),
    });
    close();
    showToast(`Nueva rutina: ${newNombre}`);
    onDone();
  });

  overlay.querySelector('#btn-skip-save').addEventListener('click', () => {
    close();
    onDone();
  });
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
        <button class="btn btn-secondary btn-lg" id="btn-pausar"><i class="ph ph-pause"></i> Pausar y navegar</button>
        <button class="btn btn-secondary btn-lg" id="btn-finalizar-guardar"><i class="ph ph-check"></i> Finalizar y guardar</button>
        <button class="btn btn-lg" id="btn-descartar" style="color:var(--color-danger);">Descartar</button>
      </div>
    </div>
  `;

  overlay.querySelector('#btn-volver').addEventListener('click', () => {
    overlay.classList.add('hidden'); overlay.innerHTML = ''; startTimer(container);
  });
  overlay.querySelector('#btn-pausar').addEventListener('click', () => {
    overlay.classList.add('hidden'); overlay.innerHTML = ''; persistWorkout(); router.navigate('');
  });
  overlay.querySelector('#btn-finalizar-guardar').addEventListener('click', () => {
    overlay.classList.add('hidden'); overlay.innerHTML = ''; finishWorkout(container);
  });
  overlay.querySelector('#btn-descartar').addEventListener('click', () => {
    overlay.classList.add('hidden'); overlay.innerHTML = '';
    const rutinaId = workoutState.rutinaId;
    const modifiedCircuitos = workoutState.circuitos;
    const hasChanges = detectRoutineModifications(rutinaId, modifiedCircuitos);
    const discard = () => {
      workoutState = null; localStorage.removeItem(WS_KEY);
      clearInterval(timerInterval); router.navigate('');
    };
    if (hasChanges) {
      showSaveRoutineChangesModal(container, rutinaId, modifiedCircuitos, 'Descartar todo', discard);
    } else {
      discard();
    }
  });
}

// ── Finish workout ───────────────────────────────────────────────────────────
function finishWorkout(container) {
  clearInterval(timerInterval);

  const usuario = workoutState.usuario;

  workoutState.circuitos.forEach(c => {
    c.ejercicios.forEach(e => {
      if (!e.usaPeso) return;
      const doneSeries = e.seriesData.filter(s => s.done && s.peso > 0);
      if (doneSeries.length === 0) return;
      const firstPeso = doneSeries[0].peso;
      const allReps = e.seriesData.every(s => s.done);
      const prev = store.getProgresion(e.nombre, usuario, workoutState.lugar);
      const prevCount = prev?.consecutiveComplete ?? (prev?.completedAllReps ? 1 : 0);
      const weightChanged = prev && prev.lastWeight && firstPeso !== prev.lastWeight;
      let consecutiveComplete;
      if (weightChanged) {
        consecutiveComplete = allReps ? 1 : 0;
      } else {
        consecutiveComplete = allReps ? prevCount + 1 : 0;
      }
      store.setProgresion(e.nombre, usuario, { lastWeight: firstPeso, consecutiveComplete }, workoutState.lugar);
    });
  });

  const sesion = {
    id: crypto.randomUUID(),
    rutinaId: workoutState.rutinaId,
    rutinaNombre: workoutState.rutinaNombre,
    lugar: workoutState.lugar,
    usuario,
    fecha: workoutState.fecha,
    startTime: workoutState.startTime,
    endTime: new Date().toISOString(),
    duracion: elapsedSeconds,
    circuitos: workoutState.circuitos,
    pendingSync: true,
  };
  store.push(store.KEYS.sesiones, sesion);

  const minutes = Math.floor(elapsedSeconds / 60);
  const totalSeriesDone = workoutState.circuitos.reduce((sum, c) =>
    sum + c.ejercicios.reduce((s2, e) => s2 + e.seriesData.filter(s => s.done).length, 0), 0);
  const circuitsDone = sesion.circuitos.filter(c => c.completed).length;

  const rutinaId = workoutState.rutinaId;
  const modifiedCircuitos = workoutState.circuitos;
  const hasChanges = detectRoutineModifications(rutinaId, modifiedCircuitos);

  workoutState = null;
  localStorage.removeItem(WS_KEY);

  finishedSummary = { minutes, totalSeriesDone, circuitsDone, totalCircuits: sesion.circuitos.length, sesionId: sesion.id };

  const showSummary = () => {
    renderSummary(container);
    showToast('Entrenamiento guardado ✓');
  };

  if (hasChanges) {
    showSaveRoutineChangesModal(container, rutinaId, modifiedCircuitos, 'Solo guardar sesión', showSummary);
  } else {
    showSummary();
  }
}

function renderSummary(container) {
  const { minutes, totalSeriesDone, circuitsDone, totalCircuits, sesionId } = finishedSummary;

  container.innerHTML = `
    <div class="workout-summary">
      <div style="text-align:center;margin-bottom:var(--space-md);"><i class="ph-light ph-flag-checkered" style="font-size:48px;color:var(--color-accent);"></i></div>
      <div class="workout-summary-title">¡Entrenamiento completado!</div>
      <div class="workout-summary-stats">
        <div><div class="workout-stat-value">${minutes}</div><div class="workout-stat-label">minutos</div></div>
        <div><div class="workout-stat-value">${totalSeriesDone}</div><div class="workout-stat-label">series</div></div>
        <div><div class="workout-stat-value">${circuitsDone}/${totalCircuits}</div><div class="workout-stat-label">circuitos</div></div>
      </div>
      <div style="margin-top:var(--space-lg);display:flex;align-items:center;gap:var(--space-sm);justify-content:center;">
        <i class="ph-light ph-fire" style="font-size:20px;color:var(--color-warning);"></i>
        <input type="number" id="input-calorias" placeholder="kcal" inputmode="numeric"
          style="width:100px;text-align:center;background:var(--color-surface-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:var(--space-sm);color:var(--color-text);font-family:var(--font-main);font-size:var(--text-base);font-weight:var(--fw-semibold);">
        <span style="font-size:var(--text-sm);color:var(--color-text-muted);">calorías</span>
      </div>
      <button class="btn btn-primary btn-lg" id="btn-back-home" style="width:100%;margin-top:var(--space-lg);">
        <i class="ph ph-house"></i> Volver al inicio
      </button>
    </div>
  `;

  document.getElementById('btn-back-home')?.addEventListener('click', () => {
    const kcalInput = document.getElementById('input-calorias');
    const kcal = kcalInput ? parseInt(kcalInput.value, 10) : 0;
    if (kcal > 0) {
      const sesiones = store.getAll(store.KEYS.sesiones);
      const idx = sesiones.findIndex(s => s.id === sesionId);
      if (idx !== -1) {
        sesiones[idx].calorias = kcal;
        store.set(store.KEYS.sesiones, sesiones);
      }
    }
    finishedSummary = null;
    router.navigate('');
  });
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
