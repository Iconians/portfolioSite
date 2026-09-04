import { describe, expect, test } from "bun:test";

import { PLATFORM_HARD_DELETE_UNAVAILABLE_MESSAGE } from "@/lib/project-write/platform-lifecycle-policy";

describe("platform lifecycle source routing guards", () => {
  test("hard delete message is explicit about archive replacement", () => {
    expect(PLATFORM_HARD_DELETE_UNAVAILABLE_MESSAGE.includes("PROJECT_WRITE_SOURCE=platform-api")).toBe(true);
    expect(PLATFORM_HARD_DELETE_UNAVAILABLE_MESSAGE.includes("Archive")).toBe(true);
    expect(PLATFORM_HARD_DELETE_UNAVAILABLE_MESSAGE.includes("Delete project")).toBe(false);
  });
});
