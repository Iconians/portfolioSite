import { createHash } from "crypto";

import { rewritePublicAssetUrlIfConfigured } from "@/lib/storage/public-asset-url";

import type {
  PlatformApiCaseStudyDetail,
  PlatformApiContentItem,
  PlatformApiLink,
  PlatformApiListItem,
  PlatformApiMediaItem,
  PlatformApiMetric,
  PlatformApiMilestone,
} from "./platform-api-types";
import type {
  PortfolioGalleryItem,
  PortfolioItem,
  PortfolioMetric,
  ProjectVersion,
} from "@/lib/types/portfolio";


function stablePortfolioId(slug: string): string {
  const digest = createHash("sha256").update(`platform-api:${slug}`).digest("hex");
  return [
    digest.slice(0, 8),
    digest.slice(8, 12),
    digest.slice(12, 16),
    digest.slice(16, 20),
    digest.slice(20, 32),
  ].join("-");
}

function stableChildId(slug: string, kind: string, index: number, label: string): string {
  const digest = createHash("sha256")
    .update(`platform-api:${slug}:${kind}:${index}:${label}`)
    .digest("hex");
  return [
    digest.slice(0, 8),
    digest.slice(8, 12),
    digest.slice(12, 16),
    digest.slice(16, 20),
    digest.slice(20, 32),
  ].join("-");
}

function parseOptionalDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function contentItemsByKind(
  items: PlatformApiContentItem[] | undefined,
  kind: string
): string[] {
  if (!items) {
    return [];
  }
  return items.filter((item) => item.kind === kind).map((item) => item.text);
}

function linkUrl(links: PlatformApiLink[] | undefined, linkType: string): string | null {
  const match = links?.find((link) => link.link_type === linkType);
  return match?.url ?? null;
}

function mediaByRole(
  media: PlatformApiMediaItem[] | undefined,
  role: string
): PlatformApiMediaItem | undefined {
  return media?.find((item) => item.role === role);
}

function mapGallery(
  media: PlatformApiMediaItem[] | undefined
): PortfolioGalleryItem[] {
  if (!media) {
    return [];
  }

  return media
    .filter((item) => item.role === "gallery")
    .map((item) => ({
      url: rewritePublicAssetUrlIfConfigured(item.public_url),
      alt: item.alt_text ?? undefined,
      caption: item.caption ?? undefined,
    }));
}

function joinTechnologiesAsHighlights(
  technologies: PlatformApiListItem["technologies"]
): string | null {
  if (!technologies?.length) {
    return null;
  }
  return technologies.map((item) => item.name).join(" • ");
}

function mapMetrics(
  slug: string,
  portfolioId: string,
  metrics: PlatformApiMetric[] | undefined,
  publishedAt: string | null | undefined
): PortfolioMetric[] {
  const timestamp = parseOptionalDate(publishedAt) ?? new Date(0);
  return (metrics ?? []).map((metric, index) => ({
    id: stableChildId(slug, "metric", index, metric.label),
    portfolioId,
    label: metric.label,
    value: metric.value,
    description: metric.description ?? null,
    displayOrder: index,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}

function mapMilestones(
  slug: string,
  portfolioId: string,
  milestones: PlatformApiMilestone[] | undefined,
  publishedAt: string | null | undefined
): ProjectVersion[] {
  const timestamp = parseOptionalDate(publishedAt) ?? new Date(0);
  return (milestones ?? []).map((milestone, index) => ({
    id: stableChildId(slug, "milestone", index, milestone.title),
    portfolioId,
    year: milestone.year ?? 0,
    version: milestone.version ?? "",
    title: milestone.title,
    description: milestone.description ?? null,
    sortOrder: index,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}

function mapStoryFields(detail: PlatformApiCaseStudyDetail) {
  const summary = detail.summary ?? null;
  return {
    subtitle: detail.subtitle ?? null,
    summary,
    problem: detail.problem ?? null,
    solution: detail.solution ?? null,
    architecture: detail.architecture ?? null,
    challenges: detail.challenges ?? null,
    lessonsLearned: detail.lessons_learned ?? null,
    futureImprovements: detail.future_improvements ?? null,
    description: summary ?? detail.problem ?? "",
  };
}

function buildPortfolioItemFromDetail(detail: PlatformApiCaseStudyDetail): PortfolioItem {
  const slug = detail.slug;
  const portfolioId = stablePortfolioId(slug);
  const hero = mediaByRole(detail.media, "hero");
  const capabilities = contentItemsByKind(detail.content_items, "capability");
  const publishedAt = parseOptionalDate(detail.published_at);
  const timestamp = publishedAt ?? new Date(0);
  const story = mapStoryFields(detail);

  return {
    id: portfolioId,
    img: rewritePublicAssetUrlIfConfigured(hero?.public_url ?? ""),
    caption: detail.title,
    description: story.description,
    category: (detail.categories ?? []).map((item) => item.name),
    url: linkUrl(detail.links, "live"),
    github: linkUrl(detail.links, "github"),
    keyFeatures: null,
    role: null,
    highlights: joinTechnologiesAsHighlights(detail.technologies),
    projectType: detail.project_type,
    slug,
    subtitle: story.subtitle,
    summary: story.summary,
    problem: story.problem,
    solution: story.solution,
    architecture: story.architecture,
    challenges: story.challenges,
    lessonsLearned: story.lessonsLearned,
    futureImprovements: story.futureImprovements,
    lifecycleStatus: detail.lifecycle_status,
    publishStatus: "published",
    startDate: parseOptionalDate(detail.start_date),
    endDate: parseOptionalDate(detail.end_date),
    sortOrder: 0,
    gallery: mapGallery(detail.media),
    features: contentItemsByKind(detail.content_items, "feature"),
    responsibilities: contentItemsByKind(detail.content_items, "responsibility"),
    showPlatformSection: capabilities.length > 0,
    platformFeatures: capabilities,
    seoTitle: detail.seo_title ?? null,
    seoDescription: detail.seo_description ?? null,
    docs: linkUrl(detail.links, "docs"),
    heroMediaId: null,
    ogMediaId: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: "platform-api",
  };
}

export function mapPlatformApiDetailToPortfolioItem(
  detail: PlatformApiCaseStudyDetail
): PortfolioItem {
  return buildPortfolioItemFromDetail(detail);
}

export function mapPlatformApiDetail(
  detail: PlatformApiCaseStudyDetail
): {
  project: PortfolioItem;
  metrics: PortfolioMetric[];
  versions: ProjectVersion[];
} {
  const project = mapPlatformApiDetailToPortfolioItem(detail);
  return {
    project,
    metrics: mapMetrics(
      detail.slug,
      project.id,
      detail.metrics,
      detail.published_at
    ),
    versions: mapMilestones(
      detail.slug,
      project.id,
      detail.milestones,
      detail.published_at
    ),
  };
}

export function mapPlatformApiListItemToPortfolioItem(
  item: PlatformApiListItem
): PortfolioItem {
  return mapPlatformApiDetailToPortfolioItem({
    ...item,
    content_version: 0,
    metrics: [],
    milestones: [],
    content_items: [],
    links: [],
    media: [],
  });
}
