import { describe, expect, test } from "bun:test";

import { getArticleCoverImage } from "@/lib/articles/article-cover";

describe("getArticleCoverImage", () => {
  test("returns null when cover media is missing", () => {
    expect(getArticleCoverImage({})).toBeNull();
    expect(getArticleCoverImage({ coverMedia: null })).toBeNull();
  });

  test("returns cover url and alt text when set", () => {
    expect(
      getArticleCoverImage({
        coverMedia: {
          publicUrl: "https://cdn.example.com/cover.webp",
          altText: "Article cover",
        },
      })
    ).toEqual({
      url: "https://cdn.example.com/cover.webp",
      alt: "Article cover",
    });
  });

  test("falls back to empty alt text", () => {
    expect(
      getArticleCoverImage({
        coverMedia: {
          publicUrl: "https://cdn.example.com/cover.webp",
          altText: null,
        },
      })
    ).toEqual({
      url: "https://cdn.example.com/cover.webp",
      alt: "",
    });
  });
});
