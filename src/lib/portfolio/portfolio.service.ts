import {
  countPortfolioMetrics,
  createPortfolioMetricRecord,
  deletePortfolioMetricRecord,
  getNextPortfolioMetricDisplayOrder,
  getPortfolioMetricById,
  listPortfolioMetrics,
  updatePortfolioMetricRecord,
} from "@/lib/data/portfolio-metrics";
import {
  countProjectVersions,
  createProjectVersionRecord,
  deleteProjectVersionRecord,
  getNextProjectVersionSortOrder,
  getProjectVersionById,
  listProjectVersions,
  updateProjectVersionRecord,
} from "@/lib/data/project-versions";
import { getPortfolioItemById } from "@/lib/data/portfolio";
export {
  assignPortfolioSlug,
  resolveUniquePortfolioSlug,
} from "@/lib/portfolio/assign-slug";
export { validatePortfolioExtendedInput } from "@/lib/portfolio/validate-extended";
import type {
  PortfolioMetric,
  PortfolioMetricInput,
  PortfolioMetricUpdate,
  ProjectVersion,
  ProjectVersionInput,
  ProjectVersionUpdate,
} from "@/lib/types/portfolio";

export async function createPortfolioMetric(
  portfolioId: string,
  input: PortfolioMetricInput
): Promise<PortfolioMetric> {
  const portfolio = await getPortfolioItemById(portfolioId);
  if (!portfolio) {
    throw new Error("Portfolio item not found");
  }

  const displayOrder =
    input.displayOrder ?? (await getNextPortfolioMetricDisplayOrder(portfolioId));

  return createPortfolioMetricRecord(portfolioId, {
    ...input,
    displayOrder,
  });
}

export async function updatePortfolioMetric(
  metricId: string,
  input: PortfolioMetricUpdate
): Promise<PortfolioMetric> {
  const metric = await getPortfolioMetricById(metricId);
  if (!metric) {
    throw new Error("Portfolio metric not found");
  }

  return updatePortfolioMetricRecord(metricId, input);
}

export async function deletePortfolioMetric(metricId: string): Promise<void> {
  const metric = await getPortfolioMetricById(metricId);
  if (!metric) {
    throw new Error("Portfolio metric not found");
  }

  await deletePortfolioMetricRecord(metricId);
}

export async function listMetricsForPortfolio(
  portfolioId: string
): Promise<PortfolioMetric[]> {
  const portfolio = await getPortfolioItemById(portfolioId);
  if (!portfolio) {
    throw new Error("Portfolio item not found");
  }

  return listPortfolioMetrics(portfolioId);
}

export async function createProjectVersion(
  portfolioId: string,
  input: ProjectVersionInput
): Promise<ProjectVersion> {
  const portfolio = await getPortfolioItemById(portfolioId);
  if (!portfolio) {
    throw new Error("Portfolio item not found");
  }

  const sortOrder =
    input.sortOrder ?? (await getNextProjectVersionSortOrder(portfolioId));

  return createProjectVersionRecord(portfolioId, {
    ...input,
    sortOrder,
  });
}

export async function updateProjectVersion(
  versionId: string,
  input: ProjectVersionUpdate
): Promise<ProjectVersion> {
  const version = await getProjectVersionById(versionId);
  if (!version) {
    throw new Error("Project version not found");
  }

  return updateProjectVersionRecord(versionId, input);
}

export async function deleteProjectVersion(versionId: string): Promise<void> {
  const version = await getProjectVersionById(versionId);
  if (!version) {
    throw new Error("Project version not found");
  }

  await deleteProjectVersionRecord(versionId);
}

export async function listVersionsForPortfolio(
  portfolioId: string
): Promise<ProjectVersion[]> {
  const portfolio = await getPortfolioItemById(portfolioId);
  if (!portfolio) {
    throw new Error("Portfolio item not found");
  }

  return listProjectVersions(portfolioId);
}

export async function getPortfolioMetricCount(portfolioId: string): Promise<number> {
  return countPortfolioMetrics(portfolioId);
}

export async function getProjectVersionCount(portfolioId: string): Promise<number> {
  return countProjectVersions(portfolioId);
}
