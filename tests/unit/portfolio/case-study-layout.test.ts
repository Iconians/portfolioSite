import { describe, expect, test } from "bun:test";

import {
  getCaseStudySectionKeys,
  hasProjectSummary,
} from "@/lib/portfolio/case-study-layout";

import type { PortfolioItem, PortfolioMetric, ProjectVersion } from "@/lib/types/portfolio";

function buildProject(overrides: Partial<PortfolioItem> = {}): PortfolioItem {
  return {
    id: "project-1",
    caption: "Sample project",
    description: "Description",
    summary: "Summary text",
    img: "/img.png",
    url: null,
    github: null,
    docs: null,
    keyFeatures: null,
    role: null,
    highlights: null,
    projectType: null,
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

function buildMetric(id: string): PortfolioMetric {
  return {
    id,
    portfolioId: "project-1",
    label: "Uptime",
    value: "99%",
    description: null,
    displayOrder: 0,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };
}

function buildVersion(id: string): ProjectVersion {
  return {
    id,
    portfolioId: "project-1",
    year: 2024,
    version: "1.0",
    title: "Launch",
    description: "Shipped",
    sortOrder: 0,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };
}

describe("hasProjectSummary", () => {
  test("returns false when summary and categories are empty", () => {
    const project = buildProject({
      summary: "",
      description: "",
      category: [],
    });

    expect(hasProjectSummary(project)).toBe(false);
  });

  test("returns true when categories exist without summary", () => {
    expect(hasProjectSummary(buildProject({ summary: "", description: "" }))).toBe(
      true
    );
  });
});

describe("getCaseStudySectionKeys", () => {
  test("omits optional sections when data is empty", () => {
    const project = buildProject({
      summary: "",
      description: "",
      category: [],
      gallery: [],
      platformFeatures: [],
      showPlatformSection: false,
      problem: null,
      features: [],
      responsibilities: [],
    });

    const keys = getCaseStudySectionKeys({
      project,
      metrics: [],
      versions: [],
      isPreview: false,
    });

    expect(keys).toEqual(["hero"]);
  });

  test("includes preview banner only in preview mode", () => {
    const previewKeys = getCaseStudySectionKeys({
      project: buildProject(),
      metrics: [],
      versions: [],
      isPreview: true,
    });

    expect(previewKeys[0]).toBe("preview-banner");
  });

  test("preserves canonical section order when data is present", () => {
    const project = buildProject({
      showPlatformSection: true,
      platformFeatures: ["Auth"],
      gallery: [{ url: "https://example.com/shot.png", caption: "UI" }],
      url: "https://example.com",
      problem: "Problem text",
    });

    const keys = getCaseStudySectionKeys({
      project,
      metrics: [buildMetric("m1")],
      versions: [buildVersion("v1")],
      isPreview: false,
    });

    expect(keys).toEqual([
      "hero",
      "summary",
      "metrics",
      "story",
      "evolution",
      "platform",
      "gallery",
      "links",
    ]);
  });
});
