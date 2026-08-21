import { serialize } from "next-mdx-remote/serialize";
import { getArticleCoverImage } from "@/lib/articles/article-cover";
import { getAllArticles, getArticleBySlug } from "@/lib/data/articles";

export interface FrontMatter {
  title: string;
  description?: string;
  date: string;
  featured?: boolean;
  tags?: string[];
  coverImageUrl?: string;
  coverImageAlt?: string;
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
    } as FrontMatter,
    mdxSource,
  };
};

export const getAllPosts = async () => {
  // Don't fetch content for list views - only needed when viewing individual articles
  const articles = await getAllArticles(false);

  return articles.map((article) => {
    const cover = getArticleCoverImage(article);

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
      } as FrontMatter,
    };
  });
};
