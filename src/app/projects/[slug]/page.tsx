import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { Navigation } from "@/components/Nav/Navigation";
import { CaseStudyPage } from "@/components/Portfolio/CaseStudyPage";
import {
  AuthenticationError,
  AuthorizationError,
} from "@/lib/auth/errors";
import { requireAdminUser } from "@/lib/auth/session";
import { getMediaPublicUrlById } from "@/lib/data/media";
import {
  getPortfolioItemBySlug,
  getPublishedPortfolioItemBySlug,
} from "@/lib/data/portfolio";
import { listPublicPortfolioMetrics } from "@/lib/data/portfolio-metrics";
import { listPublicProjectVersions } from "@/lib/data/project-versions";
import { buildProjectPageMetadata } from "@/lib/portfolio/public-project";

import type { Metadata } from "next";

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
    <div className="min-h-screen w-full bg-background text-foreground text-left">
      <Navigation />
      <Container as="main" className="py-16">
        <CaseStudyPage
          project={project}
          metrics={metrics}
          versions={versions}
          isPreview={isPreview}
        />
      </Container>
    </div>
  );
}
