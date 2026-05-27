import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getAlertForUser(id: string, clerkId: string) {
  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return null;
  const alert = await db.alert.findUnique({ where: { id } });
  if (!alert || alert.userId !== user.id) return null;
  return alert;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const alert = await getAlertForUser(id, userId);
  if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const updated = await db.alert.update({
    where: { id },
    data: { active: typeof body?.active === "boolean" ? body.active : !alert.active },
  });

  return NextResponse.json({ alert: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const alert = await getAlertForUser(id, userId);
  if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.alert.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
