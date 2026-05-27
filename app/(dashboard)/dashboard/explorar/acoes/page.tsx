import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { fetchQuotesPipeline } from "@/lib/market/pipeline";
import { ACOES_BLUE_CHIPS, ACOES_DIVIDENDOS, ACOES_GROWTH, ACOES_SMALL_CAPS } from "@/lib/assets/catalog";
import { SECTORS } from "@/lib/assets/taxonomy";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ações" };

const SECTIONS = [
  { label: "Blue Chips", entries: ACOES_BLUE_CHIPS.slice(0, 8) },
  { label: "Dividendos", entries: ACOES_DIVIDENDOS.slice(0, 8) },
  { label: "Crescimento", entries: ACOES_GROWTH.slice(0, 8) },
  { label: "Small & Mid Caps", entries: ACOES_SMALL_CAPS.slice(0, 8) },
];

export default async function AcoesPage() {
  const allTickers = SECTIONS.flatMap((s) => s.entries.map((e) => e.ticker));
  const unique = [...new Set(allTickers)];

  const { results } = await fetchQuotesPipeline(unique).catch(() => ({ results: [] }));
  const priceMap = Object.fromEntries(results.map((r) => [r.symbol, r]));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">Ações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Empresas listadas na B3. Renda variável com potencial de valorização.
        </p>
      </div>

      {/* Sectors quick nav */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Por setor
        </p>
        <div className="flex flex-wrap gap-2">
          {SECTORS.map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/explorar/acoes/setor/${s.id}`}
              className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-card px-3 py-1.5 text-xs font-medium transition-all hover:border-border"
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Asset sections */}
      {SECTIONS.map(({ label, entries }) => (
        <div key={label}>
          <p className="text-sm font-semibold mb-3">{label}</p>
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
                          {positive
                            ? <ArrowUpRight size={12} />
                            : <ArrowDownRight size={12} />
                          }
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
