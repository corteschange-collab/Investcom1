"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "investai-streak";

interface StreakData {
  count: number;
  lastVisit: string; // ISO date string
}

export function StreakWidget() {
  const [streak, setStreak] = useState(0);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: StreakData = raw ? JSON.parse(raw) : { count: 0, lastVisit: "" };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (data.lastVisit === today) {
      setStreak(data.count);
    } else if (data.lastVisit === yesterdayStr) {
      const newCount = data.count + 1;
      setStreak(newCount);
      setIsNew(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: newCount, lastVisit: today }));
    } else {
      setStreak(1);
      setIsNew(data.count > 0); // Only "new" if had a streak before
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 1, lastVisit: today }));
    }
  }, []);

  if (streak === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all",
        isNew
          ? "border-market-yellow/40 bg-market-yellow/10 animate-in fade-in duration-500"
          : "border-border/50 bg-card"
      )}
    >
      <Flame
        size={16}
        className={cn(streak >= 7 ? "text-market-red" : streak >= 3 ? "text-market-yellow" : "text-muted-foreground")}
      />
      <span className="font-bold font-mono-nums">{streak}</span>
      <span className="text-muted-foreground text-xs">
        {streak === 1 ? "dia seguido" : "dias seguidos"}
      </span>
      {streak >= 7 && (
        <span className="text-[10px] font-medium text-market-red ml-1">🔥 em chamas</span>
      )}
    </div>
  );
}
