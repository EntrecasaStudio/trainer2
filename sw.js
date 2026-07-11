const CACHE = 'trainer2-v2-341';
const PRECACHE = [
  './',
  './index.html',
  './src/main.js',
  './src/store.js',
  './src/seed.js',
  './src/router.js',
  './src/ejercicios-catalogo.js',
  './src/utils/inferUsaPeso.js',
  './src/utils/calendar.js',
  './src/utils/format.js',
  './src/utils/muscle-illustrations.js',
  './images/kettlebell-3d.png',
  './src/js/views/home.js',
  './src/js/views/rutinas.js',
  './src/js/views/workout.js',
  './src/js/views/ejercicios.js',
  './src/js/views/rutina-edit.js',
  './src/js/views/historial.js',
  './src/js/views/progreso.js',
  './src/js/components/toast.js',
  './src/js/components/modal.js',
  './src/js/services/firebase.js',
  './src/js/services/sync.js',
  './src/js/components/nav.js',
  './src/styles/tokens.css',
  './src/styles/components.css',
  './src/styles/views.css',
  './src/styles/workout.css',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Network-first for own JS/CSS/HTML — always get latest, fallback to cache offline
  if (url.origin === self.location.origin && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/'))) {
    e.respondWith(
      fetch(e.request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return resp;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for images, fonts, external CDN
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

self.addEventListener('message', (e) => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});
