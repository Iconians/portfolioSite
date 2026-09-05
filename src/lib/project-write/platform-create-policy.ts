import type { ProjectWriteSource } from "./config";

export const PLATFORM_PROJECT_CREATE_UNAVAILABLE_MESSAGE =
  "Creating new projects is unavailable while shared content writes are frozen to Platform API. Platform-native project create remains a separately authorized milestone.";

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
