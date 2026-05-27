/**
 * B3 (BM&F Bovespa) market hours detector.
 *
 * Session schedule (BRT = UTC-3):
 *   Pre-market  : 09:45 – 10:00
 *   Regular     : 10:00 – 17:30
 *   After-market: 17:30 – 18:00
 *   Closed      : everything else + weekends
 */

export type SessionType = "pre" | "regular" | "after" | "closed";

export interface MarketStatus {
  isOpen: boolean;
  sessionType: SessionType;
  /** Friendly label in pt-BR */
  label: string;
  /** Polling interval in ms recommended for this session */
  pollIntervalMs: number;
  /** Current BRT time string (HH:MM) */
  brtTime: string;
  evaluatedAt: number;
}

// BRT is UTC-3 (no DST in Brazil since 2019)
const BRT_OFFSET_H = -3;

function nowInBRT(): Date {
  const utcMs = Date.now() + new Date().getTimezoneOffset() * 60_000;
  return new Date(utcMs + BRT_OFFSET_H * 3_600_000);
}

/** Returns current B3 market status without any I/O. */
export function getMarketStatus(): MarketStatus {
  const brt = nowInBRT();
  const day = brt.getDay(); // 0=Sun … 6=Sat
  const totalMin = brt.getHours() * 60 + brt.getMinutes();

  const PRE_OPEN = 9 * 60 + 45; // 09:45
  const OPEN = 10 * 60; // 10:00
  const CLOSE = 17 * 60 + 30; // 17:30
  const AFTER_CLOSE = 18 * 60; // 18:00

  const isWeekday = day >= 1 && day <= 5;

  let sessionType: SessionType = "closed";
  if (isWeekday) {
    if (totalMin >= PRE_OPEN && totalMin < OPEN) sessionType = "pre";
    else if (totalMin >= OPEN && totalMin < CLOSE) sessionType = "regular";
    else if (totalMin >= CLOSE && totalMin < AFTER_CLOSE) sessionType = "after";
  }

  const isOpen = sessionType !== "closed";

  const labels: Record<SessionType, string> = {
    pre: "Pré-abertura",
    regular: "Mercado aberto",
    after: "After market",
    closed: "Mercado fechado",
  };

  // Polling intervals: aggressive during regular session, relaxed otherwise
  const intervals: Record<SessionType, number> = {
    pre: 60_000, // 1 min
    regular: 30_000, // 30 s — primary data freshness target
    after: 120_000, // 2 min
    closed: 300_000, // 5 min (data won't change, but validate cache)
  };

  const h = brt.getHours().toString().padStart(2, "0");
  const m = brt.getMinutes().toString().padStart(2, "0");

  return {
    isOpen,
    sessionType,
    label: labels[sessionType],
    pollIntervalMs: intervals[sessionType],
    brtTime: `${h}:${m}`,
    evaluatedAt: Date.now(),
  };
}

/** TTL values in ms for each data layer, adjusted for market state. */
export function getDataTTLs(session: SessionType) {
  const market = session === "regular" || session === "pre" || session === "after";
  return {
    /** Real-time price quotes */
    quote: market ? 30_000 : 300_000,
    /** Market-wide indices (IBOVESPA, USD/BRL) */
    indices: market ? 60_000 : 300_000,
    /** Daily OHLCV historical bars */
    historyDaily: market ? 300_000 : 3_600_000,
    /** Intraday OHLCV (5m/15m bars) */
    historyIntraday: market ? 60_000 : 300_000,
    /** Fundamentals (P/L, P/VP, ROE, DY) */
    fundamentals: 86_400_000, // always 24 h
    /** Ticker search results */
    search: 3_600_000, // 1 h
    /** SELIC rate (set by BCB, rarely changes) */
    selic: 3_600_000, // 1 h
  } as const;
}
