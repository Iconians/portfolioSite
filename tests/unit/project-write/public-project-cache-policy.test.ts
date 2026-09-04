import { describe, expect, test } from "bun:test";

import { HOME_FEATURED_SLUGS } from "@/lib/portfolio/home-featured";
import {
  buildPublicProjectCacheInvalidationPlan,
  buildPublicProjectDetailPath,
  collectPublicProjectCachePaths,
  isHomeFeaturedSlug,
} from "@/lib/project-write/public-project-cache-policy";

const FEATURED_SLUG = HOME_FEATURED_SLUGS[0];
const NON_FEATURED_SLUG = "non-featured-project-slug";

describe("public project cache policy", () => {
  test("builds project detail path from canonical slug", () => {
    expect(buildPublicProjectDetailPath("devlaunch-crm")).toBe("/projects/devlaunch-crm");
  });

  test("content mutation on featured slug invalidates detail and homepage", () => {
    const paths = collectPublicProjectCachePaths(FEATURED_SLUG, "content");
    expect(paths).toEqual(["/projects/devlaunch-crm", "/"]);
  });

  test("content mutation on non-featured slug invalidates detail only", () => {
    const paths = collectPublicProjectCachePaths(NON_FEATURED_SLUG, "content");
    expect(paths).toEqual([`/projects/${NON_FEATURED_SLUG}`]);
    expect(paths.includes("/")).toBe(false);
  });

  test("membership mutation always invalidates homepage", () => {
    const plan = buildPublicProjectCacheInvalidationPlan(NON_FEATURED_SLUG, "membership");
    expect(plan.homepagePath).toBe("/");
    expect(plan.projectDetailPath).toBe(`/projects/${NON_FEATURED_SLUG}`);
  });

  test("slug precision keeps project A separate from project B", () => {
    const projectA = collectPublicProjectCachePaths("project-a", "content");
    const projectB = collectPublicProjectCachePaths("project-b", "content");

    expect(projectA).toEqual(["/projects/project-a"]);
    expect(projectB).toEqual(["/projects/project-b"]);
    expect(projectA.includes("/projects/project-b")).toBe(false);
  });

  test("featured slug helper matches HOME_FEATURED_SLUGS", () => {
    expect(isHomeFeaturedSlug(FEATURED_SLUG)).toBe(true);
    expect(isHomeFeaturedSlug(NON_FEATURED_SLUG)).toBe(false);
  });
});
