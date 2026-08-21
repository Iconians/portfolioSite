import type { PortfolioMetric } from "@/lib/types/portfolio";

interface ProjectMetricCardProps {
  metric: PortfolioMetric;
}

export function ProjectMetricCard({ metric }: ProjectMetricCardProps) {
  const description = metric.description?.trim();

  return (
    <article className="space-y-2 rounded-lg border bg-card p-5">
      <p className="text-sm text-muted-foreground">{metric.label}</p>
      <p className="text-2xl font-semibold tracking-tight">{metric.value}</p>
      {description && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </article>
  );
}
