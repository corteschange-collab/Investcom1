"use client";

import { motion } from "framer-motion";
import type { ScoreBreakdown } from "@/types";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { cn } from "@/lib/utils";

interface Props {
  score: ScoreBreakdown;
}

const dimensions = [
  { key: "technical" as const, label: "Força técnica", color: "bg-primary" },
  { key: "fundamental" as const, label: "Qualidade fundamentalista", color: "bg-market-green" },
  { key: "risk" as const, label: "Controle de risco", color: "bg-market-yellow" },
  { key: "dividend" as const, label: "Dividendos", color: "bg-chart-5" },
];

const confidenceLabel = {
  low: { text: "Baixa confiança", color: "text-market-red bg-market-red/10" },
  medium: { text: "Confiança moderada", color: "text-market-yellow bg-market-yellow/10" },
  high: { text: "Alta confiança", color: "text-market-green bg-market-green/10" },
};

export function ScorePanel({ score }: Props) {
  const conf = confidenceLabel[score.confidence];

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <h3 className="font-semibold text-sm mb-4">Score InvestAI</h3>

      <div className="flex items-center gap-6 mb-5">
        <ScoreRing score={score.total} size={88} label="Score geral" />
        <div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
            Pontuação proprietária baseada em análise técnica, fundamentos, risco e dividendos.
          </p>
          <div className={cn("mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", conf.color)}>
            {conf.text}
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {dimensions.map(({ key, label, color }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-xs font-bold font-mono-nums">{score[key]}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", color)}
                initial={{ width: 0 }}
                animate={{ width: `${score[key]}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
