export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4
  },

  modules: ['@vite-pwa/nuxt', 'shadcn-nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],

  colorMode: {
    classSuffix: ''
  }, 
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  }
})
