<script setup lang="ts">
import { useCategoryMetadataStore } from "~/stores/category-metadata";
import type { Transaction } from "~/stores/transactions";

const { transaction } = defineProps<{
    transaction: Transaction
}>();

const categoryMetadataStore = useCategoryMetadataStore();
const category = computed(() => categoryMetadataStore.categoryById.get(transaction.category));
</script>

<template>
  <div class="transaction">
      #{{ transaction.id }}
      {{ new Date(transaction.timestamp).toISOString() }}
      <img v-if="category" v-bind:src="category.iconUrl" />
      {{ category?.text }} :
      {{ transaction.amount }}
  </div>
</template>
