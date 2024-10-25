<script setup lang="ts">
const { color, selected } = defineProps<{
  color: string;
  selected: boolean;
  categoryDetails: CategoryDetails;
}>();

const severity = computed(() => (selected ? 'success' : 'secondary'));
</script>

<template>
  <Button
    class="category-filter-button"
    rounded
    size="small"
    :severity="severity"
    badgeSeverity="contrast"
    :class="{ 'category-filter-button--selected': selected }"
    :style="{
      borderColor: selected ? null : color,
    }"
  >
    <img
      v-if="categoryDetails.iconUrl"
      :src="categoryDetails.iconUrl"
      class="category-filter-button__image"
      alt=""
    />
    {{ categoryDetails.label }}
  </Button>
</template>

<style>
.category-filter-button--selected > .category-filter-button__image {
  filter: invert(
    100%
  ); /* assume all icons are black, invert when selected to be visible on contrast background */
}
</style>
