"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReviewSchema, type CreateReviewInput } from "@/lib/types/reviews";
import { createReviewAction, updateReviewAction } from "@/lib/actions/reviews";
import { Button } from "@/app/Components/ui/button";
import { Input } from "@/app/Components/ui/input";
import { Textarea } from "@/app/Components/ui/textarea";
import { Label } from "@/app/Components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  initialData?: Partial<CreateReviewInput>;
  reviewId?: string;
  onSuccess?: () => void;
}

export function ReviewForm({
  initialData,
  reviewId,
  onSuccess,
}: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stars, setStars] = useState(initialData?.stars || 5);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: CreateReviewInput) => {
    startTransition(async () => {
      const result = reviewId
        ? await updateReviewAction(reviewId, { ...data, stars })
        : await createReviewAction({ ...data, stars });

      if (result.success) {
        toast.success(
          reviewId
            ? "Review updated successfully"
            : "Review created successfully"
        );
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin/reviews");
          router.refresh();
        }
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title")}
          disabled={isPending}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          {...register("content")}
          disabled={isPending}
          rows={6}
          className={errors.content ? "border-red-500" : ""}
        />
        {errors.content && (
          <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
        )}
      </div>

      <div>
        <Label>Rating</Label>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setStars(star)}
              className={`text-2xl ${
                star <= stars ? "text-yellow-400" : "text-gray-300"
              }`}
              disabled={isPending}
            >
              ★
            </button>
          ))}
        </div>
        <input type="hidden" {...register("stars")} value={stars} />
        {errors.stars && (
          <p className="text-sm text-red-500 mt-1">{errors.stars.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : reviewId ? "Update Review" : "Create Review"}
      </Button>
    </form>
  );
}
