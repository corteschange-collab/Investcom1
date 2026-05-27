"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  X,
  Bug,
  BarChart2,
  Lightbulb,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  {
    icon: Bug,
    label: "Reportar um erro",
    href: "/dashboard/suporte?categoria=bug",
    color: "text-market-red",
  },
  {
    icon: BarChart2,
    label: "Dado incorreto",
    href: "/dashboard/suporte?categoria=dados",
    color: "text-primary",
  },
  {
    icon: Lightbulb,
    label: "Sugerir melhoria",
    href: "/dashboard/suporte?categoria=melhoria",
    color: "text-market-green",
  },
  {
    icon: BookOpen,
    label: "Ver perguntas frequentes",
    href: "/dashboard/suporte#faq",
    color: "text-muted-foreground",
  },
];

export function HelpButton() {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-72 rounded-2xl border border-border/60 bg-popover shadow-2xl shadow-black/20 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <HelpCircle size={14} />
                </div>
                <span className="text-sm font-semibold">Como podemos ajudar?</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/40"
              >
                <X size={14} />
              </button>
            </div>

            {/* Quick actions */}
            <div className="p-2">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted/40"
                >
                  <action.icon size={15} className={action.color} />
                  <span className="flex-1">{action.label}</span>
                  <ArrowRight size={12} className="text-muted-foreground/50" />
                </Link>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="px-4 py-3 border-t border-border/50">
              <Link
                href="/dashboard/suporte"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary/10 border border-primary/20 py-2 text-xs font-semibold text-primary hover:bg-primary/15 transition-colors"
              >
                Ir para o suporte completo
                <ArrowRight size={11} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <div className="relative">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !open && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-border/60 bg-popover px-3 py-1.5 text-xs font-medium shadow-lg pointer-events-none"
            >
              Precisa de ajuda?
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          ref={buttonRef}
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full shadow-lg shadow-primary/20 transition-colors",
            open
              ? "bg-foreground text-background"
              : "bg-primary text-white hover:bg-primary/90"
          )}
          aria-label="Ajuda e suporte"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="q"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <HelpCircle size={18} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
