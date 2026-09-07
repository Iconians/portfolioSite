import { buildChildReorderOrderedIds } from "@/lib/project-write/platform-child-reorder-order";

import type { PortfolioGalleryItem } from "@/lib/types/portfolio";

export type GalleryReorderDirection = "up" | "down";

export function applyGalleryDirectionalReorder(
  items: PortfolioGalleryItem[],
  mediaId: string,
  direction: GalleryReorderDirection
): PortfolioGalleryItem[] | null {
  const galleryIds = items
    .map((item) => item.mediaId)
    .filter((id): id is string => Boolean(id));
  const reorderedIds = buildChildReorderOrderedIds(galleryIds, mediaId, direction);
  if (!reorderedIds) {
    return null;
  }

  const byId = new Map(
    items
      .filter((item) => item.mediaId)
      .map((item) => [item.mediaId as string, item])
  );

  return reorderedIds
    .map((id) => byId.get(id))
    .filter((item): item is PortfolioGalleryItem => Boolean(item));
}
