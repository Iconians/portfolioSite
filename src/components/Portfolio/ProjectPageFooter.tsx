import { ContentWidth } from "@/components/layout/ContentWidth";
import { Section } from "@/components/layout/Section";
import {
  hasProjectActions,
  ProjectActions,
} from "@/components/Portfolio/ProjectActions";

import type { PortfolioItem } from "@/lib/types/portfolio";

interface ProjectPageFooterProps {
  project: PortfolioItem;
}

export function ProjectPageFooter({ project }: ProjectPageFooterProps) {
  if (!hasProjectActions(project)) {
    return null;
  }

  return (
    <Section
      id="links"
      labelledBy="links-heading"
      className="border-t border-border"
    >
      <ContentWidth width="narrow" className="text-center">
        <h2
          id="links-heading"
          className="mb-4 text-xl font-semibold text-[var(--heading-color)]"
        >
          Project links
        </h2>
        <ProjectActions
          project={project}
          variant="inline"
          className="justify-center"
        />
      </ContentWidth>
    </Section>
  );
}
