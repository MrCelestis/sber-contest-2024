import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { skipHydrate } from "pinia";

export const useTransactionsStore = defineStore("transactions", () => {

    console.log('INSTANCE')
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

  const { data, status, execute, error } = useFetch(`transactions`, {
    baseURL: runtimeConfig.public.apiBase,
    params: {
      timestamp_gte: startTimestamp,
      timestamp_lt: endTimestamp,
      _limit: String(runtimeConfig.public.maxTransactions),
      _sort: "-timestamp", // DESC sort so that most recent transactions come first
    },
    immediate: false,
    onRequest: r => console.log('onRequest', r)
  });
  console.log('> data',data.value)

  async function invalidateRelatedQueries(timestamp: number) {
    await queryClient.invalidateQueries({
      predicate: (query) => {
        const [key, start, end] = query.queryKey;
        if (key !== QUERY_KEY) return false;
        return timestamp >= (start as number) && timestamp <= (end as number);
      },
    });
  }

  const add = async (transaction: Transaction) => {
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
    //invalidate all matching intervals, this will re-run query is it's used ATM
    await invalidateRelatedQueries(transaction.timestamp);
  };

  const update = async (transaction: Transaction) => {
    const response = await fetch(
      `${runtimeConfig.public.apiBase}/transactions/${transaction.id}`,
      {
        method: "PUT",
        body: JSON.stringify(transaction),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    //invalidate all matching intervals, this will re-run query is it's used ATM
    await invalidateRelatedQueries(transaction.timestamp);
  };

  const remove = async (transaction: Transaction) => {
    const response = await fetch(
      `${runtimeConfig.public.apiBase}/transactions/${transaction.id}`,
      { method: "DELETE" }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    //invalidate all matching intervals, this will re-run query is it's used ATM
    await invalidateRelatedQueries(transaction.timestamp);
  };

  return {
    transactions: computed(() => data.value as Transaction[] ?? []),
    loading: computed(() => status.value === "pending"),
    isError: computed(() => !!error.value),
    add,
    remove,
    update,
    execute
  };
});

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  timestamp: number;
}
