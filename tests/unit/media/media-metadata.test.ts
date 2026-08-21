import { describe, expect, test } from "bun:test";

import { UpdateMediaMetadataSchema } from "@/lib/types/media";

describe("UpdateMediaMetadataSchema", () => {
  test("accepts nullable alt text and caption", () => {
    const result = UpdateMediaMetadataSchema.parse({
      altText: "Project hero screenshot",
      caption: null,
    });
    expect(result.altText).toBe("Project hero screenshot");
    expect(result.caption).toBeNull();
  });

  test("rejects alt text over 500 characters", () => {
    expect(() =>
      UpdateMediaMetadataSchema.parse({
        altText: "a".repeat(501),
        caption: null,
      })
    ).toThrow();
  });
});
