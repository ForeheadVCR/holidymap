import useSWR from "swr";
import { PinData } from "@/types/pin";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function usePins(region: string, search?: string) {
  const params = new URLSearchParams({ region });
  if (search) params.set("search", search);

  const { data, error, isLoading, mutate } = useSWR<PinData[]>(
    `/api/pins?${params.toString()}`,
    fetcher,
    { refreshInterval: 30000 }
  );

  return {
    pins: data,
    isLoading,
    isError: error,
    mutate,
  };
}
