/**
 * Asset Taxonomy — InvestAI
 *
 * Single source of truth for asset class definitions, categories,
 * risk/horizon metadata, data sources, and filter schemas.
 * Nothing in this file performs I/O — it is pure reference data.
 */

import type { ProfileId } from "@/lib/quiz/engine";

/* ── Core types ─────────────────────────────────────────── */

export type AssetClass =
  | "acoes"
  | "etfs"
  | "fiis"
  | "bdrs"
  | "renda-fixa"
  | "fundos"
  | "cripto"
  | "commodities"
  | "indices";

export type AssetSubclass =
  // Ações
  | "blue-chips"
  | "dividendos"
  | "small-caps"
  | "growth"
  | "setorial"
  // ETFs
  | "etf-ibovespa"
  | "etf-dividendos"
  | "etf-internacional"
  | "etf-setorial"
  | "etf-outros"
  // FIIs
  | "fii-papel"
  | "fii-tijolo"
  | "fii-fof"
  | "fii-logistica"
  | "fii-shopping"
  | "fii-lajes"
  // BDRs
  | "bdr-acao"
  | "bdr-etf"
  // Renda fixa
  | "tesouro-selic"
  | "tesouro-ipca"
  | "tesouro-prefixado"
  | "cdb"
  | "lci-lca"
  | "cri-cra"
  | "debentures"
  // Cripto
  | "cripto-reserva"
  | "cripto-altcoins"
  // Commodities
  | "commodities-metais"
  | "commodities-energia"
  | "commodities-agro"
  // Índices
  | "indice-nacional"
  | "indice-global";

export type RiskLevel = 1 | 2 | 3 | 4 | 5;
// 1 = muito baixo, 2 = baixo, 3 = moderado, 4 = alto, 5 = muito alto

export type HorizonGroup = "curto" | "medio" | "longo";
// curto = <1 ano, medio = 1-3 anos, longo = 5+ anos

export type DataSource = "brapi" | "yahoo" | "bcb" | "tesouro" | "static";

/* ── Category definition ─────────────────────────────────── */

export interface AssetCategoryMeta {
  id: AssetClass;
  label: string;
  labelPlural: string;
  icon: string;
  description: string;
  riskRange: [RiskLevel, RiskLevel]; // [min, max]
  horizons: HorizonGroup[];
  dataSources: DataSource[];
  /** Profiles for which this category appears on the home dashboard */
  homeProfiles: ProfileId[];
  /** Profiles for which this is the default Explorar landing */
  primaryForProfiles: ProfileId[];
  /** Whether this category is hidden from beginner profile */
  hiddenForBeginners: boolean;
  color: string; // CSS class
  bgColor: string;
  borderColor: string;
}

