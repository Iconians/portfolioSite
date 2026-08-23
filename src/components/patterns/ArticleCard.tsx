import Image from "next/image";

import { Inline, Stack } from "@/components/layout/Stack";
import { Text } from "@/components/typography/Text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatReadTime } from "@/lib/articles/read-time";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  title: string;
  description?: string;
  date?: string;
  primaryTag?: string;
  readTimeMinutes?: number;
  coverImageUrl?: string;
  coverImageAlt?: string;
  className?: string;
}

function ArticleCard({
  title,
  description,
  date,
  primaryTag,
  readTimeMinutes,
  coverImageUrl,
  coverImageAlt,
  className,
}: ArticleCardProps) {
  return (
    <Card
      data-slot="article-card"
      className={cn(
        "group h-full cursor-pointer overflow-hidden transition-colors hover:border-ds-accent/40 focus-within:border-ds-accent/40",
        className
      )}
    >
      {coverImageUrl ? (
        <div className="relative aspect-[16/9] bg-muted">
          <Image
            src={coverImageUrl}
            alt={coverImageAlt || title}
            fill
            className="object-cover transition-transform motion-reduce:transform-none group-hover:scale-105 group-focus-within:scale-105"
          />
        </div>
      ) : null}
      <CardHeader className="space-y-3">
        <Inline gap="sm" className="flex-wrap items-center">
          {primaryTag ? (
            <Badge variant="secondary" className="text-xs">
              {primaryTag}
            </Badge>
          ) : null}
          {readTimeMinutes ? (
            <Text variant="muted" className="text-xs">
              {formatReadTime(readTimeMinutes)}
            </Text>
          ) : null}
        </Inline>
        <CardTitle className="text-xl transition-colors group-hover:text-ds-accent group-focus-within:text-ds-accent">
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
