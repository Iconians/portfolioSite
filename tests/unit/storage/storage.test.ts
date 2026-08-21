import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "fs/promises";
import os from "os";
import path from "path";

import { getStorageProviderKind } from "@/lib/storage/config";
import { getStorageProvider } from "@/lib/storage/factory";
import { LocalStorageProvider } from "@/lib/storage/local.provider";
import { sanitizeStorageKey } from "@/lib/storage/sanitize-key";

describe("sanitizeStorageKey", () => {
  test("removes path traversal segments", () => {
    expect(sanitizeStorageKey("../evil/file.png")).toBe("evil/file.png");
  });

  test("rejects empty key", () => {
    expect(() => sanitizeStorageKey("")).toThrow("Storage key is required");
  });
});

describe("getStorageProviderKind", () => {
  const original = process.env.STORAGE_PROVIDER;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.STORAGE_PROVIDER;
    } else {
      process.env.STORAGE_PROVIDER = original;
    }
  });

  test("defaults to local", () => {
    delete process.env.STORAGE_PROVIDER;
    expect(getStorageProviderKind()).toBe("local");
  });

  test("returns s3 when configured", () => {
    process.env.STORAGE_PROVIDER = "s3";
    expect(getStorageProviderKind()).toBe("s3");
  });
});

describe("getStorageProvider", () => {
  const originalProvider = process.env.STORAGE_PROVIDER;

  afterEach(() => {
    if (originalProvider === undefined) {
      delete process.env.STORAGE_PROVIDER;
    } else {
      process.env.STORAGE_PROVIDER = originalProvider;
    }
  });

  test("returns local provider by default", () => {
    delete process.env.STORAGE_PROVIDER;
    const provider = getStorageProvider();
    expect(provider.kind).toBe("local");
  });
});

describe("LocalStorageProvider", () => {
  let tempDir: string;

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  test("upload, getPublicUrl, and delete round-trip", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "portfolio-storage-"));
    const provider = new LocalStorageProvider({
      rootDirectory: tempDir,
      publicUrlBase: "/media",
    });

    const body = Buffer.from("test-image-content");
    const stored = await provider.upload({
      key: "uploads/test-image.png",
      body,
      mimeType: "image/png",
    });

    expect(stored.key).toBe("uploads/test-image.png");
    expect(stored.publicUrl).toBe("/media/uploads/test-image.png");
    expect(provider.getPublicUrl(stored.key)).toBe(stored.publicUrl);

    await provider.delete(stored.key);

    const reuploaded = await provider.upload({
      key: stored.key,
      body,
      mimeType: "image/png",
    });
    expect(reuploaded.key).toBe(stored.key);
  });
});
