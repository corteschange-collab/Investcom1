/**
 * Dashboard page — Server Component (SSR).
 *
 * Strategy:
 *  1. Server fetches initial data on first request (fast first paint, no blank flash)
 *  2. Hands data down to <LiveDashboard> which immediately starts client-side polling
 *  3. Polling adapts to market session (30 s open, 5 min closed)
 *  4. All data tagged with source and fetchedAt for the freshness badge
 */

import { Zap, Star } from "lucide-react";
import Link from "next/link";
import { fetchMarketTrending } from "@/lib/api/brapi";
import { LiveDashboard } from "@/components/dashboard/live-dashboard";
import { StreakWidget } from "@/components/dashboard/streak-widget";
import { Button } from "@/components/ui/button";
import type { BrapiQuote } from "@/lib/api/brapi";

// Static fallback — used only when the API is completely unavailable.
// Prices are NOT shown as real — LiveDashboard will replace them after hydration.
const FALLBACK: BrapiQuote[] = [
  { symbol: "PETR4", shortName: "Petrobras PN", longName: "Petróleo Brasileiro S.A.", currency: "BRL", regularMarketPrice: 0, regularMarketChangePercent: 0, regularMarketChange: 0, regularMarketVolume: 0, marketCap: null, logourl: null, sector: "Energia" },
  { symbol: "VALE3", shortName: "Vale ON", longName: "Vale S.A.", currency: "BRL", regularMarketPrice: 0, regularMarketChangePercent: 0, regularMarketChange: 0, regularMarketVolume: 0, marketCap: null, logourl: null, sector: "Mineração" },
  { symbol: "ITUB4", shortName: "Itaú Unibanco PN", longName: "Itaú Unibanco Holding S.A.", currency: "BRL", regularMarketPrice: 0, regularMarketChangePercent: 0, regularMarketChange: 0, regularMarketVolume: 0, marketCap: null, logourl: null, sector: "Financeiro" },
];

export default async function DashboardPage() {
  // Server-side initial fetch — populates React Query cache on first render
  const quotes = await fetchMarketTrending().catch(() => FALLBACK);
  const initialQuotes = (quotes.length > 0 ? quotes : FALLBACK).map((q) => ({
    symbol: q.symbol,
    shortName: q.shortName,
    regularMarketPrice: q.regularMarketPrice,
    regularMarketChange: q.regularMarketChange,
    regularMarketChangePercent: q.regularMarketChangePercent,
    regularMarketVolume: q.regularMarketVolume,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visão geral do mercado brasileiro
          </p>
        </div>
        <StreakWidget />
      </div>

      {/* Live section — client component handles all polling from here */}
      <LiveDashboard initialQuotes={initialQuotes} />

      {/* Premium CTA — static, no polling needed */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-primary" />
            <span className="text-sm font-semibold">Desbloqueie a análise completa</span>
          </div>
          <p className="text-xs text-muted-foreground">
            IA assistente, indicadores avançados, alertas ilimitados e muito mais com o Premium.
          </p>
        </div>
        <Link href="/sign-up?plan=premium" className="shrink-0">
          <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
            <Star size={14} />
            Ver Premium
          </Button>
        </Link>
      </div>
    </div>
  );
}
