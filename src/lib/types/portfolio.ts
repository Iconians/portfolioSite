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

export const PortfolioItemSchema = z.object({
  img: z.string().min(1, "Image path is required"),
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

export type CreatePortfolioInput = z.infer<typeof PortfolioItemSchema>;
export type UpdatePortfolioInput = Partial<CreatePortfolioInput>;

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
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface PortfolioItemWithUser extends PortfolioItem {
  createdByUser: {
    email: string;
  };
}
