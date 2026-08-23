import { describe, expect, test } from "bun:test";

import {
  getAdjacentGalleryIndex,
} from "@/components/patterns/engineering-gallery-navigation";

describe("getAdjacentGalleryIndex", () => {
  test("clamps previous at first image", () => {
    expect(getAdjacentGalleryIndex(0, "prev", 5)).toBe(0);
  });

  test("clamps next at last image", () => {
    expect(getAdjacentGalleryIndex(4, "next", 5)).toBe(4);
  });

  test("moves to adjacent indices within bounds", () => {
    expect(getAdjacentGalleryIndex(2, "prev", 5)).toBe(1);
    expect(getAdjacentGalleryIndex(2, "next", 5)).toBe(3);
  });

  test("handles empty and single-image galleries", () => {
    expect(getAdjacentGalleryIndex(0, "next", 0)).toBe(0);
    expect(getAdjacentGalleryIndex(0, "prev", 1)).toBe(0);
    expect(getAdjacentGalleryIndex(0, "next", 1)).toBe(0);
  });

  test("clamps out-of-range current index", () => {
    expect(getAdjacentGalleryIndex(10, "prev", 3)).toBe(1);
    expect(getAdjacentGalleryIndex(-2, "next", 3)).toBe(1);
  });
});
