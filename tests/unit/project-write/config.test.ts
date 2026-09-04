import { describe, expect, test } from "bun:test";

import {
  assertPlatformApiWriteConfigured,
  getProjectWriteSource,
  resolveProjectWriteSource,
} from "@/lib/project-write/config";
import { ProjectWriteConfigurationError } from "@/lib/project-write/errors";

describe("resolveProjectWriteSource", () => {
  test("defaults to database when unset", () => {
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    delete process.env.PROJECT_WRITE_SOURCE;

    expect(resolveProjectWriteSource()).toBe("database");
    expect(resolveProjectWriteSource({ projectWriteSource: "" })).toBe("database");

    if (previousWrite === undefined) {
      delete process.env.PROJECT_WRITE_SOURCE;
    } else {
      process.env.PROJECT_WRITE_SOURCE = previousWrite;
    }
  });

  test("reads PROJECT_WRITE_SOURCE from environment when no option is passed", () => {
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = "platform-api";

    expect(resolveProjectWriteSource()).toBe("platform-api");

    if (previousWrite === undefined) {
      delete process.env.PROJECT_WRITE_SOURCE;
    } else {
      process.env.PROJECT_WRITE_SOURCE = previousWrite;
    }
  });

  test("uses database when explicitly set", () => {
    expect(
      resolveProjectWriteSource({
        projectWriteSource: "database",
      })
    ).toBe("database");
  });

  test("uses platform-api when explicitly set", () => {
    expect(
      resolveProjectWriteSource({
        projectWriteSource: "platform-api",
      })
    ).toBe("platform-api");
  });

  test("invalid value fails safe to database", () => {
    expect(
      resolveProjectWriteSource({
        projectWriteSource: "invalid-source",
      })
    ).toBe("database");
  });
});

describe("assertPlatformApiWriteConfigured", () => {
  test("allows database without API URL or token", () => {
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_WRITE_SOURCE = "database";
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;
    delete process.env.DEVLAUNCH_PLATFORM_API_TOKEN;

    expect(() => assertPlatformApiWriteConfigured()).not.toThrow();

    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
  });

  test("requires API URL when platform-api is selected", () => {
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = "test-token";

    expect(() => assertPlatformApiWriteConfigured()).toThrow(
      /requires DEVLAUNCH_PLATFORM_API_URL/
    );

    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
  });

  test("requires API token when platform-api is selected", () => {
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    process.env.DEVLAUNCH_PLATFORM_API_URL = "https://api.devlaunchsystems.com";
    delete process.env.DEVLAUNCH_PLATFORM_API_TOKEN;

    expect(() => assertPlatformApiWriteConfigured()).toThrow(
      /requires DEVLAUNCH_PLATFORM_API_TOKEN/
    );

    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
  });

  test("accepts valid platform-api configuration", () => {
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    process.env.DEVLAUNCH_PLATFORM_API_URL = "https://api.devlaunchsystems.com";
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = "test-token";

    expect(() => assertPlatformApiWriteConfigured()).not.toThrow();
    expect(getProjectWriteSource()).toBe("platform-api");

    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
  });
});

describe("read/write source independence", () => {
  test("PROJECT_READ_SOURCE does not affect write source resolution", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    delete process.env.PROJECT_WRITE_SOURCE;

    expect(resolveProjectWriteSource()).toBe("database");

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
  });

  test("PROJECT_WRITE_SOURCE does not affect read source resolution", async () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    delete process.env.PROJECT_READ_SOURCE;

    const { resolveProjectReadSource } = await import("@/lib/project-read/config");
    expect(resolveProjectReadSource()).toBe("database");

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
  });
});

describe("configuration error type", () => {
  test("throws ProjectWriteConfigurationError for incomplete platform-api config", () => {
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;
    delete process.env.DEVLAUNCH_PLATFORM_API_TOKEN;

    try {
      assertPlatformApiWriteConfigured();
      throw new Error("expected throw");
    } catch (error) {
      expect(error instanceof ProjectWriteConfigurationError).toBe(true);
    }

    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
  });
});
