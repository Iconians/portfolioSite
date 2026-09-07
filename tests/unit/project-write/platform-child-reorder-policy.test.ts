import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getMetricReorderPair } from "@/lib/portfolio/metric-order";
import { getVersionReorderPair } from "@/lib/portfolio/version-order";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import {
  PlatformChildReorderUnavailableError,
  shouldDisableChildReorder,
} from "@/lib/project-write/platform-child-reorder-policy";

describe("platform child reorder policy", () => {
  test("enables reorder controls in database mode", () => {
    expect(shouldDisableChildReorder("database")).toBe(false);
  });

  test("enables reorder controls in platform-api mode", () => {
    expect(shouldDisableChildReorder("platform-api")).toBe(false);
  });

  test("maps legacy reorder rejection to user-facing message", () => {
    expect(
      toPlatformProjectWriteUserMessage(new PlatformChildReorderUnavailableError())
    ).toBe(
      "Reordering is temporarily unavailable while Platform write migration is in progress."
    );
  });

  test("platform metric write module exports atomic reorder helper", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/platform-metric-write.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("reorderPortfolioMetricsViaPlatform")).toBe(true);
  });

  test("platform milestone write module exports atomic reorder helper", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/platform-milestone-write.ts",
          import.meta.url
        )
      ),
      "utf8"
    );
    expect(source.includes("reorderProjectVersionsViaPlatform")).toBe(true);
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
          showOnBusiness: true,
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
          showOnBusiness: true,
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
