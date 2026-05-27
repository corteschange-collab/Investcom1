import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WatchlistItem } from "@/types";

interface WatchlistStore {
  items: WatchlistItem[];
  add: (ticker: string) => void;
  remove: (ticker: string) => void;
  has: (ticker: string) => boolean;
  setItems: (items: WatchlistItem[]) => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (ticker) => {
        if (get().has(ticker)) return;
        set((s) => ({
          items: [...s.items, { ticker, addedAt: new Date().toISOString() }],
        }));
      },
      remove: (ticker) =>
        set((s) => ({ items: s.items.filter((i) => i.ticker !== ticker) })),
      has: (ticker) => get().items.some((i) => i.ticker === ticker),
      setItems: (items) => set({ items }),
    }),
    { name: "investai-watchlist" }
  )
);
