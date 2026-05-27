"use client";

import { useDbSync } from "@/hooks/use-db-sync";

export function DbSyncProvider({ children }: { children: React.ReactNode }) {
  useDbSync();
  return <>{children}</>;
}
