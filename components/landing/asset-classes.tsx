"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const CLASSES = [
  {
    id: "acoes",
    label: "Ações",
    icon: "📈",
    risk: 4,
    count: "400+ ativos",
    desc: "Participação societária em empresas listadas na B3.",
    sub: ["Blue chips — grandes empresas consolidadas", "Dividendos — pagadoras consistentes", "Small caps — alto potencial de crescimento", "Growth — expansão acelerada de receita", "Setorial — por setor da economia"],
    color: "border-primary/30 hover:border-primary/60",
    iconBg: "bg-primary/15",
  },
  {
    id: "etfs",
    label: "ETFs",
    icon: "🧩",
    risk: 3,
    count: "50+ fundos",
    desc: "Fundos negociados em bolsa que replicam índices e estratégias.",
    sub: ["IBOVESPA — índice principal da B3", "Dividendos — carteiras de alta renda", "Internacional — S&P 500, Nasdaq, global", "Setorial — tech, imóveis, agro, energia"],
    color: "border-market-green/30 hover:border-market-green/60",
    iconBg: "bg-market-green/15",
  },
  {
    id: "fiis",
    label: "FIIs",
    icon: "🏢",
    risk: 2,
    count: "400+ fundos",
    desc: "Fundos Imobiliários com rendimentos mensais isentos de IR.",
    sub: ["Papel — CRI, LCI e recebíveis imobiliários", "Tijolo — imóveis físicos em carteira", "FOF — fundo de fundos imobiliários", "Logística — galpões e centros de distribuição", "Shopping e Lajes Corporativas"],
    color: "border-market-yellow/30 hover:border-market-yellow/60",
    iconBg: "bg-market-yellow/15",
  },
  {
    id: "bdrs",
    label: "BDRs",
    icon: "🌎",
    risk: 4,
    count: "500+ certificados",
    desc: "Certificados de ações e ETFs internacionais negociados na B3.",
    sub: ["Ações internacionais — Apple, Tesla, Google, etc.", "ETFs globais — replicam índices mundiais"],
    color: "border-primary/30 hover:border-primary/60",
    iconBg: "bg-primary/15",
  },
  {
    id: "renda-fixa",
    label: "Renda Fixa",
    icon: "🏦",
    risk: 1,
    count: "Tesouro + privados",
    desc: "Instrumentos de dívida com retorno previsível e proteção de capital.",
    sub: ["Tesouro Selic — liquidez diária e segurança máxima", "Tesouro IPCA+ — proteção contra inflação", "Tesouro Prefixado — taxa travada no momento da compra", "CDB / LCI / LCA — crédito bancário com garantia FGC", "CRI / CRA / Debêntures — crédito privado"],
    color: "border-market-green/30 hover:border-market-green/60",
    iconBg: "bg-market-green/15",
  },
  {
    id: "cripto",
    label: "Cripto",
    icon: "₿",
    risk: 5,
    count: "6 principais",
    desc: "Criptomoedas de maior liquidez e capitalização global.",
    sub: ["Bitcoin (BTC) — reserva de valor digital", "Ethereum (ETH) — plataforma de contratos inteligentes", "BNB, SOL, ADA, XRP — principais altcoins"],
    color: "border-market-red/30 hover:border-market-red/60",
    iconBg: "bg-market-red/15",
  },
  {
    id: "commodities",
    label: "Commodities",
    icon: "⚡",
    risk: 4,
    count: "7 mercados",
    desc: "Matérias-primas e produtos primários negociados globalmente.",
    sub: ["Metais — Ouro, Prata, Cobre", "Energia — Petróleo Brent e WTI", "Agro — Soja, Milho, Açúcar"],
    color: "border-market-yellow/30 hover:border-market-yellow/60",
    iconBg: "bg-market-yellow/15",
  },
  {
    id: "fundos",
    label: "Fundos",
    icon: "🎯",
    risk: 3,
    count: "Referência",
    desc: "Fundos multimercado e de ações como referência de benchmark.",
    sub: ["Multimercado — estratégias diversificadas", "Ações — carteiras geridas ativamente", "Cambial — exposição ao dólar"],
    color: "border-primary/30 hover:border-primary/60",
    iconBg: "bg-primary/15",
  },
  {
    id: "indices",
    label: "Índices",
    icon: "📊",
    risk: 0,
    count: "8 índices",
    desc: "Termômetros do mercado — referências para benchmarking.",
    sub: ["IBOVESPA, IFIX, CDI, SELIC", "S&P 500, Nasdaq, MSCI World", "Dólar (USD/BRL), Euro"],
    color: "border-market-green/30 hover:border-market-green/60",
    iconBg: "bg-market-green/15",
  },
];

function RiskDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i <= level
              ? level <= 2 ? "bg-market-green" : level <= 3 ? "bg-market-yellow" : "bg-market-red"
              : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

export function AssetClasses() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section ref={ref} className="py-28 section-navy relative overflow-hidden">
      <div className="gradient-line absolute top-0 left-0 right-0 opacity-30" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold">
            Cobertura completa
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.1]">
            9 classes de ativos
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            Do Tesouro Selic ao Bitcoin — análise unificada, mesma plataforma, mesmo rigor.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CLASSES.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => setOpen(open === cls.id ? null : cls.id)}
                className={`w-full text-left rounded-2xl border ${cls.color} bg-card/50 p-5 transition-all duration-200 hover:bg-card`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-xl ${cls.iconBg} flex items-center justify-center text-lg shrink-0`}>
                      {cls.icon}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{cls.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{cls.count}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <RiskDots level={cls.risk} />
                    <motion.div
                      animate={{ rotate: open === cls.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} className="text-muted-foreground" />
                    </motion.div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{cls.desc}</p>

                <AnimatePresence>
                  {open === cls.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
                        {cls.sub.map((s) => (
                          <div key={s} className="flex items-start gap-2">
                            <div className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/40 shrink-0" />
                            <p className="text-[11px] text-muted-foreground">{s}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Risk legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-8 flex items-center justify-center gap-6"
        >
          <span className="text-xs text-muted-foreground">Nível de risco:</span>
          {[
            { dots: 1, label: "Baixo", color: "bg-market-green" },
            { dots: 3, label: "Moderado", color: "bg-market-yellow" },
            { dots: 5, label: "Alto", color: "bg-market-red" },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${r.color}`} />
              <span className="text-xs text-muted-foreground">{r.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="gradient-line absolute bottom-0 left-0 right-0 opacity-30" />
    </section>
  );
}
