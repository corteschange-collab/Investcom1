"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

const TF_DATA: Record<string, { date: string; value: number }[]> = {
  "1M": [
    { date: "01/04", value: 34.2 }, { date: "05/04", value: 35.1 },
    { date: "10/04", value: 33.8 }, { date: "15/04", value: 36.4 },
    { date: "20/04", value: 37.0 }, { date: "25/04", value: 36.1 },
    { date: "30/04", value: 38.4 },
  ],
  "3M": [
    { date: "Fev", value: 31.0 }, { date: "Mar", value: 33.5 },
    { date: "Abr", value: 38.4 },
  ],
  "6M": [
    { date: "Nov", value: 27.4 }, { date: "Dez", value: 29.1 },
    { date: "Jan", value: 30.8 }, { date: "Fev", value: 31.0 },
    { date: "Mar", value: 33.5 }, { date: "Abr", value: 38.4 },
  ],
  "1A": [
    { date: "Mai/24", value: 24.1 }, { date: "Ago/24", value: 26.8 },
    { date: "Nov/24", value: 27.4 }, { date: "Fev/25", value: 31.0 },
    { date: "Abr/25", value: 38.4 },
  ],
};

const tickers = [
  { s: "PETR4", p: "38.42", c: "+2.14%", pos: true },
  { s: "VALE3", p: "67.80", c: "-0.92%", pos: false },
  { s: "WEGE3", p: "48.20", c: "+1.45%", pos: true },
  { s: "MXRF11", p: "10.18", c: "+0.69%", pos: true },
  { s: "BOVA11", p: "125.40", c: "+0.81%", pos: true },
  { s: "BBAS3", p: "24.80", c: "-1.22%", pos: false },
];

function MiniTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-lg">
      <span className="font-bold font-mono-nums text-market-green">
        R$ {payload[0].value.toFixed(2)}
      </span>
    </div>
  );
}

export function LandingHero({ onLoginOpen }: { onLoginOpen: () => void }) {
  const [tf, setTf] = useState("1M");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-primary/6 blur-[140px]" />
        <div className="absolute top-1/2 -right-60 h-[400px] w-[400px] rounded-full bg-market-green/4 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — Copy */}
          <div ref={ref}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-5 gap-1.5 border-primary/30 bg-primary/8 px-3 py-1.5 text-primary text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Plataforma de análise para a B3
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]"
            >
              Veja o mercado{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                  com clareza
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg"
            >
              Análise técnica, indicadores reais e IA que explica o que os gráficos
              significam — em português, sem enrolação. Para quem quer investir melhor,
              com qualquer valor.
            </motion.p>

            {/* Value props inline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="mt-6 flex flex-col sm:flex-row gap-2"
            >
              {["Dados da B3 em tempo real", "IA que explica cada sinal", "Grátis para começar"].map((v) => (
                <span key={v} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-market-green" />
                  {v}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-semibold"
                onClick={onLoginOpen}
              >
                Criar conta grátis
                <ArrowRight size={16} />
              </Button>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="gap-2 border-border/60 w-full sm:w-auto">
                  <Play size={14} className="fill-current" />
                  Ver demonstração
                </Button>
              </Link>
            </motion.div>

            {/* Mini ticker row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-2"
            >
              {tickers.map((t) => (
                <div key={t.s} className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-card/60 px-2.5 py-1.5">
                  <span className="font-mono text-[11px] font-bold text-foreground/70">{t.s}</span>
                  <span className="font-mono-nums text-[11px]">{t.p}</span>
                  <span className={`text-[10px] font-medium flex items-center gap-0.5 ${t.pos ? "text-market-green" : "text-market-red"}`}>
                    {t.pos ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {t.c}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Live chart widget */}
          <motion.div
            initial={{ opacity: 0, x: 32, scale: 0.97 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/40 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-border/50 bg-surface px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-market-red/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-market-yellow/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-market-green/60" />
                <span className="ml-3 text-[11px] text-muted-foreground font-mono">InvestAI — Análise PETR4</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm">PETR4</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/40 text-primary">Análise ativa</Badge>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold font-mono-nums">R$ 38,42</span>
                      <span className="text-sm font-medium text-market-green">+2,14%</span>
                    </div>
                  </div>
                  {/* Timeframe selector */}
                  <div className="flex gap-1 rounded-lg bg-muted p-0.5">
                    {Object.keys(TF_DATA).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTf(t)}
                        className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                          tf === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={TF_DATA[tf]} margin={{ top: 4, right: 0, bottom: 0, left: -28 }}>
                    <defs>
                      <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--market-green)" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="var(--market-green)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<MiniTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="var(--market-green)" strokeWidth={2} fill="url(#heroGrad)" dot={false} activeDot={{ r: 4, fill: "var(--market-green)", stroke: "var(--card)", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>

                {/* Indicator pills */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "RSI 14", value: "58.2", signal: "Neutro", color: "text-market-yellow" },
                    { label: "MACD", value: "+0.34", signal: "Compra", color: "text-market-green" },
                    { label: "Score", value: "72/100", signal: "Bom", color: "text-primary" },
                  ].map((ind) => (
                    <div key={ind.label} className="rounded-lg bg-background border border-border/40 p-2.5 text-center">
                      <div className="text-[10px] text-muted-foreground">{ind.label}</div>
                      <div className="text-sm font-bold font-mono-nums mt-0.5">{ind.value}</div>
                      <div className={`text-[10px] font-medium mt-0.5 ${ind.color}`}>{ind.signal}</div>
                    </div>
                  ))}
                </div>

                {/* IA insight */}
                <div className="rounded-xl bg-primary/8 border border-primary/20 p-3 flex gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary text-xs font-bold mt-0.5">IA</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-medium">PETR4 apresenta sinais moderados de alta.</span>{" "}
                    RSI em zona neutra, MACD acima da linha de sinal. Preço acima da EMA20. Probabilidade de continuação de alta: <span className="text-market-green font-semibold">62%</span>.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
