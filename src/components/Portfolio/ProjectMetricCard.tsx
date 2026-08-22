import { MetricCard } from "@/components/patterns/MetricCard";
import { ProjectMetricIcon } from "@/components/Portfolio/ProjectMetricIcon";

import type { PortfolioMetric } from "@/lib/types/portfolio";

interface ProjectMetricCardProps {
  metric: PortfolioMetric;
}

export function ProjectMetricCard({ metric }: ProjectMetricCardProps) {
  return (
    <MetricCard
      label={metric.label}
      value={metric.value}
      description={metric.description ?? undefined}
      icon={<ProjectMetricIcon label={metric.label} />}
    />
  );
}
