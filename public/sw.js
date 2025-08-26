// Service Worker for RUDYBTZ Portfolio
// Provides offline functionality and caching strategies

const CACHE_NAME = 'rudybtz-portfolio-v1';
const OFFLINE_URL = '/offline';

// Assets to cache on install
const CRITICAL_ASSETS = [
  '/',
  '/admin/login',
  '/offline',
  '/favicon.ico',
  // Add critical CSS and JS files
];

// Assets to cache dynamically
const CACHE_STRATEGIES = {
  // Images - Cache with fallback
  images: /\.(jpg|jpeg|png|gif|webp|svg)$/,
  // Audio files - Cache important ones
  audio: /\.(mp3|wav|ogg|m4a)$/,
  // API responses - Network first with cache fallback
  api: /^\/api\//,
  // Static assets - Cache first
  static: /\.(css|js|woff|woff2)$/,
};

self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker installed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker install failed:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!url.pathname.startsWith('/') && url.origin !== self.location.origin) {
    return;
  }

  // Choose caching strategy based on request type
  if (CACHE_STRATEGIES.static.test(url.pathname)) {
    // Static assets: Cache first
    event.respondWith(cacheFirst(request));
  } else if (CACHE_STRATEGIES.images.test(url.pathname)) {
    // Images: Cache first with fallback
    event.respondWith(cacheFirstWithFallback(request));
  } else if (CACHE_STRATEGIES.audio.test(url.pathname)) {
    // Audio: Cache first (important for offline playback)
    event.respondWith(cacheFirst(request));
  } else if (CACHE_STRATEGIES.api.test(url.pathname)) {
    // API: Network first with cache fallback
    event.respondWith(networkFirstWithCache(request));
  } else if (request.mode === 'navigate') {
    // Navigation: Network first with offline fallback
    event.respondWith(navigateWithOffline(request));
  } else {
    // Default: Network first
    event.respondWith(networkFirst(request));
  }
});

// Caching strategies
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error('❌ Cache first failed:', error);
    throw error;
  }
}

async function cacheFirstWithFallback(request) {
  try {
    return await cacheFirst(request);
  } catch (error) {
    // Return a fallback image for failed image requests
    if (request.destination === 'image') {
      const cache = await caches.open(CACHE_NAME);
      return cache.match('/fallback-image.png') || new Response('', { status: 404 });
    }
    throw error;
  }
}

async function networkFirstWithCache(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('🌐 Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function networkFirst(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function navigateWithOffline(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('🌐 Navigation failed, serving offline page');
    const cache = await caches.open(CACHE_NAME);
    const offlineResponse = await cache.match(OFFLINE_URL);
    return offlineResponse || new Response('Offline', { 
      status: 200, 
      headers: { 'Content-Type': 'text/html' } 
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions when back online
  try {
    const offlineActions = await getOfflineActions();
    for (const action of offlineActions) {
      await processOfflineAction(action);
    }
    await clearOfflineActions();
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

async function getOfflineActions() {
  // Get offline actions from IndexedDB or localStorage
  return [];
}

async function processOfflineAction(action) {
  // Process offline action (e.g., sync data to Firebase)
  console.log('📤 Processing offline action:', action);
}

async function clearOfflineActions() {
  // Clear processed offline actions
  console.log('🧹 Clearing offline actions');
}

// Push notifications (for future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      tag: data.tag || 'default',
      data: data.data || {},
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

console.log('🎵 RUDYBTZ Portfolio Service Worker loaded');