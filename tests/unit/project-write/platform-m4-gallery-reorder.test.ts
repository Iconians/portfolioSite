import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { applyGalleryDirectionalReorder } from "@/lib/portfolio/gallery-order";
import {
  PlatformApiAdminNetworkError,
  PlatformApiAdminResponseError,
} from "@/lib/project-write/errors";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import {
  shouldDisableGalleryReorder,
} from "@/lib/project-write/platform-media-reorder-policy";

const PLATFORM_CASE_STUDY_ID = "00000000-0000-4000-8000-000000000001";

function readSource(relativePath: string): string {
  return readFileSync(
    fileURLToPath(new URL(`../../../${relativePath}`, import.meta.url)),
    "utf8"
  );
}

describe("M4 gallery atomic reorder", () => {
  test("gallery reorder controls enabled in platform-api mode", () => {
    expect(shouldDisableGalleryReorder("platform-api")).toBe(false);
  });

  test("gallery reorder action uses Platform atomic helper", () => {
    const source = readSource("src/lib/actions/portfolio-media.ts");
    const block = source.slice(
      source.indexOf("export async function reorderProjectGalleryMediaAction")
    );

    expect(block.includes("reorderProjectGalleryMediaViaPlatform")).toBe(true);
    expect(block.includes("reorderGalleryCaseStudyMedia")).toBe(false);
    expect(block.includes("updateCaseStudyMedia")).toBe(false);
    expect(block.includes("sort_order")).toBe(false);
  });

  test("gallery reorder write layer filters gallery role only", () => {
    const source = readSource("src/lib/project-write/platform-media-write.ts");

    expect(source.includes("reorderProjectGalleryMediaViaPlatform")).toBe(true);
    expect(source.includes('role: "gallery"')).toBe(true);
    expect(source.includes("buildChildReorderOrderedIds")).toBe(true);
    expect(source.includes("reorderGalleryCaseStudyMedia")).toBe(true);
  });

  test("media client exposes gallery reorder endpoint", () => {
    const source = readSource("src/lib/project-write/platform-api-admin-media-client.ts");

    expect(source.includes("/media/gallery/reorder")).toBe(true);
    expect(source.includes('method: "PUT"')).toBe(true);
    expect(source.includes("PlatformApiChildReorderRequest")).toBe(true);
  });

  test("GalleryEditor uses server action and optimistic rollback", () => {
    const source = readSource("src/components/Admin/portfolio/GalleryEditor.tsx");

    expect(source.includes("reorderProjectGalleryMediaAction")).toBe(true);
    expect(source.includes("Move up")).toBe(true);
    expect(source.includes("onChange(previous)")).toBe(true);
    expect(source.includes("DEVLAUNCH_PLATFORM")).toBe(false);
    expect(source.includes("sort_order")).toBe(false);
  });

  test("sort_order PATCH remains blocked in platform-api mode", () => {
    const source = readSource("src/lib/actions/portfolio-media.ts");

    expect(source.includes("PLATFORM_GALLERY_SORT_ORDER_PATCH_BLOCKED_MESSAGE")).toBe(
      true
    );
    expect(source.includes("parsed.sortOrder !== undefined")).toBe(true);
  });

  test("applyGalleryDirectionalReorder keeps gallery IDs only", () => {
    const reordered = applyGalleryDirectionalReorder(
      [
        {
          mediaId: "gallery-b",
          url: "https://cdn.example/b.png",
        },
        {
          mediaId: "gallery-a",
          url: "https://cdn.example/a.png",
        },
      ],
      "gallery-a",
      "up"
    );

    expect(reordered?.map((item) => item.mediaId)).toEqual(["gallery-a", "gallery-b"]);
  });

  test("maps 422 gallery exact-set failure", () => {
    const message = toPlatformProjectWriteUserMessage(
      new PlatformApiAdminResponseError(422, "Validation failed", {
        detail: "ordered_ids must include every gallery media id",
        operation: "reorderGalleryMedia",
      })
    );

    expect(message.includes("ordered_ids")).toBe(true);
  });

  test("maps authorization failure for gallery reorder", () => {
    const message = toPlatformProjectWriteUserMessage(
      new PlatformApiAdminResponseError(403, "Forbidden", {
        operation: "reorderGalleryMedia",
      })
    );

    expect(message.includes("authorization failed")).toBe(true);
  });

  test("maps network failure for gallery reorder", () => {
    const message = toPlatformProjectWriteUserMessage(
      new PlatformApiAdminNetworkError("fetch failed")
    );

    expect(message.includes("Platform API request failed")).toBe(true);
  });

  test("no R2 deletion introduced", () => {
    const files = [
      "src/lib/project-write/platform-media-write.ts",
      "src/lib/actions/portfolio-media.ts",
      "src/components/Admin/portfolio/GalleryEditor.tsx",
    ];

    for (const file of files) {
      const source = readSource(file).toLowerCase();
      expect(source.includes("deleteobject")).toBe(false);
      expect(source.includes("r2.delete")).toBe(false);
    }
  });

  test("OG remove uses authorized delete without hero clear control", () => {
    const linksSource = readSource("src/components/Admin/portfolio/sections/LinksSeoSection.tsx");
    const mediaSource = readSource("src/components/Admin/portfolio/sections/MediaSection.tsx");

    expect(linksSource.includes("Remove OG image")).toBe(true);
    expect(linksSource.includes("deleteProjectPlatformMediaAction")).toBe(true);
    expect(mediaSource.includes("PLATFORM_SINGLETON_CLEAR_UNSUPPORTED_MESSAGE")).toBe(true);
    expect(mediaSource.includes("Remove hero")).toBe(false);
  });
});

describe("M4 PlatformApiAdminClient gallery reorder", () => {
  test("issues atomic gallery reorder PUT", async () => {
    const { PlatformApiAdminClient } = await import(
      "@/lib/project-write/platform-api-admin-client"
    );

    let requestedUrl = "";
    let requestInit: RequestInit | undefined;
    const client = new PlatformApiAdminClient({
      baseUrl: "https://api.devlaunchsystems.com",
      token: "test-token",
      fetchImpl: async (input, init) => {
        requestedUrl = String(input);
        requestInit = init;
        return new Response(null, { status: 204 });
      },
    });

    await client.reorderGalleryMedia(PLATFORM_CASE_STUDY_ID, [
      "00000000-0000-4000-8000-000000000010",
      "00000000-0000-4000-8000-000000000011",
    ]);

    expect(requestedUrl).toBe(
      `https://api.devlaunchsystems.com/api/v1/admin/case-studies/${PLATFORM_CASE_STUDY_ID}/media/gallery/reorder`
    );
    expect(requestInit?.method).toBe("PUT");
    expect(requestInit?.body).toBe(
      JSON.stringify({
        ordered_ids: [
          "00000000-0000-4000-8000-000000000010",
          "00000000-0000-4000-8000-000000000011",
        ],
      })
    );
    expect(String(requestInit?.headers).includes("test-token")).toBe(false);
  });
});
