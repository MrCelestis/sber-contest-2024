<script setup lang="ts">
const visible = defineModel<boolean>("visible");
const { transaction } = defineProps<{ transaction?: Transaction }>();
const emit = defineEmits(["commit"]);

const title = computed(() =>
  transaction ? "Edit transaction" : "Add transaction"
);

function commit(entryResult: Transaction) {
  visible.value = false;
  if (
    transaction &&
    entryResult &&
    entryResult.amount === transaction.amount &&
    entryResult.category === transaction.category &&
    entryResult.timestamp === transaction.timestamp
  ) {
    //transaction is the same, no need to commit changes
    return;
  }
  emit("commit", entryResult);
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="title">
    <Suspense>
      <LazyTransactionEntry
        @cancel="visible = false"
        @commit="commit"
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