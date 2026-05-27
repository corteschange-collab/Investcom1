"use client";

/**
 * Client component that owns the live-updating parts of the dashboard.
 * The Server Component renders the page shell and trending data (SSR);
 * this component hydrates and starts polling immediately after.
 */

import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useLiveQuotes } from "@/hooks/use-live-quotes";
import { useLiveIndices } from "@/hooks/use-live-indices";
import { LiveIndicesBar } from "@/components/market/live-indices-bar";
import { MarketStatusBadge } from "@/components/market/market-status-badge";
import { FreshnessRow } from "@/components/market/freshness-badge";
import { MarketCard } from "@/components/dashboard/market-card";
import { Skeleton } from "@/components/ui/skeleton";

const TRENDING_TICKERS = [
  "PETR4", "VALE3", "ITUB4", "BBDC4", "MGLU3",
  "WEGE3", "BBAS3", "ABEV3", "RENT3", "GGBR4",
];

interface LiveDashboardProps {
  /** Server-rendered initial quotes (avoids blank flash) */
  initialQuotes: {
    symbol: string;
    shortName: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketVolume: number;
  }[];
}

export function LiveDashboard({ initialQuotes }: LiveDashboardProps) {
  const { data: quotesData, isFetching } = useLiveQuotes(TRENDING_TICKERS);
  const { data: indicesData } = useLiveIndices();

  const quotes = quotesData?.results ?? initialQuotes;
  const meta = quotesData?.results?.[0]?._meta;

  const gainers = [...quotes]
    .sort((a, b) => b.regularMarketChangePercent - a.regularMarketChangePercent)
    .slice(0, 3);
  const losers = [...quotes]
    .sort((a, b) => a.regularMarketChangePercent - b.regularMarketChangePercent)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Market status + freshness header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <MarketStatusBadge showTime />
        {meta && (
          <FreshnessRow
            fetchedAt={meta.fetchedAt}
            stale={meta.stale}
            source={meta.source}
          />
        )}
      </div>

      {/* Live indices bar */}
      <LiveIndicesBar
        initialData={indicesData?.indices ?? []}
      />

      {/* Live trending ativos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">Ativos em destaque</h2>
            {isFetching && (
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </div>
          <Link href="/dashboard/ativos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Ver todos →
          </Link>
        </div>

        {!quotes.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {quotes.slice(0, 10).map((q) => (
              <Link key={q.symbol} href={`/dashboard/ativos/${q.symbol}`}>
                <MarketCard
                  ticker={q.symbol}
                  name={q.shortName}
                  price={q.regularMarketPrice}
                  change={q.regularMarketChange}
                  changePercent={q.regularMarketChangePercent}
                  volume={q.regularMarketVolume}
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Gainers & Losers — live */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-card p-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <TrendingUp size={15} className="text-market-green" />
            Maiores altas
          </h3>
          <div className="space-y-2">
            {gainers.map((q) => (
              <Link
                key={q.symbol}
                href={`/dashboard/ativos/${q.symbol}`}
                className="flex items-center justify-between py-2 border-b border-border/30 last:border-0 hover:opacity-80 transition-opacity"
              >
                <div>
                  <span className="font-mono text-sm font-semibold">{q.symbol}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{q.shortName}</span>
                </div>
                <span className="text-sm font-medium text-market-green font-mono-nums">
                  +{q.regularMarketChangePercent.toFixed(2)}%
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <TrendingDown size={15} className="text-market-red" />
            Maiores baixas
          </h3>
          <div className="space-y-2">
            {losers.map((q) => (
              <Link
                key={q.symbol}
                href={`/dashboard/ativos/${q.symbol}`}
                className="flex items-center justify-between py-2 border-b border-border/30 last:border-0 hover:opacity-80 transition-opacity"
              >
                <div>
                  <span className="font-mono text-sm font-semibold">{q.symbol}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{q.shortName}</span>
                </div>
                <span className="text-sm font-medium text-market-red font-mono-nums">
                  {q.regularMarketChangePercent.toFixed(2)}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
