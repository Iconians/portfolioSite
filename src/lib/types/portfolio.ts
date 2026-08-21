import { z } from "zod";

const urlSchema = z
  .string()
  .url()
  .or(z.literal("#"))
  .or(z.string().startsWith("/"))
  .optional();

/** Display order: 1 SaaS → 2 Client → 3 Engineering → 4 Personal. Used for sorting portfolio cards. */
export const PROJECT_TYPE_ORDER = ["saas", "client", "engineering", "personal"] as const;
export type ProjectType = (typeof PROJECT_TYPE_ORDER)[number];

export const LIFECYCLE_STATUSES = ["active", "archived", "sunset"] as const;
export type LifecycleStatus = (typeof LIFECYCLE_STATUSES)[number];

export const PUBLISH_STATUSES = ["draft", "published"] as const;
export type PublishStatus = (typeof PUBLISH_STATUSES)[number];

export const PortfolioGalleryItemSchema = z.object({
  mediaId: z.string().uuid().optional(),
  url: z.string().min(1),
  alt: z.string().max(500).optional(),
  caption: z.string().max(2000).optional(),
});

export const PortfolioStringListSchema = z.array(z.string().min(1).max(500)).max(100);

export const PortfolioItemSchema = z.object({
  img: z.string().min(1, "Hero image is required"),
  caption: z.string().min(1, "Caption is required").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  url: urlSchema,
  github: urlSchema,
  keyFeatures: z.string().optional(),
  role: z.string().optional(),
  highlights: z.string().optional(),
  projectType: z
    .union([z.enum(["saas", "client", "engineering", "personal"]), z.literal("")])
    .optional(),
});

export const PortfolioExtendedFieldsSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case")
    .optional(),
  subtitle: z.string().max(255).optional(),
  summary: z.string().max(5000).optional(),
  problem: z.string().max(10000).nullable().optional(),
  solution: z.string().max(10000).nullable().optional(),
  architecture: z.string().max(10000).nullable().optional(),
  challenges: z.string().max(10000).nullable().optional(),
  lessonsLearned: z.string().max(10000).nullable().optional(),
  futureImprovements: z.string().max(10000).nullable().optional(),
  lifecycleStatus: z.enum(LIFECYCLE_STATUSES).optional(),
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
  gallery: z.array(PortfolioGalleryItemSchema).max(50).optional(),
  features: PortfolioStringListSchema.optional(),
  responsibilities: PortfolioStringListSchema.optional(),
  showPlatformSection: z.boolean().optional(),
  platformFeatures: z.array(z.string().min(1).max(255)).max(50).optional(),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
  docs: urlSchema,
  heroMediaId: z.string().uuid().nullable().optional(),
  ogMediaId: z.string().uuid().nullable().optional(),
});

export const PortfolioMetricInputSchema = z.object({
  label: z.string().min(1).max(120),
  value: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  displayOrder: z.number().int().min(0).max(9999).optional(),
});

export const PortfolioMetricUpdateSchema = PortfolioMetricInputSchema.partial();

export const ProjectVersionInputSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  version: z.string().min(1).max(50),
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

export const ProjectVersionUpdateSchema = ProjectVersionInputSchema.partial();

export const PortfolioStoryFieldsSchema = PortfolioExtendedFieldsSchema.pick({
  problem: true,
  solution: true,
  architecture: true,
  challenges: true,
  lessonsLearned: true,
  futureImprovements: true,
}).partial();

export const ProjectEditorSchema = PortfolioItemSchema.extend({
  slug: z.string().max(255).optional(),
  subtitle: z.string().max(255).optional(),
  summary: z.string().max(5000).optional(),
  problem: z.string().max(10000).optional(),
  solution: z.string().max(10000).optional(),
  architecture: z.string().max(10000).optional(),
  challenges: z.string().max(10000).optional(),
  lessonsLearned: z.string().max(10000).optional(),
  futureImprovements: z.string().max(10000).optional(),
  lifecycleStatus: z.enum(LIFECYCLE_STATUSES),
  publishStatus: z.enum(PUBLISH_STATUSES),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortOrder: z.number().int().min(0).max(9999),
  gallery: z.array(PortfolioGalleryItemSchema).max(50),
  features: z.array(z.string().max(500)).max(100),
  responsibilities: z.array(z.string().max(500)).max(100),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
  docs: urlSchema,
  heroMediaId: z.string().uuid().nullable().optional(),
  ogMediaId: z.string().uuid().nullable().optional(),
  showPlatformSection: z.boolean(),
  platformFeatures: z.array(z.string().max(255)).max(50),
});

