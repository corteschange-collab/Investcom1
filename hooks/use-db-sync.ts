"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useWatchlistStore } from "@/store/watchlist";
import { useAlertsStore } from "@/store/alerts";

const SYNC_KEY = "investai-db-synced-v1";

// Runs once per browser session after login.
// Pushes localStorage data to the DB, then fetches the authoritative
// server state back into the Zustand stores.
export function useDbSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const hasSynced = useRef(false);
  const watchlistItems = useWatchlistStore((s) => s.items);
  const alerts = useAlertsStore((s) => s.alerts);
  const setWatchlist = useWatchlistStore((s) => s.setItems);
  const setAlerts = useAlertsStore((s) => s.setItems);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    if (hasSynced.current) return;

    // Only skip if synced in this tab AND in this session (sessionStorage)
    const alreadySynced = sessionStorage.getItem(SYNC_KEY) === user.id;
    if (alreadySynced) return;

    hasSynced.current = true;

    async function run() {
      try {
        // 1. Push localStorage → DB
        await fetch("/api/user/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            watchlist: watchlistItems.map((i) => ({ ticker: i.ticker, notes: i.notes })),
            alerts: alerts.map((a) => ({
              ticker: a.ticker,
              type: a.type,
              value: a.value,
              active: a.active,
            })),
          }),
        });

        // 2. Pull authoritative state from DB
        const [wRes, aRes] = await Promise.all([
          fetch("/api/watchlist"),
          fetch("/api/alerts"),
        ]);

        if (wRes.ok) {
          const { items } = await wRes.json();
          setWatchlist(
            items.map((i: { id: string; ticker: string; notes?: string; addedAt: string }) => ({
              ticker: i.ticker,
              notes: i.notes,
              addedAt: i.addedAt,
              dbId: i.id,
            }))
          );
        }

        if (aRes.ok) {
          const { alerts: dbAlerts } = await aRes.json();
          setAlerts(
            dbAlerts.map(
              (a: {
                id: string;
                ticker: string;
                type: string;
                value: number;
                active: boolean;
                createdAt: string;
              }) => ({
                id: a.id,
                ticker: a.ticker,
                type: a.type.toLowerCase() as import("@/store/alerts").AlertType,
                value: a.value,
                active: a.active,
                createdAt: a.createdAt,
              })
            )
          );
        }

        sessionStorage.setItem(SYNC_KEY, user!.id);
      } catch {
        // Silently fail — localStorage data is still usable offline
      }
    }

    run();
  }, [isLoaded, isSignedIn, user, watchlistItems, alerts, setWatchlist, setAlerts]);
}
