import { ProjectArchitectureSection } from "@/components/Portfolio/ProjectArchitectureSection";
import { ProjectFeatureList } from "@/components/Portfolio/ProjectFeatureList";
import { ProjectPageSection } from "@/components/Portfolio/ProjectPageSection";
import { ProjectResponsibilityList } from "@/components/Portfolio/ProjectResponsibilityList";
import {
  ProjectStoryCallout,
  ProjectStorySection,
} from "@/components/Portfolio/ProjectStorySection";
import { projectPageStyles } from "@/lib/portfolio/project-page-styles";
import {
  formatProjectDateRange,
  getProjectStoryListItems,
  getProjectStorySections,
  hasProjectStoryContent,
  type ProjectStorySection as StorySection,
} from "@/lib/portfolio/project-story";
import type { PortfolioItem } from "@/lib/types/portfolio";

interface ProjectStoryProps {
  project: PortfolioItem;
}

function getStoryContent(
  sections: StorySection[],
  title: string
): string | undefined {
  return sections.find((section) => section.title === title)?.content;
}

export function ProjectStory({ project }: ProjectStoryProps) {
  if (!hasProjectStoryContent(project)) {
    return null;
  }

  const sections = getProjectStorySections(project);
  const problem = getStoryContent(sections, "Problem");
  const solution = getStoryContent(sections, "Solution");
  const architecture = getStoryContent(sections, "Architecture");
  const challenges = getStoryContent(sections, "Challenges");
  const lessonsLearned = getStoryContent(sections, "Lessons learned");
  const futureImprovements = getStoryContent(sections, "Future improvements");
  const features = getProjectStoryListItems(project.features);
  const responsibilities = getProjectStoryListItems(project.responsibilities);
  const dateRange = formatProjectDateRange(project.startDate, project.endDate);

  return (
    <ProjectPageSection
      id="story"
      title="Engineering story"
      description="How the platform was scoped, built, and refined."
      width="article"
    >
      <div className="space-y-6 md:space-y-7">
        {(problem || solution) && (
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {problem ? (
              <ProjectStorySection title="Problem" content={problem} variant="card" />
            ) : null}
            {solution ? (
              <ProjectStorySection title="Solution" content={solution} variant="card" />
            ) : null}
          </div>
        )}

        {architecture ? <ProjectArchitectureSection content={architecture} /> : null}

        {(challenges || lessonsLearned) && (
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {challenges ? (
              <ProjectStorySection title="Challenges" content={challenges} variant="card" />
            ) : null}
            {lessonsLearned ? (
              <ProjectStorySection
                title="Lessons learned"
                content={lessonsLearned}
                variant="card"
              />
            ) : null}
          </div>
        )}

        {futureImprovements ? (
          <ProjectStoryCallout title="Future improvements" content={futureImprovements} />
        ) : null}

        {(features.length > 0 || responsibilities.length > 0) && (
          <div className="grid items-stretch gap-4 md:grid-cols-2 md:gap-5">
            <ProjectFeatureList items={features} />
            <ProjectResponsibilityList items={responsibilities} />
          </div>
        )}

        {dateRange ? (
          <p
            className={`${projectPageStyles.eyebrow} border-t border-[var(--blog-card-border)] pt-5`}
          >
            Project timeline · {dateRange}
          </p>
        ) : null}
      </div>
    </ProjectPageSection>
  );
}
