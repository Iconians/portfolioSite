import { describe, expect, test } from "bun:test";

import {
  PlatformApiMalformedResponseError,
  PlatformApiNetworkError,
  PlatformApiReadClient,
  PlatformApiResponseError,
} from "@/lib/project-read/platform-api-client";

import type { PlatformApiCaseStudyDetail } from "@/lib/project-read/platform-api-types";

const detailFixture: PlatformApiCaseStudyDetail = {
  slug: "devlaunch-crm",
  title: "DevLaunch CRM",
  summary: "CRM platform",
  project_type: "saas",
  lifecycle_status: "active",
  content_version: 3,
  metrics: [{ label: "Users", value: "10+" }],
  milestones: [{ year: 2026, version: "v5", title: "Platform", description: null }],
};

function mockFetch(
  handler: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
): typeof fetch {
  return ((input, init) => handler(input, init)) as typeof fetch;
}

async function expectRejects(
  promise: Promise<unknown>,
  ErrorType: new (...args: never[]) => Error
): Promise<void> {
  let threw = false;
  try {
    await promise;
  } catch (error) {
    threw = true;
    expect(error instanceof ErrorType).toBe(true);
  }
  expect(threw).toBe(true);
}

describe("PlatformApiReadClient", () => {
  test("requests engineering consumer projection", async () => {
    let requestedUrl = "";
    let requestInit: RequestInit | undefined;
    const client = new PlatformApiReadClient({
      baseUrl: "http://127.0.0.1:8000",
      fetchImpl: mockFetch(async (input, init) => {
        requestedUrl = String(input);
        requestInit = init;
        return new Response(
          JSON.stringify({ items: [], total: 0, page: 1, limit: 50 }),
          {
            status: 200,
            headers: {
              ETag: 'W/"list-etag"',
              "Cache-Control": "public, max-age=300",
            },
          }
        );
      }),
    });

    const result = await client.listCaseStudies();
    expect(requestedUrl).toContain("/api/v1/case-studies?");
    expect(requestedUrl).toContain("consumer=engineering_portfolio");
    expect(requestedUrl).toContain("audience=engineering");
    expect(requestInit?.cache).not.toBe("no-store");
    expect(
      (requestInit as RequestInit & { next?: { revalidate?: number } }).next
        ?.revalidate
    ).toBe(3600);
    expect(result.status).toBe("ok");
    if (result.status === "ok") {
      expect(result.etag).toBe('W/"list-etag"');
    }
  });

  test("handles 304 not modified", async () => {
    const client = new PlatformApiReadClient({
      baseUrl: "http://127.0.0.1:8000",
      fetchImpl: mockFetch(async () => new Response(null, { status: 304 })),
    });

    const result = await client.getCaseStudyBySlug("devlaunch-crm", {
      ifNoneMatch: 'W/"etag"',
    });
    expect(result.status).toBe("not_modified");
  });

  test("maps 404 to response error", async () => {
    const client = new PlatformApiReadClient({
      baseUrl: "http://127.0.0.1:8000",
      fetchImpl: mockFetch(async () => new Response('{"detail":"not found"}', { status: 404 })),
    });

    await expectRejects(client.getCaseStudyBySlug("missing"), PlatformApiResponseError);
  });

  test("maps 429 with Retry-After", async () => {
    const client = new PlatformApiReadClient({
      baseUrl: "http://127.0.0.1:8000",
      fetchImpl: mockFetch(
        async () =>
          new Response('{"detail":"Rate limit exceeded"}', {
            status: 429,
            headers: { "Retry-After": "30" },
          })
      ),
    });

    try {
      await client.listCaseStudies();
      throw new Error("expected rejection");
    } catch (error) {
      expect(error instanceof PlatformApiResponseError).toBe(true);
      if (error instanceof PlatformApiResponseError) {
        expect(error.status).toBe(429);
        expect(error.retryAfterSeconds).toBe(30);
      }
    }
  });

  test("distinguishes network failures", async () => {
    const client = new PlatformApiReadClient({
      baseUrl: "http://127.0.0.1:8000",
      fetchImpl: mockFetch(async () => {
        throw new Error("connection refused");
      }),
    });

    await expectRejects(client.getCaseStudyBySlug("devlaunch-crm"), PlatformApiNetworkError);
  });

  test("rethrows Next.js dynamic rendering control-flow errors", async () => {
    const client = new PlatformApiReadClient({
      baseUrl: "http://127.0.0.1:8000",
      fetchImpl: mockFetch(async () => {
        const error = new Error("Dynamic server usage: test");
        Object.assign(error, { digest: "DYNAMIC_SERVER_USAGE" });
        throw error;
      }),
    });

    let threw = false;
    try {
      await client.getCaseStudyBySlug("devlaunch-crm");
    } catch (error) {
      threw = true;
      expect(error instanceof PlatformApiNetworkError).toBe(false);
      expect(
        typeof error === "object" &&
          error !== null &&
          "digest" in error &&
          error.digest === "DYNAMIC_SERVER_USAGE"
      ).toBe(true);
    }
    expect(threw).toBe(true);
  });

  test("rejects malformed JSON", async () => {
    const client = new PlatformApiReadClient({
      baseUrl: "http://127.0.0.1:8000",
      fetchImpl: mockFetch(async () => new Response("not-json", { status: 200 })),
    });

    await expectRejects(client.getCaseStudyBySlug("devlaunch-crm"), PlatformApiMalformedResponseError);
  });

  test("returns detail payload", async () => {
    const client = new PlatformApiReadClient({
      baseUrl: "http://127.0.0.1:8000",
      fetchImpl: mockFetch(async () => new Response(JSON.stringify(detailFixture), { status: 200 })),
    });

    const result = await client.getCaseStudyBySlug("devlaunch-crm");
    expect(result.status).toBe("ok");
    if (result.status === "ok") {
      expect(result.data.slug).toBe("devlaunch-crm");
    }
  });
});

describe("read-only surface", () => {
  test("client exposes only GET helpers", () => {
    const client = new PlatformApiReadClient({ baseUrl: "http://127.0.0.1:8000" });
    expect(typeof client.listCaseStudies).toBe("function");
    expect(typeof client.getCaseStudyBySlug).toBe("function");
    expect("createCaseStudy" in client).toBe(false);
    expect("publishCaseStudy" in client).toBe(false);
  });
});
