import type { PortfolioItem } from "@/lib/types/portfolio";
import type { Metadata } from "next";

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

const PROJECT_TYPE_LABELS: Record<string, string> = {
  saas: "SaaS",
  client: "Client",
  engineering: "Engineering",
  personal: "Personal",
};

export function getProjectTypeLabel(
  projectType: string | null | undefined
): string | undefined {
  if (!projectType?.trim()) {
    return undefined;
  }

  return PROJECT_TYPE_LABELS[projectType] ?? projectType;
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

export function getSiteUrl(): string {
  const configured = process.env.NEXTAUTH_URL?.trim().replace(/\/$/, "");
  return configured || "https://www.clytoncripe.com";
}

export function toAbsoluteAssetUrl(url: string, siteUrl = getSiteUrl()): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${siteUrl}${url.startsWith("/") ? url : `/${url}`}`;
}

export function buildProjectPageMetadata(
  project: PortfolioItem,
  options?: {
    preview?: boolean;
    ogImageUrl?: string | null;
  }
): Metadata {
  const siteUrl = getSiteUrl();
  const slug = project.slug?.trim();
  const title = project.seoTitle?.trim() || project.caption;
  const description =
    project.seoDescription?.trim() ||
    project.summary?.trim() ||
    project.description;
  const ogImage = options?.ogImageUrl?.trim() || project.img;
  const isPreview = Boolean(options?.preview);
  const isDraft = project.publishStatus !== "published";

  return {
    title,
    description: description || undefined,
    alternates: slug ? { canonical: `${siteUrl}/projects/${slug}` } : undefined,
    robots:
      isPreview || isDraft
        ? { index: false, follow: false }
        : { index: true, follow: true },
    openGraph: {
      title,
      description: description || undefined,
      url: slug ? `${siteUrl}/projects/${slug}` : undefined,
      type: "article",
      images: ogImage
        ? [{ url: toAbsoluteAssetUrl(ogImage, siteUrl), alt: project.caption }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      images: ogImage ? [toAbsoluteAssetUrl(ogImage, siteUrl)] : undefined,
    },
  };
}
