import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { fetchQuotesPipeline } from "@/lib/market/pipeline";
import { FIIS } from "@/lib/assets/catalog";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FIIs" };

const TYPE_LABELS: Record<string, string> = {
  "fii-papel": "Papel (CRI/CRA)",
  "fii-logistica": "Logística",
  "fii-lajes": "Lajes Corporativas",
  "fii-shopping": "Shopping",
  "fii-fof": "FOF (Fundo de Fundos)",
};

export default async function FiisPage() {
  const tickers = FIIS.map((f) => f.ticker);
  const { results } = await fetchQuotesPipeline(tickers).catch(() => ({ results: [] }));
  const priceMap = Object.fromEntries(results.map((r) => [r.symbol, r]));

  const byType = FIIS.reduce<Record<string, typeof FIIS>>((acc, fii) => {
    const key = fii.subclass;
    if (!acc[key]) acc[key] = [];
    acc[key].push(fii);
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">Fundos de Investimento Imobiliário</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Renda passiva mensal via imóveis. Distribuição obrigatória de 95% do lucro.
        </p>
      </div>

      {/* Quick tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <Link
            key={key}
            href={`/dashboard/explorar/fiis/${key.replace("fii-", "")}`}
            className="rounded-xl border border-border/50 bg-card px-3 py-1.5 text-xs font-medium transition-all hover:border-border"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Asset list by type */}
      {Object.entries(byType).map(([type, entries]) => (
        <div key={type}>
          <p className="text-sm font-semibold mb-3">{TYPE_LABELS[type] ?? type}</p>
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="divide-y divide-border/50">
              {entries.map((entry) => {
                const q = priceMap[entry.ticker];
                const positive = q ? q.regularMarketChangePercent >= 0 : null;
                return (
                  <Link
                    key={entry.ticker}
                    href={`/dashboard/ativos/${entry.ticker}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="w-16 shrink-0">
                      <span className="font-mono text-sm font-bold">{entry.ticker}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{q?.shortName ?? entry.name}</p>
                    </div>
                    {q ? (
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-sm">
                          R$ {q.regularMarketPrice.toFixed(2)}
                        </span>
                        <span className={cn(
                          "flex items-center gap-0.5 text-xs font-medium",
                          positive ? "text-market-green" : "text-market-red"
                        )}>
                          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {Math.abs(q.regularMarketChangePercent).toFixed(2)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
