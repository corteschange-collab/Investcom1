import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/db-helpers";
import type { AlertType } from "@prisma/client";

export const dynamic = "force-dynamic";

interface LocalWatchlistItem {
  ticker: string;
  notes?: string;
}

interface LocalAlert {
  ticker: string;
  type: string;
  value: number;
  active: boolean;
}

const ALERT_TYPE_MAP: Record<string, AlertType> = {
  price_above: "PRICE_ABOVE",
  price_below: "PRICE_BELOW",
  rsi_above: "RSI_ABOVE",
  rsi_below: "RSI_BELOW",
};

// POST /api/user/sync
// Called once on login to migrate localStorage data to DB.
// Safe to call multiple times — upserts prevent duplicates.
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const watchlistItems: LocalWatchlistItem[] = Array.isArray(body?.watchlist)
    ? body.watchlist
    : [];
  const alertItems: LocalAlert[] = Array.isArray(body?.alerts) ? body.alerts : [];

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress;
  const name = clerkUser?.fullName ?? undefined;

  const user = await getOrCreateUser(userId, email);

  // Update name if available
  if (name) await db.user.update({ where: { id: user.id }, data: { name } });

  // Sync quiz profile from Clerk metadata
  const meta = clerkUser?.unsafeMetadata as Record<string, unknown> | undefined;
  if (meta?.investorProfile) {
    await db.user.update({
      where: { id: user.id },
      data: {
        investorProfile: meta.investorProfile as string,
        quizScores: (meta.quizScores as object) ?? undefined,
        quizCompletedAt: meta.quizCompletedAt
          ? new Date(meta.quizCompletedAt as string)
          : undefined,
        firstTicker: (meta.firstTicker as string) ?? undefined,
      },
    });
  }

  const watchlist = user.watchlists[0];

  // Upsert watchlist items
  const watchlistOps = watchlistItems
    .filter((i) => typeof i.ticker === "string" && i.ticker.trim())
    .map((i) =>
      db.watchlistItem.upsert({
        where: {
          watchlistId_ticker: {
            watchlistId: watchlist.id,
            ticker: i.ticker.toUpperCase(),
          },
        },
        update: {},
        create: {
          watchlistId: watchlist.id,
          ticker: i.ticker.toUpperCase(),
          notes: i.notes ?? null,
        },
      })
    );

  // Create alerts that don't exist yet (match by ticker+type+value)
  const alertOps = alertItems
    .filter((a) => ALERT_TYPE_MAP[a.type])
    .map(async (a) => {
      const dbType = ALERT_TYPE_MAP[a.type];
      const existing = await db.alert.findFirst({
        where: { userId: user.id, ticker: a.ticker.toUpperCase(), type: dbType, value: a.value },
      });
      if (existing) return existing;
      return db.alert.create({
        data: {
          userId: user.id,
          ticker: a.ticker.toUpperCase(),
          type: dbType,
          value: a.value,
          active: a.active,
        },
      });
    });

  const [watchlistResults, alertResults] = await Promise.all([
    Promise.all(watchlistOps),
    Promise.all(alertOps),
  ]);

  return NextResponse.json({
    ok: true,
    synced: {
      watchlistItems: watchlistResults.length,
      alerts: alertResults.length,
    },
  });
}
