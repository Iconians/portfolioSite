export type ChildReorderDirection = "up" | "down";

/**
 * Applies a single up/down move to a complete ordered ID list for atomic Platform reorder.
 */
export function buildChildReorderOrderedIds(
  orderedIds: string[],
  itemId: string,
  direction: ChildReorderDirection
): string[] | null {
  const currentIndex = orderedIds.indexOf(itemId);
  if (currentIndex === -1) {
    return null;
  }

  const adjacentIndex =
    direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (adjacentIndex < 0 || adjacentIndex >= orderedIds.length) {
    return null;
  }

  const next = [...orderedIds];
  [next[currentIndex], next[adjacentIndex]] = [
    next[adjacentIndex],
    next[currentIndex],
  ];
  return next;
}
