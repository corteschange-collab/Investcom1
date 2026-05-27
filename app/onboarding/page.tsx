"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { TrendingUp } from "lucide-react";

/**
 * Redirects new users to the quiz.
 * Users who already completed the quiz go straight to the dashboard.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    const meta = user?.unsafeMetadata as Record<string, unknown> | undefined;
    if (meta?.investorProfile) {
      router.replace("/dashboard");
    } else {
      router.replace("/quiz");
    }
  }, [isLoaded, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary animate-pulse">
          <TrendingUp size={22} />
        </div>
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </div>
    </div>
  );
}
