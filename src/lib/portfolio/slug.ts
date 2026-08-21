const SLUG_MAX_LENGTH = 80;

export function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/g, "");
}

export function appendSlugSuffix(baseSlug: string, suffix: number): string {
  const suffixText = `-${suffix}`;
  const trimmedBase = baseSlug.slice(0, Math.max(1, SLUG_MAX_LENGTH - suffixText.length));
  return `${trimmedBase.replace(/-+$/g, "")}${suffixText}`;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
