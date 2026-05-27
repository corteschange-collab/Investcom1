"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TickerItem {
  symbol: string;
  price: number;
  changePercent: number;
}

const DEFAULT_TICKERS: TickerItem[] = [
  { symbol: "IBOV", price: 127842, changePercent: 0.83 },
  { symbol: "PETR4", price: 38.42, changePercent: 2.14 },
  { symbol: "VALE3", price: 67.80, changePercent: -0.92 },
  { symbol: "ITUB4", price: 35.10, changePercent: 0.57 },
  { symbol: "WEGE3", price: 48.20, changePercent: 1.45 },
  { symbol: "BBAS3", price: 24.80, changePercent: -1.22 },
  { symbol: "ABEV3", price: 12.60, changePercent: 0.24 },
  { symbol: "MGLU3", price: 8.20, changePercent: -2.14 },
  { symbol: "MXRF11", price: 10.18, changePercent: 0.69 },
  { symbol: "BOVA11", price: 125.40, changePercent: 0.81 },
  { symbol: "IFIX", price: 3248, changePercent: 0.31 },
  { symbol: "USD/BRL", price: 5.04, changePercent: -0.18 },
  { symbol: "SELIC", price: 10.50, changePercent: 0 },
];

interface TickerTapeProps {
  items?: TickerItem[];
}

export function TickerTape({ items = DEFAULT_TICKERS }: TickerTapeProps) {
  // Duplicate items for seamless loop
  const all = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-b border-border/40 bg-surface/60 h-8 flex items-center">
      {/* Gradient fade on edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="flex animate-ticker whitespace-nowrap gap-0">
        {all.map((item, i) => (
          <TickerItem key={`${item.symbol}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

function TickerItem({ item }: { item: TickerItem }) {
  const positive = item.changePercent > 0;
  const neutral = item.changePercent === 0;
  const isIndex = ["IBOV", "IFIX", "USD/BRL", "SELIC"].includes(item.symbol);

  const content = (
    <span className="flex items-center gap-1.5 px-4 border-r border-border/20 h-full text-xs">
      <span className="font-mono font-semibold text-foreground/80">{item.symbol}</span>
      <span className="font-mono-nums text-foreground/60">
        {item.symbol === "IBOV" || item.symbol === "IFIX"
          ? item.price.toLocaleString("pt-BR")
          : item.symbol === "SELIC"
          ? `${item.price.toFixed(2)}%`
          : `R$${item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
      </span>
      {!neutral && (
        <span
          className={cn(
            "flex items-center gap-0.5 font-medium",
            positive ? "text-market-green" : "text-market-red"
          )}
        >
          {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {positive ? "+" : ""}{item.changePercent.toFixed(2)}%
        </span>
      )}
    </span>
  );

  if (isIndex) return content;

  return (
    <Link href={`/dashboard/ativos/${item.symbol}`} className="hover:bg-white/5 transition-colors h-full flex items-center">
      {content}
    </Link>
  );
}
