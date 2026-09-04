import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/Admin/layout/PageHeader";
import { AdminProjectLoadErrorState } from "@/components/Admin/portfolio/AdminProjectLoadErrorState";
import { ProjectEditor } from "@/components/Admin/portfolio/ProjectEditor";
import { Button } from "@/components/ui/button";
import { loadAdminProjectEditorState } from "@/lib/project-write/admin-project-load";
import { AdminProjectLoadError } from "@/lib/project-write/admin-project-load-error";
import { getProjectWriteSource } from "@/lib/project-write/config";
import {
  PlatformApiAdminNetworkError,
  PlatformApiAdminResponseError,
} from "@/lib/project-write/errors";

import type { AdminProjectEditorLoadResult } from "@/lib/project-write/platform-admin-mapper";

function formatAdminLoadError(error: unknown): string {
  if (error instanceof AdminProjectLoadError) {
    return error.message;
  }
  if (error instanceof PlatformApiAdminResponseError) {
    return error.detail ?? error.message;
  }
  if (error instanceof PlatformApiAdminNetworkError) {
    return "Platform API admin request failed. Check connectivity and configuration.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Failed to load project from Platform API.";
}

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let loaded: AdminProjectEditorLoadResult | undefined;
  let loadError: unknown;

  try {
    loaded = await loadAdminProjectEditorState(id);
  } catch (error) {
    if (error instanceof AdminProjectLoadError && error.message === "Portfolio project not found") {
      notFound();
    }
    loadError = error;
  }

  if (loadError) {
    return (
      <div>
        <PageHeader
          title="Edit Project"
          description="Unable to load project editor state."
          breadcrumbs={[
            { label: "Portfolio", href: "/admin/portfolio" },
            { label: "Edit" },
          ]}
        />
        <AdminProjectLoadErrorState message={formatAdminLoadError(loadError)} />
      </div>
    );
  }

  if (!loaded) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title="Edit Project"
        description="Update project details, story, metrics, evolution, platform showcase, and SEO."
        breadcrumbs={[
          { label: "Portfolio", href: "/admin/portfolio" },
          { label: "Edit" },
          { label: loaded.caption },
        ]}
        actions={
          loaded.slug ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/projects/${loaded.slug}?preview=1`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preview project
              </Link>
            </Button>
          ) : null
        }
      />
      <ProjectEditor
        portfolioId={loaded.portfolioLocalId}
        writeSource={getProjectWriteSource()}
        initialValues={loaded.initialValues}
        initialOgImageUrl={loaded.initialOgImageUrl}
        initialMetrics={loaded.initialMetrics}
        initialVersions={loaded.initialVersions}
      />
    </div>
  );
}
