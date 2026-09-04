import type { PlatformMediaRole } from "./platform-media-types";

export const PLATFORM_PROJECT_MEDIA_REQUIRES_BRIDGE_MESSAGE =
  "Platform media operations require a migrated project with a Platform case study bridge.";

export const PLATFORM_MEDIA_ROLE_IMMUTABLE_MESSAGE =
  "Platform media role cannot be changed after registration. Upload a new image with the desired role instead.";

export const PLATFORM_SINGLETON_REPLACEMENT_MESSAGE =
  "Upload a new image to replace the current hero or OG image. Platform assigns placement by role at registration; existing media cannot be promoted to a different role.";

export const PLATFORM_SINGLETON_CLEAR_UNSUPPORTED_MESSAGE =
  "Clearing hero or OG without uploading a replacement is not supported in platform-api mode. Optional OG can be removed by deleting the OG media record when that control is exposed.";

const SINGLETON_ROLES: PlatformMediaRole[] = ["hero", "og", "thumbnail"];

export function isPlatformSingletonMediaRole(
  role: string
): role is Extract<PlatformMediaRole, "hero" | "og" | "thumbnail"> {
  return role === "hero" || role === "og" || role === "thumbnail";
}

export function isPlatformMediaRole(value: string): value is PlatformMediaRole {
  return value === "hero" || value === "og" || value === "gallery" || value === "thumbnail";
}

export function canSelectExistingMediaForRole(
  requestedRole: PlatformMediaRole,
  existingRole: string
): boolean {
  return requestedRole === existingRole;
}

/** Platform project media lists are always filtered by the target role. */
export function platformMediaListRoleFilter(
  uploadRole: PlatformMediaRole
): PlatformMediaRole {
  return uploadRole;
}

/**
 * Selecting an existing singleton item with a matching role does not mutate Platform;
 * it only reflects the already-authoritative record.
 */
export function isExistingSingletonSelectionNoOp(input: {
  uploadRole: PlatformMediaRole;
  existingRole: string;
  selectedMediaId: string;
  currentMediaId?: string | null;
}): boolean {
  if (!isPlatformSingletonMediaRole(input.uploadRole)) {
    return false;
  }
  if (!canSelectExistingMediaForRole(input.uploadRole, input.existingRole)) {
    return false;
  }
  return input.currentMediaId === input.selectedMediaId;
}

export function isSingletonRole(uploadRole: PlatformMediaRole): boolean {
  return SINGLETON_ROLES.includes(uploadRole);
}

/** R2 CORS operator checklist — Portfolio cannot configure this in M6. */
export const PLATFORM_MEDIA_R2_CORS_REQUIREMENT = {
  methods: ["PUT", "HEAD"],
  origins: ["Portfolio admin origin (e.g. https://engineering.devlaunchsystems.com)"],
  headers: ["Content-Type", "Content-Length", "x-amz-*"],
  note:
    "Browser direct upload requires R2 bucket CORS allowing the Portfolio admin origin. Operator must configure Cloudflare R2 CORS before production media cutover.",
};
