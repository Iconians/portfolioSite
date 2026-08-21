import { Check } from "lucide-react";

import { projectPageStyles } from "@/lib/portfolio/project-page-styles";
import { cn } from "@/lib/utils";

interface ProjectFeatureListProps {
  items: string[];
}

export function ProjectFeatureList({ items }: ProjectFeatureListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <article
      className={cn(
        projectPageStyles.cardElevated,
        projectPageStyles.cardPadding,
        "flex h-full flex-col space-y-4"
      )}
    >
      <header className="space-y-1">
        <p className={projectPageStyles.eyebrow}>Product</p>
        <h3 className={projectPageStyles.subsectionTitle}>Features</h3>
        <p className={projectPageStyles.sectionDescription}>
          What the product or platform delivers.
        </p>
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
    </article>
  );
}
