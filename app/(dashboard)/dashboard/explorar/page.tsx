import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ASSET_CATEGORIES } from "@/lib/assets/taxonomy";
import { cn } from "@/lib/utils";
import type { AssetClass } from "@/lib/assets/taxonomy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Explorar" };

const NAV_ITEMS: { id: AssetClass; href: string; badge?: string }[] = [
  { id: "acoes",      href: "/dashboard/explorar/acoes" },
  { id: "fiis",       href: "/dashboard/explorar/fiis" },
  { id: "etfs",       href: "/dashboard/explorar/etfs" },
  { id: "bdrs",       href: "/dashboard/explorar/bdrs" },
  { id: "renda-fixa", href: "/dashboard/explorar/renda-fixa", badge: "Isento IR" },
  { id: "cripto",     href: "/dashboard/explorar/cripto" },
  { id: "commodities",href: "/dashboard/explorar/commodities" },
];

export default function ExplorarPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">Explorar ativos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Navegue por classe de ativo, aplique filtros e descubra oportunidades.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NAV_ITEMS.map(({ id, href, badge }) => {
          const cat = ASSET_CATEGORIES[id];
          return (
            <Link
              key={id}
              href={href}
              className={cn(
                "group flex items-start gap-4 rounded-2xl border p-4 transition-all",
                "border-border/50 bg-card hover:border-border hover:shadow-sm"
              )}
            >
              <div className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl",
                cat.bgColor
              )}>
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{cat.labelPlural}</p>
                  {badge && (
                    <span className="rounded-full bg-market-green/10 px-1.5 py-0.5 text-[10px] font-medium text-market-green">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {cat.description}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <span>Risco {cat.riskRange[0]}–{cat.riskRange[1]}/5</span>
                </div>
              </div>
              <ChevronRight size={16} className="shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground mt-0.5 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
