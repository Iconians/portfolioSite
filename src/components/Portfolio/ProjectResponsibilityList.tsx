import { projectPageStyles } from "@/lib/portfolio/project-page-styles";
import { cn } from "@/lib/utils";

interface ProjectResponsibilityListProps {
  items: string[];
}

export function ProjectResponsibilityList({ items }: ProjectResponsibilityListProps) {
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
        <p className={projectPageStyles.eyebrow}>Ownership</p>
        <h3 className={projectPageStyles.subsectionTitle}>Responsibilities</h3>
        <p className={projectPageStyles.sectionDescription}>
          What I personally designed, built, or owned.
        </p>
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
    </article>
  );
}
