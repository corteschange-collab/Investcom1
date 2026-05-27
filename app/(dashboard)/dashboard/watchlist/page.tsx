"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, TrendingUp, TrendingDown, Trash2, Search } from "lucide-react";
import { useWatchlistStore } from "@/store/watchlist";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Quote {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
}

export default function WatchlistPage() {
  const { items, remove } = useWatchlistStore();
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
    setLoading(true);
    const tickers = items.map((i) => i.ticker).join(",");
    fetch(`/api/quotes?tickers=${tickers}`)
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, Quote> = {};
        for (const q of data.results ?? []) {
          map[q.symbol] = q;
        }
        setQuotes(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
          <Star size={32} />
        </div>
        <h1 className="text-xl font-bold">Sua watchlist está vazia</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Adicione ativos à watchlist a partir da página de análise de cada ativo.
        </p>
        <Link href="/dashboard/ativos">
          <Button className="mt-2 gap-2 bg-primary hover:bg-primary/90">
            <Search size={15} />
            Explorar ativos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Star size={22} className="text-primary" />
            Watchlist
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {items.length} {items.length === 1 ? "ativo monitorado" : "ativos monitorados"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Ativo</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Preço</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Variação</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Volume</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const q = quotes[item.ticker];
                const positive = q ? q.regularMarketChangePercent >= 0 : null;

                return (
                  <tr
                    key={item.ticker}
                    className="border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/dashboard/ativos/${item.ticker}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-[10px] font-bold font-mono shrink-0 group-hover:bg-primary/20 transition-colors">
                          {item.ticker.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-mono font-semibold group-hover:text-primary transition-colors">
                            {item.ticker}
                          </div>
                          {q?.shortName && (
                            <div className="text-xs text-muted-foreground">{q.shortName}</div>
                          )}
                        </div>
                      </Link>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {loading && !q ? (
                        <div className="h-4 w-16 rounded bg-muted animate-pulse ml-auto" />
                      ) : q ? (
                        <span className="font-mono-nums font-medium">
                          R$ {q.regularMarketPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {loading && !q ? (
                        <div className="h-4 w-14 rounded bg-muted animate-pulse ml-auto" />
                      ) : q ? (
                        <span
                          className={cn(
                            "flex items-center justify-end gap-1 font-mono-nums font-medium",
                            positive ? "text-market-green" : "text-market-red"
                          )}
                        >
                          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          {positive ? "+" : ""}
                          {q.regularMarketChangePercent.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {q ? (
                        <span className="text-xs text-muted-foreground font-mono-nums">
                          {(q.regularMarketVolume / 1_000_000).toFixed(1)}M
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => remove(item.ticker)}
                        className="text-muted-foreground hover:text-market-red transition-colors p-1 rounded"
                        aria-label={`Remover ${item.ticker}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Clique em um ativo para abrir a análise completa.
      </p>
    </div>
  );
}
