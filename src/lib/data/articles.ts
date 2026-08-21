import { db } from "@/lib/db/client";
import { requireAdmin } from "@/lib/permissions";
import { isAdminRole } from "@/lib/auth/roles";
import type {
  CreateArticleInput,
  UpdateArticleInput,
  Article,
  ArticleWithUser,
} from "@/lib/types/articles";
import { ArticleSchema } from "@/lib/types/articles";

const articleCoverMediaSelect = {
  select: {
    id: true,
    publicUrl: true,
    altText: true,
  },
} as const;

const articleListSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  date: true,
  tags: true,
  featured: true,
  status: true,
  coverMediaId: true,
  coverMedia: articleCoverMediaSelect,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  createdBy: true,
} as const;

function normalizeArticleDate(date: CreateArticleInput["date"]): Date {
  return date instanceof Date ? date : new Date(date);
}

function buildArticleWriteData(
  data: CreateArticleInput | UpdateArticleInput
): Record<string, unknown> {
  const validatedData = ArticleSchema.partial().parse(data);

  return {
    ...(validatedData.title !== undefined && { title: validatedData.title }),
    ...(validatedData.slug !== undefined && { slug: validatedData.slug }),
    ...(validatedData.content !== undefined && { content: validatedData.content }),
    ...(validatedData.description !== undefined && {
      description: validatedData.description,
    }),
    ...(validatedData.tags !== undefined && { tags: validatedData.tags }),
    ...(validatedData.featured !== undefined && { featured: validatedData.featured }),
    ...(validatedData.status !== undefined && { status: validatedData.status }),
    ...(validatedData.coverMediaId !== undefined && {
      coverMediaId: validatedData.coverMediaId,
    }),
    ...(validatedData.date !== undefined && {
      date: normalizeArticleDate(validatedData.date),
    }),
  };
}

// Public queries (no auth required)
// Note: content is excluded by default to reduce payload size - only fetch when needed
export async function getAllArticles(
  includeContent = false
): Promise<Article[]> {
  return db.article.findMany({
    where: { status: "published" },
    orderBy: { date: "desc" },
    select: {
      ...articleListSelect,
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
      coverMedia: {
        select: {
          id: true,
          publicUrl: true,
          altText: true,
        },
      },
    },
  });

  // Only return published articles
  if (!article || article.status !== "published") {
    return null;
  }

  return article as ArticleWithUser;
}

// Admin-only queries
export async function getAllArticlesAdmin(): Promise<Article[]> {
  await requireAdmin();
  return db.article.findMany({
    orderBy: { date: "desc" },
    select: {
      ...articleListSelect,
      content: true,
    },
  });
}

export async function getArticleByIdAdmin(
  id: string
): Promise<Article | null> {
  await requireAdmin();
  return db.article.findUnique({
    where: { id },
    select: {
      ...articleListSelect,
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
      title: validatedData.title,
      slug: validatedData.slug,
      content: validatedData.content,
      description: validatedData.description,
      tags: validatedData.tags,
      featured: validatedData.featured,
      status: validatedData.status,
      coverMediaId: validatedData.coverMediaId ?? null,
      date: normalizeArticleDate(validatedData.date),
      createdBy: user.id,
    },
    select: {
      ...articleListSelect,
      content: true,
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
  if (article.createdBy !== user.id && !isAdminRole(user.role)) {
    throw new Error("Forbidden");
  }

  return db.article.update({
    where: { id },
    data: {
      ...buildArticleWriteData(data),
      updatedAt: new Date(),
    },
    select: {
      ...articleListSelect,
      content: true,
    },
  });
}

export async function deleteArticle(id: string): Promise<void> {
  const user = await requireAdmin();

  const article = await db.article.findUnique({ where: { id } });
  if (!article) throw new Error("Article not found");

  if (article.createdBy !== user.id && !isAdminRole(user.role)) {
    throw new Error("Forbidden");
  }

  await db.article.delete({ where: { id } });
}

export async function publishArticle(id: string): Promise<Article> {
  await requireAdmin();

  const article = await db.article.findUnique({ where: { id } });
  if (!article) throw new Error("Article not found");

  return db.article.update({
    where: { id },
    data: {
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date(),
    },
    select: {
      ...articleListSelect,
      content: true,
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
