import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navigation } from "@/components/Nav/Navigation";
import { ProjectDetailHero } from "@/components/Portfolio/ProjectDetailHero";
import { ProjectEvolution } from "@/components/Portfolio/ProjectEvolution";
import { ProjectLinks } from "@/components/Portfolio/ProjectLinks";
import { ProjectMetrics } from "@/components/Portfolio/ProjectMetrics";
import { ProjectPlatformShowcase } from "@/components/Portfolio/ProjectPlatformShowcase";
import { ProjectStory } from "@/components/Portfolio/ProjectStory";
import { ProjectSummary } from "@/components/Portfolio/ProjectSummary";
import { ProjectTechnologies } from "@/components/Portfolio/ProjectTechnologies";
import { listPublicPortfolioMetrics } from "@/lib/data/portfolio-metrics";
import { listPublicProjectVersions } from "@/lib/data/project-versions";
import { getPublishedPortfolioItemBySlug } from "@/lib/data/portfolio";
import { buildProjectPageMetadata } from "@/lib/portfolio/public-project";

export const revalidate = 3600;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedPortfolioItemBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return buildProjectPageMetadata(project);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedPortfolioItemBySlug(slug);

  if (!project) {
    notFound();
  }

  const [metrics, versions] = await Promise.all([
    listPublicPortfolioMetrics(project.id),
    listPublicProjectVersions(project.id),
  ]);

  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      <main className="container mx-auto max-w-4xl space-y-12 px-4 py-16">
        <ProjectDetailHero project={project} />
        <ProjectSummary project={project} />
        <ProjectTechnologies categories={project.category} />
        <ProjectMetrics metrics={metrics} />
        <ProjectStory project={project} />
        <ProjectEvolution versions={versions} />
        <ProjectPlatformShowcase project={project} />
        <ProjectLinks project={project} />
      </main>
    </div>
  );
}
