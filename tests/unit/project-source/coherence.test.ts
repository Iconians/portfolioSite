import { afterEach, describe, expect, test } from "bun:test";

import { getProjectReadSource } from "@/lib/project-read/config";
import {
  getCoherentProjectSourceConfiguration,
  parseProjectSourceRaw,
  resetCoherentProjectSourceConfigurationForTests,
  resolveCoherentProjectSourceConfiguration,
} from "@/lib/project-source/coherence";
import { assertPlatformApiWriteConfigured, getProjectWriteSource } from "@/lib/project-write/config";

const ENV_KEYS = [
  "PROJECT_READ_SOURCE",
  "PROJECT_WRITE_SOURCE",
  "DEVLAUNCH_PLATFORM_API_URL",
  "DEVLAUNCH_PLATFORM_API_TOKEN",
] as const;

type EnvSnapshot = Record<(typeof ENV_KEYS)[number], string | undefined>;

function snapshotEnv(): EnvSnapshot {
  return {
    PROJECT_READ_SOURCE: process.env.PROJECT_READ_SOURCE,
    PROJECT_WRITE_SOURCE: process.env.PROJECT_WRITE_SOURCE,
    DEVLAUNCH_PLATFORM_API_URL: process.env.DEVLAUNCH_PLATFORM_API_URL,
    DEVLAUNCH_PLATFORM_API_TOKEN: process.env.DEVLAUNCH_PLATFORM_API_TOKEN,
  };
}

function restoreEnv(snapshot: EnvSnapshot): void {
  for (const key of ENV_KEYS) {
    const value = snapshot[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  resetCoherentProjectSourceConfigurationForTests();
}

afterEach(() => {
  resetCoherentProjectSourceConfigurationForTests();
});

describe("project source coherence (M17 write freeze)", () => {
  test("platform-api write with database read is allowed for read rollback", () => {
    const config = resolveCoherentProjectSourceConfiguration({
      PROJECT_READ_SOURCE: "database",
      PROJECT_WRITE_SOURCE: "platform-api",
    });
    expect(config.readSource).toBe("database");
    expect(config.writeSource).toBe("platform-api");
  });

  test("platform-api/platform-api is allowed", () => {
    const config = resolveCoherentProjectSourceConfiguration({
      PROJECT_READ_SOURCE: "platform-api",
      PROJECT_WRITE_SOURCE: "platform-api",
    });
    expect(config.readSource).toBe("platform-api");
    expect(config.writeSource).toBe("platform-api");
  });

  test("unset read with platform write defaults read to database", () => {
    const config = resolveCoherentProjectSourceConfiguration({
      PROJECT_WRITE_SOURCE: "platform-api",
    });
    expect(config.readSource).toBe("database");
    expect(config.writeSource).toBe("platform-api");
  });

  test("database/database rejects frozen legacy write source", () => {
    expect(() =>
      resolveCoherentProjectSourceConfiguration({
        PROJECT_READ_SOURCE: "database",
        PROJECT_WRITE_SOURCE: "database",
      })
    ).toThrow(/Legacy Prisma shared-content writes are frozen/);
  });

  test("unset/unset rejects missing platform write source", () => {
    expect(() => resolveCoherentProjectSourceConfiguration({})).toThrow(
      /Legacy Prisma shared-content writes are frozen/
    );
  });

  test("platform read with missing write rejects frozen legacy default", () => {
    expect(() =>
      resolveCoherentProjectSourceConfiguration({
        PROJECT_READ_SOURCE: "platform-api",
      })
    ).toThrow(/Legacy Prisma shared-content writes are frozen/);
  });

  test("invalid write with platform read rejects before silent database fallback", () => {
    expect(() =>
      resolveCoherentProjectSourceConfiguration({
        PROJECT_READ_SOURCE: "platform-api",
        PROJECT_WRITE_SOURCE: "platfrom-api",
      })
    ).toThrow(/Invalid PROJECT_WRITE_SOURCE/);
  });

  test("invalid read with platform write rejects before silent database fallback", () => {
    expect(() =>
      resolveCoherentProjectSourceConfiguration({
        PROJECT_READ_SOURCE: "platfrom-api",
        PROJECT_WRITE_SOURCE: "platform-api",
      })
    ).toThrow(/Invalid PROJECT_READ_SOURCE/);
  });

  test("getProjectReadSource and getProjectWriteSource share coherent configuration", () => {
    const snapshot = snapshotEnv();
    process.env.PROJECT_READ_SOURCE = "database";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    process.env.DEVLAUNCH_PLATFORM_API_URL = "https://api.devlaunchsystems.com";
    process.env.DEVLAUNCH_PLATFORM_API_TOKEN = "test-token";

    expect(getProjectReadSource()).toBe("database");
    expect(getProjectWriteSource()).toBe("platform-api");
    expect(getCoherentProjectSourceConfiguration().readSource).toBe("database");

    restoreEnv(snapshot);
  });

  test("platform-api write still requires token for write configuration assert", () => {
    const snapshot = snapshotEnv();
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    process.env.DEVLAUNCH_PLATFORM_API_URL = "https://api.devlaunchsystems.com";
    delete process.env.DEVLAUNCH_PLATFORM_API_TOKEN;

    expect(() => assertPlatformApiWriteConfigured()).toThrow(
      /requires DEVLAUNCH_PLATFORM_API_TOKEN/
    );

    restoreEnv(snapshot);
  });
});

describe("parseProjectSourceRaw", () => {
  test("classifies unset, database, platform-api, and invalid values", () => {
    expect(parseProjectSourceRaw(undefined)).toBe("unset");
    expect(parseProjectSourceRaw("database")).toBe("database");
    expect(parseProjectSourceRaw("platform-api")).toBe("platform-api");
    expect(parseProjectSourceRaw("platfrom-api")).toBe("invalid");
  });
});
