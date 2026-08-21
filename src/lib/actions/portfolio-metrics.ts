"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getPortfolioMetricById } from "@/lib/data/portfolio-metrics";
import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import {
  createPortfolioMetric,
  deletePortfolioMetric,
  reorderPortfolioMetric,
  updatePortfolioMetric,
} from "@/lib/portfolio/portfolio.service";
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

function revalidatePortfolioPaths(portfolioId: string) {
  revalidatePath("/admin/portfolio");
  revalidatePath(`/admin/portfolio/${portfolioId}`);
  revalidatePath("/");
}

export async function createPortfolioMetricAction(
  portfolioId: string,
  input: PortfolioMetricInput
): Promise<ActionResult<PortfolioMetric>> {
  try {
    const user = await requireAdmin();
    const data = PortfolioMetricInputSchema.parse(input);
    const metric = await createPortfolioMetric(portfolioId, data);
    await logAdminAction(user.id, "create", "portfolio_metric", metric.id, {
      portfolioId,
      label: metric.label,
    }).catch(() => {});
    revalidatePortfolioPaths(portfolioId);
    return { success: true, data: metric };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}

export async function updatePortfolioMetricAction(
  metricId: string,
  input: PortfolioMetricUpdate
): Promise<ActionResult<PortfolioMetric>> {
  try {
    const user = await requireAdmin();
    const data = PortfolioMetricUpdateSchema.parse(input);
    const metric = await updatePortfolioMetric(metricId, data);
    await logAdminAction(user.id, "update", "portfolio_metric", metric.id, {
      portfolioId: metric.portfolioId,
      label: metric.label,
    }).catch(() => {});
    revalidatePortfolioPaths(metric.portfolioId);
    return { success: true, data: metric };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}

export async function deletePortfolioMetricAction(
  metricId: string,
  portfolioId: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAdmin();
    const metric = await getPortfolioMetricById(metricId);
    if (!metric || metric.portfolioId !== portfolioId) {
      throw new Error("Portfolio metric not found");
    }
    await deletePortfolioMetric(metricId);
    await logAdminAction(user.id, "delete", "portfolio_metric", metricId, {
      portfolioId,
    }).catch(() => {});
    revalidatePortfolioPaths(portfolioId);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}

export async function reorderPortfolioMetricAction(
  metricId: string,
  portfolioId: string,
  direction: "up" | "down"
): Promise<ActionResult<PortfolioMetric[]>> {
  try {
    await requireAdmin();
    const metric = await getPortfolioMetricById(metricId);
    if (!metric || metric.portfolioId !== portfolioId) {
      throw new Error("Portfolio metric not found");
    }
    const metrics = await reorderPortfolioMetric(metricId, direction);
    revalidatePortfolioPaths(portfolioId);
    return { success: true, data: metrics };
  } catch (error) {
    return { success: false, error: toUserMessage(error) };
  }
}
