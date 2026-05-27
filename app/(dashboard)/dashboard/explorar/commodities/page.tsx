import { COMMODITIES } from "@/lib/assets/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Commodities" };

const GROUP_LABELS: Record<string, string> = {
  "commodities-metais": "Metais",
  "commodities-energia": "Energia",
  "commodities-agro": "Agronegócio",
};

export default function CommoditiesPage() {
  const grouped = COMMODITIES.reduce<Record<string, typeof COMMODITIES>>((acc, c) => {
    const k = c.subclass as string;
    if (!acc[k]) acc[k] = [];
    acc[k].push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">Commodities</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Metais, energia e agro. Proteção contra inflação e diversificação global.
        </p>
      </div>
      {Object.entries(grouped).map(([group, items]) => (
        <div key={group}>
          <p className="text-sm font-semibold mb-3">{GROUP_LABELS[group] ?? group}</p>
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="divide-y divide-border/50">
              {items.map((entry) => (
                <div key={entry.ticker} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{entry.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{entry.yahooTicker}</p>
                    {entry.notes && (
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{entry.notes}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Negociado em USD
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">
        Para exposição em reais, considere ETFs como GOLD11 (ouro) ou ações do setor.
      </p>
    </div>
  );
}
