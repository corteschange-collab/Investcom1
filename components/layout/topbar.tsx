"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/dashboard/ativos/${query.trim().toUpperCase()}`);
        setQuery("");
      }
    },
    [query, router]
  );

  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  };

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border/50 bg-background px-4 sm:px-6 shrink-0">
      {/* Search / Command trigger */}
      <form onSubmit={handleSearch} className="flex-1 max-w-sm">
        <button
          type="button"
          onClick={openCommandPalette}
          className="flex w-full items-center gap-2.5 rounded-lg border border-border/60 bg-card px-3 h-9 text-sm text-muted-foreground hover:border-border hover:text-foreground transition-all group"
        >
          <Search size={14} className="shrink-0" />
          <span className="flex-1 text-left text-xs hidden sm:block">Buscar ativo... (PETR4, MXRF11)</span>
          <span className="text-left text-xs block sm:hidden">Buscar...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-border/60 bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </button>
      </form>

      <div className="flex items-center gap-1.5 ml-auto">
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell size={16} />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-market-red text-[8px] font-bold text-white border border-background">
            3
          </span>
        </Button>

        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-7 w-7",
            },
          }}
        />
      </div>
    </header>
  );
}
