import { ProjectSourceConfigurationError } from "@/lib/project-source/errors";

import { AdminProjectLoadError } from "./admin-project-load-error";
import {
  PlatformApiAdminMalformedResponseError,
  PlatformApiAdminNetworkError,
  PlatformApiAdminResponseError,
  ProjectWriteConfigurationError,
} from "./errors";
import { PlatformChildReorderUnavailableError } from "./platform-child-reorder-policy";
import { PlatformGalleryReorderUnavailableError } from "./platform-media-reorder-policy";
import { PlatformSlugImmutableError } from "./platform-update-errors";

export function toPlatformProjectWriteUserMessage(error: unknown): string {
  if (error instanceof PlatformChildReorderUnavailableError) {
    return error.message;
  }
  if (error instanceof PlatformGalleryReorderUnavailableError) {
    return error.message;
  }
  if (error instanceof PlatformSlugImmutableError) {
    return error.message;
  }
  if (error instanceof AdminProjectLoadError) {
    return error.message;
  }
  if (error instanceof ProjectWriteConfigurationError) {
    return error.message;
  }
  if (error instanceof ProjectSourceConfigurationError) {
    return error.message;
  }
  if (error instanceof PlatformApiAdminResponseError) {
    if (error.status === 422 && error.detail) {
      return error.detail;
    }
    if (error.status === 429) {
      return "Platform API rate limit exceeded. Try again shortly.";
    }
    return error.detail ?? error.message;
  }
  if (error instanceof PlatformApiAdminNetworkError) {
    return "Platform API request failed. Check connectivity and configuration.";
  }
  if (error instanceof PlatformApiAdminMalformedResponseError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Failed to save project to Platform API.";
}
