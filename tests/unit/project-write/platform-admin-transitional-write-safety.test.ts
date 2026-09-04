import { describe, expect, test } from "bun:test";

import { splitProjectEditorPayload } from "@/lib/portfolio/project-editor";
import { mapPlatformAdminDetailToEditorLoad } from "@/lib/project-write/platform-admin-mapper";

import type { PlatformApiAdminCaseStudyDetail } from "@/lib/project-write/platform-admin-types";

const PLATFORM_UUID = "00000000-0000-4000-8000-000000000001";
const PORTFOLIO_LOCAL_UUID = "11111111-1111-4111-8111-111111111111";
const LOCAL_HERO_MEDIA_ID = "22222222-2222-4222-8222-222222222222";
const LOCAL_OG_MEDIA_ID = "33333333-3333-4333-8333-333333333333";
const LOCAL_GALLERY_MEDIA_ID = "44444444-4444-4444-8444-444444444444";
const PLATFORM_GALLERY_MEDIA_ID = "55555555-5555-4555-8555-555555555555";

const detail: PlatformApiAdminCaseStudyDetail = {
  id: PLATFORM_UUID,
  slug: "devlaunch-crm",
  title: "DevLaunch CRM",
  summary: "CRM platform for client operations",
  project_type: "client",
  lifecycle_status: "active",
  publish_status: "draft",
  content_version: 1,
  categories: [{ name: "Next.js", slug: "next-js" }],
  technologies: [{ name: "PostgreSQL" }],
  content_items: [],
  links: [],
  metrics: [{ label: "Users", value: "100+", description: null }],
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
    sort_order: 0,
  },
  {
    id: "media-og-platform",
    case_study_id: PLATFORM_UUID,
    storage_key: "portfolio/projects/og/b.png",
    public_url: "https://cdn.example/og.png",
    role: "og",
    sort_order: 1,
  },
  {
    id: PLATFORM_GALLERY_MEDIA_ID,
    case_study_id: PLATFORM_UUID,
    storage_key: "portfolio/projects/gallery/c.png",
    public_url: "https://cdn.example/gallery.png",
    role: "gallery",
    sort_order: 2,
  },
];

const mutationCompat = {
  heroMediaId: LOCAL_HERO_MEDIA_ID,
  ogMediaId: LOCAL_OG_MEDIA_ID,
  gallery: [
    {
      mediaId: LOCAL_GALLERY_MEDIA_ID,
      url: "https://cdn.local/gallery.png",
      alt: "Local gallery",
    },
  ],
};

describe("platform-api transitional Prisma write safety", () => {
  test("unrelated scalar save preserves local media mutation IDs from mutationCompat", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media,
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
      mutationCompat,
    });

    const { extended } = splitProjectEditorPayload({
      ...loaded.initialValues,
      caption: "Updated caption only",
    });

    expect(extended.heroMediaId).toBe(LOCAL_HERO_MEDIA_ID);
    expect(extended.ogMediaId).toBe(LOCAL_OG_MEDIA_ID);
    expect(extended.gallery?.[0]?.mediaId).toBe(LOCAL_GALLERY_MEDIA_ID);
    expect(extended.gallery?.[0]?.mediaId).not.toBe(PLATFORM_GALLERY_MEDIA_ID);
    expect(extended.heroMediaId).not.toBe(PLATFORM_UUID);
  });

  test("platform display URLs remain authoritative while mutation IDs stay local", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media,
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
      mutationCompat,
    });

    expect(loaded.initialValues.img).toBe("https://cdn.example/hero.png");
    expect(loaded.initialOgImageUrl).toBe("https://cdn.example/og.png");
    expect(loaded.initialValues.gallery[0]?.url).toBe("https://cdn.local/gallery.png");
  });

  test("without mutationCompat, mutation-bound media IDs remain unset", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media,
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
    });

    const { extended } = splitProjectEditorPayload({
      ...loaded.initialValues,
      caption: "Updated caption only",
    });

    expect(extended.heroMediaId).toBeNull();
    expect(extended.ogMediaId).toBeNull();
    expect(extended.gallery?.every((item) => item.mediaId === undefined)).toBe(true);
  });

  test("split payload never includes Platform case-study UUID in Prisma FK fields", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media,
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
      mutationCompat,
    });

    const { extended } = splitProjectEditorPayload(loaded.initialValues);

    expect(extended.heroMediaId).not.toBe(PLATFORM_UUID);
    expect(extended.ogMediaId).not.toBe(PLATFORM_UUID);
    expect(
      extended.gallery?.every((item) => item.mediaId !== PLATFORM_GALLERY_MEDIA_ID)
    ).toBe(true);
  });
});
