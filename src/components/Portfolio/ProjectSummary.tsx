import { Surface } from "@/components/layout/Surface";
import { Text } from "@/components/typography/Text";
import { Badge } from "@/components/ui/badge";
import { getProjectCardSummary, uniqueCategories } from "@/lib/portfolio/public-project";
import { cn } from "@/lib/utils";

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
    <ProjectPageSection
      id="summary"
      eyebrow="OVERVIEW"
      title="Summary"
      width="narrow"
      align="center"
    >
      <Surface variant="elevated" padding="default" className="text-left md:text-center">
        {summary.trim() ? (
          <Text variant="bodyLarge" className="text-pretty leading-relaxed">
            {summary}
          </Text>
        ) : null}
        {technologies.length > 0 ? (
          <div
            className={cn(
              "flex flex-wrap gap-2 md:justify-center",
              summary.trim() && "mt-5 border-t border-border pt-5"
            )}
          >
            {technologies.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        ) : null}
      </Surface>
    </ProjectPageSection>
  );
}
