import { z } from "zod";

import { PROJECT_TYPE_ORDER } from "@/lib/types/portfolio";

export const CreatePortfolioProjectInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  projectType: z.enum(PROJECT_TYPE_ORDER, {
    message: "Project type is required",
  }),
  slug: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .max(255)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
    ])
    .optional(),
});

export type CreatePortfolioProjectInput = z.infer<
  typeof CreatePortfolioProjectInputSchema
>;
