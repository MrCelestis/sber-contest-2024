<script setup lang="ts">
import type { MenuItem } from "primevue/menuitem";

const { showAddButton } = defineProps<{
  showAddButton: boolean;
}>();

const transactionSortStore = useTransactionSortStore();
const sortMenuItems: MenuItem[] = [
  {
    label: "By Date", //TODO: t
    key: "date",
    command: () => transactionSortStore.select("date"),
  },
  {
    label: "By Amount", //TODO: t
    key: "amount",
    command: () => transactionSortStore.select("amount"),
  },
];

const sortLabel = computed(
  () =>
    (sortMenuItems.find((item) => item.key === transactionSortStore.sort)
      ?.label as string) ?? ""
);

const sortMenuRef = useTemplateRef("sortMenu");
</script>

<template>
  <div class="transactions-toolbar">
    <AddTransactionButton v-if="showAddButton" />
    <Button
      class="transactions-toolbar__sort"
      type="button"
      severity="secondary"
      @click="sortMenuRef?.toggle"
      aria-haspopup="true"
      aria-controls="transaction_sort_menu"
    >
      <i class="pi pi-sort-amount-down"></i>
      {{ sortLabel }}
    </Button>
    <Menu
      ref="sortMenu"
      id="transaction_sort_menu"
      :model="sortMenuItems"
      :popup="true"
    />
  </div>
</template>

<style lang="scss">
.transactions-toolbar {
  display: flex;

  &__sort {
    margin-left: auto;
    height: var(--p-button-icon-only-width); // to match + icon button height (to avoid jumping height when it's hidden)
  }
}

</style>
