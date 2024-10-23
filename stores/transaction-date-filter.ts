import { defineStore } from "pinia";

export const useTransactionDateFilterStore = defineStore(
  "transactionDateFilterStore",
  () => {
    const categoryFilterStore = useCategoryFilterStore();
    const mode = ref<TransactionDateFilterMode>("month");
    const monthOffset = ref(0);
    const yearOffset = ref(0);
    const customInterval = ref<[Date, Date] | null>(null);

    const customIntervalLocal = computed(() => {
      return customInterval.value
        ? (customInterval.value.map(utcDateToLocal) as [Date, Date])
        : null;
    });
    const effectiveUtcInterval = computed(() => {
      //TODO: include last component entirely (-1 ms?)
      switch (mode.value) {
        case "month": {
          const now = new Date();
          const effectiveMonthStart = new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth() + monthOffset.value,
              1
            )
          );
          const effectiveMonthEnd = new Date(effectiveMonthStart);
          effectiveMonthEnd.setUTCMonth(effectiveMonthEnd.getUTCMonth() + 1); //+1 month
          effectiveMonthEnd.setUTCDate(0); //-1 day = last day of effectiveMonthStart month
          return [effectiveMonthStart, effectiveMonthEnd];
        }
        case "year": {
          const now = new Date();
          const effectiveYearStart = new Date(
            Date.UTC(now.getUTCFullYear() + yearOffset.value, 0, 1)
          );
          const effectiveYearEnd = new Date(effectiveYearStart);
          effectiveYearEnd.setUTCFullYear(
            effectiveYearEnd.getUTCFullYear() + 1
          ); //+1 year
          effectiveYearEnd.setUTCDate(0); //-1 day = last day of effectiveYearStart month
          return [effectiveYearStart, effectiveYearEnd];
        }
        case "custom":
          return customInterval.value;
      }
    });
    const select = (
      newMode: TransactionDateFilterMode,
      newCustomInterval?: [Date, Date],
      utc = true
    ) => {
      mode.value = newMode;
      if (newMode !== "custom" && newCustomInterval != null) {
        throw new Error('Attempt to set custom interval for non-"custom" mode');
      }
      if (newCustomInterval) {
        customInterval.value = utc
          ? newCustomInterval
          : (newCustomInterval.map(localDateToUtc) as [Date, Date]);
      }
    };

    const selectAdjacentInterval = (offset: -1 | 1) => {
      switch (mode.value) {
        case "month":
          monthOffset.value += offset;
          break;
        case "year":
          yearOffset.value += offset;
          break;
      }
    };

    //new interval will probably change categories in view, reset filter
    watch(effectiveUtcInterval, () => categoryFilterStore.reset());
    return {
      mode,
      monthOffset,
      yearOffset,
      customInterval,
      customIntervalLocal,
      effectiveUtcInterval,
      select,
      selectAdjacentInterval,
    };
  }
);

const transactionDateFilterModes = ["month", "year", "custom"] as const;
export type TransactionDateFilterMode =
  (typeof transactionDateFilterModes)[number];