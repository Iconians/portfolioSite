"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/Admin/shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  archivePortfolioProjectAction,
  publishPortfolioProjectAction,
  unpublishPortfolioProjectAction,
} from "@/lib/actions/portfolio-lifecycle";
import {
  canArchiveProject,
  canPublishProject,
  canUnpublishProject,
  formatLifecyclePresentationLabel,
  type PlatformLifecycleAdminState,
} from "@/lib/project-write/platform-lifecycle-policy";

interface LifecycleControlsProps {
  portfolioId: string;
  lifecycleState: PlatformLifecycleAdminState;
  projectTitle: string;
}

export function LifecycleControls({
  portfolioId,
  lifecycleState,
  projectTitle,
}: LifecycleControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [state, setState] = useState(lifecycleState);

  function refreshAfterSuccess(nextState: PlatformLifecycleAdminState) {
    setState(nextState);
    router.refresh();
  }

  function runLifecycleAction(
    action: () => Promise<{ success: boolean; error?: string; data?: { publishStatus: string; lifecycleStatus: string } }>,
    successMessage: string,
    mapNextState: (data: { publishStatus: string; lifecycleStatus: string }) => PlatformLifecycleAdminState
  ) {
    startTransition(async () => {
      const result = await action();
      if (result.success && result.data) {
        toast.success(successMessage);
        refreshAfterSuccess(
          mapNextState({
            publishStatus: result.data.publishStatus,
            lifecycleStatus: result.data.lifecycleStatus,
          })
        );
      } else {
        toast.error(result.error ?? "Lifecycle action failed");
      }
    });
  }

  function handlePublish() {
    runLifecycleAction(
      () => publishPortfolioProjectAction(portfolioId),
      "Project published",
      (data) => ({
        ...state,
        publishStatus: data.publishStatus === "published" ? "published" : "draft",
      })
    );
  }

  function handleUnpublish() {
    runLifecycleAction(
      () => unpublishPortfolioProjectAction(portfolioId),
      "Project unpublished",
      () => ({
        ...state,
        publishStatus: "draft",
      })
    );
  }

  function handleArchive() {
    startTransition(async () => {
      const result = await archivePortfolioProjectAction(portfolioId);
      if (result.success) {
        toast.success("Project archived");
        setArchiveOpen(false);
        refreshAfterSuccess({
          publishStatus: result.data.publishStatus === "published" ? "published" : "draft",
          lifecycleStatus: "archived",
          archivedAt: new Date().toISOString(),
          isArchived: true,
        });
      } else {
        toast.error(result.error ?? "Failed to archive project");
      }
    });
  }

  return (
    <>
      <div className="space-y-3 rounded-md border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Lifecycle</span>
          <Badge variant="secondary">{formatLifecyclePresentationLabel(state)}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Publish, unpublish, and archive are explicit Platform lifecycle actions. Saving project
          content does not change lifecycle state.
        </p>
        <div className="flex flex-wrap gap-2">
          {canPublishProject(state) ? (
            <Button type="button" variant="outline" disabled={isPending} onClick={handlePublish}>
              Publish
            </Button>
          ) : null}
          {canUnpublishProject(state) ? (
            <Button type="button" variant="outline" disabled={isPending} onClick={handleUnpublish}>
              Unpublish
            </Button>
          ) : null}
          {canArchiveProject(state) ? (
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={() => setArchiveOpen(true)}
            >
              Archive
            </Button>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={archiveOpen}
        title="Archive project"
        description={`Archive "${projectTitle}"? This is irreversible in Platform API V1. Archived projects are hidden from public reads even if still marked published.`}
        confirmLabel="Archive project"
        loading={isPending}
        onCancel={() => setArchiveOpen(false)}
        onConfirm={handleArchive}
      />
    </>
  );
}
