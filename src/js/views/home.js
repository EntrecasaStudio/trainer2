import { store } from '../../store.js';
import { router } from '../../router.js';
import { getGreeting, formatDateLong, getLugarBadge, getCircuitColor, formatSetsReps } from '../../utils/format.js';
import { formatDateISO, getNextTrainingDay, isTrainingDay, WEEKDAY_LABELS, MONTH_NAMES, getISODayOfWeek, getCycleWeek, getFocusForDay } from '../../utils/calendar.js';
import { openModal, closeModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { showToastAction } from '../components/toast.js';
import { openEjercicioInfo } from './ejercicios.js';

let selectedDate = new Date();
let activeUsuario = null;
let _searchQuery = '';
let _searchVisible = false;
let _viewMonth = null;
let _viewYear = null;

export function mountHome(container) {
  activeUsuario = store.getActiveUser();
  document.body.setAttribute('data-usuario', activeUsuario);
  selectedDate = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  _viewMonth = selectedDate.getMonth();
  _viewYear = selectedDate.getFullYear();
  _searchQuery = '';
  _searchVisible = false;
  render(container);
}

function render(container) {
  container.innerHTML = `
    <div class="rutinas-header" style="margin-top:var(--space-sm);">
      <h1 style="font-size:var(--text-xl);font-weight:var(--fw-bold);">Home</h1>
      <div class="rutinas-header-actions">
        <button class="btn-icon-header" data-action="toggle-search" title="Buscar">
          <i class="ph ph-magnifying-glass"></i>
        </button>
        <div class="user-toggle" style="margin:0;">
          <button class="user-toggle-btn ${activeUsuario === 'Lean' ? 'active' : ''}" data-usuario="Lean">Lean</button>
          <button class="user-toggle-btn ${activeUsuario === 'Nat' ? 'active' : ''}" data-usuario="Nat">Nat</button>
        </div>
      </div>
    </div>
    <div class="rutinas-search" id="home-search-wrap">
      <input type="text" class="rutinas-search-input" id="home-search" placeholder="Buscar rutina..." autocomplete="off">
    </div>
    <div id="home-search-results" style="display:none;"></div>
    <div id="routine-card-container"></div>
    <div id="calendar-container"></div>
    <div id="next-workout-container"></div>
  `;

  // Toggle handlers — switch user & pull latest data from Firestore
  container.querySelectorAll('.user-toggle-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      activeUsuario = btn.dataset.usuario;
      store.setActiveUser(activeUsuario);
      document.body.setAttribute('data-usuario', activeUsuario);
      container.querySelectorAll('.user-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRoutineCard();
      renderCalendar();
      renderNextWorkout();

      // Pull latest from Firestore to get other device's sessions
      try {
        const { downloadAllData } = await import('../../js/services/sync.js');
        const updated = await downloadAllData();
        if (updated) {
          renderRoutineCard();
          renderCalendar();
          renderNextWorkout();
        }
      } catch {}
    });
  });

  // Search handlers
  container.querySelector('[data-action="toggle-search"]').addEventListener('click', () => {
    _searchVisible = !_searchVisible;
    const wrap = document.getElementById('home-search-wrap');
    const results = document.getElementById('home-search-results');
    wrap.classList.toggle('open', _searchVisible);
    if (_searchVisible) {
      setTimeout(() => document.getElementById('home-search').focus(), 100);
    } else {
      _searchQuery = '';
      document.getElementById('home-search').value = '';
      results.style.display = 'none';
      results.innerHTML = '';
    }
  });

  document.getElementById('home-search').addEventListener('input', (e) => {
    _searchQuery = e.target.value.toLowerCase().trim();
    renderSearchResults();
  });

  renderRoutineCard();
  renderCalendar();
  renderNextWorkout();
}

