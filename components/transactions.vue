<script setup lang="ts">
import { useTransactionsStore } from "@/store/transactions";
const transactionsStore = useTransactionsStore();
transactionsStore.fetch(0);
</script>

<template>
  <div>
    <div v-for="transaction of transactionsStore.transactions">
      #{{ transaction.id }} {{ transaction.category }} :
      {{ transaction.amount }}
    </div>
  </div>
</template>
