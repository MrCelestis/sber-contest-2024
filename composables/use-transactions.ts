import { useQuery, useQueryClient } from "@tanstack/vue-query";

export const useTransactions = () => {
  const queryClient = useQueryClient();
  const transactionDateFilterStore = useTransactionDateFilterStore();

  const runtimeConfig = useRuntimeConfig();
  // need computed to refresh query params and re-fetch
  const interval = computed(
    () => transactionDateFilterStore.effectiveUtcInterval
  );
  const startTimestamp = computed(() => interval.value?.[0].getTime() ?? 0);
  const endTimestamp = computed(() => interval.value?.[1].getTime() ?? 0);
  const QUERY_KEY = "transactions";

  const { data, status, suspense } = useQuery({
    queryKey: [QUERY_KEY, startTimestamp, endTimestamp],
    queryFn: async () => {
      const url =
        `${runtimeConfig.public.apiBase}/transactions?` +
        new URLSearchParams({
          timestamp_gte: String(startTimestamp.value),
          timestamp_lt: String(endTimestamp.value),
          _limit: String(runtimeConfig.public.maxTransactions),
          _sort: "-timestamp", // DESC sort so that most recent transactions come first
        }).toString();
      console.log("> fetch=", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = (await response.json()) as Transaction[];
      console.log("> result=", res);
      return res;
    },
  });
  onServerPrefetch(suspense);
  return {
    transactions: computed(() => data.value ?? []),
    loading: computed(() => {
      console.log("> status=", status.value);
      return status.value === "pending";
    }),
    add: async (transaction: Transaction) => {
      const runtimeConfig = useRuntimeConfig();
      const response = await fetch(
        `${runtimeConfig.public.apiBase}/transactions`,
        {
          method: "POST",
          body: JSON.stringify(transaction),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }); //invalidate all intervals
      //   this.transactions = [...this.transactions, transaction];
      //   this.transactions.sort((a, b) => b.timestamp - a.timestamp);
    },
  };
};

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  timestamp: number;
}
