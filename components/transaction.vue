<script setup lang="ts">
import { useCategoryMetadataStore } from "~/stores/category-metadata";
import type { Transaction } from "~/stores/transactions";

const { transaction, showDate } = defineProps<{
  transaction: Transaction;
  showDate: boolean;
}>();

const categoryMetadataStore = useCategoryMetadataStore();
const category = computed(() =>
  categoryMetadataStore.categoryById.get(transaction.category)
);
const dateFormatted = computed(() =>
  showDate ? formatUtcDate(transaction.timestamp) : null
);
</script>

<template>
  <div class="transaction">
    <div v-if="showDate" class="transaction__date">{{ dateFormatted }}</div>
    <div class="transaction__category">
      <img v-if="category" v-bind:src="category.iconUrl" />
      <div>{{ category?.text }}</div>
    </div>
    <div
      class="transaction__amount"
      :class="{ 'transaction__amount--positive': transaction.amount > 0 }"
    >
      <span v-if="transaction.amount > 0">+</span>{{ transaction.amount }}
    </div>
  </div>
</template>

<style>
.transaction {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--generic-spacing);
  padding: 0 var(--generic-spacing);
}
.transaction__category {
  display: flex;
  min-width: 40%;
  gap: var(--generic-spacing);
}
.transaction__date {
  min-width: 25%;
}
.transaction__amount {
  color: var(--negative-color);
}
.transaction__amount--positive {
  color: var(--positive-color);
}
</style>
