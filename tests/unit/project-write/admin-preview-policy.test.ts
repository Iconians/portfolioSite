import { describe, expect, test } from "bun:test";

import { getProjectWriteSource } from "@/lib/project-write/config";

describe("admin preview fallback policy", () => {
  test("database write source allows Prisma draft preview fallback", () => {
    const previous = process.env.PROJECT_WRITE_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = "database";
    expect(getProjectWriteSource()).toBe("database");
    process.env.PROJECT_WRITE_SOURCE = previous;
  });

  test("platform-api write source disables Prisma draft preview fallback", () => {
    const previous = process.env.PROJECT_WRITE_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    expect(getProjectWriteSource()).toBe("platform-api");
    process.env.PROJECT_WRITE_SOURCE = previous;
  });
});
