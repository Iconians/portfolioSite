import { describe, expect, test } from "bun:test";

import { CreatePortfolioProjectInputSchema } from "@/lib/project-write/create-portfolio-project-input";
import {
  PlatformApiAdminNetworkError,
  PlatformApiAdminResponseError,
} from "@/lib/project-write/errors";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import { PlatformProjectBridgeError } from "@/lib/project-write/platform-project-create-errors";

describe("CreatePortfolioProjectInputSchema", () => {
  test("requires title", () => {
    const result = CreatePortfolioProjectInputSchema.safeParse({
      title: "",
      projectType: "client",
    });

    expect(result.success).toBe(false);
  });

  test("requires project type", () => {
    const result = CreatePortfolioProjectInputSchema.safeParse({
      title: "Valid Title",
      projectType: "invalid",
    });

    expect(result.success).toBe(false);
  });

  test("accepts optional blank slug", () => {
    const result = CreatePortfolioProjectInputSchema.parse({
      title: "Valid Title",
      projectType: "engineering",
      slug: "",
    });

    expect(result.slug).toBe("");
  });

  test("rejects invalid slug format", () => {
    const result = CreatePortfolioProjectInputSchema.safeParse({
      title: "Valid Title",
      projectType: "saas",
      slug: "Bad Slug",
    });

    expect(result.success).toBe(false);
  });
});

describe("toPlatformProjectWriteUserMessage for M2 create", () => {
  test("maps 409 slug conflict", () => {
    const message = toPlatformProjectWriteUserMessage(
      new PlatformApiAdminResponseError(409, "Conflict", {
        detail: "Slug already exists",
        operation: "createCaseStudy",
      })
    );

    expect(message).toBe("Slug already exists");
  });

  test("maps 401 authorization failure", () => {
    const message = toPlatformProjectWriteUserMessage(
      new PlatformApiAdminResponseError(401, "Unauthorized", {
        operation: "createCaseStudy",
      })
    );

    expect(message.includes("authorization failed")).toBe(true);
  });

  test("maps network failure", () => {
    const message = toPlatformProjectWriteUserMessage(
      new PlatformApiAdminNetworkError("fetch failed")
    );

    expect(message.includes("Platform API request failed")).toBe(true);
  });

  test("maps bridge failure without delete guidance", () => {
    const message = toPlatformProjectWriteUserMessage(
      new PlatformProjectBridgeError("id-1", "bridge-slug")
    );

    expect(message.includes("preserved")).toBe(true);
    expect(message.toLowerCase().includes("delete")).toBe(false);
  });
});
