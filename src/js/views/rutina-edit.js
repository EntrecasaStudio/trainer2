import { store } from '../../store.js';
import { router } from '../../router.js';
import { showToast } from '../components/toast.js';
import { EJERCICIOS_CATALOGO, GRUPOS_MUSCULARES, searchEjercicios } from '../../ejercicios-catalogo.js';
import { openEjercicioInfo } from './ejercicios.js';

const LUGAR_OPTIONS = [
  { key: 'SPORT_FITNESS', label: 'Sport' },
  { key: 'RIO', label: 'Río' },
  { key: 'CASA', label: 'Casa' },
  { key: 'URUGUAY', label: '🇺🇾' },
  { key: 'RECOVERY', label: 'Recovery' },
];

let _rutina = null;
let _original = null;
let _isDirty = false;

export function mountRutinaEdit(container, params) {
  const id = params[0];
  _original = store.findById(store.KEYS.rutinas, id);
  if (!_original) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-text">Rutina no encontrada</div></div>';
    return;
  }

  // Deep clone for editing
  _rutina = JSON.parse(JSON.stringify(_original));
  _isDirty = false;

  render(container);
}

function render(container) {
  container.innerHTML = `
    <div class="edit-header">
      <button class="btn-icon" id="btn-back">
        <i class="ph ph-arrow-left" style="font-size:22px;color:var(--color-text);"></i>
      </button>
      <h1 style="font-size:var(--text-lg);font-weight:var(--fw-semibold);flex:1;text-align:center;">Editar rutina</h1>
      <div style="width:30px;"></div>
    </div>

    <div class="edit-form">
      <div class="edit-field">
        <label class="edit-label">Nombre</label>
        <input type="text" id="edit-nombre" class="edit-input" value="${_rutina.nombre}">
      </div>

      <div class="edit-field">
        <label class="edit-label">Lugar</label>
        <div class="edit-lugar-chips" id="edit-lugar-chips">
          ${LUGAR_OPTIONS.map(l => `
            <button class="lugar-chip ${_rutina.lugar === l.key ? 'active' : ''}" data-lugar="${l.key}">${l.label}</button>
          `).join('')}
        </div>
      </div>

      <div id="circuitos-editor">
        ${_rutina.circuitos.map((c, ci) => renderCircuitEditor(c, ci)).join('')}
      </div>

      <button class="btn btn-secondary" id="btn-add-circuit" style="width:100%;margin-top:var(--space-sm);">
        <i class="ph ph-plus"></i> Agregar circuito
      </button>

      <button class="btn btn-primary btn-lg" id="btn-save" style="width:100%;margin-top:var(--space-lg);">
        Guardar rutina
      </button>
    </div>
  `;

  // Back
  container.querySelector('#btn-back').addEventListener('click', () => {
    if (_isDirty) {
      showDiscardModal();
    } else {
      router.navigate('rutinas');
    }
  });

  // Name input
  container.querySelector('#edit-nombre').addEventListener('input', (e) => {
    _rutina.nombre = e.target.value;
    _isDirty = true;
  });

  // Lugar chips
  container.querySelectorAll('#edit-lugar-chips .lugar-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      _rutina.lugar = chip.dataset.lugar;
      _isDirty = true;
      container.querySelectorAll('#edit-lugar-chips .lugar-chip').forEach(c => c.classList.toggle('active', c.dataset.lugar === _rutina.lugar));
    });
  });

  // Add circuit
  container.querySelector('#btn-add-circuit').addEventListener('click', () => {
    _rutina.circuitos.push({
      id: crypto.randomUUID(),
      numero: _rutina.circuitos.length + 1,
      nombre: 'NUEVO',
      ejercicios: [],
    });
    _isDirty = true;
    render(container);
  });

  // Save
  container.querySelector('#btn-save').addEventListener('click', (e) => {
    e.stopPropagation();
    if (_isDirty) {
      showSaveModal(container);
    } else {
      router.navigate('rutinas');
    }
  });

  // Bind circuit events
  bindCircuitEvents(container);
}

function getCircuitMuscleGroups(circ) {
  const groups = new Set();
  circ.ejercicios.forEach(ej => {
    const cat = EJERCICIOS_CATALOGO.find(c => c.nombre.toLowerCase() === (ej.nombre || '').toLowerCase());
    if (cat?.grupo) groups.add(cat.grupo.toUpperCase());
  });
  return [...groups];
}

