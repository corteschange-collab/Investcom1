"use client";

import { useUser } from "@clerk/nextjs";
import { PROFILES } from "@/lib/quiz/engine";
import type { ProfileId, ProfileDefinition, NormalizedScores } from "@/lib/quiz/engine";

export interface InvestorProfileData {
  id: ProfileId | null;
  profile: ProfileDefinition | null;
  scores: NormalizedScores | null;
  completedAt: Date | null;
  /** True once Clerk has loaded and the profile is set */
  hasProfile: boolean;
  /** Clerk is still loading */
  isLoading: boolean;
}

/** Convenience flags derived from the profile */
export interface ProfileFlags {
  isBeginnerMode: boolean;
  showSimplifiedLanguage: boolean;
  prioritizeDividends: boolean;
  prioritizeLongTerm: boolean;
  showTradingTools: boolean;
  showAdvancedIndicators: boolean;
  riskAlertSensitivity: "high" | "medium" | "low";
}

function deriveFlags(id: ProfileId | null): ProfileFlags {
  return {
    isBeginnerMode: id === "iniciante",
    showSimplifiedLanguage: id === "iniciante",
    prioritizeDividends: id === "dividendos",
    prioritizeLongTerm: id === "longo-prazo" || id === "dividendos",
    showTradingTools: id === "trader" || id === "explorador" || id === "arrojado",
    showAdvancedIndicators: id === "trader" || id === "explorador" || id === "arrojado" || id === "crescimento",
    riskAlertSensitivity:
      id === "conservador" || id === "protecao" || id === "iniciante"
        ? "high"
        : id === "arrojado" || id === "trader"
        ? "low"
        : "medium",
  };
}

export function useInvestorProfile(): InvestorProfileData & { flags: ProfileFlags } {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return {
      id: null,
      profile: null,
      scores: null,
      completedAt: null,
      hasProfile: false,
      isLoading: true,
      flags: deriveFlags(null),
    };
  }

  const meta = user?.unsafeMetadata as Record<string, unknown> | undefined;
  const rawId = meta?.investorProfile as string | undefined;
  const id = rawId && rawId in PROFILES ? (rawId as ProfileId) : null;
  const scores = (meta?.quizScores as NormalizedScores) ?? null;
  const rawDate = meta?.quizCompletedAt as string | undefined;

  return {
    id,
    profile: id ? PROFILES[id] : null,
    scores,
    completedAt: rawDate ? new Date(rawDate) : null,
    hasProfile: id !== null,
    isLoading: false,
    flags: deriveFlags(id),
  };
}
