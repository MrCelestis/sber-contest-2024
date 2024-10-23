<script setup lang="ts">
const { transaction, showDate, odd } = defineProps<{
  transaction: Transaction;
  showDate: boolean;
  odd: boolean;
}>();

const { categoryMetadataById } = useCategoryMetadata();
const category = computed(() =>
  categoryMetadataById.value.get(transaction.category)
);
const dateFormatted = computed(() =>
  showDate
    ? formatUtcDate(transaction.timestamp, { monthFormat: "long" })
    : null
);
const amount = computed(() => formatAmount(transaction.amount));

</script>

<template>
  <div class="transaction" :class="{ 'transaction--odd': odd }">
    <div v-if="showDate" class="transaction__date">{{ dateFormatted }}</div>
    <div class="transaction__category">
      <img v-if="category" v-bind:src="category.iconUrl" />
      <div>{{ category?.text }}</div>
    </div>
    <div
      class="transaction__amount"
      :class="{ 'transaction__amount--positive': transaction.amount > 0 }"
    >
      <span v-if="transaction.amount > 0">+</span>{{ amount }}
    </div>
  </div>
</template>

<style lang="scss">
.transaction {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--generic-spacing);
  padding: 0 var(--generic-spacing);
  cursor: pointer;

  &--odd {
    background-color: var(--p-button-secondary-background);
  }

  &:hover {
    background-color: var(--p-button-secondary-hover-background);
  }

  &__category {
    display: flex;
    min-width: 40%;
    gap: var(--generic-spacing);
  }

  &__date {
    min-width: 25%;
  }

  &__amount {
    color: var(--negative-color);
  }

  &__amount--positive {
    color: var(--positive-color);
  }
}
</style>
