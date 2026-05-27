"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: 14800, suffix: "+", label: "investidores ativos" },
  { value: 15, suffix: "+", label: "indicadores técnicos" },
  { value: 98, suffix: "%", label: "satisfação dos usuários" },
  { value: 3, suffix: "s", prefix: "<", label: "para analisar um ativo" },
];

function AnimatedNumber({ target, suffix, prefix = "" }: { target: number; suffix: string; prefix?: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let count = 0;
    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(count));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{current >= 1000 ? (current / 1000).toFixed(1) + "k" : current}
      {suffix}
    </span>
  );
}

export function TrustBar() {
  return (
    <section className="border-y border-border/40 bg-surface/40 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono-nums text-foreground">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* B3 badge */}
        <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
          <span className="text-xs text-muted-foreground">Dados integrados via</span>
          {["B3", "Brapi", "Yahoo Finance"].map((name) => (
            <div key={name} className="rounded-lg border border-border/40 bg-card px-3 py-1.5">
              <span className="text-xs font-semibold text-foreground/70">{name}</span>
            </div>
          ))}
          <span className="text-xs text-muted-foreground">100% LGPD compliant</span>
        </div>
      </div>
    </section>
  );
}
