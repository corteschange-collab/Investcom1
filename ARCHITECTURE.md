# InvestAI — Arquitetura do Sistema

> Documento de referência técnica. Última atualização: 2026-05-26.

---

## 1. Visão Geral do Sistema

InvestAI é um SaaS de análise de mercado financeiro para investidores brasileiros. A plataforma combina dados de mercado em tempo real (B3, global, cripto), análise técnica/fundamentalista computada no cliente, IA conversacional e personalização por perfil de investidor.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Next.js)                         │
│                                                                   │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐   │
│  │  Marketing  │   │    Auth     │   │     Dashboard       │   │
│  │  (SSR/SSG)  │   │  (Clerk)    │   │   (RSC + Client)    │   │
│  └─────────────┘   └─────────────┘   └─────────────────────┘   │
│                                              │                    │
│              ┌───────────────────────────────┤                   │
│              │         API Routes            │                    │
│              │  /api/market   /api/ai         │                   │
│              │  /api/support  /api/alerts    │                    │
│              └───────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
         │               │               │               │
    ┌────▼───┐      ┌────▼───┐     ┌────▼────┐    ┌────▼────┐
    │ Brapi  │      │ Yahoo  │     │ OpenRtr │    │ Resend  │
    │ (B3)   │      │Finance │     │  (AI)   │    │ (email) │
    └────────┘      └────────┘     └─────────┘    └─────────┘
                                                        │
                                                  ┌─────▼─────┐
                                                  │ PostgreSQL │
                                                  │ (Railway / │
                                                  │  Supabase) │
                                                  └───────────┘
```

**Stack:**
| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 App Router |
| Auth | Clerk v7.4.1 |
| State | Zustand v5 + React Query v5 |
| UI | Shadcn UI + Tailwind + Framer Motion v12 |
| DB | PostgreSQL + Prisma ORM |
| Email | Resend SDK v6 |
| Dados B3 | Brapi.dev (15 req/min free) |
| Dados globais | Yahoo Finance (não-oficial) |
| IA | OpenRouter → Claude / GPT-4o |

---

## 2. Dependências Entre Módulos

```
types/index.ts
    └─── lib/score/engine.ts
    └─── lib/indicators/index.ts
    └─── lib/market/pipeline.ts
    └─── store/watchlist.ts
    └─── store/alerts.ts

lib/market/rate-limiter.ts
    └─── lib/market/pipeline.ts

lib/market/cache.ts
    └─── lib/market/pipeline.ts

lib/market/market-hours.ts
    └─── lib/market/pipeline.ts
    └─── lib/market/cache.ts (TTL dinâmico)

lib/market/pipeline.ts
    └─── app/api/market/quotes/route.ts
    └─── app/api/market/indices/route.ts
    └─── app/api/market/history/route.ts
    └─── app/(dashboard)/dashboard/page.tsx (SSR direto)

lib/indicators/index.ts
    └─── lib/score/engine.ts
    └─── components/analysis/indicators-panel.tsx
    └─── components/analysis/probabilistic-panel.tsx
    └─── components/analysis/score-panel.tsx

lib/score/engine.ts
    └─── components/analysis/score-panel.tsx
    └─── app/(dashboard)/dashboard/ativos/[ticker]/page.tsx

lib/quiz/engine.ts + questions.ts
    └─── app/quiz/page.tsx
    └─── hooks/use-investor-profile.ts

hooks/use-investor-profile.ts
    └─── lib/assets/recommendation.ts
    └─── components/dashboard/live-dashboard.tsx (personalização)
    └─── app/(dashboard)/dashboard/perfil/page.tsx

