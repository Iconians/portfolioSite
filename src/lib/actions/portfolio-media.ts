"use server";

import { z } from "zod";

import { logAdminAction } from "@/lib/logger";
import { validateMediaUpload } from "@/lib/media/validate-upload";
import { requireAdmin } from "@/lib/permissions";
import { getProjectWriteSource } from "@/lib/project-write/config";
import { toPlatformProjectWriteUserMessage } from "@/lib/project-write/platform-action-errors";
import {
  assertPlatformGalleryReorderAllowed,
} from "@/lib/project-write/platform-media-reorder-policy";
import {
  deleteProjectMediaViaPlatform,
  listProjectMediaViaPlatform,
  presignProjectMediaViaPlatform,
  registerProjectMediaViaPlatform,
  updateProjectMediaViaPlatform,
} from "@/lib/project-write/platform-media-write";
import {
  revalidateAdminProjectPaths,
  invalidatePublicProjectCacheForPortfolioId,
} from "@/lib/project-write/public-project-cache";

import type {
  PlatformMediaPresignClientPayload,
  PlatformMediaRole,
} from "@/lib/project-write/platform-media-types";
import type { ActionResult } from "@/lib/types/actions";

const PresignInputSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  role: z.string().min(1),
  audience: z.string().optional(),
});

const RegisterInputSchema = z.object({
  storageKey: z.string().min(1),
  altText: z.string().max(500).optional(),
  caption: z.string().max(2000).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  sortOrder: z.number().int().optional(),
});

const UpdateInputSchema = z.object({
  altText: z.string().max(500).nullable().optional(),
  caption: z.string().max(2000).nullable().optional(),
  sortOrder: z.number().int().optional(),
});

async function revalidatePublicProjectMediaPaths(portfolioId: string) {
  revalidateAdminProjectPaths(portfolioId);
  await invalidatePublicProjectCacheForPortfolioId(portfolioId, "content");
}

function parseRole(role: string): PlatformMediaRole {
  if (
    role !== "hero" &&
    role !== "og" &&
    role !== "gallery" &&
    role !== "thumbnail"
  ) {
    throw new Error("Invalid Platform media role");
  }
  return role;
}

export async function presignProjectMediaAction(
  portfolioId: string,
  input: z.infer<typeof PresignInputSchema>
): Promise<ActionResult<PlatformMediaPresignClientPayload>> {
  try {
    await requireAdmin();
    if (getProjectWriteSource() !== "platform-api") {
      return {
        success: false,
        error: "Platform media presign is only available in platform-api write mode.",
      };
    }

    const parsed = PresignInputSchema.parse(input);
    validateMediaUpload({
      filename: parsed.filename,
      mimeType: parsed.mimeType,
      sizeBytes: parsed.sizeBytes,
    });

    const presign = await presignProjectMediaViaPlatform(portfolioId, {
      filename: parsed.filename,
      mime_type: parsed.mimeType,
      size_bytes: parsed.sizeBytes,
      role: parseRole(parsed.role),
      ...(parsed.audience ? { audience: parsed.audience } : {}),
    });

    return { success: true, data: presign };
  } catch (error) {
    if (getProjectWriteSource() === "platform-api") {
      return { success: false, error: toPlatformProjectWriteUserMessage(error) };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to presign media upload.",
    };
  }
}

export async function registerProjectMediaAction(
  portfolioId: string,
  input: z.infer<typeof RegisterInputSchema>
): Promise<
  ActionResult<{
    id: string;
    publicUrl: string;
    role: string;
    altText: string | null;
    filename: string;
  }>
