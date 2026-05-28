"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const PROFILES = [
  {
    id: "iniciante",
    n: "01",
    label: "Iniciante",
    tagline: "Começando do zero",
    icon: "🌱",
    color: "#22C55E",
    desc: "Aprendendo os conceitos básicos. Prefere explicações didáticas e evita jargão técnico. A plataforma ajusta a linguagem e destaca educação.",
    traits: ["Poupança e Tesouro Selic", "Aprendizado guiado passo a passo", "Baixa tolerância a volatilidade"],
  },
  {
    id: "conservador",
    n: "02",
    label: "Conservador",
    tagline: "Segurança acima de tudo",
    icon: "🛡️",
    color: "#22C55E",
    desc: "Preservação do capital em primeiro lugar. Aceita retornos menores em troca de previsibilidade e proteção contra perdas.",
    traits: ["Renda fixa predominante (>80%)", "Liquidez diária prioritária", "CDI+ e IPCA+ como benchmarks"],
  },
  {
    id: "protecao",
    n: "03",
    label: "Proteção",
    tagline: "Hedge e estabilidade",
    icon: "⚓",
    color: "#A0714F",
    desc: "Busca proteção estrutural contra inflação e crises sistêmicas. Usa ativos descorrelacionados como âncora da carteira.",
    traits: ["Tesouro IPCA+ longo prazo", "Ouro e commodities como hedge", "Diversificação cambial (USD)"],
  },
  {
    id: "dividendos",
    n: "04",
    label: "Dividendos",
    tagline: "Renda passiva consistente",
    icon: "💰",
    color: "#A0714F",
    desc: "Constrói carteira geradora de renda. Foca em proventos recorrentes, histórico de pagamentos e crescimento de dividendos.",
    traits: ["DY mínimo de 6% ao ano", "FIIs de tijolo e papel", "Dividend growth investing"],
  },
  {
    id: "moderado",
    n: "05",
    label: "Moderado",
    tagline: "Equilíbrio inteligente",
    icon: "⚖️",
    color: "#A0714F",
    desc: "Carteira balanceada que aceita oscilações de curto prazo por retornos superiores no horizonte de médio e longo prazo.",
    traits: ["60% variável / 40% fixo", "Rebalanceamento semestral", "Diversificação por setor"],
  },
  {
    id: "longo-prazo",
    n: "06",
    label: "Longo Prazo",
    tagline: "Décadas à frente",
    icon: "🌳",
    color: "#A0714F",
    desc: "Investe pensando em aposentadoria e legado. Ignora ruído de curto prazo. Deixa juros compostos trabalharem por décadas.",
    traits: ["Buy & Hold estratégico", "ETFs de índice global", "Foco em juros compostos"],
  },
  {
    id: "crescimento",
    n: "07",
    label: "Crescimento",
    tagline: "Alto potencial de valorização",
    icon: "🚀",
    color: "#A0714F",
    desc: "Busca empresas em expansão acelerada. Aceita valuations elevados e maior volatilidade em troca de crescimento de receita.",
    traits: ["Small caps e empresas growth", "P/L elevado é aceitável", "Tech, saúde, inovação"],
  },
  {
    id: "arrojado",
    n: "08",
    label: "Arrojado",
    tagline: "Alta tolerância ao risco",
    icon: "🎯",
    color: "#EF4444",
    desc: "Confortável com volatilidade extrema. Concentra posições em convicções fortes e usa o mercado para criar assimetrias.",
    traits: ["Posições concentradas (>20%)", "Drawdowns de 30%+ tolerados", "Visão contrarian e ciclos"],
  },
  {
    id: "explorador",
    n: "09",
    label: "Explorador",
    tagline: "Sem fronteiras geográficas",
    icon: "🌎",
    color: "#EF4444",
    desc: "Investe globalmente como parte central da estratégia. BDRs, ETFs internacionais e cripto formam núcleo da carteira.",
    traits: ["BDRs e ETFs globais", "Exposição estrutural em dólar", "Cripto como posição satélite"],
  },
  {
    id: "trader",
    n: "10",
    label: "Trader",
    tagline: "Operações táticas",
    icon: "⚡",
    color: "#EF4444",
    desc: "Opera tendências de curto e médio prazo com análise técnica rigorosa. Gestão de risco por operação é inegociável.",
    traits: ["Stop loss obrigatório em toda operação", "Swing e position trade", "RSI, MACD e volume como guias"],
  },
];

