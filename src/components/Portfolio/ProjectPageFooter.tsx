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
    <Section id="links" labelledBy="links-heading" className="py-16">
      <ContentWidth width="narrow" className="text-center">
        <Heading variant="eyebrow" className="mb-2">LINKS</Heading>
        <Heading level={3} id="links-heading" className="mb-6 text-lg font-semibold">
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
