"use server";

import { z } from "zod";

import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import { ProjectSourceConfigurationError } from "@/lib/project-source/errors";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import { PLATFORM_PROJECT_CREATE_UNAVAILABLE_MESSAGE } from "@/lib/project-write/platform-create-policy";
import { PLATFORM_HARD_DELETE_UNAVAILABLE_MESSAGE } from "@/lib/project-write/platform-lifecycle-policy";
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
  _data: CreatePortfolioInput,
  _extended?: PortfolioExtendedInput
): Promise<ActionResult<PortfolioItem>> {
  try {
    await requireAdmin();
    return {
      success: false,
      error: PLATFORM_PROJECT_CREATE_UNAVAILABLE_MESSAGE,
    };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
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
