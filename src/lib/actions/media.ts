"use server";

import { listMediaAssets } from "@/lib/data/media";
import { deleteMedia, updateMediaMetadata } from "@/lib/media/media.service";
import { logAdminAction } from "@/lib/logger";
import { requireAdmin } from "@/lib/permissions";
import type { ActionResult } from "@/lib/types/actions";
import type { MediaAsset, UpdateMediaMetadataInput } from "@/lib/types/media";
import { UpdateMediaMetadataSchema } from "@/lib/types/media";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function listMediaAssetsAction(): Promise<
  ActionResult<MediaAsset[]>
> {
  try {
    await requireAdmin();
    const assets = await listMediaAssets();
    return { success: true, data: assets };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load media library",
    };
  }
}

export async function updateMediaMetadataAction(
  id: string,
  input: UpdateMediaMetadataInput
): Promise<ActionResult<MediaAsset>> {
  try {
    const user = await requireAdmin();
    const data = UpdateMediaMetadataSchema.parse(input);
    const asset = await updateMediaMetadata(id, data);
    logAdminAction(user.id, "update", "media_asset", asset.id, {
      filename: asset.filename,
    });
    revalidatePath("/admin/media");
    return { success: true, data: asset };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((issue) => issue.message).join(", "),
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update media metadata",
    };
  }
}

export async function deleteMediaAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAdmin();
    await deleteMedia(id);
    logAdminAction(user.id, "delete", "media_asset", id);
    revalidatePath("/admin/media");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete media",
    };
  }
}
