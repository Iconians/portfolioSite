import { mapPortfolioItemToEditorValues } from "@/lib/portfolio/project-editor";
import { mapPlatformApiDetail } from "@/lib/project-read/platform-api-mapper";
import { rewritePublicAssetUrlIfConfigured } from "@/lib/storage/public-asset-url";

import type {
  PlatformApiAdminCaseStudyDetail,
  PlatformApiAdminMediaListItem,
} from "./platform-admin-types";
import type { PlatformApiMediaItem } from "@/lib/project-read/platform-api-types";
import type {
  PortfolioGalleryItem,
  PortfolioItem,
  PortfolioMetric,
  ProjectEditorFormData,
  ProjectVersion,
} from "@/lib/types/portfolio";


/** Portfolio-local IDs retained only for Prisma mutation compatibility during M2B. */
export interface PortfolioMutationCompat {
  heroMediaId: string | null;
  ogMediaId: string | null;
  gallery: PortfolioGalleryItem[];
}

export interface AdminProjectEditorLoadResult {
  portfolioLocalId: string;
  platformCaseStudyId: string;
  caption: string;
  slug: string;
  initialValues: ProjectEditorFormData;
  initialOgImageUrl: string;
  initialMetrics: PortfolioMetric[];
  initialVersions: ProjectVersion[];
  /** Present in platform-api mode; documents mutation-only local IDs. */
  mutationCompat?: PortfolioMutationCompat;
}

export interface AdminProjectPreviewLoadResult {
  project: PortfolioItem;
  metrics: PortfolioMetric[];
  versions: ProjectVersion[];
}

export function mapPlatformLifecycleToPortfolio(
  lifecycleStatus: string | null | undefined
): PortfolioItem["lifecycleStatus"] {
  const normalized = lifecycleStatus?.trim().toLowerCase();
  if (normalized === "archived") {
    return "archived";
  }
  if (normalized === "sunset") {
    return "sunset";
  }
  if (normalized === "completed" || normalized === "active") {
    return "active";
  }
  return "active";
}

export function mapPlatformPublishStatusToPortfolio(
  publishStatus: string | null | undefined
): PortfolioItem["publishStatus"] {
  const normalized = publishStatus?.trim().toLowerCase();
  if (normalized === "draft") {
    return "draft";
  }
  if (normalized === "published") {
    return "published";
  }
  return "draft";
}

export function adminMediaToPublicMedia(
  media: PlatformApiAdminMediaListItem[]
): PlatformApiMediaItem[] {
  return [...media]
    .sort((left, right) => {
      const orderDiff = (left.sort_order ?? 0) - (right.sort_order ?? 0);
      if (orderDiff !== 0) {
        return orderDiff;
      }
      return left.id.localeCompare(right.id);
    })
    .map((item) => ({
      role: item.role,
      public_url: rewritePublicAssetUrlIfConfigured(item.public_url),
      alt_text: item.alt_text,
      caption: item.caption,
      mime_type: item.mime_type,
      width: item.width,
      height: item.height,
    }));
}

function resolveOgImageUrl(media: PlatformApiAdminMediaListItem[]): string {
  const og = media.find((item) => item.role === "og");
  if (og?.public_url) {
    return rewritePublicAssetUrlIfConfigured(og.public_url);
  }
  const hero = media.find((item) => item.role === "hero");
  return hero?.public_url
    ? rewritePublicAssetUrlIfConfigured(hero.public_url)
    : "";
}

export function mapPlatformAdminDetailToEditorLoad(input: {
  detail: PlatformApiAdminCaseStudyDetail;
  media: PlatformApiAdminMediaListItem[];
  portfolioLocalId: string;
  mutationCompat?: PortfolioMutationCompat;
}): AdminProjectEditorLoadResult {
  const mapped = mapPlatformApiDetail({
    ...input.detail,
    media: adminMediaToPublicMedia(input.media),
  });

  const project: PortfolioItem = {
    ...mapped.project,
    id: input.portfolioLocalId,
    lifecycleStatus: mapPlatformLifecycleToPortfolio(input.detail.lifecycle_status),
    publishStatus: mapPlatformPublishStatusToPortfolio(input.detail.publish_status),
    heroMediaId: null,
    ogMediaId: null,
    gallery: mapped.project.gallery.map((item) => ({
      url: item.url,
      alt: item.alt,
      caption: item.caption,
    })),
  };

  const initialMetrics = mapped.metrics.map((metric) => ({
    ...metric,
    portfolioId: input.portfolioLocalId,
  }));
  const initialVersions = mapped.versions.map((version) => ({
    ...version,
    portfolioId: input.portfolioLocalId,
  }));

  const initialValues = mapPortfolioItemToEditorValues(project);
  initialValues.img = rewritePublicAssetUrlIfConfigured(initialValues.img);
  if (input.mutationCompat) {
    initialValues.heroMediaId = input.mutationCompat.heroMediaId;
    initialValues.ogMediaId = input.mutationCompat.ogMediaId;
    initialValues.gallery = input.mutationCompat.gallery;
  } else {
    initialValues.heroMediaId = null;
    initialValues.ogMediaId = null;
  }

  return {
    portfolioLocalId: input.portfolioLocalId,
    platformCaseStudyId: input.detail.id,
    caption: project.caption,
    slug: project.slug ?? input.detail.slug,
    initialValues,
    initialOgImageUrl: resolveOgImageUrl(input.media),
    initialMetrics,
    initialVersions,
    ...(input.mutationCompat && { mutationCompat: input.mutationCompat }),
  };
}

export function mapPlatformAdminDetailToPreviewLoad(input: {
  detail: PlatformApiAdminCaseStudyDetail;
  media: PlatformApiAdminMediaListItem[];
  portfolioLocalId?: string;
}): AdminProjectPreviewLoadResult {
  const portfolioLocalId = input.portfolioLocalId ?? input.detail.slug;
  const editorLoad = mapPlatformAdminDetailToEditorLoad({
    detail: input.detail,
    media: input.media,
    portfolioLocalId,
  });

  const project: PortfolioItem = {
    ...mapPlatformApiDetail({
      ...input.detail,
      media: adminMediaToPublicMedia(input.media),
    }).project,
    id: portfolioLocalId,
    lifecycleStatus: mapPlatformLifecycleToPortfolio(input.detail.lifecycle_status),
    publishStatus: mapPlatformPublishStatusToPortfolio(input.detail.publish_status),
    heroMediaId: null,
    ogMediaId: null,
  };

  return {
    project,
    metrics: editorLoad.initialMetrics,
    versions: editorLoad.initialVersions,
  };
}
