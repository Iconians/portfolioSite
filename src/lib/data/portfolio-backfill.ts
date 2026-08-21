import { db } from "@/lib/db/client";
import { resolveUniquePortfolioSlug } from "@/lib/portfolio/assign-slug";

export async function listPortfolioItemsMissingSlug(): Promise<
  Array<{ id: string; caption: string }>
> {
  return db.portfolio.findMany({
    where: { slug: null },
    select: { id: true, caption: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function listPortfolioItemsForHeroMediaBackfill(): Promise<
  Array<{ id: string; img: string }>
> {
  return db.portfolio.findMany({
    where: {
      heroMediaId: null,
      NOT: { img: "" },
    },
    select: { id: true, img: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function setPortfolioSlug(id: string, slug: string): Promise<void> {
  await db.portfolio.update({
    where: { id },
    data: { slug },
  });
}

export async function setPortfolioHeroMediaId(
  id: string,
  heroMediaId: string
): Promise<void> {
  await db.portfolio.update({
    where: { id },
    data: { heroMediaId },
  });
}

export async function resolveHeroMediaIdFromPublicUrl(
  img: string
): Promise<string | null> {
  const asset = await db.mediaAsset.findFirst({
    where: { publicUrl: img },
    select: { id: true },
  });

  return asset?.id ?? null;
}

export async function backfillPortfolioSlugs(): Promise<number> {
  const items = await listPortfolioItemsMissingSlug();
  let updated = 0;

  for (const item of items) {
    const slug = await resolveUniquePortfolioSlug(item.caption, item.id);
    await setPortfolioSlug(item.id, slug);
    updated += 1;
  }

  return updated;
}

export async function backfillPortfolioHeroMediaIds(): Promise<number> {
  const items = await listPortfolioItemsForHeroMediaBackfill();
  let updated = 0;

  for (const item of items) {
    const heroMediaId = await resolveHeroMediaIdFromPublicUrl(item.img);
    if (!heroMediaId) {
      continue;
    }

    await setPortfolioHeroMediaId(item.id, heroMediaId);
    updated += 1;
  }

  return updated;
}
