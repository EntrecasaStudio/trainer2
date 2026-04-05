import { router } from '../../router.js';

const NAV_ITEMS = [
  { id: 'rutinas',   label: 'Rutinas',    icon: 'ph-list',         route: 'rutinas' },
  { id: 'historial', label: 'Historial',  icon: 'ph-clock',        route: 'historial' },
  { id: 'home',      label: 'Entreno',    icon: 'ph-barbell',      route: '',          primary: true },
  { id: 'progreso',  label: 'Progreso',   icon: 'ph-trend-up',     route: 'progreso' },
  { id: 'usuario',   label: 'Usuario',    icon: 'ph-user-circle',  route: 'usuario' },
];

function iconClass(item, isActive) {
  return isActive ? `ph-fill ${item.icon}` : `ph-light ${item.icon}`;
}

export function renderNav(container) {
  const currentRoute = router.getCurrentRoute();

  container.innerHTML = NAV_ITEMS.map(item => {
    const isActive = currentRoute === item.route;
    const cls = ['nav-item', isActive ? 'active' : '', item.primary ? 'nav-primary' : ''].filter(Boolean).join(' ');
    return `
    <button class="${cls}" data-route="${item.route}" aria-label="${item.label}">
      <i class="${iconClass(item, isActive)} nav-ph-icon"></i>
      <span>${item.label}</span>
    </button>`;
  }).join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-item');
    if (!btn) return;
    router.navigate(btn.dataset.route);
  });
}

export function updateNavActive(route) {
  document.querySelectorAll('.nav-item').forEach(item => {
    const isActive = item.dataset.route === route;
    item.classList.toggle('active', isActive);
    const navItem = NAV_ITEMS.find(n => n.route === item.dataset.route);
    if (navItem) {
      item.classList.toggle('nav-primary', !!navItem.primary);
      const icon = item.querySelector('.nav-ph-icon');
      if (icon) {
        icon.className = `${iconClass(navItem, isActive)} nav-ph-icon`;
      }
    }
  });
}
