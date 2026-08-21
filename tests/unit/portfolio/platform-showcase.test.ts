import { describe, expect, test } from "bun:test";
import {
  normalizePlatformFeatures,
  validatePlatformShowcase,
} from "@/lib/portfolio/platform";

describe("normalizePlatformFeatures", () => {
  test("trims, deduplicates, and drops empty values", () => {
    expect(
      normalizePlatformFeatures([
        " Media Library ",
        "media library",
        "",
        "Project Editor",
      ])
    ).toEqual(["Media Library", "Project Editor"]);
  });
});

describe("validatePlatformShowcase", () => {
  test("allows disabled showcase with empty features", () => {
    expect(
      validatePlatformShowcase({
        showPlatformSection: false,
        platformFeatures: [],
      })
    ).toEqual({
      showPlatformSection: false,
      platformFeatures: [],
    });
  });

  test("requires features when showcase is enabled", () => {
    expect(() =>
      validatePlatformShowcase({
        showPlatformSection: true,
        platformFeatures: [],
      })
    ).toThrow("Platform showcase requires at least one feature when enabled");
  });
});
