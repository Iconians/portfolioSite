import type { PortfolioGalleryItem } from "@/lib/types/portfolio";

export function normalizeGalleryItems(
  gallery: PortfolioGalleryItem[] | unknown
): PortfolioGalleryItem[] {
  if (!Array.isArray(gallery)) {
    return [];
  }

  return gallery.filter(
    (item): item is PortfolioGalleryItem =>
      Boolean(item && typeof item === "object" && typeof item.url === "string" && item.url.trim())
  );
}

export function hasProjectGallery(gallery: PortfolioGalleryItem[] | unknown): boolean {
  return normalizeGalleryItems(gallery).length > 0;
}

export function galleryReferencesMedia(
  gallery: unknown,
  mediaAssetId: string,
  publicUrl: string
): number {
  return normalizeGalleryItems(gallery).filter(
    (item) => item.mediaId === mediaAssetId || item.url === publicUrl
  ).length;
}
