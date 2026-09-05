"use server";

import { z } from "zod";

import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import { assertPlatformChildReorderAllowed } from "@/lib/project-write/platform-child-reorder-policy";
import {
  createProjectVersionViaPlatform,
  deleteProjectVersionViaPlatform,
  updateProjectVersionViaPlatform,
} from "@/lib/project-write/platform-milestone-write";
import {
  revalidateAdminProjectPaths,
  invalidatePublicProjectCacheForPortfolioId,
} from "@/lib/project-write/public-project-cache";
import {
  ProjectVersionInputSchema,
  ProjectVersionUpdateSchema,
} from "@/lib/types/portfolio";

import type { ActionResult } from "@/lib/types/actions";
import type {
  ProjectVersion,
  ProjectVersionInput,
  ProjectVersionUpdate,
} from "@/lib/types/portfolio";

function toUserMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues.map((issue) => issue.message).join(", ");
  }

  return error instanceof Error ? error.message : "Something went wrong.";
}

async function revalidatePlatformPortfolioPaths(portfolioId: string) {
  revalidateAdminProjectPaths(portfolioId);
  await invalidatePublicProjectCacheForPortfolioId(portfolioId, "content");
}

export async function createProjectVersionAction(
  portfolioId: string,
  input: ProjectVersionInput
): Promise<ActionResult<ProjectVersion>> {
  try {
    const user = await requireAdmin();
    const data = ProjectVersionInputSchema.parse(input);

    const version = await createProjectVersionViaPlatform(portfolioId, data);
    await logAdminAction(user.id, "create", "project_version", version.id, {
      portfolioId,
      title: version.title,
      writeSource: "platform-api",
    }).catch(() => {});
    await revalidatePlatformPortfolioPaths(portfolioId);
    return { success: true, data: version };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}

export async function updateProjectVersionAction(
  versionId: string,
  input: ProjectVersionUpdate,
  portfolioId: string
): Promise<ActionResult<ProjectVersion>> {
  try {
    const user = await requireAdmin();
    const data = ProjectVersionUpdateSchema.parse(input);

    const version = await updateProjectVersionViaPlatform(
      portfolioId,
      versionId,
      data
    );
    await logAdminAction(user.id, "update", "project_version", version.id, {
      portfolioId,
      title: version.title,
      writeSource: "platform-api",
    }).catch(() => {});
    await revalidatePlatformPortfolioPaths(portfolioId);
    return { success: true, data: version };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}

export async function deleteProjectVersionAction(
  versionId: string,
  portfolioId: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAdmin();

    await deleteProjectVersionViaPlatform(portfolioId, versionId);
    await logAdminAction(user.id, "delete", "project_version", versionId, {
      portfolioId,
      writeSource: "platform-api",
    }).catch(() => {});
    await revalidatePlatformPortfolioPaths(portfolioId);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}

export async function reorderProjectVersionAction(
  versionId: string,
  portfolioId: string,
  direction: "up" | "down"
): Promise<ActionResult<ProjectVersion[]>> {
  try {
    await requireAdmin();
    void versionId;
    void portfolioId;
    void direction;
    assertPlatformChildReorderAllowed("platform-api");
    return { success: false, error: toUserMessage(new Error("Unreachable")) };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}
