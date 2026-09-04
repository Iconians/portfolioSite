import type { ProjectWriteSource } from "./config";

export const PLATFORM_PROJECT_CREATE_UNAVAILABLE_MESSAGE =
  "Creating new projects is unavailable while PROJECT_WRITE_SOURCE=platform-api. Top-level Platform project create is not yet migrated. Create projects in database mode or add them through the Platform API operator workflow.";

export function isPlatformProjectCreateAllowed(
  writeSource: ProjectWriteSource
): boolean {
  return writeSource !== "platform-api";
}

export function assertPlatformProjectCreateAllowed(
  writeSource: ProjectWriteSource
): void {
  if (!isPlatformProjectCreateAllowed(writeSource)) {
    throw new Error(PLATFORM_PROJECT_CREATE_UNAVAILABLE_MESSAGE);
  }
}
