import type { Metadata } from "next";
import type { PortfolioItem } from "@/lib/types/portfolio";

export function canViewProjectDetail(item: PortfolioItem): boolean {
  return item.publishStatus === "published" && Boolean(item.slug?.trim());
}

export function getProjectDetailHref(slug: string): string {
  return `/projects/${slug}`;
}

export function isValidProjectLink(
  url: string | null | undefined
): url is string {
  return Boolean(url && url !== "#");
}

export function getProjectCardSummary(item: PortfolioItem): string {
  return item.summary?.trim() || item.description;
}

export function uniqueCategories(categories: string[]): string[] {
  const seen = new Set<string>();

  return categories.filter((category) => {
    const label = category.trim();
    if (!label || seen.has(label)) {
      return false;
    }

    seen.add(label);
    return true;
  });
}

export function buildProjectPageMetadata(project: PortfolioItem): Metadata {
  const title = project.seoTitle?.trim() || project.caption;
  const description =
    project.seoDescription?.trim() ||
    project.summary?.trim() ||
    project.description;

  return {
    title,
    description: description || undefined,
  };
}
