import { router } from '../../router.js';

const NAV_ITEMS = [
  { id: 'home', label: 'Entreno', icon: 'home', route: '' },
  { id: 'rutinas', label: 'Rutinas', icon: 'list', route: 'rutinas' },
  { id: 'historial', label: 'Historial', icon: 'clock', route: 'historial' },
  { id: 'progreso', label: 'Progreso', icon: 'trending', route: 'progreso' },
];

const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  trending: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
};

export function renderNav(container) {
  const currentRoute = router.getCurrentRoute();

  container.innerHTML = NAV_ITEMS.map(item => `
    <button class="nav-item ${currentRoute === item.route ? 'active' : ''}"
            data-route="${item.route}" aria-label="${item.label}">
      <span class="nav-icon">${ICONS[item.icon]}</span>
      <span>${item.label}</span>
    </button>
  `).join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-item');
    if (!btn) return;
    const route = btn.dataset.route;
    router.navigate(route);
  });
}

export function updateNavActive(route) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.route === route);
  });
}
