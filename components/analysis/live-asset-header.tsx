"use client";

/**
 * Live-updating header for the asset detail page.
 * Replaces the static price/change values with polled live data.
 */

import { useLiveQuote } from "@/hooks/use-live-quotes";
import { LivePrice } from "@/components/market/live-price";
import { FreshnessBadge } from "@/components/market/freshness-badge";
import { MarketStatusBadge } from "@/components/market/market-status-badge";

interface LiveAssetHeaderProps {
  ticker: string;
  /** Server-rendered initial values (shown before first poll completes) */
  initialPrice: number;
  initialChange: number;
  initialChangePercent: number;
}

export function LiveAssetHeader({
  ticker,
  initialPrice,
  initialChange,
  initialChangePercent,
}: LiveAssetHeaderProps) {
  const { data: quote, isFetching } = useLiveQuote(ticker);

  const price = quote?.regularMarketPrice ?? initialPrice;
  const change = quote?.regularMarketChange ?? initialChange;
  const changePercent = quote?.regularMarketChangePercent ?? initialChangePercent;
  const meta = quote?._meta;

  return (
    <div className="space-y-1">
      <LivePrice
        price={price}
        change={change}
        changePercent={changePercent}
        size="lg"
      />

      <div className="flex items-center gap-2 flex-wrap">
        <MarketStatusBadge />
        {meta && (
          <FreshnessBadge
            fetchedAt={meta.fetchedAt}
            stale={meta.stale}
            source={meta.source}
          />
        )}
        {isFetching && !meta && (
          <span className="text-xs text-muted-foreground animate-pulse">Carregando…</span>
        )}
      </div>
    </div>
  );
}
