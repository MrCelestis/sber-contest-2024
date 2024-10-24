<script setup lang="ts">
const visible = defineModel<boolean>("visible");
const { transaction } = defineProps<{ transaction?: Transaction }>();

const {
  add: addTransaction,
  remove: removeTransaction,
  update: updateTransaction,
} = useTransactionsStore();

const commitInProgress = ref(false);
const removeInProgress = ref(false);

const title = computed(() =>
  transaction ? "Edit transaction" : "Add transaction"
);

async function commit(entryResult: Transaction) {
  if (
    transaction &&
    entryResult &&
    entryResult.amount === transaction.amount &&
    entryResult.category === transaction.category &&
    entryResult.timestamp === transaction.timestamp
  ) {
    //transaction is the same, no need to commit changes
    visible.value = false;
    return;
  }
  commitInProgress.value = true;
  try {
    if (entryResult.id) {
      await updateTransaction(entryResult);
    } else {
      await addTransaction(entryResult);
    }
  } finally {
    commitInProgress.value = false;
    visible.value = false;
  }
}

async function remove() {
  if (!transaction) {
    return;
  }
  removeInProgress.value = true;
  try {
    await removeTransaction(transaction);
  } finally {
    removeInProgress.value = false;
    visible.value = false;
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="title" dismissable-mask>
    <Suspense>
      <LazyTransactionEntry
        :commit-in-progress="commitInProgress"
        :remove-in-progress="removeInProgress"
        :transaction="transaction"
        @cancel="visible = false"
        @commit="commit"
        @remove="remove"
      ></LazyTransactionEntry>
      <template #fallback>
        <div class="transaction-dialog__fallback">
          <Skeleton v-for="n in 5"></Skeleton>
        </div>
      </template>
    </Suspense>
  </Dialog>
</template>

<style>
.transaction-dialog__fallback {
  display: flex;
  flex-direction: column;
  gap: var(--generic-spacing);
}
</style>
