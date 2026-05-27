/**
 * Quiz Scoring Engine & Profile Classification
 *
 * Scoring pipeline:
 *  1. Aggregate raw scores across all answers (per axis)
 *  2. Normalize each axis to 0–100 (max possible = questions × 3)
 *  3. Apply classification rules in priority order
 *  4. Return ProfileResult with full context
 */

import { QUESTIONS } from "./questions";
import type { AnswerScores } from "./questions";

/* ── Types ─────────────────────────────────────────── */

export type ProfileId =
  | "iniciante"
  | "conservador"
  | "protecao"
  | "dividendos"
  | "moderado"
  | "longo-prazo"
  | "crescimento"
  | "arrojado"
  | "explorador"
  | "trader";

export interface NormalizedScores {
  risk: number;       // 0–100
  knowledge: number;  // 0–100
  horizon: number;    // 0–100
  income: number;     // 0–100
  trading: number;    // 0–100
}

export interface ProfileResult {
  id: ProfileId;
  scores: NormalizedScores;
  profile: ProfileDefinition;
}

export interface ProfileDefinition {
  id: ProfileId;
  label: string;
  tagline: string;
  description: string;
  /** 3–4 characteristics shown on the result card */
  traits: string[];
  /** What InvestAI will do differently for this profile */
  customizations: string[];
  /** Suggested first assets to look at */
  suggestedAssets: string[];
  color: string;       // CSS class
  bgColor: string;     // CSS class
  borderColor: string; // CSS class
  icon: string;        // emoji
}

/* ── Profile definitions ────────────────────────────── */

