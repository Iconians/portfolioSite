import { describe, expect, test } from "bun:test";

import { splitProjectEditorPayload } from "@/lib/portfolio/project-editor";
import { mapPlatformAdminDetailToEditorLoad } from "@/lib/project-write/platform-admin-mapper";

import type { PlatformApiAdminCaseStudyDetail } from "@/lib/project-write/platform-admin-types";

const PLATFORM_UUID = "00000000-0000-4000-8000-000000000001";
const PORTFOLIO_LOCAL_UUID = "11111111-1111-4111-8111-111111111111";
const PLATFORM_HERO_MEDIA_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PLATFORM_OG_MEDIA_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const PLATFORM_GALLERY_MEDIA_ID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

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
  metrics: [],
  milestones: [],
};

const media = [
  {
    id: PLATFORM_HERO_MEDIA_ID,
    case_study_id: PLATFORM_UUID,
    storage_key: "portfolio/projects/heroes/a.png",
    public_url: "https://cdn.example/hero.png",
    role: "hero",
    upload_status: "confirmed",
    sort_order: 0,
  },
  {
    id: PLATFORM_OG_MEDIA_ID,
    case_study_id: PLATFORM_UUID,
    storage_key: "portfolio/projects/og/b.png",
    public_url: "https://cdn.example/og.png",
    role: "og",
    upload_status: "confirmed",
    sort_order: 1,
  },
  {
    id: PLATFORM_GALLERY_MEDIA_ID,
    case_study_id: PLATFORM_UUID,
    storage_key: "portfolio/projects/gallery/c.png",
    public_url: "https://cdn.example/gallery.png",
    role: "gallery",
    upload_status: "confirmed",
    sort_order: 2,
  },
];

describe("platform-api media write safety", () => {
  test("platform admin load uses Platform media UUIDs for hero, OG, and gallery", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media,
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
    });

    expect(loaded.initialValues.heroMediaId).toBe(PLATFORM_HERO_MEDIA_ID);
    expect(loaded.initialValues.ogMediaId).toBe(PLATFORM_OG_MEDIA_ID);
    expect(loaded.initialValues.gallery[0]?.mediaId).toBe(PLATFORM_GALLERY_MEDIA_ID);
    expect(loaded.mutationCompat).toBeUndefined();
  });

  test("platform display URLs remain authoritative from Platform media", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media,
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
    });

    expect(loaded.initialValues.img).toBe("https://cdn.example/hero.png");
    expect(loaded.initialOgImageUrl).toBe("https://cdn.example/og.png");
    expect(loaded.initialValues.gallery[0]?.url).toBe("https://cdn.example/gallery.png");
  });

  test("split payload preserves Platform media UUIDs in editor state", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media,
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
    });

    const { extended } = splitProjectEditorPayload({
      ...loaded.initialValues,
      caption: "Updated caption only",
    });

    expect(extended.heroMediaId).toBe(PLATFORM_HERO_MEDIA_ID);
    expect(extended.ogMediaId).toBe(PLATFORM_OG_MEDIA_ID);
    expect(extended.gallery?.[0]?.mediaId).toBe(PLATFORM_GALLERY_MEDIA_ID);
    expect(extended.heroMediaId).not.toBe(PORTFOLIO_LOCAL_UUID);
    expect(extended.heroMediaId).not.toBe(PLATFORM_UUID);
  });
});
