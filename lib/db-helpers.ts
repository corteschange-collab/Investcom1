import { db } from "@/lib/db";

// Finds or creates the User + default Watchlist in one go.
// Called at the start of every authenticated DB mutation.
export async function getOrCreateUser(clerkId: string, email?: string | null) {
  const user = await db.user.upsert({
    where: { clerkId },
    update: email ? { email } : {},
    create: {
      clerkId,
      email: email ?? `${clerkId}@unknown.invalid`,
      watchlists: {
        create: { name: "Minha Watchlist" },
      },
    },
    include: {
      watchlists: { take: 1, orderBy: { createdAt: "asc" } },
    },
  });

  // Guarantee a default watchlist exists (for users created before this code)
  if (user.watchlists.length === 0) {
    await db.watchlist.create({
      data: { userId: user.id, name: "Minha Watchlist" },
    });
    return db.user.findUniqueOrThrow({
      where: { id: user.id },
      include: { watchlists: { take: 1, orderBy: { createdAt: "asc" } } },
    });
  }

  return user;
}
