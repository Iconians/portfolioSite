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
        "border-border/50 bg-card/50 p-6 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      <Quote className="mb-4 h-8 w-8 text-primary/40" aria-hidden />
      <Stack gap="sm">
        <Heading level={3} className="text-lg">{title}</Heading>
        <Text className="text-sm leading-relaxed text-foreground/90">
          {content}
        </Text>
        <div className="flex items-center gap-3 border-t border-border/50 pt-4">
          <div className="text-lg text-yellow-400" aria-label={`${filledStars} out of 5 stars`}>
            {"★".repeat(filledStars)}
            {"☆".repeat(5 - filledStars)}
          </div>
        </div>
      </Stack>
    </Card>
  );
}

export { ReviewCard };