function getRoutineForDate(date, usuario) {
  const dateStr = formatDateISO(date);
  const overrides = store.getObj(store.KEYS.overrides);
  const override = overrides[usuario]?.[dateStr];

  if (override) {
    if (override.rest) return null;
    const rutinas = store.getAll(store.KEYS.rutinas);
    const found = rutinas.find(r => r.id === override.rutinaId);
    if (found) return found;

    // Stale ID — try to match by metadata
    const lugar = override.lugar || 'SPORT_FITNESS';
    const tipo = override.tipo;
    const match = rutinas.find(r => r.usuario === usuario && r.lugar === lugar && r.foco === tipo);
    if (match) return match;
  }

  // Fallback: check if there's a completed session for this date
  const sesiones = store.getAll(store.KEYS.sesiones);
  const sesion = sesiones.find(s => s.fecha === dateStr && s.usuario === usuario);
  if (sesion) {
    const rutinas = store.getAll(store.KEYS.rutinas);
    return rutinas.find(r => r.id === sesion.rutinaId)
      || rutinas.find(r => r.nombre === sesion.rutinaNombre && r.usuario === usuario)
      || null;
  }

  return null;
}

function renderSearchResults() {
  const container = document.getElementById('home-search-results');
  if (!container) return;

  if (!_searchQuery) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  const rutinas = store.getAll(store.KEYS.rutinas)
    .filter(r => r.usuario === activeUsuario)
    .filter(r => r.nombre.toLowerCase().includes(_searchQuery) || (r.numero || '').toLowerCase().includes(_searchQuery))
    .slice(0, 12);

  if (rutinas.length === 0) {
    container.style.display = '';
    container.innerHTML = `
      <div style="color:var(--color-text-muted);text-align:center;padding:var(--space-md);font-size:var(--text-sm);">Sin resultados</div>
    `;
    return;
  }

  container.style.display = '';
  container.innerHTML = rutinas.map(r => {
    const badge = getLugarBadge(r.lugar);
    return `
    <div class="home-search-item" data-id="${r.id}">
      <div style="flex:1;min-width:0;">
        <div style="font-size:var(--text-sm);font-weight:var(--fw-medium);">${r.nombre}</div>
        <div style="font-size:var(--text-xs);color:var(--color-text-muted);">${badge.text} ${r.numero} · ${r.circuitos.length} circuitos</div>
      </div>
      <i class="ph ph-caret-right" style="font-size:14px;color:var(--color-text-muted);"></i>
    </div>
  `}).join('');

  container.querySelectorAll('.home-search-item').forEach(item => {
    item.addEventListener('click', () => {
      const dateStr = formatDateISO(selectedDate);
      router.navigate(`workout/${item.dataset.id}/${dateStr}`);
    });
  });
}

function getPausedWorkout() {
  try {
    const raw = localStorage.getItem('gym_active_workout');
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.savedAt && Date.now() - data.savedAt > 6 * 60 * 60 * 1000) return null;
    if (!data.workoutState) return null;
    return { ...data.workoutState, _elapsedSeconds: data.elapsedSeconds || 0 };
  } catch { return null; }
}

function renderPausedBanner(container) {
  const paused = getPausedWorkout();
  if (!paused || paused.usuario !== activeUsuario) return '';

  const completedCircuits = (paused.circuitos || []).filter(c => c.completed).length;
  const totalCircuits = (paused.circuitos || []).length;

  const banner = document.createElement('div');
  banner.className = 'home-paused-banner';
  banner.innerHTML = `
    <div style="display:flex;align-items:center;gap:var(--space-sm);flex:1;min-width:0;">
      <i class="ph-fill ph-pause-circle" style="font-size:24px;color:var(--color-warning);flex-shrink:0;"></i>
      <div style="min-width:0;">
        <div style="font-size:var(--text-sm);font-weight:var(--fw-semibold);">Entrenamiento en pausa</div>
        <div style="font-size:var(--text-xs);color:var(--color-text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          ${paused.rutinaNombre} · ${completedCircuits}/${totalCircuits} circuitos
        </div>
      </div>
    </div>
    <button class="btn btn-primary btn-sm" id="btn-resume-workout">
      <i class="ph ph-play" style="font-size:14px;"></i> Continuar
    </button>
  `;
  container.prepend(banner);

  document.getElementById('btn-resume-workout')?.addEventListener('click', () => {
    router.navigate(`workout/${paused.rutinaId}/${paused.fecha}`);
  });
}

