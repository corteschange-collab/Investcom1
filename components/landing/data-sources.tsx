"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const SOURCES = [
  {
    id: "brapi",
    name: "BRAPI.DEV",
    badge: "B3 OFICIAL",
    badgeColor: "text-primary border-primary/30 bg-primary/10",
    accentColor: "#A0714F",
    feed: "MERCADO BRASILEIRO",
    items: [
      { key: "COTAÇÕES AO VIVO", freq: "30s", live: true },
      { key: "HISTÓRICO OHLCV", freq: "DIÁRIO", live: false },
      { key: "DADOS FUNDAMENTAIS", freq: "TRIMESTRAL", live: false },
      { key: "DIVIDENDOS / JCP", freq: "POR EVENTO", live: false },
      { key: "COMPOSIÇÃO ÍNDICES", freq: "MENSAL", live: false },
    ],
  },
  {
    id: "yahoo",
    name: "YAHOO FINANCE",
    badge: "GLOBAL",
    badgeColor: "text-gold border-gold/30 bg-gold-muted",
    accentColor: "#C08868",
    feed: "MERCADOS INTERNACIONAIS",
    items: [
      { key: "PREÇOS GLOBAIS", freq: "TEMPO REAL", live: true },
      { key: "ETFs INTERNACIONAIS", freq: "DIÁRIO", live: false },
      { key: "CRIPTOMOEDAS", freq: "1 MIN", live: true },
      { key: "COMMODITIES", freq: "15 MIN", live: false },
      { key: "BDRs / ADRs", freq: "30s", live: true },
    ],
  },
  {
    id: "bcb",
    name: "BCB — BACEN",
    badge: "BANCO CENTRAL",
    badgeColor: "text-market-green border-market-green/30 bg-market-green/10",
    accentColor: "#22C55E",
    feed: "MACROECONOMIA BR",
    items: [
      { key: "TAXA SELIC", freq: "REUNIÃO COPOM", live: false },
      { key: "IPCA ACUMULADO", freq: "MENSAL", live: false },
      { key: "CDI DIÁRIO", freq: "DIÁRIO", live: false },
      { key: "CÂMBIO PTAX", freq: "DIÁRIO", live: false },
      { key: "FOCUS / EXPECTATIVAS", freq: "SEMANAL", live: false },
    ],
  },
];

export function DataSources() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/4 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold">
            Transparência total
          </span>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.1]">
              De onde vêm<br />
              <span className="text-muted-foreground font-normal">os dados.</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Nenhuma fonte proprietária misteriosa. APIs públicas consolidadas, auditáveis e transparentes.
            </p>
          </div>
        </motion.div>

        {/* Terminal cards */}
        <div className="grid lg:grid-cols-3 gap-4">
          {SOURCES.map((src, i) => (
            <motion.div
              key={src.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden border border-border/50"
              style={{ background: "oklch(0.07 0 0)" }}
            >
              {/* Terminal header bar */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "oklch(0.17 0 0)", background: "oklch(0.09 0 0)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-market-red/50" />
                    <div className="h-2 w-2 rounded-full bg-market-yellow/50" />
                    <div className="h-2 w-2 rounded-full bg-market-green/50" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-muted-foreground/60 tracking-wider">
                    {src.feed}
                  </span>
                </div>
                <span className={`font-mono text-[9px] font-bold rounded border px-1.5 py-0.5 ${src.badgeColor}`}>
                  {src.badge}
                </span>
              </div>

              {/* Source name */}
              <div className="px-4 pt-4 pb-3">
                <p className="font-mono text-base font-extrabold tracking-wider text-foreground">
                  {src.name}
                </p>
              </div>

              {/* Data rows */}
              <div className="px-4 pb-4 space-y-0">
                {src.items.map((item, j) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.25 + i * 0.1 + j * 0.055 }}
                    className="flex items-center justify-between py-2.5 border-b last:border-b-0"
                    style={{ borderColor: "oklch(0.13 0 0)" }}
                  >
                    <div className="flex items-center gap-2">
                      {item.live && (
                        <div
                          className="h-1.5 w-1.5 rounded-full animate-pulse shrink-0"
                          style={{ backgroundColor: src.accentColor }}
                        />
                      )}
                      {!item.live && (
                        <div className="h-1.5 w-1.5 rounded-full bg-border/60 shrink-0" />
                      )}
                      <span className="font-mono text-[10px] font-medium text-muted-foreground/70 tracking-wider">
                        {item.key}
                      </span>
                    </div>
                    <span
                      className="font-mono text-[10px] font-bold"
                      style={{ color: item.live ? src.accentColor : "oklch(0.38 0 0)" }}
                    >
                      ↻ {item.freq}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live status bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.5 }}
          className="mt-6 rounded-xl border border-border/30 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ background: "oklch(0.09 0 0)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="h-1.5 w-1.5 rounded-full bg-market-green animate-pulse" />
            <span className="font-mono text-[11px] font-medium text-market-green">SISTEMA OPERACIONAL</span>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground/50 text-center sm:text-right">
            Pregão B3 — 10:00–17:30 (BRT) &nbsp;·&nbsp; Cripto 24/7 &nbsp;·&nbsp; Macro atualização diária
          </p>
        </motion.div>
      </div>
    </section>
  );
}
