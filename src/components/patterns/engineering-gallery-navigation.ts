export type GalleryNavigationDirection = "prev" | "next";

/**
 * Returns the adjacent gallery index, clamped to bounds (no wrap).
 */
export function getAdjacentGalleryIndex(
  current: number,
  direction: GalleryNavigationDirection,
  total: number
): number {
  if (total <= 0) {
    return 0;
  }

  const clampedCurrent = Math.min(Math.max(current, 0), total - 1);

  if (direction === "prev") {
    return Math.max(clampedCurrent - 1, 0);
  }

  return Math.min(clampedCurrent + 1, total - 1);
}
