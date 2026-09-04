import { describe, expect, test } from "bun:test";

import {
  PlatformApiAdminClient,
} from "@/lib/project-write/platform-api-admin-client";

const FAKE_TOKEN = "test-platform-token-do-not-leak";
const PLATFORM_CASE_STUDY_ID = "00000000-0000-4000-8000-000000000001";
const PORTFOLIO_LOCAL_ID = "11111111-1111-4111-8111-111111111111";

const lifecycleDetailFixture = {
  id: PLATFORM_CASE_STUDY_ID,
  slug: "devlaunch-crm",
  title: "DevLaunch CRM",
  lifecycle_status: "archived",
  publish_status: "published",
  archived_at: "2026-01-02T00:00:00Z",
  published_at: "2026-01-01T00:00:00Z",
  project_type: "client",
  content_version: 2,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-02T00:00:00Z",
};

function mockFetch(
  handler: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
): typeof fetch {
  return ((input, init) => handler(input, init)) as typeof fetch;
}

function createClient(fetchImpl: typeof fetch): PlatformApiAdminClient {
  return new PlatformApiAdminClient({
    baseUrl: "https://api.devlaunchsystems.com",
    token: FAKE_TOKEN,
    fetchImpl,
  });
}

describe("Platform lifecycle admin client", () => {
  test("publish uses POST /case-studies/{id}/publish with bearer auth", async () => {
    let capturedUrl = "";
    let capturedMethod = "";
    let capturedAuth = "";

    const client = createClient(
      mockFetch(async (input, init) => {
        capturedUrl = String(input);
        capturedMethod = init?.method ?? "GET";
        capturedAuth = new Headers(init?.headers).get("Authorization") ?? "";
        return Response.json({
          ...lifecycleDetailFixture,
          publish_status: "published",
        });
      })
    );

    const detail = await client.publishCaseStudy(PLATFORM_CASE_STUDY_ID);
    expect(capturedUrl).toBe(
      `https://api.devlaunchsystems.com/api/v1/admin/case-studies/${PLATFORM_CASE_STUDY_ID}/publish`
    );
    expect(capturedMethod).toBe("POST");
    expect(capturedAuth).toBe(`Bearer ${FAKE_TOKEN}`);
    expect(detail.publish_status).toBe("published");
    expect(detail.id).toBe(PLATFORM_CASE_STUDY_ID);
    expect(detail.id).not.toBe(PORTFOLIO_LOCAL_ID);
  });

  test("unpublish uses POST /case-studies/{id}/unpublish", async () => {
    let capturedUrl = "";
    const client = createClient(
      mockFetch(async (input) => {
        capturedUrl = String(input);
        return Response.json({
          ...lifecycleDetailFixture,
          publish_status: "draft",
        });
      })
    );

    const detail = await client.unpublishCaseStudy(PLATFORM_CASE_STUDY_ID);
    expect(capturedUrl.endsWith(`/case-studies/${PLATFORM_CASE_STUDY_ID}/unpublish`)).toBe(true);
    expect(detail.publish_status).toBe("draft");
  });

  test("archive uses POST /case-studies/{id}/archive", async () => {
    let capturedUrl = "";
    const client = createClient(
      mockFetch(async (input) => {
        capturedUrl = String(input);
        return Response.json(lifecycleDetailFixture);
      })
    );

    const detail = await client.archiveCaseStudy(PLATFORM_CASE_STUDY_ID);
    expect(capturedUrl.endsWith(`/case-studies/${PLATFORM_CASE_STUDY_ID}/archive`)).toBe(true);
    expect(detail.archived_at).toBe("2026-01-02T00:00:00Z");
    expect(detail.lifecycle_status).toBe("archived");
  });

  test("maps 403 archive scope failures safely", async () => {
    const client = createClient(
      mockFetch(async () =>
        Response.json({ detail: "Insufficient scope" }, { status: 403 })
      )
    );

    try {
      await client.archiveCaseStudy(PLATFORM_CASE_STUDY_ID);
      throw new Error("expected rejection");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toContain("Insufficient scope");
    }
  });
});
