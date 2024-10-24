<script setup lang="ts">
import VirtualScroller from "primevue/virtualscroller";

const transactionsStore = useTransactionsStore();
const categoryFilterStore = useCategoryFilterStore();
const transactionSortStore = useTransactionSortStore();

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

const transactionToEdit = ref<Transaction | undefined>();

const displayItems = computed(() => {
  switch (transactionSortStore.sort) {
    case "date":
      return getTransactionDisplayItemsByDate(filteredTransactions.value);
    case "amount":
      return getTransactionDisplayItemsByAmount(filteredTransactions.value);
    default:
      throw new Error(`Unknown sort mode: ${transactionSortStore.sort}`);
  }
});

const showDate = computed(() => transactionSortStore.sort !== "date");
</script>

<template>
  <div class="transactions">
    <TransactionsToolbar :show-add-button="displayItems.length > 0" />
    <VirtualScroller
      v-if="displayItems.length && !transactionsStore.loading"
      :items="displayItems"
      :itemSize="ITEM_HEIGHT_PX"
      :delay="10"
      class="transactions__scroller"
    >
      <template v-slot:item="{ item, options }">
        <Transaction
          v-if="item.transaction"
          :style="itemHeightStyle"
          :odd="options.odd"
          :transaction="item.transaction"
          :showDate="showDate"
          @click="() => (transactionToEdit = item.transaction)"
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
      <template v-if="transactionsStore.loading">
        <Skeleton v-for="i in 4" />
      </template>
      <AddTransactionButton v-else :show-label="true" />
    </div>
    <TransactionDialog
      :visible="!!transactionToEdit"
      @update:visible="transactionToEdit = undefined"
      :transaction="transactionToEdit"
    />
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

  &__blank-space {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    flex-wrap: wrap;
  }
}
</style>
