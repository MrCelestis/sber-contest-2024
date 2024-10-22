export default function useVisibleCategories() {
  const { categoryMetadataById } = useCategoryMetadata();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const appConfig = useAppConfig();

  const visibleCategoryDetails = computed(() => {
    console.log("> recalc visible cats");
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryDetails = new Map<string, CategoryDetails>();
    for (const transaction of transactions.value) {
      if (transaction.amount >= 0) {
        totalIncome += transaction.amount;
        continue;
      }
      totalExpenses += transaction.amount;
      let details = categoryDetails.get(transaction.category);
      if (!details) {
        const metadata = categoryMetadataById.value.get(
          transaction.category
        );
        details = {
          category: transaction.category,
          label: metadata?.text ?? "-",
          totalExpenses: 0,
          iconUrl: metadata?.iconUrl ?? "",
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
        i <= appConfig.maxCategoriesInFilter ? prev : prev + cur.totalExpenses,
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
            iconUrl: "",
            label: `Other (${remainderCategories.length})`,
          };
    return {
      categoryDetails: primaryCategories,
      remainder: remainderData,
      totalExpenses,
      totalIncome,
    };
  });
  return {
    visibleCategories: visibleCategoryDetails,
    loading: transactionsLoading,
  };
}

export interface CategoryDetails {
  category: string | null;
  label: string;
  totalExpenses: number;
  iconUrl: string;
}
