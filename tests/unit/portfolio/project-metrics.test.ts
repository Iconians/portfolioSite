import { describe, expect, test } from "bun:test";
import {
  hasProjectMetrics,
  sortPortfolioMetrics,
} from "@/lib/portfolio/project-metrics";
import type { PortfolioMetric } from "@/lib/types/portfolio";

function buildMetric(
  id: string,
  displayOrder: number,
  createdAt: string
): PortfolioMetric {
  return {
    id,
    portfolioId: "portfolio-1",
    label: "Metric",
    value: "1",
    description: null,
    displayOrder,
    createdAt: new Date(createdAt),
    updatedAt: new Date(createdAt),
  };
}

describe("sortPortfolioMetrics", () => {
  test("sorts by displayOrder then createdAt", () => {
    const sorted = sortPortfolioMetrics([
      buildMetric("b", 1, "2024-02-01T00:00:00.000Z"),
      buildMetric("a", 0, "2024-03-01T00:00:00.000Z"),
      buildMetric("c", 1, "2024-01-01T00:00:00.000Z"),
    ]);

    expect(sorted.map((metric) => metric.id)).toEqual(["a", "c", "b"]);
  });
});

describe("hasProjectMetrics", () => {
  test("returns false for empty arrays", () => {
    expect(hasProjectMetrics([])).toBe(false);
  });

  test("returns true when metrics exist", () => {
    expect(hasProjectMetrics([buildMetric("a", 0, "2024-01-01T00:00:00.000Z")])).toBe(
      true
    );
  });
});
