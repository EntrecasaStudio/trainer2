import { router } from './router.js';
import { renderNav, updateNavActive } from './js/components/nav.js';
import { mountHome } from './js/views/home.js';
import { mountRutinas } from './js/views/rutinas.js';
import { mountWorkout } from './js/views/workout.js';
import { mountEjercicios } from './js/views/ejercicios.js';
import { mountHistorial } from './js/views/historial.js';
import { mountProgreso } from './js/views/progreso.js';
import { seedV2 } from './seed.js';

async function init() {
  // Run seed
  await seedV2();

  // Register routes
  router.register('', mountHome);
  router.register('rutinas', mountRutinas);
  router.register('workout', mountWorkout);
  router.register('ejercicios', mountEjercicios);
  router.register('historial', mountHistorial);
  router.register('progreso', mountProgreso);

  // Init nav
  const navEl = document.getElementById('nav');
  renderNav(navEl);

  // Init router
  const viewContainer = document.getElementById('view-container');
  router.init(viewContainer, (route) => {
    updateNavActive(route);
    // Hide nav during workout
    navEl.classList.toggle('hidden', route === 'workout');
  });

  // Hide splash
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.remove();
        document.getElementById('app').classList.remove('hidden');
      }, 400);
    }
  }, 800);

  // Register service worker
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
      console.log('[SW] Registered');
    } catch (e) {
      console.warn('[SW] Registration failed', e);
    }
  }
}

init().catch(console.error);
