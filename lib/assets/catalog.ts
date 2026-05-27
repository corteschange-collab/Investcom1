/**
 * Asset Catalog — InvestAI
 *
 * Curated universe of assets per class/subclass.
 * - B3 assets (ações, ETFs, FIIs, BDRs): fetched via Brapi.dev
 * - Crypto + Commodities: fetched via Yahoo Finance
 * - Tesouro Direto: fetched via Tesouro Transparência API
 * - Renda fixa (CDB/LCI/LCA): reference rates only (no public API)
 *
 * This file does NOT perform I/O — it is the static catalog.
 * Actual prices come from the market pipeline at runtime.
 */

import type { AssetClass, AssetSubclass } from "./taxonomy";

/* ── Asset entry types ───────────────────────────────────── */

export interface CatalogEntry {
  ticker: string;
  name: string;
  class: AssetClass;
  subclass: AssetSubclass;
  /** Yahoo Finance ticker (if different from B3 ticker, or for non-B3 assets) */
  yahooTicker?: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  /** For fixed income: CDI multiplier, IPCA spread, or prefixed rate */
  referenceRate?: string;
  notes?: string;
}

export interface FixedIncomeEntry {
  id: string;
  name: string;
  subclass: AssetSubclass;
  indexer: "cdi" | "ipca" | "pre" | "selic";
  /** e.g. "CDI + 0%" | "IPCA + 6,20%" | "12,5% a.a." */
  rateLabel: string;
  irExempt: boolean;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  termMonths: number | null;
  issuer: string;
  notes?: string;
}

export interface TesouroDiretoEntry {
  id: string;
  name: string;
  subclass: "tesouro-selic" | "tesouro-ipca" | "tesouro-prefixado";
  maturityYear: number;
  indexer: "selic" | "ipca" | "pre";
  /** API fetches live rate; this is just a label placeholder */
  rateLabel: string;
  riskLevel: 1;
  minimumInvestment: number;
  irExempt: false;
}

/* ── Ações ───────────────────────────────────────────────── */

export const ACOES_BLUE_CHIPS: CatalogEntry[] = [
  { ticker: "PETR4", name: "Petrobras PN", class: "acoes", subclass: "blue-chips", riskLevel: 3 },
  { ticker: "VALE3", name: "Vale ON", class: "acoes", subclass: "blue-chips", riskLevel: 3 },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", class: "acoes", subclass: "blue-chips", riskLevel: 3 },
  { ticker: "BBDC4", name: "Bradesco PN", class: "acoes", subclass: "blue-chips", riskLevel: 3 },
  { ticker: "BBAS3", name: "Banco do Brasil ON", class: "acoes", subclass: "blue-chips", riskLevel: 3 },
  { ticker: "ABEV3", name: "Ambev ON", class: "acoes", subclass: "blue-chips", riskLevel: 2 },
  { ticker: "WEGE3", name: "WEG ON", class: "acoes", subclass: "blue-chips", riskLevel: 2 },
  { ticker: "RENT3", name: "Localiza ON", class: "acoes", subclass: "blue-chips", riskLevel: 3 },
  { ticker: "GGBR4", name: "Gerdau PN", class: "acoes", subclass: "blue-chips", riskLevel: 3 },
  { ticker: "SUZB3", name: "Suzano ON", class: "acoes", subclass: "blue-chips", riskLevel: 3 },
  { ticker: "JBSS3", name: "JBS ON", class: "acoes", subclass: "blue-chips", riskLevel: 3 },
  { ticker: "LREN3", name: "Lojas Renner ON", class: "acoes", subclass: "blue-chips", riskLevel: 3 },
  { ticker: "RADL3", name: "RaiaDrogasil ON", class: "acoes", subclass: "blue-chips", riskLevel: 2 },
  { ticker: "VIVT3", name: "Telefônica ON", class: "acoes", subclass: "blue-chips", riskLevel: 2 },
  { ticker: "TOTS3", name: "TOTVS ON", class: "acoes", subclass: "blue-chips", riskLevel: 2 },
];

