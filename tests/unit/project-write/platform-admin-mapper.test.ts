import { describe, expect, test } from "bun:test";

import {
  adminMediaToPublicMedia,
  mapPlatformAdminDetailToEditorLoad,
  mapPlatformLifecycleToPortfolio,
  mapPlatformPublishStatusToPortfolio,
} from "@/lib/project-write/platform-admin-mapper";

import type { PlatformApiAdminCaseStudyDetail } from "@/lib/project-write/platform-admin-types";

const PLATFORM_UUID = "00000000-0000-4000-8000-000000000001";
const PORTFOLIO_LOCAL_UUID = "11111111-1111-4111-8111-111111111111";

const detail: PlatformApiAdminCaseStudyDetail = {
  id: PLATFORM_UUID,
  slug: "tournament-registration-event-management-system",
  title: "Tournament Registration",
  summary: "Event operations platform",
  project_type: "client",
  lifecycle_status: "completed",
  publish_status: "draft",
  content_version: 2,
  categories: [{ name: "Next.js", slug: "next-js" }],
  technologies: [{ name: "PostgreSQL" }, { name: "Stripe" }],
  content_items: [
    { kind: "feature", text: "Registration" },
    { kind: "responsibility", text: "Full-stack delivery" },
    { kind: "capability", text: "Payments" },
  ],
  links: [{ link_type: "live", url: "https://example.com" }],
  metrics: [{ label: "Teams", value: "40+", description: "Managed teams" }],
  milestones: [
    {
      year: 2026,
      version: "v1",
      title: "Launch",
      description: null,
    },
  ],
};

const media = [
  {
    id: "media-hero-platform",
    case_study_id: PLATFORM_UUID,
    storage_key: "portfolio/projects/heroes/a.png",
    public_url: "https://cdn.example/hero.png",
    role: "hero",
    alt_text: "Hero",
    sort_order: 0,
  },
  {
    id: "media-og-platform",
    case_study_id: PLATFORM_UUID,
    storage_key: "portfolio/projects/og/b.png",
    public_url: "https://cdn.example/og.png",
    role: "og",
    alt_text: "OG",
    sort_order: 1,
  },
  {
    id: "media-gallery-platform",
    case_study_id: PLATFORM_UUID,
    storage_key: "portfolio/projects/gallery/c.png",
    public_url: "https://cdn.example/gallery.png",
    role: "gallery",
    alt_text: "Gallery",
    caption: "Ops",
    sort_order: 2,
  },
];

describe("mapPlatformAdminDetailToEditorLoad", () => {
  test("maps Platform admin detail into ProjectEditor load shape", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media,
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
    });

    expect(loaded.portfolioLocalId).toBe(PORTFOLIO_LOCAL_UUID);
    expect(loaded.platformCaseStudyId).toBe(PLATFORM_UUID);
    expect(loaded.portfolioLocalId).not.toBe(loaded.platformCaseStudyId);
    expect(loaded.slug).toBe("tournament-registration-event-management-system");
    expect(loaded.caption).toBe("Tournament Registration");
    expect(loaded.initialValues.category).toEqual(["Next.js"]);
    expect(loaded.initialValues.features).toEqual(["Registration"]);
    expect(loaded.initialValues.responsibilities).toEqual(["Full-stack delivery"]);
    expect(loaded.initialValues.platformFeatures).toEqual(["Payments"]);
    expect(loaded.initialMetrics.length).toBe(1);
    expect(loaded.initialMetrics[0]?.portfolioId).toBe(PORTFOLIO_LOCAL_UUID);
    expect(loaded.initialVersions.length).toBe(1);
    expect(loaded.initialVersions[0]?.portfolioId).toBe(PORTFOLIO_LOCAL_UUID);
  });

  test("without mutationCompat, mutation-bound media IDs remain unset", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media,
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
    });

    expect(loaded.initialValues.heroMediaId).toBeNull();
    expect(loaded.initialValues.ogMediaId).toBeNull();
    expect(loaded.initialOgImageUrl).toBe("https://cdn.example/og.png");
  });

  test("with mutationCompat, local media IDs are preserved for Prisma writes", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media,
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
      mutationCompat: {
        heroMediaId: "22222222-2222-4222-8222-222222222222",
        ogMediaId: "33333333-3333-4333-8333-333333333333",
        gallery: [
          {
            mediaId: "44444444-4444-4444-8444-444444444444",
            url: "https://cdn.local/gallery.png",
          },
        ],
      },
    });

    expect(loaded.initialValues.heroMediaId).toBe("22222222-2222-4222-8222-222222222222");
    expect(loaded.initialValues.ogMediaId).toBe("33333333-3333-4333-8333-333333333333");
    expect(loaded.initialValues.gallery[0]?.mediaId).toBe(
      "44444444-4444-4444-8444-444444444444"
    );
    expect(loaded.initialValues.img).toBe("https://cdn.example/hero.png");
    expect(loaded.mutationCompat?.heroMediaId).toBe(
      "22222222-2222-4222-8222-222222222222"
    );
  });

  test("maps lifecycle and publish status explicitly", () => {
    expect(mapPlatformLifecycleToPortfolio("archived")).toBe("archived");
    expect(mapPlatformLifecycleToPortfolio("completed")).toBe("active");
    expect(mapPlatformLifecycleToPortfolio("active")).toBe("active");
    expect(mapPlatformPublishStatusToPortfolio("draft")).toBe("draft");
    expect(mapPlatformPublishStatusToPortfolio("published")).toBe("published");

    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media,
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
    });
    expect(loaded.initialValues.lifecycleStatus).toBe("active");
    expect(loaded.initialValues.publishStatus).toBe("draft");
  });

  test("rewrites historical R2 media URLs for admin display", () => {
    const previous = process.env.S3_PUBLIC_URL_BASE;
    process.env.S3_PUBLIC_URL_BASE = "https://media.devlaunchsystems.com";

    const rewritten = adminMediaToPublicMedia([
      {
        id: "media-r2",
        case_study_id: PLATFORM_UUID,
        storage_key: "portfolio/projects/heroes/a.png",
        public_url:
          "https://pub-49ca821aa6ed4a4ba63fe0776a63274e.r2.dev/portfolio/projects/heroes/a.png",
        role: "hero",
        sort_order: 0,
      },
    ]);

    expect(rewritten[0]?.public_url).toBe(
      "https://media.devlaunchsystems.com/portfolio/projects/heroes/a.png"
    );

    process.env.S3_PUBLIC_URL_BASE = previous;
  });
});