function renderCircuitEditor(circ, ci) {
  const muscleGroups = getCircuitMuscleGroups(circ);
  const autoName = muscleGroups.length > 0 ? muscleGroups.join(' · ') : '';
  return `
    <div class="edit-circuit" data-ci="${ci}">
      <div class="edit-circuit-header">
        <span class="edit-circuit-num">C${circ.numero != null ? circ.numero : ci + 1}</span>
        ${autoName ? `<span class="edit-circuit-muscles">${autoName}</span>` : '<span class="edit-circuit-muscles" style="color:var(--color-text-muted);">Sin ejercicios</span>'}
        <button class="btn-icon edit-circuit-remove" data-ci="${ci}" title="Quitar circuito">
          <i class="ph ph-x" style="font-size:16px;color:var(--color-danger);"></i>
        </button>
      </div>
      <div class="edit-circuit-exercises">
        ${circ.ejercicios.map((e, ei) => renderEjercicioEditor(e, ci, ei)).join('')}
        <button class="btn-add-ej" data-ci="${ci}">
          <i class="ph ph-plus" style="font-size:14px;"></i> Ejercicio
        </button>
      </div>
    </div>
  `;
}

function renderEjercicioEditor(ej, ci, ei) {
  const series = ej.series != null ? ej.series : '';
  const reps = ej.reps != null ? ej.reps : (ej.repsObjetivo != null ? ej.repsObjetivo : '');
  return `
    <div class="edit-ej-row" data-ci="${ci}" data-ei="${ei}">
      <button class="btn-icon edit-ej-remove" data-ci="${ci}" data-ei="${ei}">
        <i class="ph ph-minus-circle" style="font-size:16px;color:var(--color-danger);"></i>
      </button>
      <button class="edit-ej-name-btn" data-ci="${ci}" data-ei="${ei}" title="Cambiar ejercicio">
        ${ej.nombre || '<span style="color:var(--color-text-muted);">Elegir ejercicio</span>'}
      </button>
      <button class="btn-icon edit-ej-info" data-nombre="${ej.nombre || ''}" title="Info del ejercicio" ${!ej.nombre ? 'disabled style="opacity:0.3;"' : ''}>
        <i class="ph ph-info" style="font-size:16px;color:var(--color-text-muted);"></i>
      </button>
      <input type="number" class="edit-ej-series" value="${series}" data-ci="${ci}" data-ei="${ei}" placeholder="S" min="1" max="20">
      <span style="color:var(--color-text-muted);font-size:var(--text-xs);">×</span>
      <input type="text" class="edit-ej-reps" value="${reps}" data-ci="${ci}" data-ei="${ei}" placeholder="Reps">
    </div>
  `;
}

function bindCircuitEvents(container) {
  // Remove circuit
  container.querySelectorAll('.edit-circuit-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const ci = parseInt(btn.dataset.ci);
      _rutina.circuitos.splice(ci, 1);
      _rutina.circuitos.forEach((c, i) => c.numero = i + 1);
      _isDirty = true;
      render(container);
    });
  });

  // Click exercise name → open picker to REPLACE
  container.querySelectorAll('.edit-ej-name-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ci = parseInt(btn.dataset.ci);
      const ei = parseInt(btn.dataset.ei);
      showExercisePicker(container, ci, ei);
    });
  });

  // Exercise series changes
  container.querySelectorAll('.edit-ej-series').forEach(input => {
    input.addEventListener('input', () => {
      const ci = parseInt(input.dataset.ci);
      const ei = parseInt(input.dataset.ei);
      _rutina.circuitos[ci].ejercicios[ei].series = parseInt(input.value) || 0;
      _isDirty = true;
    });
  });

  // Exercise reps changes
  container.querySelectorAll('.edit-ej-reps').forEach(input => {
    input.addEventListener('input', () => {
      const ci = parseInt(input.dataset.ci);
      const ei = parseInt(input.dataset.ei);
      _rutina.circuitos[ci].ejercicios[ei].reps = input.value;
      _isDirty = true;
    });
  });

  // Info button
  container.querySelectorAll('.edit-ej-info').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nombre = btn.dataset.nombre;
      if (nombre) openEjercicioInfo(nombre);
    });
  });

  // Remove exercise
  container.querySelectorAll('.edit-ej-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const ci = parseInt(btn.dataset.ci);
      const ei = parseInt(btn.dataset.ei);
      _rutina.circuitos[ci].ejercicios.splice(ei, 1);
      _isDirty = true;
      render(container);
    });
  });

  // Add exercise to circuit
  container.querySelectorAll('.btn-add-ej').forEach(btn => {
    btn.addEventListener('click', () => {
      const ci = parseInt(btn.dataset.ci);
      showExercisePicker(container, ci, null);
    });
  });
}

