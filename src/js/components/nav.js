import { router } from '../../router.js';

const NAV_ITEMS = [
  { id: 'home',      label: 'Entreno',    icon: 'ph-house',        route: '' },
  { id: 'rutinas',   label: 'Rutinas',    icon: 'ph-list',         route: 'rutinas' },
  { id: 'ejercicios',label: 'Ejercicios', icon: 'ph-barbell',      route: 'ejercicios' },
  { id: 'historial', label: 'Historial',  icon: 'ph-clock',        route: 'historial' },
  { id: 'progreso',  label: 'Progreso',   icon: 'ph-trend-up',     route: 'progreso' },
];

export function renderNav(container) {
  const currentRoute = router.getCurrentRoute();

  container.innerHTML = NAV_ITEMS.map(item => `
    <button class="nav-item ${currentRoute === item.route ? 'active' : ''}"
            data-route="${item.route}" aria-label="${item.label}">
      <i class="${item.icon} nav-ph-icon"></i>
      <span>${item.label}</span>
    </button>
  `).join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-item');
    if (!btn) return;
    router.navigate(btn.dataset.route);
  });
}

export function updateNavActive(route) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.route === route);
  });
}
