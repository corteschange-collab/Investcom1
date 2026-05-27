import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { THEMATIC_PORTFOLIOS } from "@/lib/assets/recommendation";
import { riskLabel, riskColor, horizonLabel } from "@/lib/assets/taxonomy";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Carteiras Temáticas" };

const PORTFOLIO_ICONS: Record<string, string> = {
  dividendos: "💰",
  crescimento: "🚀",
  protecao: "🔒",
  balanceada: "⚖️",
  "longo-prazo": "🏔️",
  renda: "🏠",
};

export default function CarteirasPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">Carteiras Temáticas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Estratégias curadas com alocação sugerida por perfil e objetivo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {THEMATIC_PORTFOLIOS.map((portfolio) => (
          <Link
            key={portfolio.id}
            href={`/dashboard/carteiras/${portfolio.id}`}
            className="group flex flex-col gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-border hover:shadow-sm"
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                {PORTFOLIO_ICONS[portfolio.id] ?? "📊"}
              </div>
              <div>
                <p className="font-semibold text-sm">{portfolio.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {portfolio.tagline}
                </p>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs">
              <span className={cn("font-medium", riskColor(portfolio.riskLevel))}>
                Risco {riskLabel(portfolio.riskLevel).toLowerCase()}
              </span>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-muted-foreground">
                {horizonLabel(portfolio.horizon).split(" (")[0]}
              </span>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-muted-foreground">{portfolio.assets.length} ativos</span>
            </div>

            {/* Asset chips */}
            <div className="flex flex-wrap gap-1.5">
              {portfolio.assets.slice(0, 5).map((a) => (
                <span
                  key={a.ticker}
                  className="rounded-lg border border-border/50 bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {a.ticker}
                </span>
              ))}
              {portfolio.assets.length > 5 && (
                <span className="rounded-lg border border-border/50 bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
                  +{portfolio.assets.length - 5}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-primary font-medium">
              Ver carteira
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
