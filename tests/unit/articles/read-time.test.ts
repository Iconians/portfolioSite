import { describe, expect, test } from "bun:test";

import { computeReadTimeMinutes, formatReadTime } from "@/lib/articles/read-time";

describe("read-time", () => {
  test("estimates at least one minute", () => {
    expect(computeReadTimeMinutes("short")).toBe(1);
  });

  test("scales with word count", () => {
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(" ");
    expect(computeReadTimeMinutes(words)).toBe(2);
  });

  test("formats read time label", () => {
    expect(formatReadTime(5)).toBe("5 min read");
  });
});
