import { defineStore } from "pinia";
import { useCategoryMetadataStore } from "./category-metadata";
import { useTransactionsStore } from "./transactions";

export const useVisibleCategoryStore = defineStore(
  "visibleCategoryStore",
  () => {
    const categoryMetadataStore = useCategoryMetadataStore();
    const transactionStore = useTransactionsStore();
    const appConfig = useAppConfig();

    const visibleCategoryDetails = computed(() => {
      const categoryDetails = new Map<string, CategoryDetails>();
      for (const transaction of transactionStore.transactions) {
        if (transaction.amount >= 0) {
          continue;
        }
        let details = categoryDetails.get(transaction.category);
        if (!details) {
          const metadata = categoryMetadataStore.categoryById.get(
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
      const clampedCategories = allCategories.slice(0, appConfig.maxCategoriesInFilter);
      if (remainder !== 0) {
        clampedCategories.push({
          category: "n/a", //TODO
          label: "Other",//TODO
          totalExpenses: remainder,
          badge: String(allCategories.length - appConfig.maxCategoriesInFilter),
          iconUrl: "",
        });
      }
      return clampedCategories;
    });
    return { visibleCategoryDetails };
  }
);

export interface CategoryDetails {
  category: string;
  label: string;
  totalExpenses: number;
  iconUrl: string;
  badge?: string;
}
