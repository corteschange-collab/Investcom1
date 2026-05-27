import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MarketCardProps {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
}

export function MarketCard({ ticker, name, price, change, changePercent, volume }: MarketCardProps) {
  const positive = changePercent > 0;
  const neutral = changePercent === 0;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 hover:border-border transition-colors group cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-sm font-bold">{ticker}</span>
          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[120px]">{name}</p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
            positive ? "bg-market-green/15 text-market-green" :
            neutral ? "bg-muted text-muted-foreground" :
            "bg-market-red/15 text-market-red"
          )}
        >
          {positive ? <TrendingUp size={11} /> : neutral ? <Minus size={11} /> : <TrendingDown size={11} />}
          {Math.abs(changePercent).toFixed(2)}%
        </div>
      </div>

      <div className="mt-3">
        <span className="text-lg font-bold font-mono-nums">
          R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
        <span
          className={cn(
            "ml-2 text-xs font-mono-nums",
            positive ? "text-market-green" : neutral ? "text-muted-foreground" : "text-market-red"
          )}
        >
          {positive ? "+" : ""}
          {change.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {volume && (
        <div className="mt-1.5 text-xs text-muted-foreground">
          Vol: {(volume / 1_000_000).toFixed(1)}M
        </div>
      )}
    </div>
  );
}
