import { ReviewCard } from "@/components/patterns/ReviewCard";

import type { Review } from "@/lib/types/reviews";

interface ReviewComponentProps {
  initialReviews: Review[];
}

export const ReviewComponent = ({ initialReviews }: ReviewComponentProps) => {
  if (!initialReviews || initialReviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="py-20">
      <div className="mb-12">
        <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl">
          Client Reviews
        </h2>
        <p className="text-lg text-muted-foreground">
          What clients say about working with me
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialReviews.map((item) => (
          <ReviewCard
            key={item.id}
            title={item.title}
            content={item.content}
            stars={item.stars}
          />
        ))}
      </div>
    </section>
  );
};
