import { AlertTriangle } from "lucide-react";
import { fetchQuote, fetchHistory } from "@/lib/api/brapi";
import { computeIndicators, generateScenarios } from "@/lib/indicators";
import { computeScore } from "@/lib/score/engine";
import { PriceChart } from "@/components/charts/price-chart";
import { IndicatorsPanel } from "@/components/analysis/indicators-panel";
import { ScorePanel } from "@/components/analysis/score-panel";
import { ProbabilisticPanel } from "@/components/analysis/probabilistic-panel";
import { WatchlistButton } from "@/components/analysis/watchlist-button";
import { SocialProof } from "@/components/analysis/social-proof";
import { LiveAssetHeader } from "@/components/analysis/live-asset-header";
import { Badge } from "@/components/ui/badge";
import type { OHLCV, Fundamental } from "@/types";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ ticker: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params;
  return {
    title: `${ticker.toUpperCase()} — Análise`,
  };
}

export default async function AssetPage({ params }: Props) {
  const { ticker } = await params;
  const symbol = ticker.toUpperCase();

  const [quote, history] = await Promise.all([
    fetchQuote(symbol),
    fetchHistory(symbol, "1y", "1d"),
  ]);

  if (!quote) {
    // If API is unavailable, show a helpful error state
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertTriangle size={40} className="text-market-yellow" />
        <h2 className="text-lg font-semibold">Ativo não encontrado</h2>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Não foi possível carregar os dados de{" "}
          <span className="font-mono font-bold">{symbol}</span>. Verifique o ticker
          e tente novamente.
        </p>
      </div>
    );
  }

  // Build OHLCV array from history
  const ohlcv: OHLCV[] =
    history?.historicalDataPrice?.map((d) => ({
      time: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
    })) ?? [];

  const currentPrice = quote.regularMarketPrice;
  const changePercent = quote.regularMarketChangePercent;
  const change = quote.regularMarketChange;

  // Compute analytics
  const indicators = ohlcv.length > 0 ? computeIndicators(ohlcv) : null;
  const scenarios = indicators ? generateScenarios(indicators, currentPrice) : [];

  const fundamental: Partial<Fundamental> = {
    ticker: symbol,
    pl: quote.defaultKeyStatistics?.forwardPE ?? undefined,
    pvp: quote.defaultKeyStatistics?.priceToBook ?? undefined,
    roe: quote.financialData?.returnOnEquity ?? undefined,
    dividendYield: quote.dividendsData?.yieldLast12Months ?? undefined,
  };

  const score = indicators
    ? computeScore(indicators, fundamental, currentPrice)
    : null;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h1 className="text-xl font-bold font-mono">{symbol}</h1>
            <span className="text-muted-foreground text-sm">{quote.longName}</span>
            {quote.sector && (
              <Badge variant="outline" className="text-xs">
                {quote.sector}
              </Badge>
            )}
          </div>
          {/* LiveAssetHeader polls every 30 s and flashes price on change */}
          <LiveAssetHeader
            ticker={symbol}
            initialPrice={currentPrice}
            initialChange={change}
            initialChangePercent={changePercent}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <SocialProof ticker={symbol} />
          <WatchlistButton ticker={symbol} />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Chart (full width on mobile, 2/3 on lg) */}
        <div className="lg:col-span-2 space-y-5">
          {ohlcv.length > 0 ? (
            <PriceChart
              data={ohlcv}
              ticker={symbol}
              currentPrice={currentPrice}
              changePercent={changePercent}
            />
          ) : (
            <div className="rounded-2xl border border-border/50 bg-card p-8 text-center text-sm text-muted-foreground">
              Dados históricos indisponíveis para este ativo.
            </div>
          )}

          {/* Fundamental data */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="font-semibold text-sm mb-4">Dados fundamentalistas</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "P/L", value: fundamental.pl?.toFixed(1) ?? "—" },
                { label: "P/VP", value: fundamental.pvp?.toFixed(2) ?? "—" },
                { label: "ROE", value: fundamental.roe ? `${(fundamental.roe * 100).toFixed(1)}%` : "—" },
                { label: "Dividend Yield", value: fundamental.dividendYield ? `${fundamental.dividendYield.toFixed(2)}%` : "—" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-background border border-border/40 p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-base font-bold font-mono-nums mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis sidebar */}
        <div className="space-y-5">
          {score && <ScorePanel score={score} />}
          {scenarios.length > 0 && <ProbabilisticPanel scenarios={scenarios} />}
          {indicators && (
            <IndicatorsPanel indicators={indicators} currentPrice={currentPrice} />
          )}
          {!indicators && (
            <div className="rounded-2xl border border-border/50 bg-card p-5 text-center text-sm text-muted-foreground">
              Indicadores indisponíveis — histórico de dados insuficiente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
