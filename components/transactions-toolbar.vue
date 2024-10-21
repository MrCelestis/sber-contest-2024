<script setup lang="ts">
import type { MenuItem } from "primevue/menuitem";

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
  <div class="transaction-toolbar">
    <Button
      class="transactions__add"
      icon="pi pi-plus"
      rounded
    /><!-- :loading="true"-->
    <Button
      class="transactions-toolbar__sort"
      type="button"
      severity="secondary"
      @click="sortMenuRef?.toggle"
      aria-haspopup="true"
      aria-controls="transaction_sort_menu"
    >
      <i class="pi pi-sort-amount-down"></i>
      <span class="transactions-toolbar__sort__label">{{ sortLabel }}</span>
    </Button>
    <Menu
      ref="sortMenu"
      id="transaction_sort_menu"
      :model="sortMenuItems"
      :popup="true"
    />
  </div>
</template>

<style>
.transaction-toolbar {
  display: flex;
  gap: var(--generic-spacing);
}
.transactions-toolbar__sort {
  margin-left: auto;
}

@media (max-width: 440px) {
  .transactions-toolbar__sort__label {
    display: none; /* save space by hiding current sort mode text */
  }
}
</style>
