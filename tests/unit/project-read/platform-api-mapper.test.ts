import { describe, expect, test } from "bun:test";

import { mapPlatformApiDetail } from "@/lib/project-read/platform-api-mapper";

import type { PlatformApiCaseStudyDetail } from "@/lib/project-read/platform-api-types";

const detail: PlatformApiCaseStudyDetail = {
  slug: "tournament-registration-event-management-system",
  title: "Tournament Registration",
  summary: "Event operations platform",
  project_type: "client",
  lifecycle_status: "active",
  content_version: 2,
  categories: [{ name: "Next.js", slug: "next-js" }],
  technologies: [{ name: "PostgreSQL" }, { name: "Stripe" }],
  content_items: [
    { kind: "feature", text: "Registration" },
    { kind: "responsibility", text: "Full-stack delivery" },
    { kind: "capability", text: "Payments" },
  ],
  links: [
    { link_type: "live", url: "https://example.com" },
    { link_type: "github", url: "https://github.com/example/repo" },
  ],
  media: [
    {
      role: "hero",
      public_url: "https://cdn.example/hero.png",
      alt_text: "Hero",
    },
    {
      role: "gallery",
      public_url: "https://cdn.example/gallery.png",
      alt_text: "Gallery",
      caption: "Ops",
    },
  ],
  metrics: [
    { label: "Teams", value: "40+", description: "Managed teams" },
  ],
  milestones: Array.from({ length: 8 }, (_, index) => ({
    year: 2026,
    version: `v${index}`,
    title: `Milestone ${index + 1}`,
    description: null,
  })),
};

describe("mapPlatformApiDetail", () => {
  test("maps engineering projection into Portfolio domain shape", () => {
    const mapped = mapPlatformApiDetail(detail);

    expect(mapped.project.slug).toBe("tournament-registration-event-management-system");
    expect(mapped.project.caption).toBe("Tournament Registration");
    expect(mapped.project.category).toEqual(["Next.js"]);
    expect(mapped.project.features).toEqual(["Registration"]);
    expect(mapped.project.responsibilities).toEqual(["Full-stack delivery"]);
    expect(mapped.project.platformFeatures).toEqual(["Payments"]);
    expect(mapped.project.showPlatformSection).toBe(true);
    expect(mapped.project.img).toBe("https://cdn.example/hero.png");
    expect(mapped.project.gallery.length).toBe(1);
    expect(mapped.project.publishStatus).toBe("published");
    expect(mapped.project.highlights).toBe("PostgreSQL • Stripe");
  });

  test("maps metrics and milestones with stable synthetic ids", () => {
    const mapped = mapPlatformApiDetail(detail);
    expect(mapped.metrics.length).toBe(1);
    expect(mapped.versions.length).toBe(8);
    expect(mapped.metrics[0]?.portfolioId).toBe(mapped.project.id);
    expect(mapped.versions[0]?.portfolioId).toBe(mapped.project.id);
  });

  test("rewrites R2 media URLs to configured public asset base", () => {
    const previous = process.env.S3_PUBLIC_URL_BASE;
    process.env.S3_PUBLIC_URL_BASE = "https://media.devlaunchsystems.com";

    const mapped = mapPlatformApiDetail({
      ...detail,
      media: [
        {
          role: "hero",
          public_url:
            "https://pub-49ca821aa6ed4a4ba63fe0776a63274e.r2.dev/portfolio/projects/heroes/a.png",
          alt_text: "Hero",
        },
      ],
    });

    expect(mapped.project.img).toBe(
      "https://media.devlaunchsystems.com/portfolio/projects/heroes/a.png"
    );

    process.env.S3_PUBLIC_URL_BASE = previous;
  });
});
