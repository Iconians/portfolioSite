import { describe, expect, test } from "bun:test";

import {
  DEFAULT_GALLERY_LIGHTBOX_VIEW_MODE,
  getGalleryLightboxZoomToggleButtonText,
  getGalleryLightboxZoomToggleLabel,
  isGalleryLightboxActualSize,
  toggleGalleryLightboxViewMode,
} from "@/components/patterns/gallery-lightbox-view";

describe("gallery lightbox view mode", () => {
  test("defaults to fit-to-window", () => {
    expect(DEFAULT_GALLERY_LIGHTBOX_VIEW_MODE).toBe("fit");
    expect(isGalleryLightboxActualSize(DEFAULT_GALLERY_LIGHTBOX_VIEW_MODE)).toBe(
      false
    );
  });

  test("toggles between fit and actual size", () => {
    expect(toggleGalleryLightboxViewMode("fit")).toBe("actual");
    expect(toggleGalleryLightboxViewMode("actual")).toBe("fit");
  });

  test("provides accessible zoom toggle labels", () => {
    expect(getGalleryLightboxZoomToggleLabel("fit")).toBe("View actual size");
    expect(getGalleryLightboxZoomToggleLabel("actual")).toBe("Fit to window");
  });

  test("provides short toggle button text", () => {
    expect(getGalleryLightboxZoomToggleButtonText("fit")).toBe("Actual size");
    expect(getGalleryLightboxZoomToggleButtonText("actual")).toBe("Fit");
  });
});
