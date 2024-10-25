export const useTransactionsStore = defineStore("transactions", () => {
  const transactionDateFilterStore = useTransactionDateFilterStore();

  const runtimeConfig = useRuntimeConfig();
  const appConfig = useAppConfig();

  const cache = new LRUCache<{
    data: Transaction[];
    startTimestamp: number;
    endTimestamp: number;
  }>(appConfig.transactionsCacheSize);
  const currentCachedResponse = ref<Transaction[]>();

  // need computed to refresh query params to re-fetch
  const interval = computed(
    () => transactionDateFilterStore.effectiveUtcInterval
  );
  const startTimestamp = computed(() => interval.value?.[0].getTime() ?? 0);
  const endTimestamp = computed(() => interval.value?.[1].getTime() ?? 0);
  const key = computed(() => `${startTimestamp.value}-${endTimestamp.value}`);

  const { data, status, execute, error } = useFetch(`transactions`, {
    baseURL: runtimeConfig.public.apiBase,
    params: {
      timestamp_gte: startTimestamp,
      timestamp_lt: endTimestamp,
      _limit: runtimeConfig.public.maxTransactions,
      _sort: "-timestamp", // DESC sort so that most recent transactions come first
    },
    key: key.value,
    immediate: false,
    deep: false,
    watch: false,
    dedupe: 'defer'
  });

  watch(() => data.value, () => {
    if (!error.value) {
        // fill cache if success
        cache.set(key.value, {
            data: (data.value ?? []) as Transaction[],
            startTimestamp: startTimestamp.value,
            endTimestamp: endTimestamp.value
        });
    }
  });

  async function executeInternal() {
    const cached = cache.get(key.value);
    if (cached) {
        currentCachedResponse.value = cached.data;
    } else {
        currentCachedResponse.value = undefined;
        return await execute();
    }
  }

  async function invalidateRelatedQueries(timestamp: number) {
    //invalidate cache entries with intersecting interval
    cache.clear(entry => timestamp >= entry.startTimestamp && timestamp <= entry.endTimestamp);
    if (timestamp >= startTimestamp.value && timestamp <= endTimestamp.value) {
        console.log('intersecting interval, refresh');
        //reload current query if intersecting interval
        await execute();
    } else {
        console.log('NO intersecting interval');
    }
  }

  const add = async (transaction: Transaction) => {
    await $fetch('transactions', {
        baseURL: runtimeConfig.public.apiBase,
        method: "POST",
        body: transaction
    });
    //invalidate all matching intervals, this will re-run query is it's used ATM
    await invalidateRelatedQueries(transaction.timestamp);
  };

  const update = async (transaction: Transaction) => {
    await $fetch(`transactions/${transaction.id}`, {
        baseURL: runtimeConfig.public.apiBase,
        method: "PUT",
        body: transaction
    });
    //invalidate all matching intervals, this will re-run query is it's used ATM
    await invalidateRelatedQueries(transaction.timestamp);
  };

  const remove = async (transaction: Transaction) => {
    await $fetch(`transactions/${transaction.id}`, {
        baseURL: runtimeConfig.public.apiBase,
        method: "DELETE"
    });
    //invalidate all matching intervals, this will re-run query is it's used ATM
    await invalidateRelatedQueries(transaction.timestamp);
  };

  return {
    transactions: computed(() => ((currentCachedResponse.value ? currentCachedResponse.value : data.value) ?? []) as Transaction[]),
    loading: computed(() => !currentCachedResponse.value && status.value === "pending"),
    error: computed(() => !currentCachedResponse.value && !!error.value),
    add,
    remove,
    update,
    execute: executeInternal
  };
});

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  timestamp: number;
}