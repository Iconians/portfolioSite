import { describe, expect, test } from "bun:test";

import { resetCoherentProjectSourceConfigurationForTests } from "@/lib/project-source/coherence";
import { ProjectWriteConfigurationError } from "@/lib/project-write/errors";
import {
  getProjectWriteProvider,
  resetProjectWriteProviderForTests,
} from "@/lib/project-write/provider";

describe("getProjectWriteProvider", () => {
  test("requires platform-api write configuration", () => {
    resetProjectWriteProviderForTests();
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_READ_SOURCE = "database";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    process.env.DEVLAUNCH_PLATFORM_API_URL = "https://api.devlaunchsystems.com";
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = "test-token";

    const provider = getProjectWriteProvider();
    expect(provider.source).toBe("platform-api");
    if (provider.source === "platform-api") {
      expect(provider.client.constructor.name).toBe("PlatformApiAdminClient");
    }

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
    resetProjectWriteProviderForTests();
  });

  test("rejects legacy database write source", () => {
    resetProjectWriteProviderForTests();
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    process.env.PROJECT_READ_SOURCE = "database";
    process.env.PROJECT_WRITE_SOURCE = "database";
    resetCoherentProjectSourceConfigurationForTests();

    let threw = false;
    try {
      getProjectWriteProvider();
    } catch (error) {
      threw = true;
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toMatch(/Legacy Prisma shared-content writes are frozen/);
    }
    expect(threw).toBe(true);

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    resetProjectWriteProviderForTests();
  });

  test("fails clearly when platform-api is selected without API URL", () => {
    resetProjectWriteProviderForTests();
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = "test-token";

    let threw = false;
    try {
      getProjectWriteProvider();
    } catch (error) {
      threw = true;
      expect(error instanceof ProjectWriteConfigurationError).toBe(true);
    }
    expect(threw).toBe(true);

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
    resetProjectWriteProviderForTests();
  });

  test("fails clearly when platform-api is selected without token", () => {
    resetProjectWriteProviderForTests();
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    process.env.DEVLAUNCH_PLATFORM_API_URL = "https://api.devlaunchsystems.com";
    delete process.env.DEVLAUNCH_PLATFORM_API_TOKEN;

    let threw = false;
    try {
      getProjectWriteProvider();
    } catch (error) {
      threw = true;
      expect(error instanceof ProjectWriteConfigurationError).toBe(true);
    }
    expect(threw).toBe(true);

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
    resetProjectWriteProviderForTests();
  });
});
