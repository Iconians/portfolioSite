import { describe, expect, test } from "bun:test";

import { PlatformSlugImmutableError } from "@/lib/project-write/platform-update-errors";
import { buildPlatformCaseStudyPatchRequest } from "@/lib/project-write/platform-update-mapper";

const baseLegacy = {
  img: "https://cdn.example/hero.png",
  caption: "DevLaunch CRM",
  description: "Card description for homepage project cards.",
  category: ["Next.js", "SaaS"],
  url: "https://example.com",
  github: "https://github.com/example/repo",
  keyFeatures: "Legacy key features",
  role: "Lead engineer",
  highlights: "PostgreSQL • Stripe",
  projectType: "client" as const,
};

const baseExtended = {
  slug: "devlaunch-crm",
  subtitle: "Subtitle",
  summary: "Short summary",
  problem: "Problem text",
  solution: "Solution text",
  architecture: "Architecture notes",
  challenges: "Challenges faced",
  lessonsLearned: "Lessons learned",
  futureImprovements: "Future work",
  lifecycleStatus: "active" as const,
  publishStatus: "draft" as const,
  startDate: new Date("2024-01-01T00:00:00.000Z"),
  endDate: null,
  sortOrder: 0,
  gallery: [{ url: "https://cdn.example/gallery.png", mediaId: "44444444-4444-4444-8444-444444444444" }],
  features: ["Registration"],
  responsibilities: ["Full-stack delivery"],
  seoTitle: "SEO title",
  seoDescription: "SEO description",
  docs: "https://docs.example.com",
  heroMediaId: "22222222-2222-4222-8222-222222222222",
  ogMediaId: "33333333-3333-4333-8333-333333333333",
  showPlatformSection: true,
  platformFeatures: ["Payments"],
};

