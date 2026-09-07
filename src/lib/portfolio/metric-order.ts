import type { PortfolioMetric } from "@/lib/types/portfolio";

export type MetricReorderDirection = "up" | "down";

export function getMetricReorderPair(
  metrics: PortfolioMetric[],
  metricId: string,
  direction: MetricReorderDirection
): { current: PortfolioMetric; adjacent: PortfolioMetric } | null {
  const currentIndex = metrics.findIndex((metric) => metric.id === metricId);
  if (currentIndex === -1) {
    return null;
  }

  const adjacentIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (adjacentIndex < 0 || adjacentIndex >= metrics.length) {
    return null;
  }

  return {
    current: metrics[currentIndex],
    adjacent: metrics[adjacentIndex],
  };
}

export function applyMetricDirectionalReorder(
  metrics: PortfolioMetric[],
  metricId: string,
  direction: MetricReorderDirection
): PortfolioMetric[] | null {
  const pair = getMetricReorderPair(metrics, metricId, direction);
  if (!pair) {
    return null;
  }

  const currentIndex = metrics.findIndex((metric) => metric.id === metricId);
  const adjacentIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  const next = [...metrics];
  [next[currentIndex], next[adjacentIndex]] = [
    next[adjacentIndex],
    next[currentIndex],
  ];
  return next;
}
