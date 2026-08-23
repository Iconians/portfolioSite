import { Timeline } from "@/components/patterns/Timeline";
import { ProjectEvolutionItem } from "@/components/Portfolio/ProjectEvolutionItem";
import { ProjectPageSection } from "@/components/Portfolio/ProjectPageSection";
import {
  hasProjectEvolution,
  sortProjectVersions,
} from "@/lib/portfolio/project-evolution";

import type { ProjectVersion } from "@/lib/types/portfolio";

interface ProjectEvolutionProps {
  versions: ProjectVersion[];
  title?: string;
  className?: string;
}

export function ProjectEvolution({
  versions,
  title = "How it evolved",
  className,
}: ProjectEvolutionProps) {
  if (!hasProjectEvolution(versions)) {
    return null;
  }

  const sortedVersions = sortProjectVersions(versions);

  return (
    <ProjectPageSection
      id="evolution"
      eyebrow="EVOLUTION"
      title={title}
      description="Major milestones across the project lifecycle."
      width="wide"
      surface
      className={className}
    >
      <Timeline>
        {sortedVersions.map((version, index) => (
          <ProjectEvolutionItem
            key={version.id}
            version={version}
            isLast={index === sortedVersions.length - 1}
          />
        ))}
      </Timeline>
    </ProjectPageSection>
  );
}
