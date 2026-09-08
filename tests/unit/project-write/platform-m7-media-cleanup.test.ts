import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  filterConfirmedProjectPlatformMedia,
  filterPendingProjectPlatformMedia,
  isConfirmedPlatformAdminMedia,
  mapPlatformMediaRecordToPickerSelection,
  pickConfirmedHeroMedia,
} from "@/lib/project-write/platform-media-mapper";

const CONFIRMED_HERO_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PENDING_HERO_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

const mediaItems = [
  {
    id: CONFIRMED_HERO_ID,
    case_study_id: "case-1",
    storage_key: "portfolio/projects/heroes/confirmed.png",
    public_url: "https://cdn.example/confirmed.png",
    role: "hero",
    upload_status: "confirmed",
  },
  {
    id: PENDING_HERO_ID,
    case_study_id: "case-1",
    storage_key: "portfolio/projects/heroes/pending.png",
    public_url: "https://cdn.example/pending.png",
    role: "hero",
    upload_status: "pending",
  },
  {
    id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    case_study_id: "case-1",
    storage_key: "portfolio/projects/gallery/one.png",
    public_url: "https://cdn.example/gallery.png",
    role: "gallery",
    upload_status: "confirmed",
  },
];

describe("M7 project media cleanup", () => {
  test("confirmed media appears in project picker selection", () => {
    const pickerItems = mediaItems.map(mapPlatformMediaRecordToPickerSelection);
    const confirmed = filterConfirmedProjectPlatformMedia(pickerItems);

    expect(confirmed.map((item) => item.id)).toEqual([
      CONFIRMED_HERO_ID,
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    ]);
  });

  test("pending media does not appear as normal selectable media", () => {
    const pickerItems = mediaItems.map(mapPlatformMediaRecordToPickerSelection);
    const confirmed = filterConfirmedProjectPlatformMedia(pickerItems);
    const pending = filterPendingProjectPlatformMedia(pickerItems);

    expect(confirmed.some((item) => item.id === PENDING_HERO_ID)).toBe(false);
    expect(pending.map((item) => item.id)).toEqual([PENDING_HERO_ID]);
  });

  test("unconfirmed hero is not treated as current hero", () => {
    const hero = pickConfirmedHeroMedia(mediaItems);
    expect(hero?.id).toBe(CONFIRMED_HERO_ID);
  });

  test("gallery confirmed-media behavior remains available in picker mapping", () => {
    const gallery = filterConfirmedProjectPlatformMedia(
      mediaItems.map(mapPlatformMediaRecordToPickerSelection)
    ).filter((item) => item.role === "gallery");

    expect(gallery.length).toBe(1);
    expect(gallery[0]?.uploadStatus).toBe("confirmed");
  });

  test("cleanup action rejects confirmed hero deletion semantics", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/platform-media-write.ts",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("cleanupPendingProjectMediaViaPlatform")).toBe(true);
    expect(source.includes("isConfirmedPlatformAdminMedia(owned)")).toBe(true);
    expect(source.includes("pending failed upload")).toBe(true);
  });

  test("cleanup path does not write shared media state to Prisma", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/actions/portfolio-media.ts",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("cleanupPendingProjectPlatformMediaAction")).toBe(true);
    expect(source.includes("db.portfolio")).toBe(false);
    expect(source.includes("mediaAsset")).toBe(false);
  });

  test("MediaPicker exposes pending cleanup section without hero-clear control", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/components/Admin/media/MediaPicker.tsx",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("MediaPickerDialog")).toBe(true);
    expect(source.includes("listProjectPendingPlatformMediaAction")).toBe(true);
    expect(source.includes("cleanupPendingProjectPlatformMediaAction")).toBe(true);
    expect(source.includes("Remove current hero")).toBe(false);
  });

  test("upload path registers only after PUT and cleans up pending row on failure", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/components/Admin/media/media-picker-upload.ts",
          import.meta.url
        )
      ),
      "utf8"
    );

    const uploadBody = source.slice(
      source.indexOf("export async function uploadPlatformProjectMediaFile")
    );

    expect(uploadBody.includes("await putFileToPresignedUrl")).toBe(true);
    expect(
      uploadBody.includes("const registerResult = await registerProjectMediaAction")
    ).toBe(true);
    expect(uploadBody.indexOf("await putFileToPresignedUrl")).toBeLessThan(
      uploadBody.indexOf("const registerResult = await registerProjectMediaAction")
    );
    expect(uploadBody.includes("presign.mediaId")).toBe(true);
  });

  test("confirmed-only list action uses Platform confirmed filter", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/platform-media-write.ts",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("listConfirmedProjectMediaViaPlatform")).toBe(true);
    expect(source.includes("listPendingProjectMediaViaPlatform")).toBe(true);
    expect(isConfirmedPlatformAdminMedia({ upload_status: "pending" })).toBe(false);
  });
});
