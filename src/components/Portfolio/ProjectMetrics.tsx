import { MetricGrid } from "@/components/patterns/MetricGrid";
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
      eyebrow="EVIDENCE"
      title="Metrics"
      description="Signals from building and operating the system—not vanity counters."
      width="wide"
      surface
    >
      <MetricGrid>
        {sortedMetrics.map((metric) => (
          <ProjectMetricCard key={metric.id} metric={metric} />
        ))}
      </MetricGrid>
    </ProjectPageSection>
  );
}