export const ASSET_CATEGORIES: Record<AssetClass, AssetCategoryMeta> = {
  acoes: {
    id: "acoes",
    label: "Ações",
    labelPlural: "Ações",
    icon: "📊",
    description: "Participação em empresas listadas na B3. Maior potencial de retorno, maior volatilidade.",
    riskRange: [2, 5],
    horizons: ["medio", "longo"],
    dataSources: ["brapi"],
    homeProfiles: ["moderado", "crescimento", "arrojado", "explorador", "trader", "dividendos", "longo-prazo"],
    primaryForProfiles: ["moderado", "crescimento", "arrojado", "trader"],
    hiddenForBeginners: false,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },

  etfs: {
    id: "etfs",
    label: "ETF",
    labelPlural: "ETFs",
    icon: "🗂️",
    description: "Fundos indexados negociados em bolsa. Diversificação automática com baixo custo.",
    riskRange: [2, 4],
    horizons: ["medio", "longo"],
    dataSources: ["brapi"],
    homeProfiles: ["iniciante", "moderado", "longo-prazo", "explorador"],
    primaryForProfiles: ["iniciante", "longo-prazo"],
    hiddenForBeginners: false,
    color: "text-market-green",
    bgColor: "bg-market-green/10",
    borderColor: "border-market-green/30",
  },

  fiis: {
    id: "fiis",
    label: "FII",
    labelPlural: "FIIs",
    icon: "🏢",
    description: "Fundos de Investimento Imobiliário. Renda passiva mensal via aluguéis e juros imobiliários.",
    riskRange: [2, 4],
    horizons: ["medio", "longo"],
    dataSources: ["brapi"],
    homeProfiles: ["dividendos", "conservador", "moderado", "iniciante"],
    primaryForProfiles: ["dividendos"],
    hiddenForBeginners: false,
    color: "text-market-yellow",
    bgColor: "bg-market-yellow/10",
    borderColor: "border-market-yellow/30",
  },

  bdrs: {
    id: "bdrs",
    label: "BDR",
    labelPlural: "BDRs",
    icon: "🌎",
    description: "Brazilian Depositary Receipts. Exposição a empresas internacionais negociadas na B3.",
    riskRange: [3, 5],
    horizons: ["medio", "longo"],
    dataSources: ["brapi"],
    homeProfiles: ["crescimento", "arrojado", "explorador"],
    primaryForProfiles: ["explorador"],
    hiddenForBeginners: true,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },

  "renda-fixa": {
    id: "renda-fixa",
    label: "Renda Fixa",
    labelPlural: "Renda Fixa",
    icon: "🔒",
    description: "Investimentos com rentabilidade previsível. Tesouro Direto, CDB, LCI, LCA e mais.",
    riskRange: [1, 2],
    horizons: ["curto", "medio", "longo"],
    dataSources: ["bcb", "tesouro", "static"],
    homeProfiles: ["iniciante", "conservador", "protecao"],
    primaryForProfiles: ["conservador", "protecao"],
    hiddenForBeginners: false,
    color: "text-market-green",
    bgColor: "bg-market-green/10",
    borderColor: "border-market-green/30",
  },

  fundos: {
    id: "fundos",
    label: "Fundos",
    labelPlural: "Fundos",
    icon: "🏦",
    description: "Fundos de gestão ativa: multimercado, ações, previdência e internacionais.",
    riskRange: [1, 4],
    horizons: ["medio", "longo"],
    dataSources: ["static"],
    homeProfiles: [],
    primaryForProfiles: [],
    hiddenForBeginners: false,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },

  cripto: {
    id: "cripto",
    label: "Cripto",
    labelPlural: "Criptomoedas",
    icon: "₿",
    description: "Ativos digitais: Bitcoin, Ethereum e principais altcoins. Alta volatilidade.",
    riskRange: [4, 5],
    horizons: ["medio", "longo"],
    dataSources: ["yahoo"],
    homeProfiles: ["arrojado", "explorador"],
    primaryForProfiles: [],
    hiddenForBeginners: true,
    color: "text-market-yellow",
    bgColor: "bg-market-yellow/10",
    borderColor: "border-market-yellow/30",
  },

  commodities: {
    id: "commodities",
    label: "Commodity",
    labelPlural: "Commodities",
    icon: "🥇",
    description: "Metais, energia e agro. Proteção contra inflação e diversificação global.",
    riskRange: [3, 5],
    horizons: ["medio", "longo"],
    dataSources: ["yahoo"],
    homeProfiles: ["explorador", "arrojado"],
    primaryForProfiles: [],
    hiddenForBeginners: true,
    color: "text-market-yellow",
    bgColor: "bg-market-yellow/10",
    borderColor: "border-market-yellow/30",
  },

  indices: {
    id: "indices",
    label: "Índice",
    labelPlural: "Índices",
    icon: "📈",
    description: "Referências de mercado: IBOVESPA, IFIX, CDI, SELIC. Não negociáveis diretamente.",
    riskRange: [2, 4],
    horizons: ["curto", "medio", "longo"],
    dataSources: ["brapi", "bcb"],
    homeProfiles: ["iniciante", "conservador", "protecao", "moderado", "dividendos", "longo-prazo", "crescimento", "arrojado", "explorador", "trader"],
    primaryForProfiles: [],
    hiddenForBeginners: false,
    color: "text-muted-foreground",
    bgColor: "bg-muted/10",
    borderColor: "border-border/30",
  },
};

/* ── Sector taxonomy (Ações) ─────────────────────────────── */

export interface SectorMeta {
  id: string;
  label: string;
  icon: string;
  color: string;
  /** Representative tickers for this sector */
  tickers: string[];
}

