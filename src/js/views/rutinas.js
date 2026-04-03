import { store } from '../../store.js';
import { getLugarBadge, getCircuitColor, formatSetsReps } from '../../utils/format.js';
import { router } from '../../router.js';
import { showToast, showToastAction } from '../components/toast.js';
import { closeModal } from '../components/modal.js';
import { WEEKDAY_FULL, formatDateISO } from '../../utils/calendar.js';

const LUGAR_LABELS = {
  SPORT_FITNESS: 'Sport',
  RIO: 'Río',
  URUGUAY: '🇺🇾',
};

const DAYS = [
  { iso: 1, short: 'Lun', full: 'Lunes' },
  { iso: 2, short: 'Mar', full: 'Martes' },
  { iso: 3, short: 'Mié', full: 'Miércoles' },
  { iso: 4, short: 'Jue', full: 'Jueves' },
  { iso: 5, short: 'Vie', full: 'Viernes' },
  { iso: 6, short: 'Sáb', full: 'Sábado' },
  { iso: 7, short: 'Dom', full: 'Domingo' },
];

let lastTapTime = {};
let expandedRutinas = new Set();
let _container = null;
let _currentUser = '';
let _activeLugares = [];
let _searchQuery = '';

export function mountRutinas(container) {
  _container = container;
  _currentUser = store.getActiveUser();
  document.body.setAttribute('data-usuario', _currentUser);
  _activeLugares = store.getFilterLugar();
  _searchQuery = '';

  container.innerHTML = `
    <div class="rutinas-header">
      <h1 style="font-size: var(--text-xl); font-weight: var(--fw-bold);">Rutinas</h1>
      <div class="rutinas-header-actions">
        <button class="btn-icon-header" data-action="toggle-search" title="Buscar">
          <i class="ph ph-magnifying-glass"></i>
        </button>
        <button class="btn-icon-header" data-action="new-rutina" title="Nueva rutina">
          <i class="ph ph-plus"></i>
        </button>
        <div class="user-toggle" style="margin:0;">
          <button class="user-toggle-btn ${_currentUser === 'Lean' ? 'active' : ''}" data-usuario="Lean">Lean</button>
          <button class="user-toggle-btn ${_currentUser === 'Nat' ? 'active' : ''}" data-usuario="Nat">Nat</button>
        </div>
      </div>
    </div>
    <div class="rutinas-search" id="rutinas-search-wrap">
      <input type="text" class="rutinas-search-input" id="rutinas-search-input"
             placeholder="Buscar rutina..." value="" autocomplete="off">
    </div>
    <div class="rutinas-filters-row">
      <div class="rutinas-filters" id="lugar-filters"></div>
      <button class="btn btn-secondary btn-sm" data-action="open-ejercicios" style="flex-shrink:0;gap:4px;">
        <i class="ph ph-barbell" style="font-size:16px;"></i> Ejercicios
      </button>
    </div>
    <div id="rutinas-list"></div>
  `;

  // Search toggle
  container.querySelector('[data-action="toggle-search"]').addEventListener('click', () => {
    const wrap = document.getElementById('rutinas-search-wrap');
    const isOpen = wrap.classList.toggle('open');
    if (isOpen) {
      const input = document.getElementById('rutinas-search-input');
      if (input) setTimeout(() => input.focus(), 100);
    } else {
      _searchQuery = '';
      document.getElementById('rutinas-search-input').value = '';
      renderList();
    }
  });

  // Search input
  document.getElementById('rutinas-search-input').addEventListener('input', (e) => {
    _searchQuery = e.target.value;
    renderList();
  });

  // Open ejercicios
  container.querySelector('[data-action="open-ejercicios"]').addEventListener('click', () => {
    router.navigate('ejercicios');
  });

  // New rutina
  container.querySelector('[data-action="new-rutina"]').addEventListener('click', () => {
    const numero = getNextNumero();
    const nueva = {
      id: crypto.randomUUID(),
      numero,
      nombre: 'Nueva rutina',
      usuario: _currentUser,
      lugar: 'SPORT_FITNESS',
      tipo: 'gimnasio',
      foco: 'press',
      semana_ciclo: 1,
      circuitos: [],
      updatedAt: new Date().toISOString(),
      pendingSync: false,
    };
    const all = store.getAll(store.KEYS.rutinas);
    all.push(nueva);
    store.set(store.KEYS.rutinas, all);
    router.navigate(`rutina-edit/${nueva.id}`);
  });

  // User toggle
  container.querySelectorAll('.user-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentUser = btn.dataset.usuario;
      store.setActiveUser(_currentUser);
      document.body.setAttribute('data-usuario', _currentUser);
      container.querySelectorAll('.user-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderList();
    });
  });

  renderFilters();
  renderList();
}

