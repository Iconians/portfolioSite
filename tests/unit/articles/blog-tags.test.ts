import { describe, expect, test } from "bun:test";

import {
  articleMatchesTagFilter,
  getPrimaryArticleTag,
} from "@/lib/articles/blog-tags";

describe("blog-tags", () => {
  test("prefers filter-relevant primary tag", () => {
    expect(
      getPrimaryArticleTag(["Programming", "Algorithms", "TypeScript"])
    ).toBe("Algorithms");
  });

  test("skips generic tags for primary label", () => {
    expect(getPrimaryArticleTag(["Programming", "Migration"])).toBe("Migration");
  });

  test("matches filter tags on index", () => {
    expect(articleMatchesTagFilter(["TypeScript", "Algorithms"], "TypeScript")).toBe(
      true
    );
    expect(articleMatchesTagFilter(["JavaScript"], "Next.js")).toBe(false);
    expect(articleMatchesTagFilter(["JavaScript"], "All")).toBe(true);
  });
});
