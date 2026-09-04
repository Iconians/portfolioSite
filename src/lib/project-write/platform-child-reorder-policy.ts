export const PLATFORM_CHILD_REORDER_UNAVAILABLE_MESSAGE =
  "Reordering is temporarily unavailable while Platform write migration is in progress.";

export class PlatformChildReorderUnavailableError extends Error {
  constructor() {
    super(PLATFORM_CHILD_REORDER_UNAVAILABLE_MESSAGE);
    this.name = "PlatformChildReorderUnavailableError";
  }
}

export function assertPlatformChildReorderAllowed(
  writeSource: "database" | "platform-api"
): void {
  if (writeSource === "platform-api") {
    throw new PlatformChildReorderUnavailableError();
  }
}

export function shouldDisableChildReorder(
  writeSource: "database" | "platform-api"
): boolean {
  return writeSource === "platform-api";
}
