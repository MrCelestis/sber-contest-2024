<script setup lang="ts">
const { timestamp, odd } = defineProps<{
  timestamp: number;
  odd: boolean
}>();
const formattedDate = computed(() =>
  formatUtcDate(timestamp, { monthFormat: 'long' })
);
</script>

<template>
  <h3 class="transaction-date-header" :class="{ 'transaction-date-header--odd': odd }">
    {{ formattedDate }}
  </h3>
</template>

<style lang="scss">
.transaction-date-header {
  display: flex;
  align-items: center;
  margin: 0;
  padding-left: var(--generic-spacing);

  &--odd {
    background-color: var(--p-button-secondary-background);
  }
}
</style>
