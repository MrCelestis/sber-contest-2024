import { useQuery } from "@tanstack/vue-query";

export const useCategoryMetadata = () => {
  const runtimeConfig = useRuntimeConfig();
  useQuery;
  const { data, status, suspense } = useQuery({
    staleTime: Number.POSITIVE_INFINITY, //infinite cache
    queryKey: ["categoryMetadata"],
    queryFn: async () => {
      const url =
        `${runtimeConfig.public.apiBase}/category-metadata?` +
        new URLSearchParams({
          _sort: "text",
        }).toString();
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = (await response.json()) as CategoryMetadata[];
      return res;
    },
  });
  onServerPrefetch(suspense);
  const categoryMetadata = computed(
    () => (data.value ?? []) as CategoryMetadata[]
  );
  const categoryMetadataById = computed(() => {
    const result = new Map<string, CategoryMetadata>();
    for (const category of categoryMetadata.value) {
      result.set(category.id, category);
    }
    return result;
  });
  return {
    categoryMetadata,
    categoryMetadataById,
    loading: computed(() => status.value === "pending"),
  };
};

export interface CategoryMetadata {
  id: string;
  text: string;
  iconUrl: string;
}
