import { Mail, Clock, MessageSquare, AlertTriangle } from "lucide-react";
import { ContactForm } from "@/components/support/contact-form";
import { FaqAccordion } from "@/components/support/faq-accordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suporte",
  description: "Fale com a equipe InvestAI. Suporte técnico, dados, feedback e contato comercial.",
};

const CHANNELS = [
  {
    icon: MessageSquare,
    label: "Suporte geral",
    value: "24h úteis",
    sub: "Formulário abaixo",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: AlertTriangle,
    label: "Bugs e erros",
    value: "12h úteis",
    sub: "Prioridade alta",
    color: "text-market-red",
    bg: "bg-market-red/10",
  },
  {
    icon: Mail,
    label: "E-mail direto",
    value: "suporte@investai.com.br",
    sub: "Para assuntos urgentes",
    color: "text-market-green",
    bg: "bg-market-green/10",
  },
  {
    icon: Clock,
    label: "Horário de atendimento",
    value: "Seg–Sex",
    sub: "9h às 18h (BRT)",
    color: "text-market-yellow",
    bg: "bg-market-yellow/10",
  },
];

export default function SuportePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">Central de Suporte</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Respondemos todo contato. Nenhuma mensagem é ignorada.
        </p>
      </div>

      {/* Channel cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CHANNELS.map((ch) => (
          <div
            key={ch.label}
            className="rounded-2xl border border-border/50 bg-card p-4 space-y-2"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${ch.bg}`}>
              <ch.icon size={16} className={ch.color} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{ch.label}</p>
              <p className="text-sm font-semibold mt-0.5 leading-tight break-all">{ch.value}</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">{ch.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid: form + FAQ */}
      <div className="grid gap-8 lg:grid-cols-[1fr_420px] items-start">

        {/* FAQ — visible first on mobile */}
        <div className="order-2 lg:order-none">
          <FaqAccordion id="faq" />
        </div>

        {/* Contact form */}
        <div className="order-1 lg:order-none">
          <ContactForm id="formulario" />
        </div>
      </div>

      {/* Bottom trust line */}
      <div className="flex flex-col items-center gap-2 pt-4 border-t border-border/50 text-center">
        <p className="text-sm text-muted-foreground">
          Prefere e-mail direto?{" "}
          <a
            href="mailto:suporte@investai.com.br"
            className="text-primary hover:underline font-medium"
          >
            suporte@investai.com.br
          </a>
        </p>
        <p className="text-xs text-muted-foreground/60">
          InvestAI · Plataforma de análise financeira para investidores brasileiros
        </p>
      </div>

    </div>
  );
}
