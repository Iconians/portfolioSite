import { describe, expect, test } from "bun:test";

import {
  getConfiguredPublicAssetUrlBase,
  getPublicAssetRemotePatternsFromEnv,
  isR2PublicDevHostname,
  normalizePublicUrlBase,
  parsePublicUrlBaseToRemotePattern,
  rewritePublicAssetUrlIfConfigured,
} from "@/lib/storage/public-asset-url";

describe("normalizePublicUrlBase", () => {
  test("adds https when protocol is omitted", () => {
    expect(normalizePublicUrlBase("media.devlaunchsystems.com")).toBe(
      "https://media.devlaunchsystems.com"
    );
  });

  test("preserves explicit https base and strips trailing slash", () => {
    expect(normalizePublicUrlBase("https://media.devlaunchsystems.com/")).toBe(
      "https://media.devlaunchsystems.com"
    );
  });
});

describe("parsePublicUrlBaseToRemotePattern", () => {
  test("parses production custom media domain", () => {
    expect(
      parsePublicUrlBaseToRemotePattern("https://media.devlaunchsystems.com")
    ).toEqual({
      protocol: "https",
      hostname: "media.devlaunchsystems.com",
    });
  });

  test("parses R2 dev public hostname", () => {
    expect(parsePublicUrlBaseToRemotePattern("https://pub-xxxx.r2.dev")).toEqual({
      protocol: "https",
      hostname: "pub-xxxx.r2.dev",
    });
  });
});

describe("getPublicAssetRemotePatternsFromEnv", () => {
  test("includes primary and extra configured hosts", () => {
    const patterns = getPublicAssetRemotePatternsFromEnv({
      S3_PUBLIC_URL_BASE: "https://media.devlaunchsystems.com",
      S3_PUBLIC_URL_BASE_EXTRA:
        "https://pub-49ca821aa6ed4a4ba63fe0776a63274e.r2.dev",
    });

    expect(patterns).toEqual([
      { protocol: "https", hostname: "media.devlaunchsystems.com" },
      {
        protocol: "https",
        hostname: "pub-49ca821aa6ed4a4ba63fe0776a63274e.r2.dev",
      },
    ]);
  });

  test("deduplicates identical hosts", () => {
    const patterns = getPublicAssetRemotePatternsFromEnv({
      S3_PUBLIC_URL_BASE: "media.devlaunchsystems.com",
      S3_PUBLIC_URL_BASE_EXTRA: "https://media.devlaunchsystems.com",
    });

    expect(patterns.length).toBe(1);
  });
});

describe("rewritePublicAssetUrlIfConfigured", () => {
  const env = {
    S3_PUBLIC_URL_BASE: "https://media.devlaunchsystems.com",
  };

  test("rewrites R2 dev URLs to configured production media base", () => {
    expect(
      rewritePublicAssetUrlIfConfigured(
        "https://pub-49ca821aa6ed4a4ba63fe0776a63274e.r2.dev/portfolio/projects/heroes/a.png",
        env
      )
    ).toBe("https://media.devlaunchsystems.com/portfolio/projects/heroes/a.png");
  });

  test("leaves unrelated external hosts unchanged", () => {
    const external = "https://cdn.example.com/assets/a.png";
    expect(rewritePublicAssetUrlIfConfigured(external, env)).toBe(external);
  });

  test("leaves already-configured host unchanged", () => {
    const url = "https://media.devlaunchsystems.com/portfolio/a.png";
    expect(rewritePublicAssetUrlIfConfigured(url, env)).toBe(url);
  });

  test("supports protocol-less configured base", () => {
    expect(
      getConfiguredPublicAssetUrlBase({
        S3_PUBLIC_URL_BASE: "media.devlaunchsystems.com",
      })
    ).toBe("https://media.devlaunchsystems.com");
  });
});

describe("isR2PublicDevHostname", () => {
  test("identifies R2 public dev hostnames", () => {
    expect(isR2PublicDevHostname("pub-xxxx.r2.dev")).toBe(true);
    expect(isR2PublicDevHostname("media.devlaunchsystems.com")).toBe(false);
  });
});
