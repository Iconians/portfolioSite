const EMPTY_ANIMATED_PARAGRAPH =
  /<AnimatedParagraph>\s*<\/AnimatedParagraph>/gi;

/**
 * True when MDX carries readable text, fenced code, or other non-whitespace body.
 * Structural-only output from an empty TipTap document (e.g. blank AnimatedParagraph)
 * is treated as non-meaningful.
 */
export function isMeaningfulArticleMdx(
  content: string | undefined | null
): boolean {
  if (!content?.trim()) {
    return false;
  }

  const withoutEmptyParagraphs = content.replace(EMPTY_ANIMATED_PARAGRAPH, " ");
  const withoutTags = withoutEmptyParagraphs.replace(/<[^>]+>/g, " ");
  const withoutFrontmatterProps = withoutTags.replace(/\{[^}]*\}/g, " ");
  const withoutMarkdownDecorators = withoutFrontmatterProps.replace(
    /[#>*_`~\[\]()]/g,
    " "
  );
  const normalized = withoutMarkdownDecorators.replace(/\s+/g, " ").trim();

  return normalized.length > 0;
}

/**
 * On update, omit content when the client sends structural-empty MDX so Prisma
 * preserves the existing article body.
 */
export function resolveArticleContentForUpdate(
  existingContent: string,
  incomingContent: string | undefined
): string | undefined {
  if (incomingContent === undefined) {
    return undefined;
  }

  if (isMeaningfulArticleMdx(incomingContent)) {
    return incomingContent;
  }

  if (isMeaningfulArticleMdx(existingContent)) {
    return undefined;
  }

  return incomingContent;
}
