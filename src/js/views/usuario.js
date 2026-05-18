import { getCurrentUser, loginWithGoogle, logout } from '../services/firebase.js';
import { getSyncStatus, downloadAllData, uploadAllData } from '../services/sync.js';
import { store } from '../../store.js';

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

  const sesiones = store.getAll(store.KEYS.sesiones);
  const sesionesCount = Array.isArray(sesiones) ? sesiones.length : 0;
  const leanCount = sesiones.filter(s => s.usuario === 'Lean').length;
  const natCount = sesiones.filter(s => s.usuario === 'Nat').length;

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

      <div style="margin-top:var(--space-md);padding:var(--space-md);background:var(--color-surface-alt);border-radius:var(--radius-md);font-size:var(--text-sm);color:var(--color-text-muted);">
        Sesiones locales: <strong style="color:var(--color-text);">${sesionesCount}</strong>
        <span style="opacity:0.7;"> · Lean ${leanCount} · Nat ${natCount}</span>
      </div>

      <button class="btn btn-secondary" id="btn-force-sync" style="width:100%;margin-top:var(--space-md);">
        <i class="ph ph-arrows-clockwise" style="font-size:16px;margin-right:var(--space-xs);"></i> Forzar sincronización
      </button>

      <button class="btn btn-secondary" id="btn-reset-app" style="width:100%;margin-top:var(--space-sm);color:var(--color-danger);">
        <i class="ph ph-trash" style="font-size:16px;margin-right:var(--space-xs);"></i> Resetear app
      </button>

      <button class="btn btn-secondary" id="btn-logout" style="width:100%;margin-top:var(--space-sm);">
        <i class="ph ph-sign-out" style="font-size:16px;margin-right:var(--space-xs);"></i> Cerrar sesión
      </button>
    `;

    container.querySelector('#btn-reset-app').addEventListener('click', () => resetApp());

    container.querySelector('#btn-logout').addEventListener('click', async () => {
      await logout();
      render(container);
    });

    container.querySelector('#btn-force-sync').addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      btn.innerHTML = '<i class="ph ph-arrows-clockwise ph-spin" style="font-size:16px;margin-right:var(--space-xs);"></i> Sincronizando...';
      try {
        const ok = await downloadAllData();
        if (ok) await uploadAllData();
        btn.innerHTML = `<i class="ph ph-check" style="font-size:16px;margin-right:var(--space-xs);"></i> ${ok ? 'Listo' : 'Sin datos remotos'}`;
        setTimeout(() => render(container), 800);
      } catch (err) {
        console.warn('[Usuario] sync failed:', err);
        btn.innerHTML = '<i class="ph ph-warning" style="font-size:16px;margin-right:var(--space-xs);"></i> Error';
        setTimeout(() => render(container), 1500);
      }
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

      <button class="btn btn-secondary" id="btn-reset-app" style="width:100%;margin-top:var(--space-sm);color:var(--color-danger);">
        <i class="ph ph-trash" style="font-size:16px;margin-right:var(--space-xs);"></i> Resetear app
      </button>
    `;

    container.querySelector('#btn-reset-app').addEventListener('click', () => resetApp());

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

async function resetApp() {
  if (!confirm('Esto borra todos los datos locales y recarga la app desde cero. Los datos se recuperan de Google al volver a entrar. ¿Continuar?')) return;
  try {
    const regs = await navigator.serviceWorker?.getRegistrations() || [];
    await Promise.all(regs.map(r => r.unregister()));
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
  } catch {}
  localStorage.clear();
  window.location.replace(window.location.pathname);
}
