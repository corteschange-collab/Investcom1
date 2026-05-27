/**
 * GET /api/market/status
 *
 * Health endpoint exposing:
 *   - Market hours status
 *   - Cache stats (size, stale entries)
 *   - Rate limiter stats per API
 *   - Recent monitor events (last 10)
 *   - Server uptime
 *
 * Used by: monitoring dashboards, internal debugging, the FreshnessBadge.
 * Not sensitive — no API keys or PII exposed.
 */

import { NextResponse } from "next/server";
import { getMarketStatus } from "@/lib/market/market-hours";
import { marketCache } from "@/lib/market/cache";
import { brapiLimiter, yahooLimiter, bcbLimiter } from "@/lib/market/rate-limiter";
import { monitor } from "@/lib/market/monitor";

export const dynamic = "force-dynamic";

const startedAt = Date.now();

export async function GET() {
  const marketStatus = getMarketStatus();
  const cacheStats = marketCache.stats();
  const monitorSummary = monitor.summary();

  const staleCount = cacheStats.entries.filter((e) => e.stale).length;

  return NextResponse.json({
    ok: true,
    timestamp: Date.now(),
    uptimeMs: Date.now() - startedAt,
    market: {
      sessionType: marketStatus.sessionType,
      isOpen: marketStatus.isOpen,
      label: marketStatus.label,
      brtTime: marketStatus.brtTime,
      pollIntervalMs: marketStatus.pollIntervalMs,
    },
    cache: {
      totalEntries: cacheStats.size,
      staleEntries: staleCount,
      freshEntries: cacheStats.size - staleCount,
    },
    rateLimits: {
      brapi: brapiLimiter.stats(),
      yahoo: yahooLimiter.stats(),
      bcb: bcbLimiter.stats(),
    },
    monitor: monitorSummary,
  });
}