function getNextNumero() {
  const all = store.getAll(store.KEYS.rutinas).filter(r => r.usuario === _currentUser);
  const prefix = '#';
  const nums = all
    .filter(r => typeof r.numero === 'string' && r.numero.startsWith(prefix))
    .map(r => parseInt(r.numero.slice(prefix.length), 10))
    .filter(n => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}

function renderFilters() {
  const filtersEl = document.getElementById('lugar-filters');
  filtersEl.innerHTML = Object.entries(LUGAR_LABELS).map(([key, label]) => `
    <button class="lugar-chip ${_activeLugares.includes(key) ? 'active' : ''}" data-lugar="${key}">${label}</button>
  `).join('');

  filtersEl.querySelectorAll('.lugar-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const lugar = chip.dataset.lugar;
      const now = Date.now();
      const lastTap = lastTapTime[lugar] || 0;

      if (now - lastTap < 300) {
        _activeLugares = [lugar];
      } else {
        if (_activeLugares.includes(lugar)) {
          _activeLugares = _activeLugares.filter(l => l !== lugar);
          if (_activeLugares.length === 0) _activeLugares = [lugar];
        } else {
          _activeLugares.push(lugar);
        }
      }

      lastTapTime[lugar] = now;
      store.setFilterLugar(_activeLugares);
      renderFilters();
      renderList();
    });
  });
}

function renderList() {
  const listEl = document.getElementById('rutinas-list');
  if (!listEl) return;
  const q = _searchQuery.toLowerCase();
  const rutinas = store.getAll(store.KEYS.rutinas)
    .filter(r => r.usuario === _currentUser && _activeLugares.includes(r.lugar))
    .filter(r => !q || r.nombre.toLowerCase().includes(q) || (r.numero || '').toLowerCase().includes(q));

  if (rutinas.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="ph-light ph-clipboard-text" style="font-size:48px;"></i></div>
        <div class="empty-state-text">No hay rutinas para este filtro</div>
      </div>
    `;
    return;
  }

  listEl.innerHTML = rutinas.map(r => {
    const badge = getLugarBadge(r.lugar);
    const isExpanded = expandedRutinas.has(r.id);
    return `
      <div class="rutina-list-item ${isExpanded ? 'expanded' : ''}" data-id="${r.id}">
        <div class="rutina-list-top">
          <div style="flex:1;min-width:0;">
            <div class="rutina-list-header">
              <span class="badge ${badge.cls}">${badge.text} ${r.numero}</span>
            </div>
            <div class="rutina-list-name">${r.nombre}</div>
            <div class="rutina-list-meta">
              ${r.foco ? `<span>${r.foco}</span><span>·</span>` : ''}
              <span>${r.circuitos.length} circuitos</span>
            </div>
          </div>
        </div>
        <div class="rutina-expand-wrap ${isExpanded ? 'open' : ''}">
          <div class="rutina-expand-inner">
            ${renderExpanded(r)}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Bind events
  listEl.querySelectorAll('.rutina-list-item').forEach(item => {
    const id = item.dataset.id;

    item.querySelector('.rutina-list-top').addEventListener('click', () => {
      const wrap = item.querySelector('.rutina-expand-wrap');
      const isOpen = expandedRutinas.has(id);

      if (isOpen) {
        expandedRutinas.delete(id);
        wrap.classList.remove('open');
        item.classList.remove('expanded');
      } else {
        expandedRutinas.add(id);
        wrap.classList.add('open');
        item.classList.add('expanded');
      }
    });

    // Action buttons
    item.querySelector('.btn-action-start')?.addEventListener('click', (e) => {
      e.stopPropagation();
      router.navigate(`workout/${id}/${new Date().toISOString().slice(0, 10)}`);
    });

    item.querySelector('.btn-action-edit')?.addEventListener('click', (e) => {
      e.stopPropagation();
      router.navigate(`rutina-edit/${id}`);
    });

    item.querySelector('.btn-action-calendar')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const rutina = store.findById(store.KEYS.rutinas, id);
      if (rutina) showDayPicker(rutina);
    });

    item.querySelector('.btn-action-delete')?.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteRutina(id);
    });
  });
}

function renderExpanded(rutina) {
  return `
    <div class="rutina-circuits-detail">
      ${rutina.circuitos.map((c, i) => {
        const circName = c.nombre || (Array.isArray(c.grupoMuscular) ? c.grupoMuscular.join(' · ') : (typeof c.grupoMuscular === 'string' ? c.grupoMuscular : 'Circuito'));
        const circNum = c.numero != null ? c.numero : (i + 1);
        const color = getCircuitColor(circName);
        return `
        <div class="circuit-item">
          <div class="circuit-header">
            <span class="circuit-number">${circNum}</span>
            <span class="circuit-name" style="color: ${color}">${circName}</span>
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
      `}).join('<div class="circuit-divider"></div>')}
      <div class="rutina-actions">
        <button class="btn-action-icon btn-action-delete" title="Eliminar">
          <i class="ph ph-trash" style="font-size:18px;"></i>
        </button>
        <button class="btn-action-icon btn-action-edit" title="Editar">
          <i class="ph ph-pencil-simple" style="font-size:18px;"></i>
        </button>
        <button class="btn-action-icon btn-action-calendar" title="Asignar día">
          <i class="ph ph-calendar" style="font-size:18px;"></i>
        </button>
        <button class="btn btn-primary btn-action-start" style="margin-left:auto;">
          <i class="ph ph-barbell" style="font-size:18px;"></i> Entrenar
        </button>
      </div>
    </div>
  `;
}

