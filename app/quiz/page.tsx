"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  ChevronLeft,
  ArrowRight,
  CheckCircle,
  BarChart2,
  BookOpen,
  Clock,
  DollarSign,
  Activity,
} from "lucide-react";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/quiz/questions";
import { computeProfile, PROFILES } from "@/lib/quiz/engine";
import type { ProfileResult, NormalizedScores } from "@/lib/quiz/engine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────── */

type Phase = "quiz" | "result" | "asset" | "done";

/* ── Score axis config ──────────────────────────────────── */

const SCORE_AXES = [
  { key: "risk" as keyof NormalizedScores, label: "Tolerância a risco", icon: BarChart2, color: "bg-market-red" },
  { key: "knowledge" as keyof NormalizedScores, label: "Conhecimento", icon: BookOpen, color: "bg-primary" },
  { key: "horizon" as keyof NormalizedScores, label: "Horizonte temporal", icon: Clock, color: "bg-market-green" },
  { key: "income" as keyof NormalizedScores, label: "Foco em renda", icon: DollarSign, color: "bg-market-yellow" },
  { key: "trading" as keyof NormalizedScores, label: "Perfil trader", icon: Activity, color: "bg-market-red/80" },
];

const POPULAR_TICKERS = ["PETR4", "VALE3", "ITUB4", "WEGE3", "MXRF11", "BOVA11"];

/* ── Slide variants ─────────────────────────────────────── */

function slideVariants(direction: number) {
  return {
    initial: { opacity: 0, x: direction * 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction * -40 },
  };
}

const resultVariants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

/* ── Main component ─────────────────────────────────────── */

