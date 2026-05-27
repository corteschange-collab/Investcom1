import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { fetchQuotesPipeline } from "@/lib/market/pipeline";
import { ETFS } from "@/lib/assets/catalog";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ETFs" };

export default async function EtfsPage() {
  const tickers = ETFS.map((e) => e.ticker);
  const { results } = await fetchQuotesPipeline(tickers).catch(() => ({ results: [] }));
  const priceMap = Object.fromEntries(results.map((r) => [r.symbol, r]));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">ETFs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fundos de índice negociados em bolsa. Diversificação automática com custo mínimo.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="divide-y divide-border/50">
          {ETFS.map((entry) => {
            const q = priceMap[entry.ticker];
            const positive = q ? q.regularMarketChangePercent >= 0 : null;
            return (
              <Link key={entry.ticker} href={`/dashboard/ativos/${entry.ticker}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30">
                <div className="w-16 shrink-0">
                  <span className="font-mono text-sm font-bold">{entry.ticker}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{q?.shortName ?? entry.name}</p>
                </div>
                {q ? (
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm">R$ {q.regularMarketPrice.toFixed(2)}</span>
                    <span className={cn("flex items-center gap-0.5 text-xs font-medium",
                      positive ? "text-market-green" : "text-market-red")}>
                      {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {Math.abs(q.regularMarketChangePercent).toFixed(2)}%
                    </span>
                  </div>
                ) : <span className="text-xs text-muted-foreground">—</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
