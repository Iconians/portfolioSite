import { describe, expect, test } from "bun:test";

import { resetCoherentProjectSourceConfigurationForTests } from "@/lib/project-source/coherence";
import { getProjectWriteSource } from "@/lib/project-write/config";

describe("platform child write source routing", () => {
  test("database source retains Prisma child write path selection", () => {
    const previousRead = process.env.PROJECT_READ_SOURCE;
    const previousWrite = process.env.PROJECT_WRITE_SOURCE;
    process.env.PROJECT_READ_SOURCE = "database";
    process.env.PROJECT_WRITE_SOURCE = "database";
    resetCoherentProjectSourceConfigurationForTests();
    expect(getProjectWriteSource()).toBe("database");
    process.env.PROJECT_READ_SOURCE = previousRead;
    process.env.PROJECT_WRITE_SOURCE = previousWrite;
    resetCoherentProjectSourceConfigurationForTests();
  });

  test("platform-api source selects Platform child write path", () => {
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
