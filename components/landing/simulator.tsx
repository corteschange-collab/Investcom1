"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Calculator, TrendingUp } from "lucide-react";

const PROFILES = [
  { key: "conservador", label: "Conservador", rate: 0.07, color: "var(--market-yellow)", desc: "Renda fixa, Tesouro Selic, CDB" },
  { key: "moderado", label: "Moderado", rate: 0.12, color: "var(--primary)", desc: "Mix de renda fixa + ações" },
  { key: "agressivo", label: "Agressivo", rate: 0.18, color: "var(--market-green)", desc: "Maior exposição em ações" },
] as const;

type Profile = typeof PROFILES[number]["key"];

function calcGrowth(monthly: number, years: number, rate: number) {
  const points = [];
  const monthlyRate = rate / 12;
  let total = 0;
  let invested = 0;
  for (let y = 0; y <= years; y++) {
    if (y > 0) {
      for (let m = 0; m < 12; m++) {
        total = (total + monthly) * (1 + monthlyRate);
        invested += monthly;
      }
    }
    points.push({
      year: `Ano ${y}`,
      valor: Math.round(total),
      investido: invested,
    });
  }
  return points;
}

function fmt(v: number) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}K`;
  return `R$ ${v.toLocaleString("pt-BR")}`;
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; dataKey: string; color: string }[];
  label?: string;
}

function SimTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-xs space-y-1.5 min-w-[160px]">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span className="text-muted-foreground">{p.dataKey === "valor" ? "Patrimônio" : "Investido"}</span>
          <span className="font-bold font-mono-nums" style={{ color: p.color }}>
            {fmt(p.value)}
          </span>
        </div>
      ))}
      {payload.length === 2 && (
        <div className="flex justify-between gap-4 border-t border-border/50 pt-1.5">
          <span className="text-muted-foreground">Rendimento</span>
          <span className="font-bold text-market-green font-mono-nums">
            {fmt(payload[0].value - payload[1].value)}
          </span>
        </div>
      )}
    </div>
  );
}

export function Simulator() {
  const [monthly, setMonthly] = useState(300);
  const [years, setYears] = useState(10);
  const [profile, setProfile] = useState<Profile>("moderado");

  const activeProfile = PROFILES.find((p) => p.key === profile)!;
  const data = useMemo(() => calcGrowth(monthly, years, activeProfile.rate), [monthly, years, activeProfile.rate]);
  const last = data[data.length - 1];
  const totalInvested = monthly * 12 * years;
  const earnings = last.valor - totalInvested;

  return (
    <section id="simulador" className="py-24 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary">Simulador gratuito</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Quanto seu dinheiro pode virar?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-sm">
            Simule o crescimento dos seus investimentos. Ajuste o aporte, o prazo e o perfil e veja o resultado em tempo real.
          </p>
        </motion.div>

        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-xl shadow-black/20">
          <div className="grid lg:grid-cols-5">
            {/* Controls */}
            <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r border-border/50 space-y-6">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Calculator size={16} className="text-primary" />
                Configurar simulação
              </div>

              {/* Monthly amount */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <label className="text-muted-foreground">Aporte mensal</label>
                  <span className="font-bold font-mono-nums">
                    R$ {monthly.toLocaleString("pt-BR")}
                  </span>
                </div>
                <input
                  type="range" min={50} max={5000} step={50}
                  value={monthly}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  className="w-full h-2 rounded-full bg-border appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>R$ 50</span><span>R$ 5.000</span>
                </div>
              </div>

              {/* Years */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <label className="text-muted-foreground">Período</label>
                  <span className="font-bold font-mono-nums">{years} anos</span>
                </div>
                <input
                  type="range" min={1} max={30} step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 rounded-full bg-border appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>1 ano</span><span>30 anos</span>
                </div>
              </div>

              {/* Profile selector */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Perfil de risco</label>
                <div className="space-y-2">
                  {PROFILES.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setProfile(p.key)}
                      className={`w-full rounded-xl border p-3 text-left transition-all duration-200 ${
                        profile === p.key
                          ? "border-primary/50 bg-primary/8"
                          : "border-border/40 hover:border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-sm font-semibold ${profile === p.key ? "text-primary" : ""}`}>
                            {p.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{p.desc}</div>
                        </div>
                        <div className={`text-xs font-bold ${profile === p.key ? "text-primary" : "text-muted-foreground"}`}>
                          {(p.rate * 100).toFixed(0)}% a.a.
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3 p-6 space-y-5">
              {/* Key numbers */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Patrimônio final", value: fmt(last.valor), highlight: true },
                  { label: "Total investido", value: fmt(totalInvested), highlight: false },
                  { label: "Rendimento", value: fmt(earnings > 0 ? earnings : 0), highlight: false, green: true },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    className={`rounded-xl border p-3 ${
                      item.highlight ? "border-primary/40 bg-primary/8" : "border-border/40 bg-background"
                    }`}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-[10px] text-muted-foreground">{item.label}</div>
                    <div className={`text-base font-bold font-mono-nums mt-1 ${
                      item.highlight ? "text-primary" : item.green ? "text-market-green" : ""
                    }`}>
                      {item.value}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chart */}
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="simGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeProfile.color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={activeProfile.color} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="simGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="year" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickLine={false} axisLine={false} interval={Math.floor(data.length / 4)} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => fmt(v)} width={64} />
                  <Tooltip content={<SimTooltip />} />
                  <Area type="monotone" dataKey="investido" stroke="var(--muted-foreground)" strokeWidth={1.5} fill="url(#simGrad2)" dot={false} strokeDasharray="4 2" />
                  <Area type="monotone" dataKey="valor" stroke={activeProfile.color} strokeWidth={2.5} fill="url(#simGrad1)" dot={false} activeDot={{ r: 5, fill: activeProfile.color }} />
                </AreaChart>
              </ResponsiveContainer>

              <p className="text-[10px] text-muted-foreground/60 text-center">
                Simulação baseada em rendimento anual fixo. Resultados reais variam conforme o mercado. Não é garantia de retorno.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
