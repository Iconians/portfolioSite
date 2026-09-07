import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { PlatformProjectBridgeError } from "@/lib/project-write/platform-project-create-errors";

describe("M2 portfolio project creation", () => {
  test("createPortfolioProjectAction uses Platform create helper not Prisma item create", () => {
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

  test("navigation bridge writes only minimal fields", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/portfolio-navigation-bridge.ts",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("problem:")).toBe(false);
    expect(source.includes("summary:")).toBe(false);
    expect(source.includes("publishStatus: \"draft\"")).toBe(true);
    expect(source.includes("BRIDGE_PLACEHOLDER_DESCRIPTION")).toBe(true);
  });

  test("platform project create does not call CRM", () => {
    const files = [
      "src/lib/project-write/platform-project-create.ts",
      "src/lib/actions/portfolio.ts",
      "src/components/Admin/portfolio/CreateProjectForm.tsx",
    ];

    for (const relativePath of files) {
      const source = readFileSync(
        fileURLToPath(new URL(`../../../${relativePath}`, import.meta.url)),
        "utf8"
      );
      expect(source.toLowerCase().includes("devlaunch-crm")).toBe(false);
    }
  });

  test("bridge failure preserves Platform case study identity", () => {
    const error = new PlatformProjectBridgeError(
      "00000000-0000-4000-8000-000000000099",
      "bridge-failed-slug"
    );

    expect(error.platformCaseStudyId).toBe("00000000-0000-4000-8000-000000000099");
    expect(error.platformSlug).toBe("bridge-failed-slug");
    expect(error.message.includes("authoritative case study was preserved")).toBe(true);
    expect(error.message.toLowerCase().includes("delete")).toBe(false);
  });

  test("admin list restores Add Project for platform-api mode", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/app/admin/portfolio/page.tsx", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("Add Project")).toBe(true);
    expect(source.includes('href="/admin/portfolio/new"')).toBe(true);
    expect(source.includes("writeSource === \"platform-api\" ? undefined")).toBe(false);
  });

  test("CreateProjectForm keeps Platform credentials server-side", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/components/Admin/portfolio/CreateProjectForm.tsx",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("createPortfolioProjectAction")).toBe(true);
    expect(source.includes("PLATFORM_API")).toBe(false);
    expect(source.includes("Bearer")).toBe(false);
  });
});