function renderRoutineCard() {
  const container = document.getElementById('routine-card-container');
  if (!container) return;

  const rutina = getRoutineForDate(selectedDate, activeUsuario);

  if (!rutina) {
    const nextDay = getNextTrainingDay(selectedDate);
    const nextRutina = getRoutineForDate(nextDay, activeUsuario);
    container.innerHTML = `
      <div class="home-day-card home-day-card-rest">
        <div class="rest-day-emoji"><i class="ph-light ph-moon" style="font-size:28px;color:var(--color-text-muted);"></i></div>
        <div class="rest-day-text">Día libre</div>
        <div class="rest-day-next">
          Próximo: ${nextRutina ? nextRutina.nombre : 'Sin asignar'} · ${formatDateLong(nextDay)}
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-assign-day" style="margin-top:var(--space-sm);">
          <i class="ph ph-plus" style="font-size:14px;margin-right:var(--space-xs);"></i> Asignar rutina
        </button>
      </div>
    `;
    document.getElementById('btn-assign-day')?.addEventListener('click', () => {
      openAssignSheet();
    });
    renderPausedBanner(container);
    return;
  }

  const badge = getLugarBadge(rutina.lugar);
  const isExpanded = container._homeExpanded || false;
  const dateStr = formatDateISO(selectedDate);
  const sesiones = store.getAll(store.KEYS.sesiones);
  const isCompleted = sesiones.some(s => s.fecha === dateStr && s.usuario === activeUsuario);

  container.innerHTML = `
    <div class="home-day-card ${isCompleted ? 'home-day-card--done' : ''}">
      <div class="home-day-card-body" id="routine-card-top">
        <div style="flex:1;min-width:0;">
          <div class="routine-card-header">
            <span class="badge ${badge.cls}">${badge.text} ${rutina.numero}</span>
          </div>
          <div class="routine-name">${rutina.nombre}</div>
          <div class="home-day-card-status">
            ${isCompleted ? `<span class="home-day-card-done-badge"><i class="ph-fill ph-check-circle" style="font-size:14px;"></i> Completada</span>` : ''}
          </div>
        </div>
      </div>

      <div class="home-day-card-actions">
        <button class="btn-action-icon" id="btn-rest-day" title="Descanso">
          <i class="ph ph-moon" style="font-size:18px;"></i>
        </button>
        <button class="btn-action-icon" id="btn-edit-routine" title="Editar">
          <i class="ph ph-pencil-simple" style="font-size:18px;"></i>
        </button>
        <button class="btn-action-icon" id="btn-swap-routine" title="Cambiar rutina">
          <i class="ph ph-swap" style="font-size:18px;"></i>
        </button>
        <button class="btn btn-primary" id="btn-start-workout" style="margin-left:auto;">
          <i class="ph ph-barbell" style="font-size:18px;"></i> Entrenar
        </button>
      </div>

      <div class="rutina-expand-wrap ${isExpanded ? 'open' : ''}">
        <div class="rutina-expand-inner">
          ${renderCircuits(rutina.circuitos)}
        </div>
      </div>
    </div>
  `;

  // Expand/collapse
  document.getElementById('routine-card-top')?.addEventListener('click', () => {
    container._homeExpanded = !container._homeExpanded;
    const wrap = container.querySelector('.rutina-expand-wrap');
    wrap.classList.toggle('open');
  });

  document.getElementById('btn-start-workout')?.addEventListener('click', (e) => {
    e.stopPropagation();
    router.navigate(`workout/${rutina.id}/${formatDateISO(selectedDate)}`);
  });

  document.getElementById('btn-edit-routine')?.addEventListener('click', (e) => {
    e.stopPropagation();
    router.navigate(`rutina-edit/${rutina.id}`);
  });

  document.getElementById('btn-swap-routine')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openAssignSheet();
  });

  document.getElementById('btn-rest-day')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const dateStr = formatDateISO(selectedDate);
    const overrides = store.getObj(store.KEYS.overrides);
    if (!overrides[activeUsuario]) overrides[activeUsuario] = {};
    const saved = overrides[activeUsuario][dateStr];
    overrides[activeUsuario][dateStr] = { rest: true };
    store.set(store.KEYS.overrides, overrides);
    renderRoutineCard();
    showToastAction('Día de descanso', 'Deshacer', () => {
      const ov = store.getObj(store.KEYS.overrides);
      if (!ov[activeUsuario]) ov[activeUsuario] = {};
      if (saved) {
        ov[activeUsuario][dateStr] = saved;
      } else {
        delete ov[activeUsuario][dateStr];
      }
      store.set(store.KEYS.overrides, ov);
      renderRoutineCard();
    });
  });

  // Info buttons on exercise rows
  container.querySelectorAll('.info-btn-home').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEjercicioInfo(btn.dataset.nombre);
    });
  });

  renderPausedBanner(container);
}

