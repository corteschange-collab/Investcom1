"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const DIMENSIONS = [
  { label: "Força Técnica", pct: 35, desc: "RSI, MACD, EMAs, SMA200", color: "#A0714F", track: "#A0714F30" },
  { label: "Qualidade Fundamentalista", pct: 30, desc: "ROE, P/L, P/VP, margens", color: "#C08868", track: "#C0886830" },
  { label: "Risco & Volatilidade", pct: 20, desc: "ATR, drawdown histórico", color: "#22C55E", track: "#22C55E30" },
  { label: "Dividendos", pct: 15, desc: "Dividend Yield e consistência", color: "#636363", track: "#63636330" },
];

// SVG donut segment calculator
function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

function DonutChart({ ready }: { ready: boolean }) {
  const cx = 110;
  const cy = 110;
  const r = 80;
  const gap = 3;
  let cursor = 0;

  const segments = DIMENSIONS.map((d) => {
    const sweep = (d.pct / 100) * 360 - gap;
    const start = cursor;
    cursor += (d.pct / 100) * 360;
    return { ...d, start, sweep };
  });

  const circumference = 2 * Math.PI * r;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={220} height={220} className="overflow-visible">
        {segments.map((seg, i) => {
          const path = arcPath(cx, cy, r, seg.start, seg.start + seg.sweep);
          const strokeLen = (seg.sweep / 360) * circumference;

          return (
            <motion.path
              key={i}
              d={path}
              fill="none"
              stroke={seg.color}
              strokeWidth={14}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={ready ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.1 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ vectorEffect: "non-scaling-stroke" }}
            />
          );
        })}

        {/* Track rings */}
        {segments.map((seg, i) => (
          <path
            key={`track-${i}`}
            d={arcPath(cx, cy, r, seg.start, seg.start + seg.sweep)}
            fill="none"
            stroke={seg.track}
            strokeWidth={14}
            strokeLinecap="round"
            style={{ zIndex: -1 }}
          />
        ))}

        {/* Center text */}
        <text x={cx} y={cy - 8} textAnchor="middle" className="fill-foreground" fontSize={28} fontWeight={800} letterSpacing={-1}>
          Score
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" className="fill-muted-foreground" fontSize={13}>
          0 – 100
        </text>
      </svg>
    </div>
  );
}

export function ScoreEngine() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 section-navy relative overflow-hidden">
      {/* Gold gradient line top */}
      <div className="gradient-line absolute top-0 left-0 right-0 opacity-30" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold">
            Motor proprietário
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.1]">
            Score InvestAI
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            Cada ativo recebe uma nota de 0 a 100 calculada em tempo real,
            com quatro dimensões ponderadas por rigor quantitativo.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Donut */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-8"
          >
            <DonutChart ready={inView} />

            {/* Score example */}
            <div className="flex items-center gap-6">
              {[
                { label: "Alta confiança", range: "≥ 65", bg: "bg-market-green/15", color: "text-market-green" },
                { label: "Média", range: "45–64", bg: "bg-market-yellow/15", color: "text-market-yellow" },
                { label: "Baixa", range: "< 45", bg: "bg-market-red/15", color: "text-market-red" },
              ].map((c) => (
                <div key={c.label} className={`${c.bg} rounded-xl px-3.5 py-2 text-center`}>
                  <p className={`text-xs font-bold ${c.color}`}>{c.range}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{c.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dimension breakdown */}
          <div className="space-y-5">
            {DIMENSIONS.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, x: 24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-2xl border border-border/40 bg-card/50 p-5 hover:border-border transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-sm font-semibold">{d.label}</span>
                  </div>
                  <span className="text-2xl font-extrabold font-mono-nums tracking-tight" style={{ color: d.color }}>
                    {d.pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: d.color }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${d.pct}%` } : {}}
                    transition={{ duration: 1.0, delay: 0.3 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Gold gradient line bottom */}
      <div className="gradient-line absolute bottom-0 left-0 right-0 opacity-30" />
    </section>
  );
}
