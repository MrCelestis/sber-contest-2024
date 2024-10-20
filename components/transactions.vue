<script setup lang="ts">
import { useTransactionsStore } from "~/stores/transactions";
import { useCategoryFilterStore } from "~/stores/category-filter";
import { useCategoryMetadataStore } from "~/stores/category-metadata";

const transactionsStore = useTransactionsStore();
const categoryMetadataStore = useCategoryMetadataStore();
const categoryFilterStore = useCategoryFilterStore();

const filteredTransactions = computed(() =>
  categoryFilterStore.selectedCategoryId == null
    ? transactionsStore.transactions
    : transactionsStore.transactions.filter(
        (t) => t.category === categoryFilterStore.selectedCategoryId
      )
);

await transactionsStore.fetch(0);
await categoryMetadataStore.fetch();
</script>

<template>
  <div>
    <Button label="+" rounded /><!-- :loading="true"-->
    <Transaction
      v-for="transaction of filteredTransactions"
      :key="transaction.id"
      :transaction="transaction"
    >
    </Transaction>
  </div>
</template>
