import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/Admin/layout/PageHeader";
import { ProjectEditor } from "@/components/Admin/portfolio/ProjectEditor";
import { Button } from "@/components/ui/button";
import { getMediaAssetById } from "@/lib/data/media";
import { getPortfolioItemById } from "@/lib/data/portfolio";
import { listMetricsForPortfolio, listVersionsForPortfolio } from "@/lib/portfolio/portfolio.service";
import { mapPortfolioItemToEditorValues } from "@/lib/portfolio/project-editor";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPortfolioItemById(id);

  if (!item) {
    notFound();
  }

  let initialOgImageUrl = "";
  if (item.ogMediaId) {
    const ogMedia = await getMediaAssetById(item.ogMediaId);
    initialOgImageUrl = ogMedia?.publicUrl ?? "";
  }

  const initialMetrics = await listMetricsForPortfolio(item.id);
  const initialVersions = await listVersionsForPortfolio(item.id);

  return (
    <div>
      <PageHeader
        title="Edit Project"
        description="Update project details, story, metrics, evolution, platform showcase, and SEO."
        breadcrumbs={[
          { label: "Portfolio", href: "/admin/portfolio" },
          { label: "Edit" },
          { label: item.caption },
        ]}
        actions={
          item.slug ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/projects/${item.slug}?preview=1`} target="_blank" rel="noopener noreferrer">
                Preview project
              </Link>
            </Button>
          ) : null
        }
      />
      <ProjectEditor
        portfolioId={item.id}
        initialValues={mapPortfolioItemToEditorValues(item)}
        initialOgImageUrl={initialOgImageUrl}
        initialMetrics={initialMetrics}
        initialVersions={initialVersions}
      />
    </div>
  );
}
