import { describe, expect, test } from "bun:test";

import { resetCoherentProjectSourceConfigurationForTests } from "@/lib/project-source/coherence";
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
  test("rejects legacy database write source at coherence boundary", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_READ_SOURCE = "database";
    process.env.PROJECT_WRITE_SOURCE = "database";
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;
    delete process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    resetCoherentProjectSourceConfigurationForTests();

    expect(() => assertPlatformApiWriteConfigured()).toThrow(
      /Legacy Prisma shared-content writes are frozen/
    );

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
    resetCoherentProjectSourceConfigurationForTests();
  });

  test("requires API URL when platform-api is selected", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = "test-token";
    resetCoherentProjectSourceConfigurationForTests();

    expect(() => assertPlatformApiWriteConfigured()).toThrow(
      /requires DEVLAUNCH_PLATFORM_API_URL/
    );

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
    resetCoherentProjectSourceConfigurationForTests();
  });

  test("requires API token when platform-api is selected", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    process.env.DEVLAUNCH_PLATFORM_API_URL = "https://api.devlaunchsystems.com";
    delete process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    resetCoherentProjectSourceConfigurationForTests();

    expect(() => assertPlatformApiWriteConfigured()).toThrow(
      /requires DEVLAUNCH_PLATFORM_API_TOKEN/
    );

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
    resetCoherentProjectSourceConfigurationForTests();
  });

  test("accepts valid platform-api configuration", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    process.env.DEVLAUNCH_PLATFORM_API_URL = "https://api.devlaunchsystems.com";
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = "test-token";
    resetCoherentProjectSourceConfigurationForTests();

    expect(() => assertPlatformApiWriteConfigured()).not.toThrow();
    expect(getProjectWriteSource()).toBe("platform-api");

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
    resetCoherentProjectSourceConfigurationForTests();
  });
});

describe("read/write source independence (M17)", () => {
  test("unset read with explicit platform write is allowed for read rollback default", () => {
    const snapshot = {
      PROJECT_READ_SOURCE: process.env.PROJECT_READ_SOURCE,
      PROJECT_WRITE_SOURCE: process.env.PROJECT_WRITE_SOURCE,
    };
    delete process.env.PROJECT_READ_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    resetCoherentProjectSourceConfigurationForTests();

    expect(getProjectWriteSource()).toBe("platform-api");

    process.env.PROJECT_READ_SOURCE = snapshot.PROJECT_READ_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = snapshot.PROJECT_WRITE_SOURCE;
    resetCoherentProjectSourceConfigurationForTests();
  });

  test("explicit platform read with unset write rejects frozen legacy default", async () => {
    const snapshot = {
      PROJECT_READ_SOURCE: process.env.PROJECT_READ_SOURCE,
      PROJECT_WRITE_SOURCE: process.env.PROJECT_WRITE_SOURCE,
    };
    process.env.PROJECT_READ_SOURCE = "platform-api";
    delete process.env.PROJECT_WRITE_SOURCE;
    resetCoherentProjectSourceConfigurationForTests();

    const { getProjectReadSource } = await import("@/lib/project-read/config");
    expect(() => getProjectReadSource()).toThrow(/Legacy Prisma shared-content writes are frozen/);

    process.env.PROJECT_READ_SOURCE = snapshot.PROJECT_READ_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = snapshot.PROJECT_WRITE_SOURCE;
    resetCoherentProjectSourceConfigurationForTests();
  });
});

describe("configuration error type", () => {
  test("throws ProjectWriteConfigurationError for incomplete platform-api config", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;
    delete process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    resetCoherentProjectSourceConfigurationForTests();

    try {
      assertPlatformApiWriteConfigured();
      throw new Error("expected throw");
    } catch (error) {
      expect(error instanceof ProjectWriteConfigurationError).toBe(true);
    }

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
    resetCoherentProjectSourceConfigurationForTests();
  });
});

describe("incoherent source configuration", () => {
  test("invalid write with platform read throws configuration error", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platfrom-api";
    resetCoherentProjectSourceConfigurationForTests();

    expect(() => getProjectWriteSource()).toThrow(/Invalid PROJECT_WRITE_SOURCE/);

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    resetCoherentProjectSourceConfigurationForTests();
  });
});
