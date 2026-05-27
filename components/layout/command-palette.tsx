"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  TrendingUp,
  LayoutDashboard,
  Star,
  Bell,
  BookOpen,
  User,
  Search,
  Zap,
} from "lucide-react";

const POPULAR = [
  { ticker: "PETR4", name: "Petrobras PN" },
  { ticker: "VALE3", name: "Vale ON" },
  { ticker: "ITUB4", name: "Itaú Unibanco PN" },
  { ticker: "WEGE3", name: "WEG ON" },
  { ticker: "BBAS3", name: "Banco do Brasil ON" },
  { ticker: "ABEV3", name: "Ambev ON" },
  { ticker: "MXRF11", name: "Maxi Renda FII" },
  { ticker: "BOVA11", name: "iShares Ibovespa ETF" },
  { ticker: "KNRI11", name: "Kinea Renda Imobiliária" },
  { ticker: "MGLU3", name: "Magazine Luiza" },
];

const PAGES = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/ativos", label: "Ativos", icon: TrendingUp },
  { href: "/dashboard/radar", label: "Radar de Oportunidades", icon: Zap },
  { href: "/dashboard/watchlist", label: "Watchlist", icon: Star },
  { href: "/dashboard/alertas", label: "Alertas", icon: Bell },
  { href: "/dashboard/aprender", label: "Aprender", icon: BookOpen },
  { href: "/dashboard/perfil", label: "Perfil", icon: User },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  const filtered = query.length >= 1
    ? POPULAR.filter(
        (t) =>
          t.ticker.toLowerCase().includes(query.toLowerCase()) ||
          t.name.toLowerCase().includes(query.toLowerCase())
      )
    : POPULAR.slice(0, 6);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Buscar ativo, página... (ex: PETR4)"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-4">
            <Search size={24} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum resultado para &quot;{query}&quot;
            </p>
            {query.length >= 3 && (
              <button
                onClick={() => navigate(`/dashboard/ativos/${query.toUpperCase()}`)}
                className="mt-1 text-xs text-primary hover:underline"
              >
                Analisar {query.toUpperCase()} mesmo assim →
              </button>
            )}
          </div>
        </CommandEmpty>

        {/* Ativos populares / resultado de busca */}
        <CommandGroup heading={query ? "Ativos encontrados" : "Ativos populares"}>
          {filtered.map((t) => (
            <CommandItem
              key={t.ticker}
              value={t.ticker}
              onSelect={() => navigate(`/dashboard/ativos/${t.ticker}`)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-bold font-mono shrink-0">
                {t.ticker.slice(0, 2)}
              </div>
              <div>
                <span className="font-mono font-semibold text-sm">{t.ticker}</span>
                <span className="ml-2 text-xs text-muted-foreground">{t.name}</span>
              </div>
              <TrendingUp size={13} className="ml-auto text-muted-foreground/50" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Navegação */}
        <CommandGroup heading="Páginas">
          {PAGES.filter(
            (p) =>
              !query ||
              p.label.toLowerCase().includes(query.toLowerCase())
          ).map((page) => (
            <CommandItem
              key={page.href}
              value={page.label}
              onSelect={() => navigate(page.href)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <page.icon size={15} className="text-muted-foreground shrink-0" />
              <span className="text-sm">{page.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      {/* Footer hint */}
      <div className="border-t border-border/50 px-4 py-2 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          ↑↓ navegar · Enter selecionar · Esc fechar
        </span>
        <span className="text-[10px] text-muted-foreground">
          <kbd className="rounded border border-border px-1 py-0.5 font-mono">⌘K</kbd> para abrir
        </span>
      </div>
    </CommandDialog>
  );
}
