"use server";

import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import {
  archivePortfolioProjectViaPlatform,
  publishPortfolioProjectViaPlatform,
  unpublishPortfolioProjectViaPlatform,
} from "@/lib/project-write/platform-lifecycle-write";
import { revalidateAfterPlatformProjectWrite } from "@/lib/project-write/public-project-cache";

import type { ActionResult } from "@/lib/types/actions";
import type { PortfolioItem } from "@/lib/types/portfolio";

function revalidateLifecyclePaths(portfolioId: string, slug: string | null | undefined) {
  if (!slug) {
    return;
  }
  revalidateAfterPlatformProjectWrite(portfolioId, slug, "membership");
}

export async function publishPortfolioProjectAction(
  portfolioId: string
): Promise<ActionResult<PortfolioItem>> {
  try {
    const user = await requireAdmin();

    const item = await publishPortfolioProjectViaPlatform(portfolioId);
    await logAdminAction(user.id, "publish", "portfolio", portfolioId, {
      writeSource: "platform-api",
    }).catch(() => {});
    revalidateLifecyclePaths(portfolioId, item.slug);
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}

export async function unpublishPortfolioProjectAction(
  portfolioId: string
): Promise<ActionResult<PortfolioItem>> {
  try {
    const user = await requireAdmin();

    const item = await unpublishPortfolioProjectViaPlatform(portfolioId);
    await logAdminAction(user.id, "unpublish", "portfolio", portfolioId, {
      writeSource: "platform-api",
    }).catch(() => {});
    revalidateLifecyclePaths(portfolioId, item.slug);
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}

export async function archivePortfolioProjectAction(
  portfolioId: string
): Promise<ActionResult<PortfolioItem>> {
  try {
    const user = await requireAdmin();

    const item = await archivePortfolioProjectViaPlatform(portfolioId);
    await logAdminAction(user.id, "archive", "portfolio", portfolioId, {
      writeSource: "platform-api",
    }).catch(() => {});
    revalidateLifecyclePaths(portfolioId, item.slug);
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}
