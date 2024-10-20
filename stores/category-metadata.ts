import { defineStore } from "pinia";

export const useCategoryMetadataStore = defineStore("categoryMetadata", {
  state: () => ({ categories: [] as CategoryMetadata[] }),
  getters: {
    categoryById: (state) => {
      const result = new Map<string, CategoryMetadata>();
      for (const category of state.categories) {
        result.set(category.id, category);
      }
      console.log('catbyid', result)
      return result;
    },
  },
  actions: {
    async fetch() {
      const runtimeConfig = useRuntimeConfig();
      const { data } = await useFetch('/category-metadata', {
        method: 'GET',
        baseURL: runtimeConfig.public.apiBase,
        timeout: 30_000
      });
      this.categories = data.value as CategoryMetadata[];
    },
  },
});

export interface CategoryMetadata {
  id: string;
  text: string;
  iconUrl: string;
}
