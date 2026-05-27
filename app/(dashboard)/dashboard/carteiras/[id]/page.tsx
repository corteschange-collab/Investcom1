import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { THEMATIC_PORTFOLIOS } from "@/lib/assets/recommendation";
import { riskLabel, riskColor, horizonLabel } from "@/lib/assets/taxonomy";
import { fetchQuotesPipeline } from "@/lib/market/pipeline";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return THEMATIC_PORTFOLIOS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const portfolio = THEMATIC_PORTFOLIOS.find((p) => p.id === id);
  return { title: portfolio?.name ?? "Carteira" };
}

const PORTFOLIO_ICONS: Record<string, string> = {
  dividendos: "💰",
  crescimento: "🚀",
  protecao: "🔒",
  balanceada: "⚖️",
  "longo-prazo": "🏔️",
  renda: "🏠",
};

export default async function CarteiraDePage({ params }: Props) {
  const { id } = await params;
  const portfolio = THEMATIC_PORTFOLIOS.find((p) => p.id === id);
  if (!portfolio) notFound();

  // Fetch live prices for B3 tickers only
  const b3Tickers = portfolio.assets
    .filter((a) => !a.ticker.includes("-") && !a.ticker.includes("=") && !a.ticker.includes("/"))
    .map((a) => a.ticker);

  const { results } = b3Tickers.length > 0
    ? await fetchQuotesPipeline(b3Tickers).catch(() => ({ results: [] }))
    : { results: [] };

  const priceMap = Object.fromEntries(results.map((r) => [r.symbol, r]));

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/dashboard/carteiras"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft size={14} />
        Carteiras
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
          {PORTFOLIO_ICONS[portfolio.id] ?? "📊"}
        </div>
        <div>
          <h1 className="text-xl font-bold">{portfolio.name}</h1>
          <p className="text-sm text-muted-foreground mt-1 italic">&ldquo;{portfolio.tagline}&rdquo;</p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className={cn("font-medium", riskColor(portfolio.riskLevel))}>
              Risco {riskLabel(portfolio.riskLevel).toLowerCase()}
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground">{horizonLabel(portfolio.horizon)}</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <RefreshCw size={10} />
              Rebalancear {portfolio.rebalancePeriod}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-border/50 bg-card p-4 text-sm text-muted-foreground leading-relaxed">
        {portfolio.description}
      </div>

      {/* Asset allocation */}
      <div>
        <p className="text-sm font-semibold mb-3">Alocação sugerida</p>
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          {/* Bar chart of weights */}
          <div className="p-4 space-y-3 border-b border-border/50">
            {portfolio.assets.map((asset) => (
              <div key={asset.ticker} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-medium">{asset.ticker}</span>
                  <span className="text-muted-foreground">{asset.weight}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${asset.weight}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Asset rows with live prices */}
          <div className="divide-y divide-border/50">
            {portfolio.assets.map((asset) => {
              const q = priceMap[asset.ticker];
              const positive = q ? q.regularMarketChangePercent >= 0 : null;
              const isB3 = !asset.ticker.includes("-") && !asset.ticker.includes("=");

              return (
                <div key={asset.ticker} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 text-center">
                    <span className="text-xs font-medium text-muted-foreground">{asset.weight}%</span>
                  </div>
                  <div className="w-16 shrink-0">
                    <span className="font-mono text-sm font-bold">{asset.ticker}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{q?.shortName ?? asset.name}</p>
                  </div>
                  {isB3 && q ? (
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-sm">R$ {q.regularMarketPrice.toFixed(2)}</span>
                      <span className={cn(
                        "text-xs font-medium",
                        positive ? "text-market-green" : "text-market-red"
                      )}>
                        {positive ? "+" : ""}{q.regularMarketChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  ) : (
                    <Link
                      href={`/dashboard/ativos/${asset.ticker}`}
                      className="text-xs text-primary hover:underline shrink-0"
                    >
                      Ver ativo
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Target profiles */}
      <div className="text-xs text-muted-foreground">
        Carteira indicada para perfis:{" "}
        {portfolio.targetProfiles.map((p) => (
          <span key={p} className="inline-block rounded-full border border-border/50 px-2 py-0.5 mx-0.5 capitalize">
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
