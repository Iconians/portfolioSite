import { z } from "zod";

export const ReviewSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  stars: z.number().int().min(1).max(5),
});

export type CreateReviewInput = z.infer<typeof ReviewSchema>;
export type UpdateReviewInput = Partial<CreateReviewInput>;

export interface Review {
  id: string;
  title: string;
  content: string;
  stars: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ReviewWithUser extends Review {
  createdByUser: {
    email: string;
  };
}
