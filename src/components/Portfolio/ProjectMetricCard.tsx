import { ProjectMetricIcon } from "@/components/Portfolio/ProjectMetricIcon";
import { projectPageStyles } from "@/lib/portfolio/project-page-styles";

import type { PortfolioMetric } from "@/lib/types/portfolio";

interface ProjectMetricCardProps {
  metric: PortfolioMetric;
}

export function ProjectMetricCard({ metric }: ProjectMetricCardProps) {
  const description = metric.description?.trim();

  return (
    <article
      className={`${projectPageStyles.innerSurface} ${projectPageStyles.cardPadding} flex h-full flex-col`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className={projectPageStyles.metricLabel}>{metric.label}</p>
        <span className={projectPageStyles.iconWrap}>
          <ProjectMetricIcon label={metric.label} />
        </span>
      </div>
      <p className={projectPageStyles.metricValue}>{metric.value}</p>
      {description ? (
        <p className={`${projectPageStyles.body} mt-auto pt-3`}>{description}</p>
      ) : (
        <span className="mt-auto" aria-hidden />
      )}
    </article>
  );
}
