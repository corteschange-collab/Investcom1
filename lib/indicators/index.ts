import type { OHLCV, IndicatorResult } from "@/types";

function ema(values: number[], period: number): number[] {
  if (values.length < period) return values.map(() => NaN);
  const k = 2 / (period + 1);
  const result: number[] = new Array(values.length).fill(NaN);
  let sum = 0;
  for (let i = 0; i < period; i++) sum += values[i];
  result[period - 1] = sum / period;
  for (let i = period; i < values.length; i++) {
    result[i] = values[i] * k + result[i - 1] * (1 - k);
  }
  return result;
}

function sma(values: number[], period: number): number[] {
  const result: number[] = new Array(values.length).fill(NaN);
  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1);
    result[i] = slice.reduce((a, b) => a + b, 0) / period;
  }
  return result;
}

function rsi(closes: number[], period = 14): number {
  if (closes.length < period + 1) return NaN;
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i <= period; i++) {
    const diff = closes[closes.length - period + i - 1] - closes[closes.length - period + i - 2];
    gains.push(Math.max(0, diff));
    losses.push(Math.max(0, -diff));
  }
  const avgGain = gains.reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function macdCalc(closes: number[]): { macd: number; signal: number; histogram: number } {
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  const macdLine = ema12.map((v, i) => v - ema26[i]).filter((v) => !isNaN(v));
  if (macdLine.length < 9)
    return { macd: NaN, signal: NaN, histogram: NaN };
  const signalLine = ema(macdLine, 9);
  const lastMacd = macdLine[macdLine.length - 1];
  const lastSignal = signalLine[signalLine.length - 1];
  return { macd: lastMacd, signal: lastSignal, histogram: lastMacd - lastSignal };
}

function bollingerBands(closes: number[], period = 20, stdDev = 2) {
  if (closes.length < period) return { upper: NaN, middle: NaN, lower: NaN };
  const slice = closes.slice(-period);
  const mid = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((acc, v) => acc + (v - mid) ** 2, 0) / period;
  const sd = Math.sqrt(variance) * stdDev;
  return { upper: mid + sd, middle: mid, lower: mid - sd };
}

function atr(data: OHLCV[], period = 14): number {
  if (data.length < 2) return NaN;
  const trs = data.slice(1).map((bar, i) => {
    const prevClose = data[i].close;
    return Math.max(
      bar.high - bar.low,
      Math.abs(bar.high - prevClose),
      Math.abs(bar.low - prevClose)
    );
  });
  if (trs.length < period) return NaN;
  return trs.slice(-period).reduce((a, b) => a + b, 0) / period;
}

function obv(data: OHLCV[]): number {
  let total = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i].close > data[i - 1].close) total += data[i].volume;
    else if (data[i].close < data[i - 1].close) total -= data[i].volume;
  }
  return total;
}

function vwap(data: OHLCV[]): number {
  const last30 = data.slice(-30);
  const sumPV = last30.reduce((acc, b) => acc + ((b.high + b.low + b.close) / 3) * b.volume, 0);
  const sumV = last30.reduce((acc, b) => acc + b.volume, 0);
  return sumV === 0 ? NaN : sumPV / sumV;
}

export function computeIndicators(data: OHLCV[]): IndicatorResult {
  const closes = data.map((d) => d.close);

  const ema20Arr = ema(closes, 20);
  const ema50Arr = ema(closes, 50);
  const sma200Arr = sma(closes, 200);
  const macdResult = macdCalc(closes);
  const bbResult = bollingerBands(closes);

  return {
    rsi: isNaN(rsi(closes)) ? null : rsi(closes),
    macd: {
      macd: isNaN(macdResult.macd) ? null : macdResult.macd,
      signal: isNaN(macdResult.signal) ? null : macdResult.signal,
      histogram: isNaN(macdResult.histogram) ? null : macdResult.histogram,
    },
    ema20: isNaN(ema20Arr[ema20Arr.length - 1]) ? null : ema20Arr[ema20Arr.length - 1],
    ema50: isNaN(ema50Arr[ema50Arr.length - 1]) ? null : ema50Arr[ema50Arr.length - 1],
    sma200: isNaN(sma200Arr[sma200Arr.length - 1]) ? null : sma200Arr[sma200Arr.length - 1],
    bollingerBands: {
      upper: isNaN(bbResult.upper) ? null : bbResult.upper,
      middle: isNaN(bbResult.middle) ? null : bbResult.middle,
      lower: isNaN(bbResult.lower) ? null : bbResult.lower,
    },
    atr: isNaN(atr(data)) ? null : atr(data),
    adx: null, // Requires DX series — implement when needed
    obv: obv(data),
    vwap: isNaN(vwap(data)) ? null : vwap(data),
  };
}

