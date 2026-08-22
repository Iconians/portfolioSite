export type GalleryLightboxViewMode = "fit" | "actual";

export const DEFAULT_GALLERY_LIGHTBOX_VIEW_MODE: GalleryLightboxViewMode = "fit";

export function toggleGalleryLightboxViewMode(
  mode: GalleryLightboxViewMode
): GalleryLightboxViewMode {
  return mode === "fit" ? "actual" : "fit";
}

export function getGalleryLightboxZoomToggleLabel(
  mode: GalleryLightboxViewMode
): string {
  return mode === "fit" ? "View actual size" : "Fit to window";
}

export function isGalleryLightboxActualSize(mode: GalleryLightboxViewMode): boolean {
  return mode === "actual";
}
