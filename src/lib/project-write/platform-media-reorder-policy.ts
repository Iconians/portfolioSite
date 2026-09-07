/** @deprecated M4 — platform-api gallery reorder is enabled; retained for error mapper compatibility. */
export const PLATFORM_GALLERY_REORDER_UNAVAILABLE_MESSAGE =
  "Gallery reorder is unavailable in platform-api mode until Platform exposes an atomic reorder contract.";

/** @deprecated M4 — platform-api gallery reorder is enabled; retained for error mapper compatibility. */
export class PlatformGalleryReorderUnavailableError extends Error {
  constructor() {
    super(PLATFORM_GALLERY_REORDER_UNAVAILABLE_MESSAGE);
    this.name = "PlatformGalleryReorderUnavailableError";
  }
}

export function assertPlatformGalleryReorderAllowed(
  _writeSource: "database" | "platform-api"
): void {
  // M4: gallery reorder enabled for platform-api via atomic endpoint.
}

export function shouldDisableGalleryReorder(
  _writeSource: "database" | "platform-api"
): boolean {
  return false;
}

export const PLATFORM_GALLERY_SORT_ORDER_PATCH_BLOCKED_MESSAGE =
  "Use gallery reorder controls to change gallery order.";
