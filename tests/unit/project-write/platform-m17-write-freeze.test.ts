import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { resetCoherentProjectSourceConfigurationForTests } from "@/lib/project-source/coherence";
import { getProjectWriteSource } from "@/lib/project-write/config";
import {
  isLegacySharedContentWriteSource,
  LEGACY_SHARED_CONTENT_WRITE_FROZEN_MESSAGE,
} from "@/lib/project-write/platform-write-freeze-policy";

describe("P11-M17 legacy shared-content write freeze", () => {
  test("database write source is rejected by coherence policy", () => {
    const snapshot = {
      PROJECT_READ_SOURCE: process.env.PROJECT_READ_SOURCE,
      PROJECT_WRITE_SOURCE: process.env.PROJECT_WRITE_SOURCE,
    };
    process.env.PROJECT_READ_SOURCE = "database";
    process.env.PROJECT_WRITE_SOURCE = "database";
    resetCoherentProjectSourceConfigurationForTests();

    expect(() => getProjectWriteSource()).toThrow(LEGACY_SHARED_CONTENT_WRITE_FROZEN_MESSAGE);

    process.env.PROJECT_READ_SOURCE = snapshot.PROJECT_READ_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = snapshot.PROJECT_WRITE_SOURCE;
    resetCoherentProjectSourceConfigurationForTests();
  });

  test("platform-api write source remains selectable with database read rollback", () => {
    const snapshot = {
      PROJECT_READ_SOURCE: process.env.PROJECT_READ_SOURCE,
      PROJECT_WRITE_SOURCE: process.env.PROJECT_WRITE_SOURCE,
    };
    process.env.PROJECT_READ_SOURCE = "database";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    resetCoherentProjectSourceConfigurationForTests();

    expect(getProjectWriteSource()).toBe("platform-api");

    process.env.PROJECT_READ_SOURCE = snapshot.PROJECT_READ_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = snapshot.PROJECT_WRITE_SOURCE;
    resetCoherentProjectSourceConfigurationForTests();
  });

  test("legacy shared write source helper classifies database", () => {
    expect(isLegacySharedContentWriteSource("database")).toBe(true);
    expect(isLegacySharedContentWriteSource("platform-api")).toBe(false);
  });

  test("createPortfolioAction blocks legacy full editor create on platform-api", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("assertPlatformProjectCreateAllowed")).toBe(true);
    expect(source.includes("createPortfolioProjectViaPlatform")).toBe(true);
  });

  test("createPortfolioProjectAction does not invoke Prisma create", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio.ts", import.meta.url)
      ),
      "utf8"
    );

    const fnStart = source.indexOf("export async function createPortfolioProjectAction");
    const fnEnd = source.indexOf("export async function updatePortfolioAction");
    const createBlock = source.slice(fnStart, fnEnd);

    expect(createBlock.includes("createPortfolioProjectViaPlatform")).toBe(true);
    expect(createBlock.includes("createPortfolioItem")).toBe(false);
  });

  test("updatePortfolioAction routes only through Platform update helper", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("updatePortfolioProjectViaPlatform")).toBe(true);
    expect(source.includes("updatePortfolioItem")).toBe(false);
  });

  test("portfolio metrics action routes platform writes through Platform helpers", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-metrics.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("createPortfolioMetricViaPlatform")).toBe(true);
    expect(source.includes("createPortfolioMetric(")).toBe(false);
    expect(source.includes("reorderPortfolioMetricsViaPlatform")).toBe(true);
    expect(source.includes("updatePortfolioMetric(")).toBe(false);
  });

  test("admin project editor load no longer has Prisma editor branch", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/admin-project-load.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("loadAdminProjectEditorStateFromDatabase")).toBe(false);
    expect(source.includes("resolvePlatformCaseStudyIdBySlug")).toBe(true);
  });
});
