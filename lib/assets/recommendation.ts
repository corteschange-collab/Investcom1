/**
 * Profile-based Recommendation Engine
 *
 * Maps each investor profile to a curated asset selection for:
 * - Home dashboard (4-6 featured assets)
 * - Suggested starting categories in Explorar
 * - Thematic portfolios
 * - Content complexity flags
 */

import type { ProfileId } from "@/lib/quiz/engine";
import type { AssetClass } from "./taxonomy";
import {
  ACOES_BLUE_CHIPS,
  ACOES_DIVIDENDOS,
  ACOES_GROWTH,
  ACOES_SMALL_CAPS,
  ETFS,
  FIIS,
  BDRS,
  TESOURO_DIRETO,
  RENDA_FIXA_REFERENCE,
  CRIPTO,
  COMMODITIES,
  type CatalogEntry,
  type FixedIncomeEntry,
  type TesouroDiretoEntry,
} from "./catalog";

/* ── Types ───────────────────────────────────────────────── */

export type HomeFeaturedAsset = {
  ticker: string;
  name: string;
  class: AssetClass;
  reason: string;
};

export type ProfileRecommendation = {
  /** Ordered list for the home dashboard */
  homeFeatured: HomeFeaturedAsset[];
  /** Default open category in /explorar */
  primaryCategory: AssetClass;
  /** Categories shown in the nav (ordered by relevance) */
  categoryOrder: AssetClass[];
  /** Thematic portfolio tickers */
  portfolioTickers: string[];
  /** UI complexity flags */
  ui: {
    showTechnicalIndicators: boolean;
    showFundamentals: boolean;
    showRiskWarnings: boolean;
    showCrypto: boolean;
    showCommodities: boolean;
    showBDRs: boolean;
    showFixedIncome: boolean;
    languageLevel: "simple" | "standard" | "advanced";
    /** Which score dimensions to emphasize in the score panel */
    scoreFocus: ("technical" | "fundamental" | "risk" | "dividend")[];
  };
  /** System prompt context for the AI assistant */
  aiPersona: string;
};

/* ── Helper to pick entries by ticker ───────────────────── */

function pick(tickers: string[]): HomeFeaturedAsset[] {
  const all = [
    ...ACOES_BLUE_CHIPS,
    ...ACOES_DIVIDENDOS,
    ...ACOES_GROWTH,
    ...ACOES_SMALL_CAPS,
    ...ETFS,
    ...FIIS,
    ...BDRS,
    ...CRIPTO,
    ...COMMODITIES,
  ];
  return tickers
    .map((t) => {
      const entry = all.find((a) => a.ticker === t);
      return entry ? { ticker: entry.ticker, name: entry.name, class: entry.class, reason: "" } : null;
    })
    .filter((x): x is HomeFeaturedAsset => x !== null);
}

/* ── Recommendations by profile ─────────────────────────── */

