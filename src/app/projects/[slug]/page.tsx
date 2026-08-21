import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navigation } from "@/components/Nav/Navigation";
import { ProjectDetailHero } from "@/components/Portfolio/ProjectDetailHero";
import { ProjectEvolution } from "@/components/Portfolio/ProjectEvolution";
import { ProjectGallery } from "@/components/Portfolio/ProjectGallery";
import { ProjectMetrics } from "@/components/Portfolio/ProjectMetrics";
import { ProjectPageFooter } from "@/components/Portfolio/ProjectPageFooter";
import { ProjectPlatformShowcase } from "@/components/Portfolio/ProjectPlatformShowcase";
import { ProjectPreviewBanner } from "@/components/Portfolio/ProjectPreviewBanner";
import { ProjectStory } from "@/components/Portfolio/ProjectStory";
import { ProjectSummary } from "@/components/Portfolio/ProjectSummary";
import { getMediaPublicUrlById } from "@/lib/data/media";
import { listPublicPortfolioMetrics } from "@/lib/data/portfolio-metrics";
import { listPublicProjectVersions } from "@/lib/data/project-versions";
import {
  getPortfolioItemBySlug,
  getPublishedPortfolioItemBySlug,
} from "@/lib/data/portfolio";
import { requireAdminUser } from "@/lib/auth/session";
import {
  AuthenticationError,
  AuthorizationError,
} from "@/lib/auth/errors";
import { buildProjectPageMetadata } from "@/lib/portfolio/public-project";
import { projectPageStyles } from "@/lib/portfolio/project-page-styles";

export const revalidate = 3600;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

async function resolveOgImageUrl(project: {
  img: string;
  ogMediaId: string | null;
}): Promise<string | null> {
  if (project.ogMediaId) {
    const ogUrl = await getMediaPublicUrlById(project.ogMediaId);
    if (ogUrl) {
      return ogUrl;
    }
  }

  return project.img;
}

async function loadProjectForPage(slug: string, previewRequested: boolean) {
  const published = await getPublishedPortfolioItemBySlug(slug);
  if (published) {
    return { project: published, isPreview: false };
  }

  if (!previewRequested) {
    return null;
  }

  try {
    await requireAdminUser();
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      return null;
    }

    throw error;
  }

  const draft = await getPortfolioItemBySlug(slug);
  if (!draft) {
    return null;
  }

  return { project: draft, isPreview: true };
}

export async function generateMetadata({
  params,
  searchParams,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const loaded = await loadProjectForPage(slug, preview === "1");

  if (!loaded) {
    return { title: "Project Not Found", robots: { index: false, follow: false } };
  }

  const ogImageUrl = await resolveOgImageUrl(loaded.project);

  return buildProjectPageMetadata(loaded.project, {
    preview: loaded.isPreview,
    ogImageUrl,
  });
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const loaded = await loadProjectForPage(slug, preview === "1");

  if (!loaded) {
    notFound();
  }

  const { project, isPreview } = loaded;

  const [metrics, versions] = await Promise.all([
    listPublicPortfolioMetrics(project.id),
    listPublicProjectVersions(project.id),
  ]);

  return (
    <div className={`${projectPageStyles.page} text-left`}>
      <Navigation />
      <main className={projectPageStyles.main}>
        {isPreview ? (
          <div className="mb-8">
            <ProjectPreviewBanner publishStatus={project.publishStatus} />
          </div>
        ) : null}
        <ProjectDetailHero project={project} />
        <ProjectSummary project={project} />
        <ProjectMetrics metrics={metrics} />
        <ProjectStory project={project} />
        <ProjectEvolution versions={versions} />
        <ProjectPlatformShowcase project={project} />
        <ProjectGallery gallery={project.gallery} />
        <ProjectPageFooter project={project} />
      </main>
    </div>
  );
}
