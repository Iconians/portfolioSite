/** Filter pills shown on the blog index (excludes generic tags). */
export const BLOG_TAG_FILTERS = [
  "All",
  "Algorithms",
  "Data Structures",
  "TypeScript",
  "Next.js",
] as const;

export type BlogTagFilter = (typeof BLOG_TAG_FILTERS)[number];

const EXCLUDED_PRIMARY_TAGS = new Set(["Programming", "Coding"]);

const FILTER_TAG_SET = new Set<string>(
  BLOG_TAG_FILTERS.filter((tag) => tag !== "All")
);

/** Primary tag for cards: prefer filter-relevant tags, skip generic labels. */
export function getPrimaryArticleTag(tags: string[] | undefined): string | undefined {
  if (!tags?.length) {
    return undefined;
  }

  const normalized = tags.map((tag) => tag.trim()).filter(Boolean);

  const filterMatch = normalized.find((tag) => FILTER_TAG_SET.has(tag));
  if (filterMatch) {
    return filterMatch;
  }

  const nonGeneric = normalized.find((tag) => !EXCLUDED_PRIMARY_TAGS.has(tag));
  return nonGeneric ?? normalized[0];
}

export function articleMatchesTagFilter(
  tags: string[] | undefined,
  filter: BlogTagFilter
): boolean {
  if (filter === "All") {
    return true;
  }

  return tags?.includes(filter) ?? false;
}
