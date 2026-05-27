// Core financial types

export interface Asset {
  ticker: string;
  name: string;
  type: "stock" | "fii" | "etf" | "bdr";
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  logoUrl?: string;
  sector?: string;
}

export interface OHLCV {
  time: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorResult {
  rsi: number | null;
  macd: {
    macd: number | null;
    signal: number | null;
    histogram: number | null;
  };
  ema20: number | null;
  ema50: number | null;
  sma200: number | null;
  bollingerBands: {
    upper: number | null;
    middle: number | null;
    lower: number | null;
  };
  atr: number | null;
  adx: number | null;
  obv: number | null;
  vwap: number | null;
}

export interface ScoreBreakdown {
  total: number; // 0-100
  technical: number;
  fundamental: number;
  risk: number;
  dividend: number;
  confidence: "low" | "medium" | "high";
}

export interface ProbabilisticScenario {
  scenario: "bullish" | "neutral" | "bearish";
  probability: number; // 0-100
  description: string;
  signals: string[];
  timeframe: string;
}

export interface Fundamental {
  ticker: string;
  pl?: number; // P/L
  pvp?: number; // P/VP
  roe?: number;
  dividendYield?: number;
  revenue?: number;
  netMargin?: number;
  debtEquity?: number;
  ebitda?: number;
}

export interface WatchlistItem {
  ticker: string;
  addedAt: string;
  notes?: string;
  dbId?: string; // set after DB sync
}

export interface Alert {
  id: string;
  ticker: string;
  type: "price_above" | "price_below" | "rsi_overbought" | "rsi_oversold" | "volume_spike";
  value: number;
  active: boolean;
  createdAt: string;
}

export type InvestorProfile = "conservative" | "moderate" | "aggressive";

export type Timeframe = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";
