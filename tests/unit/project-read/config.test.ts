import { describe, expect, test } from "bun:test";

import {
  assertPlatformApiReadConfigured,
  getPlatformApiBaseUrl,
  getPlatformApiFetchCacheOptions,
  getPlatformApiTimeoutMs,
  getProjectReadSource,
  resolveProjectReadSource,
} from "@/lib/project-read/config";
import { resetCoherentProjectSourceConfigurationForTests } from "@/lib/project-source/coherence";

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
  test("allows database read rollback without API URL when write is platform-api", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    process.env.PROJECT_READ_SOURCE = "database";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;
    resetCoherentProjectSourceConfigurationForTests();

    expect(() => assertPlatformApiReadConfigured()).not.toThrow();

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    resetCoherentProjectSourceConfigurationForTests();
  });

  test("requires API URL when platform-api is selected", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;
    resetCoherentProjectSourceConfigurationForTests();

    expect(() => assertPlatformApiReadConfigured()).toThrow(
      /requires DEVLAUNCH_PLATFORM_API_URL/
    );

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    resetCoherentProjectSourceConfigurationForTests();
  });

  test("accepts valid platform-api configuration", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    process.env.DEVLAUNCH_PLATFORM_API_URL = "https://api.devlaunchsystems.com";
    resetCoherentProjectSourceConfigurationForTests();

    expect(() => assertPlatformApiReadConfigured()).not.toThrow();
    expect(getProjectReadSource()).toBe("platform-api");

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    resetCoherentProjectSourceConfigurationForTests();
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
