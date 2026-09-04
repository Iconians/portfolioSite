import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getMetricReorderPair } from "@/lib/portfolio/metric-order";
import { getVersionReorderPair } from "@/lib/portfolio/version-order";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import {
  assertPlatformChildReorderAllowed,
  PLATFORM_CHILD_REORDER_UNAVAILABLE_MESSAGE,
  PlatformChildReorderUnavailableError,
  shouldDisableChildReorder,
} from "@/lib/project-write/platform-child-reorder-policy";

describe("platform child reorder policy", () => {
  test("allows reorder in database mode", () => {
    expect(() => assertPlatformChildReorderAllowed("database")).not.toThrow();
    expect(shouldDisableChildReorder("database")).toBe(false);
  });

  test("rejects reorder in platform-api mode before any mutation", () => {
    expect(shouldDisableChildReorder("platform-api")).toBe(true);
    expect(() => assertPlatformChildReorderAllowed("platform-api")).toThrow(
      PLATFORM_CHILD_REORDER_UNAVAILABLE_MESSAGE
    );
  });

  test("maps reorder rejection to user-facing message", () => {
    expect(
      toPlatformProjectWriteUserMessage(new PlatformChildReorderUnavailableError())
    ).toBe(PLATFORM_CHILD_REORDER_UNAVAILABLE_MESSAGE);
  });

  test("platform metric write module does not export reorder helpers", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/platform-metric-write.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("reorderPortfolioMetricViaPlatform")).toBe(false);
  });

  test("platform milestone write module does not export reorder helpers", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/platform-milestone-write.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("reorderProjectVersionViaPlatform")).toBe(false);
  });

  test("database metric reorder pair selection remains available", () => {
    const pair = getMetricReorderPair(
      [
        {
          id: "metric-a",
          portfolioId: "portfolio-a",
          label: "A",
          value: "1",
          description: null,
          displayOrder: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "metric-b",
          portfolioId: "portfolio-a",
          label: "B",
          value: "2",
          description: null,
          displayOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      "metric-b",
      "up"
    );

    expect(pair?.current.id).toBe("metric-b");
    expect(pair?.adjacent.id).toBe("metric-a");
  });

  test("database milestone reorder pair selection remains available", () => {
    const pair = getVersionReorderPair(
      [
        {
          id: "version-a",
          portfolioId: "portfolio-a",
          year: 2024,
          version: "v1",
          title: "A",
          description: null,
          sortOrder: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "version-b",
          portfolioId: "portfolio-a",
          year: 2025,
          version: "v2",
          title: "B",
          description: null,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      "version-b",
      "up"
    );

    expect(pair?.current.id).toBe("version-b");
    expect(pair?.adjacent.id).toBe("version-a");
  });
});
