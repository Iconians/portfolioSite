import { describe, expect, test } from "bun:test";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  validateMediaUpload,
} from "@/lib/media/validate-upload";

describe("validateMediaUpload", () => {
  test("accepts allowed image types", () => {
    for (const mimeType of ALLOWED_IMAGE_MIME_TYPES) {
      expect(() =>
        validateMediaUpload({
          filename: "photo.png",
          mimeType,
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

  test("rejects files over 5MB", () => {
    expect(() =>
      validateMediaUpload({
        filename: "large.png",
        mimeType: "image/png",
        sizeBytes: 5 * 1024 * 1024 + 1,
      })
    ).toThrow("File too large");
  });
});
