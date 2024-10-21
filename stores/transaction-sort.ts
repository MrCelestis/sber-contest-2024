import { defineStore } from "pinia";

export const useTransactionSortStore = defineStore("transactionSortStore", {
  state: () => ({ sort: "date" as TransactionSortOption }),
  actions: {
    select(option: TransactionSortOption) {
      this.sort = option;
    },
  },
});

const transactionSortOptions = ["date", "amount"] as const;
export type TransactionSortOption = (typeof transactionSortOptions)[number];
