import type { PortfolioItem } from "@/lib/types/portfolio";

export const PROJECT_STORY_SECTIONS = [
  { key: "problem", title: "Problem" },
  { key: "solution", title: "Solution" },
  { key: "architecture", title: "Architecture" },
  { key: "challenges", title: "Challenges" },
  { key: "lessonsLearned", title: "Lessons learned" },
  { key: "futureImprovements", title: "Future improvements" },
] as const satisfies ReadonlyArray<{
  key: keyof Pick<
    PortfolioItem,
    | "problem"
    | "solution"
    | "architecture"
    | "challenges"
    | "lessonsLearned"
    | "futureImprovements"
  >;
  title: string;
}>;

export interface ProjectStorySection {
  title: string;
  content: string;
}

const projectDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatProjectDate(value: Date): string {
  return projectDateFormatter.format(value);
}

export function formatProjectDateRange(
  startDate: Date | null,
  endDate: Date | null
): string | null {
  if (!startDate && !endDate) {
    return null;
  }

  if (startDate && endDate) {
    return `${formatProjectDate(startDate)} – ${formatProjectDate(endDate)}`;
  }

  if (startDate) {
    return `Started ${formatProjectDate(startDate)}`;
  }

  if (endDate) {
    return `Completed ${formatProjectDate(endDate)}`;
  }

  return null;
}

export function getProjectStorySections(
  project: PortfolioItem
): ProjectStorySection[] {
  return PROJECT_STORY_SECTIONS.flatMap(({ key, title }) => {
    const content = project[key]?.trim();
    return content ? [{ title, content }] : [];
  });
}

export function getProjectStoryListItems(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

export function hasProjectStoryContent(project: PortfolioItem): boolean {
  return (
    getProjectStorySections(project).length > 0 ||
    getProjectStoryListItems(project.features).length > 0 ||
    getProjectStoryListItems(project.responsibilities).length > 0 ||
    Boolean(formatProjectDateRange(project.startDate, project.endDate))
  );
}
