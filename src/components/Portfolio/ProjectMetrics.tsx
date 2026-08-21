import { ProjectMetricCard } from "@/components/Portfolio/ProjectMetricCard";
import { ProjectPageSection } from "@/components/Portfolio/ProjectPageSection";
import {
  hasProjectMetrics,
  sortPortfolioMetrics,
} from "@/lib/portfolio/project-metrics";
import type { PortfolioMetric } from "@/lib/types/portfolio";

interface ProjectMetricsProps {
  metrics: PortfolioMetric[];
}

export function ProjectMetrics({ metrics }: ProjectMetricsProps) {
  if (!hasProjectMetrics(metrics)) {
    return null;
  }

  const sortedMetrics = sortPortfolioMetrics(metrics);

  return (
    <ProjectPageSection
      id="metrics"
      title="Metrics"
      description="Key signals from building and operating the platform."
      width="wide"
      surface
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {sortedMetrics.map((metric) => (
          <ProjectMetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </ProjectPageSection>
  );
}
