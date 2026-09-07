import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  PlatformApiAdminNetworkError,
  PlatformApiAdminResponseError,
} from "@/lib/project-write/errors";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import { shouldDisableChildReorder } from "@/lib/project-write/platform-child-reorder-policy";

const PLATFORM_CASE_STUDY_ID = "00000000-0000-4000-8000-000000000001";

function readSource(relativePath: string): string {
  return readFileSync(
    fileURLToPath(new URL(`../../../${relativePath}`, import.meta.url)),
    "utf8"
  );
}

describe("M3 metric and milestone atomic reorder", () => {
  test("metric reorder controls are enabled in platform-api mode", () => {
    expect(shouldDisableChildReorder("platform-api")).toBe(false);
  });

  test("milestone reorder controls are enabled in platform-api mode", () => {
    expect(shouldDisableChildReorder("database")).toBe(false);
  });

  test("metric reorder action uses Platform atomic helper", () => {
    const source = readSource("src/lib/actions/portfolio-metrics.ts");
    const fnStart = source.indexOf("export async function reorderPortfolioMetricAction");
    const block = source.slice(fnStart, source.indexOf("}", source.lastIndexOf("toPlatformProjectWriteUserMessage")));

    expect(block.includes("reorderPortfolioMetricsViaPlatform")).toBe(true);
    expect(block.includes("updateMetric(")).toBe(false);
    expect(source.includes("reorderPortfolioMetric")).toBe(true);
  });

  test("milestone reorder action uses Platform atomic helper", () => {
    const source = readSource("src/lib/actions/portfolio-versions.ts");
    const block = source.slice(
      source.indexOf("export async function reorderProjectVersionAction"),
      source.length
    );

    expect(block.includes("reorderProjectVersionsViaPlatform")).toBe(true);
    expect(block.includes("reorderMilestones(")).toBe(false);
    expect(block.includes("updateMilestone(")).toBe(false);
    expect(block.includes("reorderProjectVersion(")).toBe(true);
  });

  test("metric reorder writes complete ordered_ids to Platform", () => {
    const source = readSource("src/lib/project-write/platform-metric-write.ts");
    const fnStart = source.indexOf("export async function reorderPortfolioMetricsViaPlatform");
    const block = source.slice(fnStart);

    expect(block.includes("buildChildReorderOrderedIds")).toBe(true);
    expect(block.includes("reorderMetrics")).toBe(true);
    expect(block.includes("resolvePlatformCaseStudyWriteContext")).toBe(true);
    expect(block.includes("updateMetric")).toBe(false);
  });

  test("milestone reorder writes complete ordered_ids to Platform", () => {
    const source = readSource("src/lib/project-write/platform-milestone-write.ts");
    const fnStart = source.indexOf("export async function reorderProjectVersionsViaPlatform");
    const block = source.slice(fnStart);

    expect(block.includes("buildChildReorderOrderedIds")).toBe(true);
    expect(block.includes("reorderMilestones")).toBe(true);
    expect(block.includes("resolvePlatformCaseStudyWriteContext")).toBe(true);
    expect(block.includes("updateMilestone")).toBe(false);
  });

  test("Platform child client exposes atomic reorder endpoints", () => {
    const source = readSource("src/lib/project-write/platform-api-admin-child-client.ts");

    expect(source.includes("/metrics/reorder")).toBe(true);
    expect(source.includes("/milestones/reorder")).toBe(true);
    expect(source.includes("PlatformApiChildReorderRequest")).toBe(true);
    expect(source.includes('method: "PUT"')).toBe(true);
  });

  test("MetricEditor keeps reorder on server action boundary", () => {
    const source = readSource("src/components/Admin/portfolio/MetricEditor.tsx");

    expect(source.includes("reorderPortfolioMetricAction")).toBe(true);
    expect(source.includes("DEVLAUNCH_PLATFORM")).toBe(false);
    expect(source.includes("Bearer")).toBe(false);
    expect(source.includes("setMetrics(previous)")).toBe(true);
  });

  test("ProjectEvolutionEditor keeps reorder on server action boundary", () => {
    const source = readSource("src/components/Admin/portfolio/ProjectEvolutionEditor.tsx");

    expect(source.includes("reorderProjectVersionAction")).toBe(true);
    expect(source.includes("DEVLAUNCH_PLATFORM")).toBe(false);
    expect(source.includes("setVersions(previous)")).toBe(true);
  });

  test("gallery reorder is enabled in platform-api mode", () => {
    const source = readSource("src/lib/project-write/platform-media-reorder-policy.ts");

    expect(source.includes("shouldDisableGalleryReorder")).toBe(true);
    expect(source.includes("return false")).toBe(true);
  });

  test("reorder path does not call CRM", () => {
    const files = [
      "src/lib/actions/portfolio-metrics.ts",
      "src/lib/actions/portfolio-versions.ts",
      "src/lib/project-write/platform-metric-write.ts",
      "src/lib/project-write/platform-milestone-write.ts",
    ];

    for (const file of files) {
      expect(readSource(file).toLowerCase().includes("devlaunch-crm")).toBe(false);
    }
  });

  test("maps 422 stale exact-set failure for reorder", () => {
    const message = toPlatformProjectWriteUserMessage(
      new PlatformApiAdminResponseError(422, "Validation failed", {
        detail: "ordered_ids must include every current metric id",
        operation: "reorderMetrics",
      })
    );

    expect(message.includes("ordered_ids")).toBe(true);
  });

  test("maps authorization failure for reorder", () => {
    const message = toPlatformProjectWriteUserMessage(
      new PlatformApiAdminResponseError(403, "Forbidden", {
        operation: "reorderMilestones",
      })
    );

    expect(message.includes("authorization failed")).toBe(true);
  });

  test("maps network failure for reorder", () => {
    const message = toPlatformProjectWriteUserMessage(
      new PlatformApiAdminNetworkError("fetch failed")
    );

    expect(message.includes("Platform API request failed")).toBe(true);
  });
});

