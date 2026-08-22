import { Surface } from "@/components/layout/Surface";
import { Heading } from "@/components/typography/Heading";
import { Label } from "@/components/typography/Label";
import { Text } from "@/components/typography/Text";

interface ProjectResponsibilityListProps {
  items: string[];
}

export function ProjectResponsibilityList({ items }: ProjectResponsibilityListProps) {
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
        <Label>Ownership</Label>
        <Heading level={3}>Responsibilities</Heading>
        <Text variant="description">What I personally designed, built, or owned.</Text>
      </header>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-2.5 border-l-2 border-primary/40 pl-3 text-[0.9375rem] leading-6 text-muted-foreground"
          >
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Surface>
  );
}
