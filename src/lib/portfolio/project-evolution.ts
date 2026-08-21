import type { ProjectVersion } from "@/lib/types/portfolio";

export function sortProjectVersions(
  versions: ProjectVersion[]
): ProjectVersion[] {
  return [...versions].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    if (a.year !== b.year) {
      return a.year - b.year;
    }

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

export function hasProjectEvolution(versions: ProjectVersion[]): boolean {
  return versions.length > 0;
}
