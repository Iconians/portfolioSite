import { Check } from "lucide-react";

import { Surface } from "@/components/layout/Surface";
import { Heading } from "@/components/typography/Heading";
import { Label } from "@/components/typography/Label";
import { Text } from "@/components/typography/Text";

interface ProjectFeatureListProps {
  items: string[];
}

export function ProjectFeatureList({ items }: ProjectFeatureListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Surface
      variant="elevated"
      padding="default"
      className="flex h-full flex-col gap-4"
    >
      <header className="space-y-1">
        <Label>Product</Label>
        <Heading level={3}>Features</Heading>
        <Text variant="description">What the product or platform delivers.</Text>
      </header>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-2.5 text-[0.9375rem] leading-6 text-muted-foreground"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Surface>
  );
}
