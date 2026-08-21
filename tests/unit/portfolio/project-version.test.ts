import { describe, expect, test } from "bun:test";
import { getVersionReorderPair } from "@/lib/portfolio/version-order";
import { ProjectVersionInputSchema } from "@/lib/types/portfolio";
import type { ProjectVersion } from "@/lib/types/portfolio";

function buildVersion(
  id: string,
  sortOrder: number,
  title = "Milestone"
): ProjectVersion {
  return {
    id,
    portfolioId: "portfolio-1",
    year: 2024,
    version: "v1.0",
    title,
    description: null,
    sortOrder,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  };
}

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

  test("rejects empty title", () => {
    expect(() =>
      ProjectVersionInputSchema.parse({
        year: 2024,
        version: "v1",
        title: "",
      })
    ).toThrow();
  });
});

describe("getVersionReorderPair", () => {
  const versions = [
    buildVersion("a", 0, "First"),
    buildVersion("b", 1, "Second"),
    buildVersion("c", 2, "Third"),
  ];

  test("returns adjacent version when moving down", () => {
    const pair = getVersionReorderPair(versions, "a", "down");
    expect(pair?.current.id).toBe("a");
    expect(pair?.adjacent.id).toBe("b");
  });

  test("returns adjacent version when moving up", () => {
    const pair = getVersionReorderPair(versions, "c", "up");
    expect(pair?.current.id).toBe("c");
    expect(pair?.adjacent.id).toBe("b");
  });

  test("returns null at list boundaries", () => {
    expect(getVersionReorderPair(versions, "a", "up")).toBeNull();
    expect(getVersionReorderPair(versions, "c", "down")).toBeNull();
  });
});
