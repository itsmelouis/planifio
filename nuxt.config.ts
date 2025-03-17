export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@vite-pwa/nuxt',
    'shadcn-nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-auth-utils',
  ],

  colorMode: {
    classSuffix: ''
  }, 
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    componentDir: './app/components/ui'
  },
  imports: {
    autoImport: true,
  },
  pwa: {
    strategies: 'injectManifest',
    srcDir: 'service-worker',
    filename: 'sw.ts',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Planifio PWA',
      short_name: 'Planifio',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-logo-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-logo-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}', '_nuxt/**', 'manifest.webmanifest'],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}', '_nuxt/**', 'manifest.webmanifest'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
})
