"use client";

import { cn } from "@/lib/utils";
import { useMarketStatus } from "@/hooks/use-market-status";

interface MarketStatusBadgeProps {
  className?: string;
  showTime?: boolean;
}

const SESSION_STYLES = {
  regular: "text-market-green border-market-green/30 bg-market-green/10",
  after: "text-market-yellow border-market-yellow/30 bg-market-yellow/10",
  pre: "text-primary border-primary/30 bg-primary/10",
  closed: "text-muted-foreground border-border/40 bg-muted/40",
} as const;

/**
 * Reactive badge showing real B3 market status.
 * Re-evaluates every minute to catch session transitions.
 */
export function MarketStatusBadge({ className, showTime = false }: MarketStatusBadgeProps) {
  const status = useMarketStatus();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        SESSION_STYLES[status.sessionType],
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status.sessionType === "regular" && "bg-market-green animate-pulse",
          status.sessionType === "after" && "bg-market-yellow",
          status.sessionType === "pre" && "bg-primary animate-pulse",
          status.sessionType === "closed" && "bg-muted-foreground"
        )}
      />
      {status.label}
      {showTime && status.sessionType !== "closed" && (
        <span className="opacity-60 font-mono">{status.brtTime}</span>
      )}
    </div>
  );
}