// ── Delete with undo ──────────────────────────────────────────────────────────

function deleteRutina(id) {
  const rutinas = store.getAll(store.KEYS.rutinas);
  const rutina = rutinas.find(r => r.id === id);
  if (!rutina) return;

  // Remove
  store.set(store.KEYS.rutinas, rutinas.filter(r => r.id !== id));
  expandedRutinas.delete(id);
  renderList();

  // Also remove from overrides
  const overrides = store.getObj(store.KEYS.overrides);
  const usuario = rutina.usuario;
  if (overrides[usuario]) {
    const userOverrides = overrides[usuario];
    for (const date in userOverrides) {
      if (userOverrides[date].rutinaId === id) {
        delete userOverrides[date];
      }
    }
    store.set(store.KEYS.overrides, overrides);
  }

  showToastAction('Rutina eliminada', 'Deshacer', () => {
    // Restore
    const current = store.getAll(store.KEYS.rutinas);
    current.push(rutina);
    store.set(store.KEYS.rutinas, current);
    renderList();
  });
}

// ── Day picker modal ──────────────────────────────────────────────────────────

function showDayPicker(rutina) {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');

  // Find current assignment
  const overrides = store.getObj(store.KEYS.overrides);
  const userOverrides = overrides[rutina.usuario] || {};
  const assignedDates = Object.entries(userOverrides)
    .filter(([, v]) => v.rutinaId === rutina.id)
    .map(([date]) => date);

  overlay.innerHTML = `
    <div class="modal-sheet" role="dialog">
      <div class="modal-header">
        <h2 class="modal-title">Asignar día</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-md);">${rutina.nombre}</p>
        <div class="day-picker-grid">
          ${DAYS.map(d => `
            <button class="day-picker-btn" data-iso="${d.iso}">
              <span class="day-picker-short">${d.short}</span>
            </button>
          `).join('')}
        </div>
        <div style="margin-top:var(--space-md);display:flex;flex-direction:column;gap:var(--space-sm);">
          <p style="font-size:var(--text-xs);color:var(--color-text-muted);">Seleccioná una fecha específica:</p>
          <input type="date" id="day-picker-date" class="search-input" style="padding:var(--space-sm) var(--space-md);">
          <button class="btn btn-primary btn-lg" id="btn-assign-date" style="width:100%;">Asignar a fecha</button>
        </div>
        ${assignedDates.length > 0 ? `
          <div style="margin-top:var(--space-md);padding-top:var(--space-md);border-top:1px solid var(--color-border);">
            <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:var(--space-sm);">Asignada en:</p>
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-xs);">
              ${assignedDates.slice(0, 8).map(d => `<span class="badge badge-sport">${d}</span>`).join('')}
              ${assignedDates.length > 8 ? `<span style="font-size:var(--text-xs);color:var(--color-text-muted);">+${assignedDates.length - 8} más</span>` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Close
  overlay.querySelector('.modal-close').addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) { overlay.classList.add('hidden'); overlay.innerHTML = ''; }
  });

  // Day of week buttons — assign to next occurrence of that weekday
  overlay.querySelectorAll('.day-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isoDow = parseInt(btn.dataset.iso);
      const date = getNextDayOfWeek(isoDow);
      assignToDate(rutina, date);
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
      showToast(`Asignada a ${formatDateISO(date)}`);
    });
  });

  // Specific date
  overlay.querySelector('#btn-assign-date').addEventListener('click', () => {
    const input = overlay.querySelector('#day-picker-date');
    if (!input.value) return;
    const date = new Date(input.value + 'T00:00:00');
    assignToDate(rutina, date);
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    showToast(`Asignada a ${formatDateISO(date)}`);
  });
}

function getNextDayOfWeek(isoDow) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDow = today.getDay() === 0 ? 7 : today.getDay();
  let daysAhead = isoDow - currentDow;
  if (daysAhead <= 0) daysAhead += 7;
  const target = new Date(today);
  target.setDate(target.getDate() + daysAhead);
  return target;
}

function assignToDate(rutina, date) {
  const dateStr = formatDateISO(date);
  const overrides = store.getObj(store.KEYS.overrides);
  if (!overrides[rutina.usuario]) overrides[rutina.usuario] = {};
  overrides[rutina.usuario][dateStr] = {
    rutinaId: rutina.id,
    tipo: rutina.foco || 'cross',
  };
  store.set(store.KEYS.overrides, overrides);
}
