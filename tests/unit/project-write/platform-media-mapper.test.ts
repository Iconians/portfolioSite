import { describe, expect, test } from "bun:test";

import {
  mapPlatformAdminMediaToEditorFields,
  mapPresignResponseForBrowser,
} from "@/lib/project-write/platform-media-mapper";

const PLATFORM_HERO_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PLATFORM_OG_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const PLATFORM_GALLERY_ID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

describe("platform media mapper", () => {
  test("maps confirmed hero, OG, and gallery Platform UUIDs", () => {
    const fields = mapPlatformAdminMediaToEditorFields([
      {
        id: PLATFORM_HERO_ID,
        case_study_id: "case-1",
        storage_key: "hero.png",
        public_url: "https://cdn.example/hero.png",
        role: "hero",
        upload_status: "confirmed",
        sort_order: 0,
      },
      {
        id: PLATFORM_OG_ID,
        case_study_id: "case-1",
        storage_key: "og.png",
        public_url: "https://cdn.example/og.png",
        role: "og",
        upload_status: "confirmed",
        sort_order: 1,
      },
      {
        id: PLATFORM_GALLERY_ID,
        case_study_id: "case-1",
        storage_key: "gallery.png",
        public_url: "https://cdn.example/gallery.png",
        role: "gallery",
        upload_status: "confirmed",
        sort_order: 2,
        alt_text: "Gallery alt",
        caption: "Caption",
      },
      {
        id: "pending-item",
        case_study_id: "case-1",
        storage_key: "pending.png",
        public_url: "https://cdn.example/pending.png",
        role: "gallery",
        upload_status: "pending",
        sort_order: 3,
      },
    ]);

    expect(fields.heroMediaId).toBe(PLATFORM_HERO_ID);
    expect(fields.ogMediaId).toBe(PLATFORM_OG_ID);
    expect(fields.gallery.length).toBe(1);
    expect(fields.gallery[0]?.mediaId).toBe(PLATFORM_GALLERY_ID);
    expect(fields.img).toBe("https://cdn.example/hero.png");
  });

  test("maps presign response to browser-safe payload without bearer token", () => {
    const payload = mapPresignResponseForBrowser({
      media_id: PLATFORM_HERO_ID,
      storage_key: "portfolio/projects/heroes/a.png",
      upload_url: "https://r2.example/upload",
      upload_headers: { "Content-Type": "image/png" },
      public_url: "https://media.devlaunchsystems.com/portfolio/projects/heroes/a.png",
      expires_in: 900,
    });

    expect(payload).toEqual({
      uploadUrl: "https://r2.example/upload",
      uploadHeaders: { "Content-Type": "image/png" },
      storageKey: "portfolio/projects/heroes/a.png",
      publicUrl: "https://media.devlaunchsystems.com/portfolio/projects/heroes/a.png",
      expiresIn: 900,
    });
    expect("Authorization" in payload.uploadHeaders).toBe(false);
    expect(JSON.stringify(payload).includes("Bearer")).toBe(false);
  });

  test("presign public_url is passed through without display rewrite", () => {
    process.env.S3_PUBLIC_URL_BASE = "https://media.devlaunchsystems.com";
    const payload = mapPresignResponseForBrowser({
      media_id: PLATFORM_HERO_ID,
      storage_key: "portfolio/projects/heroes/a.png",
      upload_url: "https://r2.example/upload",
      upload_headers: { "Content-Type": "image/png" },
      public_url:
        "https://pub-49ca821aa6ed4a4ba63fe0776a63274e.r2.dev/portfolio/projects/heroes/a.png",
      expires_in: 900,
    });

    expect(payload.publicUrl).toBe(
      "https://pub-49ca821aa6ed4a4ba63fe0776a63274e.r2.dev/portfolio/projects/heroes/a.png"
    );
  });
});
