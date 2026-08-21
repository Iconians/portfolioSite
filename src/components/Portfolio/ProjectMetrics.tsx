import { ProjectMetricCard } from "@/components/Portfolio/ProjectMetricCard";
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
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Metrics</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedMetrics.map((metric) => (
          <ProjectMetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  );
}
