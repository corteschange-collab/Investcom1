"use client";

import { motion } from "framer-motion";
import { Search, BarChart2, Brain } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Busque qualquer ativo",
    description:
      "Digite o ticker (PETR4, MXRF11, BOVA11...) e acesse dados em tempo real da B3 instantaneamente.",
  },
  {
    step: "02",
    icon: BarChart2,
    title: "Veja a análise completa",
    description:
      "Gráfico interativo, indicadores técnicos, fundamentos e nosso score proprietário de 0 a 100.",
  },
  {
    step: "03",
    icon: Brain,
    title: "Tome decisões informadas",
    description:
      "Nossa IA interpreta os dados, gera cenários probabilísticos e explica tudo em linguagem simples.",
  },
];

export function LandingHowItWorks() {
  return (
    <section id="como-funciona" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-medium text-primary">Como funciona</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Análise profissional em 3 passos
          </h2>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-lg shadow-primary/10 mb-4">
                <step.icon size={28} />
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
