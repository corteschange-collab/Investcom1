import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/db-helpers";
import type { AlertType } from "@prisma/client";

export const dynamic = "force-dynamic";

const VALID_TYPES = new Set<AlertType>([
  "PRICE_ABOVE",
  "PRICE_BELOW",
  "RSI_ABOVE",
  "RSI_BELOW",
  "VOLUME_SPIKE",
  "TREND_CHANGE",
]);

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ alerts: [] });

  const alerts = await db.alert.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ alerts });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { ticker, type, value } = body ?? {};

  if (!ticker || !type || value === undefined) {
    return NextResponse.json({ error: "Missing fields: ticker, type, value" }, { status: 400 });
  }

  const upperType = String(type).toUpperCase() as AlertType;
  if (!VALID_TYPES.has(upperType)) {
    return NextResponse.json({ error: "Invalid alert type" }, { status: 400 });
  }

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return NextResponse.json({ error: "value must be a number" }, { status: 400 });
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress;
  const user = await getOrCreateUser(userId, email);

  const alert = await db.alert.create({
    data: {
      userId: user.id,
      ticker: String(ticker).toUpperCase(),
      type: upperType,
      value: numValue,
    },
  });

  return NextResponse.json({ alert }, { status: 201 });
}
