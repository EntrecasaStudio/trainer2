import { store } from '../../store.js';

export function mountProgreso(container) {
  const activeUsuario = store.getActiveUser();
  let currentUser = activeUsuario;

  container.innerHTML = `
    <div class="rutinas-header">
      <h1 style="font-size:var(--text-xl);font-weight:var(--fw-bold);">Progreso</h1>
      <div class="user-toggle" style="margin:0;">
        <button class="user-toggle-btn ${currentUser === 'Lean' ? 'active' : ''}" data-usuario="Lean">Lean</button>
        <button class="user-toggle-btn ${currentUser === 'Nat' ? 'active' : ''}" data-usuario="Nat">Nat</button>
      </div>
    </div>
    <div id="progreso-list"></div>
  `;

  container.querySelectorAll('.user-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentUser = btn.dataset.usuario;
      store.setActiveUser(currentUser);
      container.querySelectorAll('.user-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderList();
    });
  });

  renderList();

  function renderList() {
    const listEl = document.getElementById('progreso-list');
    const progresion = store.getObj(store.KEYS.progresion);
    const entries = [];

    for (const [ejercicio, users] of Object.entries(progresion)) {
      const data = users[currentUser];
      if (data) {
        entries.push({ ejercicio, ...data });
      }
    }

    entries.sort((a, b) => (b.lastDate || '').localeCompare(a.lastDate || ''));

    if (entries.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="ph-light ph-trend-up" style="font-size:48px;"></i></div>
          <div class="empty-state-text">Sin datos de progresión aún.<br>Completá un entrenamiento para ver tus pesos.</div>
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
