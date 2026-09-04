import { toast } from "sonner";

import {
  presignProjectMediaAction,
  registerProjectMediaAction,
} from "@/lib/actions/portfolio-media";
import { putFileToPresignedUrl } from "@/lib/media/platform-media-upload-client";

import type { MediaPickerSelection } from "./MediaPicker";
import type { PlatformMediaRole } from "@/lib/project-write/platform-media-types";
import type { MediaAsset } from "@/lib/types/media";


export type MediaPickerAsset = MediaPickerSelection & { role?: string };

export async function uploadPlatformProjectMediaFile(input: {
  file: File;
  portfolioId: string;
  uploadRole: PlatformMediaRole;
}): Promise<MediaPickerAsset> {
  const presignResult = await presignProjectMediaAction(input.portfolioId, {
    filename: input.file.name,
    mimeType: input.file.type,
    sizeBytes: input.file.size,
    role: input.uploadRole,
  });
  if (!presignResult.success) {
    throw new Error(presignResult.error ?? "Presign failed");
  }

  await putFileToPresignedUrl({ presign: presignResult.data, file: input.file });

  const registerResult = await registerProjectMediaAction(input.portfolioId, {
    storageKey: presignResult.data.storageKey,
  });
  if (!registerResult.success) {
    throw new Error(registerResult.error ?? "Register failed");
  }

  const asset = registerResult.data;
  return {
    id: asset.id,
    publicUrl: asset.publicUrl,
    filename: asset.filename,
    altText: asset.altText,
    role: asset.role,
  };
}

export async function uploadDatabaseMediaFile(file: File): Promise<MediaPickerAsset> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/media/upload", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Upload failed");
  }

  const asset = data.asset as MediaAsset;
  return {
    id: asset.id,
    publicUrl: asset.publicUrl,
    filename: asset.filename,
    altText: asset.altText,
  };
}

export function reportMediaUploadFailure(error: unknown): void {
  toast.error(error instanceof Error ? error.message : "Upload failed");
}
