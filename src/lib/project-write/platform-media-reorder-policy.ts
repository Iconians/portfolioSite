export const PLATFORM_GALLERY_REORDER_UNAVAILABLE_MESSAGE =
  "Gallery reorder is unavailable in platform-api mode until Platform exposes an atomic reorder contract.";

export class PlatformGalleryReorderUnavailableError extends Error {
  constructor() {
    super(PLATFORM_GALLERY_REORDER_UNAVAILABLE_MESSAGE);
    this.name = "PlatformGalleryReorderUnavailableError";
  }
}

export function assertPlatformGalleryReorderAllowed(
  writeSource: "database" | "platform-api"
): void {
  if (writeSource === "platform-api") {
    throw new PlatformGalleryReorderUnavailableError();
  }
}

export function shouldDisableGalleryReorder(
  writeSource: "database" | "platform-api"
): boolean {
  return writeSource === "platform-api";
}
