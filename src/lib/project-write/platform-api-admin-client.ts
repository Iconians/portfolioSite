import { unstable_rethrow } from "next/navigation";

import {
  getPlatformApiAdminToken,
  getPlatformApiBaseUrl,
  getPlatformApiTimeoutMs,
} from "./config";
import {
  PlatformApiAdminMalformedResponseError,
  PlatformApiAdminNetworkError,
  PlatformApiAdminResponseError,
} from "./errors";

import type { PlatformApiCaseStudyPatchRequest } from "./platform-admin-patch-types";
import type {
  PlatformApiAdminCaseStudyDetail,
  PlatformApiAdminCaseStudyListResponse,
  PlatformApiAdminMediaListResponse,
} from "./platform-admin-types";

export type {
  PlatformApiCaseStudyPatchRequest,
  PlatformApiAdminContentItemInput,
  PlatformApiAdminTechnologyInput,
  PlatformApiAdminCategoryInput,
  PlatformApiAdminLinkInput,
} from "./platform-admin-patch-types";
export type {
  PlatformApiAdminCaseStudyDetail,
  PlatformApiAdminCaseStudyListItem,
  PlatformApiAdminCaseStudyListResponse,
  PlatformApiAdminMediaListItem,
  PlatformApiAdminMediaListResponse,
} from "./platform-admin-types";

export interface PlatformApiAdminClientOptions {
  baseUrl: string;
  token: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

interface RequestJsonOptions {
  method?: string;
  body?: unknown;
  operation?: string;
}

function parseRetryAfter(header: string | null): number | null {
  if (!header) {
    return null;
  }
  const seconds = Number.parseInt(header, 10);
  return Number.isFinite(seconds) ? seconds : null;
}

async function readSafeResponseText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

function extractSafeDetail(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed) as { detail?: unknown; message?: unknown };
    if (typeof parsed.detail === "string") {
      return parsed.detail;
    }
    if (typeof parsed.message === "string") {
      return parsed.message;
    }
  } catch {
    // fall through to raw text when safe and short
  }

  return trimmed.length <= 500 ? trimmed : `${trimmed.slice(0, 500)}…`;
}

function defaultResponseMessage(status: number): string {
  switch (status) {
    case 401:
      return "Platform API admin authentication failed";
    case 403:
      return "Platform API admin authorization failed";
    case 404:
      return "Platform API admin resource not found";
    case 409:
      return "Platform API admin conflict";
    case 422:
      return "Platform API admin validation failed";
    case 429:
      return "Platform API admin rate limit exceeded";
    default:
      return `Platform API admin request failed with status ${status}`;
  }
}

/** Authenticated Platform API admin client for Phase 11 write integration. */
export class PlatformApiAdminClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: PlatformApiAdminClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.token = options.token;
    this.timeoutMs = options.timeoutMs ?? getPlatformApiTimeoutMs();
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  static fromEnvironment(fetchImpl?: typeof fetch): PlatformApiAdminClient | null {
    const baseUrl = getPlatformApiBaseUrl();
    const token = getPlatformApiAdminToken();
    if (!baseUrl || !token) {
      return null;
    }

    return new PlatformApiAdminClient({ baseUrl, token, fetchImpl });
  }

  get adminApiPath(): string {
    return `${this.baseUrl}/api/v1/admin`;
  }

  private async requestJson<T>(
    path: string,
    options: RequestJsonOptions = {}
  ): Promise<T | void> {
    const method = options.method ?? "GET";
    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${this.token}`,
    };

    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    let response: Response;
    try {
      response = await this.fetchImpl(`${this.adminApiPath}${path}`, {
        method,
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: AbortSignal.timeout(this.timeoutMs),
        cache: "no-store",
      });
    } catch (error) {
      unstable_rethrow(error);
      throw new PlatformApiAdminNetworkError("Platform API admin request failed", {
        cause: error,
      });
    }

    if (response.status === 204) {
      return undefined;
    }

    if (!response.ok) {
      const bodyText = await readSafeResponseText(response);
      const detail = extractSafeDetail(bodyText);
      throw new PlatformApiAdminResponseError(
        response.status,
        detail ?? defaultResponseMessage(response.status),
        {
          detail,
          retryAfterSeconds: parseRetryAfter(response.headers.get("retry-after")),
          operation: options.operation ?? null,
        }
      );
    }

    if (response.status === 205) {
      return undefined;
    }

    let data: T;
    try {
      data = (await response.json()) as T;
    } catch {
      throw new PlatformApiAdminMalformedResponseError(
        "Platform API admin returned malformed JSON"
      );
    }

    return data;
  }

  async listCaseStudies(options?: {
    page?: number;
    limit?: number;
  }): Promise<PlatformApiAdminCaseStudyListResponse> {
    const params = new URLSearchParams();
    if (options?.page !== undefined) {
      params.set("page", String(options.page));
    }
    if (options?.limit !== undefined) {
      params.set("limit", String(options.limit));
    }

    const query = params.toString();
    const path = query ? `/case-studies?${query}` : "/case-studies";
    const data = await this.requestJson<PlatformApiAdminCaseStudyListResponse>(path, {
      operation: "listCaseStudies",
    });

    if (!data || !Array.isArray(data.items)) {
      throw new PlatformApiAdminMalformedResponseError(
        "Platform API admin list response missing items array"
      );
    }

    return data;
  }

  async getCaseStudyById(
    id: string
  ): Promise<PlatformApiAdminCaseStudyDetail> {
    const data = await this.requestJson<PlatformApiAdminCaseStudyDetail>(
      `/case-studies/${encodeURIComponent(id)}`,
      { operation: "getCaseStudyById" }
    );

    if (!data?.id) {
      throw new PlatformApiAdminMalformedResponseError(
        "Platform API admin detail response missing id"
      );
    }

    return data;
  }

  async updateCaseStudy(
    id: string,
    payload: PlatformApiCaseStudyPatchRequest
  ): Promise<PlatformApiAdminCaseStudyDetail> {
    const data = await this.requestJson<PlatformApiAdminCaseStudyDetail>(
      `/case-studies/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: payload,
        operation: "updateCaseStudy",
      }
    );

    if (!data?.id) {
      throw new PlatformApiAdminMalformedResponseError(
        "Platform API admin patch response missing id"
      );
    }

    return data;
  }

  async listMedia(options?: {
    caseStudyId?: string;
    role?: string;
    uploadStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<PlatformApiAdminMediaListResponse> {
    const params = new URLSearchParams();
    if (options?.caseStudyId) {
      params.set("case_study_id", options.caseStudyId);
    }
    if (options?.role) {
      params.set("role", options.role);
    }
    if (options?.uploadStatus) {
      params.set("upload_status", options.uploadStatus);
    }
    if (options?.page !== undefined) {
      params.set("page", String(options.page));
    }
    if (options?.limit !== undefined) {
      params.set("limit", String(options.limit));
    }

    const query = params.toString();
    const path = query ? `/media?${query}` : "/media";
    const data = await this.requestJson<PlatformApiAdminMediaListResponse>(path, {
      operation: "listMedia",
    });

    if (!data || !Array.isArray(data.items)) {
      throw new PlatformApiAdminMalformedResponseError(
        "Platform API admin media list response missing items array"
      );
    }

    return data;
  }
}
