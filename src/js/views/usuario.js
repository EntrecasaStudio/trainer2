import { getCurrentUser, loginWithGoogle, logout } from '../services/firebase.js';
import { getSyncStatus } from '../services/sync.js';

export function mountUsuario(container) {
  render(container);
}

function render(container) {
  const user = getCurrentUser();
  const status = getSyncStatus();

  const statusLabels = {
    synced: 'Sincronizado',
    syncing: 'Sincronizando...',
    pending: 'Cambios pendientes',
    offline: 'Sin conexión',
  };
  const statusColors = {
    synced: '#4ade80',
    syncing: 'var(--color-accent)',
    pending: 'var(--color-accent)',
    offline: 'var(--color-danger)',
  };

  if (user) {
    const photo = user.photoURL
      ? `<img src="${user.photoURL}" referrerpolicy="no-referrer" class="usuario-avatar">`
      : `<div class="usuario-avatar-placeholder"><i class="ph ph-user" style="font-size:32px;"></i></div>`;

    container.innerHTML = `
      <div class="rutinas-header" style="margin-bottom:var(--space-lg);">
        <h1 style="font-size:var(--text-xl);font-weight:var(--fw-bold);">Usuario</h1>
      </div>

      <div class="usuario-card">
        ${photo}
        <div class="usuario-info">
          <div class="usuario-name">${user.displayName || ''}</div>
          <div class="usuario-email">${user.email || ''}</div>
        </div>
      </div>

      <div class="usuario-status">
        <span class="usuario-status-dot" style="background:${statusColors[status] || statusColors.offline};"></span>
        <span>${statusLabels[status] || 'Sin conexión'}</span>
      </div>

      <button class="btn btn-secondary" id="btn-logout" style="width:100%;margin-top:var(--space-lg);">
        <i class="ph ph-sign-out" style="font-size:16px;margin-right:var(--space-xs);"></i> Cerrar sesión
      </button>
    `;

    container.querySelector('#btn-logout').addEventListener('click', async () => {
      await logout();
      render(container);
    });
  } else {
    container.innerHTML = `
      <div class="rutinas-header" style="margin-bottom:var(--space-lg);">
        <h1 style="font-size:var(--text-xl);font-weight:var(--fw-bold);">Usuario</h1>
      </div>

      <div class="usuario-card usuario-card-offline">
        <div class="usuario-avatar-placeholder"><i class="ph ph-user" style="font-size:32px;color:var(--color-text-muted);"></i></div>
        <div class="usuario-info">
          <div class="usuario-name">Sin conexión</div>
          <div class="usuario-email">Los datos se guardan solo en este dispositivo</div>
        </div>
      </div>

      <button class="btn btn-primary" id="btn-login" style="width:100%;margin-top:var(--space-lg);">
        <i class="ph ph-google-logo" style="font-size:16px;margin-right:var(--space-xs);"></i> Conectar con Google
      </button>
    `;

    container.querySelector('#btn-login').addEventListener('click', async () => {
      try {
        await loginWithGoogle();
        render(container);
      } catch (e) {
        console.error('Login failed', e);
      }
    });
  }
}