export const ACOES_DIVIDENDOS: CatalogEntry[] = [
  { ticker: "TAEE11", name: "Taesa UNT", class: "acoes", subclass: "dividendos", riskLevel: 2 },
  { ticker: "EGIE3", name: "Engie Brasil ON", class: "acoes", subclass: "dividendos", riskLevel: 2 },
  { ticker: "CPLE6", name: "Copel PNB", class: "acoes", subclass: "dividendos", riskLevel: 2 },
  { ticker: "CMIG4", name: "Cemig PN", class: "acoes", subclass: "dividendos", riskLevel: 2 },
  { ticker: "SBSP3", name: "Sabesp ON", class: "acoes", subclass: "dividendos", riskLevel: 2 },
  { ticker: "BBAS3", name: "Banco do Brasil ON", class: "acoes", subclass: "dividendos", riskLevel: 3 },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", class: "acoes", subclass: "dividendos", riskLevel: 3 },
  { ticker: "PETR4", name: "Petrobras PN", class: "acoes", subclass: "dividendos", riskLevel: 3 },
  { ticker: "VALE3", name: "Vale ON", class: "acoes", subclass: "dividendos", riskLevel: 3 },
];

export const ACOES_SMALL_CAPS: CatalogEntry[] = [
  { ticker: "ALOS3", name: "Allos ON", class: "acoes", subclass: "small-caps", riskLevel: 4 },
  { ticker: "PETZ3", name: "Petz ON", class: "acoes", subclass: "small-caps", riskLevel: 4 },
  { ticker: "SIMH3", name: "Simpar ON", class: "acoes", subclass: "small-caps", riskLevel: 4 },
  { ticker: "EZTC3", name: "EZTEC ON", class: "acoes", subclass: "small-caps", riskLevel: 4 },
  { ticker: "MRVE3", name: "MRV ON", class: "acoes", subclass: "small-caps", riskLevel: 4 },
  { ticker: "CYRE3", name: "Cyrela ON", class: "acoes", subclass: "small-caps", riskLevel: 4 },
  { ticker: "SMTO3", name: "São Martinho ON", class: "acoes", subclass: "small-caps", riskLevel: 3 },
  { ticker: "SLCE3", name: "SLC Agrícola ON", class: "acoes", subclass: "small-caps", riskLevel: 3 },
  { ticker: "RAIZ4", name: "Raízen PN", class: "acoes", subclass: "small-caps", riskLevel: 3 },
  { ticker: "NTCO3", name: "Natura ON", class: "acoes", subclass: "small-caps", riskLevel: 4 },
];

export const ACOES_GROWTH: CatalogEntry[] = [
  { ticker: "TOTS3", name: "TOTVS ON", class: "acoes", subclass: "growth", riskLevel: 3 },
  { ticker: "WEGE3", name: "WEG ON", class: "acoes", subclass: "growth", riskLevel: 2, notes: "Compounding machine brasileiro" },
  { ticker: "RDRD3", name: "Ri Happy ON", class: "acoes", subclass: "growth", riskLevel: 4 },
  { ticker: "LWSA3", name: "Locaweb ON", class: "acoes", subclass: "growth", riskLevel: 4 },
  { ticker: "HAPV3", name: "Hapvida ON", class: "acoes", subclass: "growth", riskLevel: 4 },
  { ticker: "QUAL3", name: "Qualicorp ON", class: "acoes", subclass: "growth", riskLevel: 4 },
  { ticker: "FLRY3", name: "Fleury ON", class: "acoes", subclass: "growth", riskLevel: 3 },
  { ticker: "RDOR3", name: "Rede D'or ON", class: "acoes", subclass: "growth", riskLevel: 3 },
];

/* ── ETFs ────────────────────────────────────────────────── */

