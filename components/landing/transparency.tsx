"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CAN_DO = [
  "Calcular RSI, MACD, Bollinger e mais 7 indicadores em tempo real",
  "Gerar Score 0–100 com breakdown por dimensão ponderada",
  "Mostrar 3 cenários probabilísticos com base em histórico real",
  "Explicar indicadores em linguagem clara adaptada ao seu perfil",
  "Comparar ativos lado a lado — preço, score e indicadores",
  "Alertar quando indicadores cruzarem limiares configurados",
  "Buscar dados fundamentais: P/L, ROE, DY, dívida e margens",
];

const CANNOT_DO = [
  "Garantir que um ativo vai subir ou cair",
  "Substituir um assessor de investimentos certificado (CFP/CEA)",
  "Acessar sua conta em corretora ou executar ordens",
  "Usar informações privilegiadas ou dados exclusivos",
  "Garantir adequação ao seu perfil fiscal ou tributário",
  "Prever o futuro — análise estatística não é certeza",
];

const CAVEATS = [
  {
    code: "01",
    title: "Dados com possível atraso",
    desc: "Cotações têm até 30s de delay durante o pregão. Dados históricos podem ter gaps em feriados e eventos corporativos.",
  },
  {
    code: "02",
    title: "Indicadores são ferramentas",
    desc: "RSI em 70 não significa venda automática. Cada sinal deve ser interpretado em conjunto com o contexto do ativo.",
  },
  {
    code: "03",
    title: "Score é relativo ao ativo",
    desc: "Score 80 em uma small cap ≠ Score 80 em uma blue chip. Mercados diferentes, volatilidades diferentes, bases diferentes.",
  },
];

export function Transparency() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-28 section-navy relative overflow-hidden">
      <div className="gradient-line absolute top-0 left-0 right-0 opacity-30" />

      {/* Decorative vertical lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[20%] top-0 bottom-0 w-px bg-border/20" />
        <div className="absolute left-[80%] top-0 bottom-0 w-px bg-border/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-20"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold">
            Honestidade radical
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.1] max-w-2xl">
            O assistente não é oráculo.<br />
            <span className="text-muted-foreground font-normal">É uma ferramenta precisa.</span>
          </h2>
        </motion.div>

        {/* Main dual-column with dramatic typographic labels */}
        <div className="grid lg:grid-cols-2 gap-0 mb-16">

          {/* PODE */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="pr-0 lg:pr-12 pb-12 lg:pb-0 border-b lg:border-b-0 lg:border-r border-border/30"
          >
            {/* Label */}
            <div className="flex items-baseline gap-4 mb-8">
              <span
                className="font-display font-bold leading-none select-none"
                style={{ fontSize: "clamp(3.5rem, 8vw, 5rem)", color: "var(--market-green)", opacity: 0.9 }}
              >
                SIM.
              </span>
              <span className="text-xs text-market-green/60 font-mono uppercase tracking-widest">
                7 capacidades
              </span>
            </div>

            <div className="space-y-4">
              {CAN_DO.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                  className="group flex items-start gap-4"
                >
                  <span className="font-mono text-[10px] font-bold text-market-green/30 shrink-0 mt-0.5 w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* NÃO PODE */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="pt-12 lg:pt-0 lg:pl-12"
          >
            {/* Label */}
            <div className="flex items-baseline gap-4 mb-8">
              <span
                className="font-display font-bold leading-none select-none"
                style={{ fontSize: "clamp(3.5rem, 8vw, 5rem)", color: "var(--market-red)", opacity: 0.9 }}
              >
                NÃO.
              </span>
              <span className="text-xs text-market-red/60 font-mono uppercase tracking-widest">
                6 limites
              </span>
            </div>

            <div className="space-y-4">
              {CANNOT_DO.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                  className="group flex items-start gap-4"
                >
                  <span className="font-mono text-[10px] font-bold text-market-red/30 shrink-0 mt-0.5 w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Caveats — horizontal row with terminal codes */}
        <div className="grid sm:grid-cols-3 gap-4">
          {CAVEATS.map((c, i) => (
            <motion.div
              key={c.code}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.55 + i * 0.09 }}
              className="rounded-xl border border-market-yellow/15 bg-market-yellow/5 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-[10px] font-bold text-market-yellow/50 border border-market-yellow/20 rounded px-1.5 py-0.5">
                  AVISO {c.code}
                </span>
              </div>
              <p className="text-xs font-semibold text-market-yellow/80 mb-1.5">{c.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Legal */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.85 }}
          className="mt-10 text-center text-[11px] text-muted-foreground/40 max-w-2xl mx-auto leading-relaxed font-mono"
        >
          InvestAI é uma ferramenta educacional e analítica. Não é registrada na CVM como assessora de valores
          mobiliários. Toda decisão de investimento é de responsabilidade exclusiva do usuário.
        </motion.p>
      </div>

      <div className="gradient-line absolute bottom-0 left-0 right-0 opacity-30" />
    </section>
  );
}
