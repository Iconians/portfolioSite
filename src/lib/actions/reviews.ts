"use server";

import { createReview, updateReview, deleteReview } from "@/lib/data/reviews";
import { revalidatePath } from "next/cache";
import type { CreateReviewInput, UpdateReviewInput } from "@/lib/types/reviews";
import { ReviewSchema } from "@/lib/types/reviews";
import { z } from "zod";
import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import type { ActionResult } from "@/lib/types/actions";

export async function createReviewAction(
  data: CreateReviewInput
): Promise<ActionResult<Awaited<ReturnType<typeof createReview>>>> {
  try {
    const user = await requireAdmin();
    const review = await createReview(data);
    logAdminAction(user.id, "create", "review", review.id, {
      title: review.title,
    });
    revalidatePath("/");
    return { success: true, data: review };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((issue) => issue.message).join(", "),
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create review",
    };
  }
}

export async function updateReviewAction(
  id: string,
  data: UpdateReviewInput
): Promise<ActionResult<Awaited<ReturnType<typeof updateReview>>>> {
  try {
    const user = await requireAdmin();
    const review = await updateReview(id, data);
    logAdminAction(user.id, "update", "review", review.id, {
      title: review.title,
    });
    revalidatePath("/");
    return { success: true, data: review };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((issue) => issue.message).join(", "),
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update review",
    };
  }
}

export async function deleteReviewAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAdmin();
    await deleteReview(id);
    logAdminAction(user.id, "delete", "review", id);
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete review",
    };
  }
}
