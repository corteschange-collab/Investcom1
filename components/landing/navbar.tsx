"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Recursos", href: "#recursos" },
  { label: "Simulador", href: "#simulador" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Preços", href: "#precos" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNavbar({ onLoginOpen }: { onLoginOpen: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 w-full border-b border-border/50 glass"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <TrendingUp size={16} />
          </div>
          InvestAI
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onLoginOpen}>
            Entrar
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
            onClick={onLoginOpen}
          >
            Começar grátis
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border/50 bg-background px-4 pb-4 pt-2 flex flex-col gap-2"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground py-1.5"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
            <Button variant="outline" size="sm" className="w-full" onClick={() => { onLoginOpen(); setMobileOpen(false); }}>
              Entrar
            </Button>
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90" onClick={() => { onLoginOpen(); setMobileOpen(false); }}>
              Começar grátis
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
