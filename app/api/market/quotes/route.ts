/**
 * GET /api/market/quotes?tickers=PETR4,VALE3,ITUB4
 *
 * Returns real-time (or near-real-time) quotes from the pipeline with
 * proper Cache-Control headers and freshness metadata.
 *
 * Response:
 *   { results: FreshQuote[], marketStatus: MarketStatus, rateLimitStats }
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchQuotesPipeline } from "@/lib/market/pipeline";
import { getMarketStatus } from "@/lib/market/market-hours";

export const dynamic = "force-dynamic"; // never statically cache this route

const MAX_TICKERS = 30;

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("tickers") ?? "";
  if (!raw.trim()) {
    return NextResponse.json({ error: "Missing tickers param" }, { status: 400 });
  }

  const tickers = raw
    .split(",")
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, MAX_TICKERS);

  const marketStatus = getMarketStatus();
  const { results, rateLimitStats } = await fetchQuotesPipeline(tickers);

  // Determine overall staleness: stale if any result is stale
  const hasStale = results.some((r) => r._meta.stale);
  const oldestFetchMs = results.length
    ? Math.max(...results.map((r) => r._meta.ageMs))
    : 0;

  // Cache-Control: allow CDN/browser to cache for the poll interval
  const cacheMaxAge = Math.floor(marketStatus.pollIntervalMs / 1000) - 5;
  const headers = new Headers({
    "Cache-Control": `public, s-maxage=${Math.max(5, cacheMaxAge)}, stale-while-revalidate=60`,
    "X-Market-Status": marketStatus.sessionType,
    "X-Data-Stale": hasStale ? "true" : "false",
    "X-Rate-Limit-Remaining": String(rateLimitStats.remaining),
  });

  return NextResponse.json(
    {
      results,
      marketStatus: {
        sessionType: marketStatus.sessionType,
        isOpen: marketStatus.isOpen,
        label: marketStatus.label,
        pollIntervalMs: marketStatus.pollIntervalMs,
      },
      meta: {
        fetchedAt: Date.now(),
        oldestDataAgeMs: oldestFetchMs,
        hasStaleData: hasStale,
        rateLimitStats,
      },
    },
    { headers }
  );
}
