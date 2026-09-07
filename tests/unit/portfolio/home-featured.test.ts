import { describe, expect, test } from "bun:test";

import {
  HOME_FEATURED_SLUGS,
  pickHomeFeaturedProjects,
  pickPlatformEngineeringFeaturedProjects,
  pickRemainingPortfolioProjects,
} from "@/lib/portfolio/home-featured";

import type { PortfolioItem } from "@/lib/types/portfolio";

function buildProject(overrides: Partial<PortfolioItem> = {}): PortfolioItem {
  return {
    id: "project-1",
    caption: "Sample project",
    description: "Description for sample portfolio project",
    summary: null,
    img: "/img.png",
    url: null,
    github: null,
    docs: null,
    keyFeatures: null,
    role: null,
    highlights: null,
    projectType: "saas",
    subtitle: null,
    lifecycleStatus: "active",
    sortOrder: 0,
    seoTitle: null,
    seoDescription: null,
    heroMediaId: null,
    createdBy: "user-1",
    category: ["TypeScript"],
    gallery: [],
    features: [],
    responsibilities: [],
    platformFeatures: [],
    showPlatformSection: false,
    publishStatus: "published",
    slug: "sample",
    problem: null,
    solution: null,
    architecture: null,
    challenges: null,
    lessonsLearned: null,
    futureImprovements: null,
    startDate: null,
    endDate: null,
    ogMediaId: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    ...overrides,
  };
}

describe("home-featured", () => {
  describe("platform-api selection", () => {
    test("selects engineering_portfolio is_featured=true projects", () => {
      const featured = pickPlatformEngineeringFeaturedProjects([
        buildProject({ slug: "alpha", id: "1", isFeatured: true, sortOrder: 2 }),
        buildProject({ slug: "beta", id: "2", isFeatured: false, sortOrder: 1 }),
      ]);

      expect(featured.map((item) => item.slug)).toEqual(["alpha"]);
    });

    test("orders featured projects by engineering_portfolio sort_order ASC", () => {
      const featured = pickPlatformEngineeringFeaturedProjects([
        buildProject({ slug: "second", id: "2", isFeatured: true, sortOrder: 5 }),
        buildProject({ slug: "first", id: "1", isFeatured: true, sortOrder: 1 }),
      ]);

      expect(featured.map((item) => item.slug)).toEqual(["first", "second"]);
    });

    test("devlaunch featured state does not control Engineering homepage", () => {
      const featured = pickHomeFeaturedProjects(
        [
          buildProject({
            slug: "devlaunch-only-featured",
            id: "1",
            isFeatured: false,
            sortOrder: 0,
          }),
        ],
        "platform-api"
      );

      expect(featured).toEqual([]);
    });

    test("newly featured project not in legacy slug list can appear", () => {
      const featured = pickHomeFeaturedProjects(
        [
          buildProject({
            slug: "brand-new-platform-featured",
            id: "new",
            isFeatured: true,
            sortOrder: 0,
          }),
        ],
        "platform-api"
      );

      expect(featured.map((item) => item.slug)).toEqual(["brand-new-platform-featured"]);
    });

    test("historically hardcoded slug is excluded when not featured", () => {
      const featured = pickHomeFeaturedProjects(
        HOME_FEATURED_SLUGS.map((slug, index) =>
          buildProject({
            slug,
            id: `legacy-${index}`,
            isFeatured: false,
            sortOrder: index,
          })
        ),
        "platform-api"
      );

      expect(featured).toEqual([]);
    });
  });

  describe("database legacy selection", () => {
    test("returns curated slugs in order", () => {
      const items = HOME_FEATURED_SLUGS.map((slug, index) =>
        buildProject({ slug, id: `id-${index}`, caption: slug })
      );
      const extra = buildProject({
        slug: "tournament-registration-event-management-system",
        id: "extra",
      });

      const featured = pickHomeFeaturedProjects([...items, extra], "database");

      expect(featured.map((item) => item.slug)).toEqual([...HOME_FEATURED_SLUGS]);
    });

    test("omits missing slugs without throwing", () => {
      const items = [buildProject({ slug: "devlaunch-crm", id: "1" })];
      const featured = pickHomeFeaturedProjects(items, "database");

      expect(featured.length).toBe(1);
      expect(featured[0].slug).toBe("devlaunch-crm");
    });
  });

  test("splits remaining portfolio items", () => {
    const featured = pickHomeFeaturedProjects(
      HOME_FEATURED_SLUGS.map((slug, index) =>
        buildProject({ slug, id: `id-${index}`, isFeatured: true })
      ),
      "platform-api"
    );
    const extra = buildProject({
      slug: "tournament-registration-event-management-system",
      id: "extra",
    });
    const remaining = pickRemainingPortfolioProjects([...featured, extra], featured);

    expect(remaining.length).toBe(1);
    expect(remaining[0].slug).toBe(
      "tournament-registration-event-management-system"
    );
  });
});