export function generateScenarios(
  indicators: IndicatorResult,
  currentPrice: number
): import("@/types").ProbabilisticScenario[] {
  const signals: string[] = [];
  let bullScore = 0;
  let bearScore = 0;

  const { rsi, macd, ema20, ema50, sma200, bollingerBands: bb } = indicators;

  if (rsi !== null) {
    if (rsi < 30) { bullScore += 2; signals.push("RSI em zona de sobrevenda"); }
    else if (rsi > 70) { bearScore += 2; signals.push("RSI em zona de sobrecompra"); }
    else if (rsi > 50) { bullScore += 1; signals.push("RSI saudável acima de 50"); }
  }

  if (macd.macd !== null && macd.signal !== null) {
    if (macd.macd > macd.signal) { bullScore += 2; signals.push("MACD acima da linha de sinal"); }
    else { bearScore += 1; signals.push("MACD abaixo da linha de sinal"); }
    if (macd.histogram !== null && macd.histogram > 0) {
      bullScore += 1; signals.push("Histograma MACD positivo");
    }
  }

  if (ema20 !== null && ema50 !== null) {
    if (ema20 > ema50) { bullScore += 1; signals.push("EMA20 acima da EMA50 (tendência de alta)"); }
    else { bearScore += 1; signals.push("EMA20 abaixo da EMA50 (tendência de baixa)"); }
    if (currentPrice > ema20) { bullScore += 1; signals.push("Preço acima da EMA20"); }
    else { bearScore += 1; signals.push("Preço abaixo da EMA20"); }
  }

  if (sma200 !== null) {
    if (currentPrice > sma200) { bullScore += 1; signals.push("Preço acima da SMA200 (tendência macro de alta)"); }
    else { bearScore += 1; signals.push("Preço abaixo da SMA200 (tendência macro de baixa)"); }
  }

  if (bb.lower !== null && bb.upper !== null) {
    if (currentPrice < bb.lower) { bullScore += 1; signals.push("Preço abaixo da banda inferior de Bollinger"); }
    else if (currentPrice > bb.upper) { bearScore += 1; signals.push("Preço acima da banda superior de Bollinger"); }
  }

  const total = bullScore + bearScore || 1;
  const bullProb = Math.min(85, Math.round((bullScore / total) * 100));
  const bearProb = Math.min(85, Math.round((bearScore / total) * 100));
  const neutralProb = 100 - bullProb - bearProb;

  return [
    {
      scenario: "bullish",
      probability: bullProb,
      description: bullProb >= 55 ? "Sinais técnicos apontam para continuação de alta" : "Possibilidade de recuperação observada",
      signals: signals.filter((s) => s.toLowerCase().includes("alta") || s.toLowerCase().includes("acima") || s.toLowerCase().includes("positivo")),
      timeframe: "Curto prazo (7-15 dias)",
    },
    {
      scenario: "neutral",
      probability: Math.max(10, neutralProb),
      description: "Mercado em consolidação, aguardando catalisador",
      signals: ["Volume médio", "Sem tendência definida"],
      timeframe: "Curto prazo",
    },
    {
      scenario: "bearish",
      probability: bearProb,
      description: bearProb >= 55 ? "Sinais técnicos indicam pressão vendedora" : "Risco de correção moderado",
      signals: signals.filter((s) => s.toLowerCase().includes("baixa") || s.toLowerCase().includes("abaixo") || s.toLowerCase().includes("sobrecompra")),
      timeframe: "Curto prazo (7-15 dias)",
    },
  ];
}
