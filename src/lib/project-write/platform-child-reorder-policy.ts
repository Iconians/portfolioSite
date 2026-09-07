/** @deprecated M3 — platform-api reorder is enabled; retained for error mapper compatibility. */
export const PLATFORM_CHILD_REORDER_UNAVAILABLE_MESSAGE =
  "Reordering is temporarily unavailable while Platform write migration is in progress.";

/** @deprecated M3 — platform-api reorder is enabled; retained for error mapper compatibility. */
export class PlatformChildReorderUnavailableError extends Error {
  constructor() {
    super(PLATFORM_CHILD_REORDER_UNAVAILABLE_MESSAGE);
    this.name = "PlatformChildReorderUnavailableError";
  }
}

export function assertPlatformChildReorderAllowed(
  _writeSource: "database" | "platform-api"
): void {
  // M3: metric/milestone reorder enabled for platform-api via atomic endpoints.
  // Database mode remains supported via legacy Prisma paths in server actions.
}

export function shouldDisableChildReorder(
  _writeSource: "database" | "platform-api"
): boolean {
  return false;
}
