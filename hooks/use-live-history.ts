"use client";

import { useQuery } from "@tanstack/react-query";
import { useMarketStatus } from "./use-market-status";
import type { OHLCVBar } from "@/lib/market/pipeline";

interface HistoryResponse {
  bars: OHLCVBar[];
  meta: {
    fetchedAt: number;
    ageMs: number;
    stale: boolean;
    source: string;
  } | null;
}

async function fetchHistory(ticker: string, range: string, interval: string): Promise<HistoryResponse> {
  const res = await fetch(`/api/market/history?ticker=${ticker}&range=${range}&interval=${interval}`);
  if (!res.ok) throw new Error(`history API error: ${res.status}`);
  return res.json();
}

/**
 * Fetches historical OHLCV data and refreshes it during market hours
 * (intraday charts update; daily charts update when the session closes).
 *
 * @param ticker    - B3 ticker symbol
 * @param range     - e.g. "1y", "6mo", "1mo"
 * @param interval  - e.g. "1d", "1h", "15m"
 */
export function useLiveHistory(
  ticker: string,
  range = "1y",
  interval = "1d",
  enabled = true
) {
  const marketStatus = useMarketStatus();

  // Intraday intervals need more frequent updates than daily
  const isIntraday = !["1d", "1wk", "1mo"].includes(interval);
  const pollInterval = isIntraday ? marketStatus.pollIntervalMs : Math.max(300_000, marketStatus.pollIntervalMs);

  return useQuery<HistoryResponse>({
    queryKey: ["live-history", ticker, range, interval],
    queryFn: () => fetchHistory(ticker, range, interval),
    enabled: enabled && !!ticker,
    refetchInterval: marketStatus.isOpen ? pollInterval : false, // only poll when market is open
    refetchIntervalInBackground: false,
    staleTime: pollInterval - 5_000,
  });
}
