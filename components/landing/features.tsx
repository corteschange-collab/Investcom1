"use client";

import { motion } from "framer-motion";
import {
  BarChart2,
  Brain,
  Bell,
  BookOpen,
  ShieldCheck,
  Gauge,
  TrendingUp,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA Assistente Financeira",
    description:
      "Explica gráficos, indicadores e sinais em linguagem simples. Sem jargão técnico — direto ao ponto.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BarChart2,
    title: "Análise Técnica Completa",
    description:
      "RSI, MACD, Bollinger, EMA, VWAP, ATR e mais de 15 indicadores calculados em tempo real.",
    color: "text-market-green",
    bg: "bg-market-green/10",
  },
  {
    icon: Gauge,
    title: "Score Proprietário",
    description:
      "Score 0-100 que combina força técnica, fundamentos, risco e dividendos em um único número.",
    color: "text-market-yellow",
    bg: "bg-market-yellow/10",
  },
  {
    icon: TrendingUp,
    title: "Cenários Probabilísticos",
    description:
      "Probabilidades de alta, baixa e neutro com base em múltiplos indicadores. Nunca certezas absolutas.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description:
      "Alertas de preço, RSI, rompimento de suporte/resistência e oportunidades de mercado.",
    color: "text-market-red",
    bg: "bg-market-red/10",
  },
  {
    icon: Layers,
    title: "Ações, FIIs e ETFs",
    description:
      "Análise completa para todos os ativos da B3. Stocks, fundos imobiliários e ETFs em um só lugar.",
    color: "text-market-green",
    bg: "bg-market-green/10",
  },
  {
    icon: BookOpen,
    title: "Área Educacional",
    description:
      "Aprenda a investir do zero. Conteúdo feito para quem quer construir patrimônio com qualquer renda.",
    color: "text-market-yellow",
    bg: "bg-market-yellow/10",
  },
  {
    icon: ShieldCheck,
    title: "Seguro e Confiável",
    description:
      "Autenticação segura, LGPD compliant, dados criptografados. Sua privacidade é prioridade.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export function LandingFeatures() {
  return (
    <section id="recursos" className="py-24 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-medium text-primary">Recursos</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Tudo que você precisa para investir melhor
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Uma plataforma completa de análise financeira, com inteligência
            artificial e dados da B3, acessível para qualquer investidor.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-2xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:bg-card/80 transition-all duration-200"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.bg} ${f.color} mb-3`}>
                <f.icon size={20} />
              </div>
              <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
