import type { ProjectVersion } from "@/lib/types/portfolio";

export type VersionReorderDirection = "up" | "down";

export function getVersionReorderPair(
  versions: ProjectVersion[],
  versionId: string,
  direction: VersionReorderDirection
): { current: ProjectVersion; adjacent: ProjectVersion } | null {
  const currentIndex = versions.findIndex((version) => version.id === versionId);
  if (currentIndex === -1) {
    return null;
  }

  const adjacentIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (adjacentIndex < 0 || adjacentIndex >= versions.length) {
    return null;
  }

  return {
    current: versions[currentIndex],
    adjacent: versions[adjacentIndex],
  };
}

export function applyVersionDirectionalReorder(
  versions: ProjectVersion[],
  versionId: string,
  direction: VersionReorderDirection
): ProjectVersion[] | null {
  const pair = getVersionReorderPair(versions, versionId, direction);
  if (!pair) {
    return null;
  }

  const currentIndex = versions.findIndex((version) => version.id === versionId);
  const adjacentIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  const next = [...versions];
  [next[currentIndex], next[adjacentIndex]] = [
    next[adjacentIndex],
    next[currentIndex],
  ];
  return next;
}
