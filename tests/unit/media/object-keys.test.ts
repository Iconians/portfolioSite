import { describe, expect, test } from "bun:test";

import {
  createMediaObjectKey,
  DEFAULT_MEDIA_OBJECT_KEY_DESCRIPTOR,
  isAllowedMediaObjectKey,
} from "@/lib/media/object-keys";

describe("createMediaObjectKey", () => {
  test("maps portfolio project heroes to canonical prefix", () => {
    const key = createMediaObjectKey({
      domain: "portfolio",
      type: "project-hero",
      filename: "../evil name.png",
    });
    expect(key.startsWith("portfolio/projects/heroes/")).toBe(true);
    expect(key.endsWith("-evil-name.png")).toBe(true);
  });

  test("uses default descriptor for portfolio project hero", () => {
    const key = createMediaObjectKey({
      ...DEFAULT_MEDIA_OBJECT_KEY_DESCRIPTOR,
      filename: "building-software-that-grows.png",
    });
    expect(key.startsWith("portfolio/projects/heroes/")).toBe(true);
    expect(key.includes("building-software-that-grows.png")).toBe(true);
  });

  test("includes timestamp and sanitized filename in key", () => {
    const key = createMediaObjectKey({
      domain: "portfolio",
      type: "project-hero",
      filename: "Building Software That Grows.png",
    });
    expect(key).toMatch(
      /^portfolio\/projects\/heroes\/\d+-building-software-that-grows\.png$/
    );
  });
});

describe("isAllowedMediaObjectKey", () => {
  test("accepts keys under registered prefixes", () => {
    expect(
      isAllowedMediaObjectKey("portfolio/projects/heroes/123-photo.png")
    ).toBe(true);
  });

  test("rejects legacy or arbitrary prefixes", () => {
    expect(isAllowedMediaObjectKey("uploads/test.png")).toBe(false);
    expect(isAllowedMediaObjectKey("portfolio/project-images/test.png")).toBe(
      false
    );
    expect(isAllowedMediaObjectKey("media/test.png")).toBe(false);
  });
});
