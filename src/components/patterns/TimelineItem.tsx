import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface TimelineItemProps {
  eyebrow?: string;
  meta?: string;
  title: string;
  isLast?: boolean;
  children?: ReactNode;
  className?: string;
}

function TimelineItem({
  eyebrow,
  meta,
  title,
  isLast = false,
  children,
  className,
}: TimelineItemProps) {
  return (
    <li
      data-slot="timeline-item"
      className={cn("relative pb-7 pl-10 last:pb-0", className)}
    >
      {!isLast ? (
        <span
          aria-hidden="true"
          className="absolute left-[11px] top-[1.125rem] h-[calc(100%-1.125rem)] w-px bg-border"
        />
      ) : null}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card"
      >
        <span className="h-2 w-2 rounded-full bg-primary" />
      </span>
      <Stack gap="sm" className="space-y-1.5">
        {eyebrow ? <Heading variant="eyebrow">{eyebrow}</Heading> : null}
        {meta ? (
          <Text variant="muted" className="text-xs font-medium">{meta}</Text>
        ) : null}
        <Heading
          level={3}
          className="tracking-tight text-foreground md:text-[1.0625rem]"
        >
          {title}
        </Heading>
        {children}
      </Stack>
    </li>
  );
}

export { TimelineItem };
