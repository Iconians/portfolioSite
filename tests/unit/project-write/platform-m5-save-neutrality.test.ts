import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { buildPlatformCaseStudyPatchRequest } from "@/lib/project-write/platform-update-mapper";

describe("M5 normal save lifecycle neutrality", () => {
  test("M3 PATCH builder still omits lifecycle fields", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: {
        img: "https://cdn.example/hero.png",
        caption: "Title",
        description: "Desc",
        category: ["Next.js"],
        highlights: "PostgreSQL",
        projectType: "client",
      },
      extended: {
        lifecycleStatus: "archived",
        publishStatus: "draft",
      },
      originalSlug: "stable-slug",
    });

    expect("lifecycle_status" in patch).toBe(false);
    expect("publish_status" in patch).toBe(false);
    expect("archived_at" in patch).toBe(false);
  });

  test("platform lifecycle write module does not export create helpers", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/platform-lifecycle-write.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("createPortfolio")).toBe(false);
    expect(source.includes("updateCaseStudy")).toBe(false);
  });

  test("platform update module does not call lifecycle endpoints", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/platform-project-update.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("publishCaseStudy")).toBe(false);
    expect(source.includes("unpublishCaseStudy")).toBe(false);
    expect(source.includes("archiveCaseStudy")).toBe(false);
  });
});