export default function QuizPage() {
  const router = useRouter();
  const { user } = useUser();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [direction, setDirection] = useState(1);
  const [phase, setPhase] = useState<Phase>("quiz");
  const [result, setResult] = useState<ProfileResult | null>(null);
  const [ticker, setTicker] = useState("");
  const [saving, setSaving] = useState(false);

  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const progress = (currentQ / TOTAL_QUESTIONS) * 100;
  const question = QUESTIONS[currentQ];

  /* ── Select answer ──── */
  const selectAnswer = useCallback(
    (answerId: string) => {
      if (autoAdvanceRef.current) return; // prevent double-tap

      const newAnswers = { ...answers, [question.id]: answerId };
      setAnswers(newAnswers);

      autoAdvanceRef.current = setTimeout(() => {
        autoAdvanceRef.current = null;

        if (currentQ < TOTAL_QUESTIONS - 1) {
          setDirection(1);
          setCurrentQ((q) => q + 1);
        } else {
          // Last question — compute and show result
          const computed = computeProfile(newAnswers);
          setResult(computed);
          setPhase("result");
        }
      }, 380);
    },
    [answers, currentQ, question]
  );

  /* ── Go back ───────── */
  const goBack = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    if (currentQ > 0) {
      setDirection(-1);
      setCurrentQ((q) => q - 1);
    }
  }, [currentQ]);

  /* ── Save & finish ──── */
  const handleFinish = useCallback(async () => {
    if (!result) return;
    setSaving(true);
    try {
      await user?.update({
        unsafeMetadata: {
          investorProfile: result.id,
          quizScores: result.scores,
          quizCompletedAt: new Date().toISOString(),
          firstTicker: ticker || undefined,
        },
      });
    } catch {
      // non-blocking
    } finally {
      const dest = ticker
        ? `/dashboard/ativos/${ticker.toUpperCase()}`
        : "/dashboard";
      router.push(dest);
    }
  }, [result, ticker, user, router]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 px-6">
        <div className="flex items-center gap-2 font-bold text-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <TrendingUp size={14} />
          </div>
          InvestAI
        </div>

        {phase === "quiz" && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Pergunta {currentQ + 1} de {TOTAL_QUESTIONS}
            </span>
            <div className="h-1.5 w-32 sm:w-48 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${progress + (1 / TOTAL_QUESTIONS) * 100}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {phase !== "quiz" && (
          <span className="text-xs text-primary font-medium">
            {phase === "result" ? "Resultado" : phase === "asset" ? "Último passo" : ""}
          </span>
        )}
      </header>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">

            {/* ── Quiz phase ──────────────────────────────── */}
            {phase === "quiz" && (
              <motion.div
                key={`q-${currentQ}`}
                variants={slideVariants(direction)}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Category + back */}
                <div className="flex items-center gap-3">
                  {currentQ > 0 && (
                    <button
                      onClick={goBack}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  <span className="rounded-full border border-border/60 bg-card px-3 py-0.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    {question.category}
                  </span>
                </div>

                {/* Question text */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold leading-snug">
                    {question.question}
                  </h1>
                  {question.context && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {question.context}
                    </p>
                  )}
                </div>

                {/* Answer cards */}
                <div className="space-y-2.5">
                  {question.answers.map((answer, idx) => {
                    const selected = answers[question.id] === answer.id;
                    return (
                      <motion.button
                        key={answer.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.2 }}
                        onClick={() => selectAnswer(answer.id)}
                        className={cn(
                          "flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all",
                          selected
                            ? "border-primary/50 bg-primary/10 shadow-md shadow-primary/10"
                            : "border-border/50 bg-card hover:border-border/80 hover:bg-card/80 active:scale-[0.99]"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                            selected
                              ? "border-primary bg-primary"
                              : "border-border/70"
                          )}
                        >
                          {selected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.15 }}
                            >
                              <div className="h-2 w-2 rounded-full bg-white" />
                            </motion.div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium leading-snug",
                            selected ? "text-foreground" : "text-foreground/90"
                          )}>
                            {answer.text}
                          </p>
                          {answer.sub && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {answer.sub}
                            </p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Result phase ─────────────────────────────── */}
            {phase === "result" && result && (
              <ResultScreen
                result={result}
                onContinue={() => setPhase("asset")}
              />
            )}

            {/* ── Asset phase ───────────────────────────────── */}
            {phase === "asset" && (
              <motion.div
                key="asset"
                variants={resultVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold">Um último passo</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Qual ativo quer analisar primeiro? Você pode mudar depois.
                  </p>
                </div>

                <Input
                  placeholder="Ex: PETR4, MXRF11, BOVA11"
                  value={ticker}
                  onChange={(e) =>
                    setTicker(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                  }
                  className="h-12 bg-card border-border/60 text-base font-mono uppercase tracking-wider"
                  maxLength={8}
                />

                <div>
                  <p className="text-xs text-muted-foreground mb-2.5">Populares</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_TICKERS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTicker(t)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-mono font-medium transition-all",
                          ticker === t
                            ? "border-primary/60 bg-primary/10 text-primary"
                            : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleFinish}
                    disabled={saving}
                    className="flex-1 h-11"
                  >
                    Pular, ir ao dashboard
                  </Button>
                  <Button
                    onClick={handleFinish}
                    disabled={saving}
                    className="flex-1 h-11 bg-primary hover:bg-primary/90 font-semibold gap-2 shadow-lg shadow-primary/20"
                  >
                    {saving ? "Carregando…" : ticker ? `Analisar ${ticker}` : "Ir ao dashboard"}
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Result screen component ────────────────────────────── */

function ResultScreen({
  result,
  onContinue,
}: {
  result: ProfileResult;
  onContinue: () => void;
}) {
  const { profile, scores } = result;

  return (
    <motion.div
      key="result"
      variants={resultVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Profile hero */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
          className={cn(
            "mx-auto flex h-24 w-24 items-center justify-center rounded-3xl text-5xl shadow-2xl",
            profile.bgColor
          )}
        >
          {profile.icon}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">
            Seu perfil
          </p>
          <h1 className={cn("text-3xl font-bold", profile.color)}>
            {profile.label}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground italic">
            &ldquo;{profile.tagline}&rdquo;
          </p>
        </motion.div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className={cn("rounded-2xl border p-4 text-sm leading-relaxed", profile.bgColor, profile.borderColor)}
      >
        {profile.description}
      </motion.div>

      {/* Score axes */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border/50 bg-card p-4 space-y-3"
      >
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Seus eixos de perfil
        </p>
        {SCORE_AXES.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Icon size={11} />
                {label}
              </span>
              <span className="font-mono font-medium">{scores[key]}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", color)}
                initial={{ width: 0 }}
                animate={{ width: `${scores[key]}%` }}
                transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Traits */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-border/50 bg-card p-4 space-y-2.5"
      >
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Características
        </p>
        {profile.traits.map((trait) => (
          <div key={trait} className="flex items-start gap-2.5 text-sm">
            <CheckCircle size={14} className={cn("mt-0.5 shrink-0", profile.color)} />
            <span className="text-foreground/90">{trait}</span>
          </div>
        ))}
      </motion.div>

      {/* Platform customizations */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-border/50 bg-card p-4 space-y-2.5"
      >
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          A plataforma vai personalizar para você
        </p>
        {profile.customizations.map((item) => (
          <div key={item} className="flex items-start gap-2.5 text-sm">
            <div className={cn("mt-1 h-1.5 w-1.5 rounded-full shrink-0", profile.bgColor)} />
            <span className="text-muted-foreground">{item}</span>
          </div>
        ))}
      </motion.div>

      {/* Suggested assets */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2.5">
          Ativos sugeridos para explorar
        </p>
        <div className="flex flex-wrap gap-2">
          {profile.suggestedAssets.map((asset) => (
            <span
              key={asset}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-mono font-medium",
                profile.bgColor,
                profile.borderColor,
                profile.color
              )}
            >
              {asset}
            </span>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={onContinue}
          className="w-full h-12 bg-primary hover:bg-primary/90 font-semibold text-base gap-2 shadow-xl shadow-primary/20"
        >
          Personalizar minha plataforma
          <ArrowRight size={18} />
        </Button>
      </motion.div>
    </motion.div>
  );
}
