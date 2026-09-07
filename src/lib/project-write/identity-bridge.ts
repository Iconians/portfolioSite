import { AdminProjectLoadError } from "./admin-project-load-error";
import { listAllPlatformAdminCaseStudies } from "./platform-admin-list-pagination";

export interface PlatformCaseStudySlugListItem {
  id: string;
  slug: string;
  lifecycle_status?: string | null;
  archived_at?: string | null;
}

export interface PlatformCaseStudySlugListClient {
  listCaseStudies: (options?: { page?: number; limit?: number }) => Promise<{
    items: PlatformCaseStudySlugListItem[];
    total?: number;
    page?: number;
    limit?: number;
  }>;
}

/**
 * Resolves a Platform case-study UUID from slug via the admin list contract.
 * Paginates through admin results so identity resolution is not limited to page 1.
 * Portfolio-local UUIDs must never be passed here.
 */
export async function resolvePlatformCaseStudyIdBySlug(
  client: PlatformCaseStudySlugListClient,
  slug: string
): Promise<string> {
  const items = await listAllPlatformAdminCaseStudies(client);
  const matches = items.filter((item) => item.slug === slug);
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
