<template>
  <div class="app">
    <Card class="app__header">
      <template #content><AppHeader /></template>
    </Card>
    <Card class="app__chart">
      <template #content><CategoryChart /></template>
    </Card>
    <Card class="app__totals"
      ><template #content> <Totals /> </template
    ></Card>
    <Card class="app__transactions">
      <template #content><Transactions /></template>
    </Card>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.app {
  display: grid;
  height: 100%;
  background-color: aliceblue;
  grid-template-rows: auto 40vh 5rem 3fr;
  grid-template-areas:
    "header"
    "chart"
    "totals"
    "transactions";
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
  }

  &__transactions {
    grid-area: transactions;
    overflow: hidden;
  }
}

@media (min-width: 500px) {
  .app {
    grid-template-columns: 4fr 4fr 1fr;
    grid-template-rows: auto 2fr 3fr;
    grid-template-areas:
      "header header header"
      "chart chart totals"
      "transactions transactions transactions";
  }
}
</style>
