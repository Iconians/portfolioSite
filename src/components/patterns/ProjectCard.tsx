import Image from "next/image";

import { Inline, Stack } from "@/components/layout/Stack";
import { Text } from "@/components/typography/Text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface ProjectCardProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  eyebrow?: string;
  badges?: string[];
  footer?: ReactNode;
  className?: string;
}

function ProjectCard({
  imageUrl,
  imageAlt,
  title,
  description,
  eyebrow,
  badges,
  footer,
  className,
}: ProjectCardProps) {
  return (
    <Card
      data-slot="project-card"
      className={cn("group flex h-full flex-col overflow-hidden", className)}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          width={600}
          height={400}
          src={imageUrl}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform motion-reduce:transform-none group-hover:scale-105 group-focus-within:scale-105"
        />
      </div>
      <CardHeader className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-wider text-ds-accent">
            {eyebrow}
          </p>
        ) : null}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <Stack gap="md" className="flex-1">
          <Text variant="muted" className="text-sm leading-relaxed">
            {description}
          </Text>
          {badges && badges.length > 0 ? (
            <Inline gap="sm" className="flex-wrap pt-1">
              {badges.map((badge) => (
                <Badge key={badge} variant="secondary">{badge}</Badge>
              ))}
            </Inline>
          ) : null}
          {footer ? (
            <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border pt-3">
              {footer}
            </div>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export { ProjectCard };
