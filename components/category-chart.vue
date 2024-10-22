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
const { visibleCategories, loading } = useVisibleCategories();
const { categoryMetadata } = useCategoryMetadata();

const chartData = computed(() => {
  const categoryDetails = visibleCategories.value.categoryDetails;
  const data = categoryDetails.map((details) => details.totalExpenses);
  if (visibleCategories.value.remainder) {
    data.push(visibleCategories.value.remainder.totalExpenses);
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
    visibleCategories.value.remainder?.categories,
    transactionFilterStore.selectedCategoryIds
  )
);

const sampleCategoriesForPlaceholder = computed(() => {
  const placeholderCategories = categoryMetadata.value.slice(0, 8);
  const n = placeholderCategories.length;
  // position category icons in a circle
  return placeholderCategories.map((category, i) => {
    const angle = (i / n) * 2 * Math.PI;
    const offsetPercent = 35;
    const x = Math.round(Math.cos(angle) * offsetPercent);
    const y = Math.round(Math.sin(angle) * offsetPercent);
    return {
      id: category.id,
      iconUrl: category.iconUrl,
      style: {
        left: `calc(50% + ${x}%)`,
        top: `calc(50% + ${y}%)`,
      },
    };
  });
});

const CHART_SKELETON_SIZE = "12rem";
</script>

<template>
  <div class="category-chart">
    <div
      class="category-chart__canvas"
      v-if="visibleCategories.categoryDetails.length"
    >
      <!-- v-if on chart prevents it from jumping due to initial resize (due to categories being rendered) -->
      <Doughnut
        :options="chartOptions"
        :data="chartData"
        aria-label="Expenses by category"
        aria-describedby="my-data-table"
      >
        Failed to show chart
      </Doughnut>
    </div>
    <div v-else class="category-chart__blank-space">
      <Skeleton
        v-if="loading"
        :height="CHART_SKELETON_SIZE"
        :width="CHART_SKELETON_SIZE"
        :border-radius="CHART_SKELETON_SIZE"
      />
      <template v-else>
        <div class="category-chart__blank-space__placeholder">
          <img
            v-for="category of sampleCategoriesForPlaceholder"
            class="category-chart__blank-space__placeholder__image"
            :key="category.id"
            :src="category.iconUrl"
            :style="category.style"
          />
        </div>
        <div class="category-chart__blank-space__text">
          No transactions found for selected period
        </div>
      </template>
    </div>
    <div class="category-chart__filter">
      <CategoryFilterButton
        v-for="(categoryDetails, index) of visibleCategories.categoryDetails"
        :key="categoryDetails.category!"
        :category-details="categoryDetails"
        :selected="
            (transactionFilterStore.selectedCategoryIds?.size === 1 && transactionFilterStore.selectedCategoryIds?.has(categoryDetails.category!)) ?? false
          "
        :color="CATEGORY_COLORS[index]"
        v-on:click="transactionFilterStore.toggle([categoryDetails.category!])"
      ></CategoryFilterButton>
      <CategoryFilterButton
        v-if="visibleCategories.remainder"
        :category-details="visibleCategories.remainder"
        :selected="otherCategoriesSelected"
        :color="SECONDARY_CATEGORY_COLOR"
        v-on:click="
          transactionFilterStore.toggle(visibleCategories.remainder?.categories)
        "
      ></CategoryFilterButton>
    </div>
  </div>
</template>

<style lang="scss">
.category-chart {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  gap: var(--generic-spacing);

  &__canvas {
    display: flex;
    min-height: 0; // Allows chart canvas to shrink correctly if it doesn't fit
    max-height: 75%; // Somewhat prevents jumping due to resize when categories appear
    flex-grow: 1;
    justify-content: center;
  }

  &__blank-space {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    position: relative;

    &__text {
      text-align: center;
      border-radius: var(--p-button-border-radius);
      padding: var(--generic-spacing);
      background-color: var(--p-button-secondary-background);
      max-width: 50vw;
      z-index: 1; //on top of animated placeholder
    }

    &__placeholder {
      position: absolute;
      width: 100%;
      height: 100%;
      animation: spin 25s linear infinite;

      &__image {
        position: absolute;
        opacity: 0.25;
      }
    }
  }

  &__filter {
    display: flex;
    flex-wrap: wrap;
    gap: var(--generic-spacing);

    &__remove {
      height: auto !important;
      padding: 0;
    }
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