export const ETFS: CatalogEntry[] = [
  // Ibovespa
  { ticker: "BOVA11", name: "iShares Ibovespa", class: "etfs", subclass: "etf-ibovespa", riskLevel: 3 },
  { ticker: "BOVB11", name: "BNP Ibovespa", class: "etfs", subclass: "etf-ibovespa", riskLevel: 3 },
  // Small caps
  { ticker: "SMAL11", name: "iShares Small Cap", class: "etfs", subclass: "etf-ibovespa", riskLevel: 4 },
  // Dividendos
  { ticker: "DIVO11", name: "It Now IDIV", class: "etfs", subclass: "etf-dividendos", riskLevel: 3 },
  // Internacional
  { ticker: "IVVB11", name: "iShares S&P 500", class: "etfs", subclass: "etf-internacional", yahooTicker: "IVVB11.SA", riskLevel: 3 },
  { ticker: "SPXI11", name: "It Now S&P 500", class: "etfs", subclass: "etf-internacional", riskLevel: 3 },
  { ticker: "NASD11", name: "Invesco Nasdaq", class: "etfs", subclass: "etf-internacional", riskLevel: 4 },
  // Setorial
  { ticker: "HASH11", name: "Hashdex Nasdaq Crypto", class: "etfs", subclass: "etf-setorial", riskLevel: 5 },
  { ticker: "TECB11", name: "iShares BM&F Ibovespa Tecnologia", class: "etfs", subclass: "etf-setorial", riskLevel: 4 },
  { ticker: "FIND11", name: "iShares Financeiro", class: "etfs", subclass: "etf-setorial", riskLevel: 3 },
  { ticker: "ESGB11", name: "iShares ESG", class: "etfs", subclass: "etf-outros", riskLevel: 3 },
  { ticker: "GOVE11", name: "iShares Governança", class: "etfs", subclass: "etf-outros", riskLevel: 3 },
];

/* ── FIIs ────────────────────────────────────────────────── */

export const FIIS: CatalogEntry[] = [
  // Papel (CRI/CRA)
  { ticker: "MXRF11", name: "Maxi Renda", class: "fiis", subclass: "fii-papel", riskLevel: 2 },
  { ticker: "IRDM11", name: "Iridium Recebíveis", class: "fiis", subclass: "fii-papel", riskLevel: 2 },
  { ticker: "RBRR11", name: "RBR Rendimento High Grade", class: "fiis", subclass: "fii-papel", riskLevel: 2 },
  { ticker: "RBRL11", name: "RBR Log", class: "fiis", subclass: "fii-papel", riskLevel: 3 },
  { ticker: "ALZR11", name: "Alianza Trust Renda Imobiliária", class: "fiis", subclass: "fii-papel", riskLevel: 2 },
  { ticker: "RZTR11", name: "Riza Terrax", class: "fiis", subclass: "fii-papel", riskLevel: 3 },
  // Tijolo — Logística
  { ticker: "HGLG11", name: "CSHG Logística", class: "fiis", subclass: "fii-logistica", riskLevel: 3 },
  { ticker: "XPLG11", name: "XP Log", class: "fiis", subclass: "fii-logistica", riskLevel: 3 },
  { ticker: "BTLG11", name: "BTG Logística", class: "fiis", subclass: "fii-logistica", riskLevel: 3 },
  { ticker: "BRCO11", name: "Bresco Logística", class: "fiis", subclass: "fii-logistica", riskLevel: 3 },
  // Tijolo — Lajes Corporativas
  { ticker: "KNRI11", name: "Kinea Renda Imobiliária", class: "fiis", subclass: "fii-lajes", riskLevel: 3 },
  { ticker: "RECT11", name: "REC Gestão Imobiliária", class: "fiis", subclass: "fii-lajes", riskLevel: 3 },
  { ticker: "LVBI11", name: "VBI Logístico", class: "fiis", subclass: "fii-lajes", riskLevel: 3 },
  // Tijolo — Shopping
  { ticker: "XPML11", name: "XP Malls", class: "fiis", subclass: "fii-shopping", riskLevel: 3 },
  { ticker: "VISC11", name: "Vinci Shopping Centers", class: "fiis", subclass: "fii-shopping", riskLevel: 3 },
  { ticker: "HSML11", name: "HSI Malls", class: "fiis", subclass: "fii-shopping", riskLevel: 3 },
  // FOF
  { ticker: "BCFF11", name: "BTG Fundo de Fundos", class: "fiis", subclass: "fii-fof", riskLevel: 3 },
  { ticker: "KFOF11", name: "Kinea Fundo de Fundos", class: "fiis", subclass: "fii-fof", riskLevel: 3 },
  { ticker: "RBRF11", name: "RBR Alpha FOF", class: "fiis", subclass: "fii-fof", riskLevel: 3 },
];

