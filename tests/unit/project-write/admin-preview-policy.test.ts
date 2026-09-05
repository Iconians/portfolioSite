import { describe, expect, test } from "bun:test";

import { getProjectReadSource } from "@/lib/project-read/config";
import { resetCoherentProjectSourceConfigurationForTests } from "@/lib/project-source/coherence";
import { getProjectWriteSource } from "@/lib/project-write/config";

describe("admin preview fallback policy (M17)", () => {
  test("database read with frozen platform write keeps read rollback independent", () => {
    const snapshot = {
      PROJECT_READ_SOURCE: process.env.PROJECT_READ_SOURCE,
      PROJECT_WRITE_SOURCE: process.env.PROJECT_WRITE_SOURCE,
    };
    process.env.PROJECT_READ_SOURCE = "database";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    resetCoherentProjectSourceConfigurationForTests();

    expect(getProjectReadSource()).toBe("database");
    expect(getProjectWriteSource()).toBe("platform-api");

    process.env.PROJECT_READ_SOURCE = snapshot.PROJECT_READ_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = snapshot.PROJECT_WRITE_SOURCE;
    resetCoherentProjectSourceConfigurationForTests();
  });

  test("platform read with platform write remains supported", () => {
    const snapshot = {
      PROJECT_READ_SOURCE: process.env.PROJECT_READ_SOURCE,
      PROJECT_WRITE_SOURCE: process.env.PROJECT_WRITE_SOURCE,
    };
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    resetCoherentProjectSourceConfigurationForTests();

    expect(getProjectReadSource()).toBe("platform-api");
    expect(getProjectWriteSource()).toBe("platform-api");

    process.env.PROJECT_READ_SOURCE = snapshot.PROJECT_READ_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = snapshot.PROJECT_WRITE_SOURCE;
    resetCoherentProjectSourceConfigurationForTests();
  });
});
