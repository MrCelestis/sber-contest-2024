// this is a purely computed store, but it's shared and executes logic only once per update
export const useVisibleCategoriesStore = defineStore(
  'visibleCategories',
  () => {
    const { t } = useI18n();
    const categoryMetadataStore = useCategoryMetadataStore();
    const transactionsStore = useTransactionsStore();
    const appConfig = useAppConfig();

    const visibleCategoryDetails = computed(() => {
      let totalIncome = 0;
      let totalExpenses = 0;
      const categoryDetails = new Map<string, CategoryDetails>();
      for (const transaction of transactionsStore.transactions) {
        if (transaction.amount >= 0) {
          totalIncome += transaction.amount;
          continue;
        }
        totalExpenses += transaction.amount;
        let details = categoryDetails.get(transaction.category);
        if (!details) {
          const metadata = categoryMetadataStore.categoryMetadataById.get(
            transaction.category
          );
          details = {
            category: transaction.category,
            label: metadata?.text ?? '-',
            totalExpenses: 0,
            iconUrl: metadata?.iconUrl ?? ''
          };
          categoryDetails.set(transaction.category, details);
        }
        details.totalExpenses += transaction.amount;
      }
      const allCategories = [...categoryDetails.values()].sort(
        (a, b) => a.totalExpenses - b.totalExpenses
      );
      const remainder = allCategories.reduce(
        (prev, cur, i) =>
          i <= appConfig.maxCategoriesInFilter
            ? prev
            : prev + cur.totalExpenses,
        0
      );
      const primaryCategories = allCategories.slice(
        0,
        appConfig.maxCategoriesInFilter
      );
      const remainderCategories = allCategories.slice(
        appConfig.maxCategoriesInFilter
      );
      let remainderData =
        remainder === 0
          ? null
          : {
              category: null,
              totalExpenses: remainder,
              categories: new Set(remainderCategories.map((c) => c.category!)),
              iconUrl: '',
              label: `${t('transactions.categoryOther')} (${
                remainderCategories.length
              })`
            };
      return {
        categoryDetails: primaryCategories,
        remainder: remainderData,
        totalExpenses,
        totalIncome
      };
    });
    return {
      visibleCategories: visibleCategoryDetails,
      loading: computed(() => transactionsStore.loading),
      error: computed(() => transactionsStore.error)
    };
  }
);

export interface CategoryDetails {
  category: string | null;
  label: string;
  totalExpenses: number;
  iconUrl: string;
}
