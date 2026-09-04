import { describe, expect, test } from "bun:test";

import { ProjectWriteConfigurationError } from "@/lib/project-write/errors";
import {
  getProjectWriteProvider,
  resetProjectWriteProviderForTests,
} from "@/lib/project-write/provider";

describe("getProjectWriteProvider", () => {
  test("defaults to database provider", () => {
    resetProjectWriteProviderForTests();
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    delete process.env.PROJECT_READ_SOURCE;
    delete process.env.PROJECT_WRITE_SOURCE;
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;
    delete process.env.DEVLAUNCH_PLATFORM_API_TOKEN;

    const provider = getProjectWriteProvider();
    expect(provider.source).toBe("database");
    expect("client" in provider).toBe(false);

    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = previousToken;
    resetProjectWriteProviderForTests();
  });

  test("selects platform-api when explicitly configured", () => {
    resetProjectWriteProviderForTests();
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    const previousToken = process.env.DEVLAUNCH_PLATFORM_API_TOKEN;
    process.env.PROJECT_READ_SOURCE = "platform-api";
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
