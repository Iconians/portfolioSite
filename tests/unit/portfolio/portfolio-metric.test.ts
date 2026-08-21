import { describe, expect, test } from "bun:test";

import { getMetricReorderPair } from "@/lib/portfolio/metric-order";
import { PortfolioMetricInputSchema } from "@/lib/types/portfolio";

import type { PortfolioMetric } from "@/lib/types/portfolio";

function buildMetric(
  id: string,
  displayOrder: number,
  label = "Metric"
): PortfolioMetric {
  return {
    id,
    portfolioId: "portfolio-1",
    label,
    value: "1",
    description: null,
    displayOrder,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  };
}

describe("PortfolioMetricInputSchema", () => {
  test("accepts valid metric input", () => {
    const result = PortfolioMetricInputSchema.parse({
      label: "Projects",
      value: "12",
      description: "Published portfolio projects",
      displayOrder: 0,
    });

    expect(result.label).toBe("Projects");
    expect(result.value).toBe("12");
  });

  test("rejects empty label", () => {
    expect(() =>
      PortfolioMetricInputSchema.parse({
        label: "",
        value: "12",
      })
    ).toThrow();
  });

  test("rejects empty value", () => {
    expect(() =>
      PortfolioMetricInputSchema.parse({
        label: "Projects",
        value: "",
      })
    ).toThrow();
  });
});

describe("getMetricReorderPair", () => {
  const metrics = [
    buildMetric("a", 0, "First"),
    buildMetric("b", 1, "Second"),
    buildMetric("c", 2, "Third"),
  ];

  test("returns adjacent metric when moving down", () => {
    const pair = getMetricReorderPair(metrics, "a", "down");
    expect(pair?.current.id).toBe("a");
    expect(pair?.adjacent.id).toBe("b");
  });

  test("returns adjacent metric when moving up", () => {
    const pair = getMetricReorderPair(metrics, "c", "up");
    expect(pair?.current.id).toBe("c");
    expect(pair?.adjacent.id).toBe("b");
  });

  test("returns null at list boundaries", () => {
    expect(getMetricReorderPair(metrics, "a", "up")).toBeNull();
    expect(getMetricReorderPair(metrics, "c", "down")).toBeNull();
  });
});
