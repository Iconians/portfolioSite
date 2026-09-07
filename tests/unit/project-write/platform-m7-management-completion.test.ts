import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

describe("M7 management completion regression", () => {
  test("shared-content Prisma writes remain frozen outside navigation bridge", () => {
    const projectWriteFiles = [
      "src/lib/project-write/platform-project-update.ts",
      "src/lib/project-write/platform-project-create.ts",
    ];

    for (const relativePath of projectWriteFiles) {
      const source = readFileSync(
        fileURLToPath(new URL(`../../../${relativePath}`, import.meta.url)),
        "utf8"
      );
      expect(source.includes("createPortfolioItem(")).toBe(false);
      expect(source.includes("updatePortfolioItem(")).toBe(false);
    }

    const updateAction = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio.ts", import.meta.url)
      ),
      "utf8"
    );
    const updateStart = updateAction.indexOf("export async function updatePortfolioAction");
    const deleteStart = updateAction.indexOf("export async function deletePortfolioAction");
    const updateBlock = updateAction.slice(updateStart, deleteStart);
    expect(updateBlock.includes("updatePortfolioProjectViaPlatform")).toBe(true);
    expect(updateBlock.includes("updatePortfolioItem(")).toBe(false);

    const bridgeSource = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/portfolio-navigation-bridge.ts",
          import.meta.url
        )
      ),
      "utf8"
    );
    expect(bridgeSource.includes("db.portfolio.create")).toBe(true);
  });

  test("lifecycle publish/unpublish/archive remain Platform-backed", () => {
    const lifecycleSource = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/platform-lifecycle-write.ts",
          import.meta.url
        )
      ),
      "utf8"
    );
    const actionsSource = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-lifecycle.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(lifecycleSource.includes("publishCaseStudy")).toBe(true);
    expect(lifecycleSource.includes("unpublishCaseStudy")).toBe(true);
    expect(lifecycleSource.includes("archiveCaseStudy")).toBe(true);
    expect(actionsSource.includes("publishPortfolioProjectViaPlatform")).toBe(true);
    expect(actionsSource.includes("unpublishPortfolioProjectViaPlatform")).toBe(true);
    expect(actionsSource.includes("unarchive")).toBe(false);
  });

  test("no CRM dependency in admin portfolio management path", () => {
    const files = [
      "src/lib/project-write/admin-portfolio-list.ts",
      "src/lib/project-write/admin-project-load.ts",
      "src/app/admin/portfolio/page.tsx",
    ];

    for (const relativePath of files) {
      const source = readFileSync(
        fileURLToPath(new URL(`../../../${relativePath}`, import.meta.url)),
        "utf8"
      );
      expect(source.includes("@/lib/crm")).toBe(false);
      expect(source.includes("marketing/case-studies")).toBe(false);
    }
  });

  test("M17 write-freeze preserved", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/provider.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("Legacy Prisma shared-content writes are frozen")).toBe(
      true
    );
  });

  test("M2 create path preserved", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/platform-project-create.ts",
          import.meta.url
        )
      ),
      "utf8"
    );
    expect(source.includes("createPortfolioNavigationBridge")).toBe(true);
    expect(source.includes("createCaseStudy")).toBe(true);
  });

  test("M3 metric/milestone reorder preserved", () => {
    const metrics = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-metrics.ts", import.meta.url)
      ),
      "utf8"
    );
    const versions = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-versions.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(metrics.includes("reorderPortfolioMetricsViaPlatform")).toBe(true);
    expect(versions.includes("reorderProjectVersionsViaPlatform")).toBe(true);
  });

  test("M4 gallery reorder preserved", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-media.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("reorderProjectGalleryMediaViaPlatform")).toBe(true);
  });

  test("M5 presentation management preserved", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/components/Admin/portfolio/sections/PresentationSection.tsx",
          import.meta.url
        )
      ),
      "utf8"
    );
    expect(source.includes("engineeringPortfolioIsFeatured")).toBe(true);
    expect(source.includes("devlaunchIsFeatured")).toBe(true);
  });

  test("M6 Engineering homepage featured preserved", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/portfolio/home-featured.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("pickPlatformEngineeringFeaturedProjects")).toBe(true);
  });

  test("production smoke checklist documented for operator", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../docs/phase-11/m7-management-completion-report.md",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("Production smoke checklist")).toBe(true);
    expect(source.includes("Cloudflare/R2")).toBe(true);
    expect(source.includes("`/projects`")).toBe(true);
    expect(source.includes("Engineering Portfolio homepage")).toBe(true);
  });
});
