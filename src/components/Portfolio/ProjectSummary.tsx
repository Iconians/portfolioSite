import { getProjectCardSummary } from "@/lib/portfolio/public-project";
import type { PortfolioItem } from "@/lib/types/portfolio";

interface ProjectSummaryProps {
  project: PortfolioItem;
}

export function ProjectSummary({ project }: ProjectSummaryProps) {
  const summary = getProjectCardSummary(project);

  if (!summary.trim()) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">Summary</h2>
      <p className="max-w-3xl text-muted-foreground leading-relaxed">{summary}</p>
    </section>
  );
}
