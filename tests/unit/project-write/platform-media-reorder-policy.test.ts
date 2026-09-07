import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import {
  PlatformGalleryReorderUnavailableError,
  shouldDisableGalleryReorder,
} from "@/lib/project-write/platform-media-reorder-policy";

describe("platform gallery reorder policy", () => {
  test("enables gallery reorder in database mode", () => {
    expect(shouldDisableGalleryReorder("database")).toBe(false);
  });

  test("enables gallery reorder in platform-api mode", () => {
    expect(shouldDisableGalleryReorder("platform-api")).toBe(false);
  });

  test("maps legacy gallery reorder rejection to user-facing message", () => {
    expect(
      toPlatformProjectWriteUserMessage(new PlatformGalleryReorderUnavailableError())
    ).toBe(
      "Gallery reorder is unavailable in platform-api mode until Platform exposes an atomic reorder contract."
    );
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
    expect(source.includes("reorderProjectGalleryMediaAction")).toBe(true);
  });

  test("portfolio media update rejects sort_order before Platform I/O in platform-api mode", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-media.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("PLATFORM_GALLERY_SORT_ORDER_PATCH_BLOCKED_MESSAGE")).toBe(
      true
    );
    expect(source.includes("parsed.sortOrder !== undefined")).toBe(true);
  });

  test("platform media write exports gallery reorder helper", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/platform-media-write.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("reorderProjectGalleryMediaViaPlatform")).toBe(true);
  });
});
