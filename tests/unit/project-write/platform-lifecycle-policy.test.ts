import { describe, expect, test } from "bun:test";

import {
  buildPlatformLifecycleAdminState,
  canArchiveProject,
  canPublishProject,
  canUnpublishProject,
  formatLifecyclePresentationLabel,
  PLATFORM_HARD_DELETE_UNAVAILABLE_MESSAGE,
  PLATFORM_SUNSET_UNAVAILABLE_MESSAGE,
  shouldUsePlatformLifecycleActions,
} from "@/lib/project-write/platform-lifecycle-policy";

describe("platform lifecycle policy", () => {
  test("uses explicit lifecycle actions in platform-api mode", () => {
    expect(shouldUsePlatformLifecycleActions("platform-api")).toBe(true);
    expect(shouldUsePlatformLifecycleActions("database")).toBe(false);
  });

  test("builds authoritative lifecycle state from Platform fields", () => {
    const state = buildPlatformLifecycleAdminState({
      publishStatus: "published",
      lifecycleStatus: "archived",
      archivedAt: "2026-01-02T00:00:00Z",
    });

    expect(state.publishStatus).toBe("published");
    expect(state.isArchived).toBe(true);
    expect(formatLifecyclePresentationLabel(state)).toBe("Published · Archived");
  });

  test("preserves independent publish and archive dimensions", () => {
    const archivedPublished = buildPlatformLifecycleAdminState({
      publishStatus: "published",
      lifecycleStatus: "archived",
      archivedAt: "2026-01-02T00:00:00Z",
    });

    expect(canPublishProject(archivedPublished)).toBe(false);
    expect(canUnpublishProject(archivedPublished)).toBe(true);
    expect(canArchiveProject(archivedPublished)).toBe(false);
  });

  test("documents unsupported sunset and hard delete messaging", () => {
    expect(PLATFORM_SUNSET_UNAVAILABLE_MESSAGE).toContain("Sunset");
    expect(PLATFORM_HARD_DELETE_UNAVAILABLE_MESSAGE).toContain("Archive");
  });
});
