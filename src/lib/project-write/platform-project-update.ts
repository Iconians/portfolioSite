import "server-only";

import { getPortfolioItemById } from "@/lib/data/portfolio";
import { mapPlatformApiDetail } from "@/lib/project-read/platform-api-mapper";

import { AdminProjectLoadError } from "./admin-project-load-error";
import { resolvePlatformCaseStudyIdBySlug } from "./identity-bridge";
import {
  mapPlatformLifecycleToPortfolio,
  mapPlatformPublishStatusToPortfolio,
} from "./platform-admin-mapper";
import { buildPlatformCaseStudyPatchRequest } from "./platform-update-mapper";
import { getProjectWriteProvider } from "./provider";

import type { PlatformApiAdminCaseStudyDetail } from "./platform-admin-types";
import type {
  CreatePortfolioInput,
  PortfolioExtendedInput,
  PortfolioItem,
} from "@/lib/types/portfolio";

function mapPlatformAdminDetailToPortfolioItem(
  detail: PlatformApiAdminCaseStudyDetail,
  portfolioLocalId: string
): PortfolioItem {
  const mapped = mapPlatformApiDetail(detail);
  return {
    ...mapped.project,
    id: portfolioLocalId,
    lifecycleStatus: mapPlatformLifecycleToPortfolio(detail.lifecycle_status),
    publishStatus: mapPlatformPublishStatusToPortfolio(detail.publish_status),
    heroMediaId: null,
    ogMediaId: null,
  };
}

export async function updatePortfolioProjectViaPlatform(
  portfolioLocalId: string,
  legacy: CreatePortfolioInput,
  extended: PortfolioExtendedInput
): Promise<PortfolioItem> {
  const bridge = await getPortfolioItemById(portfolioLocalId);
  if (!bridge) {
    throw new AdminProjectLoadError("Portfolio project not found");
  }
  if (!bridge.slug?.trim()) {
    throw new AdminProjectLoadError(
      "Portfolio project is missing slug required for Platform write bridge"
    );
  }

  const provider = getProjectWriteProvider();
  if (provider.source !== "platform-api") {
    throw new AdminProjectLoadError(
      "Platform project update requires PROJECT_WRITE_SOURCE=platform-api"
    );
  }

  const platformCaseStudyId = await resolvePlatformCaseStudyIdBySlug(
    provider.client,
    bridge.slug
  );
  const patch = buildPlatformCaseStudyPatchRequest({
    legacy,
    extended,
    originalSlug: bridge.slug,
  });
  const detail = await provider.client.updateCaseStudy(platformCaseStudyId, patch);

  return mapPlatformAdminDetailToPortfolioItem(detail, portfolioLocalId);
}
