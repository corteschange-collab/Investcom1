"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Brain, Zap, Star, BookOpen, TrendingUp } from "lucide-react";

const TABS = [
  {
    key: "analise",
    icon: BarChart2,
    label: "Análise técnica",
    headline: "15+ indicadores calculados automaticamente",
    body: "RSI, MACD, Bollinger, EMA, VWAP, ATR e muito mais. Você não precisa calcular nada — a plataforma faz tudo e ainda explica o que cada número significa.",
    visual: [
      { label: "RSI (14)", value: "58.2", bar: 58, color: "bg-market-yellow" },
      { label: "MACD", value: "+0.34", bar: 72, color: "bg-market-green" },
      { label: "EMA 20", value: "37.80", bar: 85, color: "bg-primary" },
      { label: "Bollinger", value: "Normal", bar: 50, color: "bg-primary" },
    ],
  },
  {
    key: "ia",
    icon: Brain,
    label: "IA assistente",
    headline: "IA que explica gráficos em português simples",
    body: "Nossa IA analisa todos os indicadores juntos e gera uma explicação humana: o que está acontecendo com o ativo, quais são os riscos, e qual a probabilidade de cada cenário.",
    visual: [
      { label: "Prob. de alta", value: "62%", bar: 62, color: "bg-market-green" },
      { label: "Prob. neutra", value: "24%", bar: 24, color: "bg-market-yellow" },
      { label: "Prob. de baixa", value: "14%", bar: 14, color: "bg-market-red" },
      { label: "Confiança", value: "Alta", bar: 78, color: "bg-primary" },
    ],
  },
  {
    key: "radar",
    icon: Zap,
    label: "Radar de oportunidades",
    headline: "Screener que encontra ativos com sinais técnicos",
    body: "O Radar analisa toda a B3 e filtra ativos com RSI sobrevendido, MACD cruzando, tendência de alta — e apresenta tudo em uma tabela clara, com score e probabilidades.",
    visual: [
      { label: "Score alto (>65)", value: "5 ativos", bar: 50, color: "bg-market-green" },
      { label: "Tendência de alta", value: "8 ativos", bar: 80, color: "bg-primary" },
      { label: "RSI sobrevendido", value: "3 ativos", bar: 30, color: "bg-market-yellow" },
      { label: "MACD bullish", value: "6 ativos", bar: 60, color: "bg-primary" },
    ],
  },
  {
    key: "watchlist",
    icon: Star,
    label: "Watchlist",
    headline: "Acompanhe seus ativos favoritos em um lugar",
    body: "Salve qualquer ativo na sua watchlist com um clique. Receba alertas quando o preço, RSI ou tendência mudarem. Tudo sincronizado entre dispositivos.",
    visual: [
      { label: "PETR4", value: "+2.14%", bar: 71, color: "bg-market-green" },
      { label: "MXRF11", value: "+0.69%", bar: 57, color: "bg-market-green" },
      { label: "VALE3", value: "-0.92%", bar: 43, color: "bg-market-red" },
      { label: "BOVA11", value: "+0.81%", bar: 62, color: "bg-market-green" },
    ],
  },
  {
    key: "aprender",
    icon: BookOpen,
    label: "Educação financeira",
    headline: "Aprenda a investir com linguagem simples",
    body: "Conteúdo feito para quem nunca investiu. Do 'o que é uma ação' até estratégias de longo prazo. Simuladores de dividendos, aposentadoria e juros compostos incluídos.",
    visual: [
      { label: "Módulos gratuitos", value: "12", bar: 100, color: "bg-primary" },
      { label: "Simuladores", value: "4", bar: 100, color: "bg-market-green" },
      { label: "Nível iniciante", value: "8 aulas", bar: 80, color: "bg-market-yellow" },
      { label: "Nível avançado", value: "4 aulas", bar: 40, color: "bg-market-red" },
    ],
  },
];

export function FeaturesTabs() {
  const [active, setActive] = useState("analise");
  const tab = TABS.find((t) => t.key === active)!;

  return (
    <section id="recursos" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary">Recursos</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Tudo que você precisa para investir melhor
          </h2>
        </motion.div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-8 scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm font-medium transition-all shrink-0 ${
                active === t.key
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid lg:grid-cols-2 gap-8 items-center"
          >
            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                  <tab.icon size={20} />
                </div>
                <span className="text-xs font-medium text-primary uppercase tracking-wide">{tab.label}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{tab.headline}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{tab.body}</p>
            </div>

            {/* Visual */}
            <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
              {tab.visual.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground text-xs">{item.label}</span>
                    <span className="font-semibold font-mono-nums text-xs">{item.value}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${item.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.bar}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
