"use server";

import {
  createArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
} from "@/lib/data/articles";
import { revalidatePath } from "next/cache";
import type {
  CreateArticleInput,
  UpdateArticleInput,
} from "@/lib/types/articles";
import { ArticleSchema } from "@/lib/types/articles";
import { z } from "zod";
import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import type { ActionResult } from "@/lib/types/actions";

export async function createArticleAction(
  data: CreateArticleInput
): Promise<ActionResult<Awaited<ReturnType<typeof createArticle>>>> {
  try {
    const user = await requireAdmin();
    const article = await createArticle(data);
    logAdminAction(user.id, "create", "article", article.id, {
      title: article.title,
    });
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${article.slug}`);
    return { success: true, data: article };
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
        error instanceof Error ? error.message : "Failed to create article",
    };
  }
}

export async function updateArticleAction(
  id: string,
  data: UpdateArticleInput
): Promise<ActionResult<Awaited<ReturnType<typeof updateArticle>>>> {
  try {
    const user = await requireAdmin();
    const article = await updateArticle(id, data);
    logAdminAction(user.id, "update", "article", article.id, {
      title: article.title,
    });
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${article.slug}`);
    return { success: true, data: article };
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
        error instanceof Error ? error.message : "Failed to update article",
    };
  }
}

export async function deleteArticleAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAdmin();
    await deleteArticle(id);
    logAdminAction(user.id, "delete", "article", id);
    revalidatePath("/blogs");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete article",
    };
  }
}

export async function publishArticleAction(
  id: string
): Promise<ActionResult<Awaited<ReturnType<typeof publishArticle>>>> {
  try {
    const user = await requireAdmin();
    const article = await publishArticle(id);
    logAdminAction(user.id, "publish", "article", article.id, {
      title: article.title,
    });
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${article.slug}`);
    return { success: true, data: article };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to publish article",
    };
  }
}
