import { describe, expect, test } from "bun:test";

import { rewritePortfolioItemDisplayMedia } from "@/lib/portfolio/display-media-url";
import { mapPlatformAdminDetailToEditorLoad } from "@/lib/project-write/platform-admin-mapper";

import type { PlatformApiAdminCaseStudyDetail } from "@/lib/project-write/platform-admin-types";
import type { PortfolioItem } from "@/lib/types/portfolio";

const R2_HERO_URL =
  "https://pub-49ca821aa6ed4a4ba63fe0776a63274e.r2.dev/portfolio/projects/heroes/example.webp";
const CANONICAL_BASE = "https://media.devlaunchsystems.com";

const detail: PlatformApiAdminCaseStudyDetail = {
  id: "00000000-0000-4000-8000-000000000001",
  slug: "devlaunch-crm",
  title: "DevLaunch CRM",
  summary: "CRM platform",
  project_type: "client",
  lifecycle_status: "active",
  publish_status: "draft",
  content_version: 1,
  categories: [],
  technologies: [],
  content_items: [],
  links: [],
};

const media = [
  {
    id: "media-hero-platform",
    case_study_id: detail.id,
    storage_key: "portfolio/projects/heroes/example.webp",
    public_url: R2_HERO_URL,
    role: "hero",
    sort_order: 0,
  },
];

describe("admin portfolio display media URL compatibility", () => {
  test("rewrites Prisma portfolio list hero URLs before next/image", () => {
    const previous = process.env.S3_PUBLIC_URL_BASE;
    process.env.S3_PUBLIC_URL_BASE = "media.devlaunchsystems.com";

    const item = rewritePortfolioItemDisplayMedia({
      id: "11111111-1111-4111-8111-111111111111",
      img: R2_HERO_URL,
      caption: "DevLaunch CRM",
      description: "Description text long enough",
      category: ["Engineering"],
      url: null,
      github: null,
      keyFeatures: null,
      role: null,
      highlights: null,
      projectType: "client",
      slug: "devlaunch-crm",
      subtitle: null,
      summary: null,
      problem: null,
      solution: null,
      architecture: null,
      challenges: null,
      lessonsLearned: null,
      futureImprovements: null,
      lifecycleStatus: "active",
      publishStatus: "draft",
      startDate: null,
      endDate: null,
      sortOrder: 0,
      gallery: [
        {
          url: R2_HERO_URL.replace("/heroes/", "/gallery/"),
          alt: "Gallery",
        },
      ],
      features: [],
      responsibilities: [],
      showPlatformSection: false,
      platformFeatures: [],
      seoTitle: null,
      seoDescription: null,
      docs: null,
      heroMediaId: null,
      ogMediaId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "seed",
    } satisfies PortfolioItem);

    expect(item.img).toBe(`${CANONICAL_BASE}/portfolio/projects/heroes/example.webp`);
    expect(item.gallery[0]?.url).toBe(
      `${CANONICAL_BASE}/portfolio/projects/gallery/example.webp`
    );

    process.env.S3_PUBLIC_URL_BASE = previous;
  });

  test("platform admin editor load rewrites hero display URL before ProjectEditor", () => {
    const previous = process.env.S3_PUBLIC_URL_BASE;
    process.env.S3_PUBLIC_URL_BASE = "media.devlaunchsystems.com";

    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media,
      portfolioLocalId: "11111111-1111-4111-8111-111111111111",
      mutationCompat: {
        heroMediaId: "22222222-2222-4222-8222-222222222222",
        ogMediaId: null,
        gallery: [],
      },
    });

    expect(loaded.initialValues.img).toBe(
      `${CANONICAL_BASE}/portfolio/projects/heroes/example.webp`
    );
    expect(loaded.initialOgImageUrl).toBe(
      `${CANONICAL_BASE}/portfolio/projects/heroes/example.webp`
    );
    expect(loaded.initialValues.heroMediaId).toBe(
      "22222222-2222-4222-8222-222222222222"
    );

    process.env.S3_PUBLIC_URL_BASE = previous;
  });
});
