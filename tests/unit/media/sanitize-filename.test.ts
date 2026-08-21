import { describe, expect, test } from "bun:test";
import { sanitizeMediaFilename } from "@/lib/media/sanitize-filename";

describe("sanitizeMediaFilename", () => {
  test("normalizes spaces and unsafe characters", () => {
    expect(sanitizeMediaFilename("../evil name.png")).toBe("evil-name.png");
  });

  test("preserves valid extensions", () => {
    expect(sanitizeMediaFilename("Building Software That Grows.PNG")).toBe(
      "building-software-that-grows.png"
    );
  });

  test("rejects empty filenames", () => {
    expect(() => sanitizeMediaFilename("   ")).toThrow("Filename is required");
    expect(() => sanitizeMediaFilename("../..")).toThrow("Filename is required");
  });
});
