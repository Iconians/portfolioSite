import { rewritePublicAssetUrlIfConfigured } from "@/lib/storage/public-asset-url";

import type { PortfolioGalleryItem, PortfolioItem } from "@/lib/types/portfolio";

/**
 * Rewrites historical *.r2.dev media URLs for display surfaces (e.g. next/image).
 * Does not mutate persisted records; apply at read/render boundaries only.
 */
export function rewritePortfolioDisplayMediaUrl(url: string): string {
  return rewritePublicAssetUrlIfConfigured(url);
}

/** True when a portfolio list card has a URL safe for next/image. */
export function isDisplayablePortfolioListImage(img: string): boolean {
  const trimmed = img.trim();
  return trimmed.length > 0 && trimmed !== "/";
}

export function rewritePortfolioGalleryItemForDisplay(
  item: PortfolioGalleryItem
): PortfolioGalleryItem {
  return {
    ...item,
    url: rewritePortfolioDisplayMediaUrl(item.url),
  };
}

export function rewritePortfolioItemDisplayMedia(
  item: PortfolioItem
): PortfolioItem {
  return {
    ...item,
    img: rewritePortfolioDisplayMediaUrl(item.img),
    gallery: item.gallery.map(rewritePortfolioGalleryItemForDisplay),
  };
}
