import { db } from "@/lib/db/client";
import { requireAdmin } from "@/lib/permissions";
import type {
  CreateReviewInput,
  UpdateReviewInput,
  Review,
  ReviewWithUser,
} from "@/lib/types/reviews";
import { ReviewSchema } from "@/lib/types/reviews";
import { z } from "zod";

// Public queries (no auth required)
export async function getAllReviews(): Promise<Review[]> {
  return db.review.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      stars: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
    },
  });
}

export async function getReviewById(
  id: string
): Promise<ReviewWithUser | null> {
  return db.review.findUnique({
    where: { id },
    include: {
      createdByUser: {
        select: { email: true },
      },
    },
  });
}

// Admin-only mutations (enforce auth)
export async function createReview(data: CreateReviewInput): Promise<Review> {
  const user = await requireAdmin();

  // Validate input with Zod
  const validatedData = ReviewSchema.parse(data);

  return db.review.create({
    data: {
      ...validatedData,
      createdBy: user.id,
    },
  });
}

export async function updateReview(
  id: string,
  data: UpdateReviewInput
): Promise<Review> {
  const user = await requireAdmin();

  const review = await db.review.findUnique({ where: { id } });
  if (!review) {
    throw new Error("Review not found");
  }

  // Explicit ownership check
  if (review.createdBy !== user.id && user.role !== "admin") {
    throw new Error(
      "Forbidden: You do not have permission to edit this review"
    );
  }

  // Validate partial input
  const validatedData = ReviewSchema.partial().parse(data);

  return db.review.update({
    where: { id },
    data: {
      ...validatedData,
      updatedAt: new Date(),
    },
  });
}

export async function deleteReview(id: string): Promise<void> {
  const user = await requireAdmin();

  const review = await db.review.findUnique({ where: { id } });
  if (!review) {
    throw new Error("Review not found");
  }

  if (review.createdBy !== user.id && user.role !== "admin") {
    throw new Error(
      "Forbidden: You do not have permission to delete this review"
    );
  }

  await db.review.delete({ where: { id } });
}
