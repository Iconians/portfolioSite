import { unstable_rethrow } from "next/navigation";

import { getPlatformApiTimeoutMs } from "./config";
import {
  PlatformApiAdminMalformedResponseError,
  PlatformApiAdminNetworkError,
  PlatformApiAdminResponseError,
} from "./errors";

export interface PlatformApiAdminTransportOptions {
  baseUrl: string;
  token: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export interface RequestJsonOptions {
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

export class PlatformApiAdminRequestTransport {
  protected readonly baseUrl: string;
  protected readonly token: string;
  protected readonly timeoutMs: number;
  protected readonly fetchImpl: typeof fetch;

  constructor(options: PlatformApiAdminTransportOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.token = options.token;
    this.timeoutMs = options.timeoutMs ?? getPlatformApiTimeoutMs();
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  get adminApiPath(): string {
    return `${this.baseUrl}/api/v1/admin`;
  }

  async requestJson<T>(
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
}
