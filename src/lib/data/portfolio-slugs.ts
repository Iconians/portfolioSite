import { db } from "@/lib/db/client";

export async function isPortfolioSlugTaken(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const existing = await db.portfolio.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!existing) {
    return false;
  }

  return excludeId ? existing.id !== excludeId : true;
}
