import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { ReviewCard } from "@/components/patterns/ReviewCard";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

import type { Review } from "@/lib/types/reviews";

interface ReviewComponentProps {
  initialReviews: Review[];
}

export function ReviewComponent({ initialReviews }: ReviewComponentProps) {
  if (!initialReviews || initialReviews.length === 0) {
    return null;
  }

  return (
    <Section id="reviews" className="py-20">
      <Stack gap="sm" className="mb-12">
        <Heading level={2} className="text-balance">
          Client Reviews
        </Heading>
        <Text variant="description">
          What clients say about working with me
        </Text>
      </Stack>

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
    </Section>
  );
}
