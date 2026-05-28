"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Minus, TrendingDown } from "lucide-react";

const SCENARIOS = [
  {
    label: "Cenário Otimista",
    pct: 58,
    icon: TrendingUp,
    color: "#22C55E",
    bg: "bg-market-green/10",
    border: "border-market-green/20",
    textColor: "text-market-green",
    desc: "Continuação de tendência de alta. MACD acima da linha de sinal, preço sustentado acima da EMA20 e volume crescente.",
    targets: ["+8 a +15%", "30–60 dias"],
  },
  {
    label: "Cenário Base",
    pct: 28,
    icon: Minus,
    color: "#EAB308",
    bg: "bg-market-yellow/10",
    border: "border-market-yellow/20",
    textColor: "text-market-yellow",
    desc: "Consolidação lateral. Indicadores sem direção clara. Mercado aguarda catalisador — resultado trimestral ou decisão do COPOM.",
    targets: ["-3 a +3%", "15–30 dias"],
  },
  {
    label: "Cenário Pessimista",
    pct: 14,
    icon: TrendingDown,
    color: "#EF4444",
    bg: "bg-market-red/10",
    border: "border-market-red/20",
    textColor: "text-market-red",
    desc: "Rompimento de suporte. RSI em zona de sobrecompra, divergência negativa no MACD. Risco de correção mais profunda.",
    targets: ["-8 a -15%", "15–30 dias"],
  },
];

const BAR_TOTAL = SCENARIOS.reduce((acc, s) => acc + s.pct, 0);

export function ProbabilisticAnalysis() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 section-navy relative overflow-hidden">
      <div className="gradient-line absolute top-0 left-0 right-0 opacity-30" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold">
            Análise probabilística
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.1]">
            3 cenários, não 1 resposta.
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            Investir é gerir incerteza. Mostramos probabilidades calculadas — não previsões certas.
            Cada cenário inclui o racional por trás dos números.
          </p>
        </motion.div>

        {/* Stacked probability bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 rounded-2xl border border-border/40 bg-card/50 p-6"
        >
          <p className="text-xs text-muted-foreground mb-3">Distribuição probabilística — PETR4 (exemplo)</p>
          <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
            {SCENARIOS.map((s, i) => (
              <motion.div
                key={s.label}
                className="h-full rounded-full"
                style={{ backgroundColor: s.color }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${(s.pct / BAR_TOTAL) * 100}%` } : {}}
                transition={{ duration: 1.0, delay: 0.3 + i * 0.08, ease: "easeOut" }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-6 flex-wrap">
            {SCENARIOS.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-muted-foreground">
                  {s.label.replace("Cenário ", "")} — <span className="font-bold" style={{ color: s.color }}>{s.pct}%</span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scenario cards */}
        <div className="grid lg:grid-cols-3 gap-4">
          {SCENARIOS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-2xl border ${s.border} ${s.bg} p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${s.color}25` }}
                    >
                      <Icon size={16} style={{ color: s.color }} />
                    </div>
                    <p className="font-bold text-sm">{s.label}</p>
                  </div>
                  <span className={`text-3xl font-extrabold font-mono-nums tracking-tight ${s.textColor}`}>
                    {s.pct}%
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{s.desc}</p>

                <div className="flex items-center gap-3 pt-3 border-t border-border/30">
                  <div className="flex-1 rounded-xl bg-background/40 px-3 py-2 text-center">
                    <p className="text-[10px] text-muted-foreground">Potencial</p>
                    <p className={`text-xs font-bold mt-0.5 ${s.textColor}`}>{s.targets[0]}</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-background/40 px-3 py-2 text-center">
                    <p className="text-[10px] text-muted-foreground">Horizonte</p>
                    <p className="text-xs font-bold mt-0.5 text-muted-foreground">{s.targets[1]}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-[11px] text-muted-foreground/60 max-w-2xl mx-auto"
        >
          Probabilidades calculadas com base em indicadores técnicos históricos. Não constituem recomendação de investimento.
          Rentabilidade passada não garante resultado futuro.
        </motion.p>
      </div>

      <div className="gradient-line absolute bottom-0 left-0 right-0 opacity-30" />
    </section>
  );
}
