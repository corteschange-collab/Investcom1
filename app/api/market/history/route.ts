/**
 * GET /api/market/history?ticker=PETR4&range=1y&interval=1d
 *
 * Returns OHLCV bars with caching tuned to data volatility:
 *   - Daily bars (1d/1wk): 5 min refresh during market hours
 *   - Intraday (5m/15m):   1 min refresh during market hours
 *   - Closed market:       1 h (data won't change)
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchHistoryPipeline } from "@/lib/market/pipeline";
import { getMarketStatus, getDataTTLs } from "@/lib/market/market-hours";

export const dynamic = "force-dynamic";

const VALID_RANGES = new Set(["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y"]);
const VALID_INTERVALS = new Set(["5m", "15m", "30m", "1h", "1d", "1wk", "1mo"]);

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get("ticker")?.toUpperCase();
  const range = req.nextUrl.searchParams.get("range") ?? "1y";
  const interval = req.nextUrl.searchParams.get("interval") ?? "1d";

  if (!ticker) {
    return NextResponse.json({ error: "Missing ticker param" }, { status: 400 });
  }
  if (!VALID_RANGES.has(range) || !VALID_INTERVALS.has(interval)) {
    return NextResponse.json({ error: "Invalid range or interval" }, { status: 400 });
  }

  const { sessionType } = getMarketStatus();
  const ttls = getDataTTLs(sessionType);
  const ttl = interval === "1d" || interval === "1wk" ? ttls.historyDaily : ttls.historyIntraday;

  const result = await fetchHistoryPipeline(ticker, range, interval);

  if (!result) {
    return NextResponse.json(
      { error: `No historical data for ${ticker}`, bars: [], meta: null },
      { status: 200 } // 200 so client doesn't throw, just shows empty chart
    );
  }

  const cacheMaxAge = Math.floor(ttl / 1000) - 5;
  const headers = new Headers({
    "Cache-Control": `public, s-maxage=${Math.max(30, cacheMaxAge)}, stale-while-revalidate=120`,
    "X-Data-Stale": result.meta.stale ? "true" : "false",
  });

  return NextResponse.json({ bars: result.bars, meta: result.meta }, { headers });
}
