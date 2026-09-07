import type { PortfolioItem } from "@/lib/types/portfolio";

/**
 * Legacy database-read homepage curation.
 * Not authoritative when `PROJECT_READ_SOURCE=platform-api`.
 */
export const HOME_FEATURED_SLUGS = [
  "devlaunch-crm",
  "intellitaskpro",
  "ghost-mammoth-pickle-ball",
  "engineering-portfolio-management-system",
] as const;

export type HomeFeaturedSlug = (typeof HOME_FEATURED_SLUGS)[number];

export type HomeFeaturedReadSource = "platform-api" | "database";

function compareEngineeringFeaturedOrder(
  left: PortfolioItem,
  right: PortfolioItem
): number {
  if (left.sortOrder !== right.sortOrder) {
    return left.sortOrder - right.sortOrder;
  }

  const leftSlug = left.slug ?? "";
  const rightSlug = right.slug ?? "";
  return leftSlug.localeCompare(rightSlug);
}

export function pickPlatformEngineeringFeaturedProjects(
  items: PortfolioItem[]
): PortfolioItem[] {
  return [...items]
    .filter((item) => item.isFeatured === true)
    .sort(compareEngineeringFeaturedOrder);
}

function pickLegacySlugFeaturedProjects(items: PortfolioItem[]): PortfolioItem[] {
  const bySlug = new Map<string, PortfolioItem>();

  for (const item of items) {
    if (item.slug) {
      bySlug.set(item.slug, item);
    }
  }

  return HOME_FEATURED_SLUGS
    .map((slug) => bySlug.get(slug))
    .filter((item): item is PortfolioItem => item !== undefined);
}

export function pickHomeFeaturedProjects(
  items: PortfolioItem[],
  readSource: HomeFeaturedReadSource = "database"
): PortfolioItem[] {
  if (readSource === "platform-api") {
    return pickPlatformEngineeringFeaturedProjects(items);
  }

  return pickLegacySlugFeaturedProjects(items);
}

export function pickRemainingPortfolioProjects(
  items: PortfolioItem[],
  featured: PortfolioItem[]
): PortfolioItem[] {
  const featuredIds = new Set(featured.map((item) => item.id));
  return items.filter((item) => !featuredIds.has(item.id));
}
