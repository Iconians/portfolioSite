"use server";

import {
  createProjectVersion,
  deleteProjectVersion,
  reorderProjectVersion,
  updateProjectVersion,
} from "@/lib/portfolio/portfolio.service";
import { getProjectVersionById } from "@/lib/data/project-versions";
import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import type { ActionResult } from "@/lib/types/actions";
import type {
  ProjectVersion,
  ProjectVersionInput,
  ProjectVersionUpdate,
} from "@/lib/types/portfolio";
import {
  ProjectVersionInputSchema,
  ProjectVersionUpdateSchema,
} from "@/lib/types/portfolio";
import { revalidatePath } from "next/cache";
import { z } from "zod";

function toUserMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues.map((issue) => issue.message).join(", ");
  }

  return error instanceof Error ? error.message : "Something went wrong.";
}

function revalidatePortfolioPaths(portfolioId: string) {
  revalidatePath("/admin/portfolio");
  revalidatePath(`/admin/portfolio/${portfolioId}`);
  revalidatePath("/");
}

export async function createProjectVersionAction(
  portfolioId: string,
  input: ProjectVersionInput
): Promise<ActionResult<ProjectVersion>> {
  try {
    const user = await requireAdmin();
    const data = ProjectVersionInputSchema.parse(input);
    const version = await createProjectVersion(portfolioId, data);
    await logAdminAction(user.id, "create", "project_version", version.id, {
      portfolioId,
      title: version.title,
    }).catch(() => {});
    revalidatePortfolioPaths(portfolioId);
    return { success: true, data: version };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}

export async function updateProjectVersionAction(
  versionId: string,
  input: ProjectVersionUpdate
): Promise<ActionResult<ProjectVersion>> {
  try {
    const user = await requireAdmin();
    const data = ProjectVersionUpdateSchema.parse(input);
    const version = await updateProjectVersion(versionId, data);
    await logAdminAction(user.id, "update", "project_version", version.id, {
      portfolioId: version.portfolioId,
      title: version.title,
    }).catch(() => {});
    revalidatePortfolioPaths(version.portfolioId);
    return { success: true, data: version };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}

export async function deleteProjectVersionAction(
  versionId: string,
  portfolioId: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAdmin();
    const version = await getProjectVersionById(versionId);
    if (!version || version.portfolioId !== portfolioId) {
      throw new Error("Project version not found");
    }
    await deleteProjectVersion(versionId);
    await logAdminAction(user.id, "delete", "project_version", versionId, {
      portfolioId,
    }).catch(() => {});
    revalidatePortfolioPaths(portfolioId);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}

export async function reorderProjectVersionAction(
  versionId: string,
  portfolioId: string,
  direction: "up" | "down"
): Promise<ActionResult<ProjectVersion[]>> {
  try {
    await requireAdmin();
    const version = await getProjectVersionById(versionId);
    if (!version || version.portfolioId !== portfolioId) {
      throw new Error("Project version not found");
    }
    const versions = await reorderProjectVersion(versionId, direction);
    revalidatePortfolioPaths(portfolioId);
    return { success: true, data: versions };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}
