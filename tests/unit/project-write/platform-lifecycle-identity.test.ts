import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PLATFORM_CASE_STUDY_ID = "00000000-0000-4000-8000-000000000001";
const PORTFOLIO_LOCAL_ID = "11111111-1111-4111-8111-111111111111";

describe("platform lifecycle identity routing", () => {
  test("lifecycle write resolves Platform UUID via parent context", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/platform-lifecycle-write.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("resolvePlatformCaseStudyWriteContext")).toBe(true);
    expect(source.includes("context.platformCaseStudyId")).toBe(true);
    expect(source.includes(PORTFOLIO_LOCAL_ID)).toBe(false);
    expect(source.includes(PLATFORM_CASE_STUDY_ID)).toBe(false);
  });

  test("lifecycle client methods require Platform UUID path segment", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/platform-api-admin-client.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("/publish")).toBe(true);
    expect(source.includes("/unpublish")).toBe(true);
    expect(source.includes("/archive")).toBe(true);
    expect(source.includes("encodeURIComponent(id)")).toBe(true);
  });
});
