import { isPortfolioSlugTaken } from "@/lib/data/portfolio-slugs";
import { appendSlugSuffix, isValidSlug, slugifyTitle } from "@/lib/portfolio/slug";

export async function resolveUniquePortfolioSlug(
  title: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = slugifyTitle(title);
  const candidateBase = baseSlug || "project";
  let candidate = candidateBase;
  let suffix = 2;

  while (await isPortfolioSlugTaken(candidate, excludeId)) {
    candidate = appendSlugSuffix(candidateBase, suffix);
    suffix += 1;
  }

  return candidate;
}

export async function assignPortfolioSlug(
  title: string,
  requestedSlug: string | null | undefined,
  excludeId?: string
): Promise<string> {
  if (requestedSlug) {
    if (!isValidSlug(requestedSlug)) {
      throw new Error("Slug must be lowercase kebab-case");
    }

    if (await isPortfolioSlugTaken(requestedSlug, excludeId)) {
      throw new Error("Slug is already in use");
    }

    return requestedSlug;
  }

  return resolveUniquePortfolioSlug(title, excludeId);
}
