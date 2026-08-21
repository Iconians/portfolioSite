import { describe, expect, test } from "bun:test";
import {
  PortfolioMetricInputSchema,
  ProjectVersionInputSchema,
} from "@/lib/types/portfolio";

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
});

describe("ProjectVersionInputSchema", () => {
  test("accepts valid version input", () => {
    const result = ProjectVersionInputSchema.parse({
      year: 2026,
      version: "v2.0",
      title: "Portfolio Admin V2",
      description: "Schema foundation and media library",
      sortOrder: 1,
    });

    expect(result.year).toBe(2026);
    expect(result.version).toBe("v2.0");
  });

  test("rejects invalid year", () => {
    expect(() =>
      ProjectVersionInputSchema.parse({
        year: 1800,
        version: "v1",
        title: "Too old",
      })
    ).toThrow();
  });
});
