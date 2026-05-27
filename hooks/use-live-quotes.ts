"use client";

import { useQuery } from "@tanstack/react-query";
import { useMarketStatus } from "./use-market-status";
import type { FreshQuote } from "@/lib/market/pipeline";

interface QuotesResponse {
  results: FreshQuote[];
  marketStatus: {
    sessionType: string;
    isOpen: boolean;
    label: string;
    pollIntervalMs: number;
  };
  meta: {
    fetchedAt: number;
    oldestDataAgeMs: number;
    hasStaleData: boolean;
  };
}

async function fetchQuotes(tickers: string[]): Promise<QuotesResponse> {
  const res = await fetch(`/api/market/quotes?tickers=${tickers.join(",")}`);
  if (!res.ok) throw new Error(`quotes API error: ${res.status}`);
  return res.json();
}

/**
 * Live-polling hook for batch market quotes.
 *
 * - Polls at the rate recommended by the current market session
 * - Pauses automatically when the tab is hidden
 * - Exposed staleTime keeps UI snappy between polls
 *
 * @param tickers - Array of B3 tickers (e.g. ["PETR4", "VALE3"])
 * @param enabled - Set false to temporarily pause polling
 */
export function useLiveQuotes(tickers: string[], enabled = true) {
  const marketStatus = useMarketStatus();

  return useQuery<QuotesResponse>({
    queryKey: ["live-quotes", tickers.slice().sort().join(",")],
    queryFn: () => fetchQuotes(tickers),
    enabled: enabled && tickers.length > 0,
    refetchInterval: (query) => {
      // Stop polling if the last fetch failed — wait for manual retry
      if (query.state.status === "error") return false;
      return marketStatus.pollIntervalMs;
    },
    refetchIntervalInBackground: false, // don't poll when tab is hidden
    staleTime: marketStatus.pollIntervalMs - 5_000,
  });
}

/**
 * Hook for a single ticker's live quote.
 */
export function useLiveQuote(ticker: string, enabled = true) {
  const { data, ...rest } = useLiveQuotes([ticker], enabled && !!ticker);
  const quote = data?.results.find((r) => r.symbol === ticker) ?? null;
  return { data: quote, response: data, ...rest };
}
