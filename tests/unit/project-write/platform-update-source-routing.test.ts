import { describe, expect, test } from "bun:test";

import { getProjectWriteSource } from "@/lib/project-write/config";

describe("platform project update source routing", () => {
  test("database source retains Prisma update path selection", () => {
    const previous = process.env.PROJECT_WRITE_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = "database";
    expect(getProjectWriteSource()).toBe("database");
    process.env.PROJECT_WRITE_SOURCE = previous;
  });

  test("platform-api source selects Platform update path", () => {
    const previous = process.env.PROJECT_WRITE_SOURCE;
    process.env.PROJECT_WRITE_SOURCE = "platform-api";
    expect(getProjectWriteSource()).toBe("platform-api");
    process.env.PROJECT_WRITE_SOURCE = previous;
  });
});
