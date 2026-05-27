import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const item = await db.watchlistItem.findUnique({
    where: { id },
    include: { watchlist: { select: { userId: true } } },
  });

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user || item.watchlist.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.watchlistItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
