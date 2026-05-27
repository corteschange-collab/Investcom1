import { CRIPTO } from "@/lib/assets/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Criptomoedas" };

export default function CriptoPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">Criptomoedas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ativos digitais de alta volatilidade. Use como diversificação, nunca como base da carteira.
        </p>
      </div>
      <div className="rounded-2xl border border-market-red/20 bg-market-red/5 p-4">
        <p className="text-sm font-medium text-market-red">Atenção: alto risco</p>
        <p className="text-xs text-muted-foreground mt-1">
          Criptomoedas têm volatilidade extrema. Drawdowns de 50–80% são comuns.
          Invista apenas o que pode perder totalmente.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="divide-y divide-border/50">
          {CRIPTO.map((entry) => (
            <div key={entry.ticker} className="flex items-center gap-3 px-4 py-3">
              <div className="w-20 shrink-0">
                <span className="font-mono text-sm font-bold">{entry.ticker.replace("-USD", "")}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm">{entry.name}</p>
                <p className="text-xs text-muted-foreground">{entry.yahooTicker}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                Consulte sua corretora
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Dados de cripto via Yahoo Finance. Use sua exchange ou corretora para negociar.
        No Brasil, Hash11 (ETF) e QBTC11 oferecem exposição regulada via B3.
      </p>
    </div>
  );
}
