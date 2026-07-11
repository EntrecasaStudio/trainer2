import { getCurrentUser, loginWithGoogle, logout } from '../services/firebase.js';
import { getSyncStatus, downloadAllData, uploadAllData } from '../services/sync.js';
import { store } from '../../store.js';
import { EJERCICIOS_CATALOGO, GRUPOS_MUSCULARES } from '../../ejercicios-catalogo.js';

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

      <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-md);">
        <div style="flex:1;display:flex;gap:4px;">
          <button class="btn btn-secondary" id="btn-copy-rutinas" style="flex:1;border-top-right-radius:0;border-bottom-right-radius:0;">
            <i class="ph ph-copy" style="font-size:16px;margin-right:var(--space-xs);"></i> Copiar rutinas
          </button>
          <select id="sel-lugar-rutinas" class="btn btn-secondary" style="width:auto;padding:0 var(--space-xs);border-top-left-radius:0;border-bottom-left-radius:0;appearance:auto;">
            <option value="">Todas</option>
            <option value="CASA" selected>Casa</option>
            <option value="SPORT_FITNESS">Gym</option>
            <option value="URUGUAY">UY</option>
            <option value="RECOVERY">Recovery</option>
          </select>
        </div>
        <button class="btn btn-secondary" id="btn-copy-sesiones" style="flex:1;">
          <i class="ph ph-clipboard-text" style="font-size:16px;margin-right:var(--space-xs);"></i> Copiar sesiones
        </button>
      </div>

      <button class="btn btn-secondary" id="btn-catalogo" style="width:100%;margin-top:var(--space-sm);">
        <i class="ph ph-barbell" style="font-size:16px;margin-right:var(--space-xs);"></i> Ver catálogo de ejercicios
      </button>

      <button class="btn btn-secondary" id="btn-force-sync" style="width:100%;margin-top:var(--space-sm);">
        <i class="ph ph-arrows-clockwise" style="font-size:16px;margin-right:var(--space-xs);"></i> Forzar sincronización
      </button>

      <button class="btn btn-secondary" id="btn-reset-app" style="width:100%;margin-top:var(--space-sm);color:var(--color-danger);">
        <i class="ph ph-trash" style="font-size:16px;margin-right:var(--space-xs);"></i> Resetear app
      </button>

      <button class="btn btn-secondary" id="btn-logout" style="width:100%;margin-top:var(--space-sm);">
        <i class="ph ph-sign-out" style="font-size:16px;margin-right:var(--space-xs);"></i> Cerrar sesión
      </button>
    `;

    container.querySelector('#btn-copy-rutinas')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const lugar = container.querySelector('#sel-lugar-rutinas')?.value || null;
      const text = window.exportRutinas ? window.exportRutinas(null, lugar || undefined) : 'exportRutinas no disponible';
      btn.innerHTML = '<i class="ph ph-check" style="font-size:16px;margin-right:var(--space-xs);"></i> Copiado';
      setTimeout(() => { btn.innerHTML = '<i class="ph ph-copy" style="font-size:16px;margin-right:var(--space-xs);"></i> Copiar rutinas'; }, 1500);
    });

    container.querySelector('#btn-copy-sesiones')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const text = window.exportSesiones ? window.exportSesiones(12) : 'exportSesiones no disponible';
      btn.innerHTML = '<i class="ph ph-check" style="font-size:16px;margin-right:var(--space-xs);"></i> Copiado';
      setTimeout(() => { btn.innerHTML = '<i class="ph ph-clipboard-text" style="font-size:16px;margin-right:var(--space-xs);"></i> Copiar sesiones'; }, 1500);
    });

    container.querySelector('#btn-catalogo')?.addEventListener('click', () => openCatalogo());

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

      <button class="btn btn-secondary" id="btn-catalogo" style="width:100%;margin-top:var(--space-sm);">
        <i class="ph ph-barbell" style="font-size:16px;margin-right:var(--space-xs);"></i> Ver catálogo de ejercicios
      </button>

      <button class="btn btn-secondary" id="btn-reset-app" style="width:100%;margin-top:var(--space-sm);color:var(--color-danger);">
        <i class="ph ph-trash" style="font-size:16px;margin-right:var(--space-xs);"></i> Resetear app
      </button>
    `;

    container.querySelector('#btn-catalogo')?.addEventListener('click', () => openCatalogo());
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

function openCatalogo() {
  const grouped = {};
  for (const g of GRUPOS_MUSCULARES) grouped[g] = [];
  for (const e of EJERCICIOS_CATALOGO) {
    const g = grouped[e.grupo] ? e.grupo : 'Otros';
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(e);
  }

  let sections = '';
  for (const [grupo, ejercicios] of Object.entries(grouped)) {
    if (!ejercicios.length) continue;
    const rows = ejercicios.map(e => `
      <div style="padding:12px 0;border-bottom:1px solid #333;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <strong style="font-size:15px;">${e.nombre}</strong>
          <span style="font-size:11px;color:#999;white-space:nowrap;margin-left:8px;">${e.tipo === 'funcional' ? 'Funcional' : 'Máquina'}${e.usaPeso ? ' · Peso' : ''}</span>
        </div>
        <div style="font-size:12px;color:#FFCD00;margin-top:2px;">${e.musculos || ''}</div>
        <div style="font-size:13px;color:#ccc;margin-top:4px;line-height:1.4;">${e.descripcion || ''}</div>
      </div>`).join('');
    sections += `
      <div style="margin-bottom:24px;">
        <h2 style="font-size:18px;color:#FFCD00;border-bottom:2px solid #FFCD00;padding-bottom:6px;margin-bottom:8px;">${grupo} (${ejercicios.length})</h2>
        ${rows}
      </div>`;
  }

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Catálogo de Ejercicios</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#1A1A1A;color:#F5F5F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:16px;max-width:600px;margin:0 auto}
h1{font-size:22px;margin-bottom:4px}
.count{font-size:13px;color:#999;margin-bottom:20px}</style></head>
<body>
<h1>Catálogo de Ejercicios</h1>
<div class="count">${EJERCICIOS_CATALOGO.length} ejercicios</div>
${sections}
</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
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
