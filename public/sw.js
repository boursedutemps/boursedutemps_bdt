// Service Worker — Bourse du Temps
// Gère : cache offline + push notifications

const CACHE_NAME = 'bdt-v1';
const OFFLINE_URL = '/';

// Pages et assets à mettre en cache au démarrage
const PRECACHE_URLS = [
  '/',
  '/services',
  '/members',
  '/forum',
  '/blog',
  '/about',
];

// ── Installation : pré-cache les pages principales ──────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ── Activation : supprime les anciens caches ─────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch : stratégie Network First avec fallback cache ──────────────
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non-GET et les API
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;
  if (event.request.url.includes('chrome-extension')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Mettre en cache les réponses réussies
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() =>
        // Offline : retourner depuis le cache
        caches.match(event.request).then(cached => cached || caches.match(OFFLINE_URL))
      )
  );
});

// ── Push notifications ────────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Bourse du Temps', {
      body:  data.body  || 'Vous avez une nouvelle notification',
      icon:  data.icon  || 'https://i.postimg.cc/5Y3Rg6zs/image-1.jpg',
      badge: data.badge || 'https://i.postimg.cc/5Y3Rg6zs/image-1.jpg',
      data:  { url: data.url || '/' },
      vibrate: [200, 100, 200],
    })
  );
});

// ── Clic sur notification → ouvrir la page ───────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      const url = event.notification.data?.url || '/';
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
