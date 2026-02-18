const CACHE_NAME = 'library-v1'

// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app shell')
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
      ]).catch(err => {
        console.warn('App shell caching failed:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch: Network-first for APIs, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // API calls: Network-first, fallback to cache
  if (url.origin.includes('supabase')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME)
            cache.then((c) => c.put(request, response.clone()))
          }
          return response
        })
        .catch(() => {
          return caches.match(request) ||
            new Response(JSON.stringify({ error: 'Offline' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            })
        })
    )
    return
  }

  // Assets: Cache-first
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((res) => {
        if (res.ok && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg'))) {
          const cache = caches.open(CACHE_NAME)
          cache.then((c) => c.put(request, res.clone()))
        }
        return res
      })
    }).catch(() => {
      return new Response('Offline', { status: 503 })
    })
  )
})
