"use server";

import { z } from "zod";

import { createPortfolioItem } from "@/lib/data/portfolio";
import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import { ProjectSourceConfigurationError } from "@/lib/project-source/errors";
import { getProjectWriteSource } from "@/lib/project-write/config";
import {
  CreatePortfolioProjectInputSchema,
  type CreatePortfolioProjectInput,
} from "@/lib/project-write/create-portfolio-project-input";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import { assertPlatformProjectCreateAllowed } from "@/lib/project-write/platform-create-policy";
import { PLATFORM_HARD_DELETE_UNAVAILABLE_MESSAGE } from "@/lib/project-write/platform-lifecycle-policy";
import { createPortfolioProjectViaPlatform } from "@/lib/project-write/platform-project-create";
import { updatePortfolioProjectViaPlatform } from "@/lib/project-write/platform-project-update";
import { revalidateAfterPlatformProjectWrite } from "@/lib/project-write/public-project-cache";

import type { ActionResult } from "@/lib/types/actions";
import type {
  CreatePortfolioInput,
  PortfolioExtendedInput,
  PortfolioItem,
  UpdatePortfolioInput,
} from "@/lib/types/portfolio";

function toUserMessage(error: unknown): string {
  if (error instanceof ProjectSourceConfigurationError) {
    return error.message;
  }
  if (error instanceof z.ZodError) {
    return error.issues.map((issue) => issue.message).join(", ");
  }
  const msg = error instanceof Error ? error.message : String(error);
  if (msg.includes("DATABASE_URL") || msg.includes("Can't reach database")) {
    return "Database is not configured. Add DATABASE_URL in Vercel → Project → Settings → Environment Variables, then redeploy.";
  }
  if (
    (msg.includes("connect") || msg.includes("ECONNREFUSED") || msg.includes("timeout") || msg.includes("too many connections")) &&
    process.env.DATABASE_URL?.includes("neon")
  ) {
    return "Database connection failed. On Vercel, use Neon’s Pooled connection string (Neon dashboard → Connection details → Pooled connection), not the Direct connection.";
  }
  return msg || "Something went wrong. Check the server logs.";
}

export async function createPortfolioAction(
  data: CreatePortfolioInput,
  extended?: PortfolioExtendedInput
): Promise<ActionResult<PortfolioItem>> {
  try {
    assertPlatformProjectCreateAllowed(getProjectWriteSource());
    const user = await requireAdmin();
    const item = await createPortfolioItem(data, extended);
    await logAdminAction(user.id, "create", "portfolio", item.id, {
      caption: item.caption,
      writeSource: "database",
    }).catch(() => {});
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}

export type CreatePortfolioProjectActionData = {
  portfolioLocalId: string;
  slug: string;
};

export async function createPortfolioProjectAction(
  input: CreatePortfolioProjectInput
): Promise<ActionResult<CreatePortfolioProjectActionData>> {
  try {
    const user = await requireAdmin();

    if (getProjectWriteSource() !== "platform-api") {
      return {
        success: false,
        error:
          "Platform project creation requires PROJECT_WRITE_SOURCE=platform-api.",
      };
    }

    const parsed = CreatePortfolioProjectInputSchema.parse(input);
    const created = await createPortfolioProjectViaPlatform({
      title: parsed.title,
      projectType: parsed.projectType,
      slug: parsed.slug?.trim() ? parsed.slug.trim() : undefined,
    });

    await logAdminAction(user.id, "create", "portfolio", created.portfolioLocalId, {
      slug: created.slug,
      platformCaseStudyId: created.platformCaseStudyId,
      writeSource: "platform-api",
    }).catch(() => {});

    return {
      success: true,
      data: {
        portfolioLocalId: created.portfolioLocalId,
        slug: created.slug,
      },
    };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}

export async function updatePortfolioAction(
  id: string,
  data: UpdatePortfolioInput,
  extended?: PortfolioExtendedInput
): Promise<ActionResult<PortfolioItem>> {
  try {
    const user = await requireAdmin();

    const item = await updatePortfolioProjectViaPlatform(
      id,
      data as CreatePortfolioInput,
      extended ?? {}
    );
    await logAdminAction(user.id, "update", "portfolio", id, {
      caption: item.caption,
      writeSource: "platform-api",
    }).catch(() => {});
    if (item.slug) {
      revalidateAfterPlatformProjectWrite(id, item.slug, "content");
    }
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}

export async function deletePortfolioAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    await requireAdmin();
    void id;
    return {
      success: false,
      error: PLATFORM_HARD_DELETE_UNAVAILABLE_MESSAGE,
    };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}
