import { ProjectStorySection } from "@/components/Portfolio/ProjectStorySection";
import {
  formatProjectDateRange,
  getProjectStoryListItems,
  getProjectStorySections,
  hasProjectStoryContent,
} from "@/lib/portfolio/project-story";
import type { PortfolioItem } from "@/lib/types/portfolio";

interface ProjectStoryProps {
  project: PortfolioItem;
}

function ProjectStoryList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <article className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="space-y-2 text-muted-foreground">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-3 leading-relaxed">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ProjectStory({ project }: ProjectStoryProps) {
  if (!hasProjectStoryContent(project)) {
    return null;
  }

  const sections = getProjectStorySections(project);
  const features = getProjectStoryListItems(project.features);
  const responsibilities = getProjectStoryListItems(project.responsibilities);
  const dateRange = formatProjectDateRange(project.startDate, project.endDate);

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold">Engineering story</h2>
      <div className="space-y-8">
        {sections.map((section) => (
          <ProjectStorySection
            key={section.title}
            title={section.title}
            content={section.content}
          />
        ))}
        <ProjectStoryList title="Features" items={features} />
        <ProjectStoryList title="Responsibilities" items={responsibilities} />
        {dateRange && (
          <article className="space-y-3">
            <h3 className="text-lg font-semibold">Project timeline</h3>
            <p className="text-muted-foreground leading-relaxed">{dateRange}</p>
          </article>
        )}
      </div>
    </section>
  );
}
