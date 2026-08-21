import { describe, expect, test } from "bun:test";
import {
  buildProjectPageMetadata,
  canViewProjectDetail,
  getProjectCardSummary,
  getProjectDetailHref,
  isValidProjectLink,
  uniqueCategories,
} from "@/lib/portfolio/public-project";
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
    subtitle: "A portfolio showcase",
    summary: "Modern engineering portfolio system",
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

describe("canViewProjectDetail", () => {
  test("returns true for published projects with slug", () => {
    expect(canViewProjectDetail(createPortfolioItem())).toBe(true);
  });

  test("returns false for draft projects", () => {
    expect(
      canViewProjectDetail(createPortfolioItem({ publishStatus: "draft" }))
    ).toBe(false);
  });

  test("returns false when slug is missing", () => {
    expect(canViewProjectDetail(createPortfolioItem({ slug: null }))).toBe(false);
  });
});

describe("getProjectDetailHref", () => {
  test("builds slug route", () => {
    expect(getProjectDetailHref("sample-project")).toBe("/projects/sample-project");
  });
});

describe("getProjectCardSummary", () => {
  test("prefers summary over legacy description", () => {
    expect(getProjectCardSummary(createPortfolioItem())).toBe(
      "Modern engineering portfolio system"
    );
  });

  test("falls back to description when summary is empty", () => {
    expect(
      getProjectCardSummary(createPortfolioItem({ summary: null }))
    ).toBe("Legacy description");
  });
});

describe("uniqueCategories", () => {
  test("removes duplicate categories while preserving order", () => {
    expect(
      uniqueCategories(["Next.js", "Prisma", "TypeScript", "Prisma", "Supabase"])
    ).toEqual(["Next.js", "Prisma", "TypeScript", "Supabase"]);
  });

  test("drops empty values", () => {
    expect(uniqueCategories(["Next.js", "  ", "React"])).toEqual(["Next.js", "React"]);
  });
});

describe("isValidProjectLink", () => {
  test("accepts real URLs", () => {
    expect(isValidProjectLink("https://example.com")).toBe(true);
  });

  test("rejects placeholder hash links", () => {
    expect(isValidProjectLink("#")).toBe(false);
    expect(isValidProjectLink(null)).toBe(false);
  });
});

describe("buildProjectPageMetadata", () => {
  test("uses seo fields when present", () => {
    const metadata = buildProjectPageMetadata(
      createPortfolioItem({
        seoTitle: "SEO Title",
        seoDescription: "SEO Description",
      })
    );

    expect(metadata.title).toBe("SEO Title");
    expect(metadata.description).toBe("SEO Description");
  });

  test("falls back to caption and summary", () => {
    const metadata = buildProjectPageMetadata(createPortfolioItem());

    expect(metadata.title).toBe("Sample Project");
    expect(metadata.description).toBe("Modern engineering portfolio system");
  });
});
