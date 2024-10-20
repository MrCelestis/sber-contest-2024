import { defineStore } from "pinia";

export const useCategoryFilterStore = defineStore("transactionFilter", {
  state: () => ({ selectedCategoryId: null as string | null }),
  getters: {
  },
  actions: {
    async select(categoryId: string | null) {
      this.selectedCategoryId = categoryId;
    },
  },
});

