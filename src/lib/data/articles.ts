import { db } from "@/lib/db/client";
import { requireAdmin } from "@/lib/permissions";
import type {
  CreateArticleInput,
  UpdateArticleInput,
  Article,
  ArticleWithUser,
} from "@/lib/types/articles";
import { ArticleSchema } from "@/lib/types/articles";
import { z } from "zod";

// Public queries (no auth required)
// Note: content is excluded by default to reduce payload size - only fetch when needed
export async function getAllArticles(
  includeContent = false
): Promise<Article[]> {
  return db.article.findMany({
    where: { status: "published" },
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      date: true,
      tags: true,
      featured: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
      createdBy: true,
      ...(includeContent ? { content: true } : {}),
    },
  }) as Promise<Article[]>;
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleWithUser | null> {
  const article = await db.article.findUnique({
    where: { slug },
    include: {
      createdByUser: {
        select: { email: true },
      },
    },
  });

  // Only return published articles
  if (!article || article.status !== "published") {
    return null;
  }

  return article;
}

// Admin-only queries
export async function getAllArticlesAdmin(): Promise<Article[]> {
  await requireAdmin();
  return db.article.findMany({
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      date: true,
      tags: true,
      featured: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
      createdBy: true,
      content: true,
    },
  });
}

// Admin-only mutations (enforce auth)
export async function createArticle(
  data: CreateArticleInput
): Promise<Article> {
  const user = await requireAdmin(); // Throws if not authenticated

  const validatedData = ArticleSchema.parse(data);

  return db.article.create({
    data: {
      ...validatedData,
      date:
        validatedData.date instanceof Date
          ? validatedData.date
          : new Date(validatedData.date),
      createdBy: user.id,
    },
  });
}

export async function updateArticle(
  id: string,
  data: UpdateArticleInput
): Promise<Article> {
  const user = await requireAdmin();

  const article = await db.article.findUnique({ where: { id } });
  if (!article) throw new Error("Article not found");

  // Explicit ownership check
  if (article.createdBy !== user.id && user.role !== "admin") {
    throw new Error("Forbidden");
  }

  const validatedData = ArticleSchema.partial().parse(data);

  return db.article.update({
    where: { id },
    data: {
      ...validatedData,
      updatedAt: new Date(),
      ...(validatedData.date && {
        date:
          validatedData.date instanceof Date
            ? validatedData.date
            : new Date(validatedData.date),
      }),
    },
  });
}

export async function deleteArticle(id: string): Promise<void> {
  const user = await requireAdmin();

  const article = await db.article.findUnique({ where: { id } });
  if (!article) throw new Error("Article not found");

  if (article.createdBy !== user.id && user.role !== "admin") {
    throw new Error("Forbidden");
  }

  await db.article.delete({ where: { id } });
}

export async function publishArticle(id: string): Promise<Article> {
  const user = await requireAdmin();

  const article = await db.article.findUnique({ where: { id } });
  if (!article) throw new Error("Article not found");

  return db.article.update({
    where: { id },
    data: {
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function searchArticles(query: string): Promise<Article[]> {
  if (!query.trim()) {
    return getAllArticles(false); // Don't include content for search results
  }

  // Use Prisma's raw query for full-text search
  const results = await db.$queryRaw<Article[]>`
    SELECT *
    FROM articles
    WHERE status = 'published'
      AND to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || content) 
          @@ plainto_tsquery('english', ${query})
    ORDER BY ts_rank(
      to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || content),
      plainto_tsquery('english', ${query})
    ) DESC
    LIMIT 20
  `;

  return results;
}