/* ── BDRs ────────────────────────────────────────────────── */

export const BDRS: CatalogEntry[] = [
  // Big tech americana
  { ticker: "AAPL34", name: "Apple", class: "bdrs", subclass: "bdr-acao", yahooTicker: "AAPL", riskLevel: 3 },
  { ticker: "MSFT34", name: "Microsoft", class: "bdrs", subclass: "bdr-acao", yahooTicker: "MSFT", riskLevel: 3 },
  { ticker: "GOGL34", name: "Alphabet (Google)", class: "bdrs", subclass: "bdr-acao", yahooTicker: "GOOGL", riskLevel: 3 },
  { ticker: "AMZO34", name: "Amazon", class: "bdrs", subclass: "bdr-acao", yahooTicker: "AMZN", riskLevel: 3 },
  { ticker: "NVDC34", name: "NVIDIA", class: "bdrs", subclass: "bdr-acao", yahooTicker: "NVDA", riskLevel: 4 },
  { ticker: "META34", name: "Meta Platforms", class: "bdrs", subclass: "bdr-acao", yahooTicker: "META", riskLevel: 3 },
  { ticker: "TSLA34", name: "Tesla", class: "bdrs", subclass: "bdr-acao", yahooTicker: "TSLA", riskLevel: 5 },
  { ticker: "BERK34", name: "Berkshire Hathaway", class: "bdrs", subclass: "bdr-acao", yahooTicker: "BRK-B", riskLevel: 2 },
  // ETFs americanos como BDR
  { ticker: "SPYB34", name: "SPDR S&P 500 ETF", class: "bdrs", subclass: "bdr-etf", yahooTicker: "SPY", riskLevel: 3 },
  { ticker: "QQQM34", name: "Invesco QQQ (Nasdaq 100)", class: "bdrs", subclass: "bdr-etf", yahooTicker: "QQQ", riskLevel: 4 },
  // Outros setores
  { ticker: "JPMC34", name: "JPMorgan Chase", class: "bdrs", subclass: "bdr-acao", yahooTicker: "JPM", riskLevel: 3 },
  { ticker: "JNJB34", name: "Johnson & Johnson", class: "bdrs", subclass: "bdr-acao", yahooTicker: "JNJ", riskLevel: 2 },
];

/* ── Tesouro Direto ──────────────────────────────────────── */

export const TESOURO_DIRETO: TesouroDiretoEntry[] = [
  // SELIC
  { id: "selic-2027", name: "Tesouro SELIC 2027", subclass: "tesouro-selic", maturityYear: 2027, indexer: "selic", rateLabel: "SELIC + 0,0747%", riskLevel: 1, minimumInvestment: 100, irExempt: false },
  { id: "selic-2029", name: "Tesouro SELIC 2029", subclass: "tesouro-selic", maturityYear: 2029, indexer: "selic", rateLabel: "SELIC + 0,1042%", riskLevel: 1, minimumInvestment: 100, irExempt: false },
  // IPCA+
  { id: "ipca-2029", name: "Tesouro IPCA+ 2029", subclass: "tesouro-ipca", maturityYear: 2029, indexer: "ipca", rateLabel: "IPCA + ~6,5%", riskLevel: 1, minimumInvestment: 30, irExempt: false },
  { id: "ipca-2035", name: "Tesouro IPCA+ 2035", subclass: "tesouro-ipca", maturityYear: 2035, indexer: "ipca", rateLabel: "IPCA + ~6,8%", riskLevel: 1, minimumInvestment: 30, irExempt: false },
  { id: "ipca-2045", name: "Tesouro IPCA+ 2045", subclass: "tesouro-ipca", maturityYear: 2045, indexer: "ipca", rateLabel: "IPCA + ~7,0%", riskLevel: 1, minimumInvestment: 30, irExempt: false },
  // Prefixado
  { id: "pre-2026", name: "Tesouro Prefixado 2026", subclass: "tesouro-prefixado", maturityYear: 2026, indexer: "pre", rateLabel: "~13,5% a.a.", riskLevel: 1, minimumInvestment: 30, irExempt: false },
  { id: "pre-2029", name: "Tesouro Prefixado 2029", subclass: "tesouro-prefixado", maturityYear: 2029, indexer: "pre", rateLabel: "~13,7% a.a.", riskLevel: 1, minimumInvestment: 30, irExempt: false },
];

