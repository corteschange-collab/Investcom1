"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "Por que os dados podem estar desatualizados?",
    a: "Os dados de mercado são fornecidos em tempo real por Brapi.dev e Yahoo Finance. Durante o pregão, cotações têm delay de até 15 minutos. Fora do horário de mercado, os dados refletem o fechamento do último pregão. Se notar uma inconsistência persistente (ex: P/L errado, DY zerado), use o formulário para reportar.",
  },
  {
    q: "Como fazer login ou redefinir minha senha?",
    a: "Na tela de acesso, clique em \"Esqueci minha senha\". Um link de redefinição será enviado para o e-mail cadastrado. Se não receber o e-mail em 5 minutos, verifique o spam ou entre em contato informando o e-mail cadastrado.",
  },
  {
    q: "Os indicadores técnicos são calculados corretamente?",
    a: "Todos os indicadores (RSI, MACD, Bollinger Bands, EMAs, SMA) são calculados localmente sobre dados históricos reais da B3. Não são previsões — são ferramentas matemáticas para apoiar sua análise. O score proprietário (0–100) pondera força técnica, fundamentais e risco.",
  },
  {
    q: "O que inclui o plano gratuito?",
    a: "No plano gratuito você tem: cotações em tempo real, indicadores técnicos completos, gráficos históricos, score de ativos, watchlist com até 10 ativos e análise de FIIs. Alertas automáticos, assistente de IA sem limite e screener avançado são recursos do plano Premium.",
  },
  {
    q: "Como cancelar a assinatura?",
    a: "Acesse Perfil → Assinatura e clique em \"Cancelar plano\". O acesso Premium continua ativo até o fim do período já pago. Não cobramos multa nem taxa de cancelamento.",
  },
  {
    q: "Como reportar um dado incorreto de forma rápida?",
    a: "Na página de qualquer ativo, use o botão \"Reportar dado\" no rodapé do card de fundamentais. Isso abre o formulário de contato pré-preenchido com o ticker e a categoria correta.",
  },
  {
    q: "A plataforma tem app mobile?",
    a: "Ainda não. A plataforma web é responsiva e funciona bem no celular. Um aplicativo nativo está no roadmap — você pode votar nessa funcionalidade pelo formulário de sugestões.",
  },
];

export function FaqAccordion({ id }: { id?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div id={id} className="space-y-4">
      <div>
        <h2 className="text-base font-bold">Perguntas frequentes</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Talvez sua dúvida já tenha resposta aqui.
        </p>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden divide-y divide-border/50">
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx}>
            <button
              onClick={() => setOpen(open === idx ? null : idx)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/20"
            >
              <span className="text-sm font-medium leading-snug">{item.q}</span>
              <ChevronDown
                size={15}
                className={cn(
                  "shrink-0 text-muted-foreground transition-transform duration-200",
                  open === idx && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {open === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
