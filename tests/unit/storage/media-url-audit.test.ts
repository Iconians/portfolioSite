import { describe, expect, test } from "bun:test";

import {
  auditMediaUrlRecords,
  buildCanonicalPublicUrlFromStorageKey,
  buildMediaUrlNormalizationPlan,
  classifyMediaPublicUrlHost,
  createMediaUrlAuditRecord,
  deriveExpectedCanonicalPublicUrl,
} from "@/lib/storage/media-url-audit";
import { rewritePublicAssetUrlIfConfigured } from "@/lib/storage/public-asset-url";

const CANONICAL_ENV = {
  S3_PUBLIC_URL_BASE: "https://media.devlaunchsystems.com",
};

const HISTORICAL_R2_URL =
  "https://pub-49ca821aa6ed4a4ba63fe0776a63274e.r2.dev/portfolio/projects/heroes/a.png";
const CANONICAL_URL =
  "https://media.devlaunchsystems.com/portfolio/projects/heroes/a.png";
const STORAGE_KEY = "portfolio/projects/heroes/a.png";

describe("media URL audit classification", () => {
  test("classifies canonical custom-domain URLs", () => {
    expect(classifyMediaPublicUrlHost(CANONICAL_URL, CANONICAL_ENV)).toBe("canonical");
  });

  test("classifies historical r2.dev URLs", () => {
    expect(classifyMediaPublicUrlHost(HISTORICAL_R2_URL, CANONICAL_ENV)).toBe(
      "historical_r2_dev"
    );
  });

  test("does not classify unrelated external hosts as historical", () => {
    expect(
      classifyMediaPublicUrlHost("https://cdn.example.com/assets/a.png", CANONICAL_ENV)
    ).toBe("unexpected_external");
  });

  test("classifies missing and malformed URLs", () => {
    expect(classifyMediaPublicUrlHost("", CANONICAL_ENV)).toBe("missing");
    expect(classifyMediaPublicUrlHost("not-a-url", CANONICAL_ENV)).toBe("malformed");
  });
});

describe("canonical URL derivation", () => {
  test("builds canonical URL from storage_key and configured base", () => {
    expect(
      buildCanonicalPublicUrlFromStorageKey(STORAGE_KEY, CANONICAL_ENV)
    ).toBe(CANONICAL_URL);
  });

  test("derives canonical URL from historical r2.dev using storage_key", () => {
    expect(
      deriveExpectedCanonicalPublicUrl({
        publicUrl: HISTORICAL_R2_URL,
        storageKey: STORAGE_KEY,
        env: CANONICAL_ENV,
      })
    ).toBe(CANONICAL_URL);
  });

  test("derives canonical URL from historical r2.dev using path preservation when storage_key absent", () => {
    expect(
      deriveExpectedCanonicalPublicUrl({
        publicUrl: HISTORICAL_R2_URL,
        storageKey: null,
        env: CANONICAL_ENV,
      })
    ).toBe(CANONICAL_URL);
  });

  test("leaves canonical URL unchanged", () => {
    expect(
      deriveExpectedCanonicalPublicUrl({
        publicUrl: CANONICAL_URL,
        storageKey: STORAGE_KEY,
        env: CANONICAL_ENV,
      })
    ).toBe(CANONICAL_URL);
  });

  test("does not derive canonical URL for unrelated external hosts", () => {
    expect(
      deriveExpectedCanonicalPublicUrl({
        publicUrl: "https://cdn.example.com/a.png",
        storageKey: STORAGE_KEY,
        env: CANONICAL_ENV,
      })
    ).toBeNull();
  });
});

describe("media URL normalization plan", () => {
  test("dry-run plan updates only recognized historical hosts", () => {
    const records = [
      createMediaUrlAuditRecord({
        id: "media-1",
        source: "platform:media:project-a",
        publicUrl: HISTORICAL_R2_URL,
        storageKey: STORAGE_KEY,
        env: CANONICAL_ENV,
      }),
      createMediaUrlAuditRecord({
        id: "media-2",
        source: "platform:media:project-a",
        publicUrl: CANONICAL_URL,
        storageKey: STORAGE_KEY,
        env: CANONICAL_ENV,
      }),
      createMediaUrlAuditRecord({
        id: "media-3",
        source: "platform:media:project-b",
        publicUrl: "https://cdn.example.com/a.png",
        storageKey: "portfolio/a.png",
        env: CANONICAL_ENV,
      }),
    ];

    const plan = buildMediaUrlNormalizationPlan(records, CANONICAL_ENV);
    expect(plan.eligibleHistorical).toBe(1);
    expect(plan.alreadyCanonical).toBe(1);
    expect(plan.skippedUnexpected).toBe(1);
    expect(plan.items).toEqual([
      {
        id: "media-1",
        source: "platform:media:project-a",
        storageKey: STORAGE_KEY,
        currentPublicUrl: HISTORICAL_R2_URL,
        proposedPublicUrl: CANONICAL_URL,
      },
    ]);
  });

  test("idempotent second run has zero eligible historical updates after canonicalization", () => {
    const canonicalRecord = createMediaUrlAuditRecord({
      id: "media-1",
      source: "platform:media:project-a",
      publicUrl: CANONICAL_URL,
      storageKey: STORAGE_KEY,
      env: CANONICAL_ENV,
    });

    const plan = buildMediaUrlNormalizationPlan([canonicalRecord], CANONICAL_ENV);
    expect(plan.eligibleHistorical).toBe(0);
    expect(plan.alreadyCanonical).toBe(1);
  });
});

describe("media URL audit summary", () => {
  test("counts classifications and duplicate keys", () => {
    const records = [
      createMediaUrlAuditRecord({
        id: "a",
        source: "test",
        publicUrl: CANONICAL_URL,
        storageKey: "key-a",
        env: CANONICAL_ENV,
      }),
      createMediaUrlAuditRecord({
        id: "b",
        source: "test",
        publicUrl: HISTORICAL_R2_URL,
        storageKey: "key-b",
        env: CANONICAL_ENV,
      }),
    ];

    const summary = auditMediaUrlRecords(records);
    expect(summary.examined).toBe(2);
    expect(summary.canonical).toBe(1);
    expect(summary.historicalR2Dev).toBe(1);
  });
});

describe("compatibility rewrite retirement evidence", () => {
  test("canonical Platform fixture passes through rewrite unchanged", () => {
    expect(rewritePublicAssetUrlIfConfigured(CANONICAL_URL, CANONICAL_ENV)).toBe(
      CANONICAL_URL
    );
  });

  test("historical r2.dev fixture still depends on compatibility rewrite before data normalization", () => {
    const rewritten = rewritePublicAssetUrlIfConfigured(HISTORICAL_R2_URL, CANONICAL_ENV);
    expect(rewritten).toBe(CANONICAL_URL);
    expect(HISTORICAL_R2_URL).not.toBe(CANONICAL_URL);
  });
});