export function InvestorProfiles() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [selected, setSelected] = useState(PROFILES[0]);

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold">
            Personalização
          </span>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.1]">
              10 perfis.<br />
              <span className="text-muted-foreground font-normal">Uma plataforma que te entende.</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              A IA ajusta linguagem, métricas em destaque e recomendações conforme seu perfil de investidor.
            </p>
          </div>
        </motion.div>

        {/* Desktop: split panel editorial */}
        <div className="hidden lg:grid lg:grid-cols-[300px_1fr] gap-6">

          {/* Left: numbered list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-0.5"
          >
            {PROFILES.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.12 + i * 0.04 }}
                onClick={() => setSelected(p)}
                className={`w-full flex items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-150 group ${
                  selected.id === p.id
                    ? "bg-card border border-border/60"
                    : "hover:bg-card/40"
                }`}
              >
                <span
                  className="font-mono text-[11px] font-bold shrink-0 transition-colors"
                  style={{ color: selected.id === p.id ? p.color : "oklch(0.33 0 0)" }}
                >
                  {p.n}
                </span>
                <span className="text-base shrink-0">{p.icon}</span>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold transition-colors ${selected.id === p.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {p.label}
                  </p>
                  {selected.id === p.id && (
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{p.tagline}</p>
                  )}
                </div>
                {selected.id === p.id && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Right: detail panel */}
          <div className="relative min-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-border/40 bg-card/50 p-8 h-full relative overflow-hidden"
              >
                {/* Large watermark number */}
                <span
                  className="absolute -top-4 -right-2 font-display font-bold select-none pointer-events-none leading-none"
                  style={{
                    fontSize: "clamp(6rem, 15vw, 10rem)",
                    color: `${selected.color}08`,
                    letterSpacing: "-0.05em",
                  }}
                >
                  {selected.n}
                </span>

                <div className="relative z-10">
                  {/* Icon + label */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: `${selected.color}20` }}
                    >
                      {selected.icon}
                    </div>
                    <div>
                      <p
                        className="font-display text-3xl font-bold tracking-[-0.03em]"
                        style={{ color: selected.color }}
                      >
                        {selected.label}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">{selected.tagline}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-lg">
                    {selected.desc}
                  </p>

                  {/* Traits */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest">
                      Características
                    </p>
                    {selected.traits.map((t, i) => (
                      <motion.div
                        key={t}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.07 }}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="h-px flex-1 max-w-[24px]"
                          style={{ backgroundColor: `${selected.color}60` }}
                        />
                        <p className="text-sm text-foreground/80">{t}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: accordion grid */}
        <div className="grid sm:grid-cols-2 gap-2 lg:hidden">
          {PROFILES.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <button
                onClick={() => setSelected(selected.id === p.id ? PROFILES[0] : p)}
                className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
                  selected.id === p.id
                    ? "border-border/70 bg-card"
                    : "border-border/30 bg-card/30 hover:bg-card/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold text-muted-foreground/40">{p.n}</span>
                  <span>{p.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="text-[11px] text-muted-foreground">{p.tagline}</p>
                  </div>
                </div>
                <AnimatePresence>
                  {selected.id === p.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{p.desc}</p>
                      <div className="mt-2 space-y-1">
                        {p.traits.map((t) => (
                          <div key={t} className="flex items-start gap-2">
                            <div className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/30 shrink-0" />
                            <p className="text-[11px] text-muted-foreground">{t}</p>
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

        {/* Quiz CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gold/20 bg-gold-muted px-6 py-5"
        >
          <div>
            <p className="text-sm font-semibold text-gold">Não sabe qual é o seu perfil?</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Quiz de 8 perguntas. A IA identifica seu perfil em 2 minutos e personaliza toda a experiência.
            </p>
          </div>
          <div className="shrink-0 font-mono text-xs text-gold/60 border border-gold/20 rounded-lg px-3 py-2">
            quiz disponível no app
          </div>
        </motion.div>
      </div>
    </section>
  );
}
