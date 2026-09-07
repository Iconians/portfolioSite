import type { HomeFeaturedReadSource } from "@/lib/portfolio/home-featured";

export type PublicProjectCacheInvalidationReason = "content" | "membership";

export interface PublicProjectCacheInvalidationPlan {
  projectDetailPath: string;
  homepagePath: string | null;
}

export function buildPublicProjectDetailPath(slug: string): string {
  return `/projects/${slug}`;
}

export function buildPublicProjectCacheInvalidationPlan(
  slug: string,
  reason: PublicProjectCacheInvalidationReason,
  options?: { readSource?: HomeFeaturedReadSource }
): PublicProjectCacheInvalidationPlan {
  const invalidateHomepage =
    reason === "membership" ||
    (reason === "content" && options?.readSource === "platform-api");

  return {
    projectDetailPath: buildPublicProjectDetailPath(slug),
    homepagePath: invalidateHomepage ? "/" : null,
  };
}

export function collectPublicProjectCachePaths(
  slug: string,
  reason: PublicProjectCacheInvalidationReason,
  options?: { readSource?: HomeFeaturedReadSource }
): string[] {
  const plan = buildPublicProjectCacheInvalidationPlan(slug, reason, options);
  const paths = [plan.projectDetailPath];
  if (plan.homepagePath) {
    paths.push(plan.homepagePath);
  }
  return paths;
}
