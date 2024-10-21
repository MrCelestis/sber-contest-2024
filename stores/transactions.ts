import { defineStore } from "pinia";

export const useTransactionsStore = defineStore("transactions", {
  state: () => ({ transactions: [] as Transaction[] }),
  getters: {},
  actions: {
    async fetch(startTimestamp: number, endTimestamp: number) {
      this.transactions = []; //TODO: cache, debounce?
      const runtimeConfig = useRuntimeConfig();
      const data = await $fetch("/transactions", {
        method: "GET",
        baseURL: runtimeConfig.public.apiBase,
        query: {
          timestamp_gte: startTimestamp,
          timestamp_lt: endTimestamp,
          _limit: runtimeConfig.public.maxTransactions,
          _sort: "-timestamp", // DESC sort so that most recent transactions come first
        },
        timeout: 30_000,
      });
      const result = data as Transaction[];
      if (result.length === runtimeConfig.public.maxTransactions) {
        throw new Error("TODO: limit exceeded");
      }
      this.transactions = result;
    },
  },
});

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  timestamp: number;
}
