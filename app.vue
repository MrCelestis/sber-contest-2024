<template>
  <div class="app" data-testid="app">
    <Card class="app__header">
      <template #content><AppHeader /></template>
    </Card>
    <Card class="app__chart">
      <template #content><ChartArea /></template>
    </Card>
    <Card class="app__totals"
      ><template #content> <Totals /> </template
    ></Card>
    <Card class="app__transactions">
      <template #content><Transactions /></template>
    </Card>
  </div>
</template>

<script setup lang="ts">
const transactionDateFilterStore = useTransactionDateFilterStore();
const transactionsStore = useTransactionsStore();

// refresh transactions based on new filter
watch(transactionDateFilterStore, () => transactionsStore.execute());
if (!transactionsStore.initialized) {
  // needed for SSR
  await transactionsStore.execute();
}
</script>

<style lang="scss">
.app {
  display: grid;
  height: 100%;
  grid-template-rows: auto 40vh 5rem 3fr;
  grid-template-areas:
    'header'
    'chart'
    'totals'
    'transactions';
  gap: var(--generic-spacing);
  padding: var(--generic-spacing);

  &__header {
    grid-area: header;
  }

  &__chart {
    grid-area: chart;
    min-height: 30vh;
  }

  &__totals {
    grid-area: totals;
    container-type: size;
  }

  &__transactions {
    grid-area: transactions;
    overflow: hidden;
  }
}

@media (min-width: 500px) {
  .app {
    grid-template-columns: 4fr 4fr minmax(9rem, auto);
    grid-template-rows: auto 2fr 3fr;
    grid-template-areas:
      'header header header'
      'chart chart totals'
      'transactions transactions transactions';
  }
}

@media (orientation: landscape) {
  .app {
    grid-template-columns: 3fr 2fr;
    grid-template-rows: auto 2fr 5rem;
    grid-template-areas:
      'header transactions'
      'chart transactions'
      'totals transactions';
  }
}
</style>
