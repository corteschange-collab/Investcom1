import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/40 bg-card p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>

      {/* Market cards */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/40 bg-card p-4 space-y-3">
              <div className="flex justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AssetPageSkeleton() {
  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Chart area */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-7 w-32" />
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-10 rounded-md" />
                ))}
              </div>
            </div>
            <Skeleton className="h-[220px] w-full rounded-xl" />
          </div>

          {/* Fundamentals */}
          <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-4">
            <Skeleton className="h-4 w-40" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-background border border-border/40 p-3 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/40 bg-card p-5 space-y-3">
              <Skeleton className="h-4 w-32" />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MarketCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-4 space-y-3">
      <div className="flex justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
