import { describe, expect, test } from "bun:test";

import { PlatformApiReadClient } from "@/lib/project-read/platform-api-client";
import { PlatformApiProjectReadProvider } from "@/lib/project-read/platform-api-project-read-provider";

describe("PlatformApiProjectReadProvider cache invalidation", () => {
  test("invalidateProject clears detail and list ETag caches", () => {
    const provider = new PlatformApiProjectReadProvider(
      new PlatformApiReadClient({ baseUrl: "https://api.example.test" })
    );

    (provider as unknown as { detailBodies: Map<string, unknown> }).detailBodies.set(
      "devlaunch-crm",
      { slug: "devlaunch-crm" }
    );
    (provider as unknown as { detailEtags: Map<string, string> }).detailEtags.set(
      "devlaunch-crm",
      "etag-1"
    );
    (provider as unknown as { listEtag: string | undefined }).listEtag = "list-etag";

    provider.invalidateProject("devlaunch-crm");

    expect(
      (provider as unknown as { detailBodies: Map<string, unknown> }).detailBodies.has(
        "devlaunch-crm"
      )
    ).toBe(false);
    expect(
      (provider as unknown as { detailEtags: Map<string, string> }).detailEtags.has(
        "devlaunch-crm"
      )
    ).toBe(false);
    expect((provider as unknown as { listEtag: string | undefined }).listEtag).toBeUndefined();
  });
});
