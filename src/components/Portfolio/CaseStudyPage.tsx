import { Fragment, type ReactNode } from "react";

import { ProjectDetailHero } from "@/components/Portfolio/ProjectDetailHero";
import { ProjectEvolution } from "@/components/Portfolio/ProjectEvolution";
import { ProjectGallery } from "@/components/Portfolio/ProjectGallery";
import { ProjectMetrics } from "@/components/Portfolio/ProjectMetrics";
import { ProjectPageFooter } from "@/components/Portfolio/ProjectPageFooter";
import { ProjectPlatformShowcase } from "@/components/Portfolio/ProjectPlatformShowcase";
import { ProjectPreviewBanner } from "@/components/Portfolio/ProjectPreviewBanner";
import { ProjectStory } from "@/components/Portfolio/ProjectStory";
import { ProjectSummary } from "@/components/Portfolio/ProjectSummary";
import {
  getVisibleCaseStudySections,
  type CaseStudyLayoutContext,
  type CaseStudySectionKey,
} from "@/lib/portfolio/case-study-layout";

import type { PortfolioItem, PortfolioMetric, ProjectVersion } from "@/lib/types/portfolio";

interface CaseStudyPageProps {
  project: PortfolioItem;
  metrics: PortfolioMetric[];
  versions: ProjectVersion[];
  isPreview: boolean;
}

function renderCaseStudySection(
  key: CaseStudySectionKey,
  context: CaseStudyLayoutContext
): ReactNode {
  const { project, metrics, versions } = context;

  switch (key) {
    case "preview-banner":
      return (
        <div className="mb-8">
          <ProjectPreviewBanner publishStatus={project.publishStatus} />
        </div>
      );
    case "hero":
      return <ProjectDetailHero project={project} />;
    case "summary":
      return <ProjectSummary project={project} />;
    case "metrics":
      return <ProjectMetrics metrics={metrics} />;
    case "story":
      return <ProjectStory project={project} />;
    case "evolution":
      return <ProjectEvolution versions={versions} />;
    case "platform":
      return <ProjectPlatformShowcase project={project} />;
    case "gallery":
      return <ProjectGallery gallery={project.gallery} />;
    case "links":
      return <ProjectPageFooter project={project} />;
    default:
      return null;
  }
}

export function CaseStudyPage({
  project,
  metrics,
  versions,
  isPreview,
}: CaseStudyPageProps) {
  const context: CaseStudyLayoutContext = {
    project,
    metrics,
    versions,
    isPreview,
  };

  const sections = getVisibleCaseStudySections(context);

  return (
    <>
      {sections.map((section) => (
        <Fragment key={section.key}>
          {renderCaseStudySection(section.key, context)}
        </Fragment>
      ))}
    </>
  );
}
