"use client";

import type { IndicatorResult } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  indicators: IndicatorResult;
  currentPrice: number;
}

function rsiLabel(v: number | null) {
  if (v === null) return { text: "—", color: "text-muted-foreground" };
  if (v > 70) return { text: `${v.toFixed(1)} — Sobrecomprado`, color: "text-market-red" };
  if (v < 30) return { text: `${v.toFixed(1)} — Sobrevendido`, color: "text-market-green" };
  return { text: `${v.toFixed(1)} — Neutro`, color: "text-market-yellow" };
}

function macdSignal(macd: number | null, signal: number | null) {
  if (macd === null || signal === null) return { text: "—", color: "text-muted-foreground" };
  if (macd > signal) return { text: "Alta (MACD > Sinal)", color: "text-market-green" };
  return { text: "Baixa (MACD < Sinal)", color: "text-market-red" };
}

function trendSignal(price: number, ema: number | null, label: string) {
  if (ema === null) return { text: "—", color: "text-muted-foreground" };
  if (price > ema) return { text: `Acima da ${label} (Alta)`, color: "text-market-green" };
  return { text: `Abaixo da ${label} (Baixa)`, color: "text-market-red" };
}

function fmt(v: number | null) {
  if (v === null) return "—";
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function IndicatorsPanel({ indicators, currentPrice }: Props) {
  const rsi = rsiLabel(indicators.rsi);
  const macd = macdSignal(indicators.macd.macd, indicators.macd.signal);
  const ema20 = trendSignal(currentPrice, indicators.ema20, "EMA20");
  const ema50 = trendSignal(currentPrice, indicators.ema50, "EMA50");
  const sma200 = trendSignal(currentPrice, indicators.sma200, "SMA200");

  const rows = [
    { label: "RSI (14)", value: rsi.text, color: rsi.color },
    { label: "MACD", value: macd.text, color: macd.color },
    { label: "EMA 20", value: ema20.text, color: ema20.color },
    { label: "EMA 50", value: ema50.text, color: ema50.color },
    { label: "SMA 200", value: sma200.text, color: sma200.color },
    {
      label: "Bollinger Superior",
      value: fmt(indicators.bollingerBands.upper),
      color: "text-muted-foreground",
    },
    {
      label: "Bollinger Inferior",
      value: fmt(indicators.bollingerBands.lower),
      color: "text-muted-foreground",
    },
    {
      label: "VWAP",
      value: fmt(indicators.vwap),
      color: indicators.vwap !== null && currentPrice > indicators.vwap ? "text-market-green" : "text-market-red",
    },
    {
      label: "ATR (14)",
      value: fmt(indicators.atr),
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <h3 className="font-semibold text-sm mb-4">Indicadores técnicos</h3>
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0"
          >
            <span className="text-xs text-muted-foreground">{row.label}</span>
            <span className={cn("text-xs font-medium font-mono-nums", row.color)}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
