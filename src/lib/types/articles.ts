import { z } from "zod";

export const ArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  slug: z.string().min(1, "Slug is required").max(255),
  content: z.string().min(1, "Content is required"),
  description: z.string().optional(),
  date: z.string().or(z.date()),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  coverMediaId: z.string().uuid().nullable().optional(),
});

export const PublishArticleSchema = z.object({
  id: z.string().uuid(),
  status: z.literal("published"),
});

export type CreateArticleInput = z.infer<typeof ArticleSchema>;
export type UpdateArticleInput = Partial<CreateArticleInput>;

export interface ArticleCoverMediaRecord {
  id: string;
  publicUrl: string;
  altText: string | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content?: string; // Optional - not included when fetching lists
  description: string | null;
  date: Date;
  tags: string[];
  featured: boolean;
  status: string;
  coverMediaId: string | null;
  coverMedia?: ArticleCoverMediaRecord | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  createdBy: string;
}

export interface ArticleWithUser extends Article {
  createdByUser: {
    email: string;
  };
}
