import {
  getPlatformApiBaseUrl,
  getPlatformApiTimeoutMs,
} from "@/lib/project-read/config";
import { getCoherentProjectSourceConfiguration } from "@/lib/project-source/coherence";

import { ProjectWriteConfigurationError } from "./errors";

export type ProjectWriteSource = "database" | "platform-api";

const VALID_SOURCES = new Set<ProjectWriteSource>(["database", "platform-api"]);

/**
 * Resolves a raw PROJECT_WRITE_SOURCE string for diagnostics/tests.
 * Runtime shared-content writes are frozen to platform-api (M17).
 */
export function resolveProjectWriteSource(options?: {
  projectWriteSource?: string;
}): ProjectWriteSource {
  const raw = (options?.projectWriteSource ?? process.env.PROJECT_WRITE_SOURCE)
    ?.trim()
    .toLowerCase();

  if (!raw || raw === "database") {
    return "database";
  }

  if (raw === "platform-api") {
    return "platform-api";
  }

  if (VALID_SOURCES.has(raw as ProjectWriteSource)) {
    return raw as ProjectWriteSource;
  }

  return "database";
}

export function getProjectWriteSource(): ProjectWriteSource {
  return getCoherentProjectSourceConfiguration().writeSource;
}

export function getPlatformApiAdminToken(): string | null {
  const raw = process.env.DEVLAUNCH_PLATFORM_API_TOKEN?.trim();
  return raw || null;
}

export function assertPlatformApiWriteConfigured(): void {
  const source = getProjectWriteSource();
  if (source !== "platform-api") {
    return;
  }

  const baseUrl = getPlatformApiBaseUrl();
  if (!baseUrl) {
    throw new ProjectWriteConfigurationError(
      "PROJECT_WRITE_SOURCE=platform-api requires DEVLAUNCH_PLATFORM_API_URL"
    );
  }

  try {
    const parsed = new URL(baseUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new ProjectWriteConfigurationError(
        "DEVLAUNCH_PLATFORM_API_URL must be an http(s) URL"
      );
    }
  } catch (error) {
    if (error instanceof ProjectWriteConfigurationError) {
      throw error;
    }
    throw new ProjectWriteConfigurationError(
      "DEVLAUNCH_PLATFORM_API_URL must be a valid http(s) URL"
    );
  }

  const token = getPlatformApiAdminToken();
  if (!token) {
    throw new ProjectWriteConfigurationError(
      "PROJECT_WRITE_SOURCE=platform-api requires DEVLAUNCH_PLATFORM_API_TOKEN"
    );
  }
}

export { getPlatformApiBaseUrl, getPlatformApiTimeoutMs };
