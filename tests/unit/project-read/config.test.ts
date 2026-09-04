import { describe, expect, test } from "bun:test";

import {
  assertPlatformApiReadConfigured,
  getPlatformApiBaseUrl,
  getPlatformApiFetchCacheOptions,
  getPlatformApiTimeoutMs,
  getProjectReadSource,
  resolveProjectReadSource,
} from "@/lib/project-read/config";

describe("resolveProjectReadSource", () => {
  test("defaults to database when unset", () => {
    const previousSource = process.env.PROJECT_READ_SOURCE;
    delete process.env.PROJECT_READ_SOURCE;

    expect(resolveProjectReadSource()).toBe("database");
    expect(resolveProjectReadSource({ projectReadSource: "" })).toBe("database");

    if (previousSource === undefined) {
      delete process.env.PROJECT_READ_SOURCE;
    } else {
      process.env.PROJECT_READ_SOURCE = previousSource;
    }
  });

  test("reads PROJECT_READ_SOURCE from environment when no option is passed", () => {
    const previousSource = process.env.PROJECT_READ_SOURCE;
    process.env.PROJECT_READ_SOURCE = "platform-api";

    expect(resolveProjectReadSource()).toBe("platform-api");

    if (previousSource === undefined) {
      delete process.env.PROJECT_READ_SOURCE;
    } else {
      process.env.PROJECT_READ_SOURCE = previousSource;
    }
  });

  test("uses database when explicitly set in production", () => {
    expect(
      resolveProjectReadSource({
        projectReadSource: "database",
      })
    ).toBe("database");
  });

  test("uses platform-api when explicitly set in production", () => {
    expect(
      resolveProjectReadSource({
        projectReadSource: "platform-api",
      })
    ).toBe("platform-api");
  });

  test("invalid value fails safe to database", () => {
    expect(
      resolveProjectReadSource({
        projectReadSource: "invalid-source",
      })
    ).toBe("database");
  });
});

describe("assertPlatformApiReadConfigured", () => {
  test("allows database without API URL", () => {
    const previousSource = process.env.PROJECT_READ_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    process.env.PROJECT_READ_SOURCE = "database";
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;

    expect(() => assertPlatformApiReadConfigured()).not.toThrow();

    process.env.PROJECT_READ_SOURCE = previousSource;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
  });

  test("requires API URL when platform-api is selected", () => {
    const previousSource = process.env.PROJECT_READ_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;

    expect(() => assertPlatformApiReadConfigured()).toThrow(
      /requires DEVLAUNCH_PLATFORM_API_URL/
    );

    process.env.PROJECT_READ_SOURCE = previousSource;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
  });

  test("accepts valid platform-api configuration", () => {
    const previousSource = process.env.PROJECT_READ_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.DEVLAUNCH_PLATFORM_API_URL = "https://api.devlaunchsystems.com";

    expect(() => assertPlatformApiReadConfigured()).not.toThrow();
    expect(getProjectReadSource()).toBe("platform-api");

    process.env.PROJECT_READ_SOURCE = previousSource;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
  });
});

describe("platform API config helpers", () => {
  test("returns null base URL when unset", () => {
    const previous = process.env.DEVLAUNCH_PLATFORM_API_URL;
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;
    expect(getPlatformApiBaseUrl()).toBeNull();
    process.env.DEVLAUNCH_PLATFORM_API_URL = previous;
  });

  test("defaults timeout to 5 seconds", () => {
    expect(getPlatformApiTimeoutMs()).toBe(5000);
  });

  test("aligns Platform API fetch cache with ISR revalidate", () => {
    expect(getPlatformApiFetchCacheOptions()).toEqual({ revalidate: 3600 });
  });
});
