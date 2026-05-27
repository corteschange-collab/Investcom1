"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    description: "Para quem está começando a investir.",
    cta: "Criar conta grátis",
    href: "/sign-up",
    featured: false,
    features: [
      "5 ativos na watchlist",
      "Gráfico com dados históricos",
      "Indicadores básicos (RSI, MACD)",
      "Score InvestAI",
      "Área educacional completa",
      "2 alertas de preço",
    ],
  },
  {
    name: "Premium",
    price: "R$ 29",
    period: "por mês",
    description: "Para investidores que querem análise completa.",
    cta: "Assinar Premium",
    href: "/sign-up?plan=premium",
    featured: true,
    features: [
      "Watchlists ilimitadas",
      "Todos os indicadores técnicos",
      "IA assistente financeira",
      "Cenários probabilísticos detalhados",
      "Alertas ilimitados",
      "Análise fundamentalista completa",
      "Simuladores avançados",
      "Suporte prioritário",
    ],
  },
];

export function LandingPricing() {
  return (
    <section id="precos" className="py-24 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-medium text-primary">Preços</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Simples e transparente
          </h2>
          <p className="mt-3 text-muted-foreground">
            Comece grátis, evolua quando quiser.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl grid gap-6 md:grid-cols-2">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-6 ${
                plan.featured
                  ? "border-primary/60 bg-primary/5 shadow-xl shadow-primary/10"
                  : "border-border/50 bg-card"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 bg-primary text-white px-3">
                    <Zap size={11} />
                    Mais popular
                  </Badge>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-base font-semibold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mb-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={14} className="mt-0.5 shrink-0 text-market-green" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="block">
                <Button
                  className={`w-full ${plan.featured ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" : ""}`}
                  variant={plan.featured ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
