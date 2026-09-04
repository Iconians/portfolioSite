import type { PublishStatus } from "@/lib/types/portfolio";

export const PLATFORM_HARD_DELETE_UNAVAILABLE_MESSAGE =
  "Project delete is unavailable while PROJECT_WRITE_SOURCE=platform-api. Use Archive to retire a project from public visibility.";

export const PLATFORM_SUNSET_UNAVAILABLE_MESSAGE =
  "Sunset status is not supported in Platform API mode. Use Archive or Unpublish instead.";

export interface PlatformLifecycleAdminState {
  publishStatus: PublishStatus;
  lifecycleStatus: string;
  archivedAt: string | null;
  isArchived: boolean;
}

export function shouldUsePlatformLifecycleActions(
  writeSource: "database" | "platform-api"
): boolean {
  return writeSource === "platform-api";
}

export function buildPlatformLifecycleAdminState(input: {
  publishStatus: string | null | undefined;
  lifecycleStatus: string | null | undefined;
  archivedAt: string | null | undefined;
}): PlatformLifecycleAdminState {
  const publishStatus =
    input.publishStatus?.trim().toLowerCase() === "published" ? "published" : "draft";
  const lifecycleStatus = input.lifecycleStatus?.trim().toLowerCase() ?? "active";
  const archivedAt = input.archivedAt ?? null;
  const isArchived = Boolean(archivedAt) || lifecycleStatus === "archived";

  return {
    publishStatus,
    lifecycleStatus,
    archivedAt,
    isArchived,
  };
}

export function formatLifecyclePresentationLabel(state: PlatformLifecycleAdminState): string {
  const publishLabel = state.publishStatus === "published" ? "Published" : "Draft";
  if (state.isArchived) {
    return `${publishLabel} · Archived`;
  }
  if (state.lifecycleStatus === "active") {
    return publishLabel;
  }
  return `${publishLabel} · ${state.lifecycleStatus}`;
}

export function canPublishProject(state: PlatformLifecycleAdminState): boolean {
  return state.publishStatus !== "published";
}

export function canUnpublishProject(state: PlatformLifecycleAdminState): boolean {
  return state.publishStatus === "published";
}

export function canArchiveProject(state: PlatformLifecycleAdminState): boolean {
  return !state.isArchived;
}
