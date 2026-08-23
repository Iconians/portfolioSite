import { describe, expect, test } from "bun:test";

import {
  HOME_FEATURED_SLUGS,
  pickHomeFeaturedProjects,
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
  test("returns curated slugs in order", () => {
    const items = HOME_FEATURED_SLUGS.map((slug, index) =>
      buildProject({ slug, id: `id-${index}`, caption: slug })
    );
    const extra = buildProject({
      slug: "tournament-registration-event-management-system",
      id: "extra",
    });

    const featured = pickHomeFeaturedProjects([...items, extra]);

    expect(featured.map((item) => item.slug)).toEqual([...HOME_FEATURED_SLUGS]);
  });

  test("omits missing slugs without throwing", () => {
    const items = [buildProject({ slug: "devlaunch-crm", id: "1" })];
    const featured = pickHomeFeaturedProjects(items);

    expect(featured.length).toBe(1);
    expect(featured[0].slug).toBe("devlaunch-crm");
  });

  test("splits remaining portfolio items", () => {
    const featured = pickHomeFeaturedProjects(
      HOME_FEATURED_SLUGS.map((slug, index) =>
        buildProject({ slug, id: `id-${index}` })
      )
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