export type CreatePortfolioInput = z.infer<typeof PortfolioItemSchema>;
export type UpdatePortfolioInput = Partial<CreatePortfolioInput>;
export type PortfolioExtendedInput = z.infer<typeof PortfolioExtendedFieldsSchema>;
export type PortfolioStoryFieldsInput = z.infer<typeof PortfolioStoryFieldsSchema>;
export type ProjectEditorFormData = z.infer<typeof ProjectEditorSchema>;
export type PortfolioGalleryItem = z.infer<typeof PortfolioGalleryItemSchema>;
export type PortfolioMetricInput = z.infer<typeof PortfolioMetricInputSchema>;
export type PortfolioMetricUpdate = z.infer<typeof PortfolioMetricUpdateSchema>;
export type ProjectVersionInput = z.infer<typeof ProjectVersionInputSchema>;
export type ProjectVersionUpdate = z.infer<typeof ProjectVersionUpdateSchema>;

export interface PortfolioItem {
  id: string;
  img: string;
  caption: string;
  description: string;
  category: string[];
  url: string | null;
  github: string | null;
  keyFeatures: string | null;
  role: string | null;
  highlights: string | null;
  projectType: string | null;
  slug: string | null;
  subtitle: string | null;
  summary: string | null;
  problem: string | null;
  solution: string | null;
  architecture: string | null;
  challenges: string | null;
  lessonsLearned: string | null;
  futureImprovements: string | null;
  lifecycleStatus: string;
  publishStatus: string;
  startDate: Date | null;
  endDate: Date | null;
  sortOrder: number;
  gallery: PortfolioGalleryItem[];
  features: string[];
  responsibilities: string[];
  showPlatformSection: boolean;
  platformFeatures: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  docs: string | null;
  heroMediaId: string | null;
  ogMediaId: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface PortfolioItemWithUser extends PortfolioItem {
  createdByUser: {
    email: string;
  };
}

export interface PortfolioMetric {
  id: string;
  portfolioId: string;
  label: string;
  value: string;
  description: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectVersion {
  id: string;
  portfolioId: string;
  year: number;
  version: string;
  title: string;
  description: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export const portfolioItemSelect = {
  id: true,
  img: true,
  caption: true,
  description: true,
  category: true,
  url: true,
  github: true,
  keyFeatures: true,
  role: true,
  highlights: true,
  projectType: true,
  slug: true,
  subtitle: true,
  summary: true,
  problem: true,
  solution: true,
  architecture: true,
  challenges: true,
  lessonsLearned: true,
  futureImprovements: true,
  lifecycleStatus: true,
  publishStatus: true,
  startDate: true,
  endDate: true,
  sortOrder: true,
  gallery: true,
  features: true,
  responsibilities: true,
  showPlatformSection: true,
  platformFeatures: true,
  seoTitle: true,
  seoDescription: true,
  docs: true,
  heroMediaId: true,
  ogMediaId: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
} as const;

export function parsePortfolioGallery(value: unknown): PortfolioGalleryItem[] {
  const parsed = z.array(PortfolioGalleryItemSchema).safeParse(value);
  return parsed.success ? parsed.data : [];
}

export function parsePortfolioStringList(value: unknown): string[] {
  const parsed = PortfolioStringListSchema.safeParse(value);
  return parsed.success ? parsed.data : [];
}

export function mapPortfolioRecord<
  T extends {
    gallery: unknown;
    features: unknown;
    responsibilities: unknown;
  },
>(record: T): T & {
  gallery: PortfolioGalleryItem[];
  features: string[];
  responsibilities: string[];
} {
  return {
    ...record,
    gallery: parsePortfolioGallery(record.gallery),
    features: parsePortfolioStringList(record.features),
    responsibilities: parsePortfolioStringList(record.responsibilities),
  };
}
