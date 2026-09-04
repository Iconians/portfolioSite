"use server";

import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import { getProjectWriteSource } from "@/lib/project-write/config";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import {
  archivePortfolioProjectViaPlatform,
  publishPortfolioProjectViaPlatform,
  unpublishPortfolioProjectViaPlatform,
} from "@/lib/project-write/platform-lifecycle-write";
import {
  revalidateAfterPlatformProjectWrite,
} from "@/lib/project-write/public-project-cache";

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

    if (getProjectWriteSource() !== "platform-api") {
      return {
        success: false,
        error: "Publish is only available through Platform API lifecycle actions.",
      };
    }

    const item = await publishPortfolioProjectViaPlatform(portfolioId);
    await logAdminAction(user.id, "publish", "portfolio", portfolioId, {
      writeSource: "platform-api",
    }).catch(() => {});
    revalidateLifecyclePaths(portfolioId, item.slug);
    return { success: true, data: item };
  } catch (error) {
    if (getProjectWriteSource() === "platform-api") {
      return { success: false, error: toPlatformProjectWriteUserMessage(error) };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish project.",
    };
  }
}

export async function unpublishPortfolioProjectAction(
  portfolioId: string
): Promise<ActionResult<PortfolioItem>> {
  try {
    const user = await requireAdmin();

    if (getProjectWriteSource() !== "platform-api") {
      return {
        success: false,
        error: "Unpublish is only available through Platform API lifecycle actions.",
      };
    }

    const item = await unpublishPortfolioProjectViaPlatform(portfolioId);
    await logAdminAction(user.id, "unpublish", "portfolio", portfolioId, {
      writeSource: "platform-api",
    }).catch(() => {});
    revalidateLifecyclePaths(portfolioId, item.slug);
    return { success: true, data: item };
  } catch (error) {
    if (getProjectWriteSource() === "platform-api") {
      return { success: false, error: toPlatformProjectWriteUserMessage(error) };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unpublish project.",
    };
  }
}

export async function archivePortfolioProjectAction(
  portfolioId: string
): Promise<ActionResult<PortfolioItem>> {
  try {
    const user = await requireAdmin();

    if (getProjectWriteSource() !== "platform-api") {
      return {
        success: false,
        error: "Archive is only available through Platform API lifecycle actions.",
      };
    }

    const item = await archivePortfolioProjectViaPlatform(portfolioId);
    await logAdminAction(user.id, "archive", "portfolio", portfolioId, {
      writeSource: "platform-api",
    }).catch(() => {});
    revalidateLifecyclePaths(portfolioId, item.slug);
    return { success: true, data: item };
  } catch (error) {
    if (getProjectWriteSource() === "platform-api") {
      return { success: false, error: toPlatformProjectWriteUserMessage(error) };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to archive project.",
    };
  }
}
