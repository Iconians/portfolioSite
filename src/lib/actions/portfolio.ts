"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "@/lib/data/portfolio";
import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import { getProjectWriteSource } from "@/lib/project-write/config";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import { updatePortfolioProjectViaPlatform } from "@/lib/project-write/platform-project-update";

import type { ActionResult } from "@/lib/types/actions";
import type {
  CreatePortfolioInput,
  PortfolioExtendedInput,
  UpdatePortfolioInput,
} from "@/lib/types/portfolio";

function toUserMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues.map((issue) => issue.message).join(", ");
  }
  const msg = error instanceof Error ? error.message : String(error);
  if (msg.includes("DATABASE_URL") || msg.includes("Can't reach database")) {
    return "Database is not configured. Add DATABASE_URL in Vercel → Project → Settings → Environment Variables, then redeploy.";
  }
  // Neon + Vercel: connection failures often mean the direct URL is used instead of pooled
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
): Promise<ActionResult<Awaited<ReturnType<typeof createPortfolioItem>>>> {
  try {
    const user = await requireAdmin();
    const item = await createPortfolioItem(data, extended);
    await logAdminAction(user.id, "create", "portfolio", item.id, {
      caption: item.caption,
    }).catch(() => {});
    revalidatePath("/");
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}

export async function updatePortfolioAction(
  id: string,
  data: UpdatePortfolioInput,
  extended?: PortfolioExtendedInput
): Promise<ActionResult<Awaited<ReturnType<typeof updatePortfolioItem>>>> {
  try {
    const user = await requireAdmin();

    if (getProjectWriteSource() === "platform-api") {
      const item = await updatePortfolioProjectViaPlatform(
        id,
        data as CreatePortfolioInput,
        extended ?? {}
      );
      await logAdminAction(user.id, "update", "portfolio", id, {
        caption: item.caption,
        writeSource: "platform-api",
      }).catch(() => {});
      revalidatePath("/");
      revalidatePath("/admin/portfolio");
      revalidatePath(`/admin/portfolio/${id}`);
      return { success: true, data: item };
    }

    const item = await updatePortfolioItem(id, data, extended);
    await logAdminAction(user.id, "update", "portfolio", item.id, {
      caption: item.caption,
    }).catch(() => {});
    revalidatePath("/");
    return { success: true, data: item };
  } catch (error) {
    if (getProjectWriteSource() === "platform-api") {
      return { success: false, error: toPlatformProjectWriteUserMessage(error) };
    }
    return { success: false, error: toUserMessage(error) };
  }
}

export async function deletePortfolioAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAdmin();

    if (getProjectWriteSource() === "platform-api") {
      return {
        success: false,
        error:
          "Project delete is disabled while PROJECT_WRITE_SOURCE=platform-api. Platform archive/delete is deferred to a later milestone.",
      };
    }

    await deletePortfolioItem(id);
    await logAdminAction(user.id, "delete", "portfolio", id).catch(() => {});
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}
