// Hash router — each route mounts ONE view

const routes = {};
let currentRoute = '';
let viewContainer = null;
let onRouteChange = null;

export const router = {
  register(path, mountFn) {
    routes[path] = mountFn;
  },

  init(container, onChange) {
    viewContainer = container;
    onRouteChange = onChange || null;
    window.addEventListener('hashchange', () => this._handleRoute());
    this._handleRoute();
  },

  navigate(path) {
    window.location.hash = path ? `#${path}` : '';
  },

  getCurrentRoute() {
    return currentRoute;
  },

  _handleRoute() {
    const hash = window.location.hash.slice(1) || '';
    const [path, ...params] = hash.split('/');
    currentRoute = path;

    const mountFn = routes[path];
    if (mountFn && viewContainer) {
      viewContainer.innerHTML = '';
      mountFn(viewContainer, params);
    }

    if (onRouteChange) onRouteChange(path);
  },
};
