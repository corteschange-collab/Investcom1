"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  Star,
  Bell,
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui";
import { useWatchlistStore } from "@/store/watchlist";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/ativos", label: "Ativos", icon: TrendingUp },
  { href: "/dashboard/radar", label: "Radar", icon: Zap },
  { href: "/dashboard/watchlist", label: "Watchlist", icon: Star },
  { href: "/dashboard/alertas", label: "Alertas", icon: Bell },
  { href: "/dashboard/assistente", label: "IA Assistente", icon: Sparkles },
  { href: "/dashboard/aprender", label: "Aprender", icon: BookOpen },
  { href: "/dashboard/suporte", label: "Suporte", icon: HelpCircle },
  { href: "/dashboard/perfil", label: "Perfil", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const watchlistCount = useWatchlistStore((s) => s.items.length);

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 220 : 64 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex h-screen flex-col border-r border-border/50 bg-sidebar overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <TrendingUp size={16} />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="font-bold text-sm whitespace-nowrap"
              >
                InvestAI
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all duration-150",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="whitespace-nowrap flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.label === "Watchlist" && watchlistCount > 0 && sidebarOpen && (
                <Badge
                  variant="secondary"
                  className="ml-auto h-4 px-1.5 text-[10px]"
                >
                  {watchlistCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-sidebar text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </motion.aside>
  );
}
