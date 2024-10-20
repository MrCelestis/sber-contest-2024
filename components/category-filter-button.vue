<script setup lang="ts">
import type { CategoryDetails } from "~/stores/visible-category-details";

const { color, selected } = defineProps<{
  color: string;
  selected: boolean;
  categoryDetails: CategoryDetails;
}>();

const severity = computed(() => (selected ? "success" : "secondary"));
</script>

<template>
  <Button
    class="category-chart__filter"
    :severity="severity"
    rounded
    :badge="categoryDetails.badge"
    badgeSeverity="contrast"
    :style="{
      borderColor: selected ? null : color,
    }"
  >
    <img :src="categoryDetails.iconUrl" />
    {{ categoryDetails.label }}
  </Button>
</template>
