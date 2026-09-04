import "server-only";

import { getPortfolioItemById } from "@/lib/data/portfolio";

import { AdminProjectLoadError } from "./admin-project-load-error";
import { resolvePlatformCaseStudyIdBySlug } from "./identity-bridge";
import { getProjectWriteProvider } from "./provider";

import type { PlatformApiAdminClient } from "./platform-api-admin-client";

export interface PlatformCaseStudyWriteContext {
  portfolioLocalId: string;
  slug: string;
  platformCaseStudyId: string;
  client: PlatformApiAdminClient;
}

export async function resolvePlatformCaseStudyWriteContext(
  portfolioLocalId: string
): Promise<PlatformCaseStudyWriteContext> {
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
      "Platform child write requires PROJECT_WRITE_SOURCE=platform-api"
    );
  }

  const platformCaseStudyId = await resolvePlatformCaseStudyIdBySlug(
    provider.client,
    bridge.slug
  );

  return {
    portfolioLocalId,
    slug: bridge.slug,
    platformCaseStudyId,
    client: provider.client,
  };
}
