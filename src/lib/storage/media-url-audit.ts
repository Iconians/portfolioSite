import {
  getConfiguredPublicAssetUrlBase,
  isR2PublicDevHostname,
  normalizePublicUrlBase,
} from "./public-asset-url";

export type MediaUrlHostClassification =
  | "canonical"
  | "historical_r2_dev"
  | "missing"
  | "malformed"
  | "unexpected_external";

export interface MediaUrlAuditRecord {
  id: string;
  source: string;
  storageKey: string | null;
  publicUrl: string | null;
  host: string | null;
  classification: MediaUrlHostClassification;
  expectedCanonicalUrl: string | null;
}

export interface MediaUrlAuditSummary {
  examined: number;
  canonical: number;
  historicalR2Dev: number;
  missing: number;
  malformed: number;
  unexpectedExternal: number;
  duplicatePublicUrls: number;
  duplicateStorageKeys: number;
}

export interface MediaUrlNormalizationPlanItem {
  id: string;
  source: string;
  storageKey: string;
  currentPublicUrl: string;
  proposedPublicUrl: string;
}

export interface MediaUrlNormalizationPlan {
  examined: number;
  alreadyCanonical: number;
  eligibleHistorical: number;
  skippedUnexpected: number;
  skippedMalformed: number;
  skippedMissing: number;
  items: MediaUrlNormalizationPlanItem[];
}

type EnvLike = Record<string, string | undefined>;

export function buildCanonicalPublicUrlFromStorageKey(
  storageKey: string,
  env: EnvLike = process.env
): string | null {
  const base = getConfiguredPublicAssetUrlBase(env);
  if (!base) {
    return null;
  }

  const trimmedKey = storageKey.trim().replace(/^\/+/, "");
  if (!trimmedKey) {
    return null;
  }

  try {
    const normalizedBase = normalizePublicUrlBase(base).replace(/\/$/, "");
    return `${normalizedBase}/${trimmedKey}`;
  } catch {
    return null;
  }
}

function parseUrlHost(url: string): string | null {
  try {
    return new URL(url.trim()).hostname;
  } catch {
    return null;
  }
}

export function classifyMediaPublicUrlHost(
  publicUrl: string | null | undefined,
  env: EnvLike = process.env
): MediaUrlHostClassification {
  const trimmed = publicUrl?.trim();
  if (!trimmed) {
    return "missing";
  }

  const host = parseUrlHost(trimmed);
  if (!host) {
    return "malformed";
  }

  const canonicalBase = getConfiguredPublicAssetUrlBase(env);
  if (canonicalBase) {
    try {
      const canonicalHost = new URL(canonicalBase).hostname;
      if (host === canonicalHost) {
        return "canonical";
      }
    } catch {
      // fall through
    }
  }

  if (isR2PublicDevHostname(host)) {
    return "historical_r2_dev";
  }

  return "unexpected_external";
}

export function deriveExpectedCanonicalPublicUrl(input: {
  publicUrl: string | null | undefined;
  storageKey: string | null | undefined;
  env?: EnvLike;
}): string | null {
  const env = input.env ?? process.env;
  const classification = classifyMediaPublicUrlHost(input.publicUrl, env);

  if (classification === "canonical") {
    return input.publicUrl?.trim() ?? null;
  }

  if (classification !== "historical_r2_dev") {
    return null;
  }

  const storageKey = input.storageKey?.trim();
  if (storageKey) {
    const fromKey = buildCanonicalPublicUrlFromStorageKey(storageKey, env);
    if (fromKey) {
      return fromKey;
    }
  }

  const trimmed = input.publicUrl?.trim();
  if (!trimmed) {
    return null;
  }

  const configuredBase = getConfiguredPublicAssetUrlBase(env);
  if (!configuredBase) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (!isR2PublicDevHostname(parsed.hostname)) {
      return null;
    }
    const base = new URL(normalizePublicUrlBase(configuredBase));
    return `${base.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

export function auditMediaUrlRecords(
  records: MediaUrlAuditRecord[]
): MediaUrlAuditSummary {
  const summary: MediaUrlAuditSummary = {
    examined: records.length,
    canonical: 0,
    historicalR2Dev: 0,
    missing: 0,
    malformed: 0,
    unexpectedExternal: 0,
    duplicatePublicUrls: 0,
    duplicateStorageKeys: 0,
  };

  const publicUrls = new Map<string, number>();
  const storageKeys = new Map<string, number>();

  for (const record of records) {
    switch (record.classification) {
      case "canonical":
        summary.canonical += 1;
        break;
      case "historical_r2_dev":
        summary.historicalR2Dev += 1;
        break;
      case "missing":
        summary.missing += 1;
        break;
      case "malformed":
        summary.malformed += 1;
        break;
      case "unexpected_external":
        summary.unexpectedExternal += 1;
        break;
    }

    if (record.publicUrl) {
      publicUrls.set(record.publicUrl, (publicUrls.get(record.publicUrl) ?? 0) + 1);
    }
    if (record.storageKey) {
      storageKeys.set(record.storageKey, (storageKeys.get(record.storageKey) ?? 0) + 1);
    }
  }

  summary.duplicatePublicUrls = [...publicUrls.values()].filter((count) => count > 1).length;
  summary.duplicateStorageKeys = [...storageKeys.values()].filter((count) => count > 1).length;

  return summary;
}

export function buildMediaUrlNormalizationPlan(
  records: MediaUrlAuditRecord[],
  env: EnvLike = process.env
): MediaUrlNormalizationPlan {
  const plan: MediaUrlNormalizationPlan = {
    examined: records.length,
    alreadyCanonical: 0,
    eligibleHistorical: 0,
    skippedUnexpected: 0,
    skippedMalformed: 0,
    skippedMissing: 0,
    items: [],
  };

  for (const record of records) {
    switch (record.classification) {
      case "canonical":
        plan.alreadyCanonical += 1;
        break;
      case "historical_r2_dev": {
        const proposed = deriveExpectedCanonicalPublicUrl({
          publicUrl: record.publicUrl,
          storageKey: record.storageKey,
          env,
        });
        if (!proposed || !record.publicUrl || !record.storageKey) {
          plan.skippedMalformed += 1;
          break;
        }
        if (proposed === record.publicUrl.trim()) {
          plan.alreadyCanonical += 1;
          break;
        }
        plan.eligibleHistorical += 1;
        plan.items.push({
          id: record.id,
          source: record.source,
          storageKey: record.storageKey,
          currentPublicUrl: record.publicUrl,
          proposedPublicUrl: proposed,
        });
        break;
      }
      case "missing":
        plan.skippedMissing += 1;
        break;
      case "malformed":
        plan.skippedMalformed += 1;
        break;
      case "unexpected_external":
        plan.skippedUnexpected += 1;
        break;
    }
  }

  return plan;
}

export function createMediaUrlAuditRecord(input: {
  id: string;
  source: string;
  publicUrl: string | null | undefined;
  storageKey?: string | null;
  env?: EnvLike;
}): MediaUrlAuditRecord {
  const env = input.env ?? process.env;
  const publicUrl = input.publicUrl?.trim() || null;
  const classification = classifyMediaPublicUrlHost(publicUrl, env);
  const host = publicUrl ? parseUrlHost(publicUrl) : null;

  return {
    id: input.id,
    source: input.source,
    storageKey: input.storageKey?.trim() || null,
    publicUrl,
    host,
    classification,
    expectedCanonicalUrl: deriveExpectedCanonicalPublicUrl({
      publicUrl,
      storageKey: input.storageKey,
      env,
    }),
  };
}
