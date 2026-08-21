import { ProjectEvolutionItem } from "@/components/Portfolio/ProjectEvolutionItem";
import { ProjectPageSection } from "@/components/Portfolio/ProjectPageSection";
import {
  hasProjectEvolution,
  sortProjectVersions,
} from "@/lib/portfolio/project-evolution";
import { projectPageStyles } from "@/lib/portfolio/project-page-styles";

import type { ProjectVersion } from "@/lib/types/portfolio";

interface ProjectEvolutionProps {
  versions: ProjectVersion[];
  title?: string;
  className?: string;
}

export function ProjectEvolution({
  versions,
  title = "Timeline",
  className,
}: ProjectEvolutionProps) {
  if (!hasProjectEvolution(versions)) {
    return null;
  }

  const sortedVersions = sortProjectVersions(versions);

  return (
    <ProjectPageSection
      id="evolution"
      title={title}
      description="Major milestones across the project lifecycle."
      width="wide"
      surface
      className={className}
    >
      <ol className={projectPageStyles.cardPadding}>
        {sortedVersions.map((version, index) => (
          <ProjectEvolutionItem
            key={version.id}
            version={version}
            isLast={index === sortedVersions.length - 1}
          />
        ))}
      </ol>
    </ProjectPageSection>
  );
}
