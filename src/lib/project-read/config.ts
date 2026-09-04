export type ProjectReadSource = "database" | "platform-api";

/**
 * ISR interval for public project-read pages and Platform API fetch cache.
 * Page segment exports must use the literal `3600` (Next.js static analysis).
 */
export const PROJECT_READ_ISR_REVALIDATE_SECONDS = 3600;

const VALID_SOURCES = new Set<ProjectReadSource>(["database", "platform-api"]);

export class ProjectReadConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectReadConfigurationError";
  }
}

/**
 * Resolves the shared-project read provider from explicit configuration.
 * Missing or invalid values fail safe to database unless platform-api is explicitly selected.
 */
export function resolveProjectReadSource(options?: {
  projectReadSource?: string;
}): ProjectReadSource {
  const raw = (options?.projectReadSource ?? process.env.PROJECT_READ_SOURCE)
    ?.trim()
    .toLowerCase();

  if (!raw || raw === "database") {
    return "database";
  }

  if (raw === "platform-api") {
    return "platform-api";
  }

  if (VALID_SOURCES.has(raw as ProjectReadSource)) {
    return raw as ProjectReadSource;
  }

  return "database";
}

export function getProjectReadSource(): ProjectReadSource {
  return resolveProjectReadSource();
}

export function assertPlatformApiReadConfigured(): void {
  const source = getProjectReadSource();
  if (source !== "platform-api") {
    return;
  }

  const baseUrl = getPlatformApiBaseUrl();
  if (!baseUrl) {
    throw new ProjectReadConfigurationError(
      "PROJECT_READ_SOURCE=platform-api requires DEVLAUNCH_PLATFORM_API_URL"
    );
  }

  try {
    const parsed = new URL(baseUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new ProjectReadConfigurationError(
        "DEVLAUNCH_PLATFORM_API_URL must be an http(s) URL"
      );
    }
  } catch {
    throw new ProjectReadConfigurationError(
      "DEVLAUNCH_PLATFORM_API_URL must be a valid http(s) URL"
    );
  }
}

export function getPlatformApiBaseUrl(): string | null {
  const raw = process.env.DEVLAUNCH_PLATFORM_API_URL?.trim();
  if (!raw) {
    return null;
  }
  return raw.replace(/\/$/, "");
}

export function getPlatformApiTimeoutMs(): number {
  const raw = process.env.DEVLAUNCH_PLATFORM_API_TIMEOUT_MS?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5000;
}

/** Next.js fetch cache options aligned with public page ISR. */
export function getPlatformApiFetchCacheOptions(): { revalidate: number } {
  return { revalidate: PROJECT_READ_ISR_REVALIDATE_SECONDS };
}
