<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  ArcElement,
  type ChartOptions,
} from "chart.js";
import { Colors } from "chart.js";
import { useCategoryFilterStore } from "~/stores/category-filter";
import { useVisibleCategoryStore } from "~/stores/visible-category-details";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  Colors // to auto assign colors
);

const SECONDARY_CATEGORY_COLOR = "gray";
const CATEGORY_COLORS = [
  "#1D3557",
  "#E49273",
  "#B8336A",
  "#429EA6",
  "#CFF27E",
  SECONDARY_CATEGORY_COLOR,
] as const;

const transactionFilterStore = useCategoryFilterStore();
const visibleCategoryStore = useVisibleCategoryStore();

const chartData = computed(() => {
  const categoryDetails =
    visibleCategoryStore.visibleCategoryDetails.categoryDetails;
  const data = categoryDetails.map((details) => details.totalExpenses);
  if (visibleCategoryStore.visibleCategoryDetails.remainder) {
    data.push(
      visibleCategoryStore.visibleCategoryDetails.remainder.totalExpenses
    );
  }
  return {
    labels: categoryDetails.map((details) => details.label),
    datasets: [
      {
        data,
        backgroundColor:
          transactionFilterStore.selectedCategoryIds == null
            ? CATEGORY_COLORS
            : CATEGORY_COLORS.map((color, index) =>
                transactionFilterStore.selectedCategoryIds?.size === 1 &&
                transactionFilterStore.selectedCategoryIds.has(
                  categoryDetails[index]?.category ?? ""
                )
                  ? color
                  : SECONDARY_CATEGORY_COLOR
              ),
      },
    ],
  };
});
const chartOptions: ChartOptions<any> = {
  responsive: true,
  cutout: "75%",
  plugins: {
    legend: {
      display: false, //TODO: disable plugin itself?
    },
  },
};
const otherCategoriesSelected = computed(() =>
  areSetsEqual(
    visibleCategoryStore.visibleCategoryDetails.remainder?.categories,
    transactionFilterStore.selectedCategoryIds
  )
);
</script>

<template>
  <div class="category-chart">
    <div class="category-chart__canvas">
      <Doughnut
        :options="chartOptions"
        :data="chartData"
        aria-label="Expenses by category"
        aria-describedby="my-data-table"
      >
        Failed to show chart
      </Doughnut>
    </div>
    <div class="category-chart__filter">
      <ClientOnly>
        <CategoryFilterButton
          v-for="(categoryDetails, index) of visibleCategoryStore
            .visibleCategoryDetails.categoryDetails"
          :key="categoryDetails.category!"
          :category-details="categoryDetails"
          :selected="
            (transactionFilterStore.selectedCategoryIds?.size === 1 && transactionFilterStore.selectedCategoryIds?.has(categoryDetails.category!)) ?? false
          "
          :color="CATEGORY_COLORS[index]"
          v-on:click="
            transactionFilterStore.toggle([categoryDetails.category!])
          "
        ></CategoryFilterButton>
        <CategoryFilterButton
          v-if="visibleCategoryStore.visibleCategoryDetails.remainder"
          :category-details="
            visibleCategoryStore.visibleCategoryDetails.remainder
          "
          :selected="otherCategoriesSelected"
          :color="SECONDARY_CATEGORY_COLOR"
          v-on:click="
            transactionFilterStore.toggle(
              visibleCategoryStore.visibleCategoryDetails.remainder?.categories
            )
          "
        ></CategoryFilterButton>
      </ClientOnly>
    </div>
  </div>
</template>

<style>
.category-chart {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  gap: var(--generic-spacing);
}
.category-chart__canvas {
  display: flex;
  min-height: 0; /* Allows chart canvas to shrink correctly if it doesn't fit */
  flex-grow: 1;
  justify-content: center;
}
.category-chart__filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--generic-spacing);
}
.category-chart__filter__remove {
  height: auto !important;
  padding: 0;
}
</style>
