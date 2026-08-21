import { describe, expect, test } from "bun:test";
import { splitProjectEditorPayload } from "@/lib/portfolio/project-editor";
import { PortfolioStoryFieldsSchema } from "@/lib/types/portfolio";

describe("PortfolioStoryFieldsSchema", () => {
  test("accepts partial story content", () => {
    const result = PortfolioStoryFieldsSchema.safeParse({
      problem: "Legacy system could not scale.",
      solution: "Rebuilt on serverless architecture.",
    });

    expect(result.success).toBe(true);
  });

  test("accepts empty partial payload", () => {
    const result = PortfolioStoryFieldsSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  test("rejects story fields over max length", () => {
    const result = PortfolioStoryFieldsSchema.safeParse({
      architecture: "a".repeat(10001),
    });

    expect(result.success).toBe(false);
  });
});

describe("project-editor story persistence", () => {
  test("normalizes blank story fields to null for clearing", () => {
    const { extended } = splitProjectEditorPayload({
      img: "https://cdn.example.com/hero.webp",
      caption: "Sample Project",
      description: "A detailed project description for cards.",
      category: ["Web"],
      lifecycleStatus: "active",
      publishStatus: "published",
      sortOrder: 0,
      gallery: [],
      features: [],
      responsibilities: [],
      problem: "Real problem statement",
      solution: "",
      architecture: "   ",
      challenges: "Hard migration path",
      lessonsLearned: "",
      futureImprovements: "",
      heroMediaId: null,
      ogMediaId: null,
      showPlatformSection: false,
      platformFeatures: [],
    });

    expect(extended.problem).toBe("Real problem statement");
    expect(extended.solution).toBeNull();
    expect(extended.architecture).toBeNull();
    expect(extended.challenges).toBe("Hard migration path");
    expect(extended.lessonsLearned).toBeNull();
    expect(extended.futureImprovements).toBeNull();
  });
});
