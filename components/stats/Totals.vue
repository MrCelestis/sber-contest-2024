<script setup lang="ts">
const { visibleCategories } = useVisibleCategories();

const formattedStats = computed(() => {
  const income = visibleCategories.value.totalIncome;
  const expenses = visibleCategories.value.totalExpenses;
  const sum = income - expenses; // expenses < 0
  const incomePercent = Math.round((income / sum) * 100);
  return {
    income: formatAmount(income),
    expenses: formatAmount(expenses),
    incomePercent: `${incomePercent}%`,
    expensesPercent: `${100 - incomePercent}%`,
  };
});
</script>

<template>
  <div class="totals">
    <div class="totals__numbers">
      <span class="totals__numbers--income">
        {{ formattedStats.income }}
        <span v-if="visibleCategories.totalIncome"
          >({{ formattedStats.incomePercent }})</span
        >
      </span>
      <span class="totals__numbers--expenses">
        {{ formattedStats.expenses }}
        <span v-if="visibleCategories.totalExpenses"
          >({{ formattedStats.expensesPercent }})</span
        >
      </span>
    </div>
    <div
      class="totals__bar"
      v-if="formattedStats.income || formattedStats.expenses"
    >
      <div
        class="totals__bar__segment totals__bar__segment--income"
        :style="{ width: formattedStats.incomePercent }"
      ></div>
      <div
        class="totals__bar__segment totals__bar__segment--expenses"
        :style="{ width: formattedStats.expensesPercent }"
      ></div>
    </div>
  </div>
</template>

<style>
.totals {
  display: flex;
  flex-direction: column;
  gap: var(--generic-spacing);
}
.totals__numbers {
  display: flex;
  justify-content: space-between;
}
.totals__numbers--income {
  color: var(--positive-color);
}
.totals__numbers--expenses {
  color: var(--negative-color);
}
.totals__bar {
  display: flex;
  border-radius: 0.25rem;
  overflow: hidden;
}
.totals__bar__segment {
  height: 0.5rem;
  transition: linear 500ms;
}
.totals__bar__segment--income {
  background-color: var(--positive-color);
}
.totals__bar__segment--expenses {
  background-color: var(--negative-color);
}
</style>
