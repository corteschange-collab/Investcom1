"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface LivePriceProps {
  price: number;
  change?: number;
  changePercent?: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** Show change amount and percent below price */
  showChange?: boolean;
  className?: string;
}

/**
 * Displays a live price with a brief green/red flash animation
 * whenever the value changes — similar to Bloomberg terminal behavior.
 */
export function LivePrice({
  price,
  change = 0,
  changePercent = 0,
  currency = "R$",
  size = "md",
  showChange = true,
  className,
}: LivePriceProps) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPrice = useRef<number>(price);

  useEffect(() => {
    if (prevPrice.current === price) return;

    const dir = price > prevPrice.current ? "up" : "down";
    setFlash(dir);
    prevPrice.current = price;

    const id = setTimeout(() => setFlash(null), 800);
    return () => clearTimeout(id);
  }, [price]);

  const positive = changePercent > 0;
  const neutral = changePercent === 0;

  const sizes = {
    sm: { price: "text-sm font-bold", change: "text-xs" },
    md: { price: "text-lg font-bold", change: "text-xs" },
    lg: { price: "text-2xl font-bold", change: "text-sm" },
    xl: { price: "text-3xl font-bold", change: "text-base" },
  };

  return (
    <div className={cn("font-mono-nums", className)}>
      {/* Price with flash */}
      <span
        className={cn(
          sizes[size].price,
          "transition-colors duration-150",
          flash === "up" && "text-market-green",
          flash === "down" && "text-market-red",
          !flash && "text-foreground"
        )}
      >
        {currency} {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </span>

      {/* Change row */}
      {showChange && (
        <div className={cn("flex items-center gap-1.5 mt-0.5", sizes[size].change)}>
          {positive ? (
            <TrendingUp size={12} className="text-market-green" />
          ) : neutral ? (
            <Minus size={12} className="text-muted-foreground" />
          ) : (
            <TrendingDown size={12} className="text-market-red" />
          )}
          <span
            className={cn(
              "font-medium",
              positive ? "text-market-green" : neutral ? "text-muted-foreground" : "text-market-red"
            )}
          >
            {positive ? "+" : ""}
            {change.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}{" "}
            ({positive ? "+" : ""}
            {changePercent.toFixed(2)}%)
          </span>
        </div>
      )}
    </div>
  );
}
