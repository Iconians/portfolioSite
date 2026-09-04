import "server-only";

import { mapPlatformApiDetail } from "@/lib/project-read/platform-api-mapper";

import {
  mapPlatformLifecycleToPortfolio,
  mapPlatformPublishStatusToPortfolio,
} from "./platform-admin-mapper";
import { resolvePlatformCaseStudyWriteContext } from "./platform-parent-context";

import type { PlatformApiAdminCaseStudyDetail } from "./platform-admin-types";
import type { PortfolioItem } from "@/lib/types/portfolio";

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

export async function publishPortfolioProjectViaPlatform(
  portfolioLocalId: string
): Promise<PortfolioItem> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  const detail = await context.client.publishCaseStudy(context.platformCaseStudyId);
  return mapPlatformAdminDetailToPortfolioItem(detail, context.portfolioLocalId);
}

export async function unpublishPortfolioProjectViaPlatform(
  portfolioLocalId: string
): Promise<PortfolioItem> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  const detail = await context.client.unpublishCaseStudy(context.platformCaseStudyId);
  return mapPlatformAdminDetailToPortfolioItem(detail, context.portfolioLocalId);
}

export async function archivePortfolioProjectViaPlatform(
  portfolioLocalId: string
): Promise<PortfolioItem> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  const detail = await context.client.archiveCaseStudy(context.platformCaseStudyId);
  return mapPlatformAdminDetailToPortfolioItem(detail, context.portfolioLocalId);
}
