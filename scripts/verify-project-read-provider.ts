/**
 * Operational smoke check: confirms which project-read provider is selected
 * from current process environment. Safe to run in CI or post-deploy shells.
 */

import "dotenv/config";

import { getProjectReadProvider } from "../src/lib/project-read";

function main() {
  const provider = getProjectReadProvider();
  const payload = {
    source: provider.source,
    provider: provider.constructor.name,
    platformApiUrl: process.env.DEVLAUNCH_PLATFORM_API_URL ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
