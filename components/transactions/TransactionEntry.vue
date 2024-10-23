<script setup lang="ts">

const {
  transaction: transactionToUpdate,
  commitInProgress,
  removeInProgress,
} = defineProps<{
  transaction?: Transaction;
  commitInProgress?: boolean;
  removeInProgress?: boolean;
}>();
const emit = defineEmits(["cancel", "commit", "remove"]);

const { categoryMetadata } = useCategoryMetadata();

const disabled = computed(() => commitInProgress || removeInProgress);

const TRANSACTION_TYPES = ["+", "-"] as const;
const transactionType = ref<(typeof TRANSACTION_TYPES)[number]>(
  transactionToUpdate ? (transactionToUpdate.amount > 0 ? "+" : "-") : "-"
);
const transactionTypeOptions = [
  { value: "+", label: "Income" },
  { value: "-", label: "Expense" },
];

const MIN_AMOUNT = 0.01;
const amount = ref(
  transactionToUpdate ? Math.abs(transactionToUpdate.amount) : 1
);
const date = ref(
  transactionToUpdate
    ? utcDateToLocal(new Date(transactionToUpdate.timestamp))
    : new Date()
);
const category = ref<string>(
  transactionToUpdate
    ? transactionToUpdate.category
    : categoryMetadata.value[0]?.id ?? ""
);

const amountPrefix = computed(() => (transactionType.value === "-" ? "-" : ""));

function commit() {
  const formValues = {
    amount: transactionType.value === "+" ? amount.value : -amount.value,
    category: category.value,
    timestamp: localDateToUtc(date.value).getTime(),
  };
  const result: Transaction = transactionToUpdate
    ? {
        ...transactionToUpdate,
        ...formValues,
      }
    : {
        id: '',
        ...formValues,
      };
  emit("commit", result);
}
const OPTION_SIZE_PX = 32; //virtual scroll needs predefined px size
const optionStyle = { height: OPTION_SIZE_PX + "px" };
</script>

<template>
  <div class="transaction-entry">
    <SelectButton
      v-model="transactionType"
      :options="transactionTypeOptions"
      :disabled="disabled"
      optionLabel="label"
      optionValue="value"
      aria-labelledby="basic"
    />
    <div class="transaction-entry__field">
      <label for="category">Category</label>
      <Select
        v-model="category"
        :options="categoryMetadata"
        option-label="text"
        option-value="id"
        inputId="category"
        :disabled="transactionType === '+' || disabled"
        :virtualScrollerOptions="{ itemSize: OPTION_SIZE_PX }"
      >
        <template #option="slotProps">
          <div class="transaction-entry__field__option" :style="optionStyle">
            <img :src="slotProps.option.iconUrl" />
            <div>{{ slotProps.option.text }}</div>
          </div>
        </template></Select
      >
    </div>
    <div class="transaction-entry__field">
      <label for="amount">Amount</label>
      <InputNumber
        v-model="amount"
        inputId="amount"
        :min="MIN_AMOUNT"
        :max="999_999_999"
        :disabled="disabled"
        fluid
        :prefix="amountPrefix"
        showButtons
      />
    </div>
    <div class="transaction-entry__field">
      <label for="date">Date</label>
      <DatePicker
        v-model="date"
        inputId="date"
        showIcon
        showOnFocus
        :disabled="disabled"
      />
    </div>
    <div class="transaction-entry__footer">
      <Button
        label="Cancel"
        severity="secondary"
        @click="emit('cancel')"
      ></Button>
      <Button
        v-if="transactionToUpdate"
        label="Delete"
        severity="danger"
        :loading="removeInProgress"
        :disabled="disabled"
        @click="emit('remove')"
      ></Button>
      <Button
        label="Save"
        :loading="commitInProgress"
        :disabled="disabled"
        @click="commit"
      ></Button>
    </div>
  </div>
</template>

<style lang="scss">
.transaction-entry {
  display: flex;
  flex-direction: column;
  gap: var(--generic-spacing);
  align-items: center;

  &__field {
    display: flex;
    flex-direction: column;
    width: 100%;

    &__option {
      display: flex;
      gap: var(--generic-spacing);
      align-items: center;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
