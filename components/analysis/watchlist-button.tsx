"use client";

import { Star } from "lucide-react";
import { toast } from "sonner";
import { useWatchlistStore } from "@/store/watchlist";
import { cn } from "@/lib/utils";

export function WatchlistButton({ ticker }: { ticker: string }) {
  const { has, add, remove } = useWatchlistStore();
  const inWatchlist = has(ticker);

  const toggle = () => {
    if (inWatchlist) {
      remove(ticker);
      toast(`${ticker} removido da watchlist`, {
        icon: "☆",
        duration: 2500,
      });
    } else {
      add(ticker);
      toast.success(`${ticker} adicionado à watchlist`, {
        icon: "⭐",
        duration: 2500,
      });
    }
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
        inWatchlist
          ? "border-market-yellow/50 bg-market-yellow/10 text-market-yellow hover:bg-market-yellow/20"
          : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
      )}
    >
      <Star
        size={13}
        className={cn("transition-all", inWatchlist ? "fill-market-yellow text-market-yellow" : "")}
      />
      {inWatchlist ? "Na watchlist" : "Watchlist"}
    </button>
  );
}
