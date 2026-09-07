import "server-only";

import { buildPlatformCreatePayload } from "./platform-create-payload";
import { PlatformProjectBridgeError } from "./platform-project-create-errors";
import { createPortfolioNavigationBridge } from "./portfolio-navigation-bridge";
import { getProjectWriteProvider } from "./provider";

import type { CreatePortfolioProjectInput } from "./create-portfolio-project-input";

export interface CreatePortfolioProjectResult {
  portfolioLocalId: string;
  platformCaseStudyId: string;
  slug: string;
  title: string;
}

export async function createPortfolioProjectViaPlatform(
  input: CreatePortfolioProjectInput
): Promise<CreatePortfolioProjectResult> {
  const provider = getProjectWriteProvider();
  if (provider.source !== "platform-api") {
    throw new Error(
      "Platform project creation requires PROJECT_WRITE_SOURCE=platform-api"
    );
  }

  const detail = await provider.client.createCaseStudy(
    buildPlatformCreatePayload(input)
  );

  const slug = detail.slug?.trim();
  if (!slug) {
    throw new Error("Platform API create response is missing slug");
  }

  const title = detail.title?.trim() || input.title.trim();

  try {
    const bridge = await createPortfolioNavigationBridge({
      slug,
      title,
      projectType: input.projectType,
    });

    return {
      portfolioLocalId: bridge.id,
      platformCaseStudyId: detail.id,
      slug,
      title,
    };
  } catch (error) {
    throw new PlatformProjectBridgeError(detail.id, slug, error);
  }
}