describe("M3 PlatformApiAdminClient reorder requests", () => {
  test("issues atomic metric reorder PUT", async () => {
    const { PlatformApiAdminClient } = await import(
      "@/lib/project-write/platform-api-admin-client"
    );

    let requestedUrl = "";
    let requestInit: RequestInit | undefined;
    const client = new PlatformApiAdminClient({
      baseUrl: "https://api.devlaunchsystems.com",
      token: "test-token",
      fetchImpl: async (input, init) => {
        requestedUrl = String(input);
        requestInit = init;
        return new Response(null, { status: 204 });
      },
    });

    await client.reorderMetrics(PLATFORM_CASE_STUDY_ID, [
      "00000000-0000-4000-8000-000000000010",
      "00000000-0000-4000-8000-000000000011",
    ]);

    expect(requestedUrl).toBe(
      `https://api.devlaunchsystems.com/api/v1/admin/case-studies/${PLATFORM_CASE_STUDY_ID}/metrics/reorder`
    );
    expect(requestInit?.method).toBe("PUT");
    expect(requestInit?.body).toBe(
      JSON.stringify({
        ordered_ids: [
          "00000000-0000-4000-8000-000000000010",
          "00000000-0000-4000-8000-000000000011",
        ],
      })
    );
    expect(String(requestInit?.headers).includes("test-token")).toBe(false);
  });

  test("issues atomic milestone reorder PUT", async () => {
    const { PlatformApiAdminClient } = await import(
      "@/lib/project-write/platform-api-admin-client"
    );

    let requestedUrl = "";
    let requestInit: RequestInit | undefined;
    const client = new PlatformApiAdminClient({
      baseUrl: "https://api.devlaunchsystems.com",
      token: "test-token",
      fetchImpl: async (input, init) => {
        requestedUrl = String(input);
        requestInit = init;
        return new Response(null, { status: 204 });
      },
    });

    await client.reorderMilestones(PLATFORM_CASE_STUDY_ID, [
      "00000000-0000-4000-8000-000000000020",
      "00000000-0000-4000-8000-000000000021",
    ]);

    expect(requestedUrl).toBe(
      `https://api.devlaunchsystems.com/api/v1/admin/case-studies/${PLATFORM_CASE_STUDY_ID}/milestones/reorder`
    );
    expect(requestInit?.method).toBe("PUT");
    expect(requestInit?.body).toBe(
      JSON.stringify({
        ordered_ids: [
          "00000000-0000-4000-8000-000000000020",
          "00000000-0000-4000-8000-000000000021",
        ],
      })
    );
  });
});
