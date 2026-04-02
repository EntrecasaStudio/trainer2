import { EJERCICIOS_CATALOGO, GRUPOS_MUSCULARES, searchEjercicios, findEjercicio } from '../../ejercicios-catalogo.js';
import { store } from '../../store.js';
import { getMuscleSvgCropped } from '../../utils/muscle-illustrations.js';

const TIPO_LABELS = { funcional: 'F', maquina: 'M' };
const TIPO_COLORS = { funcional: 'var(--color-tag-core)', maquina: 'var(--color-tag-brazos)' };

const GRUPO_ICONS = {
  'Piernas':  'ph-person-simple-run',
  'Core':     'ph-circle-half-tilt',
  'Pecho':    'ph-heartbeat',
  'Espalda':  'ph-arrows-out-line-vertical',
  'Hombros':  'ph-arrows-out',
  'Brazos':   'ph-barbell',
  'Glúteos':  'ph-star',
  'HIIT':     'ph-lightning',
};

let searchQuery = '';
let tipoFilter = 'todos';
let expandedGroups = new Set();
let editingEjercicio = null;

// Local overrides stored in localStorage
function getCustomEjercicios() {
  return store.getObj('gym_ejercicios_custom');
}

function saveCustomEjercicio(nombre, data) {
  const custom = getCustomEjercicios();
  custom[nombre] = data;
  store.setObj('gym_ejercicios_custom', custom);
}

function getEjercicioData(nombre) {
  const custom = getCustomEjercicios();
  const base = findEjercicio(nombre) || { nombre, grupo: 'Otros', tipo: 'funcional', usaPeso: false, descripcion: '' };
  return { ...base, ...(custom[nombre] || {}) };
}

export function mountEjercicios(container) {
  render(container);
}

export function openEjercicioInfo(nombre) {
  // Can be called from workout or home to show info modal
  const data = getEjercicioData(nombre);
  showDetailModal(data, false);
}

function render(container) {
  container.innerHTML = `
    <div class="rutinas-header">
      <h1 style="font-size:var(--text-xl);font-weight:var(--fw-bold);">Ejercicios</h1>
      <div class="rutinas-header-actions">
        <button class="btn-icon-header" data-action="toggle-search" title="Buscar">
          <i class="ph ph-magnifying-glass"></i>
        </button>
        <button class="btn-icon-header" data-action="new-ejercicio" title="Nuevo ejercicio">
          <i class="ph ph-plus"></i>
        </button>
      </div>
    </div>
    <div class="rutinas-search" id="ej-search-wrap">
      <input type="text" class="rutinas-search-input" id="ej-search-input"
             placeholder="Buscar ejercicio..." value="${searchQuery}" autocomplete="off">
    </div>

    <div class="ejercicios-tipo-tabs">
      <button class="tipo-tab ${tipoFilter==='todos'?'active':''}" data-tipo="todos">Todos</button>
      <button class="tipo-tab ${tipoFilter==='funcional'?'active':''}" data-tipo="funcional">Funcional</button>
      <button class="tipo-tab ${tipoFilter==='maquina'?'active':''}" data-tipo="maquina">Máquinas</button>
    </div>

    <div id="ejercicios-list"></div>
  `;

  // Search toggle
  container.querySelector('[data-action="toggle-search"]').addEventListener('click', () => {
    const wrap = document.getElementById('ej-search-wrap');
    const isOpen = wrap.classList.toggle('open');
    if (isOpen) {
      const input = document.getElementById('ej-search-input');
      if (input) setTimeout(() => input.focus(), 100);
    } else {
      searchQuery = '';
      document.getElementById('ej-search-input').value = '';
      renderList(container);
    }
  });

  // Search input
  document.getElementById('ej-search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderList(container);
  });

  // New ejercicio
  container.querySelector('[data-action="new-ejercicio"]').addEventListener('click', () => {
    openNewEjercicioModal(container);
  });

  // Tipo filter tabs
  container.querySelectorAll('.tipo-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tipoFilter = tab.dataset.tipo;
      container.querySelectorAll('.tipo-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderList(container);
    });
  });

  // If search had text, open it
  if (searchQuery) {
    document.getElementById('ej-search-wrap')?.classList.add('open');
  }

  renderList(container);
}

