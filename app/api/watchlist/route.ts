import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/db-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      watchlists: {
        include: { items: { orderBy: { addedAt: "desc" } } },
        take: 1,
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const items = user?.watchlists[0]?.items ?? [];
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const ticker = (body?.ticker ?? "").trim().toUpperCase();
  if (!ticker) return NextResponse.json({ error: "Missing ticker" }, { status: 400 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress;

  const user = await getOrCreateUser(userId, email);
  const watchlist = user.watchlists[0];

  const item = await db.watchlistItem.upsert({
    where: { watchlistId_ticker: { watchlistId: watchlist.id, ticker } },
    update: {},
    create: { watchlistId: watchlist.id, ticker },
  });

  return NextResponse.json({ item }, { status: 201 });
}
