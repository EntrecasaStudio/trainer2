import { router } from './router.js';
import { renderNav, updateNavActive } from './js/components/nav.js';
import { mountHome } from './js/views/home.js';
import { mountRutinas } from './js/views/rutinas.js';
import { mountWorkout } from './js/views/workout.js';
import { mountEjercicios } from './js/views/ejercicios.js';
import { mountHistorial } from './js/views/historial.js';
import { mountProgreso } from './js/views/progreso.js';
import { mountRutinaEdit } from './js/views/rutina-edit.js';
import { mountUsuario } from './js/views/usuario.js';
import { seedV2 } from './seed.js';
import { initFirebase, loginWithGoogle, logout, onAuth, getCurrentUser } from './js/services/firebase.js';
import { uploadAllData, downloadAllData, startRealtimeSync, stopRealtimeSync, clearSyncState, getSyncStatus, onSyncStatusChange, setOnResumeCallback } from './js/services/sync.js';

let _appBooted = false;

async function bootApp() {
  const { store } = await import('./store.js');
  document.body.setAttribute('data-usuario', store.getActiveUser());

  router.register('', mountHome);
  router.register('rutinas', mountRutinas);
  router.register('workout', mountWorkout);
  router.register('rutina-edit', mountRutinaEdit);
  router.register('ejercicios', mountEjercicios);
  router.register('historial', mountHistorial);
  router.register('progreso', mountProgreso);
  router.register('usuario', mountUsuario);

  const navEl = document.getElementById('nav');
  renderNav(navEl);

  const viewContainer = document.getElementById('view-container');
  const avatarMenuEl = document.getElementById('avatar-menu');
  router.init(viewContainer, (route) => {
    updateNavActive(route);
    const hideChrome = route === 'workout' || route === 'rutina-edit';
    navEl.classList.toggle('hidden', hideChrome);
    // Avatar menu hidden — login moved to Usuario tab
    if (avatarMenuEl) avatarMenuEl.classList.add('hidden');
  });

  // Mount avatar menu
  mountAvatarMenu();

  // iOS PWA: force repaint + SW update check when returning from background
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      requestAnimationFrame(() => {
        document.body.style.opacity = '0.99';
        requestAnimationFrame(() => { document.body.style.opacity = ''; });
      });
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(reg => {
          if (reg) reg.update().catch(() => {});
        });
      }
    }
  });

  if ('serviceWorker' in navigator) {
    let refreshing = false;
    // Reload page when new SW takes control (deploy detected)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
      .then(reg => {
        // Force update check on every page load
        reg.update().catch(() => {});
        // If a waiting SW exists, activate it immediately
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          if (newSW) {
            newSW.addEventListener('statechange', () => {
              if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                newSW.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });
        // Also check periodically (every 60s)
        setInterval(() => reg.update().catch(() => {}), 60000);
      })
      .catch(e => console.warn('[SW] Registration failed', e));
  }
}

function dismissSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  const progressBar = document.getElementById('splash-progress-bar');
  if (progressBar) progressBar.style.width = '100%';
  setTimeout(() => {
    splash.style.opacity = '0';
    splash.style.transform = 'scale(1.05)';
    splash.style.filter = 'blur(8px)';
    setTimeout(() => splash.remove(), 400);
  }, 300);
}

// ── Avatar menu ─────────────────────────────────

function mountAvatarMenu() {
  const container = document.getElementById('avatar-menu');
  if (!container) return;

  updateAvatarButton();

  container.addEventListener('click', (e) => {
    if (e.target.closest('#avatar-btn')) {
      toggleAvatarDropdown();
    }
  });

  // Update sync dot
  onSyncStatusChange(() => updateAvatarButton());
}

function updateAvatarButton() {
  const container = document.getElementById('avatar-menu');
  if (!container) return;

  const user = getCurrentUser();
  const status = getSyncStatus();

  const dotColor = {
    synced: '#22c55e',
    syncing: 'var(--color-warning)',
    pending: 'var(--color-warning)',
    offline: 'var(--color-danger)',
    error: '#f43f5e',
  }[status] || 'var(--color-danger)';

  if (user) {
    const photo = user.photoURL
      ? `<img src="${user.photoURL}" referrerpolicy="no-referrer" class="avatar-btn-photo">`
      : `<span class="avatar-btn-initial">${(user.displayName || user.email || '?')[0].toUpperCase()}</span>`;
    container.innerHTML = `
      <button class="avatar-btn" id="avatar-btn" title="${user.displayName || user.email}">
        ${photo}
        <span class="avatar-sync-dot" style="background:${dotColor};"></span>
      </button>
    `;
  } else {
    container.innerHTML = `
      <button class="avatar-btn" id="avatar-btn" title="Sin conexión">
        <i class="ph-light ph-user" style="font-size:20px;color:var(--color-text-muted);"></i>
        <span class="avatar-sync-dot" style="background:var(--color-text-muted);"></span>
      </button>
    `;
  }
}

