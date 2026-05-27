import Link from "next/link";
import { Zap, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { runScreener, FALLBACK_SCREENER } from "@/lib/api/screener";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Radar de Oportunidades" };

const trendConfig = {
  up: { label: "Alta", icon: TrendingUp, color: "text-market-green", bg: "bg-market-green/10" },
  down: { label: "Baixa", icon: TrendingDown, color: "text-market-red", bg: "bg-market-red/10" },
  sideways: { label: "Lateral", icon: Minus, color: "text-market-yellow", bg: "bg-market-yellow/10" },
};

const macdConfig = {
  bullish: { label: "Compra", color: "text-market-green border-market-green/40 bg-market-green/10" },
  bearish: { label: "Venda", color: "text-market-red border-market-red/40 bg-market-red/10" },
  neutral: { label: "Neutro", color: "text-market-yellow border-market-yellow/40 bg-market-yellow/10" },
};

function ScoreBar({ value }: { value: number }) {
  const color = value >= 65 ? "bg-market-green" : value >= 45 ? "bg-market-yellow" : "bg-market-red";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-border overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-bold font-mono-nums">{value}</span>
    </div>
  );
}

export default async function RadarPage() {
  const results = await runScreener().catch(() => FALLBACK_SCREENER);

  const highScore = results.filter((r) => r.score >= 65);
  const watchList = results.filter((r) => r.rsi !== null && r.rsi < 35);
  const trending = results.filter((r) => r.trend === "up" && r.macdSignal === "bullish");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Zap size={22} className="text-primary" />
          Radar de Oportunidades
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Screener automático com análise técnica em tempo real — atualizado a cada 5 minutos.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-xl border border-market-yellow/30 bg-market-yellow/5 px-4 py-3">
        <AlertCircle size={15} className="text-market-yellow shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Os sinais exibidos são baseados em análise técnica e dados históricos. Não constituem recomendação
          de compra ou venda. Sempre faça sua própria análise antes de investir.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-market-green/30 bg-market-green/5 p-4">
          <div className="text-2xl font-bold text-market-green">{highScore.length}</div>
          <div className="text-sm font-medium mt-0.5">Score alto (&gt;65)</div>
          <div className="text-xs text-muted-foreground">Força técnica e fundamentalista</div>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <div className="text-2xl font-bold text-primary">{trending.length}</div>
          <div className="text-sm font-medium mt-0.5">Em tendência de alta</div>
          <div className="text-xs text-muted-foreground">EMA e MACD favoráveis</div>
        </div>
        <div className="rounded-2xl border border-market-yellow/30 bg-market-yellow/5 p-4">
          <div className="text-2xl font-bold text-market-yellow">{watchList.length}</div>
          <div className="text-sm font-medium mt-0.5">RSI sobrevendido</div>
          <div className="text-xs text-muted-foreground">Possível ponto de entrada</div>
        </div>
      </div>

      {/* Full screener table */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Todos os ativos analisados</h2>
          <span className="text-xs text-muted-foreground">{results.length} ativos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                {["Ativo", "Preço", "Variação", "Score", "RSI", "MACD", "Tendência", "Prob. Alta", "Sinais"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const trend = trendConfig[r.trend];
                const macd = macdConfig[r.macdSignal];
                const positive = r.changePercent >= 0;

                return (
                  <tr
                    key={r.ticker}
                    className={cn(
                      "border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors",
                      i % 2 === 0 ? "" : "bg-muted/10"
                    )}
                  >
                    {/* Ativo */}
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/ativos/${r.ticker}`} className="group flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-[10px] font-bold font-mono shrink-0 group-hover:bg-primary/20 transition-colors">
                          {r.ticker.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-mono font-semibold text-sm group-hover:text-primary transition-colors">{r.ticker}</div>
                          <div className="text-xs text-muted-foreground">{r.name}</div>
                        </div>
                      </Link>
                    </td>

                    {/* Preço */}
                    <td className="px-4 py-3 font-mono-nums text-sm font-medium whitespace-nowrap">
                      R$ {r.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Variação */}
                    <td className={cn("px-4 py-3 font-mono-nums text-sm font-medium whitespace-nowrap", positive ? "text-market-green" : "text-market-red")}>
                      {positive ? "+" : ""}{r.changePercent.toFixed(2)}%
                    </td>

                    {/* Score */}
                    <td className="px-4 py-3">
                      <ScoreBar value={r.score} />
                    </td>

                    {/* RSI */}
                    <td className="px-4 py-3">
                      {r.rsi !== null ? (
                        <span className={cn("font-mono-nums text-sm font-medium",
                          r.rsi > 70 ? "text-market-red" : r.rsi < 30 ? "text-market-green" : "text-muted-foreground"
                        )}>
                          {r.rsi.toFixed(0)}
                          {r.rsi > 70 && <span className="ml-1 text-[10px]">OC</span>}
                          {r.rsi < 30 && <span className="ml-1 text-[10px]">OV</span>}
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>

                    {/* MACD */}
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", macd.color)}>
                        {macd.label}
                      </Badge>
                    </td>

                    {/* Tendência */}
                    <td className="px-4 py-3">
                      <span className={cn("flex items-center gap-1 text-xs font-medium", trend.color)}>
                        <trend.icon size={12} />
                        {trend.label}
                      </span>
                    </td>

                    {/* Prob. Alta */}
                    <td className="px-4 py-3">
                      <span className={cn("font-mono-nums text-sm font-semibold",
                        r.bullishProb >= 60 ? "text-market-green" :
                        r.bullishProb >= 45 ? "text-market-yellow" : "text-market-red"
                      )}>
                        {r.bullishProb}%
                      </span>
                    </td>

                    {/* Sinais */}
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {r.signals.slice(0, 2).map((s) => (
                          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground whitespace-nowrap">
                            {s.length > 22 ? s.slice(0, 22) + "…" : s}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
