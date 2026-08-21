import { describe, expect, test } from "bun:test";

import {
  formatProjectDateRange,
  getProjectStoryListItems,
  getProjectStorySections,
  hasProjectStoryContent,
} from "@/lib/portfolio/project-story";

import type { PortfolioItem } from "@/lib/types/portfolio";

function createPortfolioItem(
  overrides: Partial<PortfolioItem> = {}
): PortfolioItem {
  return {
    id: "project-1",
    img: "/images/project.png",
    caption: "Sample Project",
    description: "Legacy description",
    category: ["Next.js"],
    url: "https://example.com",
    github: "https://github.com/example/repo",
    keyFeatures: null,
    role: null,
    highlights: null,
    projectType: "engineering",
    slug: "sample-project",
    subtitle: null,
    summary: null,
    problem: null,
    solution: null,
    architecture: null,
    challenges: null,
    lessonsLearned: null,
    futureImprovements: null,
    lifecycleStatus: "active",
    publishStatus: "published",
    startDate: null,
    endDate: null,
    sortOrder: 0,
    gallery: [],
    features: [],
    responsibilities: [],
    showPlatformSection: false,
    platformFeatures: [],
    seoTitle: null,
    seoDescription: null,
    docs: null,
    heroMediaId: null,
    ogMediaId: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    createdBy: "user-1",
    ...overrides,
  };
}

describe("getProjectStorySections", () => {
  test("returns populated sections in narrative order", () => {
    const sections = getProjectStorySections(
      createPortfolioItem({
        problem: "Legacy workflow was brittle.",
        architecture: "Server-driven admin with media library.",
        solution: "",
      })
    );

    expect(sections.map((section) => section.title)).toEqual([
      "Problem",
      "Architecture",
    ]);
  });

  test("omits blank story fields", () => {
    expect(getProjectStorySections(createPortfolioItem())).toEqual([]);
  });
});

describe("getProjectStoryListItems", () => {
  test("trims and removes empty entries", () => {
    expect(getProjectStoryListItems([" Feature ", "", "  "])).toEqual(["Feature"]);
  });
});

describe("formatProjectDateRange", () => {
  test("formats start and end dates", () => {
    expect(
      formatProjectDateRange(
        new Date("2024-01-15T00:00:00.000Z"),
        new Date("2025-06-01T00:00:00.000Z")
      )
    ).toBe("January 2024 – June 2025");
  });

  test("formats start-only and end-only ranges", () => {
    expect(formatProjectDateRange(new Date("2024-03-01T00:00:00.000Z"), null)).toBe(
      "Started March 2024"
    );
    expect(formatProjectDateRange(null, new Date("2025-12-01T00:00:00.000Z"))).toBe(
      "Completed December 2025"
    );
  });
});

describe("hasProjectStoryContent", () => {
  test("returns false when no story data exists", () => {
    expect(hasProjectStoryContent(createPortfolioItem())).toBe(false);
  });

  test("returns true when any story field is populated", () => {
    expect(
      hasProjectStoryContent(createPortfolioItem({ problem: "Needs better admin UX." }))
    ).toBe(true);
    expect(
      hasProjectStoryContent(createPortfolioItem({ features: ["Media library"] }))
    ).toBe(true);
    expect(
      hasProjectStoryContent(
        createPortfolioItem({ startDate: new Date("2024-01-01T00:00:00.000Z") })
      )
    ).toBe(true);
  });
});
