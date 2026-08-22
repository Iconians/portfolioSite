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
      variant="inner"
      padding="default"
      className={cn("flex h-full flex-col", className)}
    >
      <Inline gap="md" className="mb-4 items-start justify-between">
        <Label>{label}</Label>
        {icon ? (
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center text-primary"
          >
            {icon}
          </span>
        ) : null}
      </Inline>
      <p
        className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]"
      >
        {value}
      </p>
      {trimmedDescription ? (
        <Text className="mt-auto pt-3">{trimmedDescription}</Text>
      ) : (
        <span className="mt-auto" aria-hidden />
      )}
    </Surface>
  );
}

export { MetricCard };
