import type { PortfolioMetric } from "@/lib/types/portfolio";

export function sortPortfolioMetrics(
  metrics: PortfolioMetric[]
): PortfolioMetric[] {
  return [...metrics].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

export function hasProjectMetrics(metrics: PortfolioMetric[]): boolean {
  return metrics.length > 0;
}
