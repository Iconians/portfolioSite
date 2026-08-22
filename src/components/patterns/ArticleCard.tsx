import Image from "next/image";

import { Stack } from "@/components/layout/Stack";
import { Text } from "@/components/typography/Text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  title: string;
  description?: string;
  date?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  className?: string;
}

function ArticleCard({
  title,
  description,
  date,
  coverImageUrl,
  coverImageAlt,
  className,
}: ArticleCardProps) {
  return (
    <Card
      data-slot="article-card"
      className={cn(
        "group h-full cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-lg",
        className
      )}
    >
      {coverImageUrl ? (
        <div className="relative aspect-[16/9] bg-muted">
          <Image
            src={coverImageUrl}
            alt={coverImageAlt || title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ) : null}
      <CardHeader>
        <CardTitle className="text-xl transition-colors group-hover:text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="sm">
          {description ? (
            <Text variant="muted" className="text-sm leading-relaxed">
              {description}
            </Text>
          ) : null}
          {date ? (
            <Text variant="muted" className="text-xs">{date}</Text>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export { ArticleCard };
