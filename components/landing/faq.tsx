"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "O InvestAI é gratuito?",
    a: "Sim. O plano gratuito inclui análise de ativos, indicadores básicos, watchlist com 5 ativos, simulador e toda a área educacional. O plano Premium (R$29/mês) desbloqueia IA assistente, alertas ilimitados e indicadores avançados.",
  },
  {
    q: "Preciso saber de finanças para usar?",
    a: "Não. A plataforma foi construída para ser acessível a quem nunca investiu. Nossa IA explica cada indicador, cada sinal e cada gráfico em linguagem simples. Se você não sabe o que é RSI, não tem problema — a plataforma explica.",
  },
  {
    q: "Os dados são em tempo real?",
    a: "Sim, os dados de cotação são fornecidos pela B3 via Brapi com atualização frequente. Indicadores técnicos são calculados sobre esses dados. Para usuários premium, a atualização é mais frequente.",
  },
  {
    q: "O InvestAI faz recomendações de compra e venda?",
    a: "Não. Fornecemos análise técnica, indicadores e probabilidades baseadas em dados históricos. A decisão de comprar ou vender é sempre sua. Não somos uma corretora e não damos recomendações de investimento.",
  },
  {
    q: "Funciona para quem investe com pouco dinheiro?",
    a: "Perfeito para quem começa com R$50 ou R$100 por mês. Nossa área educacional tem conteúdo específico sobre como investir com pouco, estratégias de longo prazo e como construir patrimônio consistentemente.",
  },
  {
    q: "Funciona para ações, FIIs e ETFs?",
    a: "Sim. A plataforma suporta todos os ativos da B3: ações, fundos imobiliários (FIIs), ETFs e BDRs. Cada tipo tem análises específicas para suas características.",
  },
  {
    q: "Os meus dados estão seguros?",
    a: "Sim. Seguimos todas as diretrizes da LGPD. Seus dados nunca são vendidos a terceiros. A autenticação é feita via Clerk com criptografia de ponta. Você pode excluir sua conta e todos os dados a qualquer momento.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-surface/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary">Perguntas frequentes</span>
          <h2 className="mt-2 text-3xl font-bold">Dúvidas comuns</h2>
        </motion.div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-border/50 bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="text-sm font-medium pr-4">{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
