import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { fetchMarketTrending } from "@/lib/api/brapi";
import { MarketCard } from "@/components/dashboard/market-card";
import type { BrapiQuote } from "@/lib/api/brapi";

const FALLBACK: BrapiQuote[] = [
  { symbol: "PETR4", shortName: "Petrobras PN", longName: "Petróleo Brasileiro", currency: "BRL", regularMarketPrice: 38.42, regularMarketChangePercent: 2.14, regularMarketChange: 0.81, regularMarketVolume: 48000000, marketCap: null, logourl: null, sector: "Energia" },
  { symbol: "VALE3", shortName: "Vale ON", longName: "Vale S.A.", currency: "BRL", regularMarketPrice: 67.80, regularMarketChangePercent: -0.92, regularMarketChange: -0.63, regularMarketVolume: 32000000, marketCap: null, logourl: null, sector: "Mineração" },
  { symbol: "ITUB4", shortName: "Itaú Unibanco PN", longName: "Itaú Unibanco Holding", currency: "BRL", regularMarketPrice: 35.10, regularMarketChangePercent: 0.57, regularMarketChange: 0.20, regularMarketVolume: 25000000, marketCap: null, logourl: null, sector: "Financeiro" },
  { symbol: "WEGE3", shortName: "WEG ON", longName: "WEG S.A.", currency: "BRL", regularMarketPrice: 48.20, regularMarketChangePercent: 1.45, regularMarketChange: 0.69, regularMarketVolume: 8500000, marketCap: null, logourl: null, sector: "Industrial" },
  { symbol: "BBAS3", shortName: "Banco do Brasil ON", longName: "Banco do Brasil S.A.", currency: "BRL", regularMarketPrice: 24.80, regularMarketChangePercent: -1.22, regularMarketChange: -0.31, regularMarketVolume: 18000000, marketCap: null, logourl: null, sector: "Financeiro" },
  { symbol: "ABEV3", shortName: "Ambev ON", longName: "Ambev S.A.", currency: "BRL", regularMarketPrice: 12.60, regularMarketChangePercent: 0.24, regularMarketChange: 0.03, regularMarketVolume: 22000000, marketCap: null, logourl: null, sector: "Consumo" },
  { symbol: "MGLU3", shortName: "Magazine Luiza ON", longName: "Magazine Luiza S.A.", currency: "BRL", regularMarketPrice: 8.20, regularMarketChangePercent: -2.14, regularMarketChange: -0.18, regularMarketVolume: 45000000, marketCap: null, logourl: null, sector: "Varejo" },
  { symbol: "RENT3", shortName: "Localiza ON", longName: "Localiza Rent a Car S.A.", currency: "BRL", regularMarketPrice: 52.40, regularMarketChangePercent: 0.77, regularMarketChange: 0.40, regularMarketVolume: 7000000, marketCap: null, logourl: null, sector: "Mobilidade" },
];

export default async function AtivosPage() {
  const quotes = await fetchMarketTrending().catch(() => FALLBACK);
  const data = quotes.length > 0 ? quotes : FALLBACK;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp size={22} className="text-primary" />
          Ativos
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ações, FIIs e ETFs da B3 em destaque
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((q) => (
          <Link key={q.symbol} href={`/dashboard/ativos/${q.symbol}`}>
            <MarketCard
              ticker={q.symbol}
              name={q.shortName}
              price={q.regularMarketPrice}
              change={q.regularMarketChange}
              changePercent={q.regularMarketChangePercent}
              volume={q.regularMarketVolume}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