> {
  try {
    const user = await requireAdmin();
    if (getProjectWriteSource() !== "platform-api") {
      return {
        success: false,
        error: "Platform media registration is only available in platform-api write mode.",
      };
    }

    const parsed = RegisterInputSchema.parse(input);
    const registered = await registerProjectMediaViaPlatform(portfolioId, {
      storage_key: parsed.storageKey,
      alt_text: parsed.altText?.trim() ? parsed.altText.trim() : null,
      caption: parsed.caption?.trim() ? parsed.caption.trim() : null,
      ...(parsed.width !== undefined ? { width: parsed.width } : {}),
      ...(parsed.height !== undefined ? { height: parsed.height } : {}),
      ...(parsed.sortOrder !== undefined ? { sort_order: parsed.sortOrder } : {}),
    });

    await logAdminAction(user.id, "create", "platform_media", registered.id, {
      portfolioId,
      role: registered.role,
    }).catch(() => {});

    await revalidatePublicProjectMediaPaths(portfolioId);

    return {
      success: true,
      data: {
        id: registered.id,
        publicUrl: registered.public_url,
        role: registered.role,
        altText: registered.alt_text ?? null,
        filename: registered.public_url.split("/").pop() ?? registered.id,
      },
    };
  } catch (error) {
    if (getProjectWriteSource() === "platform-api") {
      return { success: false, error: toPlatformProjectWriteUserMessage(error) };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to register media.",
    };
  }
}

export async function listProjectPlatformMediaAction(
  portfolioId: string,
  options?: { role?: PlatformMediaRole }
): Promise<
  ActionResult<
    Array<{
      id: string;
      publicUrl: string;
      filename: string;
      altText: string | null;
      role: string;
    }>
  >
> {
  try {
    await requireAdmin();
    if (getProjectWriteSource() !== "platform-api") {
      return {
        success: false,
        error: "Platform project media list is only available in platform-api write mode.",
      };
    }

    const items = await listProjectMediaViaPlatform(portfolioId, options);
    return { success: true, data: items };
  } catch (error) {
    if (getProjectWriteSource() === "platform-api") {
      return { success: false, error: toPlatformProjectWriteUserMessage(error) };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load project media.",
    };
  }
}

export async function updateProjectPlatformMediaAction(
  portfolioId: string,
  mediaId: string,
  input: z.infer<typeof UpdateInputSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireAdmin();
    if (getProjectWriteSource() !== "platform-api") {
      return {
        success: false,
        error: "Platform media update is only available in platform-api write mode.",
      };
    }

    const parsed = UpdateInputSchema.parse(input);
    if (parsed.sortOrder !== undefined) {
      assertPlatformGalleryReorderAllowed(getProjectWriteSource());
    }

    const updated = await updateProjectMediaViaPlatform(portfolioId, mediaId, {
      ...(parsed.altText !== undefined
        ? { alt_text: parsed.altText?.trim() ? parsed.altText.trim() : null }
        : {}),
      ...(parsed.caption !== undefined
        ? { caption: parsed.caption?.trim() ? parsed.caption.trim() : null }
        : {}),
      ...(parsed.sortOrder !== undefined ? { sort_order: parsed.sortOrder } : {}),
    });

    await logAdminAction(user.id, "update", "platform_media", updated.id, {
      portfolioId,
    }).catch(() => {});

    await revalidatePublicProjectMediaPaths(portfolioId);
    return { success: true, data: { id: updated.id } };
  } catch (error) {
    if (getProjectWriteSource() === "platform-api") {
      return { success: false, error: toPlatformProjectWriteUserMessage(error) };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update media.",
    };
  }
}

export async function deleteProjectPlatformMediaAction(
  portfolioId: string,
  mediaId: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAdmin();
    if (getProjectWriteSource() !== "platform-api") {
      return {
        success: false,
        error: "Platform media delete is only available in platform-api write mode.",
      };
    }

    await deleteProjectMediaViaPlatform(portfolioId, mediaId);
    await logAdminAction(user.id, "delete", "platform_media", mediaId, {
      portfolioId,
    }).catch(() => {});
    await revalidatePublicProjectMediaPaths(portfolioId);
    return { success: true, data: undefined };
  } catch (error) {
    if (getProjectWriteSource() === "platform-api") {
      return { success: false, error: toPlatformProjectWriteUserMessage(error) };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete media metadata.",
    };
  }
}

export async function reorderProjectGalleryMediaAction(
  _portfolioId: string,
  _mediaId: string,
  _direction: "up" | "down"
): Promise<ActionResult<void>> {
  try {
    await requireAdmin();
    assertPlatformGalleryReorderAllowed(getProjectWriteSource());
    return { success: false, error: "Gallery reorder is not available." };
  } catch (error) {
    if (getProjectWriteSource() === "platform-api") {
      return { success: false, error: toPlatformProjectWriteUserMessage(error) };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reorder gallery media.",
    };
  }
}
