"use client";

import { motion } from "framer-motion";
import type { ProbabilisticScenario } from "@/types";
import { TrendingUp, Minus, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  scenarios: ProbabilisticScenario[];
}

const scenarioConfig = {
  bullish: { label: "Alta", icon: TrendingUp, color: "text-market-green", bg: "bg-market-green/15", bar: "bg-market-green" },
  neutral: { label: "Neutro", icon: Minus, color: "text-market-yellow", bg: "bg-market-yellow/15", bar: "bg-market-yellow" },
  bearish: { label: "Baixa", icon: TrendingDown, color: "text-market-red", bg: "bg-market-red/15", bar: "bg-market-red" },
};

export function ProbabilisticPanel({ scenarios }: Props) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-sm">Cenários probabilísticos</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Baseado em indicadores técnicos — não é garantia de resultado.
        </p>
      </div>

      <div className="space-y-3">
        {scenarios.map((s) => {
          const cfg = scenarioConfig[s.scenario];
          return (
            <div key={s.scenario} className={cn("rounded-xl p-3", cfg.bg)}>
              <div className="flex items-center justify-between mb-2">
                <div className={cn("flex items-center gap-1.5 text-sm font-semibold", cfg.color)}>
                  <cfg.icon size={14} />
                  {cfg.label}
                </div>
                <span className={cn("text-base font-bold font-mono-nums", cfg.color)}>
                  {s.probability}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-black/10 mb-2">
                <motion.div
                  className={cn("h-full rounded-full", cfg.bar)}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.probability}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <p className="text-xs text-foreground/70">{s.description}</p>

              {s.signals.length > 0 && (
                <ul className="mt-1.5 space-y-0.5">
                  {s.signals.slice(0, 3).map((sig) => (
                    <li key={sig} className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-current opacity-40 shrink-0" />
                      {sig}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[10px] text-muted-foreground/60 leading-relaxed">
        ⚠️ Esta análise é baseada em dados históricos e indicadores técnicos. Não constitui recomendação de investimento.
      </p>
    </div>
  );
}
