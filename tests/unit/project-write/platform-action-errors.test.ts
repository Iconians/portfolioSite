import { describe, expect, test } from "bun:test";

import { AdminProjectLoadError } from "@/lib/project-write/admin-project-load-error";
import {
  PlatformApiAdminMalformedResponseError,
  PlatformApiAdminNetworkError,
  PlatformApiAdminResponseError,
  ProjectWriteConfigurationError,
} from "@/lib/project-write/errors";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import { PlatformSlugImmutableError } from "@/lib/project-write/platform-update-errors";

describe("toPlatformProjectWriteUserMessage", () => {
  test("maps slug immutability errors", () => {
    expect(toPlatformProjectWriteUserMessage(new PlatformSlugImmutableError())).toContain(
      "slug is immutable"
    );
  });

  test("maps identity bridge errors", () => {
    expect(
      toPlatformProjectWriteUserMessage(
        new AdminProjectLoadError("No Platform case study found for slug")
      )
    ).toContain("No Platform case study found");
  });

  test("maps configuration errors", () => {
    expect(
      toPlatformProjectWriteUserMessage(
        new ProjectWriteConfigurationError("PROJECT_WRITE_SOURCE=platform-api requires token")
      )
    ).toContain("requires token");
  });

  test("preserves 422 validation detail", () => {
    expect(
      toPlatformProjectWriteUserMessage(
        new PlatformApiAdminResponseError(422, "validation failed", {
          detail: "title: required",
        })
      )
    ).toBe("title: required");
  });

  test("maps 429 without leaking internals", () => {
    expect(
      toPlatformProjectWriteUserMessage(
        new PlatformApiAdminResponseError(429, "rate limited", {
          retryAfterSeconds: 30,
        })
      )
    ).toContain("rate limit");
  });

  test("maps network errors safely", () => {
    expect(
      toPlatformProjectWriteUserMessage(new PlatformApiAdminNetworkError("timeout"))
    ).toContain("connectivity");
  });

  test("maps malformed response errors", () => {
    expect(
      toPlatformProjectWriteUserMessage(
        new PlatformApiAdminMalformedResponseError("missing id")
      )
    ).toBe("missing id");
  });
});
