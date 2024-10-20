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
import {
  useCategoryMetadataStore,
  type CategoryMetadata,
} from "~/stores/category-metadata";
import { useTransactionsStore } from "~/stores/transactions";
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

const categoryColors = [
  "#1D3557",
  "#E49273",
  "#B8336A",
  "#429EA6",
  "#CFF27E",
  "gray",
] as const;

const transactionFilterStore = useCategoryFilterStore();
const visibleCategoryStore = useVisibleCategoryStore();

const chartData = computed(() => {
  return {
    labels: visibleCategoryStore.visibleCategoryDetails.map(
      (details) => details.label
    ),
    datasets: [
      {
        data: visibleCategoryStore.visibleCategoryDetails.map(
          (details) => details.totalExpenses
        ),
        backgroundColor: categoryColors,
      },
    ],
  };
});
const chartOptions: ChartOptions<any> = {
  responsive: true,
  plugins: {
    legend: {
      display: false, //TODO: disable plugin itself?
    },
  },
};
</script>

<template>
  <Doughnut
    :options="chartOptions"
    :data="chartData"
    aria-label="Expenses by category"
    aria-describedby="my-data-table"
  >
    Failed to show chart
  </Doughnut>
  <client-only>
    <CategoryFilterButton
      v-for="(
        categoryDetails, index
      ) of visibleCategoryStore.visibleCategoryDetails"
      :key="categoryDetails.category"
      :category-details="categoryDetails"
      :selected="
        transactionFilterStore.selectedCategoryId === categoryDetails.category
      "
      :color="categoryColors[index]"
      v-on:click="
        transactionFilterStore.select(
          transactionFilterStore.selectedCategoryId === categoryDetails.category
            ? null
            : categoryDetails.category
        )
      "
    ></CategoryFilterButton>
  </client-only>
</template>

<style>
.category-chart__filter {
  /* padding-top: 0;
  padding-bottom: 0;
  padding-right: 0; */
}
.category-chart__filter:hover {
  background-color: gray;
}
.category-chart__filter__remove {
  height: auto !important;
  padding: 0;
}
</style>
