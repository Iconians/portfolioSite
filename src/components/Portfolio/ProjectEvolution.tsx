import { ProjectEvolutionItem } from "@/components/Portfolio/ProjectEvolutionItem";
import {
  hasProjectEvolution,
  sortProjectVersions,
} from "@/lib/portfolio/project-evolution";
import type { ProjectVersion } from "@/lib/types/portfolio";
import { cn } from "@/lib/utils";

interface ProjectEvolutionProps {
  versions: ProjectVersion[];
  title?: string;
  className?: string;
}

export function ProjectEvolution({
  versions,
  title = "Project evolution",
  className,
}: ProjectEvolutionProps) {
  if (!hasProjectEvolution(versions)) {
    return null;
  }

  const sortedVersions = sortProjectVersions(versions);
  const headingId = "project-evolution-heading";

  return (
    <section
      aria-labelledby={headingId}
      className={cn("rounded-lg border bg-card p-6", className)}
    >
      <h2 id={headingId} className="text-2xl font-semibold">
        {title}
      </h2>
      <ol className="mt-6">
        {sortedVersions.map((version, index) => (
          <ProjectEvolutionItem
            key={version.id}
            version={version}
            isLast={index === sortedVersions.length - 1}
          />
        ))}
      </ol>
    </section>
  );
}
