// Enhanced service worker with advanced caching strategies
const CACHE_NAME = 'earlyshh-v2';
const STATIC_CACHE = 'static-v2';
const API_CACHE = 'api-v2';
const IMAGE_CACHE = 'images-v2';

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

// Cache strategies
const CACHE_STRATEGIES = {
  static: 'cache-first',
  api: 'network-first', 
  images: 'cache-first',
  dynamic: 'stale-while-revalidate'
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(urlsToCache)),
      caches.open(API_CACHE),
      caches.open(IMAGE_CACHE)
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![STATIC_CACHE, API_CACHE, IMAGE_CACHE].includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  }
  // Handle image requests
  else if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  }
  // Handle static assets
  else if (url.pathname.includes('.js') || url.pathname.includes('.css')) {
    event.respondWith(handleStaticRequest(request));
  }
  // Handle navigation requests
  else if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
  }
});

// API caching with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Image caching with cache-first strategy  
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Image unavailable', { status: 404 });
  }
}

// Static asset caching
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

// Navigation requests with offline fallback
async function handleNavigationRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(STATIC_CACHE);
    return await cache.match('/') || new Response('Offline', { status: 503 });
  }
}