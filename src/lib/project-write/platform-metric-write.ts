import "server-only";

import { AdminProjectLoadError } from "./admin-project-load-error";
import {
  buildPlatformMetricCreateRequest,
  buildPlatformMetricUpdateRequest,
  mapPlatformAdminMetricToPortfolio,
} from "./platform-metric-mapper";
import { resolvePlatformCaseStudyWriteContext } from "./platform-parent-context";

import type {
  PortfolioMetric,
  PortfolioMetricInput,
  PortfolioMetricUpdate,
} from "@/lib/types/portfolio";

function nextMetricSortOrder(metrics: { sort_order: number }[]): number {
  if (metrics.length === 0) {
    return 0;
  }
  return Math.max(...metrics.map((metric) => metric.sort_order)) + 1;
}

async function assertMetricBelongsToCaseStudy(
  context: Awaited<ReturnType<typeof resolvePlatformCaseStudyWriteContext>>,
  metricId: string
): Promise<void> {
  const detail = await context.client.getCaseStudyById(context.platformCaseStudyId);
  const owned = detail.metrics?.some((metric) => metric.id === metricId) ?? false;
  if (!owned) {
    throw new AdminProjectLoadError("Platform metric not found for this project");
  }
}

export async function createPortfolioMetricViaPlatform(
  portfolioLocalId: string,
  input: PortfolioMetricInput
): Promise<PortfolioMetric> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  const detail = await context.client.getCaseStudyById(context.platformCaseStudyId);
  const sortOrder =
    input.displayOrder ?? nextMetricSortOrder(detail.metrics ?? []);
  const created = await context.client.createMetric(
    context.platformCaseStudyId,
    buildPlatformMetricCreateRequest(input, sortOrder)
  );
  return mapPlatformAdminMetricToPortfolio(created, context.portfolioLocalId);
}

export async function updatePortfolioMetricViaPlatform(
  portfolioLocalId: string,
  metricId: string,
  input: PortfolioMetricUpdate
): Promise<PortfolioMetric> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  await assertMetricBelongsToCaseStudy(context, metricId);
  const updated = await context.client.updateMetric(
    metricId,
    buildPlatformMetricUpdateRequest(input)
  );
  return mapPlatformAdminMetricToPortfolio(updated, context.portfolioLocalId);
}

export async function deletePortfolioMetricViaPlatform(
  portfolioLocalId: string,
  metricId: string
): Promise<void> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  await assertMetricBelongsToCaseStudy(context, metricId);
  await context.client.deleteMetric(metricId);
}
