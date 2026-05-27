import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { fetchQuotesPipeline } from "@/lib/market/pipeline";
import { BDRS } from "@/lib/assets/catalog";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "BDRs" };

export default async function BdrsPage() {
  const tickers = BDRS.map((b) => b.ticker);
  const { results } = await fetchQuotesPipeline(tickers).catch(() => ({ results: [] }));
  const priceMap = Object.fromEntries(results.map((r) => [r.symbol, r]));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">BDRs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Brazilian Depositary Receipts. Exposição a empresas internacionais negociadas na B3.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="divide-y divide-border/50">
          {BDRS.map((entry) => {
            const q = priceMap[entry.ticker];
            const positive = q ? q.regularMarketChangePercent >= 0 : null;
            return (
              <Link key={entry.ticker} href={"/dashboard/ativos/" + entry.ticker}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30">
                <div className="w-16 shrink-0">
                  <span className="font-mono text-sm font-bold">{entry.ticker}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{entry.name}</p>
                  {entry.yahooTicker && (
                    <p className="text-xs text-muted-foreground">{entry.yahooTicker}</p>
                  )}
                </div>
                {q ? (
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm">R$ {q.regularMarketPrice.toFixed(2)}</span>
                    <span className={cn("text-xs font-medium",
                      positive ? "text-market-green" : "text-market-red")}>
                      {positive ? "+" : ""}{q.regularMarketChangePercent.toFixed(2)}%
                    </span>
                  </div>
                ) : <span className="text-xs text-muted-foreground">—</span>}
              </Link>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Preços em BRL. Ativo subjacente negociado em dólar — variação inclui câmbio.
      </p>
    </div>
  );
}
