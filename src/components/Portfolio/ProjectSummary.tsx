import { Badge } from "@/components/ui/badge";
import { projectPageStyles } from "@/lib/portfolio/project-page-styles";
import { getProjectCardSummary, uniqueCategories } from "@/lib/portfolio/public-project";

import { ProjectPageSection } from "./ProjectPageSection";

import type { PortfolioItem } from "@/lib/types/portfolio";


interface ProjectSummaryProps {
  project: PortfolioItem;
}

export function ProjectSummary({ project }: ProjectSummaryProps) {
  const summary = getProjectCardSummary(project);
  const technologies = uniqueCategories(project.category);

  if (!summary.trim() && technologies.length === 0) {
    return null;
  }

  return (
    <ProjectPageSection id="summary" title="Summary" width="narrow" align="center">
      {summary.trim() ? (
        <p className={projectPageStyles.bodyLarge}>{summary}</p>
      ) : null}
      {technologies.length > 0 ? (
        <div
          className={
            summary.trim()
              ? "mt-5 flex flex-wrap justify-center gap-2 border-t border-border pt-5"
              : "flex flex-wrap justify-center gap-2"
          }
        >
          {technologies.map((category) => (
            <Badge key={category} variant="secondary" className="px-2.5 py-0.5 text-xs">
              {category}
            </Badge>
          ))}
        </div>
      ) : null}
    </ProjectPageSection>
  );
}
