import { store } from '../../store.js';
import { formatDateLong, formatDuration, getLugarBadge } from '../../utils/format.js';

export function mountHistorial(container) {
  const activeUsuario = store.getActiveUser();
  let currentUser = activeUsuario;

  container.innerHTML = `
    <h1 style="font-size: var(--text-xl); font-weight: var(--fw-bold); margin-bottom: var(--space-md);">Historial</h1>
    <div class="user-toggle" style="margin-bottom: var(--space-lg);">
      <button class="user-toggle-btn ${currentUser === 'Lean' ? 'active' : ''}" data-usuario="Lean">Lean</button>
      <button class="user-toggle-btn ${currentUser === 'Nat' ? 'active' : ''}" data-usuario="Nat">Nat</button>
    </div>
    <div id="historial-list"></div>
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
    const listEl = document.getElementById('historial-list');
    const sesiones = store.getAll(store.KEYS.sesiones)
      .filter(s => s.usuario === currentUser)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (sesiones.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📊</div>
          <div class="empty-state-text">Sin sesiones registradas</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = sesiones.map(s => {
      const totalSeries = (s.circuitos || []).reduce((sum, c) =>
        sum + (c.ejercicios || []).reduce((s2, e) =>
          s2 + (e.seriesData || []).filter(sr => sr.done).length, 0), 0);

      return `
        <div class="historial-item">
          <div class="historial-date">${formatDateLong(new Date(s.fecha))}</div>
          <div class="historial-name">${s.rutinaNombre || 'Sesión'}</div>
          <div class="historial-stats">
            <span>⏱ ${formatDuration(s.duracion || 0)}</span>
            <span>💪 ${totalSeries} series</span>
          </div>
        </div>
      `;
    }).join('');
  }
}
