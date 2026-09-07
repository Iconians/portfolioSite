import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  pickHomeFeaturedProjects,
  pickPlatformEngineeringFeaturedProjects,
} from "@/lib/portfolio/home-featured";
import {
  mergePlatformListPresentation,
  mapPlatformApiListItemToPortfolioItem,
} from "@/lib/project-read/platform-api-mapper";

import type { PlatformApiListItem } from "@/lib/project-read/platform-api-types";
import type { PortfolioItem } from "@/lib/types/portfolio";

function buildProject(overrides: Partial<PortfolioItem> = {}): PortfolioItem {
  return {
    id: "project-1",
    caption: "Sample",
    description: "Description",
    summary: null,
    img: "/img.png",
    url: null,
    github: null,
    docs: null,
    keyFeatures: null,
    role: null,
    highlights: null,
    projectType: "engineering",
    subtitle: null,
    lifecycleStatus: "active",
    sortOrder: 0,
    seoTitle: null,
    seoDescription: null,
    heroMediaId: null,
    createdBy: "platform-api",
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

describe("M6 Engineering homepage featured migration", () => {
  test("HOME_FEATURED_SLUGS is not authoritative in platform-api mode", () => {
    const featured = pickHomeFeaturedProjects(
      [
        buildProject({
          slug: "devlaunch-crm",
          isFeatured: false,
          sortOrder: 0,
        }),
        buildProject({
          slug: "new-featured-project",
          isFeatured: true,
          sortOrder: 1,
        }),
      ],
      "platform-api"
    );

    expect(featured.map((item) => item.slug)).toEqual(["new-featured-project"]);
  });

  test("engineering_portfolio is_featured=true selects project for homepage", () => {
    const featured = pickPlatformEngineeringFeaturedProjects([
      buildProject({ slug: "featured-one", isFeatured: true, sortOrder: 3 }),
      buildProject({ slug: "not-featured", isFeatured: false, sortOrder: 0 }),
    ]);

    expect(featured.map((item) => item.slug)).toEqual(["featured-one"]);
  });

  test("engineering_portfolio is_featured=false excludes project", () => {
    const featured = pickPlatformEngineeringFeaturedProjects([
      buildProject({ slug: "hidden", isFeatured: false, sortOrder: 0 }),
    ]);

    expect(featured).toEqual([]);
  });

  test("engineering_portfolio sort_order controls ordering", () => {
    const featured = pickPlatformEngineeringFeaturedProjects([
      buildProject({ slug: "b", isFeatured: true, sortOrder: 10 }),
      buildProject({ slug: "a", isFeatured: true, sortOrder: 2 }),
      buildProject({ slug: "c", isFeatured: true, sortOrder: 10 }),
    ]);

    expect(featured.map((item) => item.slug)).toEqual(["a", "b", "c"]);
  });

  test("devlaunch sort_order does not control Engineering homepage order", () => {
    const listItems: PlatformApiListItem[] = [
      {
        slug: "engineering-first",
        title: "Engineering first",
        project_type: "engineering",
        lifecycle_status: "active",
        is_featured: true,
        sort_order: 1,
      },
      {
        slug: "engineering-second",
        title: "Engineering second",
        project_type: "engineering",
        lifecycle_status: "active",
        is_featured: true,
        sort_order: 5,
      },
    ];

    const projects = listItems.map((item) =>
      mergePlatformListPresentation(mapPlatformApiListItemToPortfolioItem(item), item)
    );

    expect(pickPlatformEngineeringFeaturedProjects(projects).map((item) => item.slug)).toEqual([
      "engineering-first",
      "engineering-second",
    ]);
  });

  test("visibility is enforced by Platform list membership before featured selection", () => {
    const visibleFeatured = pickPlatformEngineeringFeaturedProjects([
      buildProject({ slug: "visible-featured", isFeatured: true, sortOrder: 0 }),
    ]);

    expect(visibleFeatured.length).toBe(1);
    expect(
      pickPlatformEngineeringFeaturedProjects([
        buildProject({ slug: "not-in-platform-list", isFeatured: true, sortOrder: 0 }),
      ]).length
    ).toBe(1);
  });

  test("multiple featured projects return in Platform sort_order", () => {
    const featured = pickPlatformEngineeringFeaturedProjects([
      buildProject({ slug: "one", isFeatured: true, sortOrder: 0 }),
      buildProject({ slug: "two", isFeatured: true, sortOrder: 1 }),
      buildProject({ slug: "three", isFeatured: false, sortOrder: 2 }),
    ]);

    expect(featured.map((item) => item.slug)).toEqual(["one", "two"]);
  });

  test("mergePlatformListPresentation maps engineering consumer fields from list item", () => {
    const merged = mergePlatformListPresentation(
      buildProject({ slug: "alpha", sortOrder: 0, isFeatured: false }),
      {
        slug: "alpha",
        title: "Alpha",
        project_type: "engineering",
        lifecycle_status: "active",
        is_featured: true,
        sort_order: 7,
      }
    );

    expect(merged.isFeatured).toBe(true);
    expect(merged.sortOrder).toBe(7);
  });

  test("no Prisma featured authority in platform-api read provider", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-read/platform-api-project-read-provider.ts",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("HOME_FEATURED_SLUGS")).toBe(false);
    expect(source.includes("db.portfolio")).toBe(false);
  });

  test("no CRM dependency in home featured selection", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/portfolio/home-featured.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("devlaunch-crm")).toBe(true);
    expect(source.includes("@/lib/crm")).toBe(false);
    expect(source.includes("marketing/case-studies")).toBe(false);
  });

  test("M5 PresentationSection remains unchanged", () => {
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
    expect(source.includes("engineeringPortfolioSortOrder")).toBe(true);
  });

  test("M17 write-freeze preserved", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/config.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("platform-api")).toBe(true);
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

    expect(source.includes("createCaseStudy")).toBe(true);
  });

  test("M3 reorder path preserved", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-metrics.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("reorderPortfolioMetricsViaPlatform")).toBe(true);
  });

  test("M4 gallery reorder path preserved", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-media.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("reorderProjectGalleryMediaViaPlatform")).toBe(true);
  });

  test("M5 presentation mapper preserved", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/platform-presentation-mapper.ts",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("engineering_portfolio")).toBe(true);
  });

  test("database read mode retains legacy slug selection", () => {
    const featured = pickHomeFeaturedProjects(
      [
        buildProject({ slug: "devlaunch-crm", isFeatured: false, sortOrder: 99 }),
      ],
      "database"
    );

    expect(featured.map((item) => item.slug)).toEqual(["devlaunch-crm"]);
  });
});
