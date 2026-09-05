"use server";

import { z } from "zod";

import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import { assertPlatformChildReorderAllowed } from "@/lib/project-write/platform-child-reorder-policy";
import {
  createPortfolioMetricViaPlatform,
  deletePortfolioMetricViaPlatform,
  updatePortfolioMetricViaPlatform,
} from "@/lib/project-write/platform-metric-write";
import {
  revalidateAdminProjectPaths,
  invalidatePublicProjectCacheForPortfolioId,
} from "@/lib/project-write/public-project-cache";
import {
  PortfolioMetricInputSchema,
  PortfolioMetricUpdateSchema,
} from "@/lib/types/portfolio";

import type { ActionResult } from "@/lib/types/actions";
import type {
  PortfolioMetric,
  PortfolioMetricInput,
  PortfolioMetricUpdate,
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

export async function createPortfolioMetricAction(
  portfolioId: string,
  input: PortfolioMetricInput
): Promise<ActionResult<PortfolioMetric>> {
  try {
    const user = await requireAdmin();
    const data = PortfolioMetricInputSchema.parse(input);

    const metric = await createPortfolioMetricViaPlatform(portfolioId, data);
    await logAdminAction(user.id, "create", "portfolio_metric", metric.id, {
      portfolioId,
      label: metric.label,
      writeSource: "platform-api",
    }).catch(() => {});
    await revalidatePlatformPortfolioPaths(portfolioId);
    return { success: true, data: metric };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}

export async function updatePortfolioMetricAction(
  metricId: string,
  input: PortfolioMetricUpdate,
  portfolioId: string
): Promise<ActionResult<PortfolioMetric>> {
  try {
    const user = await requireAdmin();
    const data = PortfolioMetricUpdateSchema.parse(input);

    const metric = await updatePortfolioMetricViaPlatform(
      portfolioId,
      metricId,
      data
    );
    await logAdminAction(user.id, "update", "portfolio_metric", metric.id, {
      portfolioId,
      label: metric.label,
      writeSource: "platform-api",
    }).catch(() => {});
    await revalidatePlatformPortfolioPaths(portfolioId);
    return { success: true, data: metric };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}

export async function deletePortfolioMetricAction(
  metricId: string,
  portfolioId: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAdmin();

    await deletePortfolioMetricViaPlatform(portfolioId, metricId);
    await logAdminAction(user.id, "delete", "portfolio_metric", metricId, {
      portfolioId,
      writeSource: "platform-api",
    }).catch(() => {});
    await revalidatePlatformPortfolioPaths(portfolioId);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}

export async function reorderPortfolioMetricAction(
  metricId: string,
  portfolioId: string,
  direction: "up" | "down"
): Promise<ActionResult<PortfolioMetric[]>> {
  try {
    await requireAdmin();
    void metricId;
    void portfolioId;
    void direction;
    assertPlatformChildReorderAllowed("platform-api");
    return { success: false, error: toUserMessage(new Error("Unreachable")) };
  } catch (error) {
    return { success: false, error: toPlatformProjectWriteUserMessage(error) };
  }
}
