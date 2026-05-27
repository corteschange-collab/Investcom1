"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Camila R.",
    role: "Professora, investidora iniciante",
    text: "Comecei a investir com R$150 por mês e não entendia nada de gráficos. O InvestAI explica tudo de um jeito que qualquer pessoa entende. Agora faço minhas próprias análises.",
    stars: 5,
    avatar: "CR",
  },
  {
    name: "Lucas M.",
    role: "Analista de TI, 3 anos investindo",
    text: "O Radar de Oportunidades me salva tempo todo dia. Em vez de analisar ativo por ativo, vejo rapidamente quais têm os melhores sinais técnicos e me aprofundo só nesses.",
    stars: 5,
    avatar: "LM",
  },
  {
    name: "Fernanda O.",
    role: "Autônoma, foco em FIIs",
    text: "Finalmente uma plataforma que trata FIIs com seriedade. Análise fundamentalista, dividend yield histórico e alertas de preço. Tudo que eu precisava.",
    stars: 5,
    avatar: "FO",
  },
  {
    name: "André T.",
    role: "Engenheiro, investidor moderado",
    text: "O simulador de aportes me mostrou que com R$500 por mês em 15 anos eu poderia ter um patrimônio relevante. Isso mudou minha percepção sobre investir cedo.",
    stars: 5,
    avatar: "AT",
  },
  {
    name: "Juliana C.",
    role: "Designer, começando a investir",
    text: "A IA explica os indicadores em português sem enrolação. Não preciso mais pesquisar o que é RSI ou MACD — a plataforma já me diz o que o número significa na prática.",
    stars: 5,
    avatar: "JC",
  },
  {
    name: "Roberto N.",
    role: "Trader de médio prazo",
    text: "O score proprietário é interessante. Resume em um número o que antes levava 30 minutos para analisar manualmente. Uso como filtro rápido antes da análise detalhada.",
    stars: 4,
    avatar: "RN",
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary">Depoimentos</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            O que dizem os investidores
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            Mais de 14.000 investidores brasileiros já usam o InvestAI.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-border/50 bg-card p-5 hover:border-border transition-colors"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={12} className="fill-market-yellow text-market-yellow" />
                ))}
                {t.stars < 5 && <Star size={12} className="text-border" />}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
