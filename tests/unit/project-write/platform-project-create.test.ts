import { describe, expect, test } from "bun:test";

import { buildPlatformCreatePayload } from "@/lib/project-write/platform-create-payload";

describe("buildPlatformCreatePayload", () => {
  test("sends title and project_type with slug omitted when not provided", () => {
    const payload = buildPlatformCreatePayload({
      title: "New Platform Project",
      projectType: "engineering",
    });

    expect(payload).toEqual({
      title: "New Platform Project",
      project_type: "engineering",
    });
    expect("slug" in payload).toBe(false);
  });

  test("includes explicit slug when provided", () => {
    const payload = buildPlatformCreatePayload({
      title: "Custom Slug Project",
      projectType: "client",
      slug: "custom-slug-project",
    });

    expect(payload).toEqual({
      title: "Custom Slug Project",
      project_type: "client",
      slug: "custom-slug-project",
    });
  });

  test("trims title and ignores blank slug", () => {
    const payload = buildPlatformCreatePayload({
      title: "  Trimmed Title  ",
      projectType: "saas",
      slug: "   ",
    });

    expect(payload).toEqual({
      title: "Trimmed Title",
      project_type: "saas",
    });
    expect("slug" in payload).toBe(false);
  });
});
