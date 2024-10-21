import { defineStore } from "pinia";

export const useTransactionDateFilterStore = defineStore(
  "transactionDateFilterStore",
  {
    state: () => ({
      mode: "month" as TransactionDateFilterMode,
      /** Month offset from current month. */
      monthOffset: 0,
      /** Month offset from current year. */
      yearOffset: 0,
      customInterval: null as [Date, Date] | null,
    }),
    getters: {
      customIntervalLocal: (state) => {
        return state.customInterval
          ? (state.customInterval.map(utcDateToLocal) as [Date, Date])
          : null;
      },
      effectiveUtcInterval: (state) => { //TODO: include last component entirely (-1 ms?)
        switch (state.mode) {
          case "month": {
            const now = new Date();
            const effectiveMonthStart = new Date(
              Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth() + state.monthOffset,
                1
              )
            );
            const effectiveMonthEnd = new Date(effectiveMonthStart);
            effectiveMonthEnd.setUTCMonth(effectiveMonthEnd.getUTCMonth() + 1); //+1 month
            effectiveMonthEnd.setUTCDate(0); //-1 day = last day of effectiveMonthStart month
            console.log(
              "> month=",
              state.monthOffset,
              effectiveMonthStart.toISOString(),
              effectiveMonthEnd.toISOString()
            );
            return [effectiveMonthStart, effectiveMonthEnd];
          }
          case "year": {
            const now = new Date();
            const effectiveYearStart = new Date(
              Date.UTC(now.getUTCFullYear() + state.yearOffset, 0, 1)
            );
            const effectiveYearEnd = new Date(effectiveYearStart);
            effectiveYearEnd.setUTCFullYear(effectiveYearEnd.getUTCFullYear() + 1); //+1 year
            effectiveYearEnd.setUTCDate(0); //-1 day = last day of effectiveYearStart month
            console.log(
              "> year=",
              state.yearOffset,
              effectiveYearStart.toISOString(),
              effectiveYearEnd.toISOString()
            );
            return [effectiveYearStart, effectiveYearEnd];
          }
          case "custom":
            return state.customInterval;
        }
      },
    },
    actions: {
      select(
        mode: TransactionDateFilterMode,
        customInterval?: [Date, Date],
        utc = true
      ) {
        this.mode = mode;
        if (mode !== "custom" && customInterval != null) {
          throw new Error(
            'Attempt to set custom interval for non-"custom" mode'
          );
        }
        if (customInterval) {
          this.customInterval = utc
            ? customInterval
            : (customInterval.map(localDateToUtc) as [Date, Date]);
        }
      },
      selectAdjacentInterval(offset: -1 | 1) {
        switch (this.mode) {
          case "month":
            this.monthOffset += offset;
            break;
          case "year":
            this.yearOffset += offset;
            break;
        }
      },
    },
  }
);

const transactionDateFilterModes = ["month", "year", "custom"] as const;
export type TransactionDateFilterMode =
  (typeof transactionDateFilterModes)[number];
