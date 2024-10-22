<script setup lang="ts">
const transactionDateFilterStore = useTransactionDateFilterStore();
const dialogVisible = ref(false);
// customIntervalLocal is used because datepicker works with local date,
// value is converted back to UTC when applied
const dateRange = ref<[Date, Date] | null>(
  transactionDateFilterStore.customIntervalLocal
);

const mode = computed(() => transactionDateFilterStore.mode);
const effectiveUtcInterval = computed(
  () => transactionDateFilterStore.effectiveUtcInterval
);
const customInterval = computed(
  () => transactionDateFilterStore.customInterval
);

interface FilterButtonState {
  label: string;
  severity: string;
  command: () => void;
}

const modeButtonStates = computed<FilterButtonState[]>(() => [
  {
    label:
      mode.value === "month"
        ? formatUtcMonth(effectiveUtcInterval.value?.[0] ?? 0)
        : "Month",
    severity: getModeButtonSeverity(mode.value === "month"),
    command: () => transactionDateFilterStore.select("month"),
  },
  {
    label:
      mode.value === "year"
        ? String(effectiveUtcInterval.value?.[0]?.getUTCFullYear())
        : "Year",
    severity: getModeButtonSeverity(mode.value === "year"),
    command: () => transactionDateFilterStore.select("year"),
  },
  {
    label:
      mode.value === "custom"
        ? formatUtcDateRange(customInterval.value)
        : "Custom",
    severity: getModeButtonSeverity(mode.value === "custom"),
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
      :disabled="mode === 'custom'"
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
      :disabled="mode === 'custom'"
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

<style lang="scss">
.transaction-date-filter {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;

  &__dialog__footer {
    margin-top: var(--generic-spacing);
    display: flex;
    gap: var(--generic-spacing);
    justify-content: flex-end;
  }

  &__mode-button__text {
    text-transform: capitalize;
  }
}

@media (max-width: 370px) {
    .transaction-date-filter .p-button {
        $padding: 3px;
        padding-left: $padding;
        padding-right: $padding;
    }
}
</style>
