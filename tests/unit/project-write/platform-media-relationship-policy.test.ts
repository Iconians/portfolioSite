import { describe, expect, test } from "bun:test";

import {
  canSelectExistingMediaForRole,
  isExistingSingletonSelectionNoOp,
  isPlatformSingletonMediaRole,
  platformMediaListRoleFilter,
  PLATFORM_MEDIA_ROLE_IMMUTABLE_MESSAGE,
  PLATFORM_SINGLETON_REPLACEMENT_MESSAGE,
} from "@/lib/project-write/platform-media-policy";

const PLATFORM_HERO_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PLATFORM_GALLERY_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

describe("platform media relationship policy", () => {
  test("hero identification uses confirmed media with role=hero", () => {
    expect(isPlatformSingletonMediaRole("hero")).toBe(true);
    expect(platformMediaListRoleFilter("hero")).toBe("hero");
  });

  test("gallery item cannot be selected as hero because role is immutable", () => {
    expect(canSelectExistingMediaForRole("hero", "gallery")).toBe(false);
    expect(PLATFORM_MEDIA_ROLE_IMMUTABLE_MESSAGE).toContain("Upload a new image");
  });

  test("selecting current hero is a no-op without claiming a Platform mutation", () => {
    expect(
      isExistingSingletonSelectionNoOp({
        uploadRole: "hero",
        existingRole: "hero",
        selectedMediaId: PLATFORM_HERO_ID,
        currentMediaId: PLATFORM_HERO_ID,
      })
    ).toBe(true);
  });

  test("selecting a different hero candidate is impossible when list is role-filtered", () => {
    expect(canSelectExistingMediaForRole("hero", "hero")).toBe(true);
    expect(canSelectExistingMediaForRole("hero", "gallery")).toBe(false);
    expect(
      isExistingSingletonSelectionNoOp({
        uploadRole: "hero",
        existingRole: "hero",
        selectedMediaId: PLATFORM_GALLERY_ID,
        currentMediaId: PLATFORM_HERO_ID,
      })
    ).toBe(false);
  });

  test("OG picker uses role=og filter and replacement messaging", () => {
    expect(platformMediaListRoleFilter("og")).toBe("og");
    expect(PLATFORM_SINGLETON_REPLACEMENT_MESSAGE).toContain("hero or OG");
  });

  test("gallery picker lists only gallery role media", () => {
    expect(platformMediaListRoleFilter("gallery")).toBe("gallery");
  });
});
