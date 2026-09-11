import { describe, expect, test } from "bun:test";

import {
  buildInquiryRequestBody,
  INQUIRIES_API_URL,
  mapInquiryResponse,
  parseRetryAfter,
  submitInquiry,
} from "@/lib/apiInquiries/inquires";

const baseInput = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Interested in collaborating.",
  company: "Analytical Engines",
  referrer: "https://engineering.example/about",
  website: "",
};

describe("buildInquiryRequestBody", () => {
  test("maps required fields and source", () => {
    const body = buildInquiryRequestBody(baseInput);

    expect(body).toEqual({
      name: baseInput.name,
      email: baseInput.email,
      message: baseInput.message,
      source: "engineering_portfolio",
      company: baseInput.company,
      referrer: baseInput.referrer,
      website: "",
    });
  });

  test("omits empty company and referrer", () => {
    const body = buildInquiryRequestBody({
      name: baseInput.name,
      email: baseInput.email,
      message: baseInput.message,
      website: "filled-by-bot",
    });

    expect(body.company).toBeUndefined();
    expect(body.referrer).toBeUndefined();
    expect(body.website).toBe("filled-by-bot");
    expect(body.source).toBe("engineering_portfolio");
  });

  test("passes honeypot website through unchanged", () => {
    const body = buildInquiryRequestBody({
      ...baseInput,
      website: "https://spam.example",
    });

    expect(body.website).toBe("https://spam.example");
  });
});

describe("mapInquiryResponse", () => {
  test("201 with JSON body is success", () => {
    const response = new Response(
      JSON.stringify({ id: "inq_1", status: "received", created_at: "now" }),
      { status: 201 }
    );

    expect(mapInquiryResponse(response)).toEqual({ ok: true });
  });

  test("201 with empty body is success", () => {
    const response = new Response(null, { status: 201 });

    expect(mapInquiryResponse(response)).toEqual({ ok: true });
  });

  test("413 maps to too_large", () => {
    const response = new Response("too big", { status: 413 });

    expect(mapInquiryResponse(response)).toEqual({
      ok: false,
      reason: "too_large",
    });
  });

  test("422 maps to validation", () => {
    const response = new Response("invalid", { status: 422 });

    expect(mapInquiryResponse(response)).toEqual({
      ok: false,
      reason: "validation",
    });
  });

  test("429 parses Retry-After", () => {
    const response = new Response("slow down", {
      status: 429,
      headers: { "Retry-After": "30" },
    });

    expect(mapInquiryResponse(response)).toEqual({
      ok: false,
      reason: "rate_limited",
      retryAfterSeconds: 30,
    });
  });

  test("429 without Retry-After still returns rate_limited", () => {
    const response = new Response("slow down", { status: 429 });

    expect(mapInquiryResponse(response)).toEqual({
      ok: false,
      reason: "rate_limited",
      retryAfterSeconds: undefined,
    });
  });

  test("malformed Retry-After is ignored safely", () => {
    const response = new Response("slow down", {
      status: 429,
      headers: { "Retry-After": "not-a-number" },
    });

    expect(parseRetryAfter(response)).toBeUndefined();
    expect(mapInquiryResponse(response)).toEqual({
      ok: false,
      reason: "rate_limited",
      retryAfterSeconds: undefined,
    });
  });

  test("5xx responses map to unavailable", () => {
    for (const status of [500, 502, 503]) {
      expect(mapInquiryResponse(new Response("fail", { status }))).toEqual({
        ok: false,
        reason: "unavailable",
      });
    }
  });
});

describe("submitInquiry", () => {
  test("posts browser-direct JSON to the production endpoint", async () => {
    let requestedUrl = "";
    let method = "";
    let headers: Headers | undefined;
    let body = "";

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      requestedUrl = String(input);
      method = init?.method ?? "GET";
      headers =
        init?.headers instanceof Headers
          ? init.headers
          : new Headers(init?.headers);
      body = String(init?.body);
      return new Response(null, { status: 201 });
    };

    const result = await submitInquiry(baseInput);

    globalThis.fetch = originalFetch;

    expect(result).toEqual({ ok: true });
    expect(requestedUrl).toBe(INQUIRIES_API_URL);
    expect(method).toBe("POST");
    expect(headers?.get("Content-Type")).toBe("application/json");
    expect(headers?.get("Authorization")).toBeNull();
    expect(JSON.parse(body)).toEqual(buildInquiryRequestBody(baseInput));
  });

  test("network rejection maps to unavailable", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      throw new TypeError("Failed to fetch");
    };

    const result = await submitInquiry(baseInput);

    globalThis.fetch = originalFetch;

    expect(result).toEqual({ ok: false, reason: "unavailable" });
  });
});
