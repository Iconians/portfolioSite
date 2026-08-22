import { ContentWidth } from "@/components/layout/ContentWidth";
import { Section } from "@/components/layout/Section";
import {
  hasProjectActions,
  ProjectActions,
} from "@/components/Portfolio/ProjectActions";
import { Heading } from "@/components/typography/Heading";

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
        <Heading level={3} id="links-heading" className="mb-4 text-xl">
          Project links
        </Heading>
        <ProjectActions
          project={project}
          variant="inline"
          className="justify-center"
        />
      </ContentWidth>
    </Section>
  );
}
