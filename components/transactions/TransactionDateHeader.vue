<script setup lang="ts">
const { timestamp } = defineProps<{
  timestamp: number;
}>();
const formattedDate = computed(() =>
  formatUtcDate(timestamp, { monthFormat: 'long' })
);
</script>

<template>
  <h3 class="transaction-date-header">
    {{ formattedDate }}
  </h3>
</template>

<style>
.transaction-date-header {
  display: flex;
  align-items: center;
  margin: 0;
}
</style>
