import "server-only";

import { getPortfolioItemById } from "@/lib/data/portfolio";

import { AdminProjectLoadError } from "./admin-project-load-error";
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
