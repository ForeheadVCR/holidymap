import useSWR from "swr";
import { CategoryData } from "@/types/pin";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCategories() {
  const { data, error, isLoading } = useSWR<CategoryData[]>(
    "/api/categories",
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    categories: data,
    isLoading,
    isError: error,
  };
}
