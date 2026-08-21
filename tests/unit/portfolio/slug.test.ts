import { describe, expect, test } from "bun:test";

import { appendSlugSuffix, isValidSlug, slugifyTitle } from "@/lib/portfolio/slug";

describe("slugifyTitle", () => {
  test("converts title to kebab-case", () => {
    expect(slugifyTitle("Engineering Portfolio Management System")).toBe(
      "engineering-portfolio-management-system"
    );
  });

  test("strips invalid characters and trims dashes", () => {
    expect(slugifyTitle("  Hello -- World!!  ")).toBe("hello-world");
  });

  test("returns empty string for non-alphanumeric titles", () => {
    expect(slugifyTitle("!!!")).toBe("");
  });
});

describe("appendSlugSuffix", () => {
  test("appends numeric suffix without trailing dash", () => {
    expect(appendSlugSuffix("my-project", 2)).toBe("my-project-2");
  });
});

describe("isValidSlug", () => {
  test("accepts lowercase kebab-case slugs", () => {
    expect(isValidSlug("engineering-portfolio-management-system")).toBe(true);
  });

  test("rejects uppercase and spaces", () => {
    expect(isValidSlug("Bad Slug")).toBe(false);
  });
});
