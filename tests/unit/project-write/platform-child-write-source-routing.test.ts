import { describe, expect, test } from "bun:test";

import { resetCoherentProjectSourceConfigurationForTests } from "@/lib/project-source/coherence";
import { getProjectWriteSource } from "@/lib/project-write/config";
import { LEGACY_SHARED_CONTENT_WRITE_FROZEN_MESSAGE } from "@/lib/project-write/platform-write-freeze-policy";

describe("platform child write source routing (M17)", () => {
  test("database write source is rejected after legacy write freeze", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    process.env.PROJECT_READ_SOURCE = "database";
    process.env.PROJECT_WRITE_SOURCE = "database";
    resetCoherentProjectSourceConfigurationForTests();
    expect(() => getProjectWriteSource()).toThrow(LEGACY_SHARED_CONTENT_WRITE_FROZEN_MESSAGE);
    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    resetCoherentProjectSourceConfigurationForTests();
  });

  test("platform-api write source remains required", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    process.env.PROJECT_READ_SOURCE = "platform-api";
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    resetCoherentProjectSourceConfigurationForTests();
    expect(getProjectWriteSource()).toBe("platform-api");
    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    resetCoherentProjectSourceConfigurationForTests();
  });
});
