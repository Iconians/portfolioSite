import { describe, expect, test } from "bun:test";

import { splitProjectEditorPayload } from "@/lib/portfolio/project-editor";
import { mapPlatformAdminDetailToEditorLoad } from "@/lib/project-write/platform-admin-mapper";
import { buildPlatformCaseStudyPatchRequest } from "@/lib/project-write/platform-update-mapper";

import type { PlatformApiAdminCaseStudyDetail } from "@/lib/project-write/platform-admin-types";

const PLATFORM_UUID = "00000000-0000-4000-8000-000000000001";
const PORTFOLIO_LOCAL_UUID = "11111111-1111-4111-8111-111111111111";

const detail: PlatformApiAdminCaseStudyDetail = {
  id: PLATFORM_UUID,
  slug: "devlaunch-crm",
  title: "DevLaunch CRM",
  summary: "CRM platform",
  project_type: "client",
  lifecycle_status: "active",
  publish_status: "draft",
  content_version: 1,
  categories: [{ name: "Next.js", slug: "next-js" }],
  technologies: [{ name: "PostgreSQL" }],
  content_items: [
    { kind: "feature", text: "Auth" },
  ],
  links: [{ link_type: "live", url: "https://example.com", label: null }],
  metrics: [{ label: "Users", value: "100+", description: null }],
  milestones: [{ year: 2026, version: "v1", title: "Launch", description: null }],
};

describe("M3 Platform PATCH payload safety", () => {
  test("editor scalar save builds PATCH without deferred media or lifecycle fields", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media: [
        {
          id: "media-hero",
          case_study_id: PLATFORM_UUID,
          storage_key: "hero.png",
          public_url: "https://cdn.example/hero.png",
          role: "hero",
          sort_order: 0,
        },
      ],
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

    const { legacy, extended } = splitProjectEditorPayload({
      ...loaded.initialValues,
      caption: "Updated caption only",
    });

    const patch = buildPlatformCaseStudyPatchRequest({
      legacy,
      extended,
      originalSlug: "devlaunch-crm",
    });

    expect(patch.title).toBe("Updated caption only");
    expect("slug" in patch).toBe(false);
    expect("publish_status" in patch).toBe(false);
    expect("lifecycle_status" in patch).toBe(false);
    expect("hero_media_id" in patch).toBe(false);
    expect("og_media_id" in patch).toBe(false);
    expect("metrics" in patch).toBe(false);
    expect("milestones" in patch).toBe(false);
    expect(extended.heroMediaId).toBe("22222222-2222-4222-8222-222222222222");
    expect(extended.heroMediaId).not.toBe(PLATFORM_UUID);
  });

  test("empty features array clears features via explicit replacement kind", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail,
      media: [
        {
          id: "media-hero",
          case_study_id: PLATFORM_UUID,
          storage_key: "hero.png",
          public_url: "https://cdn.example/hero.png",
          role: "hero",
          sort_order: 0,
        },
      ],
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
    });

    const { legacy, extended } = splitProjectEditorPayload({
      ...loaded.initialValues,
      features: [],
    });

    const patch = buildPlatformCaseStudyPatchRequest({
      legacy,
      extended,
      originalSlug: "devlaunch-crm",
    });

    expect(patch.content_item_kinds_to_replace).toContain("feature");
    expect(patch.content_items?.some((item) => item.kind === "feature")).toBe(
      false
    );
  });
});
