"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { OHLCV } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  data: OHLCV[];
  ticker: string;
  currentPrice: number;
  changePercent: number;
}

const timeframes = ["1M", "3M", "6M", "1A"] as const;
type TF = typeof timeframes[number];

function sliceData(data: OHLCV[], tf: TF): OHLCV[] {
  const now = Date.now() / 1000;
  const days: Record<TF, number> = { "1M": 30, "3M": 90, "6M": 180, "1A": 365 };
  const cutoff = now - days[tf] * 86400;
  const filtered = data.filter((d) => d.time >= cutoff);
  return filtered.length > 4 ? filtered : data;
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

interface TooltipPayload {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-bold font-mono-nums">
        R$ {payload[0].value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export function PriceChart({ data, ticker, currentPrice, changePercent }: Props) {
  const [tf, setTf] = useState<TF>("3M");
  const sliced = sliceData(data, tf);
  const positive = changePercent >= 0;

  const chartData = sliced.map((d) => ({
    date: formatDate(d.time),
    price: d.close,
  }));

  const color = positive ? "var(--market-green)" : "var(--market-red)";

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-mono font-bold">{ticker}</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold font-mono-nums">
              R$ {currentPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                positive ? "text-market-green" : "text-market-red"
              )}
            >
              {positive ? "+" : ""}
              {changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {timeframes.map((t) => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                tf === t
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v.toFixed(0)}`}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill="url(#priceGrad)"
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: "var(--card)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
