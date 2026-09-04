import { describe, expect, test } from "bun:test";

import { PlatformApiAdminMalformedResponseError } from "@/lib/project-write/errors";
import {
  deleteCaseStudyMedia,
  presignCaseStudyMedia,
  registerCaseStudyMedia,
  updateCaseStudyMedia,
} from "@/lib/project-write/platform-api-admin-media-client";

const PLATFORM_CASE_STUDY_ID = "00000000-0000-4000-8000-000000000001";
const PLATFORM_MEDIA_ID = "00000000-0000-4000-8000-000000000010";

const presignFixture = {
  media_id: PLATFORM_MEDIA_ID,
  storage_key: "portfolio/projects/heroes/a.png",
  upload_url: "https://r2.example/upload",
  upload_headers: { "Content-Type": "image/png" },
  public_url: "https://cdn.example/hero.png",
  expires_in: 900,
};

const mediaRecordFixture = {
  id: PLATFORM_MEDIA_ID,
  case_study_id: PLATFORM_CASE_STUDY_ID,
  storage_key: "portfolio/projects/heroes/a.png",
  public_url: "https://cdn.example/hero.png",
  role: "hero",
  audience: "public",
  alt_text: "Hero",
  sort_order: 0,
  upload_status: "confirmed",
};

function createTransport(
  handler: (path: string, init?: { method?: string; body?: unknown }) => Promise<unknown>
) {
  return {
    requestJson: async <T>(
      path: string,
      init?: { method?: string; body?: unknown }
    ): Promise<T> => handler(path, init) as Promise<T>,
  };
}

async function expectRejects(
  promise: Promise<unknown>,
  ErrorType: new (...args: never[]) => Error
): Promise<void> {
  try {
    await promise;
    throw new Error("expected rejection");
  } catch (error) {
    expect(error instanceof ErrorType).toBe(true);
  }
}

describe("platform-api-admin-media-client", () => {
  test("presign uses case-study scoped POST route with whitelisted payload", async () => {
    let path = "";
    let body: unknown;
    const transport = createTransport(async (requestedPath, init) => {
      path = requestedPath;
      body = init?.body;
      return presignFixture;
    });

    const result = await presignCaseStudyMedia(transport, PLATFORM_CASE_STUDY_ID, {
      filename: "hero.png",
      mime_type: "image/png",
      size_bytes: 1024,
      role: "hero",
    });

    expect(path).toBe(
      `/case-studies/${PLATFORM_CASE_STUDY_ID}/media/presign`
    );
    expect(body).toEqual({
      filename: "hero.png",
      mime_type: "image/png",
      size_bytes: 1024,
      role: "hero",
    });
    expect(result.upload_url).toBe("https://r2.example/upload");
    expect(result.storage_key).toBe("portfolio/projects/heroes/a.png");
  });

  test("presign rejects malformed response missing upload_url", async () => {
    const transport = createTransport(async () => ({
      storage_key: "portfolio/projects/heroes/a.png",
    }));

    await expectRejects(
      presignCaseStudyMedia(transport, PLATFORM_CASE_STUDY_ID, {
        filename: "hero.png",
        mime_type: "image/png",
        size_bytes: 1024,
        role: "hero",
      }),
      PlatformApiAdminMalformedResponseError
    );
  });

  test("register uses case-study scoped POST with storage_key only", async () => {
    let path = "";
    let body: unknown;
    const transport = createTransport(async (requestedPath, init) => {
      path = requestedPath;
      body = init?.body;
      return mediaRecordFixture;
    });

    const result = await registerCaseStudyMedia(transport, PLATFORM_CASE_STUDY_ID, {
      storage_key: "portfolio/projects/heroes/a.png",
      alt_text: "Hero",
    });

    expect(path).toBe(`/case-studies/${PLATFORM_CASE_STUDY_ID}/media`);
    expect(body).toEqual({
      storage_key: "portfolio/projects/heroes/a.png",
      alt_text: "Hero",
    });
    expect(result.id).toBe(PLATFORM_MEDIA_ID);
  });

  test("register rejects malformed response missing id", async () => {
    const transport = createTransport(async () => ({
      storage_key: "portfolio/projects/heroes/a.png",
    }));

    await expectRejects(
      registerCaseStudyMedia(transport, PLATFORM_CASE_STUDY_ID, {
        storage_key: "portfolio/projects/heroes/a.png",
      }),
      PlatformApiAdminMalformedResponseError
    );
  });

  test("PATCH uses global media route with mutable fields only", async () => {
    let path = "";
    let body: unknown;
    const transport = createTransport(async (requestedPath, init) => {
      path = requestedPath;
      body = init?.body;
      return { ...mediaRecordFixture, alt_text: "Updated" };
    });

    const result = await updateCaseStudyMedia(transport, PLATFORM_MEDIA_ID, {
      alt_text: "Updated",
      caption: null,
    });

    expect(path).toBe(`/media/${PLATFORM_MEDIA_ID}`);
    expect(body).toEqual({ alt_text: "Updated", caption: null });
    expect(result.id).toBe(PLATFORM_MEDIA_ID);
    expect("role" in (body as object)).toBe(false);
  });

  test("DELETE uses global media route", async () => {
    let path = "";
    let method = "";
    const transport = createTransport(async (requestedPath, init) => {
      path = requestedPath;
      method = init?.method ?? "";
      return undefined;
    });

    await deleteCaseStudyMedia(transport, PLATFORM_MEDIA_ID);
    expect(path).toBe(`/media/${PLATFORM_MEDIA_ID}`);
    expect(method).toBe("DELETE");
  });
});
