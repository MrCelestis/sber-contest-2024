<script setup lang="ts">
const { visibleCategories, loading, isError } = useVisibleCategories();
const { categoryMetadata } = useCategoryMetadata();
const categoryFilterStore = useCategoryFilterStore();

const CHART_SKELETON_SIZE = "12rem";

const chartTypes = ["category", "history"] as const;
const selectedChart = useCookie<(typeof chartTypes)[number]>("selectedChart", {
  default: () => "category",
});

function switchChart(offset: number) {
  selectedChart.value =
    chartTypes[
      (chartTypes.findIndex((v) => v === selectedChart.value) +
        offset +
        chartTypes.length) %
        chartTypes.length
    ];
  // changing chart will remove filter from view and will be counter-intuitive to still apply it
  categoryFilterStore.reset();
}

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
</script>

<template>
  <div class="chart-area">
    error:{{ isError }}
    <div
      class="chart-area__container"
      v-if="visibleCategories.categoryDetails.length"
    >
      <!-- v-if on chart area prevents it from jumping due to initial resize (due to categories being rendered) -->
      <Button
        class="chart-area__container__arrow"
        icon="pi pi-angle-left"
        text
        severity="secondary"
        @click="switchChart(-1)"
      />
      <CategoryChart v-if="selectedChart === 'category'" />
      <HistoryChart v-else-if="selectedChart === 'history'" />
      <!--TODO: lazy?-->
      <Button
        class="chart-area__container__arrow"
        icon="pi pi-angle-right"
        text
        severity="secondary"
        @click="switchChart(1)"
      />
    </div>
    <div v-else class="chart-area__blank-space">
      <Skeleton
        v-if="loading"
        :height="CHART_SKELETON_SIZE"
        :width="CHART_SKELETON_SIZE"
        :border-radius="CHART_SKELETON_SIZE"
      />
      <template v-else>
        <div class="chart-area__blank-space__placeholder">
          <img
            v-for="category of sampleCategoriesForPlaceholder"
            class="chart-area__blank-space__placeholder__image"
            :key="category.id"
            :src="category.iconUrl"
            :style="category.style"
          />
        </div>
        <div class="chart-area__blank-space__text">
          <span v-if="isError">ERROR!</span>
          <span v-else>No transactions found for selected period</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.chart-area {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  gap: var(--generic-spacing);

  &__container {
    display: flex;
    justify-content: space-between;
    min-height: 0;
    flex-grow: 1;

    &__canvas {
      display: flex;
      flex-grow: 1;
      justify-content: center;
    }

    &__arrow {
      flex-shrink: 0;
    }
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

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
