/**
 * Market Data Pipeline
 *
 * Central orchestrator that:
 *  1. Checks in-process cache (hot path — no I/O)
 *  2. If stale: checks rate limit before hitting Brapi
 *  3. Falls back to Yahoo Finance if Brapi fails or is rate-limited
 *  4. Returns last stale cache entry if both sources fail
 *  5. Attaches freshness metadata to every response
 *
 * Callers never deal with sources directly — only this pipeline.
 */

import { marketCache, type DataSource } from "./cache";
import { brapiLimiter, yahooLimiter, bcbLimiter } from "./rate-limiter";
import { monitor, trackedFetch } from "./monitor";
import { getMarketStatus, getDataTTLs } from "./market-hours";

/* ── Types ─────────────────────────────────────────────── */

export interface QuoteData {
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  regularMarketChange: number;
  regularMarketVolume: number;
  marketCap: number | null;
  logourl: string | null;
  sector: string | null;
}

export interface IndexData {
  symbol: string;
  name: string;
  value: number;
  changePercent: number;
  change: number;
}

export interface OHLCVBar {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FreshQuote extends QuoteData {
  _meta: FreshnessMeta;
}

export interface FreshnessMeta {
  fetchedAt: number;
  ageMs: number;
  stale: boolean;
  source: DataSource;
}

/* ── Brapi helpers ──────────────────────────────────────── */

const BRAPI_BASE = "https://brapi.dev/api";
const BRAPI_TOKEN = () => process.env.BRAPI_TOKEN ?? "";

function brapiUrl(path: string, params: Record<string, string> = {}): string {
  const url = new URL(`${BRAPI_BASE}${path}`);
  const token = BRAPI_TOKEN();
  if (token) url.searchParams.set("token", token);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return url.toString();
}

async function brapiGet<T>(url: string, revalidate: number): Promise<T | null> {
  const res = await fetch(url, { next: { revalidate: Math.floor(revalidate / 1000) } });
  if (!res.ok) {
    monitor.warn("brapi", `HTTP ${res.status} for ${url}`);
    return null;
  }
  return res.json() as Promise<T>;
}

/* ── Yahoo Finance fallback ─────────────────────────────── */

async function yahooQuote(ticker: string): Promise<QuoteData | null> {
  if (!yahooLimiter.tryConsume()) {
    monitor.warn("yahoo", `Rate limited — skipping fallback for ${ticker}`);
    return null;
  }

  // Yahoo uses .SA suffix for Brazilian equities
  const yTicker = ticker.endsWith(".SA") ? ticker : `${ticker}.SA`;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yTicker}?interval=1d&range=1d`;

  const { data, error } = await trackedFetch<unknown>("yahoo", `quote/${ticker}`, async () => {
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 60 },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

  if (error || !data) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = data as any;
    const meta = d?.chart?.result?.[0]?.meta;
    if (!meta) return null;

    return {
      symbol: ticker,
      shortName: meta.shortName ?? ticker,
      longName: meta.longName ?? meta.shortName ?? ticker,
      currency: meta.currency ?? "BRL",
      regularMarketPrice: meta.regularMarketPrice ?? 0,
      regularMarketChangePercent: meta.regularMarketChangePercent ?? 0,
      regularMarketChange: meta.regularMarketChange ?? 0,
      regularMarketVolume: meta.regularMarketVolume ?? 0,
      marketCap: null,
      logourl: null,
      sector: null,
    };
  } catch {
    return null;
  }
}

/* ── BCB SELIC ──────────────────────────────────────────── */

export async function fetchSelic(): Promise<number | null> {
  const KEY = "selic";
  const { sessionType } = getMarketStatus();
  const ttl = getDataTTLs(sessionType).selic;

  if (marketCache.isFresh(KEY)) {
    return marketCache.get<number>(KEY)!.data;
  }

  if (!bcbLimiter.tryConsume()) {
    monitor.warn("bcb", "Rate limited — returning cached SELIC");
    return marketCache.get<number>(KEY)?.data ?? null;
  }

  const { data, error } = await trackedFetch<unknown>("bcb", "selic", async () => {
    const r = await fetch(
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados/ultimos/1?formato=json",
      { next: { revalidate: 3600 } }
    );
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

  if (error || !data) return marketCache.get<number>(KEY)?.data ?? null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr = data as any[];
    const rate = parseFloat(arr[0]?.valor?.replace(",", ".")) || null;
    if (rate !== null) marketCache.set(KEY, rate, ttl, "bcb");
    return rate;
  } catch {
    return marketCache.get<number>(KEY)?.data ?? null;
  }
}

/* ── Quote pipeline ─────────────────────────────────────── */

export async function fetchQuotesPipeline(
  tickers: string[]
): Promise<{ results: FreshQuote[]; rateLimitStats: ReturnType<typeof brapiLimiter.stats> }> {
  const { sessionType } = getMarketStatus();
  const ttl = getDataTTLs(sessionType).quote;
  const results: FreshQuote[] = [];
  const stale: string[] = [];

  // Split into cached (fresh) and needs-refresh
  for (const ticker of tickers) {
    const key = `quote:${ticker}`;
    if (marketCache.isFresh(key)) {
      const cached = marketCache.getWithMeta<QuoteData>(key)!;
      results.push({ ...cached.data, _meta: cached.meta });
    } else {
      stale.push(ticker);
    }
  }

  if (stale.length > 0) {
    if (!brapiLimiter.tryConsume()) {
      monitor.warn("pipeline", `Rate limited — serving stale for: ${stale.join(", ")}`);
      // Serve stale cache for remaining tickers
      for (const ticker of stale) {
        const key = `quote:${ticker}`;
        const cached = marketCache.getWithMeta<QuoteData>(key);
        if (cached) {
          results.push({ ...cached.data, _meta: { ...cached.meta, stale: true, source: "stale" } });
        }
      }
    } else {
      const batch = stale.join(",");
      const url = brapiUrl(`/quote/${batch}`, { fundamental: "false" });

      const { data, error } = await trackedFetch<{ results: QuoteData[] } | null>(
        "brapi",
        `quotes/${batch}`,
        () => brapiGet<{ results: QuoteData[] }>(url, ttl)
      );

      const fetched = error ? null : data?.results ?? null;

      for (const ticker of stale) {
        const key = `quote:${ticker}`;
        const fromBrapi = fetched?.find((q) => q.symbol === ticker);

        if (fromBrapi) {
          marketCache.set(key, fromBrapi, ttl, "brapi");
          const now = Date.now();
          results.push({
            ...fromBrapi,
            _meta: { fetchedAt: now, ageMs: 0, stale: false, source: "brapi" },
          });
          continue;
        }

        // Brapi returned nothing for this ticker — try Yahoo fallback
        const yahooDat = await yahooQuote(ticker);
        if (yahooDat) {
          marketCache.set(key, yahooDat, ttl, "yahoo");
          const now = Date.now();
          results.push({
            ...yahooDat,
            _meta: { fetchedAt: now, ageMs: 0, stale: false, source: "yahoo" },
          });
          continue;
        }

        // Both failed — return stale cache if available
        const staleCache = marketCache.getWithMeta<QuoteData>(key);
        if (staleCache) {
          monitor.warn("pipeline", `All sources failed for ${ticker} — serving stale cache`);
          results.push({ ...staleCache.data, _meta: { ...staleCache.meta, stale: true, source: "stale" } });
        } else {
          monitor.error("pipeline", `No data at all for ${ticker}`);
        }
      }
    }
  }

  return { results, rateLimitStats: brapiLimiter.stats() };
}

/* ── Market indices pipeline ────────────────────────────── */

const INDEX_TICKERS = ["^BVSP", "USDBRL=X", "IWBR11", "BOVA11"];
const INDEX_LABELS: Record<string, string> = {
  "^BVSP": "IBOVESPA",
  "USDBRL=X": "USD/BRL",
  IWBR11: "IFIX Proxy",
  BOVA11: "BOVA11",
};

export async function fetchIndicesPipeline(): Promise<{
  indices: IndexData[];
  selic: number | null;
  meta: FreshnessMeta;
}> {
  const KEY = "indices:batch";
  const { sessionType } = getMarketStatus();
  const ttl = getDataTTLs(sessionType).indices;

  if (marketCache.isFresh(KEY)) {
    const cached = marketCache.getWithMeta<IndexData[]>(KEY)!;
    const selic = await fetchSelic();
    return { indices: cached.data, selic, meta: cached.meta };
  }

  if (!brapiLimiter.tryConsume()) {
    monitor.warn("pipeline", "Rate limited — serving stale indices");
    const cached = marketCache.getWithMeta<IndexData[]>(KEY);
    const selic = await fetchSelic();
    if (cached) return { indices: cached.data, selic, meta: { ...cached.meta, stale: true, source: "stale" } };
    return { indices: [], selic, meta: { fetchedAt: 0, ageMs: 0, stale: true, source: "stale" } };
  }

  const batch = INDEX_TICKERS.join(",");
  const url = brapiUrl(`/quote/${batch}`, { fundamental: "false" });

  const { data, error } = await trackedFetch<{ results: QuoteData[] } | null>(
    "brapi",
    "indices",
    () => brapiGet<{ results: QuoteData[] }>(url, ttl)
  );

  const selic = await fetchSelic();

  if (error || !data?.results?.length) {
    const cached = marketCache.getWithMeta<IndexData[]>(KEY);
    if (cached) return { indices: cached.data, selic, meta: { ...cached.meta, stale: true, source: "stale" } };
    return { indices: [], selic, meta: { fetchedAt: 0, ageMs: 0, stale: true, source: "stale" } };
  }

  const indices: IndexData[] = data.results.map((q) => ({
    symbol: q.symbol,
    name: INDEX_LABELS[q.symbol] ?? q.shortName,
    value: q.regularMarketPrice,
    changePercent: q.regularMarketChangePercent,
    change: q.regularMarketChange,
  }));

  const now = Date.now();
  marketCache.set(KEY, indices, ttl, "brapi");
  return {
    indices,
    selic,
    meta: { fetchedAt: now, ageMs: 0, stale: false, source: "brapi" },
  };
}

/* ── History pipeline ───────────────────────────────────── */

export async function fetchHistoryPipeline(
  ticker: string,
  range: string,
  interval: string
): Promise<{ bars: OHLCVBar[]; meta: FreshnessMeta } | null> {
  const KEY = `history:${ticker}:${range}:${interval}`;
  const { sessionType } = getMarketStatus();
  const ttl =
    interval === "1d" || interval === "1wk"
      ? getDataTTLs(sessionType).historyDaily
      : getDataTTLs(sessionType).historyIntraday;

  if (marketCache.isFresh(KEY)) {
    const cached = marketCache.getWithMeta<OHLCVBar[]>(KEY)!;
    return { bars: cached.data, meta: cached.meta };
  }

  if (!brapiLimiter.tryConsume()) {
    monitor.warn("pipeline", `Rate limited — stale history for ${ticker}`);
    const cached = marketCache.getWithMeta<OHLCVBar[]>(KEY);
    if (cached) return { bars: cached.data, meta: { ...cached.meta, stale: true, source: "stale" } };
    return null;
  }

  const url = brapiUrl(`/quote/${ticker}`, { range, interval, fundamental: "false" });

  const { data, error } = await trackedFetch<{ results: { historicalDataPrice: OHLCVBar[] }[] } | null>(
    "brapi",
    `history/${ticker}`,
    () =>
      brapiGet<{ results: { historicalDataPrice: OHLCVBar[] }[] }>(url, ttl)
  );

  if (error || !data?.results?.[0]) {
    const cached = marketCache.getWithMeta<OHLCVBar[]>(KEY);
    if (cached) return { bars: cached.data, meta: { ...cached.meta, stale: true, source: "stale" } };
    return null;
  }

  const bars = data.results[0].historicalDataPrice ?? [];
  const now = Date.now();
  marketCache.set(KEY, bars, ttl, "brapi");
  return { bars, meta: { fetchedAt: now, ageMs: 0, stale: false, source: "brapi" } };
}
