"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card } from "@/app/Components/ui/card";
import { Button } from "@/app/Components/ui/button";
import { deleteReviewAction } from "@/lib/actions/reviews";
import { toast } from "sonner";
import type { Review } from "@/lib/types/reviews";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews: initialReviews }: ReviewListProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    startTransition(async () => {
      const result = await deleteReviewAction(id);
      if (result.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        toast.success("Review deleted");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href={`/admin/reviews/${review.id}`}
                  className="text-xl font-semibold hover:underline"
                >
                  {review.title}
                </Link>
                <div className="text-yellow-400">
                  {"★".repeat(review.stars)}
                  {"☆".repeat(5 - review.stars)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {review.content}
              </p>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/reviews/${review.id}`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(review.id)}
                disabled={isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {reviews.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No reviews yet. Create your first review!
          </p>
        </Card>
      )}
    </div>
  );
}
