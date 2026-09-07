import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  buildPublicProjectCacheInvalidationPlan,
  buildPublicProjectDetailPath,
  collectPublicProjectCachePaths,
} from "@/lib/project-write/public-project-cache-policy";

const SLUG = "engineering-featured-project";

describe("public project cache policy", () => {
  test("builds project detail path from canonical slug", () => {
    expect(buildPublicProjectDetailPath("devlaunch-crm")).toBe("/projects/devlaunch-crm");
  });

  test("platform-api content mutation invalidates detail and homepage", () => {
    const paths = collectPublicProjectCachePaths(SLUG, "content", {
      readSource: "platform-api",
    });
    expect(paths).toEqual([`/projects/${SLUG}`, "/"]);
  });

  test("database content mutation invalidates detail only", () => {
    const paths = collectPublicProjectCachePaths(SLUG, "content", {
      readSource: "database",
    });
    expect(paths).toEqual([`/projects/${SLUG}`]);
    expect(paths.includes("/")).toBe(false);
  });

  test("membership mutation always invalidates homepage", () => {
    const plan = buildPublicProjectCacheInvalidationPlan(SLUG, "membership", {
      readSource: "database",
    });
    expect(plan.homepagePath).toBe("/");
    expect(plan.projectDetailPath).toBe(`/projects/${SLUG}`);
  });

  test("slug precision keeps project A separate from project B", () => {
    const projectA = collectPublicProjectCachePaths("project-a", "content", {
      readSource: "database",
    });
    const projectB = collectPublicProjectCachePaths("project-b", "content", {
      readSource: "database",
    });

    expect(projectA).toEqual(["/projects/project-a"]);
    expect(projectB).toEqual(["/projects/project-b"]);
    expect(projectA.includes("/projects/project-b")).toBe(false);
  });

  test("platform-api homepage selection does not depend on HOME_FEATURED_SLUGS", () => {
    const portfolioSectionSource = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/components/PortfolioSection/PortfolioSection.tsx",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(portfolioSectionSource.includes("HOME_FEATURED_SLUGS")).toBe(false);
    expect(portfolioSectionSource.includes("getProjectReadSource")).toBe(true);
    expect(portfolioSectionSource.includes("pickHomeFeaturedProjects")).toBe(true);
  });
});
