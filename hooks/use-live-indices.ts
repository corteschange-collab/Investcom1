"use client";

import { useQuery } from "@tanstack/react-query";
import { useMarketStatus } from "./use-market-status";

export interface IndexSnapshot {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

interface IndicesResponse {
  indices: IndexSnapshot[];
  selic: number | null;
  marketStatus: {
    sessionType: string;
    isOpen: boolean;
    label: string;
    brtTime: string;
    pollIntervalMs: number;
  };
  meta: {
    fetchedAt: number;
    ageMs: number;
    stale: boolean;
    source: string;
  };
}

async function fetchIndices(): Promise<IndicesResponse> {
  const res = await fetch("/api/market/indices");
  if (!res.ok) throw new Error(`indices API error: ${res.status}`);
  return res.json();
}

/** Live-polling hook for market indices (IBOVESPA, USD/BRL, SELIC). */
export function useLiveIndices(enabled = true) {
  const marketStatus = useMarketStatus();

  return useQuery<IndicesResponse>({
    queryKey: ["live-indices"],
    queryFn: fetchIndices,
    enabled,
    refetchInterval: marketStatus.pollIntervalMs,
    refetchIntervalInBackground: false,
    staleTime: marketStatus.pollIntervalMs - 5_000,
  });
}
