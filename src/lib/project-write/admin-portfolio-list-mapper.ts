import {
  mapPlatformLifecycleToPortfolio,
  mapPlatformPublishStatusToPortfolio,
} from "./platform-admin-mapper";

import type { PlatformApiAdminCaseStudyListItem } from "./platform-admin-types";
import type { PortfolioItem } from "@/lib/types/portfolio";

/** List cards use Platform authority; hero is loaded in editor detail. */
const ADMIN_LIST_PLACEHOLDER_IMG = "/";

function parseOptionalDate(value: string | null | undefined): Date {
  if (!value) {
    return new Date(0);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

export function mapPlatformAdminListItemToPortfolioListRow(
  item: PlatformApiAdminCaseStudyListItem,
  portfolioLocalId: string
): PortfolioItem {
  const timestamp = parseOptionalDate(item.published_at);

  return {
    id: portfolioLocalId,
    img: ADMIN_LIST_PLACEHOLDER_IMG,
    caption: item.title,
    description: item.summary?.trim() ? item.summary : "Managed in Platform API.",
    category: (item.categories ?? []).map((category) => category.name),
    url: null,
    github: null,
    keyFeatures: null,
    role: null,
    highlights: (item.technologies ?? []).map((tech) => tech.name).join(" • ") || null,
    projectType: item.project_type ?? null,
    slug: item.slug,
    subtitle: item.subtitle ?? null,
    summary: item.summary ?? null,
    problem: null,
    solution: null,
    architecture: null,
    challenges: null,
    lessonsLearned: null,
    futureImprovements: null,
    lifecycleStatus: mapPlatformLifecycleToPortfolio(item.lifecycle_status),
    publishStatus: mapPlatformPublishStatusToPortfolio(item.publish_status),
    startDate: null,
    endDate: null,
    sortOrder: item.sort_order ?? 0,
    isFeatured: item.is_featured ?? false,
    gallery: [],
    features: [],
    responsibilities: [],
    showPlatformSection: false,
    platformFeatures: [],
    seoTitle: null,
    seoDescription: null,
    docs: null,
    heroMediaId: null,
    ogMediaId: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: "platform-api",
  };
}

export function sortAdminPortfolioListItems(items: PortfolioItem[]): PortfolioItem[] {
  return [...items].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    const leftSlug = left.slug ?? "";
    const rightSlug = right.slug ?? "";
    return leftSlug.localeCompare(rightSlug);
  });
}
