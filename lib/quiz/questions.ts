/**
 * Quiz de Perfil do Investidor — InvestAI
 *
 * 10 perguntas. ~3 minutos. Sem respostas erradas.
 *
 * Cada resposta pontua em até 5 eixos:
 *   risk      → tolerância a risco (0-3)
 *   knowledge → nível de conhecimento (0-3)
 *   horizon   → horizonte de tempo (0-3)
 *   income    → foco em renda passiva/dividendos (0-3)
 *   trading   → orientação para negociação ativa (0-3)
 *
 * O motor normaliza para 0-100 e classifica o perfil dominante.
 */

export interface AnswerScores {
  risk: number;
  knowledge: number;
  horizon: number;
  income: number;
  trading: number;
}

export interface QuizAnswer {
  id: string;
  text: string;
  sub?: string;
  scores: AnswerScores;
}

export interface QuizQuestion {
  id: string;
  number: number;
  category: string;
  question: string;
  context?: string; // subtle hint below the question
  answers: QuizAnswer[];
}

export const QUESTIONS: QuizQuestion[] = [
  /* ── Q1: Objetivo principal ─────────────────────── */
  {
    id: "objetivo",
    number: 1,
    category: "Objetivo",
    question: "Qual é seu principal objetivo financeiro agora?",
    context: "Escolha o que mais te define. Você pode refinar depois.",
    answers: [
      {
        id: "proteger",
        text: "Proteger o que tenho",
        sub: "Preservação de capital, segurança acima de tudo",
        scores: { risk: 0, knowledge: 0, horizon: 1, income: 1, trading: 0 },
      },
      {
        id: "renda",
        text: "Gerar renda passiva",
        sub: "Dividendos, FIIs, juros mensais",
        scores: { risk: 1, knowledge: 1, horizon: 2, income: 3, trading: 0 },
      },
      {
        id: "crescimento",
        text: "Crescer patrimônio no longo prazo",
        sub: "Acumulação, juros compostos, visão de anos",
        scores: { risk: 2, knowledge: 1, horizon: 3, income: 0, trading: 0 },
      },
      {
        id: "oportunidades",
        text: "Aproveitar oportunidades do mercado",
        sub: "Timing, análise técnica, movimentos de preço",
        scores: { risk: 3, knowledge: 2, horizon: 0, income: 0, trading: 3 },
      },
    ],
  },

  /* ── Q2: Horizonte de tempo ─────────────────────── */
  {
    id: "horizonte",
    number: 2,
    category: "Horizonte",
    question: "Por quanto tempo você pretende manter seus investimentos?",
    context: "Pense nos seus próximos planos reais, não no ideal.",
    answers: [
      {
        id: "curto",
        text: "Menos de 1 ano",
        sub: "Quero liquidez, posso precisar do dinheiro",
        scores: { risk: 0, knowledge: 0, horizon: 0, income: 0, trading: 2 },
      },
      {
        id: "medio",
        text: "Entre 1 e 3 anos",
        sub: "Tenho planos para os próximos anos",
        scores: { risk: 1, knowledge: 0, horizon: 1, income: 1, trading: 1 },
      },
      {
        id: "longo",
        text: "Entre 3 e 10 anos",
        sub: "Estou construindo algo consistente",
        scores: { risk: 2, knowledge: 1, horizon: 2, income: 2, trading: 0 },
      },
      {
        id: "muito_longo",
        text: "Mais de 10 anos",
        sub: "Aposentadoria, liberdade financeira, legado",
        scores: { risk: 2, knowledge: 1, horizon: 3, income: 2, trading: 0 },
      },
    ],
  },

  /* ── Q3: Experiência ─────────────────────────────── */
  {
    id: "experiencia",
    number: 3,
    category: "Experiência",
    question: "Há quanto tempo você investe ativamente?",
    context: "Poupança não conta — estamos falando de renda variável ou fixa intencional.",
    answers: [
      {
        id: "nunca",
        text: "Ainda não comecei",
        sub: "Tenho interesse, mas ainda não dei o primeiro passo",
        scores: { risk: 0, knowledge: 0, horizon: 1, income: 0, trading: 0 },
      },
      {
        id: "iniciante",
        text: "Menos de 1 ano",
        sub: "Comecei recentemente, ainda estou aprendendo",
        scores: { risk: 1, knowledge: 1, horizon: 1, income: 0, trading: 0 },
      },
      {
        id: "intermediario",
        text: "Entre 1 e 3 anos",
        sub: "Já tenho experiência e errei algumas vezes",
        scores: { risk: 2, knowledge: 2, horizon: 2, income: 1, trading: 1 },
      },
      {
        id: "experiente",
        text: "Mais de 3 anos",
        sub: "Passei por ciclos de alta e baixa",
        scores: { risk: 2, knowledge: 3, horizon: 2, income: 2, trading: 2 },
      },
    ],
  },

  /* ── Q4: Capital mensal ──────────────────────────── */
  {
    id: "capital",
    number: 4,
    category: "Capacidade",
    question: "Quanto você consegue investir mensalmente hoje?",
    context: "Sem julgamento. Seja honesto — isso define sua estratégia real.",
    answers: [
      {
        id: "sem_capital",
        text: "Ainda não invisto nada",
        sub: "Estou organizando as finanças primeiro",
        scores: { risk: 0, knowledge: 0, horizon: 1, income: 0, trading: 0 },
      },
      {
        id: "baixo",
        text: "Até R$ 500",
        sub: "Começo pequeno mas com consistência",
        scores: { risk: 1, knowledge: 0, horizon: 2, income: 1, trading: 0 },
      },
      {
        id: "medio",
        text: "Entre R$ 500 e R$ 2.000",
        sub: "Tenho uma rotina de aportes funcionando",
        scores: { risk: 2, knowledge: 1, horizon: 2, income: 1, trading: 1 },
      },
      {
        id: "alto",
        text: "Mais de R$ 2.000",
        sub: "Invisto de forma estruturada e consistente",
        scores: { risk: 2, knowledge: 2, horizon: 2, income: 2, trading: 2 },
      },
    ],
  },

  /* ── Q5: Reação à queda (behavioral finance) ────── */
  {
    id: "volatilidade",
    number: 5,
    category: "Comportamento",
    question: "Sua carteira caiu 20% em um único mês. O que você faz?",
    context: "Essa é a pergunta mais importante. Seja honesto com você mesmo.",
    answers: [
      {
        id: "vende_tudo",
        text: "Vendo tudo. Não aguento ver meu dinheiro sumir",
        sub: "Prefiro perder menos que arriscar mais",
        scores: { risk: 0, knowledge: 0, horizon: 0, income: 0, trading: 0 },
      },
      {
        id: "aguarda",
        text: "Fico preocupado, mas aguardo. Não toco em nada",
        sub: "Sei que oscila, mas é difícil",
        scores: { risk: 1, knowledge: 1, horizon: 2, income: 1, trading: 0 },
      },
      {
        id: "mantem",
        text: "Mantenho a estratégia. Volatilidade faz parte",
        sub: "Já passei por isso antes",
        scores: { risk: 2, knowledge: 2, horizon: 2, income: 1, trading: 1 },
      },
      {
        id: "compra_mais",
        text: "Compro mais. Queda é oportunidade",
        sub: "Só muda o valor, não o ativo",
        scores: { risk: 3, knowledge: 3, horizon: 3, income: 1, trading: 2 },
      },
    ],
  },

  /* ── Q6: Familiaridade com ativos ───────────────── */
  {
    id: "ativos",
    number: 6,
    category: "Conhecimento",
    question: "Quais ativos você já operou ou entende bem?",
    context: "Escolha o nível mais avançado com que você tem conforto real.",
    answers: [
      {
        id: "renda_fixa",
        text: "Poupança, CDB, Tesouro Direto",
        sub: "Renda fixa, rendimento previsível",
        scores: { risk: 0, knowledge: 0, horizon: 1, income: 2, trading: 0 },
      },
      {
        id: "acoes_fiis",
        text: "Ações e FIIs listados na B3",
        sub: "Renda variável, análise fundamentalista básica",
        scores: { risk: 1, knowledge: 2, horizon: 2, income: 2, trading: 1 },
      },
      {
        id: "etfs_bdrs",
        text: "ETFs, BDRs, fundos de índice",
        sub: "Diversificação, exposição internacional",
        scores: { risk: 2, knowledge: 2, horizon: 2, income: 1, trading: 1 },
      },
      {
        id: "derivativos",
        text: "Opções, futuros, cripto, derivativos",
        sub: "Alta complexidade e risco",
        scores: { risk: 3, knowledge: 3, horizon: 0, income: 0, trading: 3 },
      },
    ],
  },

  /* ── Q7: Frequência de acompanhamento ───────────── */
  {
    id: "frequencia",
    number: 7,
    category: "Envolvimento",
    question: "Com que frequência você acompanha o mercado?",
    context: "Não existe resposta certa. Isso calibra o nível de complexidade da plataforma.",
    answers: [
      {
        id: "raramente",
        text: "Raramente ou quase nunca",
        sub: "Confiro o extrato de vez em quando",
        scores: { risk: 0, knowledge: 0, horizon: 2, income: 2, trading: 0 },
      },
      {
        id: "semanal",
        text: "Uma ou duas vezes por semana",
        sub: "Acompanho sem obsessão",
        scores: { risk: 1, knowledge: 1, horizon: 2, income: 2, trading: 1 },
      },
      {
        id: "varios_dias",
        text: "Vários dias por semana",
        sub: "Faço análises com regularidade",
        scores: { risk: 2, knowledge: 2, horizon: 1, income: 1, trading: 2 },
      },
      {
        id: "diario",
        text: "Todo dia, às vezes mais de uma vez",
        sub: "O mercado faz parte da minha rotina",
        scores: { risk: 3, knowledge: 3, horizon: 0, income: 0, trading: 3 },
      },
    ],
  },

  /* ── Q8: O que mais importa (values) ────────────── */
  {
    id: "prioridade",
    number: 8,
    category: "Valores",
    question: "O que você mais valoriza em um investimento?",
    context: "Isso define o que a IA vai priorizar nas análises.",
    answers: [
      {
        id: "seguranca",
        text: "Segurança e previsibilidade",
        sub: "Saber exatamente o que vou receber",
        scores: { risk: 0, knowledge: 0, horizon: 1, income: 1, trading: 0 },
      },
      {
        id: "dividendos",
        text: "Renda passiva consistente",
        sub: "Dividendos, JCP, FIIs pagando todo mês",
        scores: { risk: 1, knowledge: 1, horizon: 2, income: 3, trading: 0 },
      },
      {
        id: "valorizacao",
        text: "Potencial de valorização",
        sub: "O ativo pode multiplicar de valor",
        scores: { risk: 2, knowledge: 1, horizon: 2, income: 0, trading: 1 },
      },
      {
        id: "liquidez_operacao",
        text: "Liquidez e agilidade para operar",
        sub: "Quero poder entrar e sair rapidamente",
        scores: { risk: 3, knowledge: 2, horizon: 0, income: 0, trading: 3 },
      },
    ],
  },

  /* ── Q9: Cenário prático (allocation) ───────────── */
  {
    id: "alocacao",
    number: 9,
    category: "Estratégia",
    question: "Você tem R$ 10.000 para investir agora. Como divide?",
    context: "Não pense no ideal — pense no que você realmente faria.",
    answers: [
      {
        id: "tudo_rf",
        text: "Tudo em renda fixa",
        sub: "CDB, Tesouro Selic ou fundo DI",
        scores: { risk: 0, knowledge: 0, horizon: 0, income: 1, trading: 0 },
      },
      {
        id: "maioria_rf",
        text: "70% renda fixa, 30% ações ou FIIs",
        sub: "Base segura, um pouco de variável",
        scores: { risk: 1, knowledge: 1, horizon: 2, income: 2, trading: 0 },
      },
      {
        id: "equilibrado",
        text: "Metade em renda fixa, metade em variável",
        sub: "Diversificação equilibrada",
        scores: { risk: 2, knowledge: 2, horizon: 2, income: 1, trading: 1 },
      },
      {
        id: "maioria_rv",
        text: "Maioria em ações, ETFs ou outros ativos",
        sub: "Aceito a volatilidade pelo retorno maior",
        scores: { risk: 3, knowledge: 2, horizon: 2, income: 0, trading: 2 },
      },
    ],
  },

  /* ── Q10: Autodefinição ──────────────────────────── */
  {
    id: "identidade",
    number: 10,
    category: "Identidade",
    question: "Qual frase mais te define como investidor?",
    context: "Última pergunta. Confie no instinto.",
    answers: [
      {
        id: "aprendendo",
        text: "Ainda estou descobrindo esse mundo",
        sub: "Cada dia aprendo algo novo",
        scores: { risk: 0, knowledge: 0, horizon: 2, income: 1, trading: 0 },
      },
      {
        id: "disciplinado",
        text: "Sou disciplinado, aporto todo mês sem emoção",
        sub: "Consistência é minha maior vantagem",
        scores: { risk: 1, knowledge: 2, horizon: 3, income: 2, trading: 0 },
      },
      {
        id: "analisador",
        text: "Analiso antes de agir, mas assumo riscos calculados",
        sub: "Dados e fundamentos guiam minhas decisões",
        scores: { risk: 2, knowledge: 3, horizon: 2, income: 1, trading: 2 },
      },
      {
        id: "oportunista",
        text: "Onde o mercado vê medo, eu vejo oportunidade",
        sub: "Contrarianismo com responsabilidade",
        scores: { risk: 3, knowledge: 3, horizon: 1, income: 0, trading: 3 },
      },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
