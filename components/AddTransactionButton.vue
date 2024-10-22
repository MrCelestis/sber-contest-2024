<script setup lang="ts">
const { showLabel } = defineProps<{
    showLabel?: boolean
}>();

const transactions = useTransactions();
const transactionDialogVisible = ref(false);

const label = computed(() => showLabel ? 'Add expenses/income' : '');

function addTransaction(transaction: Transaction) {
  //transactionsStore.add(transaction);
}
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
    @commit="addTransaction"
  />
</template>
