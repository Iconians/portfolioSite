import { describe, expect, test } from "bun:test";

import {
  assertPlatformProjectCreateAllowed,
  isPlatformProjectCreateAllowed,
  PLATFORM_PROJECT_CREATE_UNAVAILABLE_MESSAGE,
} from "@/lib/project-write/platform-create-policy";

describe("platform project create policy", () => {
  test("allows create in database mode", () => {
    expect(isPlatformProjectCreateAllowed("database")).toBe(true);
    expect(() => assertPlatformProjectCreateAllowed("database")).not.toThrow();
  });

  test("blocks create in platform-api mode", () => {
    expect(isPlatformProjectCreateAllowed("platform-api")).toBe(false);
    expect(() => assertPlatformProjectCreateAllowed("platform-api")).toThrow(
      PLATFORM_PROJECT_CREATE_UNAVAILABLE_MESSAGE
    );
  });
});
