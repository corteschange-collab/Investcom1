"use client";

import { useQuery } from "@tanstack/react-query";
import { getMarketStatus } from "@/lib/market/market-hours";

export interface LiveMarketStatus {
  sessionType: "pre" | "regular" | "after" | "closed";
  isOpen: boolean;
  label: string;
  pollIntervalMs: number;
  brtTime: string;
}

/** Returns a reactive market status that re-evaluates every minute. */
export function useMarketStatus(): LiveMarketStatus {
  const { data } = useQuery<LiveMarketStatus>({
    queryKey: ["market-status"],
    queryFn: () => {
      // Pure computation — no network call needed.
      // Placed inside queryFn so React Query controls re-evaluation timing.
      const s = getMarketStatus();
      return {
        sessionType: s.sessionType,
        isOpen: s.isOpen,
        label: s.label,
        pollIntervalMs: s.pollIntervalMs,
        brtTime: s.brtTime,
      };
    },
    refetchInterval: 60_000, // re-evaluate every minute to detect session transitions
    staleTime: 55_000,
  });

  return (
    data ?? {
      sessionType: "closed",
      isOpen: false,
      label: "Mercado fechado",
      pollIntervalMs: 300_000,
      brtTime: "--:--",
    }
  );
}
