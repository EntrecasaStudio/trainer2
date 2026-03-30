import { store } from '../../store.js';
import { getLugarBadge } from '../../utils/format.js';
import { router } from '../../router.js';

const LUGAR_LABELS = {
  SPORT_FITNESS: 'Sport',
  RIO: 'Río',
  URUGUAY: '🇺🇾',
};

let lastTapTime = {};

export function mountRutinas(container) {
  const activeUsuario = store.getActiveUser();
  let activeLugares = store.getFilterLugar();

  container.innerHTML = `
    <div class="rutinas-header">
      <h1 style="font-size: var(--text-xl); font-weight: var(--fw-bold);">Rutinas</h1>
    </div>
    <div class="user-toggle" style="margin-bottom: var(--space-md);">
      <button class="user-toggle-btn ${activeUsuario === 'Lean' ? 'active' : ''}" data-usuario="Lean">Lean</button>
      <button class="user-toggle-btn ${activeUsuario === 'Nat' ? 'active' : ''}" data-usuario="Nat">Nat</button>
    </div>
    <div class="rutinas-filters" id="lugar-filters"></div>
    <div id="rutinas-list"></div>
  `;

  let currentUser = activeUsuario;

  // User toggle
  container.querySelectorAll('.user-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentUser = btn.dataset.usuario;
      store.setActiveUser(currentUser);
      container.querySelectorAll('.user-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderList();
    });
  });

  renderFilters();
  renderList();

  function renderFilters() {
    const filtersEl = document.getElementById('lugar-filters');
    filtersEl.innerHTML = Object.entries(LUGAR_LABELS).map(([key, label]) => `
      <button class="lugar-chip ${activeLugares.includes(key) ? 'active' : ''}" data-lugar="${key}">${label}</button>
    `).join('');

    filtersEl.querySelectorAll('.lugar-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const lugar = chip.dataset.lugar;
        const now = Date.now();
        const lastTap = lastTapTime[lugar] || 0;

        if (now - lastTap < 300) {
          // Double tap — isolate
          activeLugares = [lugar];
        } else {
          // Single tap — toggle
          if (activeLugares.includes(lugar)) {
            activeLugares = activeLugares.filter(l => l !== lugar);
            if (activeLugares.length === 0) activeLugares = [lugar]; // keep at least one
          } else {
            activeLugares.push(lugar);
          }
        }

        lastTapTime[lugar] = now;
        store.setFilterLugar(activeLugares);
        renderFilters();
        renderList();
      });
    });
  }

  function renderList() {
    const listEl = document.getElementById('rutinas-list');
    const rutinas = store.getAll(store.KEYS.rutinas)
      .filter(r => r.usuario === currentUser && activeLugares.includes(r.lugar));

    if (rutinas.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-text">No hay rutinas para este filtro</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = rutinas.map(r => {
      const badge = getLugarBadge(r.lugar);
      return `
        <div class="rutina-list-item" data-id="${r.id}">
          <div class="rutina-list-header">
            <span class="rutina-list-code">${r.numero}</span>
            <span class="badge ${badge.cls}">${badge.text}</span>
          </div>
          <div class="rutina-list-name">${r.nombre}</div>
          <div class="rutina-list-meta">
            <span>${r.foco}</span>
            <span>·</span>
            <span>${r.circuitos.length} circuitos</span>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.rutina-list-item').forEach(item => {
      item.addEventListener('click', () => {
        // Navigate to routine detail or start workout
        const id = item.dataset.id;
        router.navigate(`workout/${id}/${new Date().toISOString().slice(0, 10)}`);
      });
    });
  }
}
