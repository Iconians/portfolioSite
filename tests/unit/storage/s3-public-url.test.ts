import { describe, expect, test } from "bun:test";

import { S3StorageProvider } from "@/lib/storage/s3.provider";

describe("S3StorageProvider public URLs", () => {
  const provider = new S3StorageProvider({
    endpoint: "https://account-id.r2.cloudflarestorage.com",
    bucket: "engineering-platform-assets",
    region: "auto",
    accessKeyId: "test-key",
    secretAccessKey: "test-secret",
    publicUrlBase: "https://pub-xxxx.r2.dev",
  });

  test("joins public URL base without double slashes", () => {
    const url = provider.getPublicUrl(
      "portfolio/projects/heroes/1787265817717-building-software-that-grows.png"
    );
    expect(url).toBe(
      "https://pub-xxxx.r2.dev/portfolio/projects/heroes/1787265817717-building-software-that-grows.png"
    );
  });

  test("normalizes trailing slash on public URL base", () => {
    const trailingSlashProvider = new S3StorageProvider({
      endpoint: "https://account-id.r2.cloudflarestorage.com",
      bucket: "engineering-platform-assets",
      region: "auto",
      accessKeyId: "test-key",
      secretAccessKey: "test-secret",
      publicUrlBase: "https://pub-xxxx.r2.dev/",
    });

    expect(trailingSlashProvider.getPublicUrl("portfolio/projects/heroes/a.png")).toBe(
      "https://pub-xxxx.r2.dev/portfolio/projects/heroes/a.png"
    );
  });
});
