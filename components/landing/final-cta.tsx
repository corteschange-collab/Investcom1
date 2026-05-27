"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks = [
  "Grátis para sempre no plano básico",
  "Sem cartão de crédito",
  "Dados da B3 em tempo real",
  "Cancele quando quiser",
];

export function FinalCTA({ onLoginOpen }: { onLoginOpen: () => void }) {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Comece a investir{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              com mais clareza
            </span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
            Junte-se a mais de 14.000 investidores que já usam análise técnica real para tomar decisões melhores.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 font-semibold text-base px-8"
              onClick={onLoginOpen}
            >
              Criar conta grátis
              <ArrowRight size={18} />
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle size={14} className="text-market-green shrink-0" />
                {p}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
