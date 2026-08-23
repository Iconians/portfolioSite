import type { PortfolioItem } from "@/lib/types/portfolio";

/** Homepage curated featured projects (editorial override when sortOrder ties). */
export const HOME_FEATURED_SLUGS = [
  "devlaunch-crm",
  "intellitaskpro",
  "ghost-mammoth-pickle-ball",
  "engineering-portfolio-management-system",
] as const;

export type HomeFeaturedSlug = (typeof HOME_FEATURED_SLUGS)[number];

export function pickHomeFeaturedProjects(items: PortfolioItem[]): PortfolioItem[] {
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

export function pickRemainingPortfolioProjects(
  items: PortfolioItem[],
  featured: PortfolioItem[]
): PortfolioItem[] {
  const featuredIds = new Set(featured.map((item) => item.id));
  return items.filter((item) => !featuredIds.has(item.id));
}