/* ── Renda Fixa (referência) ─────────────────────────────── */

export const RENDA_FIXA_REFERENCE: FixedIncomeEntry[] = [
  // CDB
  { id: "cdb-di-1", name: "CDB DI Liquidez Diária", subclass: "cdb", indexer: "cdi", rateLabel: "100% CDI", irExempt: false, riskLevel: 1, termMonths: null, issuer: "Banco médio", notes: "Liquidez diária, disponível na maioria das corretoras" },
  { id: "cdb-di-2", name: "CDB DI 12 meses", subclass: "cdb", indexer: "cdi", rateLabel: "115% CDI", irExempt: false, riskLevel: 1, termMonths: 12, issuer: "Banco médio" },
  { id: "cdb-pre-1", name: "CDB Prefixado 2 anos", subclass: "cdb", indexer: "pre", rateLabel: "~15% a.a.", irExempt: false, riskLevel: 1, termMonths: 24, issuer: "Banco médio" },
  // LCI / LCA
  { id: "lci-1", name: "LCI DI 90 dias", subclass: "lci-lca", indexer: "cdi", rateLabel: "90% CDI", irExempt: true, riskLevel: 1, termMonths: 3, issuer: "Banco grande", notes: "Isento de IR, equivalente a ~112% CDI tributado" },
  { id: "lci-2", name: "LCI DI 12 meses", subclass: "lci-lca", indexer: "cdi", rateLabel: "95% CDI", irExempt: true, riskLevel: 1, termMonths: 12, issuer: "Banco médio" },
  { id: "lca-1", name: "LCA DI 24 meses", subclass: "lci-lca", indexer: "cdi", rateLabel: "100% CDI", irExempt: true, riskLevel: 1, termMonths: 24, issuer: "Banco médio", notes: "Isento de IR para pessoa física" },
  { id: "lca-ipca", name: "LCA IPCA+ 3 anos", subclass: "lci-lca", indexer: "ipca", rateLabel: "IPCA + 7,5%", irExempt: true, riskLevel: 1, termMonths: 36, issuer: "Banco médio" },
  // CRI / CRA
  { id: "cri-1", name: "CRI Imobiliário AA", subclass: "cri-cra", indexer: "ipca", rateLabel: "IPCA + 8%", irExempt: true, riskLevel: 2, termMonths: 60, issuer: "Securitizadora" },
  { id: "cra-1", name: "CRA Agronegócio", subclass: "cri-cra", indexer: "cdi", rateLabel: "CDI + 3%", irExempt: true, riskLevel: 2, termMonths: 36, issuer: "Securitizadora" },
];

/* ── Criptomoedas ────────────────────────────────────────── */

export const CRIPTO: CatalogEntry[] = [
  // Reserva de valor
  { ticker: "BTC-USD", name: "Bitcoin", class: "cripto", subclass: "cripto-reserva", yahooTicker: "BTC-USD", riskLevel: 5 },
  { ticker: "ETH-USD", name: "Ethereum", class: "cripto", subclass: "cripto-reserva", yahooTicker: "ETH-USD", riskLevel: 5 },
  // Altcoins principais
  { ticker: "BNB-USD", name: "BNB (Binance)", class: "cripto", subclass: "cripto-altcoins", yahooTicker: "BNB-USD", riskLevel: 5 },
  { ticker: "SOL-USD", name: "Solana", class: "cripto", subclass: "cripto-altcoins", yahooTicker: "SOL-USD", riskLevel: 5 },
  { ticker: "XRP-USD", name: "XRP (Ripple)", class: "cripto", subclass: "cripto-altcoins", yahooTicker: "XRP-USD", riskLevel: 5 },
  { ticker: "ADA-USD", name: "Cardano", class: "cripto", subclass: "cripto-altcoins", yahooTicker: "ADA-USD", riskLevel: 5 },
];

