import { describe, expect, test } from "bun:test";

import {
  hasProjectEvolution,
  sortProjectVersions,
} from "@/lib/portfolio/project-evolution";

import type { ProjectVersion } from "@/lib/types/portfolio";

function buildVersion(
  id: string,
  sortOrder: number,
  year: number,
  createdAt: string
): ProjectVersion {
  return {
    id,
    portfolioId: "portfolio-1",
    year,
    version: "v1.0",
    title: "Milestone",
    description: null,
    sortOrder,
    createdAt: new Date(createdAt),
    updatedAt: new Date(createdAt),
  };
}

describe("sortProjectVersions", () => {
  test("sorts by sortOrder, year, then createdAt", () => {
    const sorted = sortProjectVersions([
      buildVersion("b", 1, 2025, "2024-02-01T00:00:00.000Z"),
      buildVersion("a", 0, 2024, "2024-03-01T00:00:00.000Z"),
      buildVersion("c", 1, 2024, "2024-01-01T00:00:00.000Z"),
    ]);

    expect(sorted.map((version) => version.id)).toEqual(["a", "c", "b"]);
  });
});

describe("hasProjectEvolution", () => {
  test("returns false for empty arrays", () => {
    expect(hasProjectEvolution([])).toBe(false);
  });

  test("returns true when versions exist", () => {
    expect(
      hasProjectEvolution([buildVersion("a", 0, 2024, "2024-01-01T00:00:00.000Z")])
    ).toBe(true);
  });
});
