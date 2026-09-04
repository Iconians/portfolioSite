import { describe, expect, test } from "bun:test";

import { resetCoherentProjectSourceConfigurationForTests } from "@/lib/project-source/coherence";
import { getProjectWriteSource } from "@/lib/project-write/config";

describe("admin preview fallback policy", () => {
  test("database write source allows Prisma draft preview fallback", () => {
    const snapshot = {
      PROJECT_READ_SOURCE: process.env.PROJECT_READ_SOURCE,
      PROJECT_WRITE_SOURCE: process.env.PROJECT_WRITE_SOURCE,
    };
    process.env.PROJECT_READ_SOURCE = "database";
    process.env.PROJECT_WRITE_SOURCE = "database";
    resetCoherentProjectSourceConfigurationForTests();

    expect(getProjectWriteSource()).toBe("database");

    process.env.PROJECT_READ_SOURCE = snapshot.PROJECT_READ_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = snapshot.PROJECT_WRITE_SOURCE;
    resetCoherentProjectSourceConfigurationForTests();
  });

  test("platform-api write source disables Prisma draft preview fallback", () => {
    const snapshot = {
      PROJECT_READ_SOURCE: process.env.PROJECT_READ_SOURCE,
      PROJECT_WRITE_SOURCE: process.env.PROJECT_WRITE_SOURCE,
    };
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    resetCoherentProjectSourceConfigurationForTests();

    expect(getProjectWriteSource()).toBe("platform-api");

    process.env.PROJECT_READ_SOURCE = snapshot.PROJECT_READ_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = snapshot.PROJECT_WRITE_SOURCE;
    resetCoherentProjectSourceConfigurationForTests();
  });
});
