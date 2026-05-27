"use client";

import { useState, useEffect } from "react";
import { RefreshCw, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FreshnessBadgeProps {
  /** Unix timestamp ms of when the data was fetched */
  fetchedAt: number | null | undefined;
  /** Whether the data is considered stale by the server */
  stale?: boolean;
  /** Source label (brapi, yahoo, stale, fallback) */
  source?: string;
  /** Extra class names */
  className?: string;
  /** Whether to show the source label */
  showSource?: boolean;
}

function useRelativeTime(fetchedAt: number | null | undefined): string {
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!fetchedAt) { setLabel(""); return; }

    function update() {
      const ageS = Math.floor((Date.now() - fetchedAt!) / 1000);
      if (ageS < 5) setLabel("agora mesmo");
      else if (ageS < 60) setLabel(`há ${ageS}s`);
      else if (ageS < 3600) setLabel(`há ${Math.floor(ageS / 60)}min`);
      else setLabel(`há ${Math.floor(ageS / 3600)}h`);
    }

    update();
    const id = setInterval(update, 10_000); // update label every 10 s
    return () => clearInterval(id);
  }, [fetchedAt]);

  return label;
}

/**
 * Compact badge that shows data freshness.
 *
 * States:
 *  ● Green + "Atualizado há Xs"  → fresh, real data
 *  ● Yellow + "Cache (Xmin)"     → stale but usable
 *  ● Red + "Dados atrasados"     → very stale or fallback
 */
export function FreshnessBadge({
  fetchedAt,
  stale = false,
  source,
  className,
  showSource = false,
}: FreshnessBadgeProps) {
  const relTime = useRelativeTime(fetchedAt);
  const isFallback = source === "fallback";
  const isStale = stale || isFallback;
  const ageS = fetchedAt ? Math.floor((Date.now() - fetchedAt) / 1000) : Infinity;
  const isCritical = ageS > 300 || isFallback; // >5 min or fallback data

  if (!fetchedAt) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors",
        isCritical
          ? "bg-market-red/10 text-market-red border border-market-red/20"
          : isStale
          ? "bg-market-yellow/10 text-market-yellow border border-market-yellow/20"
          : "bg-market-green/10 text-market-green border border-market-green/20",
        className
      )}
      title={`Dados de ${source ?? "cache"}. Atualizado ${relTime}.`}
    >
      {isCritical ? (
        <AlertTriangle size={10} className="shrink-0" />
      ) : isStale ? (
        <Clock size={10} className="shrink-0" />
      ) : (
        <RefreshCw size={10} className="shrink-0 animate-[spin_4s_linear_infinite]" />
      )}

      <span>
        {isCritical
          ? "Dados atrasados"
          : isStale
          ? `Cache (${relTime})`
          : `Atualizado ${relTime}`}
      </span>

      {showSource && source && source !== "brapi" && (
        <span className="opacity-60">· {source}</span>
      )}
    </div>
  );
}

/** Full-line freshness indicator row with last-update text. */
export function FreshnessRow({
  fetchedAt,
  stale,
  source,
  className,
}: FreshnessBadgeProps) {
  const relTime = useRelativeTime(fetchedAt);
  if (!fetchedAt) return null;

  return (
    <div className={cn("flex items-center justify-end gap-2", className)}>
      <span className="text-xs text-muted-foreground">Última atualização: {relTime}</span>
      <FreshnessBadge fetchedAt={fetchedAt} stale={stale} source={source} />
    </div>
  );
}
