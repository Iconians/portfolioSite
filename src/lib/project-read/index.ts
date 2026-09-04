import { resetCoherentProjectSourceConfigurationForTests } from "@/lib/project-source/coherence";

import {
  assertPlatformApiReadConfigured,
  getProjectReadSource,
} from "./config";
import { DatabaseProjectReadProvider } from "./database-project-read-provider";
import { PlatformApiReadClient } from "./platform-api-client";
import { PlatformApiProjectReadProvider } from "./platform-api-project-read-provider";

import type { ProjectReadProvider } from "./types";

let cachedProvider: ProjectReadProvider | null = null;

export function getProjectReadProvider(): ProjectReadProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const source = getProjectReadSource();
  if (source === "platform-api") {
    assertPlatformApiReadConfigured();
    const client = PlatformApiReadClient.fromEnvironment();
    if (!client) {
      throw new Error(
        "PROJECT_READ_SOURCE=platform-api requires DEVLAUNCH_PLATFORM_API_URL"
      );
    }
    cachedProvider = new PlatformApiProjectReadProvider(client);
    return cachedProvider;
  }

  cachedProvider = new DatabaseProjectReadProvider();
  return cachedProvider;
}

export function resetProjectReadProviderForTests(): void {
  cachedProvider = null;
  resetCoherentProjectSourceConfigurationForTests();
}

export function invalidateProjectReadProviderCache(slug: string): void {
  if (cachedProvider?.source !== "platform-api") {
    return;
  }

  cachedProvider.invalidateProject?.(slug);
}

export async function getPublishedPortfolioItems() {
  return getProjectReadProvider().getPublishedPortfolioItems();
}

export async function getPublishedProjectDetail(slug: string) {
  return getProjectReadProvider().getPublishedProjectDetail(slug);
}

export { getProjectReadSource } from "./config";
export type { ProjectReadProvider, PublishedProjectDetail } from "./types";
