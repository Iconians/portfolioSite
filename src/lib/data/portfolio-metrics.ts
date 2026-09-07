import { db } from "@/lib/db/client";
import { requireAdmin } from "@/lib/permissions";
import {
  PortfolioMetricInputSchema,
  PortfolioMetricUpdateSchema,
} from "@/lib/types/portfolio";

import type {
  PortfolioMetric,
  PortfolioMetricInput,
  PortfolioMetricUpdate,
} from "@/lib/types/portfolio";

type PrismaPortfolioMetric = Omit<PortfolioMetric, "showOnBusiness">;

function mapPrismaPortfolioMetric(metric: PrismaPortfolioMetric): PortfolioMetric {
  return {
    ...metric,
    showOnBusiness: true,
  };
}

export async function listPortfolioMetrics(
  portfolioId: string
): Promise<PortfolioMetric[]> {
  await requireAdmin();
  const metrics = await db.portfolioMetric.findMany({
    where: { portfolioId },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });
  return metrics.map(mapPrismaPortfolioMetric);
}

export async function listPublicPortfolioMetrics(
  portfolioId: string
): Promise<PortfolioMetric[]> {
  const metrics = await db.portfolioMetric.findMany({
    where: { portfolioId },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });
  return metrics.map(mapPrismaPortfolioMetric);
}

export async function createPortfolioMetricRecord(
  portfolioId: string,
  input: PortfolioMetricInput
): Promise<PortfolioMetric> {
  await requireAdmin();
  const data = PortfolioMetricInputSchema.parse(input);

  return mapPrismaPortfolioMetric(
    await db.portfolioMetric.create({
      data: {
        portfolioId,
        label: data.label,
        value: data.value,
        description: data.description ?? null,
        displayOrder: data.displayOrder ?? 0,
      },
    })
  );
}

export async function updatePortfolioMetricRecord(
  id: string,
  input: PortfolioMetricUpdate
): Promise<PortfolioMetric> {
  await requireAdmin();
  const data = PortfolioMetricUpdateSchema.parse(input);

  const { showOnBusiness: _showOnBusiness, ...prismaData } = data;

  return mapPrismaPortfolioMetric(
    await db.portfolioMetric.update({
      where: { id },
      data: prismaData,
    })
  );
}

export async function deletePortfolioMetricRecord(id: string): Promise<void> {
  await requireAdmin();
  await db.portfolioMetric.delete({ where: { id } });
}

export async function getPortfolioMetricById(
  id: string
): Promise<PortfolioMetric | null> {
  await requireAdmin();
  const metric = await db.portfolioMetric.findUnique({ where: { id } });
  return metric ? mapPrismaPortfolioMetric(metric) : null;
}

export async function countPortfolioMetrics(portfolioId: string): Promise<number> {
  await requireAdmin();
  return db.portfolioMetric.count({ where: { portfolioId } });
}

export async function getNextPortfolioMetricDisplayOrder(
  portfolioId: string
): Promise<number> {
  await requireAdmin();
  const latest = await db.portfolioMetric.findFirst({
    where: { portfolioId },
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });

  return (latest?.displayOrder ?? -1) + 1;
}