function renderList(container) {
  const listEl = document.getElementById('ejercicios-list');
  if (!listEl) return;

  const results = searchEjercicios(searchQuery, tipoFilter);
  const custom = getCustomEjercicios();

  if (results.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon"><i class="ph-light ph-magnifying-glass" style="font-size:48px;"></i></div><div class="empty-state-text">Sin resultados</div></div>`;
    return;
  }

  // Group results
  const grouped = {};
  results.forEach(e => {
    if (!grouped[e.grupo]) grouped[e.grupo] = [];
    grouped[e.grupo].push(e);
  });

  // Use GRUPOS_MUSCULARES order
  const orderedGroups = GRUPOS_MUSCULARES.filter(g => grouped[g]);
  // Add any extras not in order
  Object.keys(grouped).forEach(g => { if (!orderedGroups.includes(g)) orderedGroups.push(g); });

  listEl.innerHTML = orderedGroups.map(grupo => {
    const ejs = grouped[grupo];
    const isExpanded = expandedGroups.has(grupo) || searchQuery;
    const muscleSvg = getMuscleSvgCropped(grupo, 36);

    return `
      <div class="grupo-section" data-grupo="${grupo}">
        <div class="grupo-header" data-grupo="${grupo}">
          <div style="display:flex;align-items:center;gap:var(--space-sm);">
            <span class="ej-category-muscle">${muscleSvg}</span>
            <span class="grupo-name">${grupo}</span>
          </div>
          <span class="grupo-count">${ejs.length}</span>
        </div>
        <div class="grupo-exercises-wrap ${isExpanded ? 'open' : ''}">
          <div class="grupo-exercises">
          ${ejs.map(e => {
            const hasCustom = !!custom[e.nombre];
            return `
              <div class="ejercicio-row" data-nombre="${e.nombre}">
                <div class="ejercicio-row-main">
                  <div>
                    <div class="ejercicio-row-name">${e.nombre}</div>
                    ${hasCustom ? '<span style="font-size:var(--text-xs);color:var(--color-accent);">editado</span>' : ''}
                  </div>
                  <span class="tipo-badge" style="background:${TIPO_COLORS[e.tipo]}20;color:${TIPO_COLORS[e.tipo]};">${TIPO_LABELS[e.tipo]}</span>
                </div>
              </div>
            `;
          }).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Group header toggles
  listEl.querySelectorAll('.grupo-header').forEach(header => {
    header.addEventListener('click', () => {
      const grupo = header.dataset.grupo;
      if (expandedGroups.has(grupo)) expandedGroups.delete(grupo);
      else expandedGroups.add(grupo);
      const section = header.closest('.grupo-section');
      const wrap = section?.querySelector('.grupo-exercises-wrap');
      if (wrap) wrap.classList.toggle('open', expandedGroups.has(grupo));
    });
  });

  // Exercise row taps
  listEl.querySelectorAll('.ejercicio-row').forEach(row => {
    row.addEventListener('click', () => {
      const nombre = row.dataset.nombre;
      const data = getEjercicioData(nombre);
      showDetailModal(data, true);
    });
  });
}

function showDetailModal(data, allowEdit) {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');

  overlay.innerHTML = `
    <div class="modal-sheet ejercicio-detail-sheet">
      <div class="modal-header">
        <div>
          <span style="font-size:var(--text-xs);color:var(--color-accent);font-weight:var(--fw-semibold);text-transform:uppercase;letter-spacing:1px;">${data.grupo}</span>
          <h2 class="modal-title" style="margin-top:2px;">${data.nombre}</h2>
        </div>
        <div style="display:flex;gap:var(--space-sm);align-items:center;">
          ${allowEdit ? `<button class="btn-icon" id="btn-edit-ejercicio" title="Editar"><i class="ph ph-pencil-simple" style="font-size:20px;color:var(--color-text-muted);"></i></button>` : ''}
          <button class="modal-close">&times;</button>
        </div>
      </div>

      <div class="ejercicio-detail-body">
        <div class="ejercicio-tipo-toggle">
          <span class="tipo-pill ${data.tipo === 'funcional' ? 'active' : ''}" style="pointer-events:none;">Funcional</span>
          <span class="tipo-pill ${data.tipo === 'maquina' ? 'active' : ''}" style="pointer-events:none;">Máquina</span>
        </div>

        <div class="ejercicio-attrs">
          ${data.usaPeso ? `<span class="attr-chip"><i class="ph ph-barbell"></i> Usa peso</span>` : ''}
        </div>

        <p class="ejercicio-descripcion" id="ejercicio-desc-text">${data.descripcion || 'Sin descripción.'}</p>
      </div>
    </div>
  `;

  overlay.querySelector('.modal-close').addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    editingEjercicio = null;
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
      editingEjercicio = null;
    }
  });

  overlay.querySelector('#btn-edit-ejercicio')?.addEventListener('click', () => {
    openEditModal(data);
  });
}

function openEditModal(data) {
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-header">
        <h2 class="modal-title">Editar ejercicio</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--space-md);">
        <label style="font-size:var(--text-sm);color:var(--color-text-muted);">Descripción</label>
        <textarea id="edit-desc" rows="5" style="background:var(--color-surface-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:var(--space-sm);color:var(--color-text);font-family:var(--font-main);font-size:var(--text-sm);resize:vertical;">${data.descripcion || ''}</textarea>

        <label style="font-size:var(--text-sm);color:var(--color-text-muted);">Tipo</label>
        <div style="display:flex;gap:var(--space-sm);">
          <button class="tipo-pill ${data.tipo==='funcional'?'active':''}" data-tipo="funcional">Funcional</button>
          <button class="tipo-pill ${data.tipo==='maquina'?'active':''}" data-tipo="maquina">Máquina</button>
        </div>

        <button class="btn btn-primary btn-lg" id="btn-save-ejercicio" style="width:100%;margin-top:var(--space-sm);">Guardar</button>
      </div>
    </div>
  `;

  let selectedTipo = data.tipo;

  overlay.querySelectorAll('.tipo-pill[data-tipo]').forEach(pill => {
    pill.addEventListener('click', () => {
      selectedTipo = pill.dataset.tipo;
      overlay.querySelectorAll('.tipo-pill[data-tipo]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  overlay.querySelector('.modal-close').addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
  });

  overlay.querySelector('#btn-save-ejercicio').addEventListener('click', () => {
    const desc = overlay.querySelector('#edit-desc').value.trim();
    saveCustomEjercicio(data.nombre, { descripcion: desc, tipo: selectedTipo });
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    // Re-render the list if we're in ejercicios view
    const container = document.getElementById('view-container');
    if (container) {
      import('./ejercicios.js').then(m => m.mountEjercicios(container));
    }
  });
}

function openNewEjercicioModal(viewContainer) {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');

  overlay.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-header">
        <h2 class="modal-title">Nuevo ejercicio</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--space-md);">
        <div class="edit-field">
          <label class="edit-label">Nombre</label>
          <input type="text" class="edit-input" id="new-ej-nombre" placeholder="Nombre del ejercicio" autocomplete="off">
        </div>
        <div class="edit-field">
          <label class="edit-label">Grupo muscular</label>
          <div style="display:flex;gap:var(--space-xs);flex-wrap:wrap;" id="new-ej-grupos">
            ${GRUPOS_MUSCULARES.map(g => `
              <button class="lugar-chip" data-grupo="${g}">${g}</button>
            `).join('')}
          </div>
        </div>
        <div class="edit-field">
          <label class="edit-label">Tipo</label>
          <div style="display:flex;gap:var(--space-sm);">
            <button class="tipo-pill active" data-tipo="funcional">Funcional</button>
            <button class="tipo-pill" data-tipo="maquina">Máquina</button>
          </div>
        </div>
        <div class="edit-field">
          <label class="edit-label">Descripción (opcional)</label>
          <textarea id="new-ej-desc" rows="3" style="background:var(--color-surface-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:var(--space-sm);color:var(--color-text);font-family:var(--font-main);font-size:var(--text-sm);resize:vertical;"></textarea>
        </div>
        <button class="btn btn-primary btn-lg" id="btn-create-ejercicio" style="width:100%;">Crear ejercicio</button>
      </div>
    </div>
  `;

  let selectedGrupo = null;
  let selectedTipo = 'funcional';

  // Grupo selection
  overlay.querySelectorAll('[data-grupo]').forEach(chip => {
    chip.addEventListener('click', () => {
      selectedGrupo = chip.dataset.grupo;
      overlay.querySelectorAll('[data-grupo]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // Tipo selection
  overlay.querySelectorAll('.tipo-pill[data-tipo]').forEach(pill => {
    pill.addEventListener('click', () => {
      selectedTipo = pill.dataset.tipo;
      overlay.querySelectorAll('.tipo-pill[data-tipo]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Close
  overlay.querySelector('.modal-close').addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) { overlay.classList.add('hidden'); overlay.innerHTML = ''; }
  });

  // Create
  overlay.querySelector('#btn-create-ejercicio').addEventListener('click', () => {
    const nombre = overlay.querySelector('#new-ej-nombre').value.trim();
    if (!nombre) return;
    if (!selectedGrupo) { selectedGrupo = 'Core'; }
    const desc = overlay.querySelector('#new-ej-desc').value.trim();

    saveCustomEjercicio(nombre, {
      nombre,
      grupo: selectedGrupo,
      tipo: selectedTipo,
      usaPeso: true,
      descripcion: desc,
    });

    // Also add to catalog runtime so it appears immediately
    EJERCICIOS_CATALOGO.push({
      nombre,
      grupo: selectedGrupo,
      tipo: selectedTipo,
      usaPeso: true,
      descripcion: desc,
    });

    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    renderList(viewContainer);
  });
}
