import { describe, expect, test } from "bun:test";

import {
  canSelectExistingMediaForRole,
  isPlatformSingletonMediaRole,
  isPlatformMediaRole,
  PLATFORM_MEDIA_R2_CORS_REQUIREMENT,
} from "@/lib/project-write/platform-media-policy";

describe("platform media policy", () => {
  test("validates Platform media roles", () => {
    expect(isPlatformMediaRole("hero")).toBe(true);
    expect(isPlatformMediaRole("og")).toBe(true);
    expect(isPlatformMediaRole("gallery")).toBe(true);
    expect(isPlatformMediaRole("thumbnail")).toBe(true);
    expect(isPlatformMediaRole("cover")).toBe(false);
  });

  test("identifies singleton roles", () => {
    expect(isPlatformSingletonMediaRole("hero")).toBe(true);
    expect(isPlatformSingletonMediaRole("og")).toBe(true);
    expect(isPlatformSingletonMediaRole("gallery")).toBe(false);
  });

  test("role immutability requires matching role for existing selection", () => {
    expect(canSelectExistingMediaForRole("hero", "hero")).toBe(true);
    expect(canSelectExistingMediaForRole("hero", "gallery")).toBe(false);
    expect(canSelectExistingMediaForRole("gallery", "gallery")).toBe(true);
  });

  test("documents R2 CORS operator requirement", () => {
    expect(PLATFORM_MEDIA_R2_CORS_REQUIREMENT.methods).toContain("PUT");
    expect(PLATFORM_MEDIA_R2_CORS_REQUIREMENT.note).toContain("CORS");
  });
});
