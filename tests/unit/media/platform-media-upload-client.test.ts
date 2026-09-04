import { describe, expect, test } from "bun:test";

import {
  PlatformMediaBrowserUploadError,
  putFileToPresignedUrl,
} from "@/lib/media/platform-media-upload-client";

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

describe("platform media browser upload client", () => {
  test("PUTs raw file to presigned URL with required headers only", async () => {
    let requestedUrl = "";
    let method = "";
    let headers: Headers | undefined;
    let body: BodyInit | null | undefined;

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      requestedUrl = String(input);
      method = init?.method ?? "GET";
      headers = init?.headers instanceof Headers ? init.headers : new Headers(init?.headers);
      body = init?.body;
      return new Response(null, { status: 200 });
    };

    const file = new File(["bytes"], "hero.png", { type: "image/png" });
    await putFileToPresignedUrl({
      presign: {
        uploadUrl: "https://r2.example/upload",
        uploadHeaders: { "Content-Type": "image/png" },
        storageKey: "portfolio/projects/heroes/a.png",
        publicUrl: "https://cdn.example/hero.png",
        expiresIn: 900,
      },
      file,
    });

    globalThis.fetch = originalFetch;

    expect(requestedUrl).toBe("https://r2.example/upload");
    expect(method).toBe("PUT");
    expect(headers?.get("Content-Type")).toBe("image/png");
    expect(headers?.get("Authorization")).toBeNull();
    expect(body).toBe(file);
  });

  test("throws on non-2xx without attaching Platform auth", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response("failed", { status: 403 });

    await expectRejects(
      putFileToPresignedUrl({
        presign: {
          uploadUrl: "https://r2.example/upload",
          uploadHeaders: { "Content-Type": "image/png" },
          storageKey: "key",
          publicUrl: "https://cdn.example/hero.png",
          expiresIn: 900,
        },
        file: new File(["bytes"], "hero.png", { type: "image/png" }),
      }),
      PlatformMediaBrowserUploadError
    );

    globalThis.fetch = originalFetch;
  });
});
