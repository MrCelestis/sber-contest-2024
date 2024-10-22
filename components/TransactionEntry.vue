<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";

const { transaction: transactionToUpdate } = defineProps<{
  transaction?: Transaction;
}>();
const emit = defineEmits(["cancel", "commit"]);

const { categoryMetadata } = useCategoryMetadata();

const TRANSACTION_TYPES = ["+", "-"] as const;
const transactionType = ref<(typeof TRANSACTION_TYPES)[number]>("-");
const transactionTypeOptions = [
  { value: "+", label: "Income" },
  { value: "-", label: "Expense" },
];

const MIN_AMOUNT = 0.01;
const amount = ref(MIN_AMOUNT);
const date = ref(new Date());
const category = ref<string>(categoryMetadata.value[0]?.id ?? "");

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
        id: uuidv4(),
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
        :disabled="transactionType === '+'"
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
        fluid
        :prefix="amountPrefix"
        showButtons
      />
    </div>
    <div class="transaction-entry__field">
      <label for="date">Date</label>
      <DatePicker v-model="date" inputId="date" showIcon showOnFocus />
    </div>
    <div class="transaction-entry__footer">
      <Button
        label="Cancel"
        severity="secondary"
        @click="emit('cancel')"
      ></Button>
      <Button
        label="Delete"
        severity="danger"
        v-if="transactionToUpdate"
      ></Button>
      <Button label="Save" @click="commit"></Button>
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
