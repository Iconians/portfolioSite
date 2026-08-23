import { serialize } from "next-mdx-remote/serialize";

import { getArticleCoverImage } from "@/lib/articles/article-cover";
import { getPrimaryArticleTag } from "@/lib/articles/blog-tags";
import { computeReadTimeMinutes } from "@/lib/articles/read-time";
import { getAllArticles, getArticleBySlug } from "@/lib/data/articles";

export interface FrontMatter {
  title: string;
  description?: string;
  date: string;
  featured?: boolean;
  tags?: string[];
  coverImageUrl?: string;
  coverImageAlt?: string;
  readTimeMinutes?: number;
  primaryTag?: string;
}

export const getPostBySlug = async (slug: string) => {
  const article = await getArticleBySlug(slug);

  if (!article) {
    return null;
  }

  // Content is always present when fetching a single article by slug
  if (!article.content) {
    return null;
  }

  // Serialize MDX with options for better performance
  const mdxSource = await serialize(article.content, {
    parseFrontmatter: false, // We already have frontmatter
    mdxOptions: {
      development: false,
    },
  });

  const cover = getArticleCoverImage(article);

  return {
    frontMatter: {
      title: article.title,
      description: article.description || "",
      date: article.date.toISOString().split("T")[0],
      featured: article.featured,
      tags: article.tags,
      coverImageUrl: cover?.url,
      coverImageAlt: cover?.alt,
      readTimeMinutes: computeReadTimeMinutes(article.content),
      primaryTag: getPrimaryArticleTag(article.tags),
    } as FrontMatter,
    mdxSource,
  };
};

export const getAllPosts = async () => {
  const articles = await getAllArticles(true);

  return articles.map((article) => {
    const cover = getArticleCoverImage(article);
    const content = article.content ?? "";

    return {
      slug: article.slug,
      frontMatter: {
        title: article.title,
        description: article.description || "",
        date: article.date.toISOString().split("T")[0],
        featured: article.featured,
        tags: article.tags,
        coverImageUrl: cover?.url,
        coverImageAlt: cover?.alt,
        readTimeMinutes: computeReadTimeMinutes(content),
        primaryTag: getPrimaryArticleTag(article.tags),
      } as FrontMatter,
    };
  });
};
