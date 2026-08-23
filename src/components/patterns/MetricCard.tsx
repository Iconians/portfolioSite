import { Inline } from "@/components/layout/Stack";
import { Surface } from "@/components/layout/Surface";
import { Label } from "@/components/typography/Label";
import { Text } from "@/components/typography/Text";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

function MetricCard({
  label,
  value,
  description,
  icon,
  className,
}: MetricCardProps) {
  const trimmedDescription = description?.trim();

  return (
    <Surface
      data-slot="metric-card"
      variant="card"
      padding="default"
      className={cn("flex h-full flex-col gap-3 border-border/80", className)}
    >
      <Inline gap="md" className="items-start justify-between">
        <Label>{label}</Label>
        {icon ? (
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-card text-ds-accent"
          >
            {icon}
          </span>
        ) : null}
      </Inline>
      <p className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.625rem]">
        {value}
      </p>
      {trimmedDescription ? (
        <Text variant="muted" className="text-sm leading-relaxed">
          {trimmedDescription}
        </Text>
      ) : (
        <span className="mt-auto" aria-hidden />
      )}
    </Surface>
  );
}

export { MetricCard };
