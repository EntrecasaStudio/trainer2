import { store } from '../../store.js';

let _searchQuery = '';
let _searchVisible = false;

export function mountProgreso(container) {
  const activeUsuario = store.getActiveUser();
  let currentUser = activeUsuario;
  _searchQuery = '';
  _searchVisible = false;

  container.innerHTML = `
    <div class="rutinas-header">
      <h1 style="font-size:var(--text-xl);font-weight:var(--fw-bold);">Progreso</h1>
      <div class="rutinas-header-actions">
        <button class="btn-icon-header" data-action="toggle-search" title="Buscar">
          <i class="ph ph-magnifying-glass"></i>
        </button>
        <div class="user-toggle" style="margin:0;">
          <button class="user-toggle-btn ${currentUser === 'Lean' ? 'active' : ''}" data-usuario="Lean">Lean</button>
          <button class="user-toggle-btn ${currentUser === 'Nat' ? 'active' : ''}" data-usuario="Nat">Nat</button>
        </div>
      </div>
    </div>
    <div class="rutinas-search" id="progreso-search-wrap">
      <input type="text" class="rutinas-search-input" id="progreso-search" placeholder="Buscar ejercicio..." autocomplete="off">
    </div>
    <div id="progreso-list"></div>
  `;

  container.querySelectorAll('.user-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentUser = btn.dataset.usuario;
      store.setActiveUser(currentUser);
      document.body.setAttribute('data-usuario', currentUser);
      container.querySelectorAll('.user-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderList();
    });
  });

  container.querySelector('[data-action="toggle-search"]').addEventListener('click', () => {
    _searchVisible = !_searchVisible;
    const wrap = document.getElementById('progreso-search-wrap');
    wrap.classList.toggle('open', _searchVisible);
    if (_searchVisible) setTimeout(() => document.getElementById('progreso-search').focus(), 100);
    else { _searchQuery = ''; document.getElementById('progreso-search').value = ''; renderList(); }
  });

  document.getElementById('progreso-search').addEventListener('input', (e) => {
    _searchQuery = e.target.value.toLowerCase();
    renderList();
  });

  renderList();

  function renderList() {
    const listEl = document.getElementById('progreso-list');
    const progresion = store.getObj(store.KEYS.progresion);
    const q = _searchQuery;
    const entries = [];

    for (const [ejercicio, users] of Object.entries(progresion)) {
      const data = users[currentUser];
      if (data) {
        if (!q || ejercicio.toLowerCase().includes(q)) {
          entries.push({ ejercicio, ...data });
        }
      }
    }

    entries.sort((a, b) => (b.lastDate || '').localeCompare(a.lastDate || ''));

    if (entries.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="ph-light ph-trend-up" style="font-size:48px;"></i></div>
          <div class="empty-state-text">${q ? 'Sin resultados' : 'Sin datos de progresión aún.<br>Completá un entrenamiento para ver tus pesos.'}</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = entries.map(e => `
      <div class="progreso-exercise">
        <div class="progreso-exercise-name">${e.ejercicio}</div>
        <div>
          <span class="progreso-weight">${e.lastWeight}</span>
          <span class="progreso-weight-unit">kg</span>
        </div>
        ${e.completedAllReps ? `
          <div class="progreso-suggestion">↑ +2.5kg sugerido</div>
        ` : ''}
        <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: var(--space-xs);">
          Último: ${e.lastDate || '—'}
        </div>
      </div>
    `).join('');
  }
}
