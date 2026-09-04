const R2_PUBLIC_HOST_SUFFIX = ".r2.dev";

export type PublicAssetRemotePattern = {
  protocol: "http" | "https";
  hostname: string;
};

/**
 * Normalizes S3_PUBLIC_URL_BASE values that omit the protocol (e.g. media.example.com).
 */
export function normalizePublicUrlBase(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (!trimmed) {
    throw new Error("Public URL base must not be empty");
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function parsePublicUrlBaseToRemotePattern(
  raw: string
): PublicAssetRemotePattern | undefined {
  try {
    const url = new URL(normalizePublicUrlBase(raw));
    return {
      protocol: url.protocol === "http:" ? "http" : "https",
      hostname: url.hostname,
    };
  } catch {
    return undefined;
  }
}

function parseExtraPublicUrlBases(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [];
  }

  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

type EnvLike = Record<string, string | undefined>;

export function getConfiguredPublicAssetUrlBase(
  env: EnvLike = process.env
): string | null {
  const raw = env.S3_PUBLIC_URL_BASE?.trim();
  if (!raw) {
    return null;
  }

  try {
    return normalizePublicUrlBase(raw);
  } catch {
    return null;
  }
}

/**
 * Hostnames allowed for next/image remotePatterns derived from env configuration.
 */
export function getPublicAssetRemotePatternsFromEnv(
  env: EnvLike = process.env
): PublicAssetRemotePattern[] {
  const patterns: PublicAssetRemotePattern[] = [];
  const seen = new Set<string>();

  const candidates = [
    env.S3_PUBLIC_URL_BASE,
    ...parseExtraPublicUrlBases(env.S3_PUBLIC_URL_BASE_EXTRA),
  ];

  for (const candidate of candidates) {
    if (!candidate?.trim()) {
      continue;
    }

    const pattern = parsePublicUrlBaseToRemotePattern(candidate);
    if (!pattern) {
      continue;
    }

    const key = `${pattern.protocol}://${pattern.hostname}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    patterns.push(pattern);
  }

  return patterns;
}

export function isR2PublicDevHostname(hostname: string): boolean {
  return hostname.endsWith(R2_PUBLIC_HOST_SUFFIX);
}

/**
 * Rewrites legacy R2 *.r2.dev public URLs to the configured S3_PUBLIC_URL_BASE,
 * preserving the object path. Non-R2 URLs are returned unchanged.
 */
export function rewritePublicAssetUrlIfConfigured(
  url: string,
  env: EnvLike = process.env
): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return url;
  }

  const configuredBase = getConfiguredPublicAssetUrlBase(env);
  if (!configuredBase) {
    return url;
  }

  let parsed: URL;
  let base: URL;
  try {
    parsed = new URL(trimmed);
    base = new URL(configuredBase);
  } catch {
    return url;
  }

  if (!isR2PublicDevHostname(parsed.hostname)) {
    return url;
  }

  if (parsed.hostname === base.hostname) {
    return trimmed;
  }

  return `${base.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
}
