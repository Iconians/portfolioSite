import { ProjectEvolutionItem } from "@/components/Portfolio/ProjectEvolutionItem";
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
  if (versions.length === 0) {
    return null;
  }

  return (
    <section className={cn("rounded-lg border bg-card p-6", className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <ol className="mt-6">
        {versions.map((version, index) => (
          <ProjectEvolutionItem
            key={version.id}
            version={version}
            isLast={index === versions.length - 1}
          />
        ))}
      </ol>
    </section>
  );
}
