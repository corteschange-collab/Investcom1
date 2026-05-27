const BASE = "https://brapi.dev/api";
const TOKEN = process.env.BRAPI_TOKEN ?? "";

function buildUrl(path: string, params: Record<string, string> = {}): string {
  const url = new URL(`${BASE}${path}`);
  if (TOKEN) url.searchParams.set("token", TOKEN);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

export interface BrapiQuote {
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
  dividendsData?: {
    yield: number | null;
    yieldLast12Months: number | null;
  };
  summaryProfile?: {
    sector: string;
    industry: string;
  };
  defaultKeyStatistics?: {
    priceToBook: number | null;
    trailingEps: number | null;
    forwardPE: number | null;
  };
  financialData?: {
    returnOnEquity: number | null;
    revenueGrowth: number | null;
    ebitdaMargins: number | null;
  };
  historicalDataPrice?: Array<{
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export async function fetchQuote(
  ticker: string,
  modules: string[] = ["summaryProfile", "defaultKeyStatistics", "financialData", "dividendsData"]
): Promise<BrapiQuote | null> {
  try {
    const url = buildUrl(`/quote/${ticker}`, {
      modules: modules.join(","),
      fundamental: "true",
      dividends: "true",
    });
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.results?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function fetchHistory(
  ticker: string,
  range: string = "1y",
  interval: string = "1d"
): Promise<BrapiQuote | null> {
  try {
    const url = buildUrl(`/quote/${ticker}`, {
      range,
      interval,
      fundamental: "false",
    });
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.results?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function searchTickers(query: string): Promise<Array<{ ticker: string; name: string; type: string }>> {
  try {
    const url = buildUrl("/available", { search: query, limit: "10" });
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.stocks ?? []).map((s: { stock: string; name: string; type: string }) => ({
      ticker: s.stock,
      name: s.name,
      type: s.type,
    }));
  } catch {
    return [];
  }
}

export async function fetchMarketTrending(): Promise<BrapiQuote[]> {
  const tickers = ["PETR4", "VALE3", "ITUB4", "BBDC4", "MGLU3", "WEGE3", "BBAS3", "ABEV3", "RENT3", "GGBR4"];
  try {
    const url = buildUrl(`/quote/${tickers.join(",")}`, { fundamental: "false" });
    const res = await fetch(url, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results ?? [];
  } catch {
    return [];
  }
}
