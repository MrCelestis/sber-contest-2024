<script setup lang="ts">
import VirtualScroller from "primevue/virtualscroller";

import { useTransactionsStore } from "~/stores/transactions";
import { useCategoryFilterStore } from "~/stores/category-filter";
import { useCategoryMetadataStore } from "~/stores/category-metadata";

const transactionsStore = useTransactionsStore();
const categoryMetadataStore = useCategoryMetadataStore();
const categoryFilterStore = useCategoryFilterStore();
const transactionSortStore = useTransactionSortStore();
const transactionDateFilterStore = useTransactionDateFilterStore();

const ITEM_HEIGHT_PX = 44;
const itemHeightStyle = { height: ITEM_HEIGHT_PX + "px" };

const filteredTransactions = computed(() => {
  if (categoryFilterStore.selectedCategoryIds == null) {
    return transactionsStore.transactions;
  }
  return transactionsStore.transactions.filter((t) =>
    categoryFilterStore.selectedCategoryIds!.has(t.category)
  );
});

interface TransactionDisplayItem {
  dateHeaderTimestamp?: number;
  transaction?: Transaction;
}

const displayItems = computed(() => {
  switch (transactionSortStore.sort) {
    case "date":
      return getTransactionDisplayItemsByDate();
    case "amount":
      return getTransactionDisplayItemsbyAmount();
    default:
      break;
  }
});

function getTransactionDisplayItemsByDate(): TransactionDisplayItem[] {
  const result: TransactionDisplayItem[] = [];
  let curTimestamp: number | null = null;
  for (const transaction of filteredTransactions.value) {
    if (transaction.timestamp !== curTimestamp) {
      curTimestamp = transaction.timestamp;
      result.push({
        dateHeaderTimestamp: curTimestamp,
      });
    }
    result.push({ transaction });
  }
  return result;
}

function getTransactionDisplayItemsbyAmount(): TransactionDisplayItem[] {
  return filteredTransactions.value
    .map((transaction) => <TransactionDisplayItem>{ transaction })
    .sort(
      (a, b) =>
        Math.abs(b.transaction!.amount) - Math.abs(a.transaction!.amount)
    );
}

const showDate = computed(() => transactionSortStore.sort !== "date");

effect(async () => {
  const interval = transactionDateFilterStore.effectiveUtcInterval;
  if (interval) {
    await transactionsStore.fetch(interval[0].getTime(), interval[1].getTime());
    categoryFilterStore.reset();
  }
});
await categoryMetadataStore.fetch();
</script>

<template>
  <div class="transactions">
    <TransactionsToolbar></TransactionsToolbar>
    <ClientOnly>
      <VirtualScroller
        :items="displayItems"
        :itemSize="ITEM_HEIGHT_PX"
        :delay="10"
        class="transactions__scroller"
      >
        <template v-slot:item="{ item, options }">
          <Transaction
            v-if="item.transaction"
            :style="itemHeightStyle"
            :class="{ 'transactions__item--odd': options.odd }"
            :transaction="item.transaction"
            :showDate="showDate"
          >
          </Transaction>
          <TransactionDateHeader
            v-else
            :timestamp="item.dateHeaderTimestamp"
            :style="itemHeightStyle"
          ></TransactionDateHeader>
        </template>
      </VirtualScroller>
    </ClientOnly>
  </div>
</template>

<style>
.transactions {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  gap: var(--generic-spacing);
}
.transactions__scroller {
  flex-grow: 1;
}
.transactions__item--odd {
  background-color: ghostwhite;
}
</style>