export const PROFILE_RECOMMENDATIONS: Record<ProfileId, ProfileRecommendation> = {
  iniciante: {
    homeFeatured: [
      { ticker: "BOVA11", name: "iShares Ibovespa", class: "etfs", reason: "ETF diversificado, seguro para começar" },
      { ticker: "MXRF11", name: "Maxi Renda FII", class: "fiis", reason: "Renda passiva mensal simples" },
      { ticker: "selic-2027", name: "Tesouro SELIC 2027", class: "renda-fixa", reason: "Risco praticamente zero" },
      { ticker: "HGLG11", name: "CSHG Logística", class: "fiis", reason: "FII com histórico estável" },
    ],
    primaryCategory: "etfs",
    categoryOrder: ["etfs", "fiis", "renda-fixa", "acoes", "indices"],
    portfolioTickers: ["BOVA11", "MXRF11", "HGLG11", "selic-2029"],
    ui: {
      showTechnicalIndicators: false,
      showFundamentals: false,
      showRiskWarnings: true,
      showCrypto: false,
      showCommodities: false,
      showBDRs: false,
      showFixedIncome: true,
      languageLevel: "simple",
      scoreFocus: ["risk"],
    },
    aiPersona: "Você é um educador financeiro amigável. Use linguagem simples, evite jargão, explique cada conceito como se fosse a primeira vez. Enfatize segurança e aprendizado gradual.",
  },

  conservador: {
    homeFeatured: [
      { ticker: "MXRF11", name: "Maxi Renda FII", class: "fiis", reason: "FII de papel defensivo, DY estável" },
      { ticker: "HGLG11", name: "CSHG Logística", class: "fiis", reason: "FII tijolo com inquilinos de primeira linha" },
      { ticker: "ipca-2035", name: "Tesouro IPCA+ 2035", class: "renda-fixa", reason: "Proteção real contra inflação" },
      { ticker: "KNRI11", name: "Kinea Renda Imobiliária", class: "fiis", reason: "Gestão ativa com baixa vacância" },
      { ticker: "BOVA11", name: "iShares Ibovespa", class: "etfs", reason: "Exposição gradual à bolsa" },
    ],
    primaryCategory: "renda-fixa",
    categoryOrder: ["renda-fixa", "fiis", "etfs", "acoes", "indices"],
    portfolioTickers: ["MXRF11", "HGLG11", "KNRI11", "ipca-2035", "BOVA11"],
    ui: {
      showTechnicalIndicators: false,
      showFundamentals: true,
      showRiskWarnings: true,
      showCrypto: false,
      showCommodities: false,
      showBDRs: false,
      showFixedIncome: true,
      languageLevel: "standard",
      scoreFocus: ["risk", "dividend"],
    },
    aiPersona: "Você é um consultor conservador. Sempre apresente primeiro o risco e o score de segurança. Compare com CDI antes de qualquer recomendação. Destaque volatilidade histórica e drawdowns.",
  },

  protecao: {
    homeFeatured: [
      { ticker: "selic-2027", name: "Tesouro SELIC 2027", class: "renda-fixa", reason: "Liquidez diária, sem risco de mercado" },
      { ticker: "lci-2", name: "LCI 12 meses", class: "renda-fixa", reason: "Isento de IR, correlação 1:1 com CDI" },
      { ticker: "ipca-2029", name: "Tesouro IPCA+ 2029", class: "renda-fixa", reason: "Proteção real, curto prazo" },
      { ticker: "GC=F", name: "Ouro (Spot)", class: "commodities", reason: "Reserva de valor, hedge geopolítico" },
    ],
    primaryCategory: "renda-fixa",
    categoryOrder: ["renda-fixa", "indices", "etfs", "fiis"],
    portfolioTickers: ["selic-2027", "lci-1", "ipca-2029", "lca-1"],
    ui: {
      showTechnicalIndicators: false,
      showFundamentals: false,
      showRiskWarnings: true,
      showCrypto: false,
      showCommodities: true,
      showBDRs: false,
      showFixedIncome: true,
      languageLevel: "standard",
      scoreFocus: ["risk"],
    },
    aiPersona: "Você é um especialista em gestão de risco. Foque em capital preservation. Compare qualquer ativo com o CDI e com a inflação (IPCA). Destaque liquidez e correlação negativa com risco.",
  },

  dividendos: {
    homeFeatured: [
      { ticker: "MXRF11", name: "Maxi Renda FII", class: "fiis", reason: "DY mensal consistente, papel" },
      { ticker: "HGLG11", name: "CSHG Logística", class: "fiis", reason: "DY estável, tijolo de qualidade" },
      { ticker: "TAEE11", name: "Taesa UNT", class: "acoes", reason: "Maior DY do setor elétrico" },
      { ticker: "EGIE3", name: "Engie Brasil", class: "acoes", reason: "Concessões longas, dividendos previsíveis" },
      { ticker: "VALE3", name: "Vale ON", class: "acoes", reason: "Dividendos bilionários em ciclos de commodities" },
      { ticker: "XPML11", name: "XP Malls", class: "fiis", reason: "Shopping centers, recuperação pós-Covid" },
    ],
    primaryCategory: "fiis",
    categoryOrder: ["fiis", "acoes", "etfs", "renda-fixa", "indices"],
    portfolioTickers: ["MXRF11", "HGLG11", "TAEE11", "EGIE3", "VALE3", "XPML11", "KNRI11"],
    ui: {
      showTechnicalIndicators: false,
      showFundamentals: true,
      showRiskWarnings: false,
      showCrypto: false,
      showCommodities: false,
      showBDRs: false,
      showFixedIncome: true,
      languageLevel: "standard",
      scoreFocus: ["dividend", "fundamental"],
    },
    aiPersona: "Você é especialista em renda passiva. Sempre apresente o Dividend Yield, histórico de pagamentos e payout ratio. Calcule renda mensal projetada. Alerte sobre cortes de dividendos. Compare FIIs por P/VP e yield on cost.",
  },

  moderado: {
    homeFeatured: [
      { ticker: "BOVA11", name: "iShares Ibovespa", class: "etfs", reason: "Diversificação automática na bolsa" },
      { ticker: "WEGE3", name: "WEG ON", class: "acoes", reason: "Blue chip de qualidade, histórico sólido" },
      { ticker: "MXRF11", name: "Maxi Renda FII", class: "fiis", reason: "Renda mensal defensiva" },
      { ticker: "ITUB4", name: "Itaú Unibanco PN", class: "acoes", reason: "Maior banco privado, pagador consistente" },
      { ticker: "ipca-2029", name: "Tesouro IPCA+ 2029", class: "renda-fixa", reason: "Base segura da carteira" },
    ],
    primaryCategory: "acoes",
    categoryOrder: ["acoes", "etfs", "fiis", "renda-fixa", "bdrs", "indices"],
    portfolioTickers: ["BOVA11", "WEGE3", "MXRF11", "ITUB4", "HGLG11", "ipca-2029"],
    ui: {
      showTechnicalIndicators: true,
      showFundamentals: true,
      showRiskWarnings: true,
      showCrypto: false,
      showCommodities: false,
      showBDRs: false,
      showFixedIncome: true,
      languageLevel: "standard",
      scoreFocus: ["technical", "fundamental", "risk"],
    },
    aiPersona: "Você é um analista equilibrado. Apresente oportunidades e riscos com peso igual. Compare retorno com o IBOVESPA. Mostre tanto indicadores técnicos quanto fundamentalistas. Contextualize com o cenário macroeconômico.",
  },

  "longo-prazo": {
    homeFeatured: [
      { ticker: "IVVB11", name: "iShares S&P 500", class: "etfs", reason: "Exposição ao mercado americano em reais" },
      { ticker: "WEGE3", name: "WEG ON", class: "acoes", reason: "Compounder brasileiro de décadas" },
      { ticker: "BOVA11", name: "iShares Ibovespa", class: "etfs", reason: "Mercado brasileiro com custo mínimo" },
      { ticker: "EGIE3", name: "Engie Brasil", class: "acoes", reason: "Concessões de 20+ anos, previsibilidade" },
      { ticker: "FLRY3", name: "Fleury ON", class: "acoes", reason: "Saúde preventiva com demanda crescente" },
    ],
    primaryCategory: "etfs",
    categoryOrder: ["etfs", "acoes", "fiis", "bdrs", "renda-fixa", "indices"],
    portfolioTickers: ["IVVB11", "WEGE3", "BOVA11", "EGIE3", "MXRF11", "FLRY3", "HGLG11"],
    ui: {
      showTechnicalIndicators: false,
      showFundamentals: true,
      showRiskWarnings: false,
      showCrypto: false,
      showCommodities: false,
      showBDRs: true,
      showFixedIncome: true,
      languageLevel: "standard",
      scoreFocus: ["fundamental"],
    },
    aiPersona: "Você é um investidor value de longo prazo. Ignore ruídos de curto prazo. Enfatize CAGR histórico de 5 e 10 anos, reinvestimento de dividendos, vantagem competitiva durável (moat) e poder dos juros compostos.",
  },

  crescimento: {
    homeFeatured: [
      { ticker: "TOTS3", name: "TOTVS ON", class: "acoes", reason: "Liderança em ERP, crescimento consistente" },
      { ticker: "RDOR3", name: "Rede D'or ON", class: "acoes", reason: "Consolidação hospitalar em expansão" },
      { ticker: "NVDC34", name: "NVIDIA (BDR)", class: "bdrs", reason: "Líder em chips IA, crescimento explosivo" },
      { ticker: "HASH11", name: "Hashdex Nasdaq Crypto", class: "etfs", reason: "Exposição ao ecossistema cripto regulado" },
      { ticker: "WEGE3", name: "WEG ON", class: "acoes", reason: "Crescimento de receita por 2 décadas" },
    ],
    primaryCategory: "acoes",
    categoryOrder: ["acoes", "bdrs", "etfs", "fiis", "cripto", "indices"],
    portfolioTickers: ["TOTS3", "RDOR3", "WEGE3", "IVVB11", "NVDC34", "HASH11"],
    ui: {
      showTechnicalIndicators: true,
      showFundamentals: true,
      showRiskWarnings: false,
      showCrypto: true,
      showCommodities: false,
      showBDRs: true,
      showFixedIncome: false,
      languageLevel: "standard",
      scoreFocus: ["technical", "fundamental"],
    },
    aiPersona: "Você é um analista de crescimento. Foque em crescimento de receita, expansão de margens, TAM (mercado endereçável) e momentum. Compare com pares setoriais. Destaque EV/EBITDA futuro e catalisadores de crescimento.",
  },

  arrojado: {
    homeFeatured: [
      { ticker: "PETR4", name: "Petrobras PN", class: "acoes", reason: "Maior volume da bolsa, alta volatilidade" },
      { ticker: "VALE3", name: "Vale ON", class: "acoes", reason: "Ciclo de commodities, potencial assimétrico" },
      { ticker: "MGLU3", name: "Magazine Luiza ON", class: "acoes", reason: "Small cap de alto risco e alto potencial" },
      { ticker: "BTC-USD", name: "Bitcoin", class: "cripto", reason: "Maior liquidez no mercado cripto" },
      { ticker: "TSLA34", name: "Tesla (BDR)", class: "bdrs", reason: "Alta volatilidade com momentum tecnológico" },
    ],
    primaryCategory: "acoes",
    categoryOrder: ["acoes", "bdrs", "cripto", "etfs", "commodities", "fiis", "indices"],
    portfolioTickers: ["PETR4", "VALE3", "IVVB11", "BTC-USD", "TSLA34", "NVDC34"],
    ui: {
      showTechnicalIndicators: true,
      showFundamentals: true,
      showRiskWarnings: false,
      showCrypto: true,
      showCommodities: true,
      showBDRs: true,
      showFixedIncome: false,
      languageLevel: "advanced",
      scoreFocus: ["technical", "risk"],
    },
    aiPersona: "Você é um analista sem filtros. Apresente todos os dados brutos sem simplificação. Inclua alavancagem, opções e derivativos quando relevante. Mostre drawdown máximo, Sharpe e Sortino. Não esconda riscos.",
  },

  explorador: {
    homeFeatured: [
      { ticker: "IVVB11", name: "iShares S&P 500", class: "etfs", reason: "Base internacional da carteira" },
      { ticker: "BOVA11", name: "iShares Ibovespa", class: "etfs", reason: "Base nacional da carteira" },
      { ticker: "GC=F", name: "Ouro", class: "commodities", reason: "Descorrelação e proteção" },
      { ticker: "BTC-USD", name: "Bitcoin", class: "cripto", reason: "Ativo digital como tese alternativa" },
      { ticker: "GOGL34", name: "Alphabet (BDR)", class: "bdrs", reason: "Tech americana com diversificação geográfica" },
    ],
    primaryCategory: "acoes",
    categoryOrder: ["acoes", "etfs", "fiis", "bdrs", "cripto", "commodities", "renda-fixa", "indices"],
    portfolioTickers: ["IVVB11", "BOVA11", "SMAL11", "GOGL34", "AAPL34", "GC=F", "BTC-USD", "MXRF11"],
    ui: {
      showTechnicalIndicators: true,
      showFundamentals: true,
      showRiskWarnings: false,
      showCrypto: true,
      showCommodities: true,
      showBDRs: true,
      showFixedIncome: true,
      languageLevel: "advanced",
      scoreFocus: ["technical", "fundamental", "risk", "dividend"],
    },
    aiPersona: "Você é um analista multi-classe. Cubra ações, ETFs, FIIs, BDRs, cripto e commodities com igual profundidade. Compare classes de ativos. Discuta correlações e diversificação geográfica. Forneça dados brutos quando pedido.",
  },

  trader: {
    homeFeatured: [
      { ticker: "PETR4", name: "Petrobras PN", class: "acoes", reason: "Maior liquidez, spread apertado" },
      { ticker: "VALE3", name: "Vale ON", class: "acoes", reason: "Alto volume, movimentos técnicos definidos" },
      { ticker: "BOVA11", name: "iShares Ibovespa", class: "etfs", reason: "ETF com liquidez intraday" },
      { ticker: "BTC-USD", name: "Bitcoin", class: "cripto", reason: "Mercado 24/7, alta volatilidade" },
      { ticker: "WEGE3", name: "WEG ON", class: "acoes", reason: "Tendência definida de médio prazo" },
    ],
    primaryCategory: "acoes",
    categoryOrder: ["acoes", "cripto", "etfs", "bdrs", "commodities", "indices"],
    portfolioTickers: ["PETR4", "VALE3", "ITUB4", "ABEV3", "WEGE3"],
    ui: {
      showTechnicalIndicators: true,
      showFundamentals: false,
      showRiskWarnings: false,
      showCrypto: true,
      showCommodities: true,
      showBDRs: true,
      showFixedIncome: false,
      languageLevel: "advanced",
      scoreFocus: ["technical"],
    },
    aiPersona: "Você é um analista técnico. Priorize RSI, MACD, Bollinger Bands, suporte/resistência e volume. Apresente setups de entrada e saída. Discuta gerenciamento de risco por operação (stop, alvo, risk/reward). Ignore fundamentos de longo prazo.",
  },
};

