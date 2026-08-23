import { Quote } from "lucide-react";

import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  title: string;
  content: string;
  stars: number;
  className?: string;
}

function ReviewCard({ title, content, stars, className }: ReviewCardProps) {
  const filledStars = Math.max(0, Math.min(5, stars));

  return (
    <Card
      data-slot="review-card"
      className={cn(
        "border-border/60 bg-card/40 p-4 backdrop-blur transition-colors hover:border-primary/40",
        className
      )}
    >
      <Quote className="mb-3 h-5 w-5 text-primary/40" aria-hidden />
      <Stack gap="sm">
        <Heading level={3} className="text-base">{title}</Heading>
        <Text className="text-sm leading-relaxed text-muted-foreground">
          {content}
        </Text>
        <div className="flex items-center gap-3 border-t border-border/50 pt-3">
          <div className="text-sm text-yellow-400" aria-label={`${filledStars} out of 5 stars`}>
            {"★".repeat(filledStars)}
            {"☆".repeat(5 - filledStars)}
          </div>
        </div>
      </Stack>
    </Card>
  );
}

export { ReviewCard };
