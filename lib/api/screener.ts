import { fetchHistory } from "./brapi";
import { computeIndicators, generateScenarios } from "@/lib/indicators";
import { computeScore } from "@/lib/score/engine";
import type { OHLCV } from "@/types";

export interface ScreenerResult {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  score: number;
  rsi: number | null;
  macdSignal: "bullish" | "bearish" | "neutral";
  trend: "up" | "down" | "sideways";
  signals: string[];
  bullishProb: number;
}

const UNIVERSE = [
  { ticker: "PETR4", name: "Petrobras PN" },
  { ticker: "VALE3", name: "Vale ON" },
  { ticker: "ITUB4", name: "Itaú Unibanco PN" },
  { ticker: "WEGE3", name: "WEG ON" },
  { ticker: "BBAS3", name: "Banco do Brasil ON" },
  { ticker: "ABEV3", name: "Ambev ON" },
  { ticker: "MGLU3", name: "Magazine Luiza" },
  { ticker: "RENT3", name: "Localiza" },
  { ticker: "GGBR4", name: "Gerdau PN" },
  { ticker: "LREN3", name: "Lojas Renner" },
  { ticker: "SUZB3", name: "Suzano" },
  { ticker: "JBSS3", name: "JBS" },
  { ticker: "MXRF11", name: "Maxi Renda FII" },
  { ticker: "KNRI11", name: "Kinea Renda Imobiliária" },
  { ticker: "BOVA11", name: "iShares Ibovespa ETF" },
];

// Fallback screener data (used when API is unavailable)
export const FALLBACK_SCREENER: ScreenerResult[] = [
  { ticker: "WEGE3", name: "WEG ON", price: 48.20, changePercent: 1.45, score: 78, rsi: 52, macdSignal: "bullish", trend: "up", signals: ["MACD acima da linha de sinal", "EMA20 acima da EMA50", "Preço acima da SMA200"], bullishProb: 68 },
  { ticker: "PETR4", name: "Petrobras PN", price: 38.42, changePercent: 2.14, score: 72, rsi: 58, macdSignal: "bullish", trend: "up", signals: ["RSI saudável acima de 50", "Preço acima da EMA20", "Histograma MACD positivo"], bullishProb: 62 },
  { ticker: "BBAS3", name: "Banco do Brasil", price: 24.80, changePercent: -1.22, score: 42, rsi: 31, macdSignal: "bearish", trend: "down", signals: ["RSI em zona de sobrevenda", "Preço abaixo da EMA20"], bullishProb: 38 },
  { ticker: "VALE3", name: "Vale ON", price: 67.80, changePercent: -0.92, score: 55, rsi: 44, macdSignal: "neutral", trend: "sideways", signals: ["EMA20 próxima à EMA50", "Volume médio"], bullishProb: 50 },
  { ticker: "MXRF11", name: "Maxi Renda FII", price: 10.18, changePercent: 0.69, score: 65, rsi: 55, macdSignal: "bullish", trend: "up", signals: ["Preço acima da EMA20", "MACD acima da linha de sinal"], bullishProb: 60 },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", price: 35.10, changePercent: 0.57, score: 61, rsi: 50, macdSignal: "neutral", trend: "sideways", signals: ["RSI neutro", "Sem tendência definida"], bullishProb: 51 },
];

export async function runScreener(): Promise<ScreenerResult[]> {
  const results: ScreenerResult[] = [];

  // Fetch a subset in parallel (respect rate limits)
  const batch = UNIVERSE.slice(0, 8);

  await Promise.allSettled(
    batch.map(async ({ ticker, name }) => {
      try {
        const history = await fetchHistory(ticker, "6mo", "1d");
        if (!history?.historicalDataPrice?.length) return;

        const ohlcv: OHLCV[] = history.historicalDataPrice.map((d) => ({
          time: d.date,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
        }));

        if (ohlcv.length < 30) return;

        const indicators = computeIndicators(ohlcv);
        const scenarios = generateScenarios(indicators, ohlcv[ohlcv.length - 1].close);
        const score = computeScore(indicators, {}, ohlcv[ohlcv.length - 1].close);

        const lastPrice = ohlcv[ohlcv.length - 1].close;
        const prevPrice = ohlcv[ohlcv.length - 2].close;
        const changePercent = ((lastPrice - prevPrice) / prevPrice) * 100;

        const macdSignal: "bullish" | "bearish" | "neutral" =
          indicators.macd.macd !== null && indicators.macd.signal !== null
            ? indicators.macd.macd > indicators.macd.signal
              ? "bullish"
              : "bearish"
            : "neutral";

        const trend: "up" | "down" | "sideways" =
          indicators.ema20 !== null && indicators.ema50 !== null
            ? indicators.ema20 > indicators.ema50 * 1.01
              ? "up"
              : indicators.ema20 < indicators.ema50 * 0.99
              ? "down"
              : "sideways"
            : "sideways";

        const bullish = scenarios.find((s) => s.scenario === "bullish");
        const allSignals = scenarios.flatMap((s) => s.signals).slice(0, 4);

        results.push({
          ticker,
          name,
          price: lastPrice,
          changePercent,
          score: score.total,
          rsi: indicators.rsi,
          macdSignal,
          trend,
          signals: allSignals,
          bullishProb: bullish?.probability ?? 50,
        });
      } catch {
        // Skip failed tickers
      }
    })
  );

  return results.length > 0
    ? results.sort((a, b) => b.score - a.score)
    : FALLBACK_SCREENER;
}
