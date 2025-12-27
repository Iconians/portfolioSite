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

export async function createPortfolioAction(
  data: CreatePortfolioInput
): Promise<ActionResult<Awaited<ReturnType<typeof createPortfolioItem>>>> {
  try {
    const user = await requireAdmin();
    const item = await createPortfolioItem(data);
    logAdminAction(user.id, "create", "portfolio", item.id, {
      caption: item.caption,
    });
    revalidatePath("/");
    return { success: true, data: item };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((issue) => issue.message).join(", "),
      };
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create portfolio item",
    };
  }
}

export async function updatePortfolioAction(
  id: string,
  data: UpdatePortfolioInput
): Promise<ActionResult<Awaited<ReturnType<typeof updatePortfolioItem>>>> {
  try {
    const user = await requireAdmin();
    const item = await updatePortfolioItem(id, data);
    logAdminAction(user.id, "update", "portfolio", item.id, {
      caption: item.caption,
    });
    revalidatePath("/");
    return { success: true, data: item };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((issue) => issue.message).join(", "),
      };
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update portfolio item",
    };
  }
}

export async function deletePortfolioAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAdmin();
    await deletePortfolioItem(id);
    logAdminAction(user.id, "delete", "portfolio", id);
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete portfolio item",
    };
  }
}
