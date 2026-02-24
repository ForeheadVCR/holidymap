import useSWR from "swr";

interface ActivityEntry {
  id: string;
  action: string;
  details: Record<string, unknown>;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useActivityLog(region: string) {
  const { data, error, isLoading, mutate } = useSWR<ActivityEntry[]>(
    `/api/activity?region=${region}&limit=50`,
    fetcher,
    { refreshInterval: 30000 } // Auto-refresh every 30s
  );

  return {
    logs: data,
    isLoading,
    error,
    mutate,
  };
}
