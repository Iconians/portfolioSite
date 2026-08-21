export interface ArticleCoverMedia {
  publicUrl: string;
  altText: string | null;
}

export interface ArticleCoverImage {
  url: string;
  alt: string;
}

export function getArticleCoverImage(
  article: { coverMedia?: ArticleCoverMedia | null }
): ArticleCoverImage | null {
  const url = article.coverMedia?.publicUrl?.trim();
  if (!url) {
    return null;
  }

  return {
    url,
    alt: article.coverMedia?.altText?.trim() || "",
  };
}