function getCircName(c) {
  if (c.nombre) return c.nombre;
  if (Array.isArray(c.grupoMuscular)) return c.grupoMuscular.join(' · ');
  if (typeof c.grupoMuscular === 'string') return c.grupoMuscular;
  return 'Circuito';
}

function renderCircuit(c, i) {
  const circName = getCircName(c);
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
            <div style="display:flex;align-items:center;gap:var(--space-xs);">
              <span class="exercise-sets">${formatSetsReps(e)}</span>
              <button class="btn-icon info-btn-home" data-nombre="${e.nombre}" title="Info del ejercicio"
                      style="-webkit-tap-highlight-color:transparent;">
                <i class="ph ph-info" style="font-size:14px;color:var(--color-text-muted);"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Wrapper to join circuits with dividers
function renderCircuits(circuitos) {
  return circuitos.map((c, i) => renderCircuit(c, i)).join('<div class="circuit-divider"></div>');
}

function openAssignSheet() {
  const LUGAR_ORDER = ['SPORT_FITNESS', 'RIO', 'CASA', 'URUGUAY', 'RECOVERY'];
  const LUGAR_CHIPS = { SPORT_FITNESS: 'Sport', RIO: 'Río', CASA: 'Casa', URUGUAY: '🇺🇾', RECOVERY: 'Recovery' };
  const LUGAR_LABELS = { SPORT_FITNESS: 'Sport Fitness', RIO: 'Río', CASA: 'Casa', URUGUAY: '🇺🇾 Uruguay', RECOVERY: 'Recovery' };

  let activeLugares = [...LUGAR_ORDER];
  let query = '';

  function buildList() {
    const q = query.toLowerCase();
    const rutinas = store.getAll(store.KEYS.rutinas)
      .filter(r => r.usuario === activeUsuario && activeLugares.includes(r.lugar))
      .filter(r => !q || r.nombre.toLowerCase().includes(q) || String(r.numero || '').toLowerCase().includes(q));

    const grouped = {};
    rutinas.forEach(r => {
      if (!grouped[r.lugar]) grouped[r.lugar] = [];
      grouped[r.lugar].push(r);
    });

    return LUGAR_ORDER.filter(l => grouped[l]).map(lugar => `
      <div style="margin-bottom:var(--space-md);">
        <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--color-text-muted);letter-spacing:0.5px;padding:var(--space-xs) 0;">${LUGAR_LABELS[lugar]}</div>
        ${grouped[lugar].map(r => `
          <div class="rutina-list-item assign-pick" data-id="${r.id}" style="cursor:pointer;">
            <div class="rutina-list-header">
              <span class="rutina-list-code">${r.numero}</span>
            </div>
            <div class="rutina-list-name">${r.nombre}</div>
          </div>
        `).join('')}
      </div>
    `).join('') || '<div style="color:var(--color-text-muted);text-align:center;padding:var(--space-lg);">Sin resultados</div>';
  }

  const filterHTML = LUGAR_ORDER.map(l => `
    <button class="lugar-chip active" data-lugar="${l}">${LUGAR_CHIPS[l]}</button>
  `).join('');

  const contentHTML = `
    <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-sm);flex-wrap:wrap;" id="assign-filters">${filterHTML}</div>
    <input type="text" class="search-input" id="assign-search" placeholder="Buscar rutina..." style="width:100%;margin-bottom:var(--space-md);box-sizing:border-box;">
    <div id="assign-list" style="max-height:50vh;overflow-y:auto;">${buildList()}</div>
  `;

  openModal('Asignar rutina', contentHTML, {
    onMount(body) {
      function bindListClicks() {
        body.querySelectorAll('.assign-pick').forEach(item => {
          item.addEventListener('click', () => {
            const newId = item.dataset.id;
            const dateStr = formatDateISO(selectedDate);
            const overrides = store.getObj(store.KEYS.overrides);
            if (!overrides[activeUsuario]) overrides[activeUsuario] = {};
            const allRutinas = store.getAll(store.KEYS.rutinas);
            const picked = allRutinas.find(r => r.id === newId);
            const ov = { rutinaId: newId };
            if (picked) { ov.lugar = picked.lugar; ov.tipo = picked.foco; }
            overrides[activeUsuario][dateStr] = ov;
            store.set(store.KEYS.overrides, overrides);
            closeModal();
            renderRoutineCard();
            renderCalendar();
          });
        });
      }

      function refreshList() {
        const listEl = body.querySelector('#assign-list');
        listEl.innerHTML = buildList();
        bindListClicks();
      }

      // Lugar filter chips — single tap toggles, double tap solo-selects
      let lastChipTap = { lugar: null, time: 0 };
      body.querySelectorAll('.lugar-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const lugar = chip.dataset.lugar;
          const now = Date.now();
          const isDoubleTap = lastChipTap.lugar === lugar && (now - lastChipTap.time) < 400;
          lastChipTap = { lugar, time: now };

          if (isDoubleTap) {
            activeLugares = [lugar];
          } else if (activeLugares.includes(lugar)) {
            activeLugares = activeLugares.filter(l => l !== lugar);
            if (activeLugares.length === 0) activeLugares = [lugar];
          } else {
            activeLugares.push(lugar);
          }
          body.querySelectorAll('.lugar-chip').forEach(c => {
            c.classList.toggle('active', activeLugares.includes(c.dataset.lugar));
          });
          refreshList();
        });
      });

      // Search
      body.querySelector('#assign-search').addEventListener('input', (e) => {
        query = e.target.value;
        refreshList();
      });

      bindListClicks();
    }
  });
}

