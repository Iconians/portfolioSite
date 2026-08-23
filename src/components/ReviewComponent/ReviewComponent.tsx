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
    <Section id="reviews" className="py-16">
      <Stack gap="sm" className="mb-10">
        <Heading variant="eyebrow">VALIDATION</Heading>
        <Heading level={2} className="text-balance">
          Client feedback
        </Heading>
        <Text variant="description">
          Short quotes from clients—supporting validation, not the headline story.
        </Text>
      </Stack>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
