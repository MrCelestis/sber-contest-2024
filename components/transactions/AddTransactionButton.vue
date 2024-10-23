<script setup lang="ts">
const { showLabel } = defineProps<{
    showLabel?: boolean
}>();

const transactionDialogVisible = ref(false);

const label = computed(() => showLabel ? 'Add expenses/income' : '');

</script>

<template>
  <Button
    class="transactions__add"
    icon="pi pi-plus"
    rounded
    :label="label"
    @click="transactionDialogVisible = true"
  />
  <TransactionDialog
    v-model:visible="transactionDialogVisible"
  />
</template>
