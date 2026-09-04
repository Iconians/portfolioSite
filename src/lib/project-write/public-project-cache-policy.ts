import { HOME_FEATURED_SLUGS } from "@/lib/portfolio/home-featured";

export type PublicProjectCacheInvalidationReason = "content" | "membership";

export interface PublicProjectCacheInvalidationPlan {
  projectDetailPath: string;
  homepagePath: string | null;
}

export function buildPublicProjectDetailPath(slug: string): string {
  return `/projects/${slug}`;
}

export function isHomeFeaturedSlug(slug: string): boolean {
  return (HOME_FEATURED_SLUGS as readonly string[]).includes(slug);
}

export function buildPublicProjectCacheInvalidationPlan(
  slug: string,
  reason: PublicProjectCacheInvalidationReason
): PublicProjectCacheInvalidationPlan {
  const invalidateHomepage =
    reason === "membership" || isHomeFeaturedSlug(slug);

  return {
    projectDetailPath: buildPublicProjectDetailPath(slug),
    homepagePath: invalidateHomepage ? "/" : null,
  };
}

export function collectPublicProjectCachePaths(
  slug: string,
  reason: PublicProjectCacheInvalidationReason
): string[] {
  const plan = buildPublicProjectCacheInvalidationPlan(slug, reason);
  const paths = [plan.projectDetailPath];
  if (plan.homepagePath) {
    paths.push(plan.homepagePath);
  }
  return paths;
}