/* ── Commodities ─────────────────────────────────────────── */

export const COMMODITIES: CatalogEntry[] = [
  // Metais
  { ticker: "GC=F", name: "Ouro (Spot)", class: "commodities", subclass: "commodities-metais", yahooTicker: "GC=F", riskLevel: 3, notes: "Proteção contra inflação e incerteza geopolítica" },
  { ticker: "SI=F", name: "Prata (Spot)", class: "commodities", subclass: "commodities-metais", yahooTicker: "SI=F", riskLevel: 4 },
  // Energia
  { ticker: "CL=F", name: "Petróleo WTI", class: "commodities", subclass: "commodities-energia", yahooTicker: "CL=F", riskLevel: 4 },
  { ticker: "NG=F", name: "Gás Natural", class: "commodities", subclass: "commodities-energia", yahooTicker: "NG=F", riskLevel: 5 },
  // Agro (relevante para Brasil)
  { ticker: "ZS=F", name: "Soja (Futuros)", class: "commodities", subclass: "commodities-agro", yahooTicker: "ZS=F", riskLevel: 4 },
  { ticker: "ZC=F", name: "Milho (Futuros)", class: "commodities", subclass: "commodities-agro", yahooTicker: "ZC=F", riskLevel: 4 },
  { ticker: "SB=F", name: "Açúcar (Futuros)", class: "commodities", subclass: "commodities-agro", yahooTicker: "SB=F", riskLevel: 4 },
];

/* ── Índices de referência ───────────────────────────────── */

export const MARKET_INDICES = [
  { ticker: "^BVSP", yahooTicker: "^BVSP", name: "IBOVESPA", source: "yahoo" as const },
  { ticker: "BOVA11", yahooTicker: "BOVA11.SA", name: "BOVA11", source: "brapi" as const },
  { ticker: "IVVB11", yahooTicker: "IVVB11.SA", name: "S&P 500 (R$)", source: "brapi" as const },
  { ticker: "SMAL11", yahooTicker: "SMAL11.SA", name: "Small Caps", source: "brapi" as const },
  { ticker: "IFIX", yahooTicker: "^IFIX", name: "IFIX (FIIs)", source: "yahoo" as const },
  { ticker: "USDBRL=X", yahooTicker: "USDBRL=X", name: "USD/BRL", source: "yahoo" as const },
  // BCB
  { ticker: "CDI", yahooTicker: null, name: "CDI (ref)", source: "bcb" as const },
  { ticker: "SELIC", yahooTicker: null, name: "SELIC", source: "bcb" as const },
];

/* ── Lookup helpers ──────────────────────────────────────── */

/** All B3 tickers in the catalog (usable with Brapi batch endpoint) */
export function getAllB3Tickers(): string[] {
  return [
    ...ACOES_BLUE_CHIPS,
    ...ACOES_DIVIDENDOS,
    ...ACOES_SMALL_CAPS,
    ...ACOES_GROWTH,
    ...ETFS,
    ...FIIS,
    ...BDRS,
  ]
    .map((a) => a.ticker)
    .filter((t) => !t.includes("-") && !t.includes("=") && !t.includes("^"))
    .filter((t, i, arr) => arr.indexOf(t) === i); // deduplicate
}

/** All Yahoo Finance tickers in the catalog */
export function getAllYahooTickers(): string[] {
  return [
    ...CRIPTO,
    ...COMMODITIES,
    ...BDRS.filter((b) => b.yahooTicker),
  ]
    .map((a) => a.yahooTicker!)
    .filter(Boolean)
    .filter((t, i, arr) => arr.indexOf(t) === i);
}

/** Find a catalog entry by B3 ticker */
export function findByTicker(ticker: string): CatalogEntry | undefined {
  const all = [
    ...ACOES_BLUE_CHIPS,
    ...ACOES_DIVIDENDOS,
    ...ACOES_SMALL_CAPS,
    ...ACOES_GROWTH,
    ...ETFS,
    ...FIIS,
    ...BDRS,
    ...CRIPTO,
    ...COMMODITIES,
  ];
  return all.find((a) => a.ticker === ticker || a.yahooTicker === ticker);
}