function openEditSheet(currentRutina) {
  const LUGAR_ORDER = ['SPORT_FITNESS', 'RIO', 'CASA', 'URUGUAY', 'RECOVERY'];
  const LUGAR_CHIPS = { SPORT_FITNESS: 'Sport', RIO: 'Río', CASA: 'Casa', URUGUAY: '🇺🇾', RECOVERY: 'Recovery' };

  let activeLugares = [currentRutina.lugar];
  let query = '';
  let expandedId = null;

  function buildList() {
    const q = query.toLowerCase();
    const rutinas = store.getAll(store.KEYS.rutinas)
      .filter(r => r.usuario === activeUsuario && activeLugares.includes(r.lugar))
      .filter(r => !q || r.nombre.toLowerCase().includes(q) || String(r.numero || '').toLowerCase().includes(q));

    if (rutinas.length === 0) {
      return '<div style="color:var(--color-text-muted);text-align:center;padding:var(--space-lg);">Sin resultados</div>';
    }

    return rutinas.map(r => {
      const isCurrent = r.id === currentRutina.id;
      const isExpanded = expandedId === r.id;
      const badge = getLugarBadge(r.lugar);
      return `
        <div class="swap-item ${isCurrent ? 'swap-item--current' : ''}" data-id="${r.id}">
          <div class="swap-item-top" data-action="expand" data-id="${r.id}">
            <div style="flex:1;min-width:0;">
              <span class="badge ${badge.cls}" style="font-size:var(--text-xs);">${badge.text} ${r.numero}</span>
              <div style="font-weight:var(--fw-bold);margin-top:2px;">${r.nombre}</div>
              <div style="font-size:var(--text-sm);color:var(--color-text-muted);">${r.foco || ''} · ${r.circuitos.length} circuitos</div>
            </div>
            <i class="ph ph-caret-down" style="font-size:16px;color:var(--color-text-muted);transition:transform 0.2s;${isExpanded ? 'transform:rotate(180deg);' : ''}"></i>
          </div>
          ${isExpanded ? `
            <div class="swap-item-detail">
              ${r.circuitos.map(c => {
                const color = getCircuitColor(c.nombre);
                return `
                  <div style="margin-bottom:var(--space-sm);">
                    <div style="display:flex;align-items:center;gap:var(--space-xs);margin-bottom:2px;">
                      <span style="font-size:var(--text-sm);color:var(--color-text-muted);">${c.numero}</span>
                      <span style="font-size:var(--text-sm);font-weight:var(--fw-semibold);color:${color};">${c.nombre}</span>
                    </div>
                    ${c.ejercicios.map(e => `
                      <div style="display:flex;justify-content:space-between;padding-left:20px;font-size:var(--text-sm);color:var(--color-text-muted);">
                        <span>${e.nombre}</span>
                        <span style="font-weight:var(--fw-semibold);">${formatSetsReps(e)}</span>
                      </div>
                    `).join('')}
                  </div>
                `;
              }).join('')}
              <button class="btn btn-primary btn-sm swap-select-btn" data-id="${r.id}" style="width:100%;margin-top:var(--space-sm);">
                ${isCurrent ? 'Mantener esta' : 'Elegir esta'}
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  const filterHTML = LUGAR_ORDER.map(l => `
    <button class="lugar-chip ${activeLugares.includes(l) ? 'active' : ''}" data-lugar="${l}">${LUGAR_CHIPS[l]}</button>
  `).join('');

  const contentHTML = `
    <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-sm);flex-wrap:wrap;" id="swap-filters">${filterHTML}</div>
    <input type="text" class="search-input" id="swap-search" placeholder="Buscar rutina..." style="width:100%;margin-bottom:var(--space-md);box-sizing:border-box;">
    <div id="swap-list" style="max-height:50vh;overflow-y:auto;">${buildList()}</div>
    <button class="btn btn-secondary" id="btn-dejar-libre" style="width:100%;margin-top:var(--space-md);">
      <i class="ph-light ph-moon" style="font-size:16px;margin-right:var(--space-xs);"></i> Dejar libre
    </button>
  `;

  openModal('Cambiar rutina', contentHTML, {
    onMount(body) {
      function bindListEvents() {
        // Expand/collapse
        body.querySelectorAll('[data-action="expand"]').forEach(top => {
          top.addEventListener('click', () => {
            const id = top.dataset.id;
            expandedId = expandedId === id ? null : id;
            refreshList();
          });
        });
        // Select buttons
        body.querySelectorAll('.swap-select-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newId = btn.dataset.id;
            const dateStr = formatDateISO(selectedDate);
            const overrides = store.getObj(store.KEYS.overrides);
            if (!overrides[activeUsuario]) overrides[activeUsuario] = {};
            const allRutinas = store.getAll(store.KEYS.rutinas);
            const picked = allRutinas.find(r => r.id === newId);
            const ov = { rutinaId: newId };
            if (picked) { ov.lugar = picked.lugar; ov.tipo = picked.foco; }
            overrides[activeUsuario][dateStr] = ov;
            store.set(store.KEYS.overrides, overrides);
            closeModal();
            renderRoutineCard();
            renderCalendar();
          });
        });
      }

      function refreshList() {
        const listEl = body.querySelector('#swap-list');
        listEl.innerHTML = buildList();
        bindListEvents();
      }

      // Lugar filter chips — single tap toggles, double tap solo-selects
      let lastChipTap = { lugar: null, time: 0 };
      body.querySelectorAll('.lugar-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const lugar = chip.dataset.lugar;
          const now = Date.now();
          const isDoubleTap = lastChipTap.lugar === lugar && (now - lastChipTap.time) < 400;
          lastChipTap = { lugar, time: now };

          if (isDoubleTap) {
            activeLugares = [lugar];
          } else if (activeLugares.includes(lugar)) {
            activeLugares = activeLugares.filter(l => l !== lugar);
            if (activeLugares.length === 0) activeLugares = [lugar];
          } else {
            activeLugares.push(lugar);
          }
          body.querySelectorAll('.lugar-chip').forEach(c => {
            c.classList.toggle('active', activeLugares.includes(c.dataset.lugar));
          });
          refreshList();
        });
      });

      // Search
      body.querySelector('#swap-search').addEventListener('input', (e) => {
        query = e.target.value;
        refreshList();
      });

      // Dejar libre
      body.querySelector('#btn-dejar-libre').addEventListener('click', () => {
        const dateStr = formatDateISO(selectedDate);
        const overrides = store.getObj(store.KEYS.overrides);
        if (overrides[activeUsuario]?.[dateStr]) {
          delete overrides[activeUsuario][dateStr];
          store.set(store.KEYS.overrides, overrides);
        }
        closeModal();
        renderRoutineCard();
        renderCalendar();
      });

      bindListEvents();
    }
  });
}

