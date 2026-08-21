import { describe, expect, test } from "bun:test";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  validateMediaUpload,
} from "@/lib/media/validate-upload";

describe("validateMediaUpload", () => {
  test("accepts allowed image types", () => {
    const samples: Array<{ mimeType: (typeof ALLOWED_IMAGE_MIME_TYPES)[number]; filename: string }> = [
      { mimeType: "image/jpeg", filename: "photo.jpg" },
      { mimeType: "image/png", filename: "photo.png" },
      { mimeType: "image/webp", filename: "photo.webp" },
      { mimeType: "image/gif", filename: "photo.gif" },
    ];

    for (const sample of samples) {
      expect(() =>
        validateMediaUpload({
          filename: sample.filename,
          mimeType: sample.mimeType,
          sizeBytes: 1024,
        })
      ).not.toThrow();
    }
  });

  test("rejects invalid mime type", () => {
    expect(() =>
      validateMediaUpload({
        filename: "file.pdf",
        mimeType: "application/pdf",
        sizeBytes: 1024,
      })
    ).toThrow("Invalid file type");
  });

  test("rejects svg uploads", () => {
    expect(() =>
      validateMediaUpload({
        filename: "icon.svg",
        mimeType: "image/svg+xml",
        sizeBytes: 1024,
      })
    ).toThrow("Invalid file type");
  });

  test("rejects extension and mime mismatch", () => {
    expect(() =>
      validateMediaUpload({
        filename: "photo.png",
        mimeType: "image/jpeg",
        sizeBytes: 1024,
      })
    ).toThrow("Filename extension does not match file type");
  });

  test("rejects files over 5MB", () => {
    expect(() =>
      validateMediaUpload({
        filename: "large.png",
        mimeType: "image/png",
        sizeBytes: 5 * 1024 * 1024 + 1,
      })
    ).toThrow("File too large");
  });

  test("rejects empty files", () => {
    expect(() =>
      validateMediaUpload({
        filename: "photo.png",
        mimeType: "image/png",
        sizeBytes: 0,
      })
    ).toThrow("File is empty");
  });
});
