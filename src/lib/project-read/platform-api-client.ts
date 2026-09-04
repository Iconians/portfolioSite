import {
  getPlatformApiBaseUrl,
  getPlatformApiTimeoutMs,
} from "./config";

import type {
  PlatformApiCaseStudyDetail,
  PlatformApiFetchResult,
  PlatformApiListResponse,
} from "./platform-api-types";

const ENGINEERING_CONSUMER = "engineering_portfolio";
const ENGINEERING_AUDIENCE = "engineering";

export class PlatformApiNetworkError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "PlatformApiNetworkError";
  }
}

export class PlatformApiResponseError extends Error {
  readonly status: number;
  readonly retryAfterSeconds: number | null;

  constructor(
    status: number,
    message: string,
    retryAfterSeconds: number | null = null
  ) {
    super(message);
    this.name = "PlatformApiResponseError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class PlatformApiMalformedResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlatformApiMalformedResponseError";
  }
}

export interface PlatformApiReadClientOptions {
  baseUrl: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

function parseRetryAfter(header: string | null): number | null {
  if (!header) {
    return null;
  }
  const seconds = Number.parseInt(header, 10);
  return Number.isFinite(seconds) ? seconds : null;
}

function buildPublicQuery(extra?: Record<string, string>): string {
  const params = new URLSearchParams({
    consumer: ENGINEERING_CONSUMER,
    audience: ENGINEERING_AUDIENCE,
    ...extra,
  });
  return params.toString();
}

/** Read-only Platform API client for engineering public projections. */
export class PlatformApiReadClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: PlatformApiReadClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.timeoutMs = options.timeoutMs ?? getPlatformApiTimeoutMs();
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  static fromEnvironment(
    fetchImpl?: typeof fetch
  ): PlatformApiReadClient | null {
    const baseUrl = getPlatformApiBaseUrl();
    if (!baseUrl) {
      return null;
    }
    return new PlatformApiReadClient({ baseUrl, fetchImpl });
  }

  get baseApiPath(): string {
    return `${this.baseUrl}/api/v1`;
  }

  private async request<T>(
    path: string,
    ifNoneMatch?: string
  ): Promise<PlatformApiFetchResult<T>> {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (ifNoneMatch) {
      headers["If-None-Match"] = ifNoneMatch;
    }

    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseApiPath}${path}`, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(this.timeoutMs),
        cache: "no-store",
      });
    } catch (error) {
      throw new PlatformApiNetworkError("Platform API request failed", {
        cause: error,
      });
    }

    const etag = response.headers.get("etag") ?? undefined;
    const cacheControl = response.headers.get("cache-control") ?? undefined;

    if (response.status === 304) {
      return { status: "not_modified", etag, cacheControl, notModified: true };
    }

    if (response.status === 404) {
      throw new PlatformApiResponseError(404, "Case study not found");
    }

    if (response.status === 429) {
      throw new PlatformApiResponseError(
        429,
        "Platform API rate limit exceeded",
        parseRetryAfter(response.headers.get("retry-after"))
      );
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new PlatformApiResponseError(
        response.status,
        detail || `Platform API request failed with status ${response.status}`
      );
    }

    let data: T;
    try {
      data = (await response.json()) as T;
    } catch {
      throw new PlatformApiMalformedResponseError(
        "Platform API returned malformed JSON"
      );
    }

    return { status: "ok", data, etag, cacheControl, notModified: false };
  }

  async listCaseStudies(options?: {
    page?: number;
    limit?: number;
    featured?: boolean;
    ifNoneMatch?: string;
  }): Promise<PlatformApiFetchResult<PlatformApiListResponse>> {
    const query = buildPublicQuery({
      page: String(options?.page ?? 1),
      limit: String(options?.limit ?? 50),
      ...(options?.featured === undefined
        ? {}
        : { featured: String(options.featured) }),
    });

    const result = await this.request<PlatformApiListResponse>(
      `/case-studies?${query}`,
      options?.ifNoneMatch
    );

    if (result.status === "not_modified") {
      return result;
    }

    if (!Array.isArray(result.data.items)) {
      throw new PlatformApiMalformedResponseError(
        "Platform API list response missing items array"
      );
    }

    return result;
  }

  async getCaseStudyBySlug(
    slug: string,
    options?: { ifNoneMatch?: string }
  ): Promise<PlatformApiFetchResult<PlatformApiCaseStudyDetail>> {
    const query = buildPublicQuery();
    const result = await this.request<PlatformApiCaseStudyDetail>(
      `/case-studies/${encodeURIComponent(slug)}?${query}`,
      options?.ifNoneMatch
    );

    if (result.status === "not_modified") {
      return result;
    }

    if (!result.data.slug) {
      throw new PlatformApiMalformedResponseError(
        "Platform API detail response missing slug"
      );
    }

    return result;
  }
}
