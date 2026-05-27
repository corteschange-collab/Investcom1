/**
 * GET /api/market/indices
 *
 * Returns a compact snapshot of key Brazilian market indices:
 *   IBOVESPA, USD/BRL, SELIC (from BCB API).
 *
 * Refresh: 60 s during market hours, 5 min otherwise.
 * Used by the dashboard header quick-stats bar.
 */

import { NextResponse } from "next/server";
import { fetchIndicesPipeline } from "@/lib/market/pipeline";
import { getMarketStatus } from "@/lib/market/market-hours";

export const dynamic = "force-dynamic";

export async function GET() {
  const marketStatus = getMarketStatus();
  const { indices, selic, meta } = await fetchIndicesPipeline();

  // Build the final formatted payload the dashboard expects
  const payload = [
    ...indices.map((idx) => ({
      symbol: idx.symbol,
      name: idx.name,
      value: idx.value,
      change: idx.change,
      changePercent: idx.changePercent,
    })),
    ...(selic !== null
      ? [
          {
            symbol: "SELIC",
            name: "SELIC",
            value: selic,
            change: 0,
            changePercent: 0,
          },
        ]
      : []),
  ];

  const cacheMaxAge = Math.floor(marketStatus.pollIntervalMs / 1000) - 5;
  const headers = new Headers({
    "Cache-Control": `public, s-maxage=${Math.max(10, cacheMaxAge)}, stale-while-revalidate=120`,
    "X-Market-Status": marketStatus.sessionType,
    "X-Data-Stale": meta.stale ? "true" : "false",
  });

  return NextResponse.json(
    {
      indices: payload,
      selic,
      marketStatus: {
        sessionType: marketStatus.sessionType,
        isOpen: marketStatus.isOpen,
        label: marketStatus.label,
        brtTime: marketStatus.brtTime,
        pollIntervalMs: marketStatus.pollIntervalMs,
      },
      meta,
    },
    { headers }
  );
}
