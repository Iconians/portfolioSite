import { describe, expect, test } from "bun:test";

import {
  PlatformApiAdminMalformedResponseError,
  PlatformApiAdminNetworkError,
  PlatformApiAdminResponseError,
} from "@/lib/project-write/errors";
import {
  PlatformApiAdminClient,
} from "@/lib/project-write/platform-api-admin-client";

const FAKE_TOKEN = "test-platform-token-do-not-leak";

const PLATFORM_CASE_STUDY_ID = "00000000-0000-4000-8000-000000000001";

const listFixture = {
  items: [
    {
      id: PLATFORM_CASE_STUDY_ID,
      slug: "devlaunch-crm",
      title: "DevLaunch CRM",
    },
  ],
  total: 1,
  page: 1,
  limit: 50,
};

const mediaListFixture = {
  items: [
    {
      id: "00000000-0000-4000-8000-000000000010",
      case_study_id: PLATFORM_CASE_STUDY_ID,
      storage_key: "portfolio/projects/heroes/a.png",
      public_url: "https://cdn.example/hero.png",
      role: "hero",
      alt_text: "Hero",
      sort_order: 0,
      upload_status: "ready",
      created_at: "2026-01-01T00:00:00Z",
    },
  ],
  total: 1,
  page: 1,
  limit: 50,
};

