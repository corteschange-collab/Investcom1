"use client";

import { useEffect, useState } from "react";
import { Eye, Users } from "lucide-react";

interface Props {
  ticker: string;
}

function deterministicCount(ticker: string, base: number): number {
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    hash = ((hash << 5) - hash + ticker.charCodeAt(i)) | 0;
  }
  return base + (Math.abs(hash) % 800);
}

export function SocialProof({ ticker }: Props) {
  const baseViewers = deterministicCount(ticker, 200);
  const baseAnalysts = deterministicCount(ticker + "a", 40);

  const [viewers, setViewers] = useState(baseViewers);
  const [animated, setAnimated] = useState(false);

  // Simula pequenas flutuações ao vivo
  useEffect(() => {
    setAnimated(true);
    const interval = setInterval(() => {
      setViewers((v) => v + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Eye size={12} className={animated ? "text-primary animate-pulse" : "text-primary"} />
        <span className="font-mono-nums tabular-nums">{viewers.toLocaleString("pt-BR")}</span>
        <span>analisando agora</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users size={12} />
        <span className="font-mono-nums">{baseAnalysts}</span>
        <span>na watchlist</span>
      </div>
    </div>
  );
}
