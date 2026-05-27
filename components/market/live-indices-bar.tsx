"use client";

import { useLiveIndices } from "@/hooks/use-live-indices";
import { FreshnessBadge } from "./freshness-badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LiveIndicesBarProps {
  /** Initial server-rendered data (avoids layout shift) */
  initialData?: {
    symbol: string;
    name: string;
    value: number;
    changePercent: number;
  }[];
  className?: string;
}

/**
 * Live market indices bar — polls every 60 s during market hours.
 *
 * Accepts `initialData` from a Server Component so there's no empty
 * state on first paint (the data already exists from SSR).
 */
export function LiveIndicesBar({ initialData, className }: LiveIndicesBarProps) {
  const { data, isLoading, isError } = useLiveIndices();

  const indices = data?.indices ?? initialData ?? [];
  const selic = data?.selic ?? null;
  const meta = data?.meta;

  // Show skeletons only on the very first load (no SSR data)
  if (isLoading && !initialData?.length) {
    return (
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  const displayItems = [
    ...indices.slice(0, 3),
    ...(selic !== null
      ? [{ symbol: "SELIC", name: "SELIC", value: selic, changePercent: 0 }]
      : []),
  ].slice(0, 4);

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {displayItems.map((item) => {
          const positive = item.changePercent > 0;
          const neutral = item.changePercent === 0;
          return (
            <div key={item.symbol} className="rounded-xl border border-border/50 bg-card p-4">
              <p className="text-xs text-muted-foreground">{item.name}</p>
              <p className="mt-1 text-base font-bold font-mono-nums">
                {item.symbol === "SELIC"
                  ? `${item.value.toFixed(2)}% a.a.`
                  : item.symbol === "USDBRL=X"
                  ? `R$ ${item.value.toFixed(4)}`
                  : item.value.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
              </p>
              {item.changePercent !== 0 && (
                <p
                  className={cn(
                    "text-xs mt-0.5 font-mono-nums",
                    positive ? "text-market-green" : neutral ? "text-muted-foreground" : "text-market-red"
                  )}
                >
                  {positive ? "+" : ""}
                  {item.changePercent.toFixed(2)}%
                </p>
              )}
              {item.symbol === "SELIC" && (
                <p className="text-xs mt-0.5 text-muted-foreground">a.a.</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Freshness row */}
      {!isError && meta && (
        <div className="flex justify-end mt-2">
          <FreshnessBadge
            fetchedAt={meta.fetchedAt}
            stale={meta.stale}
            source={meta.source}
          />
        </div>
      )}

      {isError && (
        <p className="text-xs text-market-red mt-1 text-right">
          ⚠ Falha ao carregar índices. Tentando novamente…
        </p>
      )}
    </div>
  );
}
