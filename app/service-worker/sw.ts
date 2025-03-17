/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { CacheFirst, NetworkOnly } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

declare let self: ServiceWorkerGlobalScope

// Inject files into the cache
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

clientsClaim()
self.skipWaiting()

// API & Auth never cached
registerRoute(({ url }) => url.pathname.startsWith('/api') || url.pathname.startsWith('/auth'), new NetworkOnly())

// Nuxt generated assets
// registerRoute(
//   ({ url }) => url.pathname.startsWith('/_nuxt/'),
//   new CacheFirst({
//     cacheName: 'nuxt-assets',
//     plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 })],
//   })
// )

// Static assets
registerRoute(
  ({ request }) => ['style', 'script', 'image'].includes(request.destination),
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 })],
  })
)

// Navigations offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/'), { denylist: [/^\/api\//, /^\/auth\//, /^\/login/] })
)