lib/assets/taxonomy.ts + catalog.ts
    └─── lib/assets/recommendation.ts
    └─── app/(dashboard)/dashboard/explorar/*
    └─── app/(dashboard)/dashboard/carteiras/*

lib/assets/recommendation.ts
    └─── app/(dashboard)/dashboard/page.tsx (featured assets)
    └─── app/(dashboard)/dashboard/radar/page.tsx

store/watchlist.ts
    └─── components/analysis/watchlist-button.tsx
    └─── components/layout/sidebar.tsx (badge count)
    └─── app/(dashboard)/dashboard/watchlist/page.tsx

store/alerts.ts
    └─── app/(dashboard)/dashboard/alertas/page.tsx
    └─── [FASE 2: alert evaluation job]

app/api/ai/route.ts
    └─── components/analysis/score-panel.tsx (AI explanation)
    └─── app/(dashboard)/dashboard/assistente/page.tsx
```

**Dependências circulares a evitar:**
- `pipeline.ts` NÃO deve importar nada de `app/`
- `store/` NÃO deve importar de `lib/market/` (dados sempre via hooks)
- `components/` NÃO devem importar de `app/`

---

## 3. Ordem de Implementação — Trabalho Restante

### Prioridade 1 — MVP (próximas 2 semanas)

```
[1] Prisma + DB setup
    ├── prisma/schema.prisma ✅ (criado)
    ├── npm install @prisma/client prisma
    ├── DATABASE_URL no .env.local
    ├── npx prisma migrate dev --name init
    └── lib/db.ts — singleton PrismaClient

[2] Sincronização localStorage → DB
    ├── app/api/user/sync/route.ts — POST ao login
    │   migra watchlist/alerts do localStorage para o DB
    └── hook useDbSync — roda uma vez após login

[3] API routes para watchlist e alertas persistidos
    ├── app/api/watchlist/route.ts (GET, POST)
    ├── app/api/watchlist/[id]/route.ts (DELETE)
    ├── app/api/alerts/route.ts (GET, POST)
    └── app/api/alerts/[id]/route.ts (PATCH active, DELETE)

[4] Dashboard personalizado por perfil
    ├── components/dashboard/live-dashboard.tsx
    │   usa useInvestorProfile() → getRecommendation()
    │   exibe featured assets e mensagem personalizada
    └── Dashboard homepage mostra assets do perfil

[5] Página de Perfil completa
    ├── app/(dashboard)/dashboard/perfil/page.tsx
    │   exibe quiz results, scores por eixo
    │   botão re-fazer quiz
    └── components/profile/quiz-result-card.tsx

[6] Salvamento de ticket no DB
    └── app/api/support/contact/route.ts
        persiste SupportTicket via Prisma
```

### Prioridade 2 — Produto completo (semanas 3-6)

```
[7] Módulo de Comparação
    ├── app/(dashboard)/dashboard/comparar/page.tsx
    └── components/analysis/comparison-table.tsx

[8] Screener avançado
    ├── app/(dashboard)/dashboard/radar/page.tsx (melhorar)
    └── lib/api/screener.ts (expandir filtros)

[9] Alert evaluation
    ├── Cron job ou polling no cliente (30s interval)
    ├── app/api/alerts/evaluate/route.ts
    └── Disparo de email via Resend quando alerta dispara

[10] Stripe billing
    ├── app/api/webhooks/stripe/route.ts
    ├── app/(dashboard)/dashboard/planos/page.tsx
    └── Middleware de feature gate por plano
```

### Prioridade 3 — Escala (semanas 7+)

```
[11] Redis (Upstash) — substituir in-process cache
[12] PWA manifest + service worker
[13] SEO técnico + sitemap
[14] Portfolio tracker (posições + PnL)
[15] Notificações push (Web Push API)
```

---

## 4. MVP — O Que Está Pronto vs. O Que Falta

### ✅ Pronto

| Módulo | Status | Observação |
|--------|--------|-----------|
| Landing page | ✅ Completo | Hero, features, pricing, FAQ, CTA |
| Auth (Clerk) | ✅ Completo | Sign-in, sign-up, SSO, middleware |
| Dashboard layout | ✅ Completo | Sidebar, topbar, command palette |
| Market pipeline | ✅ Completo | Brapi + Yahoo + BCB, fallback, rate limit, cache |
| Cotações ao vivo | ✅ Completo | hooks React Query, 30s refresh |
| Asset detail page | ✅ Completo | Chart, indicadores, score, probabilístico |
| Score engine | ✅ Completo | 4 dimensões, 0-100 |
| Indicadores técnicos | ✅ Completo | RSI, MACD, EMA, SMA, Bollinger, ATR, ADX, OBV |
| Asset explorer (8 classes) | ✅ Completo | Ações, FIIs, ETFs, BDRs, RF, Cripto, Commodities |
| Portfolio templates | ✅ Completo | 6 carteiras temáticas |
| Watchlist | ✅ localStorage | Falta sync DB |
| Alertas | ✅ localStorage | Falta sync DB + avaliação |
| IA Assistente | ✅ Completo | OpenRouter, contexto de mercado |
| Suporte/Contato | ✅ Completo | Formulário, FAQ, help button, Resend |
| Quiz de perfil | ✅ Completo | 10 questões, 10 perfis, Clerk metadata |
| Recommendation engine | ✅ Completo | Por perfil, portfolios temáticos |
| Prisma schema | ✅ Criado | Falta instalar e migrar |

### ❌ Falta para MVP shippable

| Item | Estimativa | Bloqueia |
|------|-----------|---------|
| DB setup (Prisma + migrate) | 1h | Persistência real |
| Sync localStorage → DB | 2h | Cross-device data |
| API routes watchlist/alerts | 3h | Backend data |
| Dashboard personalizado | 2h | Core value prop |
| Perfil page completa | 2h | User trust |

**Total para MVP: ~10 horas de trabalho.**

---

## 5. Essencial vs. Fase 2

### Essencial (MVP)
- Cotações B3 ao vivo com análise técnica
- Score proprietário 0-100
- Perfil de investidor + personalização
- Watchlist e alertas persistidos no DB
- IA assistente com contexto
- Suporte funcional

### Fase 2 (Growth)
- Stripe (monetização)
- Redis cache (performance em escala)
- Comparação de ativos lado a lado
- Portfolio tracker com PnL real
- Notificações push/email de alertas
- Screener com filtros avançados
- Conteúdo educacional expandido

### Fase 3 (Scale)
- App mobile (React Native ou PWA)
- Backtesting de estratégias
- Social (watchlists públicas, ranking)
- Dados de opções (derivatives)
- API pública para terceiros

---

## 6. Estrutura de Pastas Canônica

```
invest-platform/
├── app/
│   ├── (marketing)/              # SSG — sem auth, sem sidebar
│   │   ├── layout.tsx
│   │   └── page.tsx              # Landing page
│   ├── (auth)/                   # Clerk auth pages
│   │   ├── acesso/page.tsx       # Combined sign-in/sign-up
│   │   ├── sso-callback/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # RSC + Client, requer auth
│   │   ├── layout.tsx            # Sidebar + Topbar + TickerTape
│   │   └── dashboard/
│   │       ├── page.tsx          # Dashboard principal (SSR)
│   │       ├── loading.tsx
│   │       ├── ativos/[ticker]/  # Análise de ativo
│   │       ├── explorar/         # Catálogo por classe
│   │       │   ├── page.tsx      # Hub
│   │       │   ├── acoes/
│   │       │   ├── fiis/
│   │       │   ├── etfs/
│   │       │   ├── bdrs/
│   │       │   ├── renda-fixa/
│   │       │   ├── cripto/
│   │       │   └── commodities/
│   │       ├── carteiras/        # Portfolios temáticos
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── comparar/         # [FASE 2] Comparação
│   │       ├── watchlist/
│   │       ├── alertas/
│   │       ├── radar/            # Screener
│   │       ├── assistente/       # IA Chat
│   │       ├── aprender/         # Educação
│   │       ├── suporte/
│   │       └── perfil/
│   ├── api/
│   │   ├── market/
│   │   │   ├── quotes/route.ts   # GET /api/market/quotes?tickers=X,Y
│   │   │   ├── indices/route.ts  # GET /api/market/indices
│   │   │   ├── history/route.ts  # GET /api/market/history?ticker=X&range=1M
│   │   │   └── status/route.ts   # GET /api/market/status
│   │   ├── watchlist/
│   │   │   ├── route.ts          # GET (list), POST (add)
│   │   │   └── [id]/route.ts     # DELETE
│   │   ├── alerts/
│   │   │   ├── route.ts          # GET, POST
│   │   │   ├── [id]/route.ts     # PATCH, DELETE
│   │   │   └── evaluate/route.ts # POST — cron job endpoint
│   │   ├── user/
│   │   │   └── sync/route.ts     # POST — migra localStorage → DB
│   │   ├── ai/route.ts           # POST — OpenRouter proxy
│   │   └── support/
│   │       └── contact/route.ts  # POST — Resend + Prisma
│   ├── onboarding/page.tsx       # Redirect logic
│   ├── quiz/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx                # Root — fonts, providers
│   └── globals.css
├── components/
│   ├── ui/                       # Shadcn base components
│   ├── layout/                   # Sidebar, Topbar, CommandPalette
│   ├── dashboard/                # LiveDashboard, MarketCard, TickerTape...
│   ├── analysis/                 # IndicatorsPanel, ScorePanel, ProbPanel...
│   ├── charts/                   # PriceChart (Lightweight Charts)
│   ├── market/                   # LivePrice, LiveIndicesBar, FreshnessBadge
│   ├── support/                  # ContactForm, FaqAccordion, HelpButton
│   ├── profile/                  # QuizResultCard, ProfileBadge [a criar]
│   └── landing/                  # Hero, Features, Pricing...
├── hooks/
│   ├── use-live-quotes.ts
│   ├── use-live-indices.ts
│   ├── use-live-history.ts
│   ├── use-market-status.ts
│   ├── use-investor-profile.ts
│   └── use-db-sync.ts            # [a criar] sync localStorage → DB
├── lib/
│   ├── api/
│   │   ├── brapi.ts
│   │   └── screener.ts
│   ├── assets/
│   │   ├── taxonomy.ts
│   │   ├── catalog.ts
│   │   └── recommendation.ts
│   ├── indicators/
│   │   └── index.ts
│   ├── market/
│   │   ├── pipeline.ts
│   │   ├── cache.ts
│   │   ├── rate-limiter.ts
│   │   └── market-hours.ts
│   ├── quiz/
│   │   ├── engine.ts
│   │   └── questions.ts
│   ├── score/
│   │   └── engine.ts
│   ├── db.ts                     # [a criar] Prisma singleton
│   └── utils.ts
├── store/
│   ├── watchlist.ts              # Zustand + localStorage (fallback)
│   ├── alerts.ts                 # Zustand + localStorage (fallback)
│   └── ui.ts
├── prisma/
│   └── schema.prisma             # ✅ criado
├── types/
│   └── index.ts
├── providers/
│   └── query-provider.tsx
└── middleware.ts                 # Clerk auth
```

---

## 7. Arquitetura de Componentes

### Padrão de composição

```
Page (RSC — Server Component)
  └── fetches initial data (SSR / generateStaticParams)
  └── passes data as props to Client components

LiveDashboard (Client — "use client")
  └── React Query polls /api/market/quotes every 30s
  └── renders MarketCard[]
  └── reads useInvestorProfile() for personalization

MarketCard (Client)
  └── LivePrice (React Query subscriber)
  └── ScoreRing (pure display)
```

### Hierarquia de estado

```
React Query (server state — market data)
  ↕  fetches via /api/market/* routes

Zustand (client state — user data)
  ├── useWatchlistStore — watchlist items
  ├── useAlertsStore — price alerts
  └── useUIStore — sidebar open, theme

Clerk (auth state)
  └── useUser() → user.unsafeMetadata.investorProfile

URL state (searchParams)
  └── ?categoria= on support form
  └── ?range= on asset chart timeframe
```

### Fluxo de dados — Asset Detail Page

```
/dashboard/ativos/[ticker]
  1. RSC: fetchHistory(ticker, "1M") → passes OHLCV[]
  2. Client: TradingView chart renders with initialData
  3. Client: useInvestorProfile() → profile flags
  4. Client: computeIndicators(ohlcv) → IndicatorResult
  5. Client: computeScore(indicators, fundamentals, price) → ScoreBreakdown
  6. Client: buildScenarios(indicators, score) → ProbabilisticScenario[]
  7. All computed locally — no extra API calls for analysis
```

---

## 8. Schema de Banco de Dados

Ver [prisma/schema.prisma](prisma/schema.prisma) para o schema completo.

**Resumo das entidades:**

| Tabela | Propósito | Relacionamentos |
|--------|----------|----------------|
| `User` | Espelho do usuário Clerk | tem Watchlists, Alerts, Tickets |
| `Watchlist` | Container para itens | pertence a User, tem WatchlistItems |
| `WatchlistItem` | Ticker individual | pertence a Watchlist |
| `Alert` | Regra de alerta de preço | pertence a User, tem AlertLogs |
| `AlertLog` | Histórico de disparo | pertence a Alert e User |
| `SupportTicket` | Contato de suporte | pertence opcionalmente a User |

**Decisões de design:**
- `User.investorProfile` é uma string (ProfileId) — não enum, para flexibilidade futura
- `User.quizScores` é Json — armazena o mapa de pontuações brutas
- `WatchlistItem` tem unique constraint `(watchlistId, ticker)` — sem duplicatas
- `Alert` indexado em `(ticker, active)` — para o job de avaliação em batch
- `SupportTicket.userId` é nullable — suporte anônimo permitido

**Configuração do PrismaClient (lib/db.ts):**
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

---

## 9. Estrutura de APIs

### Market APIs (sem auth — dados públicos cacheados)

| Rota | Método | Params | Cache | Uso |
|------|--------|--------|-------|-----|
| `/api/market/quotes` | GET | `?tickers=PETR4,VALE3` | 30s (mercado aberto) / 5min (fechado) | LiveDashboard, Watchlist |
| `/api/market/indices` | GET | — | 30s / 10min | LiveIndicesBar, Topbar |
| `/api/market/history` | GET | `?ticker=X&range=1D\|1W\|1M\|3M\|6M\|1Y` | 5min / 24h | PriceChart |
| `/api/market/status` | GET | — | 60s | MarketStatusBadge |

### User APIs (requer Clerk auth)

| Rota | Método | Body | Descrição |
|------|--------|------|-----------|
| `/api/watchlist` | GET | — | Lista watchlist do usuário |
| `/api/watchlist` | POST | `{ ticker }` | Adiciona ativo |
| `/api/watchlist/[id]` | DELETE | — | Remove item |
| `/api/alerts` | GET | — | Lista alertas do usuário |
| `/api/alerts` | POST | `{ ticker, type, value }` | Cria alerta |
| `/api/alerts/[id]` | PATCH | `{ active }` | Ativa/desativa |
| `/api/alerts/[id]` | DELETE | — | Remove alerta |
| `/api/alerts/evaluate` | POST | — | Cron job: avalia alertas ativos |
| `/api/user/sync` | POST | `{ watchlist[], alerts[] }` | Migra localStorage → DB |

### AI & Support APIs

| Rota | Método | Body | Descrição |
|------|--------|------|-----------|
| `/api/ai` | POST | `{ messages[], ticker?, context }` | Proxy OpenRouter |
| `/api/support/contact` | POST | `{ name, email, category, ... }` | Envia email + salva ticket |

### Contratos de resposta padrão

```typescript
// Sucesso
{ data: T, source: "brapi" | "yahoo" | "cache", freshAt: string }

// Erro
{ error: string, code?: string }

// Paginação (futuro)
{ data: T[], total: number, page: number, pageSize: number }
```

---

## 10. Estratégia de Cache e Atualização

### Camadas de cache

```
┌─────────────────────────────────────────────┐
│  Layer 1 — React Query (browser)             │
│  staleTime: 25s  gcTime: 5min                │
│  refetchInterval: 30s (mercado aberto)        │
│  refetchInterval: false (fechado)             │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  Layer 2 — Next.js fetch cache (edge/server) │
│  next: { revalidate: 30 }  (quotes)          │
│  next: { revalidate: 300 } (history)         │
│  next: { revalidate: 86400 } (fundamentais) │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  Layer 3 — In-process TTL Map (API routes)   │
│  marketCache singleton — auto-purge 5min     │
│  TTL dinâmico por market-hours.ts            │
└─────────────────────────────────────────────┘
                    │
                    ▼ (FASE 2)
┌─────────────────────────────────────────────┐
│  Layer 4 — Redis (Upstash)                   │
│  Compartilhado entre instâncias serverless   │
│  Elimina cold-start cache miss               │
└─────────────────────────────────────────────┘
```

### TTLs por tipo de dado

| Tipo | Mercado aberto | Fechado | Fim de semana |
|------|---------------|---------|---------------|
| Cotações (preço atual) | 30s | 5min | 30min |
| Índices (IBOV, etc.) | 30s | 10min | 1h |
| Histórico intraday | 5min | 1h | 24h |
| Histórico diário (1M+) | 1h | 24h | 24h |
| Dados fundamentalistas | 24h | 24h | 24h |
| Status de mercado | 60s | 60s | 5min |

### Estratégia de invalidação

- **Stale-while-revalidate**: browser mostra dado cacheado, busca novo em background
- **FreshnessBadge**: componente visual mostra `freshAt` ao usuário
- **DataSource tag**: toda resposta inclui `source: "brapi" | "yahoo" | "cache"` para debug
- **Market hours awareness**: `market-hours.ts` retorna TTL correto baseado em horário BRT

---

## 11. Estratégia de Personalização por Perfil

### 10 Perfis de Investidor

| ID | Nome | Risco | Foco Principal |
|----|------|-------|---------------|
| `iniciante` | Iniciante | 1 | Educação + RF |
| `conservador` | Conservador | 1 | Tesouro + DI |
| `protecao` | Proteção | 2 | IPCA+ + Ouro |
| `dividendos` | Dividendos | 2 | FIIs + Ações dividend |
| `moderado` | Moderado | 3 | Mix equilibrado |
| `longo-prazo` | Longo Prazo | 3 | Crescimento + ETFs |
| `crescimento` | Crescimento | 4 | Small caps + tech |
| `arrojado` | Arrojado | 4 | Ações + BDRs |
| `explorador` | Explorador | 5 | Cripto + derivativos |
| `trader` | Trader | 5 | Análise técnica, curto prazo |

### Camadas de personalização

```
1. Dashboard Homepage
   └── featured assets: getRecommendation(profileId).homeFeatured[]
   └── mensagem de boas-vindas: profile.greeting
   └── ordered category grid: profile.categoryOrder[]

2. Linguagem e complexidade
   └── languageLevel: "simple" | "standard" | "advanced"
   └── isBeginnerMode → tooltip mais verbosos, menos jargão
   └── showSimplifiedLanguage → descrições em PT simples

3. Conteúdo visível
   └── showCrypto: false para iniciante/conservador
   └── showBDRs: false para iniciante
   └── showTradingTools: true apenas para trader/explorador
   └── showAdvancedIndicators: false para iniciante/conservador

4. Score e análise
   └── scoreFocus: ["dividend"] para perfil dividendos
   └── riskAlertSensitivity: "high" | "medium" | "low"
   └── Painel probabilístico adapta linguagem de cenários

5. IA Assistente
   └── aiPersona: string com instruções de tom
   └── ex. trader → "técnico e direto, use termos de AT"
   └── ex. iniciante → "didático, evite jargão, use analogias"
```

### Fluxo de onboarding com perfil

```
Cadastro (Clerk)
    ↓
/onboarding → detecta se tem perfil no Clerk metadata
    ↓ sem perfil         ↓ com perfil
/quiz               /dashboard
    ↓
10 questões, 5 eixos de score
    ↓
Resultado: profileId + scores
    ↓
Salva em user.unsafeMetadata + DB (User.investorProfile)
    ↓
Escolhe primeiro ativo de interesse
    ↓
/dashboard — personalizado
```

---

## 12. Pontos Críticos de Risco

### Risco 1 — Brapi rate limit (15 req/min)
**Problema:** Dashboard com 10+ usuários simultâneos esgota o limite.
**Solução MVP:** In-process cache + token bucket (já implementado).
**Solução Escala:** Redis compartilhado + cache de 30s por ticker.
**Mitigação imediata:** `refetchInterval` React Query = 30s (não 5s).

### Risco 2 — Yahoo Finance sem SLA
**Problema:** API não-oficial pode mudar formato ou bloquear IPs a qualquer momento.
**Solução:** Yahoo é apenas fallback — Brapi é fonte primária para B3. Fallback de dados hardcoded para índices críticos (IBOV, USD/BRL).
**Fase 2:** Contratar API paga (Alpha Vantage, Polygon.io).

### Risco 3 — In-process cache não compartilhado (serverless)
**Problema:** Cada instância Lambda tem sua própria cópia do `marketCache`. Cold starts invalidam cache.
**Solução MVP:** Next.js `fetch()` com `revalidate` usa cache de disco/CDN compartilhado.
**Solução definitiva:** Upstash Redis (HTTP-based, funciona em serverless).

### Risco 4 — Watchlist/Alertas só no localStorage
**Problema:** Perda de dados em novo dispositivo, logout ou limpeza de browser.
**Solução:** Prisma schema criado. Implementar sync com DB nas próximas sprints.
**Ordem:** API routes → useDbSync hook → localStorage como fallback offline.

### Risco 5 — Clerk unsafeMetadata como única fonte de perfil
**Problema:** Dados não consultáveis no banco, dificulta analytics e segmentação.
**Solução:** Duplicar `investorProfile` no model `User` do Prisma. Clerk metadata é source-of-truth, DB é espelho para consultas server-side.

### Risco 6 — Score engine sem dados fundamentalistas reais
**Problema:** Brapi free tier retorna dados fundamentalistas incompletos. Score pode ser calculado com `fund = 50` (default) para muitos ativos.
**Solução:** Mostrar `confidence: "low"` quando fundamentais estão ausentes. Badge visual "Dados parciais" no ScorePanel.

### Risco 7 — OpenRouter API key exposta
**Problema:** Chave no `.env.local` não deve ir para o bundle cliente.
**Status atual:** ✅ `OPENROUTER_API_KEY` está apenas na API route `/api/ai` (server-side).
**Verificar:** `NEXT_PUBLIC_` prefix nunca deve ser usado para chaves de API.

---

## 13. Backlog por Fases

### Sprint 1 — DB & Persistência (10h)
- [ ] `npm install prisma @prisma/client`
- [ ] `DATABASE_URL` no `.env.local` (Railway ou Supabase free tier)
- [ ] `npx prisma migrate dev --name init`
- [ ] `lib/db.ts` — PrismaClient singleton
- [ ] `app/api/user/sync/route.ts`
- [ ] `hooks/use-db-sync.ts`
- [ ] `app/api/watchlist/route.ts` + `[id]/route.ts`
- [ ] `app/api/alerts/route.ts` + `[id]/route.ts`
- [ ] Atualizar `useWatchlistStore` para sync com DB

### Sprint 2 — Personalização & Perfil (8h)
- [ ] `components/dashboard/live-dashboard.tsx` — personalização por perfil
- [ ] `app/(dashboard)/dashboard/perfil/page.tsx` — completa
- [ ] `components/profile/quiz-result-card.tsx`
- [ ] Dashboard homepage mostra assets do perfil
- [ ] Persistir ticket no DB em `/api/support/contact`

### Sprint 3 — Produto (12h)
- [ ] `app/(dashboard)/dashboard/comparar/page.tsx`
- [ ] `components/analysis/comparison-table.tsx`
- [ ] Alert evaluation endpoint + client polling
- [ ] Email de alerta disparado via Resend
- [ ] Screener: filtros avançados + export

### Sprint 4 — Monetização (16h)
- [ ] Stripe checkout + webhooks
- [ ] Feature gates por plano (FREE vs PREMIUM)
- [ ] `app/(dashboard)/dashboard/planos/page.tsx`
- [ ] Limite de watchlist/alertas no FREE (ex: 10/5)

### Sprint 5 — Performance & Escala (12h)
- [ ] Upstash Redis — substituir in-process cache
- [ ] Lighthouse audit + correções
- [ ] SEO: metadata dinâmica por ativo, sitemap.xml
- [ ] PWA: manifest.json, ícones

---

*Documento gerado pelo tech lead da plataforma InvestAI.*
*Para dúvidas sobre decisões de arquitetura, consultar este documento antes de implementar.*