const detailFixture = {
  id: PLATFORM_CASE_STUDY_ID,
  slug: "devlaunch-crm",
  title: "DevLaunch CRM",
  lifecycle_status: "active",
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

async function expectRejects(
  promise: Promise<unknown>,
  ErrorType: new (...args: never[]) => Error
): Promise<Error> {
  try {
    await promise;
    throw new Error("expected rejection");
  } catch (error) {
    expect(error instanceof ErrorType).toBe(true);
    return error as Error;
  }
}

function assertTokenNotLeaked(value: string): void {
  expect(value.includes(FAKE_TOKEN)).toBe(false);
  expect(value.includes("Bearer")).toBe(false);
}

describe("PlatformApiAdminClient", () => {
  test("requests admin list with Bearer authorization", async () => {
    let requestedUrl = "";
    let requestInit: RequestInit | undefined;
    const client = createClient(
      mockFetch(async (input, init) => {
        requestedUrl = String(input);
        requestInit = init;
        return new Response(JSON.stringify(listFixture), { status: 200 });
      })
    );

    const result = await client.listCaseStudies();
    expect(requestedUrl).toBe(
      "https://api.devlaunchsystems.com/api/v1/admin/case-studies"
    );
    expect(requestInit?.headers).toEqual({
      Authorization: `Bearer ${FAKE_TOKEN}`,
      Accept: "application/json",
    });
    expect(requestInit?.cache).toBe("no-store");
    expect(result.items.length).toBe(1);
  });

  test("requests admin detail by Platform case-study UUID", async () => {
    let requestedUrl = "";
    const client = createClient(
      mockFetch(async (input) => {
        requestedUrl = String(input);
        return new Response(JSON.stringify(detailFixture), { status: 200 });
      })
    );

    const result = await client.getCaseStudyById(PLATFORM_CASE_STUDY_ID);
    expect(requestedUrl).toBe(
      `https://api.devlaunchsystems.com/api/v1/admin/case-studies/${PLATFORM_CASE_STUDY_ID}`
    );
    expect(result.id).toBe(PLATFORM_CASE_STUDY_ID);
    expect(result.slug).toBe("devlaunch-crm");
  });

  test("requests admin media list with Bearer authorization and filters", async () => {
    let requestedUrl = "";
    let requestInit: RequestInit | undefined;
    const client = createClient(
      mockFetch(async (input, init) => {
        requestedUrl = String(input);
        requestInit = init;
        return new Response(JSON.stringify(mediaListFixture), { status: 200 });
      })
    );

    const result = await client.listMedia({
      caseStudyId: PLATFORM_CASE_STUDY_ID,
      role: "hero",
      uploadStatus: "ready",
      page: 2,
      limit: 25,
    });

    expect(requestedUrl).toBe(
      "https://api.devlaunchsystems.com/api/v1/admin/media?case_study_id=00000000-0000-4000-8000-000000000001&role=hero&upload_status=ready&page=2&limit=25"
    );
    expect(requestInit?.headers).toEqual({
      Authorization: `Bearer ${FAKE_TOKEN}`,
      Accept: "application/json",
    });
    expect(requestInit?.cache).toBe("no-store");
    expect(result.items.length).toBe(1);
    expect(result.items[0]?.id).toBe("00000000-0000-4000-8000-000000000010");
  });

  test("rejects media list response missing items array", async () => {
    const client = createClient(
      mockFetch(async () => new Response(JSON.stringify({ total: 0 }), { status: 200 }))
    );

    await expectRejects(client.listMedia(), PlatformApiAdminMalformedResponseError);
  });

  test("handles 204 no-content success", async () => {
    const client = createClient(
      mockFetch(async () => new Response(null, { status: 204 }))
    );

    const result = await (
      client as unknown as {
        requestJson: (path: string) => Promise<void>;
      }
    ).requestJson("/noop");

    expect(result).toBeUndefined();
  });

  test("maps 401 to response error without leaking token", async () => {
    const client = createClient(
      mockFetch(async () =>
        new Response(JSON.stringify({ detail: "Invalid credentials" }), {
          status: 401,
        })
      )
    );

    const error = await expectRejects(
      client.getCaseStudyById(PLATFORM_CASE_STUDY_ID),
      PlatformApiAdminResponseError
    );
    assertTokenNotLeaked(error.message);
    if (error instanceof PlatformApiAdminResponseError) {
      expect(error.status).toBe(401);
      assertTokenNotLeaked(error.detail ?? "");
    }
  });

  test("maps 403 to response error", async () => {
    const client = createClient(
      mockFetch(async () =>
        new Response(JSON.stringify({ detail: "Forbidden" }), { status: 403 })
      )
    );

    const error = await expectRejects(
      client.listCaseStudies(),
      PlatformApiAdminResponseError
    );
    if (error instanceof PlatformApiAdminResponseError) {
      expect(error.status).toBe(403);
    }
  });

  test("maps 404 to response error", async () => {
    const client = createClient(
      mockFetch(async () =>
        new Response(JSON.stringify({ detail: "Not found" }), { status: 404 })
      )
    );

    const error = await expectRejects(
      client.getCaseStudyById("00000000-0000-4000-8000-000000000099"),
      PlatformApiAdminResponseError
    );
    if (error instanceof PlatformApiAdminResponseError) {
      expect(error.status).toBe(404);
    }
  });

  test("maps 409 to response error", async () => {
    const client = createClient(
      mockFetch(async () =>
        new Response(JSON.stringify({ detail: "Conflict" }), { status: 409 })
      )
    );

    const error = await expectRejects(
      client.listCaseStudies(),
      PlatformApiAdminResponseError
    );
    if (error instanceof PlatformApiAdminResponseError) {
      expect(error.status).toBe(409);
    }
  });

  test("preserves 422 detail", async () => {
    const client = createClient(
      mockFetch(async () =>
        new Response(
          JSON.stringify({ detail: "slug must be lowercase kebab-case" }),
          { status: 422 }
        )
      )
    );

    const error = await expectRejects(
      client.listCaseStudies(),
      PlatformApiAdminResponseError
    );
    if (error instanceof PlatformApiAdminResponseError) {
      expect(error.status).toBe(422);
      expect(error.detail).toBe("slug must be lowercase kebab-case");
    }
  });

  test("maps 429 with Retry-After", async () => {
    const client = createClient(
      mockFetch(async () =>
        new Response(JSON.stringify({ detail: "Rate limit exceeded" }), {
          status: 429,
          headers: { "Retry-After": "45" },
        })
      )
    );

    const error = await expectRejects(
      client.listCaseStudies(),
      PlatformApiAdminResponseError
    );
    if (error instanceof PlatformApiAdminResponseError) {
      expect(error.status).toBe(429);
      expect(error.retryAfterSeconds).toBe(45);
    }
  });

  test("maps 500 and 503 to response errors", async () => {
    for (const status of [500, 503]) {
      const client = createClient(
        mockFetch(async () =>
          new Response(JSON.stringify({ detail: "Server error" }), { status })
        )
      );

      const error = await expectRejects(
        client.listCaseStudies(),
        PlatformApiAdminResponseError
      );
      if (error instanceof PlatformApiAdminResponseError) {
        expect(error.status).toBe(status);
      }
    }
  });

  test("distinguishes network failures without leaking token", async () => {
    const client = createClient(
      mockFetch(async () => {
        throw new Error("connection refused");
      })
    );

    const error = await expectRejects(
      client.listCaseStudies(),
      PlatformApiAdminNetworkError
    );
    assertTokenNotLeaked(error.message);
  });

  test("rejects malformed JSON", async () => {
    const client = createClient(
      mockFetch(async () => new Response("not-json", { status: 200 }))
    );

    await expectRejects(
      client.getCaseStudyById(PLATFORM_CASE_STUDY_ID),
      PlatformApiAdminMalformedResponseError
    );
  });

  test("rejects list response missing items array", async () => {
    const client = createClient(
      mockFetch(async () => new Response(JSON.stringify({ total: 0 }), { status: 200 }))
    );

    await expectRejects(client.listCaseStudies(), PlatformApiAdminMalformedResponseError);
  });

  test("network error cause does not include configured bearer token", async () => {
    const client = createClient(
      mockFetch(async () => {
        throw new Error("connection reset");
      })
    );

    const error = await expectRejects(
      client.listCaseStudies(),
      PlatformApiAdminNetworkError
    );
    assertTokenNotLeaked(error.message);
    if (error.cause instanceof Error) {
      assertTokenNotLeaked(error.cause.message);
    }
  });

  test("patches case study by Platform UUID with JSON body", async () => {
    let requestedUrl = "";
    let requestInit: RequestInit | undefined;
    const client = createClient(
      mockFetch(async (input, init) => {
        requestedUrl = String(input);
        requestInit = init;
        return new Response(JSON.stringify(detailFixture), { status: 200 });
      })
    );

    const result = await client.updateCaseStudy(PLATFORM_CASE_STUDY_ID, {
      title: "Updated title",
      technologies: [],
    });

    expect(requestedUrl).toBe(
      `https://api.devlaunchsystems.com/api/v1/admin/case-studies/${PLATFORM_CASE_STUDY_ID}`
    );
    expect(requestInit?.method).toBe("PATCH");
    expect(requestInit?.headers).toEqual({
      Authorization: `Bearer ${FAKE_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    expect(requestInit?.cache).toBe("no-store");
    expect(JSON.parse(String(requestInit?.body))).toEqual({
      title: "Updated title",
      technologies: [],
    });
    expect(result.id).toBe(PLATFORM_CASE_STUDY_ID);
  });

  test("maps PATCH 422 validation errors without leaking token", async () => {
    const client = createClient(
      mockFetch(async () =>
        new Response(JSON.stringify({ detail: "Unknown field rejected" }), {
          status: 422,
        })
      )
    );

    const error = await expectRejects(
      client.updateCaseStudy(PLATFORM_CASE_STUDY_ID, { title: "X" }),
      PlatformApiAdminResponseError
    );
    assertTokenNotLeaked(error.message);
    if (error instanceof PlatformApiAdminResponseError) {
      expect(error.status).toBe(422);
      expect(error.detail).toBe("Unknown field rejected");
    }
  });

  test("creates metric under Platform case-study UUID", async () => {
    const metricId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    let requestedUrl = "";
    const client = createClient(
      mockFetch(async (input) => {
        requestedUrl = String(input);
        return new Response(
          JSON.stringify({
            id: metricId,
            label: "Uptime",
            value: "99.9%",
            description: null,
            show_on_business: true,
            sort_order: 0,
          }),
          { status: 201 }
        );
      })
    );

    const result = await client.createMetric(PLATFORM_CASE_STUDY_ID, {
      label: "Uptime",
      value: "99.9%",
    });

    expect(requestedUrl).toBe(
      `https://api.devlaunchsystems.com/api/v1/admin/case-studies/${PLATFORM_CASE_STUDY_ID}/metrics`
    );
    expect(result.id).toBe(metricId);
  });

  test("deletes metric with 204 no-content", async () => {
    const metricId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    let requestedUrl = "";
    const client = createClient(
      mockFetch(async (input) => {
        requestedUrl = String(input);
        return new Response(null, { status: 204 });
      })
    );

    await client.deleteMetric(metricId);
    expect(requestedUrl).toBe(
      `https://api.devlaunchsystems.com/api/v1/admin/metrics/${metricId}`
    );
  });
  test("presigns case-study media with Bearer authorization", async () => {
    const mediaId = "00000000-0000-4000-8000-000000000010";
    let requestedUrl = "";
    let requestInit: RequestInit | undefined;
    const client = createClient(
      mockFetch(async (input, init) => {
        requestedUrl = String(input);
        requestInit = init;
        return new Response(
          JSON.stringify({
            media_id: mediaId,
            storage_key: "portfolio/projects/heroes/a.png",
            upload_url: "https://r2.example/upload",
            upload_headers: { "Content-Type": "image/png" },
            public_url: "https://cdn.example/hero.png",
            expires_in: 900,
          }),
          { status: 200 }
        );
      })
    );

    const result = await client.presignCaseStudyMedia(PLATFORM_CASE_STUDY_ID, {
      filename: "hero.png",
      mime_type: "image/png",
      size_bytes: 1024,
      role: "hero",
    });

    expect(requestedUrl).toBe(
      `https://api.devlaunchsystems.com/api/v1/admin/case-studies/${PLATFORM_CASE_STUDY_ID}/media/presign`
    );
    expect(requestInit?.method).toBe("POST");
    expect(requestInit?.headers).toEqual({
      Authorization: `Bearer ${FAKE_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    assertTokenNotLeaked(JSON.stringify(result));
    expect(result.storage_key).toBe("portfolio/projects/heroes/a.png");
  });

  test("registers case-study media and returns Platform UUID", async () => {
    const mediaId = "00000000-0000-4000-8000-000000000010";
    let requestedUrl = "";
    const client = createClient(
      mockFetch(async (input) => {
        requestedUrl = String(input);
        return new Response(
          JSON.stringify({
            id: mediaId,
            case_study_id: PLATFORM_CASE_STUDY_ID,
            storage_key: "portfolio/projects/heroes/a.png",
            public_url: "https://cdn.example/hero.png",
            role: "hero",
            audience: "public",
            sort_order: 0,
            upload_status: "confirmed",
          }),
          { status: 201 }
        );
      })
    );

    const result = await client.registerCaseStudyMedia(PLATFORM_CASE_STUDY_ID, {
      storage_key: "portfolio/projects/heroes/a.png",
    });

    expect(requestedUrl).toBe(
      `https://api.devlaunchsystems.com/api/v1/admin/case-studies/${PLATFORM_CASE_STUDY_ID}/media`
    );
    expect(result.id).toBe(mediaId);
  });

  test("deletes media metadata with 204 no-content", async () => {
    const mediaId = "00000000-0000-4000-8000-000000000010";
    let requestedUrl = "";
    const client = createClient(
      mockFetch(async (input) => {
        requestedUrl = String(input);
        return new Response(null, { status: 204 });
      })
    );

    await client.deleteCaseStudyMedia(mediaId);
    expect(requestedUrl).toBe(
      `https://api.devlaunchsystems.com/api/v1/admin/media/${mediaId}`
    );
  });
});

describe("admin client surface", () => {
  test("exposes M4/M5/M6 admin read, patch, child CRUD, lifecycle, and media helpers", () => {
    const client = new PlatformApiAdminClient({
      baseUrl: "https://api.devlaunchsystems.com",
      token: FAKE_TOKEN,
    });
    expect(typeof client.listCaseStudies).toBe("function");
    expect(typeof client.getCaseStudyById).toBe("function");
    expect(typeof client.listMedia).toBe("function");
    expect(typeof client.presignCaseStudyMedia).toBe("function");
    expect(typeof client.registerCaseStudyMedia).toBe("function");
    expect(typeof client.updateCaseStudyMedia).toBe("function");
    expect(typeof client.deleteCaseStudyMedia).toBe("function");
    expect(typeof client.updateCaseStudy).toBe("function");
    expect(typeof client.createMetric).toBe("function");
    expect(typeof client.updateMetric).toBe("function");
    expect(typeof client.deleteMetric).toBe("function");
    expect(typeof client.createMilestone).toBe("function");
    expect(typeof client.updateMilestone).toBe("function");
    expect(typeof client.deleteMilestone).toBe("function");
    expect(typeof client.publishCaseStudy).toBe("function");
    expect(typeof client.unpublishCaseStudy).toBe("function");
    expect(typeof client.archiveCaseStudy).toBe("function");
    expect("getCaseStudy" in client).toBe(false);
    expect("createCaseStudy" in client).toBe(false);
    expect("createMedia" in client).toBe(false);
    expect("updateMedia" in client).toBe(false);
  });
});
