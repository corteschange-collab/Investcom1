import { BookOpen, TrendingUp, DollarSign, Calculator } from "lucide-react";
import Link from "next/link";

const modules = [
  {
    icon: TrendingUp,
    title: "Começando do Zero",
    description: "O que é ação, ETF, FII, CDI, Tesouro Direto e como funcionam os juros compostos.",
    badge: "Iniciante",
    color: "text-market-green",
    bg: "bg-market-green/10",
  },
  {
    icon: DollarSign,
    title: "Investindo com Pouco",
    description: "Como investir com R$50, R$100 ou R$300 por mês e construir patrimônio no longo prazo.",
    badge: "Prático",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Calculator,
    title: "Simuladores",
    description: "Simuladores de juros compostos, aposentadoria, dividendos e crescimento patrimonial.",
    badge: "Interativo",
    color: "text-market-yellow",
    bg: "bg-market-yellow/10",
  },
];

export default function AprenderPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BookOpen size={22} className="text-primary" />
          Área Educacional
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Aprenda a investir do zero. Conteúdo feito para quem quer construir patrimônio com qualquer renda.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {modules.map((m) => (
          <div
            key={m.title}
            className="rounded-2xl border border-border/50 bg-card p-5 hover:border-primary/30 transition-colors cursor-pointer"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${m.bg} ${m.color} mb-3`}>
              <m.icon size={20} />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{m.badge}</span>
            <h3 className="text-sm font-semibold mt-0.5 mb-1">{m.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-6">
        <h2 className="text-sm font-semibold mb-4">Conceitos essenciais</h2>
        <div className="grid gap-2 sm:grid-cols-2 text-sm">
          {[
            { term: "Ação", def: "Fração do capital de uma empresa negociada na bolsa" },
            { term: "ETF", def: "Fundo que replica um índice (ex: BOVA11 replica o Ibovespa)" },
            { term: "FII", def: "Fundo Imobiliário — investe em imóveis e distribui rendimentos mensais" },
            { term: "Dividendo", def: "Parte do lucro da empresa distribuída aos acionistas" },
            { term: "P/L", def: "Preço sobre Lucro — indica quantos anos para recuperar o investimento" },
            { term: "DY", def: "Dividend Yield — rendimento anual de dividendos sobre o preço atual" },
          ].map((item) => (
            <div key={item.term} className="flex gap-2 py-2 border-b border-border/30 last:border-0">
              <span className="font-semibold text-primary font-mono min-w-[60px]">{item.term}</span>
              <span className="text-muted-foreground text-xs leading-relaxed">{item.def}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
