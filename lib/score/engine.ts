import type { IndicatorResult, ScoreBreakdown, Fundamental } from "@/types";

export function computeScore(
  indicators: IndicatorResult,
  fundamental: Partial<Fundamental>,
  currentPrice: number
): ScoreBreakdown {
  // Technical score (0-100, weight 35%)
  let tech = 50;
  const { rsi, macd, ema20, ema50, sma200 } = indicators;

  if (rsi !== null) {
    if (rsi < 30) tech += 15;
    else if (rsi > 70) tech -= 15;
    else if (rsi >= 45 && rsi <= 65) tech += 8;
  }
  if (macd.macd !== null && macd.signal !== null) {
    if (macd.macd > macd.signal) tech += 10;
    else tech -= 10;
  }
  if (ema20 !== null && ema50 !== null) {
    if (ema20 > ema50) tech += 8;
    else tech -= 8;
    if (currentPrice > ema20) tech += 5;
    else tech -= 5;
  }
  if (sma200 !== null) {
    if (currentPrice > sma200) tech += 7;
    else tech -= 7;
  }
  tech = Math.max(0, Math.min(100, tech));

  // Fundamental score (0-100, weight 30%)
  let fund = 50;
  if (fundamental.roe !== undefined && fundamental.roe !== null) {
    if (fundamental.roe > 0.2) fund += 15;
    else if (fundamental.roe > 0.1) fund += 8;
    else if (fundamental.roe < 0) fund -= 20;
  }
  if (fundamental.pl !== undefined && fundamental.pl !== null) {
    if (fundamental.pl > 0 && fundamental.pl < 15) fund += 10;
    else if (fundamental.pl > 30) fund -= 10;
    else if (fundamental.pl < 0) fund -= 15;
  }
  if (fundamental.pvp !== undefined && fundamental.pvp !== null) {
    if (fundamental.pvp < 1.5) fund += 8;
    else if (fundamental.pvp > 3) fund -= 8;
  }
  fund = Math.max(0, Math.min(100, fund));

  // Risk/Volatility score (0-100, weight 20%) — higher ATR = more risk = lower score
  let risk = 70;
  if (indicators.atr !== null && currentPrice > 0) {
    const atrPercent = (indicators.atr / currentPrice) * 100;
    if (atrPercent > 3) risk -= 25;
    else if (atrPercent > 2) risk -= 15;
    else if (atrPercent < 1) risk += 15;
  }
  risk = Math.max(0, Math.min(100, risk));

  // Dividend score (0-100, weight 15%)
  let dividend = 40;
  if (fundamental.dividendYield !== undefined && fundamental.dividendYield !== null) {
    const dy = fundamental.dividendYield;
    if (dy > 8) dividend = 90;
    else if (dy > 5) dividend = 75;
    else if (dy > 3) dividend = 60;
    else if (dy > 0) dividend = 45;
  }
  dividend = Math.max(0, Math.min(100, dividend));

  const total = Math.round(tech * 0.35 + fund * 0.30 + risk * 0.20 + dividend * 0.15);

  const confidence: ScoreBreakdown["confidence"] =
    total >= 65 ? "high" : total >= 45 ? "medium" : "low";

  return { total, technical: tech, fundamental: fund, risk, dividend, confidence };
}
