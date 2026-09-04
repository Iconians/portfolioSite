import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { Navigation } from "@/components/Nav/Navigation";
import { CaseStudyPage } from "@/components/Portfolio/CaseStudyPage";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import {
  AuthenticationError,
  AuthorizationError,
} from "@/lib/auth/errors";
import { requireAdminUser } from "@/lib/auth/session";
import { getMediaPublicUrlById } from "@/lib/data/media";
import {
  getPortfolioItemBySlug,
} from "@/lib/data/portfolio";
import { buildProjectPageMetadata } from "@/lib/portfolio/public-project";
import { getProjectReadProvider } from "@/lib/project-read";

import type { Metadata } from "next";

/** Must match PROJECT_READ_ISR_REVALIDATE_SECONDS in project-read/config. */
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
  const provider = getProjectReadProvider();
  const publishedDetail = await provider.getPublishedProjectDetail(slug);
  if (publishedDetail) {
    return {
      project: publishedDetail.project,
      metrics: publishedDetail.metrics,
      versions: publishedDetail.versions,
      isPreview: false,
    };
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

  const { listPublicPortfolioMetrics } = await import("@/lib/data/portfolio-metrics");
  const { listPublicProjectVersions } = await import("@/lib/data/project-versions");
  const [metrics, versions] = await Promise.all([
    listPublicPortfolioMetrics(draft.id),
    listPublicProjectVersions(draft.id),
  ]);

  return { project: draft, metrics, versions, isPreview: true };
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

  const { project, metrics, versions, isPreview } = loaded;

  return (
    <div className="min-h-screen w-full bg-background text-foreground text-left">
      <Navigation />

      <main>
        <Container className="py-8 md:py-12">
          <CaseStudyPage
            project={project}
            metrics={metrics}
            versions={versions}
            isPreview={isPreview}
          />
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