function renderCalendar() {
  const container = document.getElementById('calendar-container');
  if (!container) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get first day of month and pad to Monday
  const firstDay = new Date(_viewYear, _viewMonth, 1);
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

  // Check overrides for dots — only show dot if the rutina actually exists
  const overrides = store.getObj(store.KEYS.overrides);
  const rutinas = store.getAll(store.KEYS.rutinas);
  const rutinaIds = new Set(rutinas.map(r => r.id));
  const sesiones = store.getAll(store.KEYS.sesiones);

  const monthName = MONTH_NAMES[_viewMonth];

  container.innerHTML = `
    <div class="calendar">
      <div class="calendar-header">
        <button class="btn-icon-header" id="cal-prev" title="Mes anterior">
          <i class="ph ph-caret-left"></i>
        </button>
        <span class="calendar-title">${monthName} ${_viewYear}</span>
        <button class="btn-icon-header" id="cal-next" title="Mes siguiente">
          <i class="ph ph-caret-right"></i>
        </button>
      </div>
      <div class="calendar-grid">
        ${WEEKDAY_LABELS.map(l => `<span class="cal-weekday">${l}</span>`).join('')}
        ${days.map(day => {
          const dateStr = formatDateISO(day);
          const isToday = dateStr === formatDateISO(today);
          const isSelected = dateStr === formatDateISO(selectedDate);
          const isOtherMonth = day.getMonth() !== _viewMonth;
          const ov = overrides[activeUsuario]?.[dateStr];
          const hasWorkout = ov && rutinaIds.has(ov.rutinaId);
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

  // Month navigation
  document.getElementById('cal-prev')?.addEventListener('click', () => {
    _viewMonth--;
    if (_viewMonth < 0) { _viewMonth = 11; _viewYear--; }
    renderCalendar();
  });
  document.getElementById('cal-next')?.addEventListener('click', () => {
    _viewMonth++;
    if (_viewMonth > 11) { _viewMonth = 0; _viewYear++; }
    renderCalendar();
  });

  // Day selection
  container.querySelectorAll('.cal-day').forEach(dayEl => {
    dayEl.addEventListener('click', () => {
      const date = new Date(dayEl.dataset.date + 'T00:00:00');
      selectedDate = date;
      _viewMonth = date.getMonth();
      _viewYear = date.getFullYear();
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
