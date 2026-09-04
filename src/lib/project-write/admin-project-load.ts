import "server-only";

import { getMediaAssetById } from "@/lib/data/media";
import { getPortfolioItemById } from "@/lib/data/portfolio";
import {
  listMetricsForPortfolio,
  listVersionsForPortfolio,
} from "@/lib/portfolio/portfolio.service";
import { mapPortfolioItemToEditorValues } from "@/lib/portfolio/project-editor";

import { AdminProjectLoadError } from "./admin-project-load-error";
import { getProjectWriteSource } from "./config";
import { resolvePlatformCaseStudyIdBySlug } from "./identity-bridge";
import {
  mapPlatformAdminDetailToEditorLoad,
  mapPlatformAdminDetailToPreviewLoad,
  type AdminProjectEditorLoadResult,
  type AdminProjectPreviewLoadResult,
} from "./platform-admin-mapper";
import { getProjectWriteProvider } from "./provider";

export async function loadAdminProjectEditorState(
  portfolioLocalId: string
): Promise<AdminProjectEditorLoadResult> {
  if (getProjectWriteSource() === "database") {
    return loadAdminProjectEditorStateFromDatabase(portfolioLocalId);
  }

  return loadAdminProjectEditorStateFromPlatform(portfolioLocalId);
}

async function loadAdminProjectEditorStateFromDatabase(
  portfolioLocalId: string
): Promise<AdminProjectEditorLoadResult> {
  const item = await getPortfolioItemById(portfolioLocalId);
  if (!item) {
    throw new AdminProjectLoadError("Portfolio project not found");
  }

  let initialOgImageUrl = "";
  if (item.ogMediaId) {
    const ogMedia = await getMediaAssetById(item.ogMediaId);
    initialOgImageUrl = ogMedia?.publicUrl ?? "";
  }

  const initialMetrics = await listMetricsForPortfolio(item.id);
  const initialVersions = await listVersionsForPortfolio(item.id);

  return {
    portfolioLocalId: item.id,
    platformCaseStudyId: "",
    caption: item.caption,
    slug: item.slug ?? "",
    initialValues: mapPortfolioItemToEditorValues(item),
    initialOgImageUrl,
    initialMetrics,
    initialVersions,
  };
}

async function loadAdminProjectEditorStateFromPlatform(
  portfolioLocalId: string
): Promise<AdminProjectEditorLoadResult> {
  const bridge = await getPortfolioItemById(portfolioLocalId);
  if (!bridge) {
    throw new AdminProjectLoadError("Portfolio project not found");
  }

  if (!bridge.slug?.trim()) {
    throw new AdminProjectLoadError(
      "Portfolio project is missing slug required for Platform admin load bridge"
    );
  }

  const provider = getProjectWriteProvider();
  if (provider.source !== "platform-api") {
    throw new AdminProjectLoadError(
      "Platform admin load requires PROJECT_WRITE_SOURCE=platform-api"
    );
  }

  const platformCaseStudyId = await resolvePlatformCaseStudyIdBySlug(
    provider.client,
    bridge.slug
  );
  const detail = await provider.client.getCaseStudyById(platformCaseStudyId);
  const media = await provider.client.listMedia({ caseStudyId: platformCaseStudyId });

  return mapPlatformAdminDetailToEditorLoad({
    detail,
    media: media.items,
    portfolioLocalId,
  });
}

export async function loadAdminProjectPreviewBySlug(
  slug: string
): Promise<AdminProjectPreviewLoadResult | null> {
  if (getProjectWriteSource() !== "platform-api") {
    return null;
  }

  const provider = getProjectWriteProvider();
  if (provider.source !== "platform-api") {
    return null;
  }

  try {
    const platformCaseStudyId = await resolvePlatformCaseStudyIdBySlug(
      provider.client,
      slug
    );
    const detail = await provider.client.getCaseStudyById(platformCaseStudyId);
    const media = await provider.client.listMedia({ caseStudyId: platformCaseStudyId });

    let portfolioLocalId = slug;
    const bridge = await getPortfolioItemBySlugForPreview(slug);
    if (bridge?.id) {
      portfolioLocalId = bridge.id;
    }

    return mapPlatformAdminDetailToPreviewLoad({
      detail,
      media: media.items,
      portfolioLocalId,
    });
  } catch (error) {
    if (error instanceof AdminProjectLoadError) {
      return null;
    }
    throw error;
  }
}

async function getPortfolioItemBySlugForPreview(slug: string) {
  const { getPortfolioItemBySlug } = await import("@/lib/data/portfolio");
  return getPortfolioItemBySlug(slug);
}
