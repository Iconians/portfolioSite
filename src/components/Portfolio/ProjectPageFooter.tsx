import {
  hasProjectActions,
  ProjectActions,
} from "@/components/Portfolio/ProjectActions";
import { projectPageStyles } from "@/lib/portfolio/project-page-styles";

import type { PortfolioItem } from "@/lib/types/portfolio";

interface ProjectPageFooterProps {
  project: PortfolioItem;
}

export function ProjectPageFooter({ project }: ProjectPageFooterProps) {
  if (!hasProjectActions(project)) {
    return null;
  }

  return (
    <section
      id="links"
      aria-labelledby="links-heading"
      className={`${projectPageStyles.sectionGap} border-t border-border`}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="links-heading" className="mb-4 text-xl font-semibold text-[var(--heading-color)]">
          Project links
        </h2>
        <ProjectActions
          project={project}
          variant="inline"
          className="justify-center"
        />
      </div>
    </section>
  );
}
