// MetBrasil Service Worker v5.0 (Security Enhanced + Push Notifications)
const CACHE_NAME = 'metbrasil-v5';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&family=Orbitron:wght@400;700&display=swap'
];

// Whitelist of cacheable resource patterns (security improvement)
const CACHEABLE_PATTERNS = [
  /\.(html|css|js|json|svg|png|ico|woff|woff2)$/i,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /cdnjs\.cloudflare\.com/
];

function isCacheable(url) {
  return CACHEABLE_PATTERNS.some(pattern => pattern.test(url));
}

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API requests - network only (weather data should be fresh)
  if (url.hostname.includes('api.open-meteo.com') ||
      url.hostname.includes('marine-api.open-meteo.com') ||
      url.hostname.includes('air-quality-api.open-meteo.com') ||
      url.hostname.includes('ipapi.co') ||
      url.hostname.includes('corsproxy.io') ||
      url.hostname.includes('apiprevmet3.inmet.gov.br')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'offline' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Map tiles - cache with network fallback
  if (url.hostname.includes('basemaps.cartocdn.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cached) => {
          const fetched = fetch(event.request).then((response) => {
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
          return cached || fetched;
        });
      })
    );
    return;
  }

  // Static assets - cache first, network fallback (with whitelist validation)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        // Only cache whitelisted resources with successful responses
        if (response.status === 200 && isCacheable(event.request.url)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

// ============ PUSH NOTIFICATIONS ============

// Receive push notification from server (for future backend integration)
self.addEventListener('push', (event) => {
  let data = { title: 'MetBrasil Alerta', body: 'Alerta meteorológico' };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: data.severity === 'extreme' ? [500, 200, 500, 200, 500] : [200, 100, 200],
    tag: data.tag || 'weather-alert',
    renotify: true,
    requireInteraction: data.severity === 'extreme',
    actions: [
      { action: 'view', title: 'Ver Detalhes' },
      { action: 'dismiss', title: 'Dispensar' }
    ],
    data: {
      url: data.url || '/',
      alertId: data.alertId,
      severity: data.severity
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Open app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if app is already open
      for (const client of windowClients) {
        if (client.url.includes('agente-do-tempo') && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  // Analytics could be added here
  console.log('Notification closed:', event.notification.tag);
});
