import { describe, expect, test } from "bun:test";

import {
  normalizePlatformFeatures,
  shouldShowPlatformShowcase,
  validatePlatformShowcase,
} from "@/lib/portfolio/platform";
import {
  PLATFORM_FEATURE_CATALOG,
  isCatalogPlatformFeature,
  partitionPlatformFeatures,
} from "@/lib/portfolio/platform-feature-catalog";

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

describe("shouldShowPlatformShowcase", () => {
  test("returns false when showcase is disabled", () => {
    expect(
      shouldShowPlatformShowcase({
        showPlatformSection: false,
        platformFeatures: ["Media library & persisted uploads"],
      })
    ).toBe(false);
  });

  test("returns false when enabled without features", () => {
    expect(
      shouldShowPlatformShowcase({
        showPlatformSection: true,
        platformFeatures: [],
      })
    ).toBe(false);
  });

  test("returns true when enabled with normalized features", () => {
    expect(
      shouldShowPlatformShowcase({
        showPlatformSection: true,
        platformFeatures: [" Media Library ", "media library"],
      })
    ).toBe(true);
  });
});

describe("platform feature catalog", () => {
  test("exposes a non-empty catalog", () => {
    expect(PLATFORM_FEATURE_CATALOG.length).toBeGreaterThan(0);
  });

  test("identifies catalog entries case-insensitively", () => {
    expect(isCatalogPlatformFeature("Media library & persisted uploads")).toBe(
      true
    );
    expect(isCatalogPlatformFeature("custom capability")).toBe(false);
  });

  test("partitions catalog and custom selections", () => {
    expect(
      partitionPlatformFeatures([
        "Media library & persisted uploads",
        "media library & persisted uploads",
        "Custom workflow",
      ])
    ).toEqual({
      catalogSelections: ["Media library & persisted uploads"],
      customFeatures: ["Custom workflow"],
    });
  });
});