export const PROFILES: Record<ProfileId, ProfileDefinition> = {
  iniciante: {
    id: "iniciante",
    label: "Iniciante",
    icon: "🌱",
    tagline: "Todo especialista já foi iniciante. Você começou no lugar certo.",
    description:
      "Você está dando os primeiros passos no mundo dos investimentos. A plataforma vai usar linguagem simples, explicar cada indicador e sugerir ativos seguros para você construir confiança antes de avançar.",
    traits: [
      "Foco total em educação antes de ação",
      "Preferência por ativos de baixo risco",
      "Construção gradual de conhecimento",
      "Simplicidade acima de complexidade",
    ],
    customizations: [
      "Linguagem simplificada em todos os painéis",
      "Explicações automáticas dos indicadores",
      "Score de risco exibido com destaque",
      "Sugestões de ativos adequados ao seu nível",
    ],
    suggestedAssets: ["TESOURO SELIC", "BOVA11", "MXRF11", "XPML11"],
    color: "text-market-green",
    bgColor: "bg-market-green/10",
    borderColor: "border-market-green/30",
  },

  conservador: {
    id: "conservador",
    label: "Conservador",
    icon: "🛡️",
    tagline: "Segurança não é timidez. É inteligência.",
    description:
      "Você valoriza a preservação do capital acima do retorno máximo. Conhece os riscos e prefere não os correr. A plataforma vai destacar o risco de cada ativo antes de qualquer outra métrica.",
    traits: [
      "Proteção de capital é prioridade absoluta",
      "Conforto com renda fixa e previsibilidade",
      "Baixa tolerância a drawdowns",
      "Foco em consistência, não em retornos extremos",
    ],
    customizations: [
      "Alertas de risco mais sensíveis",
      "Score de segurança exibido com prioridade",
      "FIIs de papel e renda fixa em destaque",
      "Volatilidade histórica sempre visível",
    ],
    suggestedAssets: ["MXRF11", "HGLG11", "TESOURO IPCA+", "KNRI11"],
    color: "text-market-green",
    bgColor: "bg-market-green/10",
    borderColor: "border-market-green/30",
  },

  protecao: {
    id: "protecao",
    label: "Foco em Proteção",
    icon: "🔒",
    tagline: "Preservar é a base de qualquer crescimento real.",
    description:
      "Você está em modo de proteção — pode ser um momento de vida, uma reserva estratégica ou uma filosofia. A plataforma vai mostrar ativos com correlação negativa ao risco e baixa volatilidade histórica.",
    traits: [
      "Horizonte de curto a médio prazo",
      "Capital protegido de oscilações",
      "Liquidez como critério essencial",
      "Foco em não perder antes de ganhar",
    ],
    customizations: [
      "Destaque para liquidez diária e risco de crédito",
      "Filtros automáticos de ativos defensivos",
      "Comparação de cada ativo com CDI e IPCA",
      "Alertas para volatilidade acima do esperado",
    ],
    suggestedAssets: ["TESOURO SELIC", "LCI", "LCA", "CDB 100% CDI"],
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },

  dividendos: {
    id: "dividendos",
    label: "Foco em Dividendos",
    icon: "💰",
    tagline: "Renda passiva é liberdade. Cada dividendo é um passo a mais.",
    description:
      "Você quer que seus investimentos trabalhem por você — gerando renda real, todo mês ou todo trimestre. A plataforma vai priorizar Dividend Yield, histórico de pagamentos e estabilidade do fluxo.",
    traits: [
      "Renda passiva como meta principal",
      "Preferência por FIIs, blue chips e ações de dividendos",
      "Visão de longo prazo com aportes consistentes",
      "Reinvestimento de dividendos para efeito composto",
    ],
    customizations: [
      "DY e histórico de proventos em destaque",
      "Calculadora de renda passiva projetada",
      "Ranking de FIIs por qualidade e consistência",
      "Alertas de corte ou redução de dividendos",
    ],
    suggestedAssets: ["MXRF11", "HGLG11", "VALE3", "ITUB4", "TAEE11"],
    color: "text-market-yellow",
    bgColor: "bg-market-yellow/10",
    borderColor: "border-market-yellow/30",
  },

  moderado: {
    id: "moderado",
    label: "Moderado",
    icon: "⚖️",
    tagline: "Equilíbrio não é mediocridade. É consistência sustentável.",
    description:
      "Você entende que risco e retorno andam juntos, e busca o ponto ótimo entre os dois. Aceita volatilidade controlada por retornos melhores que a renda fixa. A plataforma vai mostrar oportunidades em ambos os lados.",
    traits: [
      "Carteira diversificada entre renda fixa e variável",
      "Tolerância média a quedas temporárias",
      "Foco em fundamentos sólidos",
      "Estratégia de médio a longo prazo",
    ],
    customizations: [
      "Dashboard balanceado entre segurança e oportunidade",
      "Score ponderado por risco-retorno",
      "Comparação automática com o IBOVESPA",
      "Alertas calibrados para o seu nível de risco",
    ],
    suggestedAssets: ["BOVA11", "WEGE3", "ITUB4", "MXRF11", "HGLG11"],
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },

  "longo-prazo": {
    id: "longo-prazo",
    label: "Longo Prazo",
    icon: "🏔️",
    tagline: "Décadas ganham de minutos. Você pensa certo.",
    description:
      "Você entende o poder do tempo. Não se preocupa com oscilações de curto prazo porque sabe que o mercado sobe no longo prazo. A plataforma vai mostrar retornos históricos de 5, 10 e 20 anos.",
    traits: [
      "Horizonte de investimento superior a 10 anos",
      "Aportes mensais sistemáticos",
      "Baixa preocupação com volatilidade de curto prazo",
      "Foco em empresas com vantagem competitiva duradoura",
    ],
    customizations: [
      "Gráficos históricos de longo prazo em destaque",
      "Simulador de juros compostos integrado",
      "Análise de crescimento de lucros por décadas",
      "Alertas para mudanças fundamentais, não de preço",
    ],
    suggestedAssets: ["WEGE3", "BOVA11", "IVVB11", "EGIE3", "FLRY3"],
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },

  crescimento: {
    id: "crescimento",
    label: "Foco em Crescimento",
    icon: "🚀",
    tagline: "Você quer mais que o mercado. E está disposto a fazer o que é preciso.",
    description:
      "Você busca empresas e ativos com alto potencial de valorização. Aceita mais volatilidade porque entende que retornos excepcionais exigem coragem. A plataforma vai destacar crescimento de receita, expansão de margens e momentum.",
    traits: [
      "Tolerância alta a volatilidade por retornos superiores",
      "Interesse em growth stocks e setores emergentes",
      "Análise de múltiplos de crescimento (P/L futuro, EV/EBITDA)",
      "Diversificação setorial para capturar tendências",
    ],
    customizations: [
      "Crescimento de receita e EBITDA em destaque",
      "Radar de setores com maior momentum",
      "Comparação de crescimento vs. pares do setor",
      "Alertas de aceleração ou desaceleração de resultados",
    ],
    suggestedAssets: ["RDRD3", "LWSA3", "MGLU3", "INTB3", "IVVB11"],
    color: "text-market-yellow",
    bgColor: "bg-market-yellow/10",
    borderColor: "border-market-yellow/30",
  },

  arrojado: {
    id: "arrojado",
    label: "Arrojado",
    icon: "⚡",
    tagline: "Alto risco com consciência plena. Essa é a diferença.",
    description:
      "Você tem estômago para oscilações severas e busca retornos acima da média. Sabe que pode perder significativamente e está preparado. A plataforma vai mostrar todos os indicadores de risco sem filtros.",
    traits: [
      "Alta tolerância a drawdowns de 30% ou mais",
      "Carteira concentrada em ativos de alto potencial",
      "Capacidade de manter posições sob pressão",
      "Conhecimento técnico e fundamentalista avançado",
    ],
    customizations: [
      "Indicadores de risco e alavancagem sem filtros",
      "Ativos de alta volatilidade em destaque",
      "Score de momentum técnico como métrica principal",
      "Alertas de stop configuráveis por ativo",
    ],
    suggestedAssets: ["PETR4", "VALE3", "MGLU3", "Small Caps", "BDRs"],
    color: "text-market-red",
    bgColor: "bg-market-red/10",
    borderColor: "border-market-red/30",
  },

  explorador: {
    id: "explorador",
    label: "Explorador",
    icon: "🧭",
    tagline: "Você quer entender tudo. E isso é uma vantagem enorme.",
    description:
      "Você tem conhecimento avançado e curiosidade acima da média. Explora diferentes classes de ativos e estratégias. A plataforma vai liberar o máximo de dados e análises disponíveis, sem simplificações.",
    traits: [
      "Interesse em múltiplas classes de ativos",
      "Análise quantitativa e qualitativa combinadas",
      "Diversificação geográfica (internacional + Brasil)",
      "Sempre testando novas teses de investimento",
    ],
    customizations: [
      "Todos os indicadores técnicos e fundamentalistas liberados",
      "Comparações internacionais (S&P 500, MSCI World)",
      "Screener avançado com filtros customizáveis",
      "Dados brutos disponíveis para análise própria",
    ],
    suggestedAssets: ["IVVB11", "BOVA11", "BDRs", "ETFs Setoriais", "MXRF11"],
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },

  trader: {
    id: "trader",
    label: "Trader",
    icon: "📈",
    tagline: "O mercado é o seu campo. Disciplina e dados são suas armas.",
    description:
      "Você opera com frequência, lê gráficos, acompanha fluxo e vive o mercado no dia a dia. A plataforma vai priorizar análise técnica intraday, volume, suporte/resistência e indicadores de momentum.",
    traits: [
      "Operações frequentes com análise técnica",
      "Gerenciamento de risco rigoroso por operação",
      "Foco em momentum, volume e padrões gráficos",
      "Separação clara entre carteira e book de trade",
    ],
    customizations: [
      "Gráfico técnico como tela principal do ativo",
      "RSI, MACD e Bollinger Bands em destaque",
      "Alertas de preço e indicadores configuráveis",
      "Volume e fluxo de ordens sempre visíveis",
    ],
    suggestedAssets: ["PETR4", "VALE3", "WIN (Ibovespa futuro)", "WDO (Dólar futuro)", "Opções"],
    color: "text-market-red",
    bgColor: "bg-market-red/10",
    borderColor: "border-market-red/30",
  },
};

