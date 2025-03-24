/// <reference lib="WebWorker" />
/// <reference types="vite/client" />

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { CacheFirst, NetworkOnly, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare let self: ServiceWorkerGlobalScope

// Inject files into the cache
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

clientsClaim()
self.skipWaiting()

// API & Auth are never cached
registerRoute(({ url }) => url.pathname.startsWith('/api') || url.pathname.startsWith('/auth'), new NetworkOnly())

// Cache Nuxt generated assets (_nuxt/)
registerRoute(
  ({ url }) => url.pathname.startsWith('/_nuxt/'),
  new CacheFirst({
    cacheName: 'nuxt-assets',
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 })],
  })
)

// Cache icons
registerRoute(
  ({ url }) => url.pathname.startsWith('/assets/images/icons'),
  new StaleWhileRevalidate({
    cacheName: 'icons-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }),
      new CacheableResponsePlugin({ statuses: [200] }),
    ],
  })
)

// Cache static assets (CSS, JS, Images)
registerRoute(
  ({ request }) => ['style', 'script', 'image'].includes(request.destination),
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 })],
  })
)

// Cache navigations for offline usage (except /api, /auth, /login)
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    denylist: [/^\/api\//, /^\/auth\//, /^\/login/],
  })
)


// Cache protected routes for offline access
const protectedRoutes = ['/payments', '/statistics', '/settings', '/account']
protectedRoutes.forEach(route => {
  registerRoute(
    ({ url }) => url.pathname.startsWith(route),
    new NetworkFirst({
      cacheName: 'protected-pages',
      plugins: [
        new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 }),
        new CacheableResponsePlugin({ statuses: [200] }),
      ],
    })
  )
})
