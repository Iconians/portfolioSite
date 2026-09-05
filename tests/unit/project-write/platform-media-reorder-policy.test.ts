import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import {
  assertPlatformGalleryReorderAllowed,
  PLATFORM_GALLERY_REORDER_UNAVAILABLE_MESSAGE,
  PlatformGalleryReorderUnavailableError,
  shouldDisableGalleryReorder,
} from "@/lib/project-write/platform-media-reorder-policy";

describe("platform gallery reorder policy", () => {
  test("allows reorder policy check to pass in database mode", () => {
    expect(() => assertPlatformGalleryReorderAllowed("database")).not.toThrow();
    expect(shouldDisableGalleryReorder("database")).toBe(false);
  });

  test("rejects gallery reorder in platform-api mode before any mutation", () => {
    expect(shouldDisableGalleryReorder("platform-api")).toBe(true);
    expect(() => assertPlatformGalleryReorderAllowed("platform-api")).toThrow(
      PLATFORM_GALLERY_REORDER_UNAVAILABLE_MESSAGE
    );
  });

  test("maps gallery reorder rejection to user-facing message", () => {
    expect(
      toPlatformProjectWriteUserMessage(new PlatformGalleryReorderUnavailableError())
    ).toBe(PLATFORM_GALLERY_REORDER_UNAVAILABLE_MESSAGE);
  });

  test("gallery editor does not implement sequential Platform sort_order PATCH reorder", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/components/Admin/portfolio/GalleryEditor.tsx",
          import.meta.url
        )
      ),
      "utf8"
    );
    expect(source.includes("sortOrder")).toBe(false);
    expect(source.includes("sort_order")).toBe(false);
  });

  test("portfolio media update rejects sort_order before Platform I/O in platform-api mode", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-media.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes('assertPlatformGalleryReorderAllowed("platform-api")')).toBe(
      true
    );
    expect(source.includes("parsed.sortOrder !== undefined")).toBe(true);
  });
});
