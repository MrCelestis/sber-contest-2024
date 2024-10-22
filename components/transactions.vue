<script setup lang="ts">
import VirtualScroller from "primevue/virtualscroller";

const { transactions, loading } = useTransactions();
const categoryFilterStore = useCategoryFilterStore();
const transactionSortStore = useTransactionSortStore();

const ITEM_HEIGHT_PX = 44;
const itemHeightStyle = { height: ITEM_HEIGHT_PX + "px" };

const filteredTransactions = computed(() => {
  if (categoryFilterStore.selectedCategoryIds == null) {
    return transactions.value;
  }
  return transactions.value.filter((t) =>
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
      throw new Error(`Unknown sort mode: ${transactionSortStore.sort}`);
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
</script>

<template>
  <div class="transactions">
    <TransactionsToolbar :show-add-button="displayItems.length > 0" />
    <VirtualScroller
      v-if="displayItems.length"
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
    <div v-else class="transactions__blank-space">
      <template v-if="loading">
        <Skeleton v-for="i in 4" />
      </template>
      <AddTransactionButton v-else :show-label="true" />
    </div>
  </div>
</template>

<style lang="scss">
.transactions {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  gap: var(--generic-spacing);

  &__scroller {
    flex-grow: 1;
  }

  &__item--odd {
    background-color: ghostwhite;
  }

  &__blank-space {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    flex-wrap: wrap;
  }
}
</style>
