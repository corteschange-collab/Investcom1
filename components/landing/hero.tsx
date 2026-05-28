"use client";

import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const PILLS = [
  { label: "Score 0–100", color: "var(--market-green)" },
  { label: "Indicadores técnicos", color: "var(--primary)" },
  { label: "3 cenários probabilísticos", color: "var(--market-yellow)" },
  { label: "B3 + mercados globais", color: "var(--muted-foreground)" },
];

const PROOF = [
  { n: "10+", label: "perfis de investidor\nreconhecidos" },
  { n: "7", label: "indicadores técnicos\nem tempo real" },
  { n: "3", label: "fontes de dados\nconsolidadas" },
];

export function LandingHero({ onLoginOpen }: { onLoginOpen: () => void }) {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), reduced ? 0 : 80);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40">

        {/* Background: subtle grid */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Very subtle copper glow, centered */}
          <div className="absolute top-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/5 blur-[140px]" />
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate={mounted ? "show" : "hidden"}
            className="flex flex-col items-center"
          >

            {/* Eyebrow */}
            <motion.div variants={item}>
              <span className="font-mono text-[11px] font-semibold text-primary tracking-[0.2em] uppercase mb-8 block">
                Análise de mercado com inteligência artificial
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="text-5xl sm:text-6xl lg:text-[76px] font-bold tracking-[-0.045em] leading-[1.02] text-foreground mb-0"
            >
              Clareza onde o mercado
              <br />
              <span className="relative inline-block">
                só tem ruído.
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={mounted ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 1.0, delay: 0.65, ease: EASE }}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left rounded-full bg-primary"
                />
              </span>
            </motion.h1>

            {/* Pills */}
            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap justify-center gap-2"
            >
              {PILLS.map((p) => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  {p.label}
                </span>
              ))}
            </motion.div>

            {/* Subheadline */}
            <motion.p
              variants={item}
              className="mt-7 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[560px] mx-auto"
            >
              Transformamos dados complexos — RSI, MACD, Bollinger — em{" "}
              <span className="text-foreground/80 font-medium">insights diretos</span>.
              Você entende o que está acontecendo no seu portfólio. E o que fazer com isso.
            </motion.p>

            {/* CTA */}
            <motion.div variants={item} className="mt-9 flex flex-col items-center gap-3">
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm px-8 h-12 rounded-md shadow-lg shadow-primary/15"
                onClick={onLoginOpen}
              >
                Começar gratuitamente
                <ArrowRight size={15} />
              </Button>
              <span className="text-xs text-muted-foreground">
                Sem cartão de crédito &nbsp;·&nbsp;{" "}
                <span className="text-market-green">Plano gratuito para sempre</span>
              </span>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={item}
              className="mt-14 flex items-center justify-center gap-8 sm:gap-12 flex-wrap"
            >
              {PROOF.map((p, i) => (
                <div key={p.n} className="flex items-center gap-8 sm:gap-12">
                  <div className="text-center">
                    <div className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-foreground leading-none">
                      {p.n}
                    </div>
                    <div className="mt-1.5 text-[11px] text-muted-foreground leading-snug whitespace-pre-line">
                      {p.label}
                    </div>
                  </div>
                  {i < PROOF.length - 1 && (
                    <div className="h-8 w-px bg-border hidden sm:block" />
                  )}
                </div>
              ))}
            </motion.div>

          </motion.div>
        </div>

        {/* Secondary link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-10 text-center"
        >
          <Link
            href="/dashboard"
            className="font-mono text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors tracking-wide"
          >
            Ver plataforma ao vivo →
          </Link>
        </motion.div>

      </section>
    </MotionConfig>
  );
}
