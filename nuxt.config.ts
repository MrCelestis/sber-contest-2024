import Aura from '@primevue/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    port: 3001
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // prevents scss deprecation warnings
        }
      }
    }
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/primevue-overrides.css',
    'primeicons/primeicons.css'
  ],
  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/test-utils/module'
  ],
  primevue: {
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false
        }
      }
    }
  },
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    detectBrowserLanguage: false // auto-detect has major issues with cache
  },
  appConfig: {
    /**
     * Of there are more categories in view than this value, the remainder will be grouped together.
     * If you increase this value you must ensure that there are sufficient predefined colors
     * in CategoryChart.vue
     */
    maxCategoriesInFilter: 5,
    /** Capacity of transactions LRU cache. This number of last transaction responses will be cached. */
    transactionsCacheSize: 5
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000',
      /** App will show error if number of transactions in view is at least this value */
      maxTransactions: 10000
    }
  }
});
