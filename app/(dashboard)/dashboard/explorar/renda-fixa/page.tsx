import { Shield, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { TESOURO_DIRETO, RENDA_FIXA_REFERENCE } from "@/lib/assets/catalog";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Renda Fixa" };

const INDEXER_COLOR: Record<string, string> = {
  selic: "text-market-green bg-market-green/10 border-market-green/30",
  cdi: "text-market-green bg-market-green/10 border-market-green/30",
  ipca: "text-primary bg-primary/10 border-primary/30",
  pre: "text-market-yellow bg-market-yellow/10 border-market-yellow/30",
};

const INDEXER_LABEL: Record<string, string> = {
  selic: "SELIC",
  cdi: "CDI",
  ipca: "IPCA+",
  pre: "Prefixado",
};

export default function RendaFixaPage() {
  const grouped = RENDA_FIXA_REFERENCE.reduce<Record<string, typeof RENDA_FIXA_REFERENCE>>(
    (acc, item) => {
      const key = item.subclass;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">Renda Fixa</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Rentabilidade previsível, menor volatilidade. Base segura de qualquer carteira.
        </p>
      </div>

      {/* Tesouro Direto */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Shield size={14} className="text-market-green" />
          <p className="text-sm font-semibold">Tesouro Direto</p>
          <span className="rounded-full bg-market-green/10 px-2 py-0.5 text-[10px] font-medium text-market-green border border-market-green/20">
            Garantia do Governo Federal
          </span>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="divide-y divide-border/50">
            {TESOURO_DIRETO.map((t) => (
              <Link
                key={t.id}
                href="https://www.tesourodireto.com.br"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{t.name}</p>
                    <span className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      INDEXER_COLOR[t.indexer]
                    )}>
                      {INDEXER_LABEL[t.indexer]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      Vence {t.maturityYear}
                    </span>
                    <span>Mín. R$ {t.minimumInvestment}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-sm font-semibold text-market-green">
                    {t.rateLabel}
                  </p>
                  <p className="text-xs text-muted-foreground">Taxa atual</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          * Taxas indicativas. Consulte o site do Tesouro Direto para taxas em tempo real.
        </p>
      </div>

      {/* CDB */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-primary" />
          <p className="text-sm font-semibold">CDB</p>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary border border-primary/20">
            Garantia FGC até R$ 250k
          </span>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="divide-y divide-border/50">
            {(grouped["cdb"] ?? []).map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.name}</p>
                    <span className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      INDEXER_COLOR[item.indexer]
                    )}>
                      {INDEXER_LABEL[item.indexer]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.termMonths ? `${item.termMonths} meses · ` : "Liquidez diária · "}
                    {item.issuer}
                  </p>
                </div>
                <p className="font-mono text-sm font-semibold text-market-green shrink-0">
                  {item.rateLabel}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LCI / LCA */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Shield size={14} className="text-market-yellow" />
          <p className="text-sm font-semibold">LCI / LCA</p>
          <span className="rounded-full bg-market-yellow/10 px-2 py-0.5 text-[10px] font-medium text-market-yellow border border-market-yellow/20">
            Isento de IR para PF
          </span>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="divide-y divide-border/50">
            {(grouped["lci-lca"] ?? []).map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.name}</p>
                    <span className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      INDEXER_COLOR[item.indexer]
                    )}>
                      {INDEXER_LABEL[item.indexer]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    {item.termMonths ? <span>{item.termMonths} meses</span> : null}
                    {item.notes && <span className="text-market-green/80">{item.notes}</span>}
                  </div>
                </div>
                <p className="font-mono text-sm font-semibold text-market-green shrink-0">
                  {item.rateLabel}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CRI / CRA */}
      {(grouped["cri-cra"] ?? []).length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-3">CRI / CRA — Isento de IR</p>
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="divide-y divide-border/50">
              {(grouped["cri-cra"] ?? []).map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.termMonths} meses · {item.issuer}
                    </p>
                  </div>
                  <p className="font-mono text-sm font-semibold text-market-green shrink-0">
                    {item.rateLabel}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground pb-4">
        Taxas são referências de mercado. Acesse seu banco/corretora para taxas disponíveis para você.
      </p>
    </div>
  );
}
