import Aura from "@primevue/themes/aura";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  devServer: {
    port: 3001,
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  css: [
    "~/assets/css/main.css",
    "~/assets/css/primevue-overrides.css",
    "primeicons/primeicons.css",
  ],
  modules: ["@pinia/nuxt", "@primevue/nuxt-module"],
  primevue: {
    options: {
      ripple: true,
      inputVariant: "filled",
      theme: {
        preset: Aura,
        options: {
          prefix: "p",
          darkModeSelector: "system",
          cssLayer: false,
        },
      },
    },
  },
  appConfig: {
    maxCategoriesInFilter: 5,
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3000",
      maxTransactions: 1000,
    },
  },
});