describe("buildPlatformCaseStudyPatchRequest", () => {
  test("maps scalar and collection fields to Platform PATCH contract", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: baseLegacy,
      extended: baseExtended,
      originalSlug: "devlaunch-crm",
    });

    expect(patch.title).toBe("DevLaunch CRM");
    expect(patch.subtitle).toBe("Subtitle");
    expect(patch.summary).toBe("Short summary");
    expect(patch.project_type).toBe("client");
    expect(patch.start_date).toBe("2024-01-01");
    expect(patch.end_date).toBeNull();
    expect(patch.seo_title).toBe("SEO title");
    expect(patch.technologies).toEqual([{ name: "PostgreSQL" }, { name: "Stripe" }]);
    expect(patch.categories).toEqual([
      { name: "Next.js", slug: "next-js" },
      { name: "SaaS", slug: "saas" },
    ]);
    expect(patch.links).toEqual([
      { link_type: "live", url: "https://example.com" },
      { link_type: "github", url: "https://github.com/example/repo" },
      { link_type: "docs", url: "https://docs.example.com" },
    ]);
    expect(patch.content_items).toEqual([
      { kind: "feature", audience: "engineering", text: "Registration" },
      {
        kind: "responsibility",
        audience: "engineering",
        text: "Full-stack delivery",
      },
      { kind: "capability", audience: "engineering", text: "Payments" },
    ]);
    expect(patch.content_item_kinds_to_replace).toEqual([
      "feature",
      "responsibility",
      "capability",
    ]);
  });

  test("rejects slug mutation attempts", () => {
    try {
      buildPlatformCaseStudyPatchRequest({
        legacy: baseLegacy,
        extended: { ...baseExtended, slug: "new-slug" },
        originalSlug: "devlaunch-crm",
      });
      throw new Error("expected PlatformSlugImmutableError");
    } catch (error) {
      expect(error instanceof PlatformSlugImmutableError).toBe(true);
    }
  });

  test("omits deferred domains from PATCH payload", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: baseLegacy,
      extended: baseExtended,
      originalSlug: "devlaunch-crm",
    });

    expect("slug" in patch).toBe(false);
    expect("publish_status" in patch).toBe(false);
    expect("lifecycle_status" in patch).toBe(false);
    expect("hero_media_id" in patch).toBe(false);
    expect("legacy_img_url" in patch).toBe(false);
    expect("metrics" in patch).toBe(false);
    expect("milestones" in patch).toBe(false);
    expect("consumer_settings" in patch).toBe(false);
  });

  test("empty technologies array clears technologies collection", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: { ...baseLegacy, highlights: "" },
      extended: baseExtended,
      originalSlug: "devlaunch-crm",
    });

    expect(patch.technologies).toEqual([]);
  });

  test("empty links array clears links collection", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: { ...baseLegacy, url: undefined, github: undefined },
      extended: { ...baseExtended, docs: undefined },
      originalSlug: "devlaunch-crm",
    });

    expect(patch.links).toEqual([]);
  });

  test("empty categories array clears categories collection", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: { ...baseLegacy, category: [] },
      extended: baseExtended,
      originalSlug: "devlaunch-crm",
    });

    expect(patch.categories).toEqual([]);
  });

  test("lists all three replacement kinds when all editor collections are present", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: baseLegacy,
      extended: baseExtended,
      originalSlug: "devlaunch-crm",
    });

    expect(patch.content_item_kinds_to_replace).toEqual([
      "feature",
      "responsibility",
      "capability",
    ]);
    expect(patch.content_items?.length).toBe(3);
  });

  test("clears features while replacing responsibilities and capabilities", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: baseLegacy,
      extended: {
        ...baseExtended,
        features: [],
        responsibilities: ["Designed APIs"],
        platformFeatures: ["RBAC"],
      },
      originalSlug: "devlaunch-crm",
    });

    expect(patch.content_item_kinds_to_replace).toEqual([
      "feature",
      "responsibility",
      "capability",
    ]);
    expect(patch.content_items).toEqual([
      { kind: "responsibility", audience: "engineering", text: "Designed APIs" },
      { kind: "capability", audience: "engineering", text: "RBAC" },
    ]);
    expect(patch.content_items?.some((item) => item.kind === "feature")).toBe(false);
  });

  test("clears responsibilities when editor submits an empty responsibilities array", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: baseLegacy,
      extended: {
        ...baseExtended,
        responsibilities: [],
      },
      originalSlug: "devlaunch-crm",
    });

    expect(patch.content_item_kinds_to_replace).toContain("responsibility");
    expect(
      patch.content_items?.filter((item) => item.kind === "responsibility")
    ).toEqual([]);
  });

  test("clears capabilities when editor submits an empty platformFeatures array", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: baseLegacy,
      extended: {
        ...baseExtended,
        platformFeatures: [],
      },
      originalSlug: "devlaunch-crm",
    });

    expect(patch.content_item_kinds_to_replace).toContain("capability");
    expect(
      patch.content_items?.filter((item) => item.kind === "capability")
    ).toEqual([]);
  });

  test("clears all three kinds when all editor collections are empty arrays", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: baseLegacy,
      extended: {
        ...baseExtended,
        features: [],
        responsibilities: [],
        platformFeatures: [],
      },
      originalSlug: "devlaunch-crm",
    });

    expect(patch.content_item_kinds_to_replace).toEqual([
      "feature",
      "responsibility",
      "capability",
    ]);
    expect(patch.content_items).toEqual([]);
  });

  test("regression: empty features clears existing Platform feature rows via explicit kind", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: baseLegacy,
      extended: {
        ...baseExtended,
        features: [],
        responsibilities: ["Designed APIs"],
        platformFeatures: ["RBAC"],
      },
      originalSlug: "devlaunch-crm",
    });

    expect(patch.content_item_kinds_to_replace).toContain("feature");
    expect(patch.content_items?.some((item) => item.kind === "feature")).toBe(
      false
    );
  });

  test("omits content-item fields when collection fields are absent from extended payload", () => {
    const {
      features: _features,
      responsibilities: _responsibilities,
      platformFeatures: _platformFeatures,
      ...partialExtended
    } = baseExtended;

    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: baseLegacy,
      extended: partialExtended,
      originalSlug: "devlaunch-crm",
    });

    expect("content_items" in patch).toBe(false);
    expect("content_item_kinds_to_replace" in patch).toBe(false);
  });

  test("partial extended payload replaces only submitted collection kinds", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: baseLegacy,
      extended: {
        ...baseExtended,
        features: ["Auth"],
        responsibilities: undefined,
        platformFeatures: undefined,
      },
      originalSlug: "devlaunch-crm",
    });

    expect(patch.content_item_kinds_to_replace).toEqual(["feature"]);
    expect(patch.content_items).toEqual([
      { kind: "feature", audience: "engineering", text: "Auth" },
    ]);
  });

  test("does not emit unsupported Platform content-item kinds", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: baseLegacy,
      extended: baseExtended,
      originalSlug: "devlaunch-crm",
    });

    const allowedKinds = new Set(["feature", "responsibility", "capability"]);
    for (const kind of patch.content_item_kinds_to_replace ?? []) {
      expect(allowedKinds.has(kind)).toBe(true);
    }
    for (const item of patch.content_items ?? []) {
      expect(allowedKinds.has(item.kind)).toBe(true);
    }
  });
});