function toggleAvatarDropdown() {
  const existing = document.getElementById('avatar-dropdown-wrap');
  if (existing) { existing.remove(); return; }

  const user = getCurrentUser();
  const status = getSyncStatus();
  const dotColor = { synced: '#22c55e', syncing: 'var(--color-warning)', pending: 'var(--color-warning)', offline: 'var(--color-danger)', error: '#f43f5e' }[status] || 'var(--color-danger)';

  let content;
  if (user) {
    const syncLabel = { synced: 'Sincronizado', syncing: 'Sincronizando…', pending: 'Pendiente', offline: 'Sin conexión', error: 'Error de sync' }[status] || '';
    content = `
      <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-md);">
        ${user.photoURL ? `<img src="${user.photoURL}" referrerpolicy="no-referrer" style="width:36px;height:36px;border-radius:50%;">` : ''}
        <div>
          <div style="font-size:var(--text-sm);font-weight:var(--fw-medium);">${user.displayName || ''}</div>
          <div style="font-size:var(--text-xs);color:var(--color-text-muted);">${user.email || ''}</div>
        </div>
      </div>
      <div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:var(--space-sm);display:flex;align-items:center;gap:6px;">
        <span style="width:6px;height:6px;border-radius:50%;background:${dotColor};display:inline-block;"></span> ${syncLabel}
      </div>
      <div style="display:flex;gap:var(--space-xs);margin-bottom:var(--space-sm);">
        <button class="btn btn-secondary" data-action="force-upload" style="flex:1;font-size:var(--text-xs);">
          <i class="ph ph-cloud-arrow-up" style="font-size:14px;"></i> Subir
        </button>
        <button class="btn btn-secondary" data-action="force-download" style="flex:1;font-size:var(--text-xs);">
          <i class="ph ph-cloud-arrow-down" style="font-size:14px;"></i> Bajar
        </button>
      </div>
      <button class="btn btn-secondary" data-action="logout" style="width:100%;font-size:var(--text-sm);">
        <i class="ph ph-sign-out" style="font-size:16px;"></i> Cerrar sesión
      </button>
    `;
  } else {
    content = `
      <div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:var(--space-sm);">Sin conexión — los datos se guardan solo en este dispositivo</div>
      <button class="btn btn-primary" data-action="login" style="width:100%;font-size:var(--text-sm);">
        <i class="ph ph-google-logo" style="font-size:16px;"></i> Conectar con Google
      </button>
    `;
  }

  const wrap = document.createElement('div');
  wrap.id = 'avatar-dropdown-wrap';
  wrap.innerHTML = `
    <div class="avatar-backdrop" id="avatar-backdrop"></div>
    <div class="avatar-dropdown">
      ${content}
    </div>
  `;
  document.body.appendChild(wrap);

  // Animate in
  requestAnimationFrame(() => {
    wrap.querySelector('.avatar-dropdown')?.classList.add('open');
  });

  // Backdrop close
  wrap.querySelector('#avatar-backdrop').addEventListener('click', () => wrap.remove());

  // Actions
  wrap.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    if (action === 'logout') {
      wrap.remove();
      await logout();
    } else if (action === 'login') {
      wrap.remove();
      try {
        await loginWithGoogle();
      } catch (e) {
        console.warn('[Auth] Login failed:', e.message);
      }
    } else if (action === 'force-upload') {
      btn.disabled = true;
      btn.textContent = 'Subiendo…';
      await uploadAllData();
      wrap.remove();
      updateAvatarButton();
      const { showToast } = await import('./js/components/toast.js');
      showToast('Datos subidos ✓');
    } else if (action === 'force-download') {
      btn.disabled = true;
      btn.textContent = 'Bajando…';
      const ok = await downloadAllData();
      if (ok) await seedV2();
      wrap.remove();
      updateAvatarButton();
      router._handleRoute();
      const { showToast } = await import('./js/components/toast.js');
      showToast(ok ? 'Datos descargados ✓' : 'No se pudo descargar');
    }
  });
}

// ── Start ─────────────────────────────────────

async function start() {
  const progressBar = document.getElementById('splash-progress-bar');
  if (progressBar) progressBar.style.width = '40%';

  // Firebase init with 5s timeout — never block the boot
  let firebaseOk = false;
  try {
    firebaseOk = await Promise.race([
      initFirebase(),
      new Promise(resolve => setTimeout(() => resolve(false), 5000)),
    ]);
  } catch (e) {
    console.warn('[Boot] Firebase init error:', e.message);
  }
  if (progressBar) progressBar.style.width = '70%';

  // Always boot the app (offline-first)
  await seedV2();

  // Store ref for avatar menu
  const { store } = await import('./store.js');
  window._storeRef = { store };

  document.getElementById('app')?.classList.remove('hidden');

  await bootApp();
  _appBooted = true;
  dismissSplash();

  if (!firebaseOk) return;

  // Auth listener — sync when logged in
  onAuth(async (user) => {
    if (user) {
      try {
        await downloadAllData();
        await seedV2();
        await uploadAllData();
        startRealtimeSync(() => {
          seedV2();
          router._handleRoute();
        });
        setOnResumeCallback(() => {
          seedV2();
          router._handleRoute();
        });
      } catch (e) {
        console.warn('[Sync] Error:', e.message);
      }
      // Re-render to reflect synced data
      router._handleRoute();
    } else {
      stopRealtimeSync();
      clearSyncState();
    }
    updateAvatarButton();
  });
}

start().catch(e => {
  console.error('[Boot] Fatal:', e);
  // Force dismiss splash on error so app isn't stuck
  dismissSplash();
  document.getElementById('app')?.classList.remove('hidden');
});

// Safety net: force dismiss splash after 8s no matter what
setTimeout(() => {
  const splash = document.getElementById('splash');
  if (splash) {
    console.warn('[Boot] Splash timeout — forcing dismiss');
    splash.remove();
    document.getElementById('app')?.classList.remove('hidden');
  }
}, 8000);
