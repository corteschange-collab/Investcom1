"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

// Shared QueryClient config optimized for market data:
//   - staleTime: 25 s (data is "fresh" for 25 s before React Query re-fetches)
//   - gcTime: 5 min (keep cached data in memory for 5 min after component unmounts)
//   - retry: 1 (retry once on network error, not more — avoid hammering APIs)
//   - refetchOnWindowFocus: true (re-fetch when tab regains focus)

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 25_000,
        gcTime: 5 * 60_000,
        retry: 1,
        retryDelay: 3_000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new client (no singleton — each request is isolated)
    return makeQueryClient();
  }
  // Browser: singleton so data persists across navigations
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  // useState ensures the client is created only once per component mount
  const [queryClient] = useState(getQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
