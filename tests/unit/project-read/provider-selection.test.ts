import { describe, expect, test } from "bun:test";

import {
  getProjectReadProvider,
  resetProjectReadProviderForTests,
} from "@/lib/project-read";
import { ProjectReadConfigurationError } from "@/lib/project-read/config";

describe("getProjectReadProvider", () => {
  test("defaults to database provider", () => {
    resetProjectReadProviderForTests();
    const previousSource = process.env.PROJECT_READ_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    delete process.env.PROJECT_READ_SOURCE;
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;

    const provider = getProjectReadProvider();
    expect(provider.source).toBe("database");
    expect(provider.constructor.name).toBe("DatabaseProjectReadProvider");

    process.env.PROJECT_READ_SOURCE = previousSource;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    resetProjectReadProviderForTests();
  });

  test("selects platform-api in production when explicitly configured", () => {
    resetProjectReadProviderForTests();
    const previousSource = process.env.PROJECT_READ_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.DEVLAUNCH_PLATFORM_API_URL = "https://api.devlaunchsystems.com";

    const provider = getProjectReadProvider();
    expect(provider.source).toBe("platform-api");
    expect(provider.constructor.name).toBe("PlatformApiProjectReadProvider");

    process.env.PROJECT_READ_SOURCE = previousSource;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    resetProjectReadProviderForTests();
  });

  test("fails clearly when platform-api is selected without API URL", () => {
    resetProjectReadProviderForTests();
    const previousSource = process.env.PROJECT_READ_SOURCE;
    const previousUrl = process.env.DEVLAUNCH_PLATFORM_API_URL;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    delete process.env.DEVLAUNCH_PLATFORM_API_URL;

    let threw = false;
    try {
      getProjectReadProvider();
    } catch (error) {
      threw = true;
      expect(error instanceof ProjectReadConfigurationError).toBe(true);
    }
    expect(threw).toBe(true);

    process.env.PROJECT_READ_SOURCE = previousSource;
    process.env.DEVLAUNCH_PLATFORM_API_URL = previousUrl;
    resetProjectReadProviderForTests();
  });
});
