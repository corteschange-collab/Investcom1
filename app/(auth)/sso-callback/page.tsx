"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2, TrendingUp } from "lucide-react";

export default function SSOCallbackPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
        <TrendingUp size={22} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loader2 size={20} className="animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Autenticando com Google...</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
