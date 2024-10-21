<script setup lang="ts">
import { useTransactionDateFilterStore } from "~/stores/transaction-date-filter";

const transactionDateFilterStore = useTransactionDateFilterStore();
const dialogVisible = ref(false);
// customIntervalLocal is used because datepicker works with local date,
// value is converted back to UTC when applied
const dateRange = ref<[Date, Date] | null>(
  transactionDateFilterStore.customIntervalLocal
);

interface FilterButtonState {
  label: string;
  severity: string;
  command: () => void;
}

const modeButtonStates = computed<FilterButtonState[]>(() => [
  {
    label:
      transactionDateFilterStore.mode === "month"
        ? formatUtcMonth(
            transactionDateFilterStore.effectiveUtcInterval?.[0] ?? 0
          )
        : "Month",
    severity: getModeButtonSeverity(
      transactionDateFilterStore.mode === "month"
    ),
    command: () => transactionDateFilterStore.select("month"),
  },
  {
    label:
      transactionDateFilterStore.mode === "year"
        ? String(
            transactionDateFilterStore.effectiveUtcInterval?.[0]?.getUTCFullYear()
          )
        : "Year",
    severity: getModeButtonSeverity(transactionDateFilterStore.mode === "year"),
    command: () => transactionDateFilterStore.select("year"),
  },
  {
    label:
      transactionDateFilterStore.mode === "custom"
        ? formatUtcDateRange(transactionDateFilterStore.customInterval)
        : "Custom",
    severity: getModeButtonSeverity(
      transactionDateFilterStore.mode === "custom"
    ),
    command: () => (dialogVisible.value = true),
  },
]);

function getModeButtonSeverity(selected: boolean) {
  return selected ? "primary" : "secondary";
}

function confirmDateRange() {
  dialogVisible.value = false;
  if (dateRange.value) {
    transactionDateFilterStore.select(
      "custom",
      dateRange.value,
      false /* convert back to UTC */
    );
  }
}

function dismissDateRange() {
  dialogVisible.value = false;
}
</script>

<template>
  <div class="transaction-date-filter">
    <Button
      icon="pi pi-angle-left"
      severity="secondary"
      :disabled="transactionDateFilterStore.mode === 'custom'"
      @click="transactionDateFilterStore.selectAdjacentInterval(-1)"
    >
    </Button>
    <ButtonGroup>
      <Button
        v-for="buttonState of modeButtonStates"
        :severity="buttonState.severity"
        @click="buttonState.command"
      >
        <span class="transaction-date-filter__mode-button__text">{{
          buttonState.label
        }}</span>
      </Button>
    </ButtonGroup>
    <Button
      icon="pi pi-angle-right"
      severity="secondary"
      :disabled="transactionDateFilterStore.mode === 'custom'"
      @click="transactionDateFilterStore.selectAdjacentInterval(1)"
    >
    </Button>
  </div>
  <Dialog v-model:visible="dialogVisible" modal header="Date range">
    <div>
      <DatePicker v-model="dateRange" selectionMode="range" inline />
    </div>
    <div class="transaction-date-filter__dialog__footer">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="dismissDateRange"
      ></Button>
      <Button type="button" label="Save" @click="confirmDateRange"></Button>
    </div>
  </Dialog>
</template>

<style>
.transaction-date-filter {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}
.transaction-date-filter__dialog__footer {
  margin-top: var(--generic-spacing);
  display: flex;
  gap: var(--generic-spacing);
  justify-content: flex-end;
}
.transaction-date-filter__mode-button__text {
  text-transform: capitalize;
}
</style>
