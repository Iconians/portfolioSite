import { AdminProjectLoadError } from "./admin-project-load-error";

export interface PlatformCaseStudySlugListClient {
  listCaseStudies: (options?: { page?: number; limit?: number }) => Promise<{
    items: { id: string; slug: string }[];
  }>;
}

/**
 * Resolves a Platform case-study UUID from slug via admin list.
 * Portfolio-local UUIDs must never be passed here.
 */
export async function resolvePlatformCaseStudyIdBySlug(
  client: PlatformCaseStudySlugListClient,
  slug: string
): Promise<string> {
  const list = await client.listCaseStudies({ limit: 200 });
  const matches = list.items.filter((item) => item.slug === slug);
  if (matches.length === 0) {
    throw new AdminProjectLoadError(
      `No Platform case study found for slug "${slug}"`
    );
  }
  if (matches.length > 1) {
    throw new AdminProjectLoadError(
      `Ambiguous Platform case study slug match for "${slug}"`
    );
  }

  return matches[0].id;
}
