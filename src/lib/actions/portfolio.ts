"use server";

import {
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "@/lib/data/portfolio";
import { revalidatePath } from "next/cache";
import type {
  CreatePortfolioInput,
  UpdatePortfolioInput,
} from "@/lib/types/portfolio";
import { PortfolioItemSchema } from "@/lib/types/portfolio";
import { z } from "zod";
import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import type { ActionResult } from "@/lib/types/actions";

function toUserMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues.map((issue) => issue.message).join(", ");
  }
  const msg = error instanceof Error ? error.message : String(error);
  if (msg.includes("DATABASE_URL") || msg.includes("Can't reach database")) {
    return "Database is not configured. Add DATABASE_URL in Vercel → Project → Settings → Environment Variables, then redeploy.";
  }
  return msg || "Something went wrong. Check the server logs.";
}

export async function createPortfolioAction(
  data: CreatePortfolioInput
): Promise<ActionResult<Awaited<ReturnType<typeof createPortfolioItem>>>> {
  try {
    const user = await requireAdmin();
    const item = await createPortfolioItem(data);
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
  data: UpdatePortfolioInput
): Promise<ActionResult<Awaited<ReturnType<typeof updatePortfolioItem>>>> {
  try {
    const user = await requireAdmin();
    const item = await updatePortfolioItem(id, data);
    await logAdminAction(user.id, "update", "portfolio", item.id, {
      caption: item.caption,
    }).catch(() => {});
    revalidatePath("/");
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}

export async function deletePortfolioAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAdmin();
    await deletePortfolioItem(id);
    await logAdminAction(user.id, "delete", "portfolio", id).catch(() => {});
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}