/* ── Scoring engine ─────────────────────────────────── */

/**
 * Takes the selected answer IDs (indexed by question ID) and returns
 * a full ProfileResult with normalized scores.
 */
export function computeProfile(
  answers: Record<string, string>
): ProfileResult {
  // Aggregate raw scores
  const raw: AnswerScores = { risk: 0, knowledge: 0, horizon: 0, income: 0, trading: 0 };

  for (const question of QUESTIONS) {
    const selectedAnswerId = answers[question.id];
    if (!selectedAnswerId) continue;
    const answer = question.answers.find((a) => a.id === selectedAnswerId);
    if (!answer) continue;
    raw.risk += answer.scores.risk;
    raw.knowledge += answer.scores.knowledge;
    raw.horizon += answer.scores.horizon;
    raw.income += answer.scores.income;
    raw.trading += answer.scores.trading;
  }

  // Normalize: max per axis = QUESTIONS.length × 3 = 30
  const maxRaw = QUESTIONS.length * 3;
  const normalize = (v: number) => Math.round((v / maxRaw) * 100);

  const scores: NormalizedScores = {
    risk: normalize(raw.risk),
    knowledge: normalize(raw.knowledge),
    horizon: normalize(raw.horizon),
    income: normalize(raw.income),
    trading: normalize(raw.trading),
  };

  const id = classifyProfile(scores);

  return { id, scores, profile: PROFILES[id] };
}

/**
 * Profile classification rules — applied in priority order.
 * The first rule that matches wins.
 */
function classifyProfile(s: NormalizedScores): ProfileId {
  const { risk, knowledge, horizon, income, trading } = s;

  // 1. Iniciante — knowledge is the gate
  if (knowledge < 32) return "iniciante";

  // 2. Trader — very specific: high trading + high risk + high knowledge
  if (trading >= 62 && risk >= 62 && knowledge >= 52) return "trader";

  // 3. Explorador — high knowledge + moderate-high risk + curious across assets
  if (knowledge >= 65 && risk >= 55 && trading >= 38) return "explorador";

  // 4. Arrojado — very high risk tolerance regardless of style
  if (risk >= 72) return "arrojado";

  // 5. Dividendos — income is dominant signal
  if (income >= 62 && risk < 65) return "dividendos";

  // 6. Longo Prazo — horizon is dominant, risk is at least moderate
  if (horizon >= 70 && risk >= 35) return "longo-prazo";

  // 7. Crescimento — moderate-high risk + long enough horizon
  if (risk >= 52 && horizon >= 50) return "crescimento";

  // 8. Proteção — very low risk + short/medium horizon
  if (risk < 25) return "protecao";

  // 9. Conservador — low risk but with some knowledge
  if (risk < 45) return "conservador";

  // 10. Moderado — the balanced default
  return "moderado";
}
