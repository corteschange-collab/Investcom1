"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const INDICATORS = [
  {
    n: "01", name: "RSI", full: "Relative Strength Index",
    desc: "Mede velocidade e magnitude das mudanças de preço. Sobrecomprado >70, sobrevendido <30.",
    tag: "Momentum",
  },
  {
    n: "02", name: "MACD", full: "Moving Average Convergence Divergence",
    desc: "Cruza duas médias móveis para identificar mudanças de tendência e momentum direcional.",
    tag: "Tendência",
  },
  {
    n: "03", name: "EMA 20", full: "Média Móvel Exponencial 20 períodos",
    desc: "Tendência de curto prazo. Preço acima = momentum positivo recente.",
    tag: "Tendência",
  },
  {
    n: "04", name: "EMA 50", full: "Média Móvel Exponencial 50 períodos",
    desc: "Tendência de médio prazo. Cruzamento com EMA20 gera sinais de entrada/saída.",
    tag: "Tendência",
  },
  {
    n: "05", name: "SMA 200", full: "Média Móvel Simples 200 períodos",
    desc: "O termômetro de longo prazo do mercado. Acima = bull market, abaixo = bear market.",
    tag: "Longo prazo",
  },
  {
    n: "06", name: "Bollinger", full: "Bandas de Bollinger",
    desc: "Envelope de volatilidade. Preço toca a banda superior/inferior pode indicar reversão.",
    tag: "Volatilidade",
  },
  {
    n: "07", name: "ATR", full: "Average True Range",
    desc: "Volatilidade absoluta do ativo. Usado no cálculo de risco e posicionamento de stop.",
    tag: "Risco",
  },
  {
    n: "08", name: "ADX", full: "Average Directional Index",
    desc: "Força da tendência. ADX >25 = tendência forte, <20 = mercado lateral sem direção.",
    tag: "Tendência",
  },
  {
    n: "09", name: "OBV", full: "On-Balance Volume",
    desc: "Fluxo acumulativo de volume. Confirma ou diverge da direção do preço.",
    tag: "Volume",
  },
  {
    n: "10", name: "VWAP", full: "Volume Weighted Average Price",
    desc: "Preço médio ponderado por volume. Referência institucional do 'preço justo' do dia.",
    tag: "Preço",
  },
];

const TAG_COLORS: Record<string, string> = {
  Momentum: "bg-primary/15 text-primary",
  Tendência: "bg-market-green/15 text-market-green",
  "Longo prazo": "bg-gold-muted text-gold",
  Volatilidade: "bg-market-yellow/15 text-market-yellow",
  Risco: "bg-market-red/15 text-market-red",
  Volume: "bg-primary/10 text-primary",
  Preço: "bg-market-green/10 text-market-green",
};

export function TechnicalIndicators() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold">
            Análise técnica
          </span>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.1]">
              10 indicadores.<br />
              <span className="text-muted-foreground font-normal">Todos em tempo real.</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Calculados localmente sobre dados históricos reais. Nenhuma estimativa, nenhum atraso.
            </p>
          </div>
        </motion.div>

        {/* Grid 2 cols */}
        <div className="grid sm:grid-cols-2 gap-3">
          {INDICATORS.map((ind, i) => (
            <motion.div
              key={ind.n}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
              className="group flex gap-4 rounded-2xl border border-border/40 bg-card/50 p-5 hover:border-border/70 hover:bg-card transition-all duration-200"
            >
              {/* Number */}
              <div className="shrink-0">
                <span className="font-mono text-[11px] font-bold text-muted-foreground/40 group-hover:text-primary transition-colors">
                  {ind.n}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-extrabold text-sm tracking-wide">{ind.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TAG_COLORS[ind.tag] ?? "bg-muted text-muted-foreground"}`}>
                    {ind.tag}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5 mb-1.5">{ind.full}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{ind.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stat */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-10 rounded-2xl border border-gold/20 bg-gold-muted p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm font-semibold text-gold">Calculados 100% no cliente</p>
            <p className="text-xs text-muted-foreground mt-1">
              Nenhum dado de análise técnica passa por um servidor — tudo roda no seu browser, com velocidade máxima.
            </p>
          </div>
          <div className="shrink-0 rounded-xl bg-gold/10 border border-gold/20 px-4 py-2 text-center">
            <p className="text-2xl font-extrabold text-gold font-mono-nums">0ms</p>
            <p className="text-[10px] text-muted-foreground">latência adicional</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