// ── Modal helper ─────────────────────────────────────────────────────────────

let _backdropHandler = null;

function openOverlay(html) {
  const overlay = document.getElementById('modal-overlay');
  // Remove any existing backdrop handler
  if (_backdropHandler) {
    overlay.removeEventListener('mousedown', _backdropHandler);
    _backdropHandler = null;
  }
  overlay.innerHTML = html;
  overlay.classList.remove('hidden');

  _backdropHandler = (e) => {
    if (e.target === overlay) _closeOverlay();
  };
  overlay.addEventListener('mousedown', _backdropHandler);

  return { overlay, close: _closeOverlay };
}

function _closeOverlay() {
  const overlay = document.getElementById('modal-overlay');
  if (_backdropHandler) {
    overlay.removeEventListener('mousedown', _backdropHandler);
    _backdropHandler = null;
  }
  overlay.classList.add('hidden');
  overlay.innerHTML = '';
}

// ── Discard changes modal ────────────────────────────────────────────────────

function showDiscardModal() {
  const { overlay, close } = openOverlay(`
    <div class="modal-sheet">
      <div class="modal-header">
        <h2 class="modal-title">Cambios sin guardar</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body" style="display:flex;flex-direction:column;gap:var(--space-sm);">
        <p style="font-size:var(--text-sm);color:var(--color-text-muted);">¿Querés descartar los cambios?</p>
        <button class="btn btn-danger btn-lg" id="btn-discard" style="width:100%;">Descartar</button>
        <button class="btn btn-secondary" id="btn-stay" style="width:100%;">Seguir editando</button>
      </div>
    </div>
  `);

  overlay.querySelector('.modal-close').addEventListener('click', close);
  overlay.querySelector('#btn-stay').addEventListener('click', close);
  overlay.querySelector('#btn-discard').addEventListener('click', () => {
    close();
    router.navigate('rutinas');
  });
}

// ── Exercise picker modal ────────────────────────────────────────────────────
// ei = null → add new exercise to circuit
// ei = number → replace existing exercise at index

