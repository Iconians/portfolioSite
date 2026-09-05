import type { ProjectWriteSource } from "./config";

export const LEGACY_SHARED_CONTENT_WRITE_FROZEN_MESSAGE =
  'Legacy Prisma shared-content writes are frozen (M17). PROJECT_WRITE_SOURCE must be "platform-api".';

export const LEGACY_SHARED_CONTENT_WRITE_SOURCE_VALUES = new Set<ProjectWriteSource>([
  "database",
]);

export function isLegacySharedContentWriteSource(
  writeSource: ProjectWriteSource
): boolean {
  return LEGACY_SHARED_CONTENT_WRITE_SOURCE_VALUES.has(writeSource);
}

export function assertSharedContentWriteUsesPlatform(
  writeSource: ProjectWriteSource
): void {
  if (writeSource !== "platform-api") {
    throw new Error(LEGACY_SHARED_CONTENT_WRITE_FROZEN_MESSAGE);
  }
}