export const SECTORS: SectorMeta[] = [
  {
    id: "financeiro",
    label: "Financeiro",
    icon: "🏦",
    color: "text-primary",
    tickers: ["ITUB4", "BBDC4", "BBAS3", "SANB11", "BRSR6", "CIEL3", "B3SA3", "IRBR3"],
  },
  {
    id: "energia",
    label: "Energia e Utilities",
    icon: "⚡",
    color: "text-market-yellow",
    tickers: ["PETR4", "PETR3", "ENGI11", "EGIE3", "CPLE6", "TAEE11", "CMIG4", "SBSP3", "ENEV3", "ENBR3"],
  },
  {
    id: "materiais",
    label: "Materiais Básicos",
    icon: "⛏️",
    color: "text-market-red",
    tickers: ["VALE3", "GGBR4", "CSNA3", "USIM5", "BRAP4", "SUZB3", "DXCO3", "BRKM5"],
  },
  {
    id: "consumo",
    label: "Consumo",
    icon: "🛒",
    color: "text-market-green",
    tickers: ["ABEV3", "LREN3", "PCAR3", "ASAI3", "SMTO3", "JBSS3", "MRFG3", "BRFS3", "SLCE3"],
  },
  {
    id: "saude",
    label: "Saúde",
    icon: "🏥",
    color: "text-market-green",
    tickers: ["RDOR3", "HAPV3", "QUAL3", "FLRY3", "HYPE3", "RADL3", "PNVL3", "ODPV3"],
  },
  {
    id: "tecnologia",
    label: "Tecnologia",
    icon: "💻",
    color: "text-primary",
    tickers: ["TOTS3", "LWSA3", "INTB3", "CASH3", "IFCM3", "POSI3", "LINX3"],
  },
  {
    id: "industrial",
    label: "Industrial",
    icon: "🏭",
    color: "text-muted-foreground",
    tickers: ["WEGE3", "EMBR3", "RENT3", "RAIL3", "CSAN3", "POMO4", "RAPT4"],
  },
  {
    id: "imobiliario",
    label: "Imobiliário",
    icon: "🏠",
    color: "text-market-yellow",
    tickers: ["CYRE3", "MRVE3", "EZTC3", "LAVV3", "DIRR3", "TRIS3", "EVEN3"],
  },
];

/* ── Filter schemas ──────────────────────────────────────── */

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDef {
  id: string;
  label: string;
  type: "select" | "range" | "multi" | "toggle";
  options?: FilterOption[];
}

