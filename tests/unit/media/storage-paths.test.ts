import { describe, expect, test } from "bun:test";
import {
  buildStorageKey,
  resolveMediaStorageFolder,
} from "@/lib/media/storage-paths";

describe("resolveMediaStorageFolder", () => {
  test("returns general for unknown values", () => {
    expect(resolveMediaStorageFolder(undefined)).toBe("general");
    expect(resolveMediaStorageFolder("uploads")).toBe("general");
  });

  test("accepts known folder keys", () => {
    expect(resolveMediaStorageFolder("portfolio-project")).toBe(
      "portfolio-project"
    );
    expect(resolveMediaStorageFolder("portfolio-profile")).toBe(
      "portfolio-profile"
    );
  });
});

describe("buildStorageKey", () => {
  test("maps portfolio project images to portfolio/project-images", () => {
    const key = buildStorageKey("../evil name.png", "portfolio-project");
    expect(key.startsWith("portfolio/project-images/")).toBe(true);
    expect(key.endsWith("_evil_name.png")).toBe(true);
  });

  test("maps profile images to portfolio", () => {
    const key = buildStorageKey("avatar.png", "portfolio-profile");
    expect(key.startsWith("portfolio/")).toBe(true);
    expect(key.includes("project-images")).toBe(false);
  });

  test("maps general media to media", () => {
    const key = buildStorageKey("cover.png", "general");
    expect(key.startsWith("media/")).toBe(true);
  });
});