function showExercisePicker(container, ci, ei) {
  let query = '';
  const isReplace = ei !== null && ei !== undefined;
  const title = isReplace ? 'Cambiar ejercicio' : 'Agregar ejercicio';

  function renderPicker() {
    const results = searchEjercicios(query, 'todos');
    const grouped = {};
    results.forEach(e => {
      if (!grouped[e.grupo]) grouped[e.grupo] = [];
      grouped[e.grupo].push(e);
    });

    // Check if query matches any existing exercise exactly
    const q = query.trim().toLowerCase();
    const exactMatch = q && EJERCICIOS_CATALOGO.some(e => e.nombre.toLowerCase() === q);
    const showCreateNew = q.length > 2 && !exactMatch;

    const { overlay, close } = openOverlay(`
      <div class="modal-sheet" style="max-height:85vh;">
        <div class="modal-header">
          <h2 class="modal-title">${title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom:var(--space-md);">
            <input type="text" class="search-input" id="ej-picker-search" placeholder="Buscar o crear nuevo..." value="${query}" style="width:100%;">
          </div>
          ${showCreateNew ? `
            <button class="btn btn-secondary ej-picker-create" id="ej-picker-create" style="width:100%;margin-bottom:var(--space-md);text-align:left;">
              <i class="ph ph-plus" style="font-size:16px;margin-right:var(--space-xs);"></i>
              Crear "<strong>${query.trim()}</strong>"
            </button>
          ` : ''}
          <div class="ej-picker-list" style="max-height:50vh;overflow-y:auto;">
            ${GRUPOS_MUSCULARES.filter(g => grouped[g]).map(grupo => `
              <div style="margin-bottom:var(--space-sm);">
                <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--color-text-muted);letter-spacing:0.5px;padding:var(--space-xs) 0;">${grupo}</div>
                ${grouped[grupo].map(e => `
                  <div class="ej-picker-item" data-nombre="${e.nombre}" style="padding:var(--space-sm);cursor:pointer;border-radius:var(--radius-sm);transition:background 0.1s;">
                    <span style="font-size:var(--text-sm);color:var(--color-text);">${e.nombre}</span>
                    <span style="font-size:var(--text-xs);color:var(--color-text-muted);margin-left:var(--space-xs);">${e.tipo === 'funcional' ? 'F' : 'M'}</span>
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `);

    overlay.querySelector('.modal-close').addEventListener('click', close);

    overlay.querySelector('#ej-picker-search').addEventListener('input', (e) => {
      query = e.target.value;
      renderPicker();
      document.getElementById('ej-picker-search')?.focus();
    });

    // Select existing exercise
    overlay.querySelectorAll('.ej-picker-item').forEach(item => {
      item.addEventListener('click', () => {
        selectExercise(item.dataset.nombre, ci, ei, container, close);
      });
    });

    // Create new custom exercise
    overlay.querySelector('#ej-picker-create')?.addEventListener('click', () => {
      const nombre = query.trim();
      selectExercise(nombre, ci, ei, container, close);
    });
  }

  renderPicker();
}

function selectExercise(nombre, ci, ei, container, closeFn) {
  const isReplace = ei !== null && ei !== undefined;
  if (isReplace) {
    // Replace exercise name, keep series/reps
    _rutina.circuitos[ci].ejercicios[ei].nombre = nombre;
  } else {
    // Add new exercise
    _rutina.circuitos[ci].ejercicios.push({
      id: crypto.randomUUID(),
      nombre,
      series: 2,
      reps: '8-12',
      tipo: 'fuerza',
    });
  }
  _isDirty = true;
  closeFn();
  render(container);
}

// ── Save modal ───────────────────────────────────────────────────────────────

function showSaveModal(container) {
  const nextNum = getNextNumero(_rutina);

  const { overlay, close } = openOverlay(`
    <div class="modal-sheet">
      <div class="modal-header">
        <h2 class="modal-title">Guardar cambios</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body" style="display:flex;flex-direction:column;gap:var(--space-sm);">
        <button class="btn btn-primary btn-lg" id="btn-save-same" style="width:100%;">
          Guardar en ${_rutina.numero}
        </button>
        <button class="btn btn-secondary btn-lg" id="btn-save-new" style="width:100%;">
          Guardar como nueva (${nextNum})
        </button>
        <button class="btn btn-secondary" id="btn-save-cancel" style="width:100%;margin-top:var(--space-xs);">
          Cancelar
        </button>
      </div>
    </div>
  `);

  overlay.querySelector('.modal-close').addEventListener('click', close);
  overlay.querySelector('#btn-save-cancel').addEventListener('click', close);

  // Save in same routine
  overlay.querySelector('#btn-save-same').addEventListener('click', () => {
    _rutina.updatedAt = new Date().toISOString();
    _rutina.userModified = true;
    store.update(store.KEYS.rutinas, _rutina.id, _rutina);
    close();
    showToast('Rutina guardada');
    router.navigate('rutinas');
  });

  // Save as new
  overlay.querySelector('#btn-save-new').addEventListener('click', () => {
    const newRutina = {
      ..._rutina,
      id: crypto.randomUUID(),
      numero: nextNum,
      custom: true,
      updatedAt: new Date().toISOString(),
    };
    store.push(store.KEYS.rutinas, newRutina);
    close();
    showToast(`Nueva rutina ${nextNum} creada`);
    router.navigate('rutinas');
  });
}

function getNextNumero(rutina) {
  const rutinas = store.getAll(store.KEYS.rutinas);
  const numStr = String(rutina.numero || '');
  const prefix = '#';
  const nums = rutinas
    .filter(r => typeof r.numero === 'string' && r.numero.startsWith(prefix))
    .map(r => parseInt(r.numero.replace(prefix, '')) || 0);
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}