export const FILTERS_BY_CLASS: Record<AssetClass, FilterDef[]> = {
  acoes: [
    {
      id: "sector",
      label: "Setor",
      type: "multi",
      options: SECTORS.map((s) => ({ value: s.id, label: s.label })),
    },
    {
      id: "index",
      label: "Índice",
      type: "multi",
      options: [
        { value: "ibov", label: "IBOVESPA" },
        { value: "smll", label: "SMLL (Small Caps)" },
        { value: "idiv", label: "IDIV (Dividendos)" },
        { value: "ibrx100", label: "IBRX 100" },
      ],
    },
    {
      id: "pl_range",
      label: "P/L",
      type: "select",
      options: [
        { value: "under_10", label: "< 10 (barato)" },
        { value: "10_20", label: "10 a 20" },
        { value: "over_20", label: "> 20 (caro)" },
        { value: "negative", label: "Negativo (prejuízo)" },
      ],
    },
    {
      id: "dy_range",
      label: "Dividend Yield",
      type: "select",
      options: [
        { value: "any", label: "Qualquer" },
        { value: "over_3", label: "> 3%" },
        { value: "over_5", label: "> 5%" },
        { value: "over_8", label: "> 8%" },
      ],
    },
    {
      id: "market_cap",
      label: "Market Cap",
      type: "multi",
      options: [
        { value: "micro", label: "Micro (< R$2bi)" },
        { value: "small", label: "Small (R$2–10bi)" },
        { value: "mid", label: "Mid (R$10–50bi)" },
        { value: "large", label: "Large (> R$50bi)" },
      ],
    },
    {
      id: "trend",
      label: "Tendência técnica",
      type: "multi",
      options: [
        { value: "up", label: "Alta" },
        { value: "sideways", label: "Lateral" },
        { value: "down", label: "Baixa" },
      ],
    },
  ],

  fiis: [
    {
      id: "type",
      label: "Tipo",
      type: "multi",
      options: [
        { value: "papel", label: "Papel (CRI/CRA)" },
        { value: "tijolo", label: "Tijolo" },
        { value: "fof", label: "FOF" },
        { value: "hibrido", label: "Híbrido" },
      ],
    },
    {
      id: "segment",
      label: "Segmento",
      type: "multi",
      options: [
        { value: "logistica", label: "Logística" },
        { value: "shopping", label: "Shopping" },
        { value: "lajes", label: "Lajes corporativas" },
        { value: "residencial", label: "Residencial" },
        { value: "outros", label: "Outros" },
      ],
    },
    {
      id: "dy_monthly",
      label: "DY mensal",
      type: "select",
      options: [
        { value: "any", label: "Qualquer" },
        { value: "over_0_8", label: "> 0,8%" },
        { value: "over_1", label: "> 1%" },
        { value: "over_1_2", label: "> 1,2%" },
      ],
    },
    {
      id: "pvp",
      label: "P/VP",
      type: "select",
      options: [
        { value: "discount", label: "< 0,95 (desconto)" },
        { value: "fair", label: "0,95 – 1,05" },
        { value: "premium", label: "> 1,05 (prêmio)" },
      ],
    },
  ],

  etfs: [
    {
      id: "type",
      label: "Tipo",
      type: "multi",
      options: [
        { value: "rv_nacional", label: "Renda variável nacional" },
        { value: "rv_internacional", label: "Internacional" },
        { value: "rf", label: "Renda fixa" },
        { value: "setorial", label: "Setorial" },
      ],
    },
    {
      id: "index",
      label: "Índice replicado",
      type: "select",
      options: [
        { value: "ibov", label: "IBOVESPA (BOVA11)" },
        { value: "smll", label: "Small Caps (SMAL11)" },
        { value: "idiv", label: "Dividendos (DIVO11)" },
        { value: "sp500", label: "S&P 500 (IVVB11/SPXI11)" },
        { value: "cripto", label: "Cripto (HASH11)" },
      ],
    },
  ],

  bdrs: [
    {
      id: "country",
      label: "País",
      type: "multi",
      options: [
        { value: "usa", label: "EUA" },
        { value: "europe", label: "Europa" },
        { value: "other", label: "Outros" },
      ],
    },
    {
      id: "sector",
      label: "Setor",
      type: "multi",
      options: [
        { value: "tech", label: "Tecnologia" },
        { value: "health", label: "Saúde" },
        { value: "consumer", label: "Consumo" },
        { value: "financial", label: "Financeiro" },
        { value: "energy", label: "Energia" },
      ],
    },
  ],

  "renda-fixa": [
    {
      id: "indexer",
      label: "Indexador",
      type: "multi",
      options: [
        { value: "cdi", label: "CDI (pós-fixado)" },
        { value: "ipca", label: "IPCA+ (inflação)" },
        { value: "pre", label: "Prefixado" },
        { value: "selic", label: "SELIC" },
      ],
    },
    {
      id: "term",
      label: "Prazo",
      type: "select",
      options: [
        { value: "short", label: "Até 1 ano" },
        { value: "medium", label: "1 a 3 anos" },
        { value: "long", label: "Mais de 3 anos" },
      ],
    },
    {
      id: "ir_exempt",
      label: "Isenção de IR",
      type: "toggle",
    },
    {
      id: "issuer",
      label: "Emissor",
      type: "multi",
      options: [
        { value: "governo", label: "Governo Federal" },
        { value: "banco_grande", label: "Banco grande" },
        { value: "banco_medio", label: "Banco médio" },
        { value: "empresa", label: "Empresa" },
      ],
    },
  ],

  cripto: [
    {
      id: "category",
      label: "Categoria",
      type: "multi",
      options: [
        { value: "store_value", label: "Reserva de valor (BTC/ETH)" },
        { value: "l1", label: "Layer 1" },
        { value: "defi", label: "DeFi" },
        { value: "stablecoin", label: "Stablecoin" },
      ],
    },
  ],

  commodities: [
    {
      id: "group",
      label: "Grupo",
      type: "multi",
      options: [
        { value: "metais", label: "Metais (ouro, prata)" },
        { value: "energia", label: "Energia (petróleo, gás)" },
        { value: "agro", label: "Agro (soja, milho, açúcar)" },
      ],
    },
  ],

  fundos: [],
  indices: [],
};

/* ── Risk/horizon helper ─────────────────────────────────── */

export function riskLabel(level: RiskLevel): string {
  return ["", "Muito baixo", "Baixo", "Moderado", "Alto", "Muito alto"][level];
}

export function riskColor(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    1: "text-market-green",
    2: "text-market-green",
    3: "text-market-yellow",
    4: "text-market-red",
    5: "text-market-red",
  };
  return map[level];
}

export function horizonLabel(h: HorizonGroup): string {
  const map: Record<HorizonGroup, string> = {
    curto: "Curto prazo (< 1 ano)",
    medio: "Médio prazo (1–3 anos)",
    longo: "Longo prazo (5+ anos)",
  };
  return map[h];
}
