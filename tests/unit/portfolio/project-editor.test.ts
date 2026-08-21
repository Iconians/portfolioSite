import { describe, expect, test } from "bun:test";
import {
  mapPortfolioItemToEditorValues,
  splitProjectEditorPayload,
} from "@/lib/portfolio/project-editor";
import { ProjectEditorSchema } from "@/lib/types/portfolio";

describe("ProjectEditorSchema", () => {
  test("accepts a complete editor payload", () => {
    const result = ProjectEditorSchema.safeParse({
      img: "https://cdn.example.com/hero.webp",
      caption: "Sample Project",
      description: "A detailed project description for cards.",
      category: ["Web", "SaaS"],
      url: "https://example.com",
      github: "https://github.com/example/repo",
      keyFeatures: "Auth • Billing",
      role: "Lead engineer",
      highlights: "Next.js • Postgres",
      projectType: "engineering",
      slug: "sample-project",
      subtitle: "Subtitle",
      summary: "Short summary",
      problem: "Problem text",
      solution: "Solution text",
      architecture: "",
      challenges: "",
      lessonsLearned: "",
      futureImprovements: "",
      lifecycleStatus: "active",
      publishStatus: "published",
      startDate: "2024-01-01",
      endDate: "",
      sortOrder: 2,
      gallery: [{ url: "https://cdn.example.com/g1.webp", mediaId: undefined }],
      features: ["Feature one", ""],
      responsibilities: ["Built API"],
      seoTitle: "SEO title",
      seoDescription: "SEO description",
      docs: "https://docs.example.com",
      heroMediaId: null,
      ogMediaId: null,
      showPlatformSection: false,
      platformFeatures: ["Media library & persisted uploads"],
    });

    expect(result.success).toBe(true);
  });
});

describe("project-editor helpers", () => {
  test("maps portfolio records into editor defaults", () => {
    const values = mapPortfolioItemToEditorValues({
      caption: "Demo",
      description: "Demo description text",
      category: ["Engineering"],
      lifecycleStatus: "active",
      publishStatus: "draft",
      sortOrder: 5,
      startDate: new Date("2023-06-01T00:00:00.000Z"),
    });

    expect(values.caption).toBe("Demo");
    expect(values.lifecycleStatus).toBe("active");
    expect(values.publishStatus).toBe("draft");
    expect(values.startDate).toBe("2023-06-01");
    expect(values.category).toEqual(["Engineering"]);
  });

  test("splits legacy and extended payloads and trims list fields", () => {
    const { legacy, extended } = splitProjectEditorPayload({
      img: "https://cdn.example.com/hero.webp",
      caption: "Sample Project",
      description: "A detailed project description for cards.",
      category: ["Web", ""],
      url: "https://example.com",
      github: undefined,
      keyFeatures: "",
      role: "",
      highlights: "",
      projectType: "",
      slug: "",
      subtitle: "",
      summary: "",
      problem: "",
      solution: "",
      architecture: "",
      challenges: "",
      lessonsLearned: "",
      futureImprovements: "",
      lifecycleStatus: "active",
      publishStatus: "published",
      startDate: "2024-02-01",
      endDate: "",
      sortOrder: 0,
      gallery: [],
      features: ["Shipped MVP", ""],
      responsibilities: ["", "Owned architecture"],
      seoTitle: "",
      seoDescription: "",
      docs: undefined,
      heroMediaId: "550e8400-e29b-41d4-a716-446655440000",
      ogMediaId: null,
      showPlatformSection: false,
      platformFeatures: [],
    });

    expect(legacy.category).toEqual(["Web"]);
    expect(extended.slug).toBeUndefined();
    expect(extended.features).toEqual(["Shipped MVP"]);
    expect(extended.responsibilities).toEqual(["Owned architecture"]);
    expect(extended.startDate?.toISOString()).toBe(
      new Date("2024-02-01T00:00:00.000Z").toISOString()
    );
    expect(extended.heroMediaId).toBe("550e8400-e29b-41d4-a716-446655440000");
  });
});