/* ── Thematic portfolios ─────────────────────────────────── */

export interface ThematicPortfolio {
  id: string;
  name: string;
  description: string;
  tagline: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  horizon: "curto" | "medio" | "longo";
  targetProfiles: ProfileId[];
  assets: Array<{ ticker: string; name: string; weight: number; class: AssetClass }>;
  rebalancePeriod: "mensal" | "trimestral" | "semestral" | "anual";
}

export const THEMATIC_PORTFOLIOS: ThematicPortfolio[] = [
  {
    id: "dividendos",
    name: "Carteira de Dividendos",
    description: "Focada em geração de renda passiva mensal via FIIs e ações de dividendos.",
    tagline: "Dinheiro caindo na conta todo mês",
    riskLevel: 2,
    horizon: "longo",
    targetProfiles: ["dividendos", "conservador", "moderado"],
    assets: [
      { ticker: "MXRF11", name: "Maxi Renda", weight: 20, class: "fiis" },
      { ticker: "HGLG11", name: "CSHG Logística", weight: 15, class: "fiis" },
      { ticker: "KNRI11", name: "Kinea Renda", weight: 15, class: "fiis" },
      { ticker: "TAEE11", name: "Taesa", weight: 15, class: "acoes" },
      { ticker: "EGIE3", name: "Engie Brasil", weight: 15, class: "acoes" },
      { ticker: "BBAS3", name: "Banco do Brasil", weight: 10, class: "acoes" },
      { ticker: "ITUB4", name: "Itaú Unibanco", weight: 10, class: "acoes" },
    ],
    rebalancePeriod: "semestral",
  },
  {
    id: "crescimento",
    name: "Carteira de Crescimento",
    description: "Ações e BDRs com alto potencial de valorização no médio e longo prazo.",
    tagline: "Patrimônio que multiplica",
    riskLevel: 4,
    horizon: "longo",
    targetProfiles: ["crescimento", "arrojado", "explorador"],
    assets: [
      { ticker: "WEGE3", name: "WEG ON", weight: 20, class: "acoes" },
      { ticker: "IVVB11", name: "S&P 500", weight: 20, class: "etfs" },
      { ticker: "TOTS3", name: "TOTVS", weight: 15, class: "acoes" },
      { ticker: "NVDC34", name: "NVIDIA", weight: 15, class: "bdrs" },
      { ticker: "RDOR3", name: "Rede D'or", weight: 15, class: "acoes" },
      { ticker: "GOGL34", name: "Alphabet", weight: 15, class: "bdrs" },
    ],
    rebalancePeriod: "trimestral",
  },
  {
    id: "protecao",
    name: "Carteira de Proteção",
    description: "Preservação de capital com proteção contra inflação e crises.",
    tagline: "Seu dinheiro seguro enquanto o mundo oscila",
    riskLevel: 1,
    horizon: "curto",
    targetProfiles: ["protecao", "conservador", "iniciante"],
    assets: [
      { ticker: "selic-2027", name: "Tesouro SELIC", weight: 40, class: "renda-fixa" },
      { ticker: "ipca-2029", name: "Tesouro IPCA+ 2029", weight: 30, class: "renda-fixa" },
      { ticker: "lci-2", name: "LCI 12 meses", weight: 20, class: "renda-fixa" },
      { ticker: "GC=F", name: "Ouro", weight: 10, class: "commodities" },
    ],
    rebalancePeriod: "anual",
  },
  {
    id: "balanceada",
    name: "Carteira Balanceada",
    description: "Diversificação inteligente entre classes de ativos para retorno consistente.",
    tagline: "Equilíbrio entre crescimento e segurança",
    riskLevel: 3,
    horizon: "longo",
    targetProfiles: ["moderado", "longo-prazo", "dividendos"],
    assets: [
      { ticker: "BOVA11", name: "Ibovespa ETF", weight: 25, class: "etfs" },
      { ticker: "IVVB11", name: "S&P 500 ETF", weight: 20, class: "etfs" },
      { ticker: "MXRF11", name: "Maxi Renda FII", weight: 20, class: "fiis" },
      { ticker: "ipca-2035", name: "Tesouro IPCA+ 2035", weight: 20, class: "renda-fixa" },
      { ticker: "WEGE3", name: "WEG ON", weight: 15, class: "acoes" },
    ],
    rebalancePeriod: "semestral",
  },
  {
    id: "longo-prazo",
    name: "Carteira Longo Prazo",
    description: "Compostos ao longo de décadas. Volatilidade de curto prazo ignorada.",
    tagline: "Tempo é o maior aliado do investidor",
    riskLevel: 3,
    horizon: "longo",
    targetProfiles: ["longo-prazo", "moderado"],
    assets: [
      { ticker: "IVVB11", name: "S&P 500 ETF", weight: 30, class: "etfs" },
      { ticker: "BOVA11", name: "Ibovespa ETF", weight: 25, class: "etfs" },
      { ticker: "WEGE3", name: "WEG ON", weight: 20, class: "acoes" },
      { ticker: "MXRF11", name: "Maxi Renda FII", weight: 15, class: "fiis" },
      { ticker: "HGLG11", name: "CSHG Logística", weight: 10, class: "fiis" },
    ],
    rebalancePeriod: "anual",
  },
  {
    id: "renda",
    name: "Carteira de Renda",
    description: "Combinação de FIIs e renda fixa para maximizar fluxo de caixa mensal.",
    tagline: "Renda todos os meses, independente do mercado",
    riskLevel: 2,
    horizon: "medio",
    targetProfiles: ["dividendos", "conservador", "moderado"],
    assets: [
      { ticker: "MXRF11", name: "Maxi Renda", weight: 25, class: "fiis" },
      { ticker: "IRDM11", name: "Iridium", weight: 20, class: "fiis" },
      { ticker: "HGLG11", name: "CSHG Logística", weight: 20, class: "fiis" },
      { ticker: "lci-2", name: "LCI 12m", weight: 20, class: "renda-fixa" },
      { ticker: "TAEE11", name: "Taesa", weight: 15, class: "acoes" },
    ],
    rebalancePeriod: "trimestral",
  },
];

/* ── Quick lookup ────────────────────────────────────────── */

export function getRecommendation(profileId: ProfileId): ProfileRecommendation {
  return PROFILE_RECOMMENDATIONS[profileId] ?? PROFILE_RECOMMENDATIONS.moderado;
}

export function getPortfoliosForProfile(profileId: ProfileId): ThematicPortfolio[] {
  return THEMATIC_PORTFOLIOS.filter((p) => p.targetProfiles.includes(profileId));
}
