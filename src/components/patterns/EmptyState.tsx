import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card data-slot="empty-state" className={cn("p-12 text-center", className)}>
      <Stack gap="sm">
        <Heading level={3} className="text-lg">{title}</Heading>
        {description ? (
          <Text variant="muted">{description}</Text>
        ) : null}
        {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
      </Stack>
    </Card>
  );
}

export { EmptyState };
