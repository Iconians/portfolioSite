import { resetCoherentProjectSourceConfigurationForTests } from "@/lib/project-source/coherence";

import {
  assertPlatformApiWriteConfigured,
  getProjectWriteSource,
} from "./config";
import { ProjectWriteConfigurationError } from "./errors";
import { PlatformApiAdminClient } from "./platform-api-admin-client";

export type DatabaseProjectWriteProvider = {
  readonly source: "database";
};

export type PlatformApiProjectWriteProvider = {
  readonly source: "platform-api";
  readonly client: PlatformApiAdminClient;
};

export type ProjectWriteProvider =
  | DatabaseProjectWriteProvider
  | PlatformApiProjectWriteProvider;

let cachedProvider: ProjectWriteProvider | null = null;

export function getProjectWriteProvider(): ProjectWriteProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const source = getProjectWriteSource();
  if (source === "platform-api") {
    assertPlatformApiWriteConfigured();
    const client = PlatformApiAdminClient.fromEnvironment();
    if (!client) {
      throw new ProjectWriteConfigurationError(
        "PROJECT_WRITE_SOURCE=platform-api requires DEVLAUNCH_PLATFORM_API_URL and DEVLAUNCH_PLATFORM_API_TOKEN"
      );
    }
    cachedProvider = { source: "platform-api", client };
    return cachedProvider;
  }

  cachedProvider = { source: "database" };
  return cachedProvider;
}

export function resetProjectWriteProviderForTests(): void {
  cachedProvider = null;
  resetCoherentProjectSourceConfigurationForTests();
}
